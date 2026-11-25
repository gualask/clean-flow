#!/usr/bin/env node
// Check a proposed tree against the code as it is today, without moving anything: the cycles between its modules and the uses
// against the direction of its groups, each with the elements that cause it.
// Usage: node <skill root>/scripts/tree-check.mjs <index.scip> <tree.txt> [--root <dir>] [--edges]
//   <index.scip>: a SCIP index of the code (rust-analyzer scip, scip-typescript, scip-go, scip-python, scip-java, ...).
//   <tree.txt>: the tree as assignments of today's code, paths as the index names them (relative to where the indexer ran):
//     [Shared]                                      a group; groups go from the one every group may use to the one no group uses
//     db         src/infrastructure/db              a folder or a file
//     irc        src/app/models.rs#ServerAddress    one element of a file: a type with its methods (`Type`), a function (`run()`),
//                                                   a constant (`LIMIT`), a trait impl (`impl Trait for Type`), one method
//                                                   (`Type::run()`)
//     port downloads DownloadTransport src/irc/pool.rs#impl DownloadTransport for Pool
//                                                   the module will reach that element only through the named port it owns:
//                                                   its uses of the element count the other way (the element's module depends on it)
//     The most specific assignment wins: the element, then the longest path. A line starting with `#` is a comment.
//   --root: where the source files are, when the index does not record it (used only to read Rust `impl ... for` headers).
//   --edges: also list every module edge.
// Output: tree lines that match no code (with the elements their file defines), code no line assigns, the ports and the uses each
// turns (a port that turns none is flagged), the cycles and the uses against the direction of the groups, each with the elements
// that cause it. Imports do not count: an element depends on another where it uses it. Test code (test files, and modules named
// `tests`, `test`, `test_*`, `*_test`, `*_tests`) is left out.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
let root = null; const pos = [];
let listEdges = false;
for (let i = 0; i < argv.length; i++) argv[i] === '--root' ? root = argv[++i] : argv[i] === '--edges' ? listEdges = true : pos.push(argv[i]);
if (pos.length !== 2) { console.error('usage: tree-check.mjs <index.scip> <tree.txt> [--root <dir>] [--edges]'); process.exit(2); }
const [indexPath, treePath] = pos;

// ---- SCIP (protobuf) decoding
function* fields(buf, start = 0, end = buf.length) {
  let p = start;
  const varint = () => { let r = 0n, s = 0n, b; do { b = buf[p++]; r |= BigInt(b & 0x7f) << s; s += 7n; } while (b & 0x80); return r; };
  while (p < end) {
    const key = Number(varint()), num = key >>> 3, wire = key & 7;
    if (wire === 0) yield [num, wire, Number(varint())];
    else if (wire === 2) { const len = Number(varint()); yield [num, wire, buf.subarray(p, p + len)]; p += len; }
    else if (wire === 1) { yield [num, wire, null]; p += 8; }
    else if (wire === 5) { yield [num, wire, null]; p += 4; }
    else throw new Error(`unsupported protobuf wire type ${wire}`);
  }
}
const text = b => Buffer.from(b).toString('utf8');
function ints(wire, v) {
  if (wire === 0) return [v];
  const out = []; let p = 0;
  while (p < v.length) { let r = 0, s = 0, b; do { b = v[p++]; r += (b & 0x7f) * 2 ** s; s += 7; } while (b & 0x80); out.push(r); }
  return out;
}
const range = r => r.length === 3 ? [r[0], r[1], r[0], r[2]] : r;
// The typed ranges of newer indexers (scip.proto `SingleLineRange`, `MultiLineRange`); absent fields are zero.
function typed(b, single) { const f = [0, 0, 0, 0, 0]; for (const [n, , v] of fields(b)) f[n] = v; return single ? [f[1], f[2], f[1], f[3]] : [f[1], f[2], f[3], f[4]]; }
const buf = readFileSync(indexPath);
const docs = [];
for (const [n, , v] of fields(buf)) {
  if (n === 1 && !root) for (const [m, , w] of fields(v)) if (m === 3) { try { root = fileURLToPath(text(w)); } catch {} }
  if (n !== 2) continue;
  const doc = { path: '', occ: [] };
  for (const [m, w2, w] of fields(v)) {
    if (m === 1) doc.path = text(w);
    else if (m === 2) {
      let r = [], symbol = '', roles = 0, enc = [];
      for (const [k, wk, x] of fields(w)) {
        if (k === 1) r = r.concat(ints(wk, x)); else if (k === 2) symbol = text(x);
        else if (k === 3) roles = x; else if (k === 7) enc = enc.concat(ints(wk, x));
        else if (k >= 8 && k <= 11) { const t = typed(x, k % 2 === 0); if (k <= 9) r = t; else enc = t; }
      }
      doc.occ.push({ r: range(r), symbol, def: (roles & 1) === 1, enc: enc.length ? range(enc) : null });
    }
  }
  docs.push(doc);
}

// ---- symbols: the element a symbol belongs to
function descriptors(symbol) {
  const parts = []; let i = 0, spaces = 0;
  while (spaces < 4 && i < symbol.length) { if (symbol[i] === ' ') { if (symbol[i + 1] === ' ') i++; else spaces++; } i++; }
  const s = symbol.slice(i); i = 0;
  const name = () => {
    if (s[i] === '`') { let out = ''; i++; while (i < s.length) { if (s[i] === '`') { if (s[i + 1] === '`') { out += '`'; i += 2; continue; } i++; break; } out += s[i++]; } return out; }
    const m = /^[A-Za-z0-9_+\-$]*/.exec(s.slice(i))[0]; i += m.length; return m;
  };
  while (i < s.length) {
    if (s[i] === '[') { i++; const n = name(); i++; parts.push({ n, k: 'tparam' }); continue; }
    if (s[i] === '(') { i++; const n = name(); i++; parts.push({ n, k: 'param' }); continue; }
    const n = name(), c = s[i++];
    if (c === '(') { while (i < s.length && s[i] !== ')') i++; i += 2; parts.push({ n, k: 'method' }); }
    else parts.push({ n, k: { '/': 'ns', '#': 'type', '.': 'term', ':': 'meta', '!': 'macro' }[c] ?? 'term' });
  }
  return parts;
}
const pieceCache = new Map();
function piece(symbol) {
  if (pieceCache.has(symbol)) return pieceCache.get(symbol);
  const d = descriptors(symbol); let j = d.findIndex(x => x.k !== 'ns'); let out = symbol;
  if (j >= 0) {
    const x = d[j];
    if (x.k === 'type' && x.n === 'impl' && d[j + 1]?.k === 'tparam') out = d[j + 2]?.k === 'tparam' ? `impl ${d[j + 2].n} for ${d[j + 1].n}` : d[j + 1].n;
    else out = x.n + (x.k === 'method' ? '()' : x.k === 'macro' ? '!' : '');
  }
  pieceCache.set(symbol, out); return out;
}
// One method of a type (`Type::method()`), or null.
function method(symbol) {
  const d = descriptors(symbol); const j = d.findIndex(x => x.k !== 'ns'); const x = d[j];
  if (!x || x.k !== 'type') return null;
  if (x.n === 'impl' && d[j + 1]?.k === 'tparam') return d[j + 2]?.k === 'method' ? `${d[j + 1].n}::${d[j + 2].n}()` : null;
  return d[j + 1]?.k === 'method' ? `${x.n}::${d[j + 1].n}()` : null;
}
const isTestSymbol = symbol => descriptors(symbol).some(x => x.k === 'ns' && /^(tests?|test_.*|.*_tests?)$/.test(x.n));
const isTestFile = path => /(^|\/)(tests?|__tests__|spec)\//.test(path) || /\.(test|spec)\.[^/]+$/.test(path) || /(^|\/)test_[^/]+\.py$/.test(path) || /_tests?\.[^/]+$/.test(path);
const isImplFor = symbol => /(^|\/)impl#\[(`[^`]*`|[^\]]*)\]\[/.test(symbol);

// ---- definitions and references
const defOf = new Map(); const defsIn = new Map();
for (const doc of docs) {
  const own = [];
  for (const o of doc.occ) {
    if (!o.def || o.symbol.startsWith('local ') || o.symbol.endsWith('/')) continue;
    if (!defOf.has(o.symbol)) defOf.set(o.symbol, { path: doc.path, line: o.r[0], test: isTestFile(doc.path) || isTestSymbol(o.symbol) });
    if (o.enc) own.push(o);
  }
  own.sort((a, b) => (a.enc[2] - a.enc[0]) - (b.enc[2] - b.enc[0]) || (a.enc[3] - a.enc[1]) - (b.enc[3] - b.enc[1]));
  defsIn.set(doc.path, own);
}
if (defOf.size && ![...defsIn.values()].some(own => own.length)) {
  console.error('This index gives no definition ranges (SCIP enclosing range): uses cannot be attributed to elements, so the tree cannot be checked with it.');
  process.exit(3);
}
const inside = (e, l, c) => (e[0] < l || (e[0] === l && e[1] <= c)) && (l < e[2] || (l === e[2] && c <= e[3]));
const lines = new Map();
const sourceLine = (path, l) => {
  if (!lines.has(path)) { const f = root && join(root, path); lines.set(path, f && existsSync(f) ? readFileSync(f, 'utf8').split('\n') : []); }
  return lines.get(path)[l] ?? '';
};
const refs = new Map();
for (const doc of docs) {
  const implMethods = defsIn.get(doc.path).filter(o => isImplFor(o.symbol)).sort((a, b) => a.r[0] - b.r[0]);
  for (const o of doc.occ) {
    const target = defOf.get(o.symbol);
    if (o.def || !target || target.test || o.symbol.endsWith('/')) continue;
    let owner = defsIn.get(doc.path).find(d => inside(d.enc, o.r[0], o.r[1]))?.symbol;
    if (!owner && /^\s*(unsafe\s+)?impl\b.*\bfor\b/.test(sourceLine(doc.path, o.r[0]))) owner = implMethods.find(d => d.r[0] > o.r[0])?.symbol;
    if (!owner || owner === o.symbol || defOf.get(owner)?.test || isTestFile(doc.path)) continue;
    const key = [doc.path, piece(owner), method(owner) ?? '', target.path, piece(o.symbol), method(o.symbol) ?? ''].join('\0');
    refs.set(key, (refs.get(key) ?? 0) + 1);
  }
}

// ---- the tree
const groups = []; const prefixes = new Map(); const items = new Map(); const groupOf = new Map(); const treeLines = []; const ports = new Map();
const portLines = []; const malformed = [];
let group = null;
readFileSync(treePath, 'utf8').split('\n').forEach((raw, n) => {
  const line = raw.trim();
  if (!line || line.startsWith('#')) return;
  const h = /^\[(.+)\]$/.exec(line);
  if (h) { group = h[1]; if (!groups.includes(group)) groups.push(group); return; }
  const m = /^(\S+)\s+(.+)$/.exec(line);
  if (!m) { console.log(`line ${n + 1} is neither a group nor an assignment: ${line}`); return; }
  const [, module, target] = m;
  if (module === 'port') {
    const pm = /^port\s+(\S+)\s+(\S+)\s+([^\s#]+)#(.+)$/.exec(line);
    if (!pm) { malformed.push(`line ${n + 1}: a port line is \`port <module> <Port> <path>#<element>\`: ${line}`); return; }
    const [, owner, name, path, el] = pm; const k = path + '\0' + el.trim();
    (ports.get(k) ?? ports.set(k, new Set()).get(k)).add(owner); portLines.push({ owner, name, path, el: el.trim() });
    treeLines.push({ n: n + 1, target: path + '#' + el.trim(), at: path.length }); return;
  }
  if (group === null) { group = '(no group)'; groups.push(group); }
  if (!groupOf.has(module)) groupOf.set(module, group);
  const at = target.indexOf('#');
  if (at >= 0) items.set(target.slice(0, at) + '\0' + target.slice(at + 1).trim(), module);
  else prefixes.set(target.replace(/\/+$/, ''), module);
  treeLines.push({ n: n + 1, target: target.trim(), at });
});
const ordered = [...prefixes.keys()].sort((a, b) => b.length - a.length);
const covers = (p, path) => path === p || path.startsWith(p + '/') || path.replace(/\.[^./]+$/, '') === p;
const UNASSIGNED = '(unassigned)';
const byPath = new Map();
function moduleOf(path, item, meth) {
  const exact = (meth && items.get(path + '\0' + meth)) || items.get(path + '\0' + item);
  if (exact) return exact;
  if (!byPath.has(path)) { const p = ordered.find(q => covers(q, path)); byPath.set(path, p === undefined ? UNASSIGNED : prefixes.get(p)); }
  return byPath.get(path);
}

const code = docs.filter(d => !isTestFile(d.path)).map(d => d.path);
const defined = new Set([...defOf].filter(([, d]) => !d.test).flatMap(([s, d]) => [d.path + '\0' + piece(s), ...(method(s) ? [d.path + '\0' + method(s)] : [])]));
const elementsOf = new Map();
for (const [s, d] of defOf) if (!d.test) { const set = elementsOf.get(d.path) ?? elementsOf.set(d.path, new Set()).get(d.path); set.add(piece(s)); if (method(s)) set.add(method(s)); }
const unmatched = treeLines.filter(t => t.at >= 0
  ? !defined.has(t.target.slice(0, t.at) + '\0' + t.target.slice(t.at + 1).trim())
  : !code.some(p => covers(t.target.replace(/\/+$/, ''), p)));

const edges = new Map(); const inverted = new Map();
for (const key of refs.keys()) {
  const [src, srcPiece, srcMeth, dst, piece0, dstMeth] = key.split('\0');
  const own = dstMeth && (items.has(dst + '\0' + dstMeth) || ports.has(dst + '\0' + dstMeth));
  const dstPiece = own ? dstMeth : piece0;
  let a = moduleOf(src, srcPiece, srcMeth), b = moduleOf(dst, piece0, dstMeth);
  if (a === b) continue;
  if (ports.get(dst + '\0' + dstPiece)?.has(a)) {
    const k = `${a} <- ${b}: ${dstPiece} (${dst})`; (inverted.get(k) ?? inverted.set(k, new Set()).get(k)).add(src);
    [a, b] = [b, a];
  }
  const e = edges.get(a + '\0' + b) ?? new Map(); edges.set(a + '\0' + b, e);
  const el = `${dstPiece} (${dst})`; (e.get(el) ?? e.set(el, new Set()).get(el)).add(src);
}

// strongly connected components (Tarjan)
const succ = new Map();
for (const k of edges.keys()) { const [a, b] = k.split('\0'); (succ.get(a) ?? succ.set(a, new Set()).get(a)).add(b); }
const nodes = [...new Set([...groupOf.keys(), ...[...edges.keys()].flatMap(k => k.split('\0'))])].sort();
const index = new Map(), low = new Map(), on = new Set(), stack = [], comps = [];
function visit(v) {
  index.set(v, index.size); low.set(v, index.get(v)); stack.push(v); on.add(v);
  for (const w of [...(succ.get(v) ?? [])].sort()) {
    if (!index.has(w)) { visit(w); low.set(v, Math.min(low.get(v), low.get(w))); }
    else if (on.has(w)) low.set(v, Math.min(low.get(v), index.get(w)));
  }
  if (low.get(v) === index.get(v)) { const c = []; let w; do { w = stack.pop(); on.delete(w); c.push(w); } while (w !== v); if (c.length > 1) comps.push(c.sort()); }
}
for (const v of nodes) if (!index.has(v)) visit(v);

// ---- report
const show = (a, b, limit = 8) => {
  const e = [...edges.get(a + '\0' + b)].sort((x, y) => y[1].size - x[1].size || x[0].localeCompare(y[0]));
  const out = [`  ${a} -> ${b}`];
  for (const [el, users] of e.slice(0, limit)) out.push(`    ${el}, used in ${[...users].sort().slice(0, 3).join(', ')}${users.size > 3 ? ` +${users.size - 3}` : ''}`);
  if (e.length > limit) out.push(`    +${e.length - limit} more elements`);
  return out.join('\n');
};
const unassigned = code.filter(p => moduleOf(p) === UNASSIGNED);
console.log(`Index: ${code.length} source files. Tree: ${groupOf.size} modules in ${groups.length} groups (${groups.join(' < ')}).`);
console.log(`\nTree lines that match no code: ${unmatched.length || malformed.length ? '' : 'none'}`);
for (const m of malformed) console.log(`  ${m}`);
for (const t of unmatched) {
  console.log(`  line ${t.n}: ${t.target}`);
  if (t.at < 0) continue;
  const path = t.target.slice(0, t.at), els = [...(elementsOf.get(path) ?? [])].sort();
  if (els.length) console.log(`    ${path} defines: ${els.slice(0, 40).join(', ')}${els.length > 40 ? ` +${els.length - 40}` : ''}`);
  else { const base = path.split('/').pop(); const near = code.filter(p => p.endsWith('/' + base) || p === base); console.log(`    no such file in the index${near.length ? `; files with that name: ${near.slice(0, 5).join(', ')}` : ''}`); }
}
console.log(`\nSource files no line assigns: ${unassigned.length ? unassigned.length : 'none'}`);
for (const p of unassigned.slice(0, 30)) console.log(`  ${p}`);
if (unassigned.length > 30) console.log(`  +${unassigned.length - 30} more`);
const byPort = new Map();
for (const l of portLines) { const k = `${l.name} (owned by ${l.owner})`; (byPort.get(k) ?? byPort.set(k, []).get(k)).push(l); }
console.log(`\nPorts the tree introduces: ${byPort.size ? byPort.size : 'none'}`);
for (const [k, ls] of byPort) {
  console.log(`  ${k}`);
  for (const l of ls) {
    const uses = [...inverted].filter(([x]) => x.startsWith(l.owner + ' <- ') && x.endsWith(`: ${l.el} (${l.path})`));
    console.log(`    ${l.el} (${l.path}): ${uses.length ? 'turns ' + uses.map(([x, u]) => `${x.split(':')[0]} in ${[...u].sort().join(', ')}`).join('; ') : 'TURNS NO USE: the module does not use this element'}`);
  }
}
console.log(`\nModule edges: ${edges.size}${listEdges ? ' (number of elements used)' : ' (--edges lists them)'}`);
if (listEdges) for (const k of [...edges.keys()].sort()) { const [a, b] = k.split('\0'); console.log(`  ${a} -> ${b} (${edges.get(k).size})`); }
console.log(`\nCycles: ${comps.length ? comps.length : 'none'}`);
for (const c of comps) {
  console.log(`- ${c.join(', ')}`);
  for (const k of [...edges.keys()].sort()) { const [a, b] = k.split('\0'); if (c.includes(a) && c.includes(b)) console.log(show(a, b)); }
}
const rank = m => groups.indexOf(groupOf.get(m));
const against = [...edges.keys()].sort().map(k => k.split('\0')).filter(([a, b]) => groupOf.has(a) && groupOf.has(b) && rank(a) < rank(b));
console.log(`\nUses against the direction of the groups: ${against.length ? against.length : 'none'}`);
for (const [a, b] of against) console.log(`  [${groupOf.get(a)}] uses [${groupOf.get(b)}]:\n${show(a, b)}`);

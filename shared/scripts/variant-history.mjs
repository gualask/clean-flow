#!/usr/bin/env node
// What a new variant touched: for every commit that changed one of the given variant paths, the files it changed outside them.
// Usage: node <skill root>/scripts/variant-history.mjs --repo . [--rev <rev>] [--max <n>] <variant-path>... (paths relative to the repo root)
// Output: one block per commit, newest first: hash, subject, inside count (files added inside: a variant appearing), outside count,
// outside files grouped by top-level directory. Facts only: which commit added a variant is read from the subject and the added count.
// Deterministic, git only, no language rules.
import { execFileSync } from 'node:child_process';

const argv = process.argv.slice(2);
let repo = process.cwd(), rev = 'HEAD', max = 50; const roots = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--repo') repo = argv[++i];
  else if (argv[i] === '--rev') rev = argv[++i];
  else if (argv[i] === '--max') max = Number(argv[++i]);
  else roots.push(argv[i].replace(/\/+$/, ''));
}
if (!roots.length) { console.error('usage: variant-history.mjs [--repo <dir>] [--rev <rev>] [--max <n>] <variant-path>...'); process.exit(2); }
const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 });
const inside = f => roots.some(r => f === r || f.startsWith(r + '/'));
const top = f => { const p = f.split('/'); return p.length === 1 ? '(root)' : p.length > 2 ? p.slice(0, 2).join('/') : p[0]; };

const raw = git('log', rev, `--max-count=${max}`, '--format=%x1e%h%x1f%s', '--name-only', '--', ...roots);
const commits = raw.split('\x1e').filter(Boolean).map(block => {
  const [head, ...rest] = block.split('\n'); const [hash, subject] = head.split('\x1f');
  return { hash, subject, files: rest.map(l => l.trim()).filter(Boolean) };
});
// --name-only above lists only the files under the roots; take the full change set per commit.
let total = 0;
for (const c of commits) {
  const status = git('show', '--format=', '--name-status', c.hash).split('\n').map(l => l.trim()).filter(Boolean)
    .map(l => { const [st, ...rest] = l.split('\t'); return { st: st[0], file: rest[rest.length - 1] }; });
  const all = status.map(x => x.file);
  const inFiles = all.filter(inside), outFiles = all.filter(f => !inside(f));
  const addedInside = status.filter(x => x.st === 'A' && inside(x.file)).length;
  total++;
  console.log(`${c.hash} ${c.subject}`);
  console.log(`  inside ${inFiles.length} (${addedInside} added), outside ${outFiles.length} (of ${all.length})`);
  const groups = new Map();
  for (const f of outFiles) { const t = top(f); if (!groups.has(t)) groups.set(t, []); groups.get(t).push(f); }
  for (const [t, fs] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${t === '(root)' ? t : t + '/'} (${fs.length})`); for (const f of fs) console.log(`    ${f}`);
  }
}
if (!total) console.log(`no commit under ${rev} touches ${roots.join(', ')}`);

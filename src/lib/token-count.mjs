export const DEFAULT_TOKEN_MODEL = "gpt-5.5";

export const LOCAL_MODEL_ENCODING_OVERRIDES = [
  {
    pattern: /^gpt-5\.5(?:$|-)/,
    encodingName: "o200k_base",
    reason: "temporary GPT-5.5 family override until tiktoken maps these models",
  },
  {
    pattern: /^gpt-5\.4(?:$|-)/,
    encodingName: "o200k_base",
    reason: "temporary GPT-5.4 family override until tiktoken maps these models",
  },
];

export function findLocalModelEncodingOverride(model) {
  return LOCAL_MODEL_ENCODING_OVERRIDES.find((entry) => entry.pattern.test(model)) || null;
}

export function resolveTokenEncoding({ tiktoken, modelToEncoding = {}, model, encoding }) {
  if (encoding) {
    return {
      encodingName: encoding,
      encoder: tiktoken.get_encoding(encoding),
      source: "explicit",
      note: null,
    };
  }

  try {
    return {
      encodingName: modelToEncoding[model] || "resolved-by-model",
      encoder: tiktoken.encoding_for_model(model),
      source: "model",
      note: null,
    };
  } catch (error) {
    const override = findLocalModelEncodingOverride(model);
    if (!override) {
      throw new Error(
        `tiktoken does not know model ${JSON.stringify(model)}. ` +
          "Upgrade tiktoken or pass --encoding explicitly.",
      );
    }

    return {
      encodingName: override.encodingName,
      encoder: tiktoken.get_encoding(override.encodingName),
      source: "local-override",
      note: override.reason,
    };
  }
}

export function lineCount(text) {
  if (text === "") {
    return 0;
  }
  return text.endsWith("\n") ? text.split("\n").length - 1 : text.split("\n").length;
}

export function tokenCountRow({ label, text }, encoder) {
  return {
    path: label,
    lines: lineCount(text),
    chars: text.length,
    bytes: Buffer.byteLength(text, "utf8"),
    tokens: encoder.encode(text).length,
  };
}

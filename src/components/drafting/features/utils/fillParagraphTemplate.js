export function fillParagraphTemplate(content = "", values = {}) {
  return String(content).replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
    return values[key] ?? "";
  });
}

export function parseParagraphVariables(content = "") {
  const matches = String(content).match(/{{\s*([a-zA-Z0-9_]+)\s*}}/g) || [];

  return [...new Set(matches.map((item) => item.replace(/[{}]/g, "").trim()))];
}

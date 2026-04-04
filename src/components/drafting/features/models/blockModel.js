import { BLOCK_RULES } from "../constants/blockRules";
import { BLOCK_TYPES } from "../constants/blockTypes";

function createId(prefix = "block") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDefaultContent(type, content) {
  if (content !== undefined && content !== null) {
    return content;
  }

  if (type === BLOCK_TYPES.BODY_TABLE) {
    return {
      title: "",
      hasHeaderRow: true,
      rows: [
        ["Header 1", "Header 2", "Header 3"],
        ["", "", ""],
        ["", "", ""],
      ],
      columnWidths: [160, 160, 160],
    };
  }

  return "";
}

export function createDraftBlock({
  id,
  type,
  content,
  order = 0,
  meta = {},
} = {}) {
  const rule = BLOCK_RULES[type];

  if (!rule) {
    throw new Error(`Unknown block type: ${type}`);
  }

  return {
    id: id || createId("block"),
    type,
    label: rule.label,
    zone: rule.zone,
    content: getDefaultContent(type, content),
    order,
    isRequired: rule.isRequired,
    isRemovable: rule.isRemovable,
    isRepeatable: rule.isRepeatable,
    isLockedPosition: rule.isLockedPosition,
    placeholder: rule.placeholder,
    meta,
  };
}

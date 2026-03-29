import { BLOCK_RULES } from "../constants/blockRules";

function createId(prefix = "block") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDraftBlock({
  id,
  type,
  content = "",
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
    content,
    order,
    isRequired: rule.isRequired,
    isRemovable: rule.isRemovable,
    isRepeatable: rule.isRepeatable,
    isLockedPosition: rule.isLockedPosition,
    placeholder: rule.placeholder,
    meta,
  };
}

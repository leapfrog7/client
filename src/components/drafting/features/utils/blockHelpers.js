import { BLOCK_RULES } from "../constants/blockRules";
import { BLOCK_ZONES } from "../constants/blockZones";
import { createDraftBlock } from "../models/blockModel";

export function createBlock(type, content = "", meta = {}) {
  return createDraftBlock({ type, content, meta });
}

export function normalizeBlockOrders(blocks = []) {
  return blocks.map((block, index) => ({
    ...block,
    order: index,
  }));
}

export function groupBlocksByZone(blocks = []) {
  return {
    [BLOCK_ZONES.HEADER]: blocks.filter((b) => b.zone === BLOCK_ZONES.HEADER),
    [BLOCK_ZONES.ADDRESSING]: blocks.filter(
      (b) => b.zone === BLOCK_ZONES.ADDRESSING,
    ),
    [BLOCK_ZONES.BODY]: blocks.filter((b) => b.zone === BLOCK_ZONES.BODY),
    [BLOCK_ZONES.CLOSING]: blocks.filter((b) => b.zone === BLOCK_ZONES.CLOSING),
    [BLOCK_ZONES.ROUTING]: blocks.filter((b) => b.zone === BLOCK_ZONES.ROUTING),
  };
}

export function canDeleteBlock(blocks, blockId) {
  const target = blocks.find((b) => b.id === blockId);
  if (!target) return false;
  if (!target.isRemovable) return false;

  const sameTypeCount = blocks.filter((b) => b.type === target.type).length;
  if (target.isRequired && sameTypeCount <= 1) return false;

  return true;
}

export function getInsertableBlockTypes(existingBlocks = []) {
  const existingTypes = new Set(existingBlocks.map((b) => b.type));

  return Object.entries(BLOCK_RULES)
    .filter(([, rule]) => {
      if (rule.isRepeatable) return true;
      return !existingTypes.has(
        Object.keys(BLOCK_RULES).find((key) => BLOCK_RULES[key] === rule),
      );
    })
    .map(([type, rule]) => ({
      type,
      label: rule.label,
      zone: rule.zone,
    }));
}

import { createDraftModel } from "../models/draftModel";
import { createDraftBlock } from "../models/blockModel";
import { BLOCK_TYPES } from "../constants/blockTypes";

function sanitizeContent(type, content) {
  if (type === BLOCK_TYPES.PLACE_DATE_LINE) {
    return {
      place: content?.place || "New Delhi",
      date: content?.date || "",
    };
  }

  return typeof content === "string" ? content : "";
}

export function sanitizeDraftPayload(draft) {
  const blocks = Array.isArray(draft?.blocks)
    ? draft.blocks.map((block, index) =>
        createDraftBlock({
          id: block?.id,
          type: block?.type,
          content: sanitizeContent(block?.type, block?.content),
          order: typeof block?.order === "number" ? block.order : index,
          meta: block?.meta || {},
        }),
      )
    : [];

  return createDraftModel({
    ...draft,
    blocks,
  });
}

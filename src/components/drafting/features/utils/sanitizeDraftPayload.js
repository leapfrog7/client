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

  if (type === BLOCK_TYPES.BODY_TABLE) {
    return {
      title: content?.title || "",
      hasHeaderRow: content?.hasHeaderRow ?? true,
      rows:
        Array.isArray(content?.rows) && content.rows.length
          ? content.rows.map((row) =>
              Array.isArray(row) ? row.map((cell) => String(cell ?? "")) : [],
            )
          : [
              ["Column 1", "Column 2", "Column 3"],
              ["", "", ""],
              ["", "", ""],
            ],
      columnWidths:
        Array.isArray(content?.columnWidths) && content.columnWidths.length
          ? content.columnWidths.map((w) => Math.max(80, Number(w) || 160))
          : Array.from(
              { length: Array.isArray(content?.rows)?.[0]?.length || 3 },
              () => 160,
            ),
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

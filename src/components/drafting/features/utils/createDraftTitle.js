import {
  TEMPLATE_TYPE_LABELS,
  TEMPLATE_TYPES,
} from "../constants/templateTypes";

export function createDraftTitle(type = TEMPLATE_TYPES.BLANK) {
  const label = TEMPLATE_TYPE_LABELS[type] || "Draft";
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${label} - ${formattedDate}`;
}

export const TEMPLATE_TYPES = {
  OFFICE_MEMORANDUM: "office_memorandum",
  OFFICE_ORDER: "office_order",
  LETTER: "letter",
  DO_LETTER: "do_letter",
  NOTIFICATION: "notification",
  NOTE: "note",
  BLANK: "blank",
};

export const TEMPLATE_TYPE_LABELS = {
  [TEMPLATE_TYPES.OFFICE_MEMORANDUM]: "Office Memorandum",
  [TEMPLATE_TYPES.OFFICE_ORDER]: "Office Order",
  [TEMPLATE_TYPES.LETTER]: "Letter",
  [TEMPLATE_TYPES.DO_LETTER]: "D.O. Letter",
  [TEMPLATE_TYPES.NOTIFICATION]: "Notification",
  [TEMPLATE_TYPES.NOTE]: "Note / Office Note",
  [TEMPLATE_TYPES.BLANK]: "Blank Draft",
};

export const TEMPLATE_TYPE_OPTIONS = Object.values(TEMPLATE_TYPES).map((value) => ({
  value,
  label: TEMPLATE_TYPE_LABELS[value],
}));
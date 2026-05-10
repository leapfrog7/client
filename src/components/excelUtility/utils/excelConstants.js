export const EXCEL_LIMITS = {
  MAX_DATA_ROWS: 50000,
  DEFAULT_PREVIEW_ROWS: 25,
  MAX_PREVIEW_ROWS: 200,
  TYPE_DETECTION_SAMPLE_ROWS: 200,
};

export const EXCEL_MESSAGES = {
  ROW_LIMIT_EXCEEDED:
    "This sheet has more than 50,000 rows. For browser safety, this utility currently supports up to 50,000 data rows per sheet. Please split the file or use a smaller sheet.",
  MERGE_ROW_LIMIT_EXCEEDED:
    "The merged output would exceed 50,000 rows. Please merge fewer sheets or split the workbook.",
};

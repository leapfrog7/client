import { createParagraphBankEntry } from "../models/paragraphBankModel";

export function normalizeParagraphEntry(entry = {}) {
  return createParagraphBankEntry(entry);
}

import { normalizeParagraphEntry } from "../utils/normalizeParagraphEntry";

import { STORAGE_KEYS } from "../constants/storageKeys";

const STORAGE_KEY = STORAGE_KEYS.PARAGRAPH_BANK;

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeParagraphEntry) : [];
  } catch (error) {
    console.error("Failed to read paragraph bank:", error);
    return [];
  }
}

function write(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getAllParagraphBankItems() {
  return read();
}

export function saveParagraphBankItem(item) {
  const items = read();
  const normalized = normalizeParagraphEntry(item);
  const index = items.findIndex((entry) => entry.id === normalized.id);

  if (index >= 0) {
    items[index] = { ...normalized, updatedAt: new Date().toISOString() };
  } else {
    items.unshift(normalized);
  }

  write(items);
  return normalized;
}

export function deleteParagraphBankItem(id) {
  const items = read().filter((item) => item.id !== id);
  write(items);
  return true;
}

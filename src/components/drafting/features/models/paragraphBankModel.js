export function createParagraphBankEntry(data = {}) {
  const now = new Date().toISOString();

  return {
    id:
      data.id || `para-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: data.title || "",
    category: data.category || "General",
    type: data.type || "static",
    content: data.content || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    isFavorite: Boolean(data.isFavorite),
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
}

export const storageKey = (userId, topicId) => `quiz:${userId}:${topicId}`;

export const loadState = (userId, topicId) => {
  try {
    const raw = localStorage.getItem(storageKey(userId, topicId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveState = (userId, topicId, state) => {
  try {
    localStorage.setItem(storageKey(userId, topicId), JSON.stringify(state));
  } catch (e) {
    if (typeof process !== "undefined") {
      console.warn("saveState failed:", e);
    }
  }
};

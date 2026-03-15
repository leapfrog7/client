export const EXAM_DURATION_SECONDS = 2 * 60 * 60;

export const formatRemainingTimeCompact = (remainingTime) => {
  if (remainingTime === null || remainingTime === undefined) return "N/A";

  const safe = Math.max(Number(remainingTime) || 0, 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);

  return `${hours}h ${minutes}m`;
};

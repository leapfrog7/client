export function normalizeStartAttemptResponse(responseData) {
  const root = responseData?.data || responseData || {};

  const attempt =
    root.attempt ||
    root.mockAttempt ||
    root.savedAttempt ||
    root.existingAttempt ||
    root;

  const questions =
    extractQuestions(root) ||
    extractQuestions(attempt) ||
    extractQuestions(root.mockTest) ||
    [];

  const attemptId =
    root.attemptId || root._id || attempt?.attemptId || attempt?._id || "";

  return {
    attemptId,
    attempt,
    questions,
    mockTest: root.mockTest || responseData?.mockTest || null,
  };
}

function extractQuestions(source) {
  if (!source) return null;

  if (Array.isArray(source.questions)) return source.questions;
  if (Array.isArray(source.questionList)) return source.questionList;
  if (Array.isArray(source.questionOrder)) return source.questionOrder;
  if (Array.isArray(source.mockQuestions)) return source.mockQuestions;
  if (Array.isArray(source.items)) return source.items;

  return null;
}

export function normalizeResultResponse(responseData) {
  const root = responseData?.data || responseData || {};

  return {
    attempt: root.attempt || root,
    mockTest: root.mockTest || {},
    review: Array.isArray(root.review) ? root.review : [],

    rank: root.rank ?? null,
    totalParticipants: root.totalParticipants ?? 0,
    percentile: root.percentile ?? null,
    leaderboardAvailable: Boolean(root.leaderboardAvailable),
  };
}

export function normalizeLeaderboardResponse(responseData) {
  const root = responseData?.data || responseData || {};

  const leaderboard = Array.isArray(root)
    ? root
    : Array.isArray(root.leaderboard)
      ? root.leaderboard
      : Array.isArray(root.data)
        ? root.data
        : [];

  return {
    mockTest: root.mockTest || responseData?.mockTest || null,
    leaderboard,
    summary: root.summary || responseData?.summary || null,
  };
}

export const buildSavedResponses = (answers, questions) => {
  return Object.entries(answers).flatMap(([idx, userAnswer]) => {
    const q = questions[Number(idx)];
    return q
      ? [
          {
            questionId: q._id,
            userAnswer,
            isCorrect: q.correctAnswer === userAnswer,
          },
        ]
      : [];
  });
};

export const buildSubmissionResponses = (answers, questions) => {
  return Object.entries(answers).flatMap(([idx, userAnswer]) => {
    const q = questions[Number(idx)];
    return q ? [{ questionId: q._id, userAnswer }] : [];
  });
};

export const calculateUpscStyleScoreFromSavedResponses = (responses) => {
  return responses.reduce((score, response) => {
    return score + (response.isCorrect ? 1.25 : -1 / 3);
  }, 0);
};

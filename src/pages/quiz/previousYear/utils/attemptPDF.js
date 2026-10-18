export async function downloadAttemptPDF({ questions, evaluatedResponses, score, caption, submittedAt, attemptId, assistedCount }) {
  // Browser fonts preserve Indian scripts; rendering is local and never sends content to an external service.
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ compress: true, unit: "pt", format: "a4" });
  const width = 1240, height = 1754, margin = 80, lineHeight = 32;
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("PDF rendering is unavailable.");
  let y = margin, page = 0;
  function begin() { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, width, height); ctx.fillStyle = "#172033"; ctx.textBaseline = "top"; ctx.font = "22px Arial, sans-serif"; y = margin; }
  function seal() {
    ctx.fillStyle = "#526174"; ctx.font = "17px Arial, sans-serif";
    ctx.fillText("Undersigned · Personal attempt · Page " + (page + 1), margin, height - 55);
    if (page) doc.addPage(); doc.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 595.28, 841.89); page++;
  }
  function line(text, bold = false) {
    if (y + lineHeight > height - margin) { seal(); begin(); }
    ctx.fillStyle = "#172033"; ctx.font = (bold ? "bold " : "") + "22px Arial, sans-serif";
    ctx.fillText(text, margin, y); y += lineHeight;
  }
  function paragraph(value, bold = false) {
    ctx.font = (bold ? "bold " : "") + "22px Arial, sans-serif";
    for (const paragraph of String(value ?? "").split(/\r?\n/)) {
      const words = paragraph.split(/\s+/); let row = "";
      for (const word of words) {
        if (ctx.measureText((row ? row + " " : "") + word).width <= width - 2 * margin) { row += (row ? " " : "") + word; continue; }
        if (row) { line(row, bold); row = ""; }
        let part = "";
        for (const char of word) {
          if (ctx.measureText(part + char).width > width - 2 * margin && part) { line(part, bold); part = ""; }
          part += char;
        }
        row = part;
      }
      line(row, bold);
    }
  }
  begin(); paragraph("Undersigned — PYQ attempt", true); paragraph(caption);
  paragraph("Submitted: " + new Date(submittedAt).toLocaleString() + " · Attempt: " + attemptId);
  const answered = evaluatedResponses.filter(r => r.userAnswer != null && r.userAnswer !== ""), correct = answered.filter(r => r.isCorrect).length;
  paragraph("Score: " + Number(score).toFixed(2) + " · Correct: " + correct + " · Wrong: " + (answered.length - correct) + " · Unanswered: " + (questions.length - answered.length));
  paragraph("Accuracy: " + (answered.length ? Math.round(correct / answered.length * 100) : 0) + "% · Answers revealed: " + assistedCount);
  paragraph("Contains all " + questions.length + " questions in this submitted attempt.");
  const answers = new Map(evaluatedResponses.map(r => [String(r.questionId), r]));
  for (const [i, q] of questions.entries()) {
    if (i && i % 5 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    y += 18; paragraph("Q" + (i + 1) + ". " + q.questionText, true);
    if (q.year || q.topicCategory) paragraph([q.year, q.topicCategory].filter(Boolean).join(" · "));
    for (const [index, option] of q.options.entries()) paragraph(String.fromCharCode(65 + index) + ". " + option);
    const response = answers.get(String(q._id)); paragraph("Your answer: " + (response?.userAnswer || "Unanswered"));
    paragraph("Correct answer: " + (response?.correctAnswer ?? q.correctAnswer), true);
  }
  seal(); doc.save("Undersigned-PYQ-" + attemptId + ".pdf");
}

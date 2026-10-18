import PropTypes from "prop-types";
import usePYQAttempt from "../hooks/usePYQAttempt";
import Results from "../Results";
import Question from "../Question";
import QuestionGrid from "./QuestionGrid";
import { pyq, newRequestKey, messageFor } from "../pyqApi";
import { useState } from "react";
export default function PYQAttemptView({ id, onExit, onOpen }) {
  const session = usePYQAttempt(id), [actionError, setActionError] = useState("");
  const { attempt: a, local, loading, error, busy, saveStatus, remaining, change, send, load } = session;
  async function retrySubset(retry) {
    try { const next = await pyq.post("/attempts", { requestKey: newRequestKey(), sourceAttemptId: id, retry }); onOpen(next); }
    catch (e) { setActionError(messageFor(e)); }
  }
  if (loading) return <p className="p-6">Loading saved attempt...</p>;
  if (!a) return <div role="alert" className="p-6">{error}<button className="ml-3 underline" onClick={load}>Retry attempt</button><button className="ml-3 underline" onClick={onExit}>Back to selection</button></div>;
  const caption = [a.paperType, a.topic || "Full paper", a.years.join(", ")].join(" · ");
  if (a.status === "submitted") return <div>
    {actionError && <p role="alert">{actionError}</p>}
    {a.result.latePayloadIgnored && <p role="status" className="p-3">The final request arrived after time ended. Your previously saved answers were submitted.</p>}
    <Results questions={a.questions} evaluatedResponses={a.result.evaluatedResponses} score={a.result.score}
      remainingTime={a.result.remainingTime} usedSeconds={a.result.usedSeconds} durationSeconds={a.durationSeconds}
      contextCaption={caption} submittedAt={a.submittedAt} assistedCount={a.revealed.length} attemptId={a._id}
      resultKind={a.kind} exportPath={"/attempts/" + a._id + "/export"} onGoHome={onExit}
      onRetryWrong={a.result.wrong ? () => retrySubset("wrong") : undefined}
      onRetryUnanswered={a.result.unanswered ? () => retrySubset("unanswered") : undefined} />
  </div>;
  if (a.status !== "active") return <div className="p-6">This unfinished attempt was reset. <button onClick={onExit}>Back to selection</button></div>;
  const q = a.questions[local.index], qid = String(q._id), locked = (!!busy && busy !== "save") || local.pendingSubmit || session.conflict;
  return <div className="mx-auto max-w-6xl space-y-5 p-3 sm:p-6">
    <header className="rounded-xl bg-sky-50 p-4">
      <h1 className="text-xl font-semibold">{caption}</h1>
      <p className="mt-2 text-sm">Practice attempt · {a.questions.length} questions · {local.revealed.length} answers revealed</p>
      {remaining !== null && <p role="timer" className="mt-2 font-mono">Time remaining: {Math.floor(remaining / 3600)}:{String(Math.floor(remaining / 60) % 60).padStart(2, "0")}:{String(Math.floor(remaining) % 60).padStart(2, "0")}</p>}
      <p role="status" className="mt-2 text-sm">{saveStatus}</p>
      <p className="text-xs text-slate-600">Save and exit pauses practice. Leaving without saving keeps a full-paper timer running.</p>
    </header>
    {(error || actionError) && <div role="alert" className="rounded-lg border border-red-300 p-3">{error || actionError}
      {session.conflict ? <button className="ml-3 underline" onClick={load}>Load saved version</button> :
        <button className="ml-3 underline" disabled={!!busy} onClick={() => send(local.pendingSubmit ? "submit" : "save").catch(() => {})}>{local.pendingSubmit ? "Retry submission" : "Retry save"}</button>}
    </div>}
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <p className="mb-2 text-sm text-slate-600">Question {local.index + 1} / {a.questions.length} · {q.year} · {q.topicCategory}</p>
        <fieldset disabled={!!locked} className="min-w-0">
          <Question question={q.questionText} options={q.options} selectedOption={local.answers[qid]}
            onSelectOption={option => change({ answers: { ...local.answers, [qid]: option } })} />
          <div className="my-4 flex flex-wrap gap-3">
            <button className="rounded-lg border px-4 py-2" disabled={local.index === 0} onClick={() => change({ index: local.index - 1 })}>Previous</button>
            <button className="rounded-lg border px-4 py-2" disabled={local.index === a.questions.length - 1} onClick={() => change({ index: local.index + 1 })}>Next</button>
            <button className="rounded-lg border px-4 py-2" onClick={() => { const answers = { ...local.answers }; delete answers[qid]; change({ answers }); }}>Clear answer</button>
            <button className="rounded-lg border px-4 py-2" onClick={() => change({ revealed: [...new Set([...local.revealed, qid])] })}>Show Answer</button>
          </div>
          {local.revealed.includes(qid) && <div className="my-3 rounded-lg bg-green-50 p-4">
            <p>Correct Answer: <strong>{q.correctAnswer}</strong></p>{q.explanation && <p className="mt-2 whitespace-pre-line">Explanation: {q.explanation}</p>}
            <p className="mt-2 text-xs">This question is recorded as revealed in your practice result.</p>
          </div>}
        </fieldset>
        <div className="mt-5 flex flex-wrap gap-3">
          <button disabled={!!busy || !!locked} className="rounded-lg bg-emerald-700 px-4 py-2 text-white disabled:opacity-50"
            onClick={async () => { try { if (await send("pause")) onExit(); } catch { /* The attempt stays visible for retry. */ } }}>Save and exit</button>
          <button disabled={!!busy || !!locked} className="rounded-lg bg-indigo-700 px-4 py-2 text-white disabled:opacity-50"
            onClick={() => { const unanswered = a.questions.length - Object.keys(local.answers).length;
              if (window.confirm("Submit this attempt? " + unanswered + " questions are unanswered.")) send("submit").catch(() => {}); }}>Submit Quiz</button>
        </div>
      </section>
      <fieldset disabled={!!locked} className="min-w-0"><QuestionGrid questions={a.questions} answers={Object.fromEntries(a.questions.map((item, i) => [i, local.answers[String(item._id)]]).filter(([, answer]) => answer != null))}
        currentQuestionIndex={local.index} onSelectQuestion={index => change({ index })} /></fieldset>
    </div>
  </div>;
}
PYQAttemptView.propTypes = { id: PropTypes.string.isRequired, onExit: PropTypes.func.isRequired, onOpen: PropTypes.func.isRequired };

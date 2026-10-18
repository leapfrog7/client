import { useNavigate, useSearchParams } from "react-router-dom";
import { attemptQuery } from "./pyqApi";
import PYQAttemptView from "./components/PYQAttemptView";
export default function TopicwisePYQQuiz() {
  const [search] = useSearchParams(), navigate = useNavigate(), id = search.get("attempt");
  const back = () => { const next = new URLSearchParams(search); next.delete("attempt"); navigate("/pages/quiz/pyq/topic" + (next.size ? "?" + next : "")); };
  if (!id) return <div className="p-6"><p>Select a topic to start a saved practice attempt.</p><button className="mt-3 underline" onClick={back}>Back to Topic Selection</button></div>;
  return <PYQAttemptView key={id} id={id} onExit={back} onOpen={a => navigate("?" + attemptQuery(a))} />;
}

import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "../../components/AxiosInstance";
import { currentToken } from "../../auth/session";
const button =
  "min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50";
export default function PYQYearVisibility({ year, onYearsLoaded }) {
  const [years, setYears] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [confirm, setConfirm] = useState(null),
    [notice, setNotice] = useState(null);
  const alive = useRef(false),
    controller = useRef(null),
    sequence = useRef(0);
  const token = currentToken();
  const load = useCallback(async () => {
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    const seq = ++sequence.current;
    setYears(null);
    setError("");
    setConfirm(null);
    try {
      const { data } = await axios.get("/prevYearManagement/visibility", {
        signal: abort.signal,
        timeout: 15000,
      });
      if (
        !alive.current ||
        abort.signal.aborted ||
        seq !== sequence.current ||
        currentToken() !== token
      )
        return;
      if (
        !Array.isArray(data.years) ||
        data.years.some(
          (y) => typeof y.year !== "string" || typeof y.visible !== "boolean",
        )
      )
        throw Error("Invalid visibility response");
      setYears(data.years);
      onYearsLoaded(data.years.map((y) => y.year));
    } catch (e) {
      if (alive.current && !abort.signal.aborted && seq === sequence.current)
        setError(
          e.response?.data?.message ||
            "Could not load student visibility. Please retry.",
        );
    }
  }, [token, onYearsLoaded]);
  useEffect(() => {
    alive.current = true;
    load();
    return () => {
      alive.current = false;
      controller.current?.abort();
    };
  }, [load]);
  useEffect(() => setConfirm(null), [year]);
  const selected = years?.find((y) => y.year === year);
  async function save() {
    if (busy || !selected || confirm !== year) return;
    const target = year,
      visible = !selected.visible;
    setBusy(true);
    setError("");
    try {
      const { data } = await axios.patch(
        "/prevYearManagement/visibility/" + encodeURIComponent(target),
        { visible },
        { timeout: 15000 },
      );
      if (!alive.current || currentToken() !== token) return;
      if (data.year !== target || data.visible !== visible)
        throw Error("Unconfirmed visibility");
      setYears((previous) =>
        previous?.map((y) => (y.year === target ? { ...y, ...data } : y)),
      );
      setNotice({
        year: target,
        message: visible
          ? "This year is now available to students."
          : "This year is hidden from new practice. Saved work is kept.",
      });
      setConfirm(null);
    } catch (e) {
      if (alive.current && currentToken() === token) {
        setYears(null);
        setConfirm(null);
        setError(
          e.response?.data?.message ||
            "Visibility change could not be confirmed. Reload visibility before retrying.",
        );
      }
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <section
      aria-label="PYQ year visibility"
      className="mb-6 mt-4 min-w-0 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 sm:p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold text-slate-900">
            Student visibility · LDCE {year}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Applies to both papers and topicwise PYQs. Existing attempts and
            saved results are kept.
          </p>
          {selected && (
            <p role="status" className="mt-2 text-sm font-semibold">
              {selected.visible
                ? "Visible to students"
                : "Hidden from students"}
              {selected.defaultHidden ? " · Answer key awaited" : ""}
            </p>
          )}
        </div>
        {selected && confirm !== year && (
          <button
            type="button"
            disabled={busy}
            className={button + " border-indigo-300 bg-white text-indigo-800"}
            onClick={() => {
              setNotice(null);
              setConfirm(year);
            }}
          >
            {selected.visible ? "Hide this year" : "Show this year"}
          </button>
        )}
      </div>
      {!years && !error && (
        <p role="status" className="mt-2 text-sm">
          Checking student visibility...
        </p>
      )}
      {confirm === year && selected && (
        <div className="mt-3 rounded-lg border bg-white p-3">
          <p className="text-sm">
            {selected.visible
              ? "Hide LDCE " + year + " from new practice?"
              : "Show LDCE " +
                year +
                " to students? Ensure the official answer key and answers are ready."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              className={button + " border-indigo-700 bg-indigo-700 text-white"}
              onClick={save}
            >
              {busy
                ? "Saving..."
                : selected.visible
                  ? "Confirm hide"
                  : "Confirm show"}
            </button>
            <button
              type="button"
              disabled={busy}
              className={button + " bg-white"}
              onClick={() => setConfirm(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-800">
          {error}{" "}
          <button
            type="button"
            className={button + " mt-2 bg-white"}
            onClick={load}
          >
            Reload visibility
          </button>
        </p>
      )}
      {notice?.year === year && !error && (
        <p role="status" className="mt-2 text-sm text-indigo-900">
          {notice.message}
        </p>
      )}
    </section>
  );
}
PYQYearVisibility.propTypes = {
  year: PropTypes.string.isRequired,
  onYearsLoaded: PropTypes.func.isRequired,
};

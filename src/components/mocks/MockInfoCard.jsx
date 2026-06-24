import PropTypes from "prop-types";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaClipboardList,
  //   FaRandom,
  FaRedo,
  FaTimesCircle,
} from "react-icons/fa";

import MockStatusBadge from "./MockStatusBadge";
import { formatDateTime } from "../../pages/Admin/mocks/mockFormatters";

function MockInfoCard({ mockTest }) {
  if (!mockTest) return null;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-5 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black leading-tight text-slate-950 sm:text-xl">
                {mockTest.title || "Mock Test"}
              </h2>

              <MockStatusBadge status={mockTest.computedStatus} />
            </div>

            <p className="mt-1 text-xs md:text-sm leading-6 text-slate-500">
              {mockTest.examName || "LDCE SO/PS conducted by UPSC"}
            </p>
          </div>
        </div>

        {mockTest.description ? (
          <p className="mt-2 md:mt-4 text-sm leading-6 text-slate-600">
            {mockTest.description}
          </p>
        ) : null}
      </div>

      <div className="p-2">
        <div className="grid gap-2 grid-cols-2 xl:grid-cols-3">
          <InfoItem
            icon={<FaCalendarAlt />}
            label="Starts"
            value={formatDateTime(mockTest.startAt)}
          />

          <InfoItem
            icon={<FaCalendarAlt />}
            label="Ends"
            value={formatDateTime(mockTest.endAt)}
          />

          <InfoItem
            icon={<FaClock />}
            label="Duration"
            value={`${mockTest.durationMinutes || 30} minutes`}
          />

          <InfoItem
            icon={<FaClipboardList />}
            label="Questions"
            value={`${mockTest.totalQuestions || 40}`}
          />
          {/* <ScoreItem
            label="Correct"
            value={`+${mockTest.correctMarks ?? 1.25}`}
            tone="positive"
          />

          <ScoreItem
            label="Wrong"
            value={`-${mockTest.negativeMarks ?? 0.4166667}`}
            tone="negative"
          />

          <ScoreItem label="Unattempted" value="0" tone="neutral" /> */}
          <BooleanInfoItem
            icon={<FaRedo />}
            label="Resume allowed"
            value={Boolean(mockTest.allowResume)}
          />

          {/* <BooleanInfoItem
            icon={<FaRandom />}
            label="Question shuffle"
            value={Boolean(mockTest.shuffleQuestions)}
          /> */}
        </div>
      </div>
    </article>
  );
}

MockInfoCard.propTypes = {
  mockTest: PropTypes.shape({
    title: PropTypes.string,
    examName: PropTypes.string,
    description: PropTypes.string,
    computedStatus: PropTypes.string,
    startAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    endAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    durationMinutes: PropTypes.number,
    totalQuestions: PropTypes.number,
    correctMarks: PropTypes.number,
    negativeMarks: PropTypes.number,
    allowResume: PropTypes.bool,
    shuffleQuestions: PropTypes.bool,
  }),
};

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-bold leading-5 text-slate-950">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

InfoItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

function ScoreItem({ label, value, tone }) {
  const toneClasses = {
    positive: "border-teal-200 bg-teal-50 text-teal-800",
    negative: "border-red-200 bg-red-50 text-red-800",
    neutral: "border-slate-200 bg-slate-50 text-slate-800",
  };

  return (
    <div
      className={[
        "rounded-2xl border px-4 py-3",
        toneClasses[tone] || toneClasses.neutral,
      ].join(" ")}
    >
      <p className="text-[11px] font-bold uppercase tracking-wide opacity-75">
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

ScoreItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tone: PropTypes.oneOf(["positive", "negative", "neutral"]).isRequired,
};

function BooleanInfoItem({ icon, label, value }) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-2xl border px-4 py-3",
        value
          ? "border-teal-200 bg-teal-50 text-teal-800"
          : "border-slate-200 bg-slate-50 text-slate-700",
      ].join(" ")}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide opacity-75">
          {label}
        </p>
        <p className="mt-1 text-sm font-black">{value ? "Yes" : "No"}</p>
      </div>

      {value ? (
        <FaCheckCircle className="shrink-0 text-teal-700" />
      ) : (
        <FaTimesCircle className="shrink-0 text-slate-400" />
      )}
    </div>
  );
}

BooleanInfoItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
};

export default MockInfoCard;

import PropTypes from "prop-types";

PreviewStyleCard.propTypes = {
  preferences: PropTypes.object.isRequired,
};

export default function PreviewStyleCard({ preferences }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Live preview</h3>

      <div
        className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-800"
        style={{
          fontFamily: preferences.fontFamily,
          fontSize: `${preferences.fontSize}px`,
          lineHeight: preferences.lineSpacing,
        }}
      >
        <div className="font-semibold">
          Subject: Sample official communication
        </div>
        <p style={{ marginTop: `${preferences.paragraphSpacing}px` }}>
          This preview helps you understand how your drafting preferences will
          appear in the workspace.
        </p>
        <p style={{ marginTop: `${preferences.paragraphSpacing}px` }}>
          Choose a combination that feels readable, official, and comfortable
          for regular office drafting.
        </p>
      </div>
    </div>
  );
}

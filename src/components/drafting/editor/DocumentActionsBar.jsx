import PropTypes from "prop-types";
import { FaRegEye, FaRegFilePdf, FaRegCopy, FaPrint } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

DocumentActionsBar.propTypes = {
  onPreview: PropTypes.func.isRequired,
  onCopyForWord: PropTypes.func.isRequired,
  onDownloadDocx: PropTypes.func.isRequired,
  onDownloadPdf: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};

function ActionButton({ icon, label, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        primary
          ? "bg-slate-900 text-white hover:bg-slate-800"
          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

ActionButton.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  primary: PropTypes.bool,
};

export default function DocumentActionsBar({
  onPreview,
  onCopyForWord,
  onDownloadDocx,
  onDownloadPdf,
  onPrint,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <div className="hidden">
          <ActionButton
            icon={<FaRegEye />}
            label="Preview"
            onClick={onPreview}
            primary
          />
        </div>

        <ActionButton
          icon={<FaRegCopy />}
          label="Copy Text"
          onClick={onCopyForWord}
        />

        <ActionButton
          icon={<FiFileText />}
          label="Download DOCX"
          onClick={onDownloadDocx}
        />
        <div className="hidden">
          <ActionButton
            icon={<FaRegFilePdf />}
            label="Download PDF"
            onClick={onDownloadPdf}
          />
        </div>

        <ActionButton icon={<FaPrint />} label="Print" onClick={onPrint} />
      </div>
    </div>
  );
}

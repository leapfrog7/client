import PropTypes from "prop-types";
import { FaRegEye, FaFileCirclePlus } from "react-icons/fa6";

TemplateCard.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    blocks: PropTypes.array,
  }).isRequired,
  onPreview: PropTypes.func.isRequired,
  onUseTemplate: PropTypes.func.isRequired,
};

export default function TemplateCard({ template, onPreview, onUseTemplate }) {
  const blockCount = Array.isArray(template.blocks)
    ? template.blocks.length
    : 0;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900">
            {template.name}
          </h3>

          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            {blockCount} block{blockCount === 1 ? "" : "s"}
          </span>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {template.description || "No description available."}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <FaRegEye className="text-sm" />
          Preview
        </button>

        <button
          type="button"
          onClick={() => onUseTemplate(template)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <FaFileCirclePlus className="text-sm" />
          Use template
        </button>
      </div>
    </div>
  );
}

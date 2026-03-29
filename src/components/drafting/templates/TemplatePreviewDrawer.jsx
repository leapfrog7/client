import PropTypes from "prop-types";
import {
  FaRegFileLines,
  FaLayerGroup,
  FaCircleCheck,
  FaGripLines,
} from "react-icons/fa6";
import { BLOCK_RULES } from "../features/constants/blockRules";

TemplatePreviewDrawer.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    blockSequence: PropTypes.arrayOf(PropTypes.string),
    blockOverrides: PropTypes.object,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUseTemplate: PropTypes.func.isRequired,
};

const ZONE_LABELS = {
  header: "Header",
  addressing: "Addressing",
  body: "Body",
  closing: "Closing",
  routing: "Routing",
};

function buildPreviewBlocks(template) {
  const sequence = Array.isArray(template?.blockSequence)
    ? template.blockSequence
    : [];

  return sequence.map((blockType, index) => {
    const rule = BLOCK_RULES[blockType] || {};

    const overrideText =
      template?.blockOverrides && template.blockOverrides[blockType];

    return {
      key: `${blockType}-${index}`,
      type: blockType,
      label: rule.label || blockType,
      zone: rule.zone || "body",
      required: Boolean(rule.isRequired),
      locked: Boolean(rule.isLockedPosition),
      removable: Boolean(rule.isRemovable),
      placeholder:
        overrideText || rule.placeholder || "No preview text available",
    };
  });
}

function groupBlocksByZone(blocks) {
  return blocks.reduce((acc, block) => {
    const zone = block.zone || "body";
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(block);
    return acc;
  }, {});
}

export default function TemplatePreviewDrawer({
  template,
  open,
  onClose,
  onUseTemplate,
}) {
  if (!open || !template) return null;

  const previewBlocks = buildPreviewBlocks(template);
  const groupedBlocks = groupBlocksByZone(previewBlocks);
  const hasBlocks = previewBlocks.length > 0;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/35 backdrop-blur-[1px]">
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <FaRegFileLines className="text-sm" />
              </span>

              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-900">
                  {template.name || "Untitled template"}
                </h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  Structure preview
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm leading-6 text-slate-600">
              {template.description ||
                "No description available for this template."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Template type
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                {template.name || "Untitled"}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total blocks
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                {previewBlocks.length}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Zones used
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                {Object.keys(groupedBlocks).length}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <FaLayerGroup className="text-sm" />
              </span>
              <h4 className="text-sm font-semibold text-slate-900">
                Template structure
              </h4>
            </div>

            {hasBlocks ? (
              <div className="space-y-5">
                {Object.entries(groupedBlocks).map(([zone, blocks]) => (
                  <section key={zone}>
                    <div className="mb-2 flex items-center justify-between">
                      <h5 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {ZONE_LABELS[zone] || zone}
                      </h5>
                      <span className="text-xs text-slate-400">
                        {blocks.length} block{blocks.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {blocks.map((block, idx) => (
                        <div
                          key={block.key}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                              <FaGripLines className="text-xs" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="text-sm font-semibold text-slate-900">
                                  {block.label}
                                </div>

                                {block.required ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                                    <FaCircleCheck className="text-[10px]" />
                                    Required
                                  </span>
                                ) : null}

                                {block.locked ? (
                                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                                    Fixed position
                                  </span>
                                ) : null}
                              </div>

                              <div className="mt-1 text-xs text-slate-500">
                                Type: {block.type}
                              </div>

                              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                  {block.placeholder}
                                </p>
                              </div>
                            </div>

                            <div className="text-xs font-medium text-slate-400">
                              {idx + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5">
                <p className="text-sm text-slate-500">
                  No template structure is available for this template.
                </p>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 pt-4 backdrop-blur">
            <button
              type="button"
              onClick={() => onUseTemplate(template)}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Start with this template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { MdClose, MdDeleteOutline, MdOutlineCalculate } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const FACILITY_LABELS = {
  SS: "Super Speciality",
  NABH: "NABH",
  NON_NABH: "Non-NABH",
};

const WARD_LABELS = {
  PRIVATE: "Private",
  SEMI_PRIVATE: "Semi-Private",
  GENERAL: "General",
};

const TIER_LABELS = {
  TIER_I: "Tier I",
  TIER_II: "Tier II",
  TIER_III: "Tier III",
};

const CghsCostEstimate = ({ items, onRemove, onClear }) => {
  const [open, setOpen] = useState(false);

  const numericItems = useMemo(
    () => items.filter((item) => Number.isFinite(Number(item.amount))),
    [items],
  );

  const nonNumericItems = useMemo(
    () => items.filter((item) => !Number.isFinite(Number(item.amount))),
    [items],
  );

  const total = useMemo(
    () => numericItems.reduce((sum, item) => sum + Number(item.amount), 0),
    [numericItems],
  );

  if (!items.length) return null;

  const shareOnWhatsApp = () => {
    const lines = [
      "CGHS Cost Estimate",
      "",
      ...items.flatMap((item, index) => {
        const rate = Number.isFinite(Number(item.amount))
          ? `₹${Number(item.amount).toLocaleString("en-IN")}`
          : item.raw || "Rate not numerically specified";

        return [
          `${index + 1}. ${item.name}`,
          `CGHS Code: ${item.cghsCode}`,
          `${TIER_LABELS[item.tier] || item.tier} · ${
            FACILITY_LABELS[item.facility] || item.facility
          } · ${WARD_LABELS[item.ward] || item.ward}`,
          `Rate: ${rate}`,
          "",
        ];
      }),
      `Estimated Total: ₹${total.toLocaleString("en-IN")}`,
    ];

    if (nonNumericItems.length) {
      lines.push(
        `${nonNumericItems.length} item${
          nonNumericItems.length > 1 ? "s have" : " has"
        } no numeric rate and ${
          nonNumericItems.length > 1 ? "are" : "is"
        } not included in the total.`,
      );
    }

    lines.push(
      "",
      "Checked using CGHS Rates on UnderSigned.",
      "Rates are indicative and subject to applicable CGHS rules and conditions.",
    );

    const text = lines.join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      {/* Sticky mobile-friendly estimate bar */}
      <div className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1rem)] max-w-xl -translate-x-1/2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-blue-200 bg-white px-4 py-3 shadow-lg"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <MdOutlineCalculate size={20} />
            </div>

            <div className="min-w-0 text-left">
              <p className="text-xs text-gray-500">Cost Estimate</p>

              <p className="truncate text-sm font-semibold text-gray-800">
                {items.length} {items.length === 1 ? "item" : "items"} · ₹
                {total.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <span className="shrink-0 text-sm font-medium text-blue-700">
            View
          </span>
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center">
          <div className="max-h-[85vh] w-full overflow-hidden rounded-t-2xl bg-white shadow-xl md:max-w-xl md:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <h2 className="font-semibold text-gray-900">
                  CGHS Cost Estimate
                </h2>

                <p className="text-xs text-gray-500">
                  {items.length} selected{" "}
                  {items.length === 1 ? "item" : "items"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close estimate"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="max-h-[55vh] overflow-y-auto px-3 py-3">
              <div className="space-y-2">
                {items.map((item) => {
                  const hasNumericAmount = Number.isFinite(Number(item.amount));

                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border border-gray-200 bg-white p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-blue-900">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {item.cghsCode} ·{" "}
                            {TIER_LABELS[item.tier] || item.tier}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {FACILITY_LABELS[item.facility] || item.facility} ·{" "}
                            {WARD_LABELS[item.ward] || item.ward}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {hasNumericAmount
                              ? `₹${Number(item.amount).toLocaleString(
                                  "en-IN",
                                )}`
                              : item.raw || "—"}
                          </p>

                          <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className="mt-2 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                          >
                            <MdDeleteOutline size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total and actions */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500">Estimated Total</p>

                  <p className="text-2xl font-bold text-gray-900">
                    ₹{total.toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  Clear all
                </button>
              </div>

              {nonNumericItems.length > 0 && (
                <p className="mt-2 text-xs text-amber-700">
                  {nonNumericItems.length}{" "}
                  {nonNumericItems.length === 1 ? "item has" : "items have"} no
                  numeric rate and {nonNumericItems.length === 1 ? "is" : "are"}{" "}
                  not included in the total.
                </p>
              )}

              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                <FaWhatsapp size={19} />
                Share Estimate on WhatsApp
              </button>

              <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-500">
                This is an indicative estimate based on the selected CGHS rates.
                Actual admissible or billed amounts may depend on applicable
                rules and package conditions.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CghsCostEstimate.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      cghsCode: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      tier: PropTypes.string.isRequired,
      facility: PropTypes.string.isRequired,
      ward: PropTypes.string.isRequired,
      amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      raw: PropTypes.string,
    }),
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default CghsCostEstimate;

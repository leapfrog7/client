import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "../utils/formatDate";
import { PortableText } from "@portabletext/react";
import { FaTimes, FaExternalLinkAlt } from "react-icons/fa";

const typeLabel = (type) => {
  if (!type) return "Misc";
  if (type === "GovtScheme") return "Govt Scheme";
  return type;
};

const typePillClass = (type) => {
  const t = (type || "Misc").toLowerCase();
  if (t.includes("pib")) return "bg-blue-50 text-blue-800 border-blue-200";
  if (t.includes("govt"))
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  return "bg-gray-50 text-gray-800 border-gray-200";
};

// Basic PortableText renderers (safe minimal)
const portableComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-sm md:text-base text-gray-800 leading-6 md:leading-7 mb-3">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="text-base md:text-lg font-bold text-gray-900 mt-5 mb-2">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-sm md:text-base font-semibold text-gray-900 mt-4 mb-2">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-700 my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-gray-800 mb-3">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-1 text-sm md:text-base text-gray-800 mb-3">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-6">{children}</li>,
    number: ({ children }) => <li className="leading-6">{children}</li>,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="text-blue-700 font-semibold underline underline-offset-2 hover:text-blue-800"
      >
        {children}
      </a>
    ),
  },
};

const AffairModal = ({ open, item, onClose }) => {
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  }, []);

  // Lock background scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!item) return null;

  const subtitle =
    `${typeLabel(item.type)} • ${item.date ? formatDate(item.date) : ""}`.trim();

  // Motion variants
  const backdrop = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.18 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const panelMobile = {
    hidden: { y: 40, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 380, damping: 34 },
    },
    exit: { y: 40, opacity: 0, transition: { duration: 0.18 } },
  };

  const panelDesktop = {
    hidden: { y: 12, scale: 0.98, opacity: 0 },
    show: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 420, damping: 30 },
    },
    exit: { y: 10, scale: 0.98, opacity: 0, transition: { duration: 0.15 } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-2 md:p-6"
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            variants={backdrop}
          />

          {/* Panel */}
          <motion.div
            className={[
              "relative w-full overflow-hidden bg-white shadow-2xl",
              "md:max-w-3xl md:rounded-2xl",
              "rounded-t-3xl md:rounded-2xl",
              // ✅ Mobile: don't reach the very top (address bar / notch safe)
              "max-h-[calc(100dvh-72px-env(safe-area-inset-top))] md:max-h-none",
            ].join(" ")}
            variants={isMobile ? panelMobile : panelDesktop}
            drag={isMobile ? "y" : false}
            dragConstraints={isMobile ? { top: 0, bottom: 120 } : undefined}
            dragElastic={isMobile ? 0.12 : undefined}
            onDragEnd={(e, info) => {
              if (!isMobile) return;
              if (info.offset.y > 90 || info.velocity.y > 800) onClose();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle (mobile) */}
            <div className="md:hidden w-full flex justify-center pt-2">
              <div className="h-1.5 w-12 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-200 backdrop-blur border-b">
              <div className="p-4 md:p-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${typePillClass(
                        item.type,
                      )}`}
                    >
                      {typeLabel(item.type)}
                    </span>

                    {item.date ? (
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
                        {formatDate(item.date)}
                      </span>
                    ) : null}

                    {item.priority ? (
                      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                        Priority: {item.priority}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-2 text-lg md:text-2xl font-extrabold text-gray-900 leading-snug break-words">
                    {item.title}
                  </h2>

                  {subtitle ? (
                    <p className="mt-1 text-xs md:text-sm text-gray-500">
                      {/* kept for future */}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition"
                  aria-label="Close"
                >
                  <span className="hidden md:inline">Close</span>
                  <span className="md:hidden inline-flex items-center justify-center">
                    <FaTimes />
                  </span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(100dvh-220px-env(safe-area-inset-top))] md:max-h-[78vh]">
              {/* Preferred content: Portable Text rich editor */}
              {Array.isArray(item.content) && item.content.length > 0 ? (
                <div className="prose prose-sm md:prose-base max-w-none">
                  <PortableText
                    value={item.content}
                    components={portableComponents}
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2">
                    Key Points
                  </h3>
                  <ul className="list-disc pl-5 text-sm md:text-base text-gray-800 space-y-1">
                    {(item.keyPoints || []).map((p, idx) => (
                      <li key={`${item._id || "item"}-kp-${idx}`}>{p}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Sources */}
              {!!(item.sources || []).length && (
                <>
                  <h3 className="mt-6 text-xs md:text-base font-bold text-gray-500 mb-2">
                    Sources
                  </h3>

                  <div className="space-y-2 ">
                    {item.sources.map((s, idx) => {
                      const url = typeof s === "string" ? s : s?.url;
                      // const label =
                      //   typeof s === "string"
                      //     ? `Source ${idx + 1}`
                      //     : s?.label || `Source ${idx + 1}`;

                      if (!url) return null;

                      return (
                        <a
                          key={`${item._id || "item"}-src-${idx}`}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-50 group block rounded-xl border border-blue-200 p-3 md:p-4 hover:bg-blue-100 transition"
                          title={url}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              {/* <div className="font-semibold text-gray-900 truncate">
                                {label}
                              </div> */}
                              <div className="text-xs text-gray-500 truncate">
                                {url}
                              </div>
                            </div>
                            <FaExternalLinkAlt className="text-blue-300 group-hover:text-gray-600 shrink-0" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </>
              )}
              {/* Mobile hint */}
              <div className="md:hidden mt-6 text-center text-xs text-gray-500">
                Tip: swipe down to close
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AffairModal.propTypes = {
  open: PropTypes.bool.isRequired,
  item: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default AffairModal;

// components/common/Modal.jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

export default function Modal({ open, onClose, title, children }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const lastActiveRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      lastActiveRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      aria-hidden={!open}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3
            id="modal-title"
            className="text-lg md:text-xl font-semibold text-gray-900"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 rounded-md px-2 py-1"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.displayName = "Modal";

Modal.propTypes = {
  /** Controls whether the modal is rendered */
  open: PropTypes.bool.isRequired,
  /** Called on ESC key, backdrop click, or close button */
  onClose: PropTypes.func.isRequired,
  /** Modal header title (string or custom node) */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  /** Modal body content */
  children: PropTypes.node.isRequired,
};

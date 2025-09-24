import { useState, useEffect, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import PropTypes from "prop-types";

const WEBSITE_LINK = "https://undersigned.in";
const STORAGE = {
  CLOSED: "sharePopupClosed",
  SHOWN: "sharePopupShown",
};

const SharePopup = ({ delayMs = 2000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copyHint, setCopyHint] = useState(""); // "Copied!" | "Press Ctrl+C to copy" | ""
  const popupRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE.CLOSED) === "true") return;
    const timer = setTimeout(() => {
      if (sessionStorage.getItem(STORAGE.CLOSED) === "true") return;
      if (sessionStorage.getItem(STORAGE.SHOWN) === "true") return;
      setIsVisible(true);
      sessionStorage.setItem(STORAGE.SHOWN, "true");
    }, delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  const closeAndRemember = () => {
    sessionStorage.setItem(STORAGE.CLOSED, "true");
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e) => e.key === "Escape" && closeAndRemember();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible]);

  const onOverlayClick = () => closeAndRemember();
  const stop = (e) => e.stopPropagation();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(WEBSITE_LINK);
      setCopyHint("Copied!");
      setTimeout(() => setCopyHint(""), 1500);
      return;
    } catch (err) {
      console.warn("navigator.clipboard failed, trying legacy copy:", err);
    }

    // Legacy fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = WEBSITE_LINK;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand && document.execCommand("copy");
      document.body.removeChild(ta);
      if (!ok) throw new Error("execCommand returned false");
      setCopyHint("Copied!");
      setTimeout(() => setCopyHint(""), 1500);
    } catch (err) {
      console.error("Legacy copy failed:", err);
      try {
        const input = popupRef.current?.querySelector("input[data-copy]");
        input?.focus();
        input?.select();
      } catch {
        console.log(err);
      }
      setCopyHint("Press Ctrl+C to copy");
      setTimeout(() => setCopyHint(""), 2500);
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "Check out Undersigned",
        text: "Found this helpful. Take a look:",
        url: WEBSITE_LINK,
      });
      closeAndRemember();
    } catch {
      console.log("here");
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex justify-center items-center z-50"
      onClick={onOverlayClick}
      aria-hidden="true"
    >
      <div
        ref={popupRef}
        className="relative w-full max-w-sm rounded-2xl shadow-xl ring-1 ring-blue-100 bg-gradient-to-tr from-blue-50 via-white to-blue-100 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-dialog-title"
        aria-describedby="share-dialog-desc"
        onClick={stop}
        onMouseDown={stop}
      >
        <button
          onClick={closeAndRemember}
          className="absolute top-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          aria-label="Close share dialog"
        >
          ✕
        </button>

        <h2
          id="share-dialog-title"
          className="text-2xl font-bold text-center text-blue-900"
        >
          Spread the Word!
        </h2>
        <p id="share-dialog-desc" className="mt-2 text-center text-gray-700">
          Found our platform helpful? Share it with your circle and help more
          aspirants ace their goals!
        </p>

        <div className="mt-5 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={WEBSITE_LINK}
            data-copy
            className="flex-1 rounded-lg border border-gray-300 bg-white p-2 text-gray-700"
            aria-label="Link to share"
          />
          <button
            onClick={handleCopyLink}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 active:translate-y-[1px] transition"
          >
            Copy
          </button>
        </div>

        {/* Show hint text below the row */}
        {copyHint && (
          <p className="mt-2 text-center text-sm text-gray-800">{copyHint}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Check out this LDCE Test Series: ${WEBSITE_LINK}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            title="Share on WhatsApp"
          >
            <FaWhatsapp />
            WhatsApp
          </a>

          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-black"
              title="Share via device"
            >
              Share…
            </button>
          )}
        </div>

        {/* <p className="mt-3 text-center text-xs text-gray-500">
          This won’t show again after you close it during this session.
        </p> */}
      </div>
    </div>
  );
};

SharePopup.propTypes = {
  delayMs: PropTypes.number,
};

export default SharePopup;

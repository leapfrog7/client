import { useEffect, useRef, useState } from "react";
import { FaPen, FaCheck } from "react-icons/fa6";
import PropTypes from "prop-types";

DraftTitleField.propTypes = {
  titleInput: PropTypes.string.isRequired,
  setTitleInput: PropTypes.func.isRequired,
  handleTitleBlur: PropTypes.func,
};

export default function DraftTitleField({
  titleInput,
  setTitleInput,
  handleTitleBlur,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const displayTitle = titleInput?.trim() || "Untitled Draft";

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (!isEditingTitle) return;

    const handleOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        finishEditing();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isEditingTitle, titleInput]);

  const finishEditing = () => {
    handleTitleBlur?.();
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEditing();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsEditingTitle(false);
    }
  };

  return (
    <div ref={wrapperRef} className="block">
      {!isEditingTitle ? (
        <div className="group relative rounded-lg md:rounded-xl  bg-gradient-to-r from-rose-50 to-amber-50 px-4 py-2  transition ">
          <div className="pr-4">
            <div className="truncate text-base md:text-lg font-semibold  text-slate-900">
              {displayTitle}
            </div>
            <div className="mt-1 text-[11px] md:text-xs text-slate-500">
              Click the edit icon to rename this draft
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingTitle(true)}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-blue-700"
            aria-label="Edit draft title"
          >
            <FaPen className="text-sm text-amber-500 " />
          </button>
        </div>
      ) : (
        <div className="group relative">
          <input
            ref={inputRef}
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            placeholder="Untitled Draft"
            className="w-full rounded-md md:rounded-xl   pl-4 pr-4 py-3 text-base md:text-lg font-semibold  text-slate-900  transition-all duration-200 placeholder:font-medium placeholder:text-slate-400  "
          />

          <div className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-700">
            <FaCheck className="text-[10px]" />
            Editing
          </div>

          <div className="mt-2 px-1 text-[11px] md:text-xs text-slate-500">
            Press Enter or click outside to save
          </div>
        </div>
      )}
    </div>
  );
}

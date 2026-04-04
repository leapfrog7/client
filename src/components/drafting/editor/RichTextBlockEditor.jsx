import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiBold, FiItalic, FiUnderline, FiSlash } from "react-icons/fi";

RichTextBlockEditor.propTypes = {
  block: PropTypes.object.isRequired,
  onBlockFocus: PropTypes.func.isRequired,
  onBlockChange: PropTypes.func.isRequired,
  draftStyling: PropTypes.object.isRequired,
  labelPrefix: PropTypes.string,
};

const ALLOWED_TAGS = ["B", "STRONG", "I", "EM", "U", "BR", "DIV", "P"];

function sanitizeHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html || "";

  const walk = (node) => {
    const children = Array.from(node.childNodes);

    children.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!ALLOWED_TAGS.includes(child.tagName)) {
          const fragment = document.createDocumentFragment();
          while (child.firstChild) fragment.appendChild(child.firstChild);
          child.replaceWith(fragment);
        } else {
          walk(child);
        }
      }
    });
  };

  walk(temp);
  return temp.innerHTML;
}

function normalizeInitialHtml(content = "") {
  if (!content) return "";
  return sanitizeHtml(String(content));
}

function exec(command) {
  document.execCommand(command, false, null);
}

function toolbarButtonClass(active = false) {
  return `inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition ${
    active
      ? "border-slate-900 bg-slate-900 text-white"
      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
  }`;
}

function isSubjectBlock(type) {
  return type === "subject_block";
}

function supportsBodyIndent(type) {
  return type === "body_paragraph" || type === "intro_phrase_block";
}

function insertTextAtSelection(text) {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(text));
  range.collapse(false);

  selection.removeAllRanges();
  selection.addRange(range);
}

export default function RichTextBlockEditor({
  block,
  onBlockFocus,
  onBlockChange,
  draftStyling,
  labelPrefix = "",
}) {
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const subjectMode = isSubjectBlock(block.type);
  const bodyIndentMode = supportsBodyIndent(block.type);

  const htmlValue = useMemo(
    () =>
      normalizeInitialHtml(
        typeof block.content === "string" ? block.content : "",
      ),
    [block.content],
  );

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== htmlValue) {
      editorRef.current.innerHTML = htmlValue;
    }
  }, [htmlValue]);

  const syncFormats = () => {
    setFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  const emitChange = () => {
    if (!editorRef.current) return;
    const clean = sanitizeHtml(editorRef.current.innerHTML);
    onBlockChange(block.id, clean);
  };

  const applyCommand = (command) => {
    onBlockFocus(block.id);
    exec(command);
    syncFormats();
    emitChange();
  };

  const clearFormatting = () => {
    onBlockFocus(block.id);
    exec("removeFormat");
    syncFormats();
    emitChange();
  };

  return (
    <div className="relative rounded-md px-1">
      {showToolbar ? (
        <div className="pointer-events-auto absolute -left-24 top-6 z-20 inline-flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-[0_8px_20px_rgba(15,23,42,0.10)]">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyCommand("bold")}
            className={toolbarButtonClass(formats.bold)}
            title="Bold"
          >
            <FiBold />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyCommand("italic")}
            className={toolbarButtonClass(formats.italic)}
            title="Italic"
          >
            <FiItalic />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyCommand("underline")}
            className={toolbarButtonClass(formats.underline)}
            title="Underline"
          >
            <FiUnderline />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearFormatting}
            className={toolbarButtonClass(false)}
            title="Clear formatting"
          >
            <FiSlash />
          </button>
        </div>
      ) : null}

      <div className={`rounded-md px-1 ${subjectMode ? "pt-1" : "pt-4"}`}>
        {subjectMode ? (
          <div className="flex items-start gap-2">
            {labelPrefix ? (
              <span className="shrink-0 font-bold text-slate-900">
                {labelPrefix}
              </span>
            ) : null}

            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onFocus={() => {
                onBlockFocus(block.id);
                setShowToolbar(true);
                syncFormats();
              }}
              onBlur={() => {
                emitChange();
                setShowToolbar(false);
              }}
              onInput={emitChange}
              onMouseUp={syncFormats}
              onKeyUp={syncFormats}
              onKeyDown={(e) => {
                if (!bodyIndentMode) return;

                if (e.key === "Tab") {
                  e.preventDefault();
                  insertTextAtSelection("\t");
                  emitChange();
                }
              }}
              className="min-h-[14px] flex-1 whitespace-pre-wrap break-words bg-transparent font-bold text-justify text-slate-900 outline-none"
              style={{
                lineHeight: draftStyling.bodyLineSpacing || 1.15,
                tabSize: 8,
                MozTabSize: 8,
              }}
            />
          </div>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => {
              onBlockFocus(block.id);
              setShowToolbar(true);
              syncFormats();
            }}
            onBlur={() => {
              emitChange();
              setShowToolbar(false);
            }}
            onInput={emitChange}
            onMouseUp={syncFormats}
            onKeyUp={syncFormats}
            onKeyDown={(e) => {
              if (!bodyIndentMode) return;

              if (e.key === "Tab") {
                e.preventDefault();
                insertTextAtSelection("    ");
                emitChange();
              }
            }}
            className="min-h-[100px] whitespace-pre-wrap break-words bg-transparent text-justify text-slate-900 outline-none"
            style={{
              lineHeight: draftStyling.bodyLineSpacing || 1.15,
              textIndent: `${draftStyling.bodyFirstLineIndent || 0}in`,
              tabSize: 12,
              MozTabSize: 12,
            }}
          />
        )}
      </div>
    </div>
  );
}

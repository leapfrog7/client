import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import InlineBlockActions from "./InlineBlockActions";
import BodyTableBlock from "./BodyTableBlock";
import RichTextBlockEditor from "./RichTextBlockEditor";

DocumentComposer.propTypes = {
  draft: PropTypes.shape({
    blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
    styling: PropTypes.shape({
      fontFamily: PropTypes.string,
      fontSize: PropTypes.number,
      paragraphSpacing: PropTypes.number,
    }).isRequired,
  }).isRequired,
  activeBlockId: PropTypes.string,
  onBlockFocus: PropTypes.func.isRequired,
  onBlockChange: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onInsertRequest: PropTypes.func.isRequired,
  onOpenParagraphBankRequest: PropTypes.func.isRequired,
};

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;
export const MS_WORD_MARGIN_PX = 96;

const draftBlockShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  zone: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      place: PropTypes.string,
      date: PropTypes.string,
    }),
  ]),
  order: PropTypes.number,
  isRequired: PropTypes.bool,
  isRemovable: PropTypes.bool,
  isRepeatable: PropTypes.bool,
  isLockedPosition: PropTypes.bool,
  placeholder: PropTypes.string,
  meta: PropTypes.object,
});

function supportsInlineFormatting(type) {
  return (
    type === "body_paragraph" ||
    type === "intro_phrase_block" ||
    type === "subject_block"
  );
}

function getRowsForBlock(type, content = "") {
  const safe = typeof content === "string" ? content : "";
  const lineCount = Math.max(1, String(safe).split("\n").length);

  switch (type) {
    case "document_number":
    case "do_number":
    case "government_identity":
    case "department_identity":
    case "communication_label":
    case "salutation_block":
    case "signoff_block":
    case "signature_block":
    case "sender_name_block":
    case "sender_designation_block":
    case "contact_line":
    case "complimentary_close":
      return Math.max(1, Math.min(2, lineCount));

    case "subject_block":
      return Math.max(1, Math.min(3, lineCount));

    case "designation_contact_block":
    case "to_block":
    case "recipient_identity_block":
      return Math.max(2, Math.min(6, lineCount));

    case "copy_to_block":
    case "endorsement_block":
    case "gazette_forwarding_block":
    case "press_forwarding_block":
      return Math.max(3, Math.min(8, lineCount));

    case "body_paragraph":
    case "intro_phrase_block":
    default:
      return Math.max(8, Math.min(20, lineCount + 2));
  }
}

function getBlockLabel(block) {
  if (block.type === "communication_label") return "Form of Communication";
  if (block.type === "intro_phrase_block") return "Body";
  if (block.type === "body_paragraph") return "Body";
  return block.label;
}

function getBlockTextClass(type) {
  switch (type) {
    case "document_number":
    case "do_number":
      return "text-center font-medium";

    case "government_identity":
    case "department_identity":
      return "text-center font-medium";

    case "communication_label":
      return "text-center font-semibold uppercase underline ";

    case "subject_block":
      return "text-justify font-bold";

    case "body_paragraph":
    case "intro_phrase_block":
      return "text-justify";

    case "signoff_block":
    case "complimentary_close":
    case "signature_block":
    case "designation_contact_block":
      return "text-right";

    default:
      return "";
  }
}

function getBlockLineHeight(type, styling = {}) {
  if (
    type === "government_identity" ||
    type === "department_identity" ||
    type === "document_number" ||
    type === "do_number"
  ) {
    return styling.lineSpacing || 1.05;
  }

  if (
    type === "body_paragraph" ||
    type === "intro_phrase_block" ||
    type === "subject_block"
  ) {
    return styling.bodyLineSpacing || 1.15;
  }

  return styling.lineSpacing || 1;
}

function getBlockSpacingBefore(block, prevBlockType, styling) {
  if (!prevBlockType) return 0;

  if (
    prevBlockType === "document_number" &&
    block.type === "government_identity"
  ) {
    return 0;
  }

  if (
    prevBlockType === "government_identity" &&
    block.type === "department_identity"
  ) {
    return 0;
  }

  if (
    prevBlockType === "department_identity" &&
    block.type === "place_date_line"
  ) {
    return 10;
  }

  if (
    prevBlockType === "body_paragraph" ||
    prevBlockType === "intro_phrase_block"
  ) {
    if (
      block.type === "signoff_block" ||
      block.type === "complimentary_close" ||
      block.type === "signature_block" ||
      block.type === "designation_contact_block"
    ) {
      return styling.signatureGap || 32;
    }

    return styling.bodyParagraphSpacing || 8;
  }

  if (
    prevBlockType === "signature_block" &&
    block.type === "designation_contact_block"
  ) {
    return 0;
  }

  if (prevBlockType === "communication_label") {
    return 12;
  }

  if (
    prevBlockType === "subject_block" &&
    (block.type === "body_paragraph" || block.type === "intro_phrase_block")
  ) {
    return styling.bodyParagraphSpacing || 8;
  }

  return styling.paragraphSpacing || 4;
}

function adjustTextareaHeight(el, isBody = false) {
  if (!el) return;

  el.style.height = "auto";

  if (isBody) {
    const maxHeight = 320;
    const nextHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  } else {
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflowY = "hidden";
  }
}

function handleTabIndent(e, value, onChange) {
  if (e.key !== "Tab") return false;

  e.preventDefault();

  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;
  const indent = "    ";
  const nextValue = value.slice(0, start) + indent + value.slice(end);

  onChange(nextValue);

  requestAnimationFrame(() => {
    e.target.selectionStart = e.target.selectionEnd = start + indent.length;
  });

  return true;
}

function renderPlaceDateBlock(block, active, onBlockFocus, onBlockChange) {
  const content = {
    place:
      typeof block.content === "object" && block.content?.place
        ? block.content.place
        : "",
    date:
      typeof block.content === "object" && block.content?.date
        ? block.content.date
        : "",
  };

  const dateWidth = `${Math.max((content.date || "").length + 1, 2)}ch`;

  return (
    <div className={`rounded-md px-1 py-0.5 ${active ? "bg-slate-50/80" : ""}`}>
      <div className="space-y-1 text-right">
        <input
          type="text"
          value={content.place}
          onFocus={() => onBlockFocus(block.id)}
          onChange={(e) =>
            onBlockChange(block.id, {
              ...content,
              place: e.target.value,
            })
          }
          className="w-full border-none bg-transparent p-0 text-right text-slate-900 outline-none placeholder:text-slate-400"
          placeholder="Place"
        />

        <div className="text-right leading-none">
          <span className="text-slate-900">Dated </span>
          <input
            type="text"
            value={content.date}
            onFocus={() => onBlockFocus(block.id)}
            onChange={(e) =>
              onBlockChange(block.id, {
                ...content,
                date: e.target.value,
              })
            }
            className="inline-block border-none bg-transparent p-0 text-right text-slate-900 outline-none placeholder:text-slate-400"
            style={{ width: dateWidth }}
            placeholder="Date"
          />
        </div>
      </div>
    </div>
  );
}

function renderAddresseeControls(block, onBlockChange) {
  if (block.type !== "to_block" && block.type !== "copy_to_block") return null;

  const heading = block.type === "to_block" ? "To" : "Copy To";

  const ensureHeading = (value) => {
    const safe = String(value || "").trimStart();
    if (safe.startsWith(`${heading}\n`)) return value;
    if (safe === heading) return value;
    return `${heading}\n${safe}`;
  };

  const makeNumbered = (value) => {
    const raw = String(value || "");
    const lines = raw.split("\n");

    const firstLine =
      lines[0]?.trim().toLowerCase() === heading.toLowerCase()
        ? lines[0]
        : heading;

    const rest = lines
      .slice(lines[0]?.trim().toLowerCase() === heading.toLowerCase() ? 1 : 0)
      .filter((line) => line.trim() !== "");

    const numbered = rest.map(
      (line, index) =>
        `    ${index + 1}. ${line.replace(/^\s*\d+\.\s*/, "").trim()}`,
    );

    return [firstLine, ...numbered].join("\n");
  };

  return (
    <div className="mb-1 flex gap-2">
      <button
        type="button"
        onClick={() => onBlockChange(block.id, ensureHeading(block.content))}
        className="rounded-md border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
      >
        Add heading
      </button>

      <button
        type="button"
        onClick={() => onBlockChange(block.id, makeNumbered(block.content))}
        className="rounded-md border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
      >
        Numbered
      </button>
    </div>
  );
}

function getAddresseeHeading(type) {
  return type === "copy_to_block" ? "Copy To" : "To";
}

function handleAddresseeEnter(e, type, value, onChange) {
  if (e.key !== "Enter") return false;

  const heading = getAddresseeHeading(type);
  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;
  const raw = String(value || "");

  const beforeCursor = raw.slice(0, start);
  const lineStart = beforeCursor.lastIndexOf("\n") + 1;
  const currentLine = raw.slice(lineStart, start);

  const isHeadingLine =
    currentLine.trim().toLowerCase() === heading.toLowerCase();

  if (isHeadingLine) {
    e.preventDefault();
    const insertion = "\n    1. ";
    const nextValue = raw.slice(0, start) + insertion + raw.slice(end);
    onChange(nextValue);

    requestAnimationFrame(() => {
      const nextPos = start + insertion.length;
      e.target.selectionStart = e.target.selectionEnd = nextPos;
    });

    return true;
  }

  const match = currentLine.match(/^(\s*)(\d+)\.\s/);
  if (!match) return false;

  e.preventDefault();

  const currentNumber = Number(match[2]);
  const nextNumber = currentNumber + 1;
  const insertion = `\n    ${nextNumber}. `;
  const nextValue = raw.slice(0, start) + insertion + raw.slice(end);

  onChange(nextValue);

  requestAnimationFrame(() => {
    const nextPos = start + insertion.length;
    e.target.selectionStart = e.target.selectionEnd = nextPos;
  });

  return true;
}

function EditableTextarea({
  block,
  onBlockFocus,
  onBlockChange,
  draftStyling,
}) {
  const textareaRef = useRef(null);

  const isBody =
    block.type === "body_paragraph" || block.type === "intro_phrase_block";

  useEffect(() => {
    adjustTextareaHeight(textareaRef.current, isBody);
  }, [block.content, isBody]);

  return (
    <textarea
      ref={textareaRef}
      value={typeof block.content === "string" ? block.content : ""}
      onFocus={() => onBlockFocus(block.id)}
      onChange={(e) => {
        onBlockChange(block.id, e.target.value);
        adjustTextareaHeight(e.target, isBody);
      }}
      onKeyDown={(e) => {
        if (isBody) {
          const handled = handleTabIndent(e, block.content || "", (next) =>
            onBlockChange(block.id, next),
          );
          if (handled) return;
        }

        if (block.type === "to_block" || block.type === "copy_to_block") {
          const handledEnter = handleAddresseeEnter(
            e,
            block.type,
            block.content || "",
            (next) => onBlockChange(block.id, next),
          );
          if (handledEnter) return;

          const handledTab = handleTabIndent(e, block.content || "", (next) =>
            onBlockChange(block.id, next),
          );
          if (handledTab) return;
        }
      }}
      placeholder={block.placeholder}
      rows={getRowsForBlock(block.type, block.content)}
      className={`w-full resize-none border-none bg-transparent p-0 text-slate-900 outline-none placeholder:text-slate-400 ${getBlockTextClass(
        block.type,
      )}`}
      style={{
        lineHeight: getBlockLineHeight(block.type, draftStyling),
        minHeight: isBody
          ? "180px"
          : block.type === "government_identity" ||
              block.type === "department_identity"
            ? "12px"
            : block.type === "document_number" || block.type === "do_number"
              ? "12px"
              : block.type === "signature_block"
                ? "28px"
                : "18px",
        textIndent: 0,
      }}
    />
  );
}

EditableTextarea.propTypes = {
  block: draftBlockShape.isRequired,
  onBlockFocus: PropTypes.func.isRequired,
  onBlockChange: PropTypes.func.isRequired,
  draftStyling: PropTypes.object.isRequired,
};

export default function DocumentComposer({
  draft,
  activeBlockId,
  onBlockFocus,
  onBlockChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  onInsertRequest,
  onOpenParagraphBankRequest,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const { blocks = [], styling = {} } = draft;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pagePadding = isMobile ? 18 : MS_WORD_MARGIN_PX;
  const pageMinHeight = isMobile ? "auto" : `${A4_HEIGHT_PX}px`;
  const baseFontSizePx = (styling.fontSize || 12) * 1.333333;
  const mobileFontScale = 0.9; // adjust to taste
  const pageFontSizePx = `${
    isMobile ? baseFontSizePx * mobileFontScale : baseFontSizePx
  }px`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-2 shadow-sm sm:p-5">
      <div
        className="mx-auto rounded-sm bg-white shadow-[0_6px_24px_rgba(15,23,42,0.08)]"
        style={{
          width: "100%",
          maxWidth: `${A4_WIDTH_PX}px`,
          minHeight: pageMinHeight,
          paddingTop: `${pagePadding}px`,
          paddingRight: `${pagePadding}px`,
          paddingBottom: `${pagePadding}px`,
          paddingLeft: `${pagePadding}px`,
          fontFamily: styling.fontFamily,
          fontSize: pageFontSizePx,
        }}
      >
        {blocks.map((block, index) => {
          const active = activeBlockId === block.id;
          const hovered = hoveredId === block.id;
          const prevType = index > 0 ? blocks[index - 1].type : null;

          return (
            <div
              key={block.id}
              className="group relative overflow-visible"
              style={{
                marginTop: `${getBlockSpacingBefore(
                  block,
                  prevType,
                  styling,
                )}px`,
              }}
              onMouseEnter={() => setHoveredId(block.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <InlineBlockActions
                block={block}
                index={index}
                total={blocks.length}
                isVisible={active}
                onMoveUp={() => onMoveUp(block.id)}
                onMoveDown={() => onMoveDown(block.id)}
                onDelete={() => onDelete(block.id)}
                onInsertBelow={() => onInsertRequest(block.id)}
                onOpenParagraphBank={() => onOpenParagraphBankRequest(block.id)}
              />

              {!isMobile && (hovered || active) && (
                <div className="absolute -left-20 top-1 hidden w-16 text-right text-[10px] font-medium uppercase tracking-wide text-slate-400 md:block">
                  {getBlockLabel(block)}
                </div>
              )}

              <div
                className={`rounded-md px-1 py-0 transition ${
                  active ? "bg-blue-50/70" : "bg-transparent"
                }`}
              >
                {block.type === "place_date_line" ? (
                  renderPlaceDateBlock(
                    block,
                    active,
                    onBlockFocus,
                    onBlockChange,
                  )
                ) : block.type === "subject_block" ? (
                  <RichTextBlockEditor
                    block={block}
                    onBlockFocus={onBlockFocus}
                    onBlockChange={onBlockChange}
                    draftStyling={styling}
                    labelPrefix="Subject:"
                  />
                ) : block.type === "body_table" ? (
                  <BodyTableBlock
                    block={block}
                    onChange={onBlockChange}
                    onFocusBlock={onBlockFocus}
                  />
                ) : (
                  <>
                    {renderAddresseeControls(block, onBlockChange)}

                    {supportsInlineFormatting(block.type) ? (
                      <RichTextBlockEditor
                        block={block}
                        onBlockFocus={onBlockFocus}
                        onBlockChange={onBlockChange}
                        draftStyling={styling}
                      />
                    ) : (
                      <EditableTextarea
                        block={block}
                        onBlockFocus={onBlockFocus}
                        onBlockChange={onBlockChange}
                        draftStyling={styling}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => onInsertRequest(null)}
            className="rounded-full border border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            + Insert block
          </button>
        </div>
      </div>
    </div>
  );
}

import PropTypes from "prop-types";
import {
  FiPlus,
  FiArrowUp,
  FiArrowDown,
  FiTrash2,
  FiBookOpen,
} from "react-icons/fi";

InlineBlockActions.propTypes = {
  block: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  isVisible: PropTypes.bool,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onInsertBelow: PropTypes.func.isRequired,
  onOpenParagraphBank: PropTypes.func,
};

function ActionIconButton({
  title,
  onClick,
  disabled = false,
  danger = false,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border",
        "transition-all duration-200 ease-out",
        danger
          ? "border-rose-200 bg-rose-50/95 text-rose-700 hover:bg-rose-100"
          : "border-slate-200 bg-white/95 text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        disabled
          ? "cursor-not-allowed opacity-35"
          : "hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(15,23,42,0.10)] active:translate-y-0",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

ActionIconButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  danger: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

function supportsParagraphBank(blockType) {
  return (
    blockType === "body_paragraph" ||
    blockType === "intro_phrase_block" ||
    blockType === "to_block" ||
    blockType === "copy_to_block"
  );
}

export default function InlineBlockActions({
  block,
  index,
  total,
  isVisible = false,
  onMoveUp,
  onMoveDown,
  onDelete,
  onInsertBelow,
  onOpenParagraphBank,
}) {
  const showParagraphBank = supportsParagraphBank(block.type);

  return (
    <>
      <div
        className={`hidden md:block absolute -top-8 -right-20 z-20 transition-all duration-200 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-2 py-2 shadow-[0_14px_34px_rgba(15,23,42,0.14)] backdrop-blur-md">
          <ActionIconButton title="Insert below" onClick={onInsertBelow}>
            <FiPlus className="text-[16px]" />
          </ActionIconButton>

          {showParagraphBank ? (
            <ActionIconButton
              title="Insert from Paragraph Bank"
              onClick={onOpenParagraphBank}
            >
              <FiBookOpen className="text-[16px]" />
            </ActionIconButton>
          ) : null}

          <ActionIconButton
            title="Move up"
            onClick={onMoveUp}
            disabled={index === 0 || block.isLockedPosition}
          >
            <FiArrowUp className="text-[16px]" />
          </ActionIconButton>

          <ActionIconButton
            title="Move down"
            onClick={onMoveDown}
            disabled={index === total - 1 || block.isLockedPosition}
          >
            <FiArrowDown className="text-[16px]" />
          </ActionIconButton>

          <div className="mx-1 h-7 w-px bg-slate-200" />

          <ActionIconButton
            title="Delete"
            onClick={onDelete}
            disabled={!block.isRemovable}
            danger
          >
            <FiTrash2 className="text-[16px]" />
          </ActionIconButton>
        </div>
      </div>

      <div
        className={`md:hidden mt-3 transition-all duration-200 ease-out ${
          isVisible
            ? "max-h-24 opacity-100"
            : "pointer-events-none max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 p-2">
          <ActionIconButton title="Insert below" onClick={onInsertBelow}>
            <FiPlus className="text-[16px]" />
          </ActionIconButton>

          {showParagraphBank ? (
            <ActionIconButton
              title="Insert from Paragraph Bank"
              onClick={onOpenParagraphBank}
            >
              <FiBookOpen className="text-[16px]" />
            </ActionIconButton>
          ) : null}

          <ActionIconButton
            title="Move up"
            onClick={onMoveUp}
            disabled={index === 0 || block.isLockedPosition}
          >
            <FiArrowUp className="text-[16px]" />
          </ActionIconButton>

          <ActionIconButton
            title="Move down"
            onClick={onMoveDown}
            disabled={index === total - 1 || block.isLockedPosition}
          >
            <FiArrowDown className="text-[16px]" />
          </ActionIconButton>

          <div className="mx-1 h-7 w-px bg-slate-200" />

          <ActionIconButton
            title="Delete"
            onClick={onDelete}
            disabled={!block.isRemovable}
            danger
          >
            <FiTrash2 className="text-[16px]" />
          </ActionIconButton>
        </div>
      </div>
    </>
  );
}

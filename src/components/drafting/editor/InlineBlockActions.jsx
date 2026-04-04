// import PropTypes from "prop-types";
// import { FiPlus, FiArrowUp, FiArrowDown, FiTrash2 } from "react-icons/fi";

// InlineBlockActions.propTypes = {
//   block: PropTypes.object.isRequired,
//   index: PropTypes.number.isRequired,
//   total: PropTypes.number.isRequired,
//   isVisible: PropTypes.bool,
//   onMoveUp: PropTypes.func.isRequired,
//   onMoveDown: PropTypes.func.isRequired,
//   onDelete: PropTypes.func.isRequired,
//   onInsertBelow: PropTypes.func.isRequired,
// };

// function ActionIconButton({
//   title,
//   onClick,
//   disabled = false,
//   danger = false,
//   children,
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       title={title}
//       className={[
//         "inline-flex h-9 w-9 items-center justify-center rounded-xl",
//         "border text-sm transition-all duration-200 ease-out",
//         "backdrop-blur-sm shadow-sm",
//         danger
//           ? "border-rose-200 bg-rose-50/90 text-rose-700 hover:bg-rose-100"
//           : "border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50 hover:text-slate-900",
//         disabled
//           ? "cursor-not-allowed opacity-35 shadow-none hover:bg-white/90"
//           : "hover:-translate-y-[1px] hover:shadow-md active:translate-y-0",
//       ].join(" ")}
//     >
//       {children}
//     </button>
//   );
// }

// ActionIconButton.propTypes = {
//   title: PropTypes.string.isRequired,
//   onClick: PropTypes.func.isRequired,
//   disabled: PropTypes.bool,
//   danger: PropTypes.bool,
//   children: PropTypes.node.isRequired,
// };

// export default function InlineBlockActions({
//   block,
//   index,
//   total,
//   isVisible = true,
//   onMoveUp,
//   onMoveDown,
//   onDelete,
//   onInsertBelow,
// }) {
//   if (!isVisible) return null;

//   return (
//     <div className="pointer-events-auto absolute -top-4 -right-40 z-20">
//       <div className="inline-flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/85 p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)] backdrop-blur-md">
//         <ActionIconButton title="Insert below" onClick={onInsertBelow}>
//           <FiPlus className="text-[15px]" />
//         </ActionIconButton>

//         <ActionIconButton
//           title="Move up"
//           onClick={onMoveUp}
//           disabled={index === 0 || block.isLockedPosition}
//         >
//           <FiArrowUp className="text-[15px]" />
//         </ActionIconButton>

//         <ActionIconButton
//           title="Move down"
//           onClick={onMoveDown}
//           disabled={index === total - 1 || block.isLockedPosition}
//         >
//           <FiArrowDown className="text-[15px]" />
//         </ActionIconButton>

//         <div className="mx-0.5 h-6 w-px bg-slate-200" />

//         <ActionIconButton
//           title="Delete"
//           onClick={onDelete}
//           disabled={!block.isRemovable}
//           danger
//         >
//           <FiTrash2 className="text-[15px]" />
//         </ActionIconButton>
//       </div>
//     </div>
//   );
// }

import PropTypes from "prop-types";
import { FiPlus, FiArrowUp, FiArrowDown, FiTrash2 } from "react-icons/fi";

InlineBlockActions.propTypes = {
  block: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  isVisible: PropTypes.bool,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onInsertBelow: PropTypes.func.isRequired,
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

export default function InlineBlockActions({
  block,
  index,
  total,
  isVisible = false,
  onMoveUp,
  onMoveDown,
  onDelete,
  onInsertBelow,
}) {
  return (
    <>
      <div
        className={`hidden md:block absolute -top-5 right-4 z-20 transition-all duration-200 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-2 py-2 shadow-[0_14px_34px_rgba(15,23,42,0.14)] backdrop-blur-md">
          <ActionIconButton title="Insert below" onClick={onInsertBelow}>
            <FiPlus className="text-[16px]" />
          </ActionIconButton>

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
            ? "max-h-20 opacity-100"
            : "pointer-events-none max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 p-2">
          <ActionIconButton title="Insert below" onClick={onInsertBelow}>
            <FiPlus className="text-[16px]" />
          </ActionIconButton>

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

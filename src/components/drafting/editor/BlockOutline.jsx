// import PropTypes from "prop-types";

// BlockOutline.propTypes = {
//   blocks: PropTypes.array.isRequired,
//   activeBlockId: PropTypes.string,
//   onSelect: PropTypes.func.isRequired,
//   onMoveUp: PropTypes.func.isRequired,
//   onMoveDown: PropTypes.func.isRequired,
//   onDelete: PropTypes.func.isRequired,
// };

// export default function BlockOutline({
//   blocks,
//   activeBlockId,
//   onSelect,
//   onMoveUp,
//   onMoveDown,
//   onDelete,
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
//       <h3 className="px-2 pb-3 text-sm font-semibold text-slate-900">
//         Document Structure
//       </h3>

//       <div className="space-y-2">
//         {blocks.map((block, index) => {
//           const active = activeBlockId === block.id;
//           const isFirst = index === 0;
//           const isLast = index === blocks.length - 1;

//           return (
//             <div
//               key={block.id}
//               className={`rounded-xl border p-2 transition ${
//                 active
//                   ? "border-slate-300 bg-slate-50"
//                   : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
//               }`}
//             >
//               <button
//                 type="button"
//                 onClick={() => onSelect(block.id)}
//                 className="block w-full text-left"
//               >
//                 <div className="truncate text-sm font-medium text-slate-800">
//                   {block.label}
//                 </div>
//                 <div className="mt-1 truncate text-xs text-slate-500">
//                   {block.type} • {block.zone}
//                 </div>
//               </button>

//               <div className="mt-3 flex flex-wrap gap-2">
//                 <button
//                   type="button"
//                   disabled={isFirst || block.isLockedPosition}
//                   onClick={() => onMoveUp(block.id)}
//                   className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   Up
//                 </button>

//                 <button
//                   type="button"
//                   disabled={isLast || block.isLockedPosition}
//                   onClick={() => onMoveDown(block.id)}
//                   className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   Down
//                 </button>

//                 <button
//                   type="button"
//                   disabled={!block.isRemovable}
//                   onClick={() => onDelete(block.id)}
//                   className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

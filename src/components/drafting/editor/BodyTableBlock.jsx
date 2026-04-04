import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

BodyTableBlock.propTypes = {
  block: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocusBlock: PropTypes.func.isRequired,
};

function ensureRows(content) {
  const rows = Array.isArray(content?.rows) ? content.rows : [];
  if (rows.length) return rows;

  return [
    ["Column 1", "Column 2", "Column 3"],
    ["", "", ""],
    ["", "", ""],
  ];
}

function ensureColumnWidths(content, colCount) {
  const widths = Array.isArray(content?.columnWidths)
    ? content.columnWidths
    : [];

  return Array.from({ length: colCount }, (_, i) => {
    const width = Number(widths[i]);
    return Number.isFinite(width) && width >= 80 ? width : 160;
  });
}

export default function BodyTableBlock({ block, onChange, onFocusBlock }) {
  const wrapRef = useRef(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);

  const rows = ensureRows(block.content);
  const title = block.content?.title || "";
  const colCount = rows[0]?.length || 3;
  const columnWidths = ensureColumnWidths(block.content, colCount);

  const updateContent = (nextPartial) => {
    onChange(block.id, {
      ...block.content,
      ...nextPartial,
      rows: nextPartial.rows || rows,
      columnWidths: nextPartial.columnWidths || columnWidths,
      title: nextPartial.title !== undefined ? nextPartial.title : title,
    });
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const nextRows = rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
        : row,
    );

    updateContent({ rows: nextRows });
  };

  const addRow = () => {
    updateContent({
      rows: [...rows, Array(colCount).fill("")],
    });
  };

  const removeRow = (rowIndex) => {
    if (rows.length <= 1) return;

    updateContent({
      rows: rows.filter((_, idx) => idx !== rowIndex),
    });
  };

  const addColumn = () => {
    const nextRows = rows.map((row, index) => [
      ...row,
      index === 0 ? `Column ${row.length + 1}` : "",
    ]);

    updateContent({
      rows: nextRows,
      columnWidths: [...columnWidths, 160],
    });
  };

  const removeColumn = (colIndex) => {
    if (colCount <= 1) return;

    updateContent({
      rows: rows.map((row) => row.filter((_, idx) => idx !== colIndex)),
      columnWidths: columnWidths.filter((_, idx) => idx !== colIndex),
    });
  };

  const startResize = (colIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    onFocusBlock(block.id);

    const startX = e.clientX;
    const startWidth = columnWidths[colIndex];

    const handleMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidths = [...columnWidths];
      nextWidths[colIndex] = Math.max(80, startWidth + delta);
      updateContent({ columnWidths: nextWidths });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={wrapRef}
      onClick={() => onFocusBlock(block.id)}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          type="text"
          value={title}
          onFocus={() => onFocusBlock(block.id)}
          onChange={(e) => updateContent({ title: e.target.value })}
          placeholder="Optional table title"
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <FiPlus />
            Row
          </button>

          <button
            type="button"
            onClick={addColumn}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <FiPlus />
            Column
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="border-collapse bg-white">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className="relative border border-slate-200 bg-white p-0 align-top"
                    style={{ width: `${columnWidths[colIndex]}px` }}
                    onMouseEnter={() =>
                      rowIndex === 0 && setHoveredCol(colIndex)
                    }
                    onMouseLeave={() => rowIndex === 0 && setHoveredCol(null)}
                  >
                    <input
                      value={cell}
                      onFocus={() => onFocusBlock(block.id)}
                      onChange={(e) =>
                        updateCell(rowIndex, colIndex, e.target.value)
                      }
                      className={`w-full bg-transparent px-3 py-2.5 outline-none ${
                        rowIndex === 0
                          ? "font-semibold text-slate-900"
                          : "text-slate-700"
                      }`}
                      style={{
                        fontSize: "inherit",
                        fontFamily: "inherit",
                        lineHeight: "inherit",
                      }}
                    />

                    {rowIndex === 0 && hoveredCol === colIndex && (
                      <button
                        type="button"
                        onClick={() => removeColumn(colIndex)}
                        className="absolute right-3 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-slate-500 shadow-sm transition hover:text-rose-600"
                        title={`Delete column ${colIndex + 1}`}
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    )}

                    {rowIndex === 0 && (
                      <div
                        onMouseDown={(e) => startResize(colIndex, e)}
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-transparent hover:bg-slate-300/40"
                        title="Drag to resize"
                      />
                    )}
                  </td>
                ))}

                <td className="border border-slate-200 bg-slate-50 px-2 py-1 text-center">
                  {hoveredRow === rowIndex ? (
                    <button
                      type="button"
                      onClick={() => removeRow(rowIndex)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-rose-600"
                      title="Delete row"
                    >
                      <FiTrash2 />
                    </button>
                  ) : (
                    <div className="h-8 w-8" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

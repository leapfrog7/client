import { useState } from "react";
import PropTypes from "prop-types";
import { PDFDocument } from "pdf-lib";
import PDFThumbnail from "./PDFThumbnail";
import useFileDrop from "../../assets/useFileDrop";
import { XMarkIcon } from "@heroicons/react/24/solid";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { VscMerge } from "react-icons/vsc";

// 🔹 Sortable file card
function SortableItem({ item, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  // const handleRemoveClick = (e) => {
  //   // prevent triggering drag on click
  //   e.preventDefault();
  //   e.stopPropagation();
  //   onRemove?.(item.id);
  // };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative border p-3 rounded mb-3 shadow bg-white cursor-move"
    >
      {/* remove button */}
      <button
        type="button"
        aria-label={`Remove ${item.file.name}`}
        title="Remove"
        onPointerDown={(e) => {
          // ← key fix: cancel pointerdown for dnd-kit
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove?.(item.id);
        }}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center
             rounded-full border border-gray-300 bg-white text-gray-600 
             hover:bg-red-50 hover:text-red-700"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>

      <p className="pr-6 text-sm font-medium text-gray-700 truncate">
        {item.file.name}
      </p>
      <PDFThumbnail file={item.file} buffer={item.buffer} />
    </div>
  );
}

SortableItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    file: PropTypes.instanceOf(File).isRequired,
    buffer: PropTypes.instanceOf(ArrayBuffer).isRequired,
  }).isRequired,
  onRemove: PropTypes.func, // ← add this
};

export default function PDFMerger() {
  const [pdfItems, setPdfItems] = useState([]);
  const [mergedBlob, setMergedBlob] = useState(null);
  // at top of component
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0); // 0 → 100
  const [error, setError] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));
  const onFiles = async (filesLike) => {
    const files = Array.from(filesLike);
    const processed = await Promise.all(
      files.map(async (file, index) => {
        const buffer = await file.arrayBuffer();
        return {
          id: `${Date.now()}-${index}`,
          file,
          buffer,
        };
      })
    );
    setPdfItems((prev) => [...prev, ...processed]);
    setMergedBlob(null);
  };

  const { handleDrop, handleDragOver } = useFileDrop(onFiles);

  const handleFileChange = async (e) => {
    if (e.target.files?.length) {
      await onFiles(e.target.files);
      // allow choosing the same file again
      e.target.value = "";
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = pdfItems.findIndex((item) => item.id === active.id);
      const newIndex = pdfItems.findIndex((item) => item.id === over.id);
      setPdfItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  function InlineSpinner() {
    return (
      <svg
        className="h-4 w-4 animate-spin"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          opacity="0.25"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
      </svg>
    );
  }

  const removeItem = (id) => {
    setPdfItems((prev) => prev.filter((it) => it.id !== id));
    setMergedBlob(null);
  };

  const mergePDFs = async () => {
    if (!pdfItems.length) return;
    setIsMerging(true);
    setMergedBlob(null);
    setError(null);
    setProgress(0);

    try {
      // yield to the browser so the spinner paints
      await new Promise((r) => setTimeout(r, 0));

      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < pdfItems.length; i++) {
        // Read fresh bytes to avoid "detached ArrayBuffer" issues
        const freshBytes = await pdfItems[i].file.arrayBuffer();
        const pdf = await PDFDocument.load(freshBytes);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((p) => mergedPdf.addPage(p));

        // update progress (integer 0..100)
        setProgress(Math.round(((i + 1) / pdfItems.length) * 100));
        // allow UI to update between iterations
        await new Promise((r) => setTimeout(r, 0));
      }

      const mergedBytes = await mergedPdf.save();
      setMergedBlob(new Blob([mergedBytes], { type: "application/pdf" }));
    } catch (e) {
      console.error(e);
      setError("Merging failed. Please try again.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="rounded-2xl  bg-white p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <VscMerge aria-hidden="true" />
            <span>Merge PDFs</span>
          </h2>
          <p className="text-sm text-gray-500">
            Client-side · Private · No uploads
          </p>
        </div>

        {pdfItems.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setPdfItems([]);
              setMergedBlob(null);
            }}
            className="text-xs md:text-sm text-pink-700 bg-red-100 px-2 py-1 rounded-md hover:text-pink-400"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Upload area */}
      <label
        htmlFor="pdf-input"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="mt-4 block cursor-pointer rounded-xl border-2 border-dashed border-blue-300 p-6 text-center transition
                hover:border-blue-400 hover:bg-blue-50/50"
      >
        <div className="text-base font-medium">Click to select PDFs</div>
        <div className="mt-1 text-xs text-gray-500">
          or drag files into this window · drag thumbnails to reorder
        </div>
        <input
          id="pdf-input"
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>

      {/* Selected files / thumbnails */}
      {pdfItems.length > 0 && (
        <>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>
              {pdfItems.length} file{pdfItems.length > 1 ? "s" : ""} selected
            </span>
            <span className="hidden sm:inline">
              Tip: drag to change merge order
            </span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* If you import rectSortingStrategy, use it here for grid sorting */}
            <SortableContext
              items={pdfItems.map((item) => item.id)}
              // strategy={rectSortingStrategy}
              strategy={verticalListSortingStrategy} // ← keep if you haven't imported rectSortingStrategy
            >
              {/* GRID: swap to a column list if sticking with verticalListSortingStrategy */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 gap-3">
                {pdfItems.map((item, idx) => (
                  <div key={item.id} className="group relative">
                    {/* order badge */}
                    <span
                      className="absolute -top-2 -left-2 z-10 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full
                                   bg-blue-600 px-2 text-xs font-semibold text-white shadow"
                    >
                      {idx + 1}
                    </span>

                    {/* draggable card */}
                    <SortableItem
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}

      {/* Actions */}
      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {mergedBlob ? (
          <a
            href={URL.createObjectURL(mergedBlob)}
            download="merged.pdf"
            className="inline-flex items-center justify-center rounded-md border border-green-600 px-4 py-2.5 text-sm font-medium
                 text-green-700 hover:bg-green-50"
          >
            📩 Download merged.pdf
          </a>
        ) : (
          <div className="text-xs text-gray-500" aria-live="polite">
            {isMerging
              ? `Merging… ${progress}%`
              : "Your merged file will appear here when ready."}
          </div>
        )}

        <button
          onClick={mergePDFs}
          disabled={!pdfItems.length || isMerging}
          className="inline-flex items-center gap-2 justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
               shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isMerging ? (
            <>
              <InlineSpinner /> Merging…
            </>
          ) : (
            "Merge PDFs"
          )}
        </button>
      </div>

      {/* Progress bar (visible only while merging) */}
      {isMerging && (
        <div className="mt-3" aria-hidden="true">
          <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
            <div
              className="h-2 bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}

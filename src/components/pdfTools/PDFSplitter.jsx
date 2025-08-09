// src/components/pdfTools/PDFSplitter.jsx
import { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
// Keep your current import style
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";

// Keep your current worker setup (unchanged)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFSplitter() {
  const [file, setFile] = useState(null); // { file: File, bytes: ArrayBuffer }
  const [range, setRange] = useState("");
  const [outputBlob, setOutputBlob] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState(null);

  const canvasContainer = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setOutputBlob(null);
    setPdf(null);
    setIsRendering(true);

    try {
      // Read bytes ONCE and keep them for pdf-lib
      const bytes = await selectedFile.arrayBuffer();

      // Load metadata with pdf-lib
      const loaded = await PDFDocument.load(bytes);
      setFile({ file: selectedFile, bytes });
      setTotalPages(loaded.getPageCount());

      // IMPORTANT: give PDF.js its own copy to avoid detachment
      const previewBytes = bytes.slice(0);

      // Load using PDF.js for page previews
      const loadingTask = pdfjsLib.getDocument({ data: previewBytes });
      const pdfLoaded = await loadingTask.promise;
      setPdf(pdfLoaded);
    } catch (err) {
      console.error(err);
      setError("Unable to load the PDF. Please try a different file.");
      setIsRendering(false);
    }
  };

  const renderPreviews = async () => {
    if (!pdf || !canvasContainer.current) return;

    // Clear existing canvases
    canvasContainer.current.innerHTML = "";

    try {
      // Render all pages as thumbnails
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 0.6 }); // render crisply, then shrink via CSS

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        // HiDPI sizing
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        // CSS thumbnail size (keeps a true "thumb" look)
        canvas.style.width = "120px";
        canvas.style.height = "auto";

        await page.render({
          canvasContext: ctx,
          viewport,
          transform: [dpr, 0, 0, dpr, 0, 0],
        }).promise;

        const wrapper = document.createElement("div");
        wrapper.className = "inline-flex flex-col items-center m-1 align-top";
        const label = document.createElement("div");
        label.className = "text-[11px] mb-1 text-gray-500";
        label.textContent = `Page ${pageNum}`;

        // single thin border, no heavy shadow
        canvas.className = "border border-gray-300 rounded-sm";

        wrapper.appendChild(label);
        wrapper.appendChild(canvas);
        canvasContainer.current.appendChild(wrapper);
      }
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    if (pdf) renderPreviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf]);

  const parseRange = (input, total) => {
    const pages = new Set();
    if (!input?.trim()) return [];

    input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((part) => {
        if (part.includes("-")) {
          const [rawStart, rawEnd] = part.split("-").map((n) => n.trim());
          const start = Math.max(1, parseInt(rawStart, 10));
          const end = Math.min(total, parseInt(rawEnd, 10));
          if (!Number.isNaN(start) && !Number.isNaN(end) && start <= end) {
            for (let i = start; i <= end; i++) pages.add(i - 1);
          }
        } else {
          const page = parseInt(part, 10);
          if (!Number.isNaN(page) && page >= 1 && page <= total) {
            pages.add(page - 1);
          }
        }
      });

    return Array.from(pages).sort((a, b) => a - b);
  };

  const splitPDF = async () => {
    if (!file) return;

    const pagesToExtract = parseRange(range, totalPages || 0);
    if (pagesToExtract.length === 0) {
      setError("Please enter a valid page range (e.g., 1-3, 5, 7-9).");
      return;
    }

    setIsSplitting(true);
    setError(null);
    setOutputBlob(null);

    try {
      // Use the original, untouched bytes for pdf-lib
      const sourcePdf = await PDFDocument.load(file.bytes);
      const splitPdf = await PDFDocument.create();

      const copiedPages = await splitPdf.copyPages(sourcePdf, pagesToExtract);
      copiedPages.forEach((p) => splitPdf.addPage(p));

      const pdfBytes = await splitPdf.save();
      setOutputBlob(new Blob([pdfBytes], { type: "application/pdf" }));
    } catch (err) {
      console.error(err);
      setError("Failed to extract pages. Please try again.");
    } finally {
      setIsSplitting(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setRange("");
    setOutputBlob(null);
    setTotalPages(null);
    setPdf(null);
    setError(null);
    if (canvasContainer.current) canvasContainer.current.innerHTML = "";
  };

  return (
    <div className="p-4 sm:p-5 rounded-lg shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">⛓ Split PDF by Page Range</h2>
        {file && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs md:text-sm text-pink-700 bg-red-100 px-2 py-1 rounded-md hover:text-pink-400"
            disabled={isRendering || isSplitting}
          >
            Clear
          </button>
        )}
      </div>

      {/* File input */}
      <label
        htmlFor="splitter-input"
        className="mt-3 block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-5 text-center transition
                   hover:border-blue-400 hover:bg-blue-50/50"
      >
        <div className="text-sm font-medium">Click to select a PDF</div>
        <div className="mt-1 text-xs text-gray-500">
          (Optional) Drag the file into this window
        </div>
        <input
          id="splitter-input"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="sr-only"
          disabled={isRendering || isSplitting}
        />
      </label>

      {/* Meta + helper */}
      {totalPages && (
        <div className="mt-3 text-sm text-gray-600">
          Total Pages: <span className="font-medium">{totalPages}</span>
        </div>
      )}

      {/* Range input */}
      <div className="mt-3">
        <input
          type="text"
          placeholder="e.g. 1-3, 5, 7-9"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && splitPDF()}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!file || isSplitting}
          aria-describedby="range-help"
        />
        <p id="range-help" className="mt-1 text-xs text-gray-500">
          Tip: Use commas to separate ranges and single pages. Example:{" "}
          <span className="font-mono">1-3, 5, 7-9</span>
        </p>
      </div>

      {/* Primary action + status */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {outputBlob ? (
          <a
            href={URL.createObjectURL(outputBlob)}
            download="extracted.pdf"
            className="inline-flex items-center justify-center rounded-md border border-green-600 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
          >
            📩 Download extracted.pdf
          </a>
        ) : (
          <div className="text-xs text-gray-500" aria-live="polite">
            {isSplitting
              ? "Extracting pages…"
              : "Your extracted file will appear here."}
          </div>
        )}

        <button
          onClick={splitPDF}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!file || !range || isSplitting}
        >
          {isSplitting ? "Extracting…" : "Extract Pages"}
        </button>
      </div>

      {/* Progress / error */}
      {isRendering && (
        <div className="mt-3 text-xs text-gray-500" aria-live="polite">
          Generating previews…
        </div>
      )}
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      {/* Previews */}
      <div className="mt-5">
        <h3 className="font-medium mb-2 text-sm">👁️‍🗨️ Preview Pages</h3>
        <div
          ref={canvasContainer}
          // thin border, rounded, light padding; horizontal scroll if many
          className="overflow-x-auto whitespace-nowrap   rounded-md p-2 bg-white"
        />
      </div>
    </div>
  );
}

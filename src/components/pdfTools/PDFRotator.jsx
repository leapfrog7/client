import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";

// Keep worker pattern consistent with your project:
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFRotator() {
  const [file, setFile] = useState(null); // { file: File, bytes: ArrayBuffer }
  const [totalPages, setTotalPages] = useState(null);
  const [thumbs, setThumbs] = useState([]); // [{ page, url }]
  const [isRendering, setIsRendering] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState(null);

  // Live preview rotations (degrees) per page index (0..n-1)
  const [rotations, setRotations] = useState([]); // e.g., [0,90,0,270,...]

  // UI angle chooser for “rotate all” action
  const [bulkAngle, setBulkAngle] = useState(90);

  // ---- File handling & preview generation ----
  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    reset();
    setIsRendering(true);
    setError(null);

    try {
      const bytes = await selected.arrayBuffer();

      // pdf-lib for metadata
      const pdf = await PDFDocument.load(bytes);
      const count = pdf.getPageCount();
      setFile({ file: selected, bytes });
      setTotalPages(count);
      setRotations(Array.from({ length: count }, () => 0));

      // PDF.js thumbnails (use a COPY to avoid ArrayBuffer detachment)
      const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
      const doc = await loadingTask.promise;

      const next = [];
      for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const viewport = page.getViewport({ scale: 0.6 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;

        await page.render({
          canvasContext: ctx,
          viewport,
          transform: [dpr, 0, 0, dpr, 0, 0],
        }).promise;

        next.push({ page: p, url: canvas.toDataURL("image/png") });
      }
      setThumbs(next);
    } catch (err) {
      console.error(err);
      setError("Unable to load PDF. Please choose a valid file.");
    } finally {
      setIsRendering(false);
    }
  };

  // ---- Live preview rotation helpers ----
  const rotateOne = (idx, delta) => {
    setRotations((prev) => {
      const next = [...prev];
      next[idx] = (((next[idx] + delta) % 360) + 360) % 360;
      return next;
    });
  };

  const rotateAll = (delta) => {
    setRotations((prev) => prev.map((d) => (((d + delta) % 360) + 360) % 360));
  };

  const resetRotations = () => {
    setRotations((prev) => prev.map(() => 0));
  };

  // ---- Apply rotation to PDF and download ----
  const applyRotation = async () => {
    if (!file || !totalPages) return;
    if (!rotations.some((d) => d !== 0)) {
      setError("No changes to apply. Rotate pages first.");
      return;
    }

    setIsApplying(true);
    setError(null);

    try {
      // Read fresh bytes (avoid detached ArrayBuffer)
      const fresh = await file.file.arrayBuffer();
      const doc = await PDFDocument.load(fresh);
      const pages = doc.getPages();

      // Apply rotations as a delta to current page rotations
      rotations.forEach((delta, i) => {
        if (!delta) return;
        const current = pages[i].getRotation().angle || 0;
        pages[i].setRotation(degrees((current + delta) % 360));
      });

      const out = await doc.save();
      const blob = new Blob([out], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "rotated.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 30000);
    } catch (err) {
      console.error(err);
      setError("Failed to apply rotation. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  // ---- Reset UI ----
  const reset = () => {
    setFile(null);
    setTotalPages(null);
    setThumbs([]);
    setRotations([]);
    setBulkAngle(90);
    setError(null);
    setIsRendering(false);
    setIsApplying(false);
  };

  // ---- UI ----
  return (
    <div className="p-4 sm:p-5 rounded-lg shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">🗘 Rotate PDF Pages</h2>
        {file && (
          <button
            type="button"
            onClick={reset}
            className="text-xs md:text-sm text-pink-700 bg-red-100 px-2 py-1 rounded-md hover:text-pink-400"
            disabled={isRendering || isApplying}
          >
            Clear
          </button>
        )}
      </div>

      {/* File input */}
      <label
        htmlFor="rotator-input"
        className="mt-3 block cursor-pointer rounded-xl border-2 border-dashed border-blue-300 p-5 text-center transition
                   hover:border-blue-400 hover:bg-blue-50/50"
      >
        <div className="text-sm font-medium">Click to select a PDF</div>
        <div className="mt-1 text-xs text-gray-500">
          (Optional) Drag the file into this window
        </div>
        <input
          id="rotator-input"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="sr-only"
          disabled={isRendering || isApplying}
        />
      </label>

      {totalPages && (
        <div className="mt-3 text-sm text-gray-600">
          Total Pages: <span className="font-medium">{totalPages}</span>
        </div>
      )}

      {/* Global rotation toolbar */}
      {file && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700">Rotate all previews:</span>
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={() => rotateAll(-90)}
            disabled={isApplying}
            title="Rotate all -90°"
          >
            ⟲
          </button>

          <select
            value={bulkAngle}
            onChange={(e) => setBulkAngle(parseInt(e.target.value, 10))}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            disabled={isApplying}
            aria-label="Choose rotation angle for all"
          >
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </select>

          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={() => rotateAll(bulkAngle)}
            disabled={isApplying}
            title={`Rotate all +${bulkAngle}°`}
          >
            Apply
          </button>

          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={resetRotations}
            disabled={isApplying}
            title="Reset all rotations"
          >
            Reset
          </button>
        </div>
      )}

      {/* Preview grid with per-page controls */}
      {file && (
        <div className="mt-4">
          <h3 className="font-medium mb-2 text-sm">
            👁️‍🗨️ Live Preview (click to control individual pages)
          </h3>
          {isRendering ? (
            <div className="text-xs text-gray-500">Generating previews…</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {thumbs.map(({ page, url }, i) => (
                <div
                  key={page}
                  className="group relative rounded-md border border-gray-200 bg-white p-2"
                  title={`Page ${page}`}
                >
                  {/* Badge */}
                  <span className="absolute -top-2 -left-2 z-10 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-gray-800 px-2 text-xs font-semibold text-white">
                    {page}
                  </span>

                  {/* Thumbnail with live rotation */}
                  <div className="relative mx-auto w-24 sm:w-28 md:w-32">
                    <img
                      src={url}
                      alt={`Page ${page}`}
                      className="w-full h-auto select-none"
                      style={{
                        transform: `rotate(${rotations[i]}deg)`,
                        transformOrigin: "50% 50%",
                        transition: "transform 150ms ease",
                      }}
                      draggable={false}
                    />
                    {/* Rotation chip */}
                    {rotations[i] !== 0 && (
                      <span className="absolute bottom-1 right-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white shadow">
                        {rotations[i]}°
                      </span>
                    )}
                  </div>

                  {/* Per‑page controls */}
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => rotateOne(i, -90)}
                      disabled={isApplying}
                      title="Rotate this page -90°"
                    >
                      ⟲ 90°
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => rotateOne(i, 90)}
                      disabled={isApplying}
                      title="Rotate this page +90°"
                    >
                      ⟳ 90°
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => rotateOne(i, 180)}
                      disabled={isApplying}
                      title="Rotate this page 180°"
                    >
                      180°
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs text-gray-500" aria-live="polite">
          {isApplying
            ? "Applying rotation…"
            : file
            ? "Preview shows the final orientation. Click ‘Apply Rotation’ to download."
            : "Choose a PDF to begin."}
        </div>

        <button
          onClick={applyRotation}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!file || isApplying}
        >
          {isApplying ? "Applying…" : "Apply Rotation"}
        </button>
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}

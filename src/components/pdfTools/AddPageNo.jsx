import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import useFileDrop from "../../assets/useFileDrop";
import { useRef, useEffect } from "react";

const POSITIONS = [
  { id: "top-left", label: "Top Left" },
  { id: "top-center", label: "Top Center" },
  { id: "top-right", label: "Top Right" },
  { id: "bottom-left", label: "Bottom Left" },
  { id: "bottom-center", label: "Bottom Center" },
  { id: "bottom-right", label: "Bottom Right" },
];

export default function AddPageNo() {
  const [file, setFile] = useState(null); // { file: File, bytes: ArrayBuffer }
  const [startFrom, setStartFrom] = useState(1);
  const [label, setLabel] = useState("Page"); // e.g., "Page", "Page No.", or "" for just numbers
  const [position, setPosition] = useState("bottom-right");
  const [fontSize, setFontSize] = useState(11);
  const [margin, setMargin] = useState(36); // ~0.5 inch at 72dpi
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputBlob, setOutputBlob] = useState(null);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(null);

  const previewRef = useRef(null);

  // A4-ish canvas (portrait) in CSS pixels; we’ll scale for DPR for sharpness
  const PREVIEW_W = 400; // px
  const PREVIEW_H = 566; // px (approx A4 aspect)

  const drawPreview = () => {
    const canvas = previewRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    // upscale backing store for crisp text
    canvas.width = PREVIEW_W * dpr;
    canvas.height = PREVIEW_H * dpr;
    canvas.style.width = `${PREVIEW_W}px`;
    canvas.style.height = `${PREVIEW_H}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, PREVIEW_W, PREVIEW_H);

    // page background
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, PREVIEW_W, PREVIEW_H);
    ctx.strokeRect(0.5, 0.5, PREVIEW_W - 1, PREVIEW_H - 1);

    // margin guides
    const m = margin; // your UI margin (in "px" we treat as preview pixels)
    ctx.strokeStyle = "#e5e7eb"; // gray-200
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(
      m + 0.5,
      m + 0.5,
      PREVIEW_W - 2 * m - 1,
      PREVIEW_H - 2 * m - 1
    );
    ctx.setLineDash([]);

    // text to render (use first page number as example)
    const n = startFrom || 1;
    const labelText = label?.trim() ? `${label.trim()} ${n}` : String(n);

    // measure text
    // Use a font visually close to PDF Helvetica at browser scale; scale size modestly
    const cssFontSize = Math.max(6, Math.min(24, Number(fontSize) || 11));
    ctx.font = `${cssFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
    ctx.fillStyle = "rgba(0,0,0,0.95)";
    ctx.textBaseline = "alphabetic";
    const textWidth = ctx.measureText(labelText).width;
    const textHeight = cssFontSize; // good enough for placement

    // helper to compute placement (mirrors your pdf-lib logic)
    const isTop = position.startsWith("top");
    // const isLeft = position.endsWith("left");
    const isCenter = position.endsWith("center");
    const isRight = position.endsWith("right");

    const y = isTop ? m + textHeight : PREVIEW_H - m;
    let x = m;
    if (isCenter) x = (PREVIEW_W - textWidth) / 2;
    if (isRight) x = PREVIEW_W - m - textWidth;

    // draw the text
    ctx.fillText(labelText, x, y);

    // tiny crosshair at baseline start for debugging (optional)
    ctx.strokeStyle = "#93c5fd"; // blue-300
    ctx.beginPath();
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x, y + 4);
    ctx.moveTo(x - 4, y);
    ctx.lineTo(x + 4, y);
    ctx.stroke();

    // legend
    ctx.fillStyle = "#6b7280"; // gray-500
    ctx.font =
      "12px system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif";
    ctx.fillText("Preview • page outline + margin guides", 8, PREVIEW_H - 8);
  };

  // redraw when these change
  useEffect(() => {
    drawPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, fontSize, margin, label, startFrom]);

  const loadSelectedFile = async (f) => {
    if (!f) return;
    setError(null);
    setOutputBlob(null);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes); // quick page-count check
      setPageCount(doc.getPageCount());
      setFile({ file: f, bytes });
    } catch (err) {
      console.error(err);
      setError("Unable to read PDF. Please choose a valid file.");
      setFile(null);
      setPageCount(null);
    }
  };

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    await loadSelectedFile(f);
  };

  const { handleDrop, handleDragOver } = useFileDrop((fileList) => {
    const first = fileList?.[0];
    if (first) loadSelectedFile(first);
  });
  const clearAll = () => {
    setFile(null);
    setOutputBlob(null);
    setError(null);
    setPageCount(null);
    setStartFrom(1);
    setLabel("Page");
    setPosition("bottom-right");
    setFontSize(11);
    setMargin(36);
  };

  const addPageNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setOutputBlob(null);

    try {
      // Load source
      const src = await PDFDocument.load(file.bytes);
      const helv = await src.embedFont(StandardFonts.Helvetica);

      const pages = src.getPages();
      const total = pages.length;

      // Helper: compute target (x, y) given position & text width
      const getXY = (page, textWidth, textHeight) => {
        const w = page.getWidth();
        const h = page.getHeight();
        const isTop = position.startsWith("top");
        const isLeft = position.endsWith("left");
        const isCenter = position.endsWith("center");
        const isRight = position.endsWith("right");

        const y = isTop ? h - margin - textHeight : margin;
        let x = margin;
        if (isCenter) x = (w - textWidth) / 2;
        if (isRight) x = w - margin - textWidth;
        if (isLeft) x = margin;
        return { x, y };
      };

      // Draw on each page
      for (let i = 0; i < total; i++) {
        const page = pages[i];
        const n = startFrom + i;

        const labelText = label?.trim() ? `${label.trim()} ${n}` : String(n);
        const textWidth = helv.widthOfTextAtSize(labelText, fontSize);
        const textHeight = fontSize; // simple approximation is fine

        const { x, y } = getXY(page, textWidth, textHeight);

        page.drawText(labelText, {
          x,
          y,
          size: fontSize,
          font: helv,
          color: rgb(0, 0, 0),
          opacity: 0.95,
        });
      }

      const out = await src.save();
      setOutputBlob(new Blob([out], { type: "application/pdf" }));
    } catch (err) {
      console.error(err);
      setError("Failed to add page numbers. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-lg shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">✍🏻 Add Page Numbers</h2>
        {file && (
          <button
            type="button"
            className="text-xs md:text-sm text-pink-700 bg-red-100 px-2 py-1 rounded-md hover:text-pink-400"
            onClick={clearAll}
            disabled={isProcessing}
          >
            Clear
          </button>
        )}
      </div>

      {/* Upload */}
      <label
        htmlFor="page-no-input"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }} // optional nicety
        className="mt-3 block cursor-pointer rounded-xl border-2 border-dashed border-blue-300 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
      >
        <div className="text-sm font-medium">Click to select a PDF</div>
        <div className="mt-1 text-xs text-gray-500">
          (Optional) Drag the file into this window
        </div>
        <input
          id="page-no-input"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="sr-only"
          disabled={isProcessing}
        />
      </label>

      {pageCount && (
        <div className="mt-3 text-sm text-gray-600">
          Total Pages: <span className="font-medium">{pageCount}</span>
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page Position
          </label>
          <div className="grid grid-cols-3 gap-2">
            {POSITIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPosition(p.id)}
                className={`rounded-md border px-3 py-2 text-xs md:text-sm ${
                  position === p.id
                    ? "border-blue-600 ring-2 ring-blue-200 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                disabled={!pageCount || isProcessing}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Choose where the page number appears.
          </p>
        </div>

        {/* Start from */}
        <div>
          <label
            htmlFor="startFrom"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start numbering from
          </label>
          <input
            id="startFrom"
            type="number"
            min={0}
            value={startFrom}
            onChange={(e) => setStartFrom(parseInt(e.target.value || "0", 10))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 21"
            disabled={!pageCount || isProcessing}
          />
          <p className="mt-1 text-xs text-gray-500">
            Useful when annexures are appended later and numbering must
            continue.
          </p>
        </div>

        {/* Label text */}
        <div>
          <label
            htmlFor="labelText"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Label text (optional)
          </label>
          <input
            id="labelText"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='e.g. "Page" or "Page No." (leave blank for just numbers)'
            disabled={!pageCount || isProcessing}
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty if you want only the number.
          </p>
        </div>

        {/* Advanced: font size & margin */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="fontSize"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Font size
            </label>
            <input
              id="fontSize"
              type="number"
              min={6}
              max={24}
              value={fontSize}
              onChange={(e) =>
                setFontSize(parseInt(e.target.value || "11", 10))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              disabled={!pageCount || isProcessing}
            />
          </div>
          <div>
            <label
              htmlFor="margin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Margin (px)
            </label>
            <input
              id="margin"
              type="number"
              min={12}
              max={96}
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value || "36", 10))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              disabled={!pageCount || isProcessing}
            />
          </div>
        </div>
        {/* Tiny live placement preview */}
        <div className="mt-6">
          <h3 className="font-medium mb-2 text-sm">
            👁️‍🗨️ Live placement preview
          </h3>
          <div className="inline-block rounded-md border border-gray-200 bg-white p-3">
            <canvas
              ref={previewRef}
              width={PREVIEW_W}
              height={PREVIEW_H}
              className="block rounded bg-white"
              aria-label="Preview of page number placement"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            The preview approximates PDF Helvetica and your margin in pixels.
            Final output uses exact PDF coordinates with the same logic.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {outputBlob ? (
          <a
            href={URL.createObjectURL(outputBlob)}
            download="numbered.pdf"
            className="inline-flex items-center justify-center rounded-md border border-green-600 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
          >
            📩 Download numbered.pdf
          </a>
        ) : (
          <div className="text-xs text-gray-500" aria-live="polite">
            {isProcessing
              ? "Adding page numbers…"
              : "Your numbered file will appear here."}
          </div>
        )}

        <button
          onClick={addPageNumbers}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!file || isProcessing}
        >
          {isProcessing ? "Working…" : "Add Page Numbers"}
        </button>
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}

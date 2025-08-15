// src/components/pdfTools/PDFCompressor.jsx
import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { pdfjsLib } from "./pdfjsSetup";

export default function PDFCompressor() {
  const [file, setFile] = useState(null); // { file: File, bytes: ArrayBuffer }
  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState(null);

  const [preset, setPreset] = useState("standard"); // 'standard' | 'light' | 'aggressive' | 'custom'
  const [dpi, setDpi] = useState(150);
  const [quality, setQuality] = useState(0.6);
  const [grayscale, setGrayscale] = useState(false);

  const [targetMB, setTargetMB] = useState(20); // optional for "compress to target"
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [output, setOutput] = useState(null); // { blob, bytes, name }
  const cancelRef = useRef({ cancel: false });

  const formatBytes = (b) => {
    if (!Number.isFinite(b)) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0,
      n = b;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    return `${n.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
  };

  // Apply preset
  useEffect(() => {
    if (preset === "standard") {
      setDpi(150);
      setQuality(0.6);
    } else if (preset === "light") {
      setDpi(120);
      setQuality(0.55);
    } else if (preset === "aggressive") {
      setDpi(100);
      setQuality(0.5);
    }
  }, [preset]);

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setError(null);
    setOutput(null);
    setProgress(0);
    cancelRef.current.cancel = false;

    try {
      const bytes = await f.arrayBuffer();
      // Use pdf-lib to get count quickly (cheap)
      const doc = await PDFDocument.load(bytes);
      setTotalPages(doc.getPageCount());
      setFile({ file: f, bytes });
    } catch (err) {
      console.error(err);
      setError("Unable to load the PDF. Please try a different file.");
    }
  };

  const dataURLToUint8 = (dataUrl) => {
    const base64 = dataUrl.split(",")[1] || "";
    const bin = atob(base64);
    const len = bin.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);
    return u8;
  };

  const toGray = (ctx, w, h) => {
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let p = 0; p < d.length; p += 4) {
      const y = (d[p] * 0.299 + d[p + 1] * 0.587 + d[p + 2] * 0.114) | 0;
      d[p] = d[p + 1] = d[p + 2] = y;
    }
    ctx.putImageData(img, 0, 0);
  };

  // One full compression pass with given params
  const compressOnce = async ({ dpi, quality, grayscale }, onPage) => {
    const loadingTask = pdfjsLib.getDocument({ data: file.bytes.slice(0) });
    const pdf = await loadingTask.promise;
    const out = await PDFDocument.create();
    const pages = pdf.numPages;

    // Create one canvas and reuse
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: grayscale });

    for (let i = 1; i <= pages; i++) {
      if (cancelRef.current.cancel) throw new Error("cancelled");
      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale: dpi / 72 });

      // Ensure minimum dims to avoid zero-sized pages
      const w = Math.max(1, Math.floor(vp.width));
      const h = Math.max(1, Math.floor(vp.height));

      canvas.width = w;
      canvas.height = h;

      const renderTask = page.render({ canvasContext: ctx, viewport: vp });
      await renderTask.promise;

      if (grayscale) toGray(ctx, w, h);

      const dataUrl = canvas.toDataURL(
        "image/jpeg",
        Math.min(0.95, Math.max(0.35, quality))
      );
      const jpgBytes = dataURLToUint8(dataUrl);
      const jpg = await out.embedJpg(jpgBytes);
      const docPage = out.addPage([vp.width, vp.height]);
      docPage.drawImage(jpg, {
        x: 0,
        y: 0,
        width: vp.width,
        height: vp.height,
      });

      // free canvas memory for next page
      ctx.clearRect(0, 0, w, h);

      if (onPage) {
        onPage(i, pages);
        // let UI paint
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => requestAnimationFrame(r));
      }
    }

    const bytes = await out.save({ useObjectStreams: true });
    return bytes;
  };

  const doCompress = async () => {
    if (!file) return;
    setIsCompressing(true);
    setProgress(0);
    setError(null);
    setOutput(null);
    cancelRef.current.cancel = false;

    try {
      const baseName = (file.file.name || "document").replace(/\.pdf$/i, "");
      const bytes = await compressOnce(
        { dpi, quality, grayscale },
        (i, total) => setProgress(Math.round((i / total) * 100))
      );

      const blob = new Blob([bytes], { type: "application/pdf" });
      setOutput({ blob, bytes, name: `${baseName}-compressed.pdf` });
      setProgress(100);
    } catch (err) {
      if (err?.message === "cancelled") {
        setError("Compression cancelled.");
      } else {
        console.error(err);
        setError(
          "Compression failed. Try a lighter preset or lower DPI/quality."
        );
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const doCompressToTarget = async () => {
    if (!file) return;
    const targetBytes = Math.max(1, Number(targetMB) || 0) * 1024 * 1024;

    setIsCompressing(true);
    setProgress(0);
    setError(null);
    setOutput(null);
    cancelRef.current.cancel = false;

    // Try a small quality ladder (fewer re-renders; simple & robust)
    // Start from current quality, then go down.
    const ladder = Array.from(
      new Set([Number(quality), 0.6, 0.55, 0.5, 0.45, 0.4])
    )
      .filter((q) => q > 0.3 && q <= 0.95)
      .sort((a, b) => b - a);

    try {
      const baseName = (file.file.name || "document").replace(/\.pdf$/i, "");
      let best = null;

      for (let attempt = 0; attempt < ladder.length; attempt++) {
        const q = ladder[attempt];

        // Map progress window for this attempt (so bar moves forward even across retries)
        // e.g., 4 attempts → each allocates 25% of the bar for its pages
        const spanStart = Math.floor((attempt / ladder.length) * 100);
        const spanEnd = Math.floor(((attempt + 1) / ladder.length) * 100);

        const bytes = await compressOnce(
          { dpi, quality: q, grayscale },
          (i, total) => {
            const pct =
              Math.round((i / total) * (spanEnd - spanStart)) + spanStart;
            setProgress(Math.min(99, pct));
          }
        );

        if (bytes.byteLength <= targetBytes) {
          best = { bytes, q };
          break;
        }

        // Keep the smallest we have so far as fallback
        if (!best || bytes.byteLength < best.bytes.byteLength) {
          best = { bytes, q };
        }

        if (cancelRef.current.cancel) throw new Error("cancelled");
      }

      if (!best) throw new Error("no-output");
      const blob = new Blob([best.bytes], { type: "application/pdf" });
      setOutput({
        blob,
        bytes: best.bytes,
        name: `${baseName}-compressed-${
          Math.round((best.bytes.byteLength / 1024 / 1024) * 100) / 100
        }MB.pdf`,
      });
      setProgress(100);
    } catch (err) {
      if (err?.message === "cancelled") {
        setError("Compression cancelled.");
      } else {
        console.error(err);
        setError("Could not reach target size. Try a lower quality or DPI.");
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const cancel = () => {
    cancelRef.current.cancel = true;
  };

  const clearAll = () => {
    setFile(null);
    setTotalPages(null);
    setError(null);
    setOutput(null);
    setIsCompressing(false);
    setProgress(0);
    cancelRef.current.cancel = false;
  };

  return (
    <div className="p-4 sm:p-5 rounded-lg shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">🗜️ PDF Compressor</h2>
        {file && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs md:text-sm text-pink-700 bg-red-100 px-2 py-1 rounded-md hover:text-pink-400"
            disabled={isCompressing}
          >
            Clear
          </button>
        )}
      </div>

      {/* File input */}
      <label
        htmlFor="compressor-input"
        className="mt-3 block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
      >
        <div className="text-sm font-medium">Click to select a PDF</div>
        <div className="mt-1 text-xs text-gray-500">
          (Optional) Drag the file into this window
        </div>
        <input
          id="compressor-input"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="sr-only"
          disabled={isCompressing}
        />
      </label>

      {/* Meta */}
      {(file || totalPages) && (
        <div className="mt-3 text-sm text-gray-700 space-y-1">
          {totalPages && (
            <div>
              {" "}
              Total Pages: <span className="font-medium">{totalPages}</span>
            </div>
          )}
          {file?.file && (
            <div>
              {" "}
              File Size:{" "}
              <span className="font-medium">{formatBytes(file.file.size)}</span>
            </div>
          )}
        </div>
      )}

      {/* Options */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="font-medium">Preset</div>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="preset"
                value="standard"
                checked={preset === "standard"}
                onChange={() => setPreset("standard")}
                disabled={!file || isCompressing}
              />
              <span>Standard (150 DPI / 0.6)</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="preset"
                value="light"
                checked={preset === "light"}
                onChange={() => setPreset("light")}
                disabled={!file || isCompressing}
              />
              <span>Light (120 / 0.55)</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="preset"
                value="aggressive"
                checked={preset === "aggressive"}
                onChange={() => setPreset("aggressive")}
                disabled={!file || isCompressing}
              />
              <span>Aggressive (100 / 0.5)</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="preset"
                value="custom"
                checked={preset === "custom"}
                onChange={() => setPreset("custom")}
                disabled={!file || isCompressing}
              />
              <span>Custom</span>
            </label>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 mb-1">DPI</label>
              <input
                type="number"
                min="72"
                max="300"
                step="1"
                value={dpi}
                onChange={(e) => setDpi(Number(e.target.value))}
                disabled={!file || isCompressing || preset !== "custom"}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">
                JPEG Quality (0.35–0.95)
              </label>
              <input
                type="number"
                min="0.35"
                max="0.95"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={!file || isCompressing || preset !== "custom"}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <label className="mt-2 inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={grayscale}
              onChange={(e) => setGrayscale(e.target.checked)}
              disabled={!file || isCompressing}
            />
            <span>Convert to grayscale (smaller files)</span>
          </label>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Target Size (optional)</div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              step="1"
              value={targetMB}
              onChange={(e) => setTargetMB(e.target.value)}
              disabled={!file || isCompressing}
              className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-500">
              eOffice cap is typically 20 MB.
            </span>
          </div>
        </div>
      </div>

      {/* Actions + output */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {output ? (
          <a
            href={URL.createObjectURL(output.blob)}
            download={output.name || "compressed.pdf"}
            className="inline-flex items-center gap-2 rounded-md border border-green-600 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
          >
            📩 Download {output.name || "compressed.pdf"}
            <span className="text-xs text-gray-500">
              ({formatBytes(output.bytes.byteLength)})
            </span>
          </a>
        ) : (
          <div className="text-xs text-gray-500" aria-live="polite">
            {isCompressing
              ? "Compressing…"
              : "Your compressed file will appear here."}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={doCompress}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!file || isCompressing}
          >
            {isCompressing ? "Compressing…" : "Compress"}
          </button>
          <button
            onClick={doCompressToTarget}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!file || isCompressing}
            title="Tries a few lower qualities to meet size"
          >
            {isCompressing ? "Working…" : "Compress to Target"}
          </button>
          {isCompressing && (
            <button
              onClick={cancel}
              className="inline-flex items-center justify-center rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Progress / error */}
      {isCompressing && (
        <div
          className="mt-2"
          aria-live="polite"
          aria-label="Compression progress"
        >
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";

// Page presets (points). 1in = 72pt. A4: 8.27×11.69in
const PAGE_SIZES = {
  A4: { w: 595.28, h: 841.89 }, // 210×297 mm
  Letter: { w: 612, h: 792 }, // 8.5×11 in
};

const mmToPt = (mm) => (mm / 25.4) * 72;

export default function ImageToPDF() {
  const [items, setItems] = useState([]); // [{ id, file, bytes, url, w, h, type }]
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  // Options
  const [pagePreset, setPagePreset] = useState("A4");
  const [orientation, setOrientation] = useState("auto"); // 'auto' | 'portrait' | 'landscape'
  const [marginMm, setMarginMm] = useState(12); // ~0.5 inch default
  const [fit, setFit] = useState("contain"); // 'contain' | 'cover' | 'stretch'
  const [bgColor, setBgColor] = useState("#FFFFFF"); // page background (useful for PNG with transparency)

  const marginPt = useMemo(
    () => Math.max(0, mmToPt(Number(marginMm) || 0)),
    [marginMm]
  );

  // Helpers
  const readImageMeta = (file) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = async () => {
        try {
          const bytes = await file.arrayBuffer();
          resolve({
            url,
            w: img.naturalWidth,
            h: img.naturalHeight,
            bytes,
            type: file.type, // 'image/jpeg' | 'image/png'
          });
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleFiles = async (files) => {
    setError(null);
    setPdfBlob(null);
    try {
      const list = Array.from(files).filter(
        (f) =>
          /image\/(jpeg|jpg|png)/i.test(f.type) ||
          /\.(jpe?g|png)$/i.test(f.name)
      );

      if (!list.length) {
        setError("Please select JPG, JPEG, or PNG images.");
        return;
      }

      // Read metadata in sequence to avoid spiky memory on huge batches
      const out = [];
      for (let i = 0; i < list.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const meta = await readImageMeta(list[i]);
        out.push({
          id: `${Date.now()}-${i}`,
          file: list[i],
          ...meta,
        });
      }
      setItems((prev) => [...prev, ...out]);
    } catch (e) {
      console.error(e);
      setError("Unable to read one or more images. Please try again.");
    }
  };

  const onFileChange = (e) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = ""; // allow selecting same files again
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const move = (index, dir) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeAt = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const clearAll = () => {
    items.forEach((it) => URL.revokeObjectURL(it.url));
    setItems([]);
    setPdfBlob(null);
    setError(null);
    setProgress(0);
  };

  useEffect(() => {
    // Revoke blob URLs on unmount
    return () => items.forEach((it) => URL.revokeObjectURL(it.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildPdf = async () => {
    if (!items.length) return;
    setIsBuilding(true);
    setProgress(0);
    setError(null);
    setPdfBlob(null);

    try {
      const doc = await PDFDocument.create();
      const pageBase = PAGE_SIZES[pagePreset];

      for (let i = 0; i < items.length; i++) {
        const { bytes, type, w: imgW, h: imgH } = items[i];

        // Orientation per image if 'auto'
        const autoLandscape = imgW > imgH;
        const pageLandscape =
          orientation === "landscape" ||
          (orientation === "auto" && autoLandscape);

        const pageSize = pageLandscape
          ? { width: pageBase.h, height: pageBase.w }
          : { width: pageBase.w, height: pageBase.h };

        const page = doc.addPage([pageSize.width, pageSize.height]);

        // Background (for PNG transparency or non-white pages)
        const [r, g, b] = [
          parseInt(bgColor.slice(1, 3), 16) / 255,
          parseInt(bgColor.slice(3, 5), 16) / 255,
          parseInt(bgColor.slice(5, 7), 16) / 255,
        ];
        page.drawRectangle({
          x: 0,
          y: 0,
          width: pageSize.width,
          height: pageSize.height,
          color: rgb(r, g, b),
        });

        // Available drawing area (respect margins)
        const availW = Math.max(0, pageSize.width - marginPt * 2);
        const availH = Math.max(0, pageSize.height - marginPt * 2);

        // Embed image
        const img = /png$/i.test(type)
          ? await doc.embedPng(bytes)
          : await doc.embedJpg(bytes);

        const intrinsicW = imgW || img.width;
        const intrinsicH = imgH || img.height;

        // Compute target size
        let drawW = availW;
        let drawH = (intrinsicH / intrinsicW) * drawW;

        if (fit === "contain") {
          // scale down to fit within both bounds (preserve aspect)
          if (drawH > availH) {
            drawH = availH;
            drawW = (intrinsicW / intrinsicH) * drawH;
          }
        } else if (fit === "cover") {
          // fill the box fully (may crop when centering; we simulate by scaling larger then centering)
          const scale = Math.max(availW / intrinsicW, availH / intrinsicH);
          drawW = intrinsicW * scale;
          drawH = intrinsicH * scale;
        } else if (fit === "stretch") {
          // force to box, ignore aspect ratio
          drawW = availW;
          drawH = availH;
        }

        const x = marginPt + (availW - drawW) / 2;
        const y = marginPt + (availH - drawH) / 2;

        page.drawImage(img, {
          x,
          y,
          width: drawW,
          height: drawH,
        });

        setProgress(Math.round(((i + 1) / items.length) * 100));
        // Let UI update
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 0));
      }

      const bytes = await doc.save();
      setPdfBlob(new Blob([bytes], { type: "application/pdf" }));
    } catch (e) {
      console.error(e);
      setError("Failed to build the PDF. Please try again.");
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-lg shadow-sm bg-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">🖼️ Images → PDF</h2>
          <p className="text-sm text-gray-500">
            Works offline · Private · JPG/JPEG/PNG
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4 disabled:opacity-50"
            disabled={isBuilding}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Upload area */}
      <label
        htmlFor="img-to-pdf-input"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="mt-3 block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
      >
        <div className="text-sm font-medium">Click to select images</div>
        <div className="mt-1 text-xs text-gray-500">
          JPG / JPEG / PNG · You can select multiple · Drag files here too
        </div>
        <input
          id="img-to-pdf-input"
          type="file"
          accept="image/png,image/jpeg"
          multiple
          onChange={onFileChange}
          className="sr-only"
          disabled={isBuilding}
        />
      </label>

      {/* Options */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page size
            </label>
            <select
              value={pagePreset}
              onChange={(e) => setPagePreset(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              disabled={isBuilding}
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orientation
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              disabled={isBuilding}
            >
              <option value="auto">Auto (per image)</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Margin (mm)
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={marginMm}
              onChange={(e) => setMarginMm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              disabled={isBuilding}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fit mode
            </label>
            <select
              value={fit}
              onChange={(e) => setFit(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              disabled={isBuilding}
            >
              <option value="contain">Contain (no crop)</option>
              <option value="cover">Cover (fill page)</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page color
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-[38px] w-full rounded-md border border-gray-300"
              disabled={isBuilding}
              title="Background color (for transparent PNGs)"
            />
          </div>
        </div>
      </div>

      {/* Selected thumbnails */}
      {items.length > 0 && (
        <>
          <div className="mt-4 text-xs text-gray-500">
            {items.length} image{items.length > 1 ? "s" : ""} selected. Use ▲/▼
            to reorder.
          </div>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="group relative rounded-md border border-gray-200 bg-white p-2"
                title={it.file.name}
              >
                {/* Order badge */}
                <span className="absolute -top-2 -left-2 z-10 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-gray-800 px-2 text-xs font-semibold text-white">
                  {idx + 1}
                </span>

                <img
                  src={it.url}
                  alt={it.file.name}
                  className="mx-auto w-24 sm:w-28 md:w-32 h-auto select-none"
                  draggable={false}
                />

                <div className="mt-2 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0 || isBuilding}
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => move(idx, +1)}
                    disabled={idx === items.length - 1 || isBuilding}
                    title="Move down"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                    onClick={() => removeAt(idx)}
                    disabled={isBuilding}
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {pdfBlob ? (
          <a
            href={URL.createObjectURL(pdfBlob)}
            download="images.pdf"
            className="inline-flex items-center justify-center rounded-md border border-green-600 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
          >
            📩 Download images.pdf
          </a>
        ) : (
          <div className="text-xs text-gray-500" aria-live="polite">
            {isBuilding
              ? `Building PDF… ${progress}%`
              : "Your PDF will appear here when ready."}
          </div>
        )}

        <button
          onClick={buildPdf}
          disabled={!items.length || isBuilding}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isBuilding ? "Building…" : "Create PDF"}
        </button>
      </div>

      {/* Progress + error */}
      {isBuilding && (
        <div className="mt-3" aria-hidden="true">
          <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
            <div
              className="h-2 bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}

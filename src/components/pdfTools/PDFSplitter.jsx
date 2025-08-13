// // src/components/pdfTools/PDFSplitter.jsx
// import { useState, useRef, useEffect } from "react";
// import { PDFDocument } from "pdf-lib";
// // Keep your current import style
// // import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";

// // // Keep your current worker setup (unchanged)
// // pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
// //   "pdfjs-dist/build/pdf.worker.min.mjs",
// //   import.meta.url
// // ).toString();

// import { pdfjsLib } from "./pdfjsSetup";

// export default function PDFSplitter() {
//   const [file, setFile] = useState(null); // { file: File, bytes: ArrayBuffer }
//   const [range, setRange] = useState("");
//   const [outputBlob, setOutputBlob] = useState(null);
//   const [totalPages, setTotalPages] = useState(null);
//   const [pdf, setPdf] = useState(null);
//   const [isRendering, setIsRendering] = useState(false);
//   const [isSplitting, setIsSplitting] = useState(false);
//   const [error, setError] = useState(null);

//   const canvasContainer = useRef(null);

//   const handleFileChange = async (e) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     setError(null);
//     setOutputBlob(null);
//     setPdf(null);
//     setIsRendering(true);

//     try {
//       // Read bytes ONCE and keep them for pdf-lib
//       const bytes = await selectedFile.arrayBuffer();

//       // Load metadata with pdf-lib
//       const loaded = await PDFDocument.load(bytes);
//       setFile({ file: selectedFile, bytes });
//       setTotalPages(loaded.getPageCount());

//       // IMPORTANT: give PDF.js its own copy to avoid detachment
//       const previewBytes = bytes.slice(0);

//       // Load using PDF.js for page previews
//       const loadingTask = pdfjsLib.getDocument({ data: previewBytes });
//       const pdfLoaded = await loadingTask.promise;
//       setPdf(pdfLoaded);
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load the PDF. Please try a different file.");
//       setIsRendering(false);
//     }
//   };

//   const renderPreviews = async () => {
//     if (!pdf || !canvasContainer.current) return;

//     // Clear existing canvases
//     canvasContainer.current.innerHTML = "";

//     try {
//       // Render all pages as thumbnails
//       for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//         const page = await pdf.getPage(pageNum);
//         const viewport = page.getViewport({ scale: 0.6 }); // render crisply, then shrink via CSS

//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");
//         const dpr = window.devicePixelRatio || 1;

//         // HiDPI sizing
//         canvas.width = viewport.width * dpr;
//         canvas.height = viewport.height * dpr;
//         // CSS thumbnail size (keeps a true "thumb" look)
//         canvas.style.width = "120px";
//         canvas.style.height = "auto";

//         await page.render({
//           canvasContext: ctx,
//           viewport,
//           transform: [dpr, 0, 0, dpr, 0, 0],
//         }).promise;

//         const wrapper = document.createElement("div");
//         wrapper.className = "inline-flex flex-col items-center m-1 align-top";
//         const label = document.createElement("div");
//         label.className = "text-[11px] mb-1 text-gray-500";
//         label.textContent = `Page ${pageNum}`;

//         // single thin border, no heavy shadow
//         canvas.className = "border border-gray-300 rounded-sm";

//         wrapper.appendChild(label);
//         wrapper.appendChild(canvas);
//         canvasContainer.current.appendChild(wrapper);
//       }
//     } finally {
//       setIsRendering(false);
//     }
//   };

//   useEffect(() => {
//     if (pdf) renderPreviews();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pdf]);

//   const parseRange = (input, total) => {
//     const pages = new Set();
//     if (!input?.trim()) return [];

//     input
//       .split(",")
//       .map((s) => s.trim())
//       .filter(Boolean)
//       .forEach((part) => {
//         if (part.includes("-")) {
//           const [rawStart, rawEnd] = part.split("-").map((n) => n.trim());
//           const start = Math.max(1, parseInt(rawStart, 10));
//           const end = Math.min(total, parseInt(rawEnd, 10));
//           if (!Number.isNaN(start) && !Number.isNaN(end) && start <= end) {
//             for (let i = start; i <= end; i++) pages.add(i - 1);
//           }
//         } else {
//           const page = parseInt(part, 10);
//           if (!Number.isNaN(page) && page >= 1 && page <= total) {
//             pages.add(page - 1);
//           }
//         }
//       });

//     return Array.from(pages).sort((a, b) => a - b);
//   };

//   const splitPDF = async () => {
//     if (!file) return;

//     const pagesToExtract = parseRange(range, totalPages || 0);
//     if (pagesToExtract.length === 0) {
//       setError("Please enter a valid page range (e.g., 1-3, 5, 7-9).");
//       return;
//     }

//     setIsSplitting(true);
//     setError(null);
//     setOutputBlob(null);

//     try {
//       // Use the original, untouched bytes for pdf-lib
//       const sourcePdf = await PDFDocument.load(file.bytes);
//       const splitPdf = await PDFDocument.create();

//       const copiedPages = await splitPdf.copyPages(sourcePdf, pagesToExtract);
//       copiedPages.forEach((p) => splitPdf.addPage(p));

//       const pdfBytes = await splitPdf.save();
//       setOutputBlob(new Blob([pdfBytes], { type: "application/pdf" }));
//     } catch (err) {
//       console.error(err);
//       setError("Failed to extract pages. Please try again.");
//     } finally {
//       setIsSplitting(false);
//     }
//   };

//   const clearAll = () => {
//     setFile(null);
//     setRange("");
//     setOutputBlob(null);
//     setTotalPages(null);
//     setPdf(null);
//     setError(null);
//     if (canvasContainer.current) canvasContainer.current.innerHTML = "";
//   };

//   return (
//     <div className="p-4 sm:p-5 rounded-lg shadow-sm bg-white">
//       <div className="flex items-start justify-between gap-3">
//         <h2 className="text-lg font-semibold">⛓ Split PDF by Page Range</h2>
//         {file && (
//           <button
//             type="button"
//             onClick={clearAll}
//             className="text-xs md:text-sm text-pink-700 bg-red-100 px-2 py-1 rounded-md hover:text-pink-400"
//             disabled={isRendering || isSplitting}
//           >
//             Clear
//           </button>
//         )}
//       </div>

//       {/* File input */}
//       <label
//         htmlFor="splitter-input"
//         className="mt-3 block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-5 text-center transition
//                    hover:border-blue-400 hover:bg-blue-50/50"
//       >
//         <div className="text-sm font-medium">Click to select a PDF</div>
//         <div className="mt-1 text-xs text-gray-500">
//           (Optional) Drag the file into this window
//         </div>
//         <input
//           id="splitter-input"
//           type="file"
//           accept="application/pdf"
//           onChange={handleFileChange}
//           className="sr-only"
//           disabled={isRendering || isSplitting}
//         />
//       </label>

//       {/* Meta + helper */}
//       {totalPages && (
//         <div className="mt-3 text-sm text-gray-600">
//           Total Pages: <span className="font-medium">{totalPages}</span>
//         </div>
//       )}

//       {/* Range input */}
//       <div className="mt-3">
//         <input
//           type="text"
//           placeholder="e.g. 1-3, 5, 7-9"
//           value={range}
//           onChange={(e) => setRange(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && splitPDF()}
//           className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={!file || isSplitting}
//           aria-describedby="range-help"
//         />
//         <p id="range-help" className="mt-1 text-xs text-gray-500">
//           Tip: Use commas to separate ranges and single pages. Example:{" "}
//           <span className="font-mono">1-3, 5, 7-9</span>
//         </p>
//       </div>

//       {/* Primary action + status */}
//       <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         {outputBlob ? (
//           <a
//             href={URL.createObjectURL(outputBlob)}
//             download="extracted.pdf"
//             className="inline-flex items-center justify-center rounded-md border border-green-600 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
//           >
//             📩 Download extracted.pdf
//           </a>
//         ) : (
//           <div className="text-xs text-gray-500" aria-live="polite">
//             {isSplitting
//               ? "Extracting pages…"
//               : "Your extracted file will appear here."}
//           </div>
//         )}

//         <button
//           onClick={splitPDF}
//           className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//           disabled={!file || !range || isSplitting}
//         >
//           {isSplitting ? "Extracting…" : "Extract Pages"}
//         </button>
//       </div>

//       {/* Progress / error */}
//       {isRendering && (
//         <div className="mt-3 text-xs text-gray-500" aria-live="polite">
//           Generating previews…
//         </div>
//       )}
//       {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

//       {/* Previews */}
//       <div className="mt-5">
//         <h3 className="font-medium mb-2 text-sm">👁️‍🗨️ Preview Pages</h3>
//         <div
//           ref={canvasContainer}
//           // thin border, rounded, light padding; horizontal scroll if many
//           className="overflow-x-auto whitespace-nowrap   rounded-md p-2 bg-white"
//         />
//       </div>
//     </div>
//   );
// }

// src/components/pdfTools/PDFSplitter.jsx
import { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { pdfjsLib } from "./pdfjsSetup";

export default function PDFSplitter() {
  const [file, setFile] = useState(null); // { file: File, bytes: ArrayBuffer }
  const [range, setRange] = useState("");
  const [outputBlob, setOutputBlob] = useState(null); // for page-range mode
  const [outputs, setOutputs] = useState([]); // for size-split mode [{name, blob, bytes}]
  const [oversizePages, setOversizePages] = useState([]); // pages that exceed limit alone
  const [totalPages, setTotalPages] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState(null);
  // ADD
  const [progress, setProgress] = useState(0);

  const [mode, setMode] = useState("pages"); // 'pages' | 'size'
  const [maxSizeMB, setMaxSizeMB] = useState(20);

  const canvasContainer = useRef(null);

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

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setOutputBlob(null);
    setOutputs([]);
    setOversizePages([]);
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

  const splitPDFByRange = async () => {
    // ADD
    setProgress(0);

    if (!file) return;

    const pagesToExtract = parseRange(range, totalPages || 0);
    if (pagesToExtract.length === 0) {
      setError("Please enter a valid page range (e.g., 1-3, 5, 7-9).");
      return;
    }

    setIsSplitting(true);
    setError(null);
    setOutputBlob(null);
    setOutputs([]);
    setOversizePages([]);

    try {
      const sourcePdf = await PDFDocument.load(file.bytes);
      const splitPdf = await PDFDocument.create();

      for (let i = 0; i < pagesToExtract.length; i++) {
        const pageIndex = pagesToExtract[i];
        const [p] = await splitPdf.copyPages(sourcePdf, [pageIndex]);
        splitPdf.addPage(p);

        // progress update
        setProgress(Math.round(((i + 1) / pagesToExtract.length) * 100));
        // yield so UI can paint
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

      const pdfBytes = await splitPdf.save();
      setProgress(100);
      setOutputBlob(new Blob([pdfBytes], { type: "application/pdf" }));
    } catch (err) {
      console.error(err);
      setError("Failed to extract pages. Please try again.");
    } finally {
      setIsSplitting(false);
    }
  };

  const splitPDFBySize = async () => {
    if (!file) return;

    const maxBytesRaw = Math.max(1, Number(maxSizeMB) || 0) * 1024 * 1024;
    // Small safety buffer (~50 KB) to reduce accidental overage due to metadata etc.
    const maxBytes = Math.max(1, Math.floor(maxBytesRaw - 50 * 1024));

    setIsSplitting(true);
    setError(null);
    setOutputBlob(null);
    setOutputs([]);
    setOversizePages([]);
    setProgress(0);

    try {
      const baseName =
        (file?.file?.name && file.file.name.replace(/\.pdf$/i, "")) || "output";
      const src = await PDFDocument.load(file.bytes);
      const total = src.getPageCount();
      const parts = [];
      const oversize = [];

      let partIndex = 1;
      let current = await PDFDocument.create();

      const saveDoc = async (doc) => {
        const bytes = await doc.save();
        parts.push({
          name: `${baseName}-part-${partIndex}.pdf`,
          bytes,
          blob: new Blob([bytes], { type: "application/pdf" }),
        });
        partIndex += 1;
      };

      for (let i = 0; i < src.getPageCount(); i++) {
        const [page] = await current.copyPages(src, [i]);
        current.addPage(page);

        // Check size with the new page included
        let tmpBytes = await current.save();
        if (tmpBytes.byteLength > maxBytes) {
          // Remove the last page and finalize previous part if it has any pages
          current.removePage(current.getPageCount() - 1);

          if (current.getPageCount() > 0) {
            await saveDoc(current);
            current = await PDFDocument.create();

            // Start a new part with the page that didn't fit
            const [pageAgain] = await current.copyPages(src, [i]);
            current.addPage(pageAgain);

            tmpBytes = await current.save();
            if (tmpBytes.byteLength > maxBytes) {
              // Single page exceeds limit — record and still output as its own file
              oversize.push(i + 1); // 1-based page number
              await saveDoc(current);
              current = await PDFDocument.create();
            }
          } else {
            // Edge case: first page alone already exceeded the limit
            if (current.getPageCount() === 1) {
              oversize.push(i + 1);
              await saveDoc(current);
              current = await PDFDocument.create();
            }
          }
        }
        setProgress(Math.min(99, Math.round(((i + 1) / total) * 100)));
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

      if (current.getPageCount() > 0) {
        await saveDoc(current);
      }
      setProgress(100);
      setOutputs(parts);
      setOversizePages(oversize);
    } catch (err) {
      console.error(err);
      setError("Failed to split by size. Please try again.");
    } finally {
      setIsSplitting(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setRange("");
    setOutputBlob(null);
    setOutputs([]);
    setOversizePages([]);
    setTotalPages(null);
    setPdf(null);
    setError(null);
    setProgress(0);
    if (canvasContainer.current) canvasContainer.current.innerHTML = "";
  };

  const runAction = () => {
    if (mode === "pages") return splitPDFByRange();
    return splitPDFBySize();
  };

  return (
    <div className="p-4 sm:p-5 rounded-lg shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">⛓ PDF Splitter</h2>
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

      {/* Meta */}
      {(totalPages || file) && (
        <div className="mt-3 text-sm text-gray-700 space-y-1">
          {totalPages && (
            <div>
              Total Pages: <span className="font-medium">{totalPages}</span>
            </div>
          )}
          {file?.file && (
            <div>
              File Size:{" "}
              <span className="font-medium">{formatBytes(file.file.size)}</span>
            </div>
          )}
        </div>
      )}

      {/* Mode toggle */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="pages"
            checked={mode === "pages"}
            onChange={() => setMode("pages")}
            disabled={!file || isSplitting}
          />
          <span>Split by Page Range</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="size"
            checked={mode === "size"}
            onChange={() => setMode("size")}
            disabled={!file || isSplitting}
          />
          <span>Split by Size (MB)</span>
        </label>
      </div>

      {/* Range input */}
      {mode === "pages" && (
        <div className="mt-3">
          <input
            type="text"
            placeholder="e.g. 1-3, 5, 7-9"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && splitPDFByRange()}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!file || isSplitting}
            aria-describedby="range-help"
          />
          <p id="range-help" className="mt-1 text-xs text-gray-500">
            Tip: Use commas to separate ranges and single pages. Example:{" "}
            <span className="font-mono">1-3, 5, 7-9</span>
          </p>
        </div>
      )}

      {/* Size input */}
      {mode === "size" && (
        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">
            Max part size (MB)
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={maxSizeMB}
            onChange={(e) => setMaxSizeMB(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && splitPDFBySize()}
            className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!file || isSplitting}
          />
          <p className="mt-1 text-xs text-gray-500">
            eOffice cap is usually <span className="font-medium">20 MB</span>.
            We try to keep each part under the limit with a small safety buffer.
          </p>
        </div>
      )}

      {/* Primary action + status */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Downloads */}
        {mode === "pages" ? (
          outputBlob ? (
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
          )
        ) : outputs.length > 0 ? (
          <div className="flex flex-col gap-1 text-sm">
            {outputs.map((o, idx) => (
              <a
                key={idx}
                href={URL.createObjectURL(o.blob)}
                download={o.name}
                className="inline-flex items-center gap-2 text-green-700 hover:underline"
              >
                📩 {o.name}
                <span className="text-xs text-gray-500">
                  ({formatBytes(o.bytes.byteLength)})
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500" aria-live="polite">
            {isSplitting && (
              <div
                className="mt-2"
                aria-live="polite"
                aria-label="Split progress"
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
          </div>
        )}

        <button
          onClick={runAction}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!file || (mode === "pages" && !range) || isSplitting}
        >
          {isSplitting
            ? mode === "pages"
              ? "Extracting…"
              : "Splitting…"
            : mode === "pages"
            ? "Extract Pages"
            : "Split by Size"}
        </button>
      </div>

      {/* Warnings */}
      {mode === "size" && oversizePages.length > 0 && (
        <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded">
          Note: These pages exceeded the limit even alone and were saved as
          individual parts:{" "}
          <span className="font-medium">{oversizePages.join(", ")}</span>.
          Consider compression to reduce size if needed.
        </div>
      )}

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
          className="overflow-x-auto whitespace-nowrap rounded-md p-2 bg-white"
        />
      </div>
    </div>
  );
}

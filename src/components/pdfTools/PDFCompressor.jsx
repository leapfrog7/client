// src/components/pdfTools/PDFCompressor.jsx
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import useFileDrop from "../../assets/useFileDrop";
import { smartCompressPdf } from "../../util/pdfCompression/smartCompress";

export default function PDFCompressor() {
  const [fileState, setFileState] = useState(null); // { file, bytes }
  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  const [targetMB, setTargetMB] = useState(20);
  const [useTarget, setUseTarget] = useState(false);

  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState("");

  const [output, setOutput] = useState(null); // { blob, bytes, name, mode }
  const cancelRef = useRef({ cancel: false });
  const downloadUrlRef = useRef(null);

  const formatBytes = (b) => {
    if (!Number.isFinite(b)) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let n = b;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i += 1;
    }
    return `${n.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
  };

  const revokeDownloadUrl = () => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }
  };

  const setOutputSafely = (nextOutput) => {
    revokeDownloadUrl();
    setOutput(nextOutput);
    if (nextOutput?.blob) {
      downloadUrlRef.current = URL.createObjectURL(nextOutput.blob);
    }
  };

  const clearAll = () => {
    setFileState(null);
    setTotalPages(null);
    setError(null);
    setWarning(null);
    setProgress(0);
    setStageText("");
    setIsCompressing(false);
    setOutputSafely(null);
    cancelRef.current.cancel = false;
  };

  const loadSelectedFile = async (f) => {
    if (!f) return;

    setError(null);
    setWarning(null);
    setProgress(0);
    setStageText("");
    setOutputSafely(null);
    cancelRef.current.cancel = false;

    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = doc.getPageCount();

      setFileState({ file: f, bytes });
      setTotalPages(pages);

      const sizePerPage = pages > 0 ? f.size / pages : f.size;

      if (f.size < 500 * 1024 || sizePerPage < 80 * 1024) {
        setWarning(
          "This PDF is already quite small. Smart compression will still try, but it may not reduce much further.",
        );
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load the PDF. Please try a different file.");
      setFileState(null);
      setTotalPages(null);
      setWarning(null);
    }
  };

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    await loadSelectedFile(f);
  };

  const { handleDrop, handleDragOver } = useFileDrop((fileList) => {
    const first = fileList?.[0];
    if (first && !isCompressing) loadSelectedFile(first);
  });

  const runSmartCompress = async () => {
    if (!fileState) return;

    setIsCompressing(true);
    setError(null);
    setProgress(0);
    setStageText("Preparing…");
    setOutputSafely(null);
    cancelRef.current.cancel = false;

    try {
      const targetBytes = useTarget
        ? Math.max(1, Number(targetMB) || 0) * 1024 * 1024
        : null;

      const result = await smartCompressPdf({
        file: fileState.file,
        inputBytes: fileState.bytes,
        targetBytes,
        cancelRef,
        onStageChange: (text) => setStageText(text),
        onProgress: (page, total) => {
          setProgress(Math.round((page / total) * 100));
        },
      });

      if (!result) {
        setError(
          "This PDF is already optimized or not suitable for further client-side compression. Original file has been kept unchanged.",
        );
        setProgress(100);
        return;
      }

      const baseName = (fileState.file.name || "document").replace(
        /\.pdf$/i,
        "",
      );
      const blob = new Blob([result.bytes], { type: "application/pdf" });

      setOutputSafely({
        blob,
        bytes: result.bytes,
        mode: result.mode,
        name: `${baseName}-compressed.pdf`,
      });

      setProgress(100);
      setStageText(
        result.mode === "structural"
          ? "Optimized by preserving PDF structure."
          : "Compressed by reducing page image data.",
      );
    } catch (err) {
      if (err?.message === "cancelled") {
        setError("Compression cancelled.");
      } else {
        console.error(err);
        setError("Compression failed. Please try again with another PDF.");
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const cancel = () => {
    cancelRef.current.cancel = true;
  };

  return (
    <div className="p-4 sm:p-5 rounded-lg shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">🗜️ Smart PDF Compressor</h2>
          <p className="mt-1 text-xs text-gray-500">
            Chooses the best browser-side method automatically and only keeps
            the result if it is genuinely smaller.
          </p>
        </div>

        {fileState && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs md:text-sm text-pink-700 bg-red-100 px-2 py-1 rounded-md hover:text-pink-500"
            disabled={isCompressing}
          >
            Clear
          </button>
        )}
      </div>

      <label
        htmlFor="compressor-input"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={`mt-3 block cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition ${
          isCompressing
            ? "opacity-60 pointer-events-none"
            : "hover:border-blue-400 hover:bg-blue-50/50 border-gray-300"
        }`}
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

      {(fileState || totalPages) && (
        <div className="mt-3 text-sm text-gray-700 space-y-1">
          {totalPages && (
            <div>
              Total Pages: <span className="font-medium">{totalPages}</span>
            </div>
          )}
          {fileState?.file && (
            <div>
              File Size:{" "}
              <span className="font-medium">
                {formatBytes(fileState.file.size)}
              </span>
            </div>
          )}
        </div>
      )}

      {warning && (
        <div className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          {warning}
        </div>
      )}

      <div className="mt-4 rounded-lg border border-gray-200 p-4">
        <div className="font-medium text-sm mb-3">Optional target size</div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useTarget}
            onChange={(e) => setUseTarget(e.target.checked)}
            disabled={!fileState || isCompressing}
          />
          <span>Try to fit within target size</span>
        </label>

        <div className="mt-3 flex items-center gap-3">
          <input
            type="number"
            min="1"
            step="1"
            value={targetMB}
            onChange={(e) => setTargetMB(e.target.value)}
            disabled={!fileState || isCompressing || !useTarget}
            className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500">
            eOffice cap is typically 20 MB.
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {output ? (
          <a
            href={downloadUrlRef.current || "#"}
            download={output.name}
            className="inline-flex items-center gap-2 rounded-md border border-green-600 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
          >
            📩 Download {output.name}
            <span className="text-xs text-gray-500">
              ({formatBytes(output.bytes.byteLength)})
            </span>
          </a>
        ) : (
          <div className="text-xs text-gray-500" aria-live="polite">
            {isCompressing
              ? stageText || "Compressing…"
              : "Your compressed file will appear here."}
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={runSmartCompress}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!fileState || isCompressing}
          >
            {isCompressing ? "Working…" : "Smart Compress"}
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

      {output && fileState?.file && (
        <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          Original: {formatBytes(fileState.file.size)} → Output:{" "}
          {formatBytes(output.bytes.byteLength)} · Method:{" "}
          <span className="font-medium">
            {output.mode === "structural"
              ? "Structural optimization"
              : "Image compression"}
          </span>
        </div>
      )}

      {isCompressing && (
        <div
          className="mt-3"
          aria-live="polite"
          aria-label="Compression progress"
        >
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>{stageText || "Processing"}</span>
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

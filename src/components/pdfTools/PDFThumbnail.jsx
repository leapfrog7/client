import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?raw";

export default function PDFThumbnail({ file, buffer }) {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!file || !buffer) return;

    const blob = new Blob([pdfWorkerSrc], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

    let cancelled = false;
    let renderTask = null;
    let loadingTask = null;

    (async () => {
      try {
        setFailed(false);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const previewBuffer = buffer.slice(0);
        loadingTask = pdfjsLib.getDocument({ data: previewBuffer });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);

        const cssWidth = window.innerWidth < 640 ? 112 : 128; // w-28 / sm:w-32
        const dpr = window.devicePixelRatio || 1;
        const viewportAt1 = page.getViewport({ scale: 1 });
        const scale = (cssWidth * dpr) / viewportAt1.width;
        const viewport = page.getViewport({ scale });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = "100%";
        canvas.style.height = "auto";

        const ctx = canvas.getContext("2d", { alpha: false });
        renderTask = page.render({ canvasContext: ctx, viewport });
        await renderTask.promise;
      } catch (err) {
        if (!cancelled) {
          console.error(`❌ Thumbnail error for ${file.name}:`, err);
          setFailed(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (renderTask?.cancel) renderTask.cancel();
      if (loadingTask?.destroy) loadingTask.destroy();
      URL.revokeObjectURL(workerUrl);
    };
  }, [file, buffer]);

  return (
    <div className="inline-flex flex-col items-center m-1 align-top w-28 sm:w-32">
      <div className="text-[11px] mb-1 text-gray-500">Page 1</div>
      <div className="w-full overflow-hidden rounded-sm border border-gray-300 bg-white">
        {!failed ? (
          <canvas
            ref={canvasRef}
            className="block w-full h-auto max-w-full"
            draggable={false}
          />
        ) : (
          <div className="flex h-32 items-center justify-center text-[11px] text-red-600">
            Preview unavailable
          </div>
        )}
      </div>
    </div>
  );
}

PDFThumbnail.propTypes = {
  file: PropTypes.instanceOf(File).isRequired,
  buffer: PropTypes.instanceOf(ArrayBuffer).isRequired,
};

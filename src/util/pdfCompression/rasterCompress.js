// src/utils/pdfCompression/rasterCompress.js
import { PDFDocument } from "pdf-lib";
import {
  pdfjsLib,
  ensurePdfJsWorker,
} from "../../components/pdfTools/pdfjsSetup";

const clampQuality = (q) => Math.min(0.95, Math.max(0.35, q));

function toGray(ctx, w, h) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;

  for (let p = 0; p < d.length; p += 4) {
    const y = (d[p] * 0.299 + d[p + 1] * 0.587 + d[p + 2] * 0.114) | 0;
    d[p] = y;
    d[p + 1] = y;
    d[p + 2] = y;
  }

  ctx.putImageData(img, 0, 0);
}

function canvasToJpgBytes(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error("jpeg-conversion-failed"));
          return;
        }

        try {
          const buf = await blob.arrayBuffer();
          resolve(new Uint8Array(buf));
        } catch (err) {
          reject(err);
        }
      },
      "image/jpeg",
      clampQuality(quality),
    );
  });
}

export async function rasterCompressPdf({
  inputBytes,
  dpi = 120,
  quality = 0.55,
  grayscale = false,
  onProgress,
  cancelRef,
}) {
  ensurePdfJsWorker();

  const loadingTask = pdfjsLib.getDocument({ data: inputBytes.slice(0) });
  const pdf = await loadingTask.promise;
  const out = await PDFDocument.create();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: grayscale });

  if (!ctx) {
    throw new Error("canvas-context-unavailable");
  }

  try {
    for (let i = 1; i <= pdf.numPages; i += 1) {
      if (cancelRef?.current?.cancel) throw new Error("cancelled");

      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale: dpi / 72 });

      const pixelWidth = Math.max(1, Math.floor(vp.width));
      const pixelHeight = Math.max(1, Math.floor(vp.height));

      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      ctx.clearRect(0, 0, pixelWidth, pixelHeight);

      const renderTask = page.render({
        canvasContext: ctx,
        viewport: vp,
      });
      await renderTask.promise;

      if (grayscale) {
        toGray(ctx, pixelWidth, pixelHeight);
      }

      const jpgBytes = await canvasToJpgBytes(canvas, quality);
      const jpg = await out.embedJpg(jpgBytes);

      const outPage = out.addPage([vp.width, vp.height]);
      outPage.drawImage(jpg, {
        x: 0,
        y: 0,
        width: vp.width,
        height: vp.height,
      });

      if (onProgress) {
        onProgress(i, pdf.numPages);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }

    const bytes = await out.save({ useObjectStreams: true });
    return new Uint8Array(bytes);
  } finally {
    canvas.width = 1;
    canvas.height = 1;

    try {
      await loadingTask.destroy();
    } catch {
      // ignore
    }
  }
}

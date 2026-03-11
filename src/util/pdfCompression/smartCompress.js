// src/utils/pdfCompression/smartCompress.js
import { PDFDocument } from "pdf-lib";
import { qpdfOptimize } from "./qpdfOptimize";
import { rasterCompressPdf } from "./rasterCompress";

const MIN_SAVINGS_RATIO = 0.97;

function isMeaningfullySmaller(candidateSize, originalSize) {
  return candidateSize < originalSize * MIN_SAVINGS_RATIO;
}

function pickSmaller(a, b) {
  if (!a) return b;
  if (!b) return a;
  return b.bytes.byteLength < a.bytes.byteLength ? b : a;
}

async function analyzePdf(file, inputBytes) {
  try {
    const doc = await PDFDocument.load(inputBytes);
    const pages = doc.getPageCount();
    const size = file.size;
    const sizePerPage = pages > 0 ? size / pages : size;

    return {
      pages,
      size,
      sizePerPage,
      likelyScanHeavy: size > 1024 * 1024 && sizePerPage > 250 * 1024,
      likelyTextHeavy: sizePerPage < 90 * 1024,
      verySmall: size < 500 * 1024,
    };
  } catch {
    return {
      pages: null,
      size: file.size,
      sizePerPage: file.size,
      likelyScanHeavy: file.size > 1024 * 1024,
      likelyTextHeavy: file.size < 500 * 1024,
      verySmall: file.size < 500 * 1024,
    };
  }
}

export async function smartCompressPdf({
  file,
  inputBytes,
  targetBytes = null,
  onStageChange,
  onProgress,
  cancelRef,
}) {
  const originalSize = file.size;
  const analysis = await analyzePdf(file, inputBytes);

  let best = null;

  const tryAccept = (mode, bytes) => {
    const size = bytes.byteLength;

    if (!isMeaningfullySmaller(size, originalSize)) {
      return false;
    }

    const candidate = { mode, bytes };
    best = pickSmaller(best, candidate);

    if (targetBytes && size <= targetBytes) {
      return true;
    }

    return false;
  };

  const tryQpdf = async () => {
    onStageChange?.("Optimizing PDF structure…");
    const bytes = await qpdfOptimize(inputBytes);
    return tryAccept("structural", bytes);
  };

  const tryRaster = async (options) => {
    onStageChange?.("Compressing page images…");
    const bytes = await rasterCompressPdf({
      inputBytes,
      ...options,
      onProgress,
      cancelRef,
    });
    return tryAccept("raster", bytes);
  };

  if (analysis.likelyTextHeavy || analysis.verySmall) {
    const done = await tryQpdf();
    if (done) return best;

    await tryRaster({ dpi: 120, quality: 0.55, grayscale: false });
    return best;
  }

  if (analysis.likelyScanHeavy) {
    const done = await tryRaster({ dpi: 120, quality: 0.55, grayscale: false });
    if (done) return best;

    await tryQpdf();
    return best;
  }

  let done = await tryQpdf();
  if (done) return best;

  done = await tryRaster({ dpi: 120, quality: 0.55, grayscale: false });
  if (done) return best;

  await tryRaster({ dpi: 100, quality: 0.5, grayscale: true });
  return best;
}

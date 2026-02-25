// pdfjsSetup.js
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";

let inited = false;

export function ensurePdfJsWorker() {
  // Guard: Google renderer / SSR-like environments
  if (typeof window === "undefined") return;
  if (inited) return;

  try {
    const worker = new PdfWorker();
    pdfjsLib.GlobalWorkerOptions.workerPort = worker;
    inited = true;
  } catch (e) {
    // Never crash the page because thumbnails fail
    console.warn("PDF.js worker init failed:", e);
  }
}

export { pdfjsLib };

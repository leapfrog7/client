// src/lib/pdfjsSetup.js
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";

const worker = new PdfWorker();
pdfjsLib.GlobalWorkerOptions.workerPort = worker;

export { pdfjsLib };

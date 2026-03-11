// src/utils/pdfCompression/qpdfModule.js
import createQpdfModule from "@neslinesli93/qpdf-wasm";

let qpdfInstancePromise = null;

export async function getQpdfModule() {
  if (!qpdfInstancePromise) {
    qpdfInstancePromise = createQpdfModule({
      locateFile: () => "/wasm/qpdf.wasm",
      noInitialRun: true,
      print: () => {},
      printErr: () => {},
    });
  }

  return qpdfInstancePromise;
}

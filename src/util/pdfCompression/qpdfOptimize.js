// src/utils/pdfCompression/qpdfOptimize.js
import { getQpdfModule } from "./qpdfModule";

function safeUnlink(FS, path) {
  try {
    FS.unlink(path);
  } catch {
    // ignore
  }
}

export async function qpdfOptimize(inputBytes) {
  const qpdf = await getQpdfModule();
  const { FS } = qpdf;

  const inputPath = `/input-${Date.now()}.pdf`;
  const outputPath = `/output-${Date.now()}.pdf`;

  try {
    FS.writeFile(inputPath, new Uint8Array(inputBytes));

    // Basic content-preserving rewrite.
    // This is intentionally conservative and browser-safe.
    qpdf.callMain([
      inputPath,
      "--object-streams=generate",
      "--recompress-flate",
      outputPath,
    ]);

    const output = FS.readFile(outputPath);
    return new Uint8Array(output);
  } finally {
    safeUnlink(FS, inputPath);
    safeUnlink(FS, outputPath);
  }
}

// src/components/pdfTools/PDFToolsCTA.jsx
import { ShieldCheck } from "lucide-react";

export default function PDFToolsCTA() {
  return (
    <section className="rounded-2xl   p-5 sm:p-7 shadow-sm bg-slate-50">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex h-10 w-10 items-center bg-white justify-center rounded-full  text-blue-700">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="flex-1 ">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            Secure, Private &amp; Offline – PDF Tools You Can Trust
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Designed for Government servants handling sensitive documents.
            Unlike typical online tools,
            <span className="font-medium text-gray-800">
              {" "}
              all actions run entirely in your browser
            </span>{" "}
            — no uploads, no server storage, no tracking.
          </p>

          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-sm">
            <li className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <span>
                🔒 <span className="font-medium">Complete privacy:</span> PDFs
                never leave your device.
              </span>
            </li>
            <li className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              🛡️
              <span>
                <span className="font-medium">Data confidentiality:</span> Safe
                for sensitive files.
              </span>
            </li>
            <li className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              📴
              <span>
                <span className="font-medium">Works offline:</span> Disconnect
                and continue seamlessly.
              </span>
            </li>
          </ul>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs md:text-sm text-gray-500">
              Your documents stay where they belong — with you.
            </p>
            {/* <div className="flex gap-2">
              <a
                href="#merge"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Start Using PDF Tools
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                How it works
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

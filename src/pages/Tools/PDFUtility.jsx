import { useState } from "react";
import PDFMerger from "../../components/pdfTools/PDFMerger";
import PDFSplitter from "../../components/pdfTools/PDFSplitter";
import PDFRotator from "../../components/pdfTools/PDFRotator";
import PDFToolsCTA from "../../components/pdfTools/PDFToolsCTA";
import AddPageNo from "../../components/pdfTools/AddPageNo";
import ImageToPDF from "../../components/pdfTools/ImageToPDF";
import PDFCompressor from "../../components/pdfTools/PDFCompressor";
import PageFeedback from "../../components/PageFeedback";
import { Helmet } from "react-helmet-async";

const tabs = [
  { label: "Merge PDFs", id: "merge" },
  { label: "Split PDF", id: "split" },
  { label: "Rotate Pages", id: "rotate" },
  { label: "Add Page No.", id: "addPage" },
  { label: "Image to PDF", id: "ImageToPDF" },
  { label: "Compress PDF", id: "compressPDF" },
];

export default function PDFUtility() {
  const [activeTab, setActiveTab] = useState("merge");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "merge":
        return <PDFMerger />;
      case "split":
        return <PDFSplitter />;
      case "rotate":
        return <PDFRotator />;
      case "addPage":
        return <AddPageNo />;
      case "ImageToPDF":
        return <ImageToPDF />;
      case "compressPDF":
        return <PDFCompressor />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        {/* Primary */}
        <title>
          PDF Tools for eOffice (20 MB Ready) — Split, Merge, Compress, Rotate,
          Image to PDF | UnderSigned
        </title>
        <meta
          name="description"
          content="Free privacy-first PDF tools for government work: split PDFs by page range or auto-split into 20 MB eOffice-ready parts, merge files, compress large PDFs (rasterize & rebuild), rotate pages, and convert images to PDF. 100% client-side — nothing is uploaded; processing happens in your browser."
        />
        <link
          rel="canonical"
          href="https://undersigned.in/pages/public/pdf-utility"
        />

        {/* Indexing */}
        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />

        {/* Theme */}
        <meta name="theme-color" content="#1e40af" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UnderSigned" />
        <meta
          property="og:title"
          content="PDF Tools for eOffice (20 MB Ready) — Split, Merge, Compress, Rotate | UnderSigned"
        />
        <meta
          property="og:description"
          content="Split into 20 MB eOffice-ready parts, merge PDFs, compress large files, rotate pages, and convert images to PDF — all in your browser. Nothing is uploaded."
        />
        <meta
          property="og:url"
          content="https://undersigned.in/pages/public/pdf-utility"
        />
        {/* Replace with a real absolute URL image (1200×630 recommended) */}
        {/* <meta
          property="og:image"
          content="https://undersigned.in/og/pdf-tools.png"
        /> */}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="PDF Tools for eOffice (20 MB Ready) — Split, Merge, Compress, Rotate"
        />
        <meta
          name="twitter:description"
          content="Split into 20 MB eOffice-ready parts, merge PDFs, compress, rotate, and convert images to PDF — 100% client-side."
        />
        <meta
          name="twitter:image"
          content="https://undersigned.in/og/pdf-tools.png"
        />

        {/* Structured Data */}
        <script type="application/ld+json">{`
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://undersigned.in/#website",
        "name": "UnderSigned",
        "url": "https://undersigned.in"
      },
      {
        "@type": "WebPage",
        "@id": "https://undersigned.in/pages/public/pdf-utility#webpage",
        "url": "https://undersigned.in/pages/public/pdf-utility",
        "name": "PDF Tools for eOffice (20 MB Ready)",
        "description": "Client-side PDF tools to split into 20 MB eOffice-ready parts, merge, compress, rotate, and convert images to PDF. Nothing is uploaded; processing happens in your browser.",
        "isPartOf": { "@id": "https://undersigned.in/#website" }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://undersigned.in/pages/public/pdf-utility#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://undersigned.in/" },
          { "@type": "ListItem", "position": 2, "name": "PDF Tools", "item": "https://undersigned.in/pages/public/pdf-utility" }
        ]
      }
    ]
  }
  `}</script>
      </Helmet>

      <h1 className="text-xl sm:text-2xl font-bold text-center mb-2 text-slate-700 ">
        🛠️ Secure & Private PDF Tools
      </h1>
      <p className="text-center text-sm md:text-base text-gray-600  mb-6 max-w-2xl mx-auto">
        Developed with the unique needs of{" "}
        <span className="font-medium">Government Employees</span> in mind, by
        processing everything entirely on your device — with{" "}
        <span className="font-medium">no data ever uploaded</span> to our
        servers.
      </p>
      <p className="text-center text-sm sm:text-base font-medium text-gray-400  mb-3">
        --- Select a PDF Tool to Get Started ---
      </p>

      {/* --- MODIFIED: Tabs Container with Wrapping --- */}
      <div className="border-b border-gray-200  pb-4">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 sm:gap-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              // flex-shrink-0 is no longer needed as we WANT items to wrap
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-lg border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                activeTab === tab.id
                  ? "border-blue-600 bg-blue-50 text-blue-700 "
                  : "border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200 "
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="bg-white  rounded-lg shadow-md p-4 sm:p-6">
        {renderActiveComponent()}
      </div>
      <PageFeedback pageSlug="/pdfTools" />
      {/* --- CTA Section --- */}
      <div className="max-w-5xl mx-auto py-8 sm:py-12 space-y-6">
        <PDFToolsCTA />
      </div>
    </div>
  );
}

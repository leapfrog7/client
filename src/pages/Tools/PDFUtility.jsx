import { useState } from "react";
import PDFMerger from "../../components/pdfTools/PDFMerger";
import PDFSplitter from "../../components/pdfTools/PDFSplitter";
import PDFRotator from "../../components/pdfTools/PDFRotator";
import PDFToolsCTA from "../../components/pdfTools/PDFToolsCTA";
import AddPageNo from "../../components/pdfTools/AddPageNo";
import ImageToPDF from "../../components/pdfTools/ImageToPDF";

const tabs = [
  { label: "Merge PDFs", id: "merge" },
  { label: "Split PDF", id: "split" },
  { label: "Rotate Pages", id: "rotate" },
  { label: "Add Page No.", id: "addPage" },
  { label: "Image to PDF", id: "ImageToPDF" },
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
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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

      {/* --- CTA Section --- */}
      <div className="max-w-5xl mx-auto py-8 sm:py-12 space-y-6">
        <PDFToolsCTA />
      </div>
    </div>
  );
}

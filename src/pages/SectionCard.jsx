// import { useState, useEffect, useMemo, memo } from "react";
// import PropTypes from "prop-types";
// import ContentBlock from "./ContentBlock";
// import { HiSpeakerWave, HiPlay, HiPause } from "react-icons/hi2";

// const SectionCard = ({
//   section,
//   index,
//   searchTerm,
//   isExpanded,
//   toggleSection,
//   renderAnchorId,
//   handleShare,
// }) => {
//   const anchorId = renderAnchorId(section.ruleNumber);

//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [hindiVoice, setHindiVoice] = useState(null);

//   // ✅ Memoized plain text extraction from text/note blocks
//   const fullTextContent = useMemo(() => {
//     return section.contentBlocks
//       .filter((b) => b.type === "text" || b.type === "note")
//       .map((b) => {
//         const temp = document.createElement("div");
//         temp.innerHTML = b.value;
//         return temp.textContent || "";
//       })
//       .join(" ");
//   }, [section.contentBlocks]);

//   // ✅ Memoized highlighted rule title
//   const highlightedTitle = useMemo(() => {
//     const raw = `${section.ruleNumber} – ${section.ruleTitle}`;
//     return searchTerm
//       ? raw.replace(
//           new RegExp(`(${searchTerm})`, "gi"),
//           `<mark class="bg-yellow-200">$1</mark>`
//         )
//       : raw;
//   }, [section.ruleNumber, section.ruleTitle, searchTerm]);

//   // ✅ Memoized highlighted chapter title
//   const highlightedChapter = useMemo(() => {
//     if (!section.chapterTitle) return null;
//     return searchTerm
//       ? section.chapterTitle.replace(
//           new RegExp(`(${searchTerm})`, "gi"),
//           `<mark class="bg-yellow-200">$1</mark>`
//         )
//       : section.chapterTitle;
//   }, [section.chapterTitle, searchTerm]);

//   const wordCount = useMemo(
//     () => fullTextContent.trim().split(/\s+/).length,
//     [fullTextContent]
//   );
//   const shouldClamp = wordCount > 250;

//   useEffect(() => {
//     const loadVoices = () => {
//       const voices = speechSynthesis.getVoices();
//       const hiVoice = voices.find(
//         (v) => v.lang === "hi-IN" || v.name.toLowerCase().includes("hindi")
//       );
//       if (hiVoice) setHindiVoice(hiVoice);
//     };
//     if (speechSynthesis.onvoiceschanged !== undefined) {
//       speechSynthesis.onvoiceschanged = loadVoices;
//     }
//     loadVoices();
//     return () => speechSynthesis.cancel(); // cleanup
//   }, []);

//   const speakSection = () => {
//     if (speechSynthesis.speaking) {
//       speechSynthesis.cancel();
//       setIsSpeaking(false);
//       return;
//     }

//     const combinedText = `${section.ruleNumber}, ${section.ruleTitle}. ${fullTextContent}`;
//     const utterance = new SpeechSynthesisUtterance(combinedText);
//     utterance.lang = "hi-IN";
//     if (hindiVoice) utterance.voice = hindiVoice;
//     utterance.onend = () => setIsSpeaking(false);
//     speechSynthesis.speak(utterance);
//     setIsSpeaking(true);
//     setIsPaused(false);
//   };

//   const togglePauseResume = () => {
//     if (!speechSynthesis.speaking) return;
//     if (speechSynthesis.paused) {
//       speechSynthesis.resume();
//       setIsPaused(false);
//     } else {
//       speechSynthesis.pause();
//       setIsPaused(true);
//     }
//   };

//   return (
//     <li
//       id={anchorId}
//       className="border border-gray-100 rounded-lg bg-gray-50 shadow-sm p-2 md:p-5"
//     >
//       {/* Header */}
//       <div className="mb-2 flex justify-between items-start gap-2 flex-wrap">
//         <p
//           className="font-semibold text-gray-700 text-sm md:text-base flex-1"
//           dangerouslySetInnerHTML={{ __html: highlightedTitle }}
//         />
//         <div className="flex gap-2 items-center">
//           {isSpeaking ? (
//             <button
//               onClick={togglePauseResume}
//               title={isPaused ? "Resume" : "Pause"}
//             >
//               {isPaused ? (
//                 <HiPlay className="text-lg" />
//               ) : (
//                 <HiPause className="text-lg" />
//               )}
//             </button>
//           ) : (
//             <button onClick={speakSection} title="Listen to this section">
//               <HiSpeakerWave className="text-lg" />
//             </button>
//           )}
//           <button
//             onClick={() => handleShare(section.ruleNumber, section.ruleTitle)}
//             className="text-sm text-cyan-600 hover:text-cyan-800 transition-colors flex items-center gap-1"
//             title="Copy shareable link"
//           >
//             <span className="text-base">🔗</span>
//             <span className="hidden sm:inline text-xs font-medium">Share</span>
//           </button>
//         </div>
//       </div>

//       {/* Chapter Title */}
//       {highlightedChapter && (
//         <p
//           className="text-sm text-cyan-700 border border-cyan-100 bg-cyan-50 inline-block mt-1 px-3 py-1 rounded-md italic"
//           dangerouslySetInnerHTML={{ __html: highlightedChapter }}
//         />
//       )}

//       {/* Content */}
//       <div className="mt-4">
//         {!shouldClamp || isExpanded ? (
//           <>
//             <div className="space-y-4">
//               {section.contentBlocks.map((block, idx) => (
//                 <ContentBlock key={idx} block={block} searchTerm={searchTerm} />
//               ))}
//             </div>
//             {shouldClamp && (
//               <div className="flex justify-end mt-2">
//                 <button
//                   onClick={() => toggleSection(index)}
//                   className="text-xs px-2 py-1 bg-cyan-50 text-cyan-600 hover:underline rounded"
//                 >
//                   Show less
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           <>
//             <p
//               className="text-sm md:text-base text-gray-700 line-clamp-6 mb-2 leading-relaxed"
//               dangerouslySetInnerHTML={{
//                 __html: searchTerm
//                   ? fullTextContent.replace(
//                       new RegExp(`(${searchTerm})`, "gi"),
//                       `<mark class="bg-yellow-200">$1</mark>`
//                     )
//                   : fullTextContent,
//               }}
//             />
//             <div className="flex justify-end">
//               <button
//                 onClick={() => toggleSection(index)}
//                 className="text-xs md:text-sm px-2 py-1 bg-cyan-50 text-cyan-700 hover:underline rounded"
//               >
//                 Show more
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </li>
//   );
// };

// SectionCard.propTypes = {
//   section: PropTypes.object.isRequired,
//   index: PropTypes.number.isRequired,
//   searchTerm: PropTypes.string.isRequired,
//   isExpanded: PropTypes.bool.isRequired,
//   toggleSection: PropTypes.func.isRequired,
//   renderAnchorId: PropTypes.func.isRequired,
//   handleShare: PropTypes.func.isRequired,
// };

// function areEqual(prevProps, nextProps) {
//   return (
//     prevProps.section === nextProps.section &&
//     prevProps.index === nextProps.index &&
//     prevProps.searchTerm === nextProps.searchTerm &&
//     prevProps.isExpanded === nextProps.isExpanded
//   );
// }

// export default memo(SectionCard, areEqual);

// SectionCardFull.jsx - Enhanced Card View with title-based toggle and better mobile layout
// SectionCardFull.jsx - Enhanced Card View with preview snippet and toggle on title
// SectionCardFull.jsx - Enhanced Card View with responsive preview snippet and toggle on title
// SectionCardFull.jsx - Enhanced Card View with responsive preview snippet and aligned icons
// SectionCardFull.jsx - Improved layout: keeps speaker/link aligned, avoids shifting
// SectionCardFull.jsx - Locks icon position below content to prevent jump
import { useState, useEffect, useMemo, memo } from "react";
import PropTypes from "prop-types";
import ContentBlock from "./ContentBlock";
import { HiSpeakerWave, HiPlay, HiPause } from "react-icons/hi2";
import { FiLink } from "react-icons/fi";

const SectionCardFull = ({
  section,
  index,
  searchTerm,
  isExpanded,
  toggleSection,
  renderAnchorId,
  handleShare,
}) => {
  const anchorId = renderAnchorId(section.ruleNumber);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hindiVoice, setHindiVoice] = useState(null);
  const [previewLength, setPreviewLength] = useState(200);

  useEffect(() => {
    const updatePreviewLength = () => {
      const width = window.innerWidth;
      if (width < 640) setPreviewLength(100);
      else if (width < 1024) setPreviewLength(150);
      else setPreviewLength(200);
    };
    updatePreviewLength();
    window.addEventListener("resize", updatePreviewLength);
    return () => window.removeEventListener("resize", updatePreviewLength);
  }, []);

  const fullTextContent = useMemo(() => {
    return section.contentBlocks
      .filter((b) => b.type === "text" || b.type === "note")
      .map((b) => {
        const temp = document.createElement("div");
        temp.innerHTML = b.value;
        return temp.textContent || "";
      })
      .join(" ");
  }, [section.contentBlocks]);

  const previewText = useMemo(() => {
    return fullTextContent.length > previewLength
      ? fullTextContent.slice(0, previewLength) + "…"
      : fullTextContent;
  }, [fullTextContent, previewLength]);

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 font-medium">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const hiVoice = voices.find(
        (v) => v.lang === "hi-IN" || v.name.toLowerCase().includes("hindi")
      );
      if (hiVoice) setHindiVoice(hiVoice);
    };
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => speechSynthesis.cancel();
  }, []);

  const speakSection = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const combinedText = `${section.ruleNumber}, ${section.ruleTitle}. ${fullTextContent}`;
    const utterance = new SpeechSynthesisUtterance(combinedText);
    utterance.lang = "hi-IN";
    if (hindiVoice) utterance.voice = hindiVoice;
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const togglePauseResume = () => {
    if (!speechSynthesis.speaking) return;
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  return (
    <li
      id={anchorId}
      className="border border-cyan-500 rounded-lg bg-white shadow-sm p-4 md:p-6"
    >
      <div className="flex flex-col gap-3">
        <div className="cursor-pointer" onClick={() => toggleSection(index)}>
          <p className="text-base md:text-lg font-semibold text-gray-800">
            {highlightText(`${section.ruleNumber} – ${section.ruleTitle}`)}
          </p>
          {section.chapterTitle && (
            <p className="text-sm text-cyan-700 italic">
              {highlightText(section.chapterTitle)}
            </p>
          )}
          {!isExpanded && (
            <p className="text-sm text-gray-500 mt-1 italic">
              {highlightText(previewText)}
            </p>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {section.contentBlocks.map((block, idx) => (
              <ContentBlock key={idx} block={block} searchTerm={searchTerm} />
            ))}
          </div>
        )}

        <div className="flex gap-4 justify-end">
          {isSpeaking ? (
            <button
              onClick={togglePauseResume}
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <HiPlay className="text-base text-cyan-600" />
              ) : (
                <HiPause className="text-base text-cyan-600" />
              )}
            </button>
          ) : (
            <button onClick={speakSection} title="Listen">
              <HiSpeakerWave className="text-base text-cyan-600" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare(section.ruleNumber, section.ruleTitle);
            }}
            title="Copy shareable link"
          >
            <FiLink className="text-sm text-cyan-600" />
          </button>
        </div>
      </div>
    </li>
  );
};

SectionCardFull.propTypes = {
  section: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  toggleSection: PropTypes.func.isRequired,
  renderAnchorId: PropTypes.func.isRequired,
  handleShare: PropTypes.func.isRequired,
};

function areEqual(prevProps, nextProps) {
  return (
    prevProps.section === nextProps.section &&
    prevProps.index === nextProps.index &&
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.isExpanded === nextProps.isExpanded
  );
}

export default memo(SectionCardFull, areEqual);

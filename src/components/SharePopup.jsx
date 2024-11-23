import { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa"; // Use FaTwitter for X

const SharePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef(null);

  // Show the popup after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem("popupShown")) {
        setIsVisible(true);
        sessionStorage.setItem("popupShown", "true"); // Avoid showing again in the same session
      }
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Close the popup
  const handleClose = () => {
    setIsVisible(false);
  };

  // Close the popup if clicking outside of the popup region
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  const websiteLink = "https://undersigned.netlify.app";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteLink);
    alert("Link copied to clipboard!");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div
        ref={popupRef}
        className="bg-gradient-to-tr from-blue-100 via-white to-blue-50 p-8 rounded-lg shadow-xl max-w-sm w-full relative"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Heading and Message */}
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
          Spread the Word!
        </h2>
        <p className="text-gray-700 mb-6 text-center leading-relaxed">
          Found our platform helpful? Share it with your circle and help more
          aspirants ace their goals!
        </p>

        {/* Link Copy Section */}
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            readOnly
            value={websiteLink}
            className="border border-gray-300 rounded-lg p-2 flex-grow text-gray-700"
          />
          <button
            onClick={handleCopyLink}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow-md"
          >
            Copy
          </button>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-around items-center mt-4">
          <a
            href={`https://wa.me/?text=Check%20out%20this%20LDCE%20Test%20Series:%20${encodeURIComponent(
              websiteLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 text-3xl hover:text-green-600"
            title="Share on WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              websiteLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 text-3xl hover:text-blue-800"
            title="Share on Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20LDCE%20Test%20Series:%20${encodeURIComponent(
              websiteLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black text-3xl hover:text-gray-800"
            title="Share on X (formerly Twitter)"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;

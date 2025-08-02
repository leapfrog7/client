import { useEffect, useState } from "react";
import { MdDownload } from "react-icons/md";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Check if already running as installed PWA
  const isInStandaloneMode = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  useEffect(() => {
    const handler = (e) => {
      if (isInStandaloneMode()) return;
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ App installed");
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl hover:scale-105 transition-transform duration-200 hover:shadow-2xl"
    >
      <MdDownload className="text-xl" />
      <span className="font-semibold text-sm sm:text-base">Install App</span>
    </button>
  );
}

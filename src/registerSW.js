import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true, // check sooner on load (helps on iOS)
  onNeedRefresh() {
    if (confirm("New version available. Refresh?")) {
      // this tells the waiting SW to activate (skip waiting) and then reloads
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App ready for offline use");
  },
});

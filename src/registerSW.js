import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Refresh?")) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log("App ready for offline use");
  },
});

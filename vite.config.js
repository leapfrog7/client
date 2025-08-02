import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Undersigned - LDCE Exam Prep",
        short_name: "Undersigned",
        description: "MCQs, tools & rules for LDCE exams",
        start_url: "/",
        id: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f9fafb", // soft off-white or light yellow
        theme_color: "#1e40af", // your primary color
        orientation: "portrait",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
});

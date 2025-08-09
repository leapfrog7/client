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
        background_color: "#f9fafb",
        theme_color: "#1e40af",
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
      workbox: {
        // Allow precaching of your ~3.46 MB main chunk
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // Keep sourcemaps out of the precache
        manifestTransforms: [
          async (entries) => {
            const manifest = entries.filter((e) => !e.url.endsWith(".map"));
            return { manifest };
          },
        ],
        // Optional: runtime cache the big app chunk too
        runtimeCaching: [
          {
            urlPattern: /assets\/index-.*\.js$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "app-js",
              expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        // Your explicit chunking (safe + predictable)
        manualChunks: {
          react: ["react", "react-dom"],
          // Remove lines for libs you don't use
          pdf: ["pdfjs-dist"],
          utils: ["lodash", "dayjs"],
        },
      },
    },
    // Optional: just silences Vite’s 500k warning (not related to Workbox)
    // chunkSizeWarningLimit: 2000,
  },
});

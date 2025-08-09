import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(), // quick vendor code-splitting
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
        // Unblock precache for your ~3.46 MB main chunk
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB

        // Don’t precache sourcemaps (keeps manifest clean)
        manifestTransforms: [
          async (entries) => {
            const manifest = entries.filter((e) => !e.url.endsWith(".map"));
            return { manifest };
          },
        ],

        // (Optional) Runtime-cache the main app chunk pattern as well
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
    sourcemap: true, // keep as you had it
    rollupOptions: {
      output: {
        // Gentle, explicit chunking to reduce the size of index-*.js
        manualChunks: {
          react: ["react", "react-dom"],
          pdf: ["pdfjs-dist"], // adjust/remove if not used
          utils: ["lodash", "dayjs"].filter(Boolean), // keep only libs you actually use
        },
      },
    },
    // Optional: quiet the 500 kB warning without affecting Workbox
    // chunkSizeWarningLimit: 2000,
  },
});

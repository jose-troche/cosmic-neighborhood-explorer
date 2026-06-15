import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          icons: ["lucide-react"]
        }
      }
    }
  },
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false
  },
  test: {
    environment: "jsdom",
    globals: true
  }
});

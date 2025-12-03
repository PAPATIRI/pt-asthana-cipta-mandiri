import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        karir: resolve(__dirname, "karir/index.html"),
        // karir_detail: resolve(__dirname, "karir/detail.html"),
      },
    },
  },
});

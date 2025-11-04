import { defineConfig } from "vite";
import path from "path";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./public"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        karir: resolve(__dirname, "karir.html"),
      },
    },
  },
});

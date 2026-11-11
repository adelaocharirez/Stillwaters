import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Builds the whole app into one dist/index.html so it can be dropped on any static host.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { target: "es2020" },
});

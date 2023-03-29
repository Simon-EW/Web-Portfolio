import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../portfolio/public/projects/{{name}}",
    emptyOutDir: true,
  },
});
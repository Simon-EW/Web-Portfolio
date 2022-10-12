import { defineConfig } from "vite";
import mpa from "vite-plugin-mpa";

export default defineConfig({
  base: "./",
  plugins: [mpa()],
});

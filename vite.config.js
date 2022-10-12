import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        contact: "pages/contact.html",
        projects: "pages/projects.html",
      },
    },
  },
  // plugins: [
  //   viteStaticCopy({
  //     targets: [
  //       {
  //         src: "projects",
  //         dest: ".",
  //       },
  //     ],
  //   }),
  // ],
});

import { defineConfig } from "astro/config";
import tsConfigPaths from "vite-tsconfig-paths";

// import relativeLinks from "astro-relative-links";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // integrations: [relativeLinks()],
  outDir: "../portfolio/external/git-page",
  base: "/projects/git-page"
  // vite: {
  //   plugins: [
  //     tsConfigPaths({
  //       loose: true,
  //     }),
  //   ],
  // },
  ,
  integrations: [react()]
}
// base: "./",
);
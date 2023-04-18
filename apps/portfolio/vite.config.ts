import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        contact: 'pages/contact.html',
        projects: 'pages/projects.html',
        calculator: 'projects/calculator/index.html',
        history: 'projects/history/index.html',
        autogrid: 'projects/autogrid/index.html',
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [{ src: 'external/*', dest: 'projects' }],
    }),
  ],
});

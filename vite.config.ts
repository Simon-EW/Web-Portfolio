import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  assetsInclude: ['assets', 'projects', 'test'],
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
});

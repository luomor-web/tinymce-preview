import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/plugin.js'),
      name: 'TinyMCEPreviewPlugin',
      fileName: (format) => `plugin.${format}.js`,
    },
    rollupOptions: {
      external: ['tinymce'],
      output: {
        globals: {
          tinymce: 'tinymce',
        },
      },
    },
    outDir: 'dist',
  },
});

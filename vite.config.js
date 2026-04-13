import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/plugin.js'),
      name: 'TinyMCEPreviewPlugin',
      fileName: (format) => {
        const formatMap = {
          es: 'plugin.esm.js',
          cjs: 'plugin.cjs.js',
          umd: 'plugin.umd.js'
        };
        return formatMap[format] || `plugin.${format}.js`;
      },
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {
          tinymce: 'tinymce',
        },
      },
    },
    outDir: 'dist',
  },
});

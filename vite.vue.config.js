import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        vue2: resolve(__dirname, 'vue/vue2.js'),
        vue3: resolve(__dirname, 'vue/vue3.js'),
      },
      name: 'TinymcePreviewEditor',
      fileName: (format, entryName) => `vue/${entryName}.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', '@tinymce/tinymce-vue'],
      output: {
        globals: {
          vue: 'Vue',
          '@tinymce/tinymce-vue': 'tinymce-vue',
        },
        exports: 'named',
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
});

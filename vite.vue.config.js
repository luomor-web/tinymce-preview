import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

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
    },
    rollupOptions: {
      external: ['vue', '@tinymce/tinymce-vue'],
      output: {
        globals: {
          vue: 'Vue',
          '@tinymce/tinymce-vue': 'tinymce-vue',
        },
      },
    },
    outDir: 'dist',
  },
});

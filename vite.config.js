import { defineConfig } from 'vite';
import { resolve } from 'path';
import { generateSeoArtifacts } from './scripts/generate-seo-artifacts.js';

export default defineConfig({
  plugins: [{
    name: 'generate-seo-artifacts',
    apply: 'build',
    closeBundle() {
      generateSeoArtifacts();
    },
  }],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog.html'),
        article: resolve(__dirname, 'article.html'),
        produk: resolve(__dirname, 'produk.html')
      }
    }
  }
});

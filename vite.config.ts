import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages (https://<user>.github.io/sake-recommend/) 用のベースパス。
  // CI からのみ設定され、ローカル開発・通常ビルドは '/' のまま
  base: process.env.DEPLOY_TARGET === 'gh-pages' ? '/sake-recommend/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

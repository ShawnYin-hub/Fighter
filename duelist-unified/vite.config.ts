import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';

  return {
    // GitHub Pages 需要设置 base 为 /仓库名/
    base: isProd ? '/Fighter/' : '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
      fs: {
        // 排除 miniprogram 目录，避免 Vite 处理微信小程序文件
        deny: ['**/miniprogram/**']
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.DEEPSEEK_API_KEY || 'sk-bf1778c500a04bc399b65f046236618f'),
      'process.env.DEEPSEEK_API_KEY': JSON.stringify(env.DEEPSEEK_API_KEY || 'sk-bf1778c500a04bc399b65f046236618f'),
      'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY || ''),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(env.FIREBASE_AUTH_DOMAIN || ''),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.FIREBASE_PROJECT_ID || ''),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(env.FIREBASE_STORAGE_BUCKET || ''),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.FIREBASE_MESSAGING_SENDER_ID || ''),
      'process.env.FIREBASE_APP_ID': JSON.stringify(env.FIREBASE_APP_ID || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    // 明确指定入口文件，避免误识别 miniprogram/app.js
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html')
      }
    }
  };
});

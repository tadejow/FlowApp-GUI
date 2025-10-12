import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'url';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // @FIX: __dirname is not available in ESM modules. Use import.meta.url to get the current directory path.
          '@': fileURLToPath(new URL('.', import.meta.url)),
        }
      }
    };
});
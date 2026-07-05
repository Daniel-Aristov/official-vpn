import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import checker from 'vite-plugin-checker'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const currentDate = new Date().toISOString()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET ?? 'http://165.232.125.201:8000'

  return {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}" "./vite.config.ts"',
        useFlatConfig: true,
      },
      overlay: true,
      terminal: true,
    }),
  ],
  define: {
    _BUILD_DATE_: JSON.stringify(currentDate)
  },
  build: {
    manifest: true,
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: true,
  },
  server: {
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  }
})

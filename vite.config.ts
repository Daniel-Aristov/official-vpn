import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import checker from 'vite-plugin-checker'
import { visualizer } from 'rollup-plugin-visualizer'

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
    ...(mode === 'analyze'
      ? [
          visualizer({
            open: true,
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  define: {
    _BUILD_DATE_: JSON.stringify(currentDate)
  },
  build: {
    manifest: true,
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/motion/') || id.includes('/framer-motion/'))
            return 'motion'
          if (id.includes('/axios/')) return 'axios'
          if (
            id.includes('/react-dom/') ||
            id.includes('/react-router') ||
            id.includes('/react/')
          )
            return 'react-vendor'
        },
      },
    },
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

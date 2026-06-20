import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const currentDate = new Date().toISOString()
export default defineConfig({
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
})

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

const currentDate = new Date().toISOString()
export default defineConfig({
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

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react(),
    nodePolyfills({
      protocolImports: true,
    })
  ],
  server: {
    port: 5173,
    host: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@coral-xyz/anchor', 'bn.js']
  }
})
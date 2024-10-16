import path from 'node:path'
import solidMarkedPlugin from 'unplugin-solid-marked'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src'),
    },
  },
  plugins: [
    solidMarkedPlugin.vite({}),
    solidPlugin(),
    {
      name: 'Reaplace env variables',
      transform(code, id) {
        if (id.includes('node_modules')) {
          return code
        }
        return code
          .replace(/process\.env\.SSR/g, 'false')
          .replace(/process\.env\.DEV/g, 'true')
          .replace(/process\.env\.PROD/g, 'false')
          .replace(/process\.env\.NODE_ENV/g, '"development"')
          .replace(/import\.meta\.env\.SSR/g, 'false')
          .replace(/import\.meta\.env\.DEV/g, 'true')
          .replace(/import\.meta\.env\.PROD/g, 'false')
          .replace(/import\.meta\.env\.NODE_ENV/g, '"development"')
      },
    },
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})

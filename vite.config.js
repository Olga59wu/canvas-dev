import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 導入 vite-plugin-eslint
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5175,
  },
})

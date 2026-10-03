import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // GitHub Pages では https://ユーザー名.github.io/リポジトリ名/ に置かれるので、
  // ビルドのときに BASE_PATH（例：/vuenovel/）を渡す。手元では / のまま
  base: process.env.BASE_PATH ?? '/',
  plugins: [vue()],
})

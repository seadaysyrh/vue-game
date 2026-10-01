// アプリの入り口
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

createApp(App)
  .use(createPinia()) // Pinia（共有データ）を使えるようにする
  .use(router)        // Vue Router（ページ切り替え）を使えるようにする
  .mount('#app')

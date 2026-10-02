// ===== Vue Router =====
// 「URL」と「表示するページ（コンポーネント）」の対応表
import { createRouter, createWebHistory } from 'vue-router'
import TitleView from '../views/TitleView.vue'
import GameView from '../views/GameView.vue'
import EndingView from '../views/EndingView.vue'
import CreditsView from '../views/CreditsView.vue'
import RouteView from '../views/RouteView.vue'
import ArchiveView from '../views/ArchiveView.vue'

const routes = [
  { path: '/', component: TitleView },
  { path: '/game', component: GameView },
  // :type は「ルートパラメータ」。/ending/true なら type は 'true' になる
  { path: '/ending/:type', component: EndingView },
  { path: '/credits', component: CreditsView },
  { path: '/route', component: RouteView }, // 世界線分岐図
  { path: '/archive', component: ArchiveView }, // 記録室（エンディング・ギャラリー・TIPS）
]

export default createRouter({
  history: createWebHistory(), // 普通の URL（/game など）を使う
  routes,
})

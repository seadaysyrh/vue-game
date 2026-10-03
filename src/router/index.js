// ===== Vue Router =====
// 「URL」と「表示するページ（コンポーネント）」の対応表
import { createRouter, createWebHistory } from 'vue-router'
import TitleView from '../views/TitleView.vue'
import GameView from '../views/GameView.vue'
import EndingView from '../views/EndingView.vue'
import CreditsView from '../views/CreditsView.vue'
import RouteView from '../views/RouteView.vue'
import ArchiveView from '../views/ArchiveView.vue'
import { useGameStore } from '../stores/game'

const routes = [
  { path: '/', component: TitleView },
  // 本編。技術説明モードのまま来たときは、本編を最初から始める
  {
    path: '/game',
    component: GameView,
    beforeEnter: () => {
      const game = useGameStore()
      if (game.mode !== 'story') game.reset()
    },
  },
  // 技術説明モード（TECH DOCS）。ゲーム画面の部品は同じものを使い、ここでは授業のシーンを再生する。
  // /docs を開き直したときやブックマークから来たときも、授業の最初から始められるようにする
  {
    path: '/docs',
    component: GameView,
    beforeEnter: async () => {
      const game = useGameStore()
      if (game.mode !== 'lesson') await game.startLesson()
    },
  },
  // :type は「ルートパラメータ」。/ending/true なら type は 'true' になる
  { path: '/ending/:type', component: EndingView },
  { path: '/credits', component: CreditsView },
  { path: '/route', component: RouteView }, // 世界線分岐図
  { path: '/archive', component: ArchiveView }, // 記録室（エンディング・ギャラリー・TIPS）
]

export default createRouter({
  // 普通の URL（/game など）を使う。GitHub Pages ではフォルダの中に置かれるので、その場所（BASE_URL）から数える
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

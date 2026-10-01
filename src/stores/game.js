// ===== Pinia ストア =====
// 「どのページからでも使える共有データ置き場」。
// ゲームの進行状況をここにまとめておけば、ゲーム画面・エンディング・分岐図のどれからでも読める。
import { defineStore, acceptHMRUpdate } from 'pinia'
import { scenes, getEndingType } from '../data/scenario'

// ----- 通った世界線をブラウザに保存する（ページを閉じても残る） -----
const SAVE_KEY = 'after-school-rewrite:visited'

function loadVisited() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) ?? []
  } catch {
    return [] // 保存が使えない環境でも、ゲームは動くようにする
  }
}

function saveVisited(visited) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(visited))
  } catch {
    // 保存できなくても、遊ぶのには困らないので何もしない
  }
}

export const useGameStore = defineStore('game', {
  // ----- state：保存しておくデータ（コンポーネントの ref にあたる） -----
  state: () => ({
    sceneId: 'start', // いまのシーン
    lineIndex: 0,     // シーンの中で何番目のセリフか
    path: '',         // 今回の選び方（選んだ選択肢の番号を並べた文字列。例：'101'）
    visited: loadVisited(), // これまでに通った分岐（path の一覧）
    movie: null,      // 再生中のムービーの名前（data/movies.js）。null なら再生していない
  }),

  // ----- getters：state から計算する値（コンポーネントの computed にあたる） -----
  getters: {
    scene: (state) => scenes[state.sceneId],
    line() {
      // getter から別の getter を使うときは this を使う
      return this.scene.lines[this.lineIndex]
    },
    isLastLine() {
      return this.lineIndex === this.scene.lines.length - 1
    },
    // 最後のセリフまで読んだら選択肢を出す
    showChoices() {
      return this.isLastLine && Boolean(this.scene.choices)
    },
    // 選択肢は全部で3回。その選び方（path）でエンディングが決まる
    endingType: (state) => getEndingType(state.path),
  },

  // ----- actions：state を変える関数（コンポーネントの普通の関数にあたる） -----
  actions: {
    reset() {
      this.sceneId = 'start'
      this.lineIndex = 0
      this.path = ''
      this.movie = null
      this.markVisited('')
    },

    goToScene(id) {
      this.sceneId = id
      this.lineIndex = 0
      // movie が付いたシーンに入ったら、ムービーを再生する
      if (scenes[id].movie) this.playMovie(scenes[id].movie)
    },

    playMovie(name) {
      this.movie = name
    },

    endMovie() {
      this.movie = null
    },

    // メッセージ欄がクリックされたとき
    next() {
      if (!this.isLastLine) {
        this.lineIndex++
      } else if (this.scene.next) {
        this.goToScene(this.scene.next)
      }
      // 選択肢があるときや end のときは、ここでは何もしない（画面側で処理する）
    },

    // 選択肢が選ばれたとき
    choose(choice) {
      const index = this.scene.choices.indexOf(choice)
      this.path += index
      this.markVisited(this.path)
      this.goToScene(choice.next)
    },

    // 分岐図の「ここから再開」：そのノードの状態にして、シーンの最初から始める
    jumpTo(node) {
      this.movie = null
      this.goToScene(node.sceneId)
      this.path = node.key
    },

    markVisited(key) {
      if (!this.visited.includes(key)) {
        this.visited.push(key)
        saveVisited(this.visited)
      }
    },
  },
})

// 開発中にこのファイルを書き換えたとき、開いているページのストアも新しい中身に差し替える（ホットリロード）
// これがないと、ページを再読み込みするまで古いストアのまま動いてしまう
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
}

// ===== Pinia ストア =====
// 「どのページからでも使える共有データ置き場」。
// ゲームの進行状況をここにまとめておけば、ゲーム画面・エンディング・分岐図のどれからでも読める。
import { defineStore, acceptHMRUpdate } from 'pinia'
import { scenes, getEndingType, endings, endingByPath } from '../data/scenario'

// 技術説明モードのデータ（data/lessons.js）は大きいので、TECH DOCS を押したときにだけ読みこむ。
// 本編だけ遊ぶ人は、ダウンロードしなくてすむ
let lessonData = null

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

// セリフの when（条件）が、今の選び方 path に合っているか
//   when: '0'  … 1回目の選択で 0番を選んだ
//   when: '?1' … 2回目の選択で 1番を選んだ（? はどちらでもよい）
//   when がないセリフは、いつでも出る
export function matchesWhen(when, path) {
  if (!when) return true
  return [...when].every((ch, i) => ch === '?' || path[i] === ch)
}

export const useGameStore = defineStore('game', {
  // ----- state：保存しておくデータ（コンポーネントの ref にあたる） -----
  state: () => ({
    sceneId: 'lunch', // いまのシーン（最初は昼休みの屋上）
    lineIndex: 0,     // シーンの中で何番目のセリフか
    path: '',         // 今回の選び方（選んだ選択肢の番号を並べた文字列。例：'101'）
    visited: loadVisited(), // これまでに通った分岐（path の一覧）
    movie: null,      // 再生中のムービーの名前（data/movies.js）。null なら再生していない
    mode: 'story',    // 'story'（本編） | 'lesson'（技術説明モード。data/lessons.js のシーンを使う）
  }),

  // ----- getters：state から計算する値（コンポーネントの computed にあたる） -----
  getters: {
    scene: (state) => (state.mode === 'lesson' ? lessonData.lessonScenes : scenes)[state.sceneId],
    // このシーンのセリフのうち、今の選び方で出るものだけ
    lines() {
      // getter から別の getter を使うときは this を使う
      // replay: true のセリフは、エンディングを1つでも見たあと（2周目以降）だけ出す
      return this.scene.lines.filter(
        (l) => matchesWhen(l.when, this.path) && (!l.replay || this.endingsSeenCount > 0),
      )
    },
    line() {
      return this.lines[this.lineIndex]
    },
    isLastLine() {
      return this.lineIndex === this.lines.length - 1
    },
    // これまでに見たエンディングの数（最後まで選んだ選び方の数）
    endingsSeenCount: (state) => new Set(state.visited.filter((p) => p.length === 3).map(getEndingType)).size,
    // 隠しエンディング以外の、8つのエンディングをすべて見たか
    allEndingsSeen: (state) =>
      Object.entries(endingByPath)
        .filter(([, id]) => !endings[id].secret)
        .every(([path]) => state.visited.includes(path)),
    // 画面に出す選択肢（secret の選択肢は、全部のエンディングを見たあとだけ）
    // ※ 選んだ番号は、元の choices の中の位置で記録するので、隠れていてもずれない
    visibleChoices() {
      return (this.scene.choices ?? []).filter((c) => !c.secret || this.allEndingsSeen)
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
      this.mode = 'story'
      this.sceneId = 'lunch'
      this.lineIndex = 0
      this.path = ''
      this.movie = null
      this.markVisited('')
    },

    // 技術説明モードを最初から始める
    async startLesson() {
      lessonData ??= await import('../data/lessons')
      this.mode = 'lesson'
      this.path = ''
      this.movie = null
      this.goToScene(lessonData.LESSON_START)
    },

    goToScene(id) {
      this.sceneId = id
      this.lineIndex = 0
      // movie が付いたシーンに入ったら、ムービーを再生する
      if (this.scene.movie) this.playMovie(this.scene.movie)
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
      // 技術説明モードの選択肢（目次）は、本編の選び方として記録しない
      if (this.mode === 'lesson') {
        this.goToScene(choice.next)
        return
      }
      const index = this.scene.choices.indexOf(choice)
      this.path += index
      this.markVisited(this.path)
      this.goToScene(choice.next)
    },

    // 分岐図の「ここから再開」：そのノードの状態にして、シーンの最初から始める
    jumpTo(node) {
      this.mode = 'story'
      this.movie = null
      this.goToScene(node.sceneId)
      this.path = node.key
    },

    // その ID が技術説明モードの「授業」のシーンか（見終わった授業の記録に使う）
    isLessonScene(id) {
      return Boolean(lessonData?.LESSON_IDS.has(id))
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

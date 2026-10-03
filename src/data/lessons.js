// ===== 技術説明モードのシナリオ =====
// ずんだもんと四国めたんが、このゲーム自身を教材にして Vue を説明する。
// 書き方は scenario.js のシーンとまったく同じ（同じ GameView で再生する）。
// ちがうのは次の2つだけ：
//   ・選択肢を選んでも、本編の選び方（path）や通った分岐（visited）には記録しない
//   ・finish: true のシーンの最後のセリフで、タイトルに戻る
//   ・lessonMenu: 'top' / 'vue' など … 目次のシーン。選択肢のかわりに、サムネイルつきの目次を出す
// terminal はコードの表示に使う（1行40文字くらいまで。先頭の空白はそのまま出る）
// diagram は右側に図を出す（components/effects/LessonDiagram.vue）。'tree' か { type: 'tree', focus: 'MessageBox' }
// playground はコードエディタを開く（下の PG_〇〇）。プレイヤーが書きかえると、その場で動く

export const LESSON_START = 'lesson_intro'

// ===== 目次 =====
// 目次は2段：最初の目次で「編」を選び、編の目次で「授業」を選ぶ（components/LessonMenu.vue が表示する）
// 授業が終わると、その編の目次に戻ってくる。並び順は、おすすめの順番
//   track : 'basic'（きほん） | 'build'（つくる） | 'ship'（公開する）  … カードの色分け
//   thumb : サムネイルに使う図（data/diagrams.js）  glyph : サムネイルに大きく出す文字
export const TRACKS = {
  basic: 'きほん',
  build: 'つくる',
  ship: '公開する',
}
export const EDITIONS = [
  {
    id: 'web', menu: 'lesson_menu_web', track: 'basic', thumb: 'http', glyph: 'HTTP',
    title: 'Web のしくみ', desc: 'ページが届くまで・JavaScript・保存',
    lessons: [
      { id: 'lesson_http', title: 'URL とサーバー', desc: 'Web ページが届くまで' },
      { id: 'lesson_devtools', title: '開発者ツール', desc: '画面の裏側をのぞく' },
      { id: 'lesson_js', title: 'JavaScript のきほん', desc: '変数・配列・関数・if' },
      { id: 'lesson_dom', title: 'DOM とイベント', desc: '画面を動かすしくみ' },
      { id: 'lesson_storage', title: 'localStorage', desc: 'ブラウザにしまう' },
    ],
  },
  {
    id: 'css', menu: 'lesson_menu_css', track: 'basic', thumb: 'box', glyph: '</>',
    title: 'HTML・CSS', desc: '画面の見た目のきほん',
    lessons: [
      { id: 'lesson_html', title: 'HTML', desc: 'タグで中身を書く' },
      { id: 'lesson_selector', title: 'セレクタ', desc: 'どこに・何を' },
      { id: 'lesson_box', title: 'ボックスモデル', desc: '箱の4つの層' },
      { id: 'lesson_flex', title: 'flex', desc: '横や縦に並べる' },
      { id: 'lesson_layer', title: 'position・z-index', desc: '重ねる' },
      { id: 'lesson_anim', title: 'アニメーション', desc: '動かす' },
    ],
  },
  {
    id: 'css2', menu: 'lesson_menu_css2', track: 'basic', thumb: 'grid', glyph: 'CSS+',
    title: 'CSS もっと', desc: 'hover・grid・スマホ対応',
    lessons: [
      { id: 'lesson_units', title: '大きさと色', desc: 'px・%・vw・rgba' },
      { id: 'lesson_pseudo', title: ':hover・::before', desc: 'マウスを乗せたら' },
      { id: 'lesson_transition', title: 'transition', desc: 'なめらかに変える' },
      { id: 'lesson_effects', title: '色づくり', desc: 'グラデーション・影・フィルター' },
      { id: 'lesson_grid', title: 'grid', desc: 'マス目に並べる' },
      { id: 'lesson_responsive', title: 'レスポンシブ', desc: 'スマホ対応' },
    ],
  },
  {
    id: 'vue', menu: 'lesson_menu_vue', track: 'build', thumb: 'tree', glyph: 'Vue',
    title: 'Vue のしくみ', desc: 'このゲームの画面が動くしくみ',
    lessons: [
      { id: 'lesson_component', title: 'コンポーネント', desc: '画面は「部品」でできている' },
      { id: 'lesson_reactive', title: 'ref・computed', desc: '値が変わると画面も変わる' },
      { id: 'lesson_directive', title: 'v-if・v-for', desc: '出す・消す・くり返す' },
      { id: 'lesson_props', title: 'props・emit', desc: '部品どうしの会話' },
      { id: 'lesson_watch', title: 'watch', desc: '変化を見張る' },
      { id: 'lesson_pinia', title: 'Pinia', desc: 'みんなの共有データ' },
      { id: 'lesson_router', title: 'Vue Router', desc: 'ページの切り替え' },
    ],
  },
  {
    id: 'ts', menu: 'lesson_menu_ts', track: 'build', thumb: 'tscheck', glyph: 'TS',
    title: 'TypeScript', desc: '型で事故をふせぐ',
    lessons: [
      { id: 'lesson_ts_why', title: 'なぜ TypeScript', desc: '型チェックとは' },
      { id: 'lesson_ts_types', title: '型のきほん', desc: 'type・interface・union' },
      { id: 'lesson_ts_func', title: '関数と any', desc: 'ジェネリクス・unknown' },
      { id: 'lesson_ts_vue', title: 'Vue と TypeScript', desc: 'props・emit に型' },
      { id: 'lesson_ts_data', title: '外から来るデータ', desc: '型ガード・null' },
      { id: 'lesson_ts_config', title: 'tsconfig と運用', desc: 'strict・CI での型チェック' },
    ],
  },
  {
    id: 'tools', menu: 'lesson_menu_tools', track: 'ship', thumb: 'build', glyph: 'npm',
    title: 'Web の道具', desc: 'npm・Vite・ビルド・公開',
    lessons: [
      { id: 'lesson_web', title: 'HTML・CSS・JS', desc: 'Web ページの3つの材料' },
      { id: 'lesson_npm', title: 'npm', desc: '道具の倉庫' },
      { id: 'lesson_modules', title: 'import・export', desc: 'ファイルどうしをつなぐ' },
      { id: 'lesson_dev', title: 'Vite', desc: '保存したらすぐ映る' },
      { id: 'lesson_build', title: 'ビルド', desc: '配れる形にまとめる' },
      { id: 'lesson_deploy', title: '公開', desc: 'みんなに遊んでもらう' },
    ],
  },
  {
    id: 'aws', menu: 'lesson_menu_aws', track: 'ship', thumb: 'staticsite', glyph: 'AWS',
    title: 'AWS', desc: '主なサービスと認証',
    lessons: [
      { id: 'lesson_aws_overview', title: '全体像', desc: 'リージョン・責任・料金' },
      { id: 'lesson_aws_authbasics', title: '認証のきほん', desc: '認証と認可・トークン・2種類の認証' },
      { id: 'lesson_aws_iam', title: 'IAM', desc: 'だれが・何をしてよいか' },
      { id: 'lesson_aws_creds', title: '認証情報', desc: 'SSO・OIDC・鍵の事故' },
      { id: 'lesson_aws_static', title: 'このゲームを公開', desc: 'S3・CloudFront' },
      { id: 'lesson_aws_compute', title: 'サーバーとサーバーレス', desc: 'EC2・ECS・Lambda' },
      { id: 'lesson_aws_data', title: 'DB とネットワーク', desc: 'RDS・DynamoDB・VPC' },
      { id: 'lesson_aws_auth', title: 'アプリのログイン', desc: 'Cognito・JWT' },
      { id: 'lesson_aws_ops', title: '監視・監査・コスト', desc: 'CloudWatch・IaC' },
    ],
  },
]
// 授業のシーン ID（見終わったかどうかを覚えるときに使う）
export const LESSON_IDS = new Set(EDITIONS.flatMap((e) => e.lessons.map((l) => l.id)))

// 目次のシーンの choices（ストアやスキップは、ふつうの選択肢として扱う）
const BACK = { text: '目次にもどる', next: 'lesson_menu' }
const MENU = [...EDITIONS.map((e) => ({ text: e.title, next: e.menu })), { text: 'おしまいにする', next: 'lesson_end' }]
const menuOf = (id) => [...EDITIONS.find((e) => e.id === id).lessons.map((l) => ({ text: l.title, next: l.id })), BACK]
const VUE_MENU = menuOf('vue')
const TOOLS_MENU = menuOf('tools')
const WEB_MENU = menuOf('web')
const CSS_MENU = menuOf('css')
const CSS2_MENU = menuOf('css2')
const TS_MENU = menuOf('ts')
const AWS_MENU = menuOf('aws')


// ===== コードエディタの「やってみよう」（components/CodePlayground.vue） =====
// セリフに playground: PG_COUNTER のように書くと、文字を出し終わったあとにエディタが開く。
// check は右の結果の要素を受け取って、できたら true を返す（CLEAR! が出る）
const PG_COUNTER = {
  title: 'ref を動かしてみる',
  task: 'ボタンを押してみるのだ。それから ref(0) の 0 を 100 に書きかえてみるのだ',
  code: `
<script setup>
const count = ref(0)
</script>

<template>
  <p>ずんだ餅：{{ count }} 個</p>
  <button @click="count++">もう1個</button>
</template>

<style>
p { font-size: 20px; }
button { padding: 6px 14px; font-size: 16px; }
</style>
`,
  check: (el) => Number(el.textContent.match(/(\d+)\s*個/)?.[1]) >= 100,
}

const PG_COMPUTED = {
  title: 'computed で計算する',
  task: 'ボタンを押すと、下の数もいっしょに変わるのだ。* 2 を * 10 にしてみるのだ',
  code: `
<script setup>
const count = ref(1)
const result = computed(() => count.value * 2)
</script>

<template>
  <p>count：{{ count }}</p>
  <p>計算した答え：{{ result }}</p>
  <button @click="count++">count を増やす</button>
</template>

<style>
p { font-size: 18px; }
button { padding: 6px 14px; font-size: 16px; }
</style>
`,
  check: (el) => {
    const [a, b] = [...el.textContent.matchAll(/：(\d+)/g)].map((m) => Number(m[1]))
    return a > 0 && b === a * 10
  },
}

const PG_LIST = {
  title: 'v-for と v-if',
  task: "items に 'カップラーメン' を足して、3つにしてみるのだ（'枝豆' のうしろに , を付けて書く）",
  code: `
<script setup>
const items = ref(['ずんだ餅', '枝豆'])
const show = ref(true)
</script>

<template>
  <button @click="show = !show">出す・消す</button>
  <ul v-if="show">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>

<style>
button { padding: 6px 14px; font-size: 16px; }
li { font-size: 18px; margin: 4px 0; }
</style>
`,
  check: (el) => el.querySelectorAll('li').length >= 3,
}

const PG_WATCH = {
  title: 'watch で見張る',
  task: 'ボタンを3回押してみるのだ。できたら 3 を 5 に変えて、もう一度ためすのだ',
  code: `
<script setup>
const count = ref(0)
const message = ref('まだなのだ')

watch(count, (n) => {
  if (n === 3) message.value = n + '回押したのだ！'
})
</script>

<template>
  <button @click="count++">押す（{{ count }}）</button>
  <p>{{ message }}</p>
</template>

<style>
button { padding: 6px 14px; font-size: 16px; }
p { font-size: 20px; }
</style>
`,
  check: (el) => el.textContent.includes('回押したのだ'),
}

const PG_WEB = {
  title: 'HTML・CSS・JavaScript',
  task: 'CSS の orange を green や hotpink に変えてみるのだ。ボタンも押してみるのだ',
  code: `
<template>
  <h1 class="title">放課後リライト</h1>
  <button @click="pushed = true">押してみる</button>
  <p v-if="pushed">押したのだ！</p>
</template>

<script setup>
const pushed = ref(false)
</script>

<style>
.title { color: orange; }
button { padding: 6px 14px; font-size: 16px; }
</style>
`,
  check: (el) => {
    const h1 = el.querySelector('h1')
    return Boolean(h1) && getComputedStyle(h1).color !== 'rgb(255, 165, 0)'
  },
}


// ===== コードを見せる画面（components/CodePlayground.vue の view モード） =====
// 本物のファイルから抜き出した中身。marks の数字は、光らせる行（1 から数える）
const CV_SCENE = {
  view: true,
  title: "シーンのデータ",
  file: "src/data/scenario.js",
  task: "ゲームの中身は、こういうデータで書いてあるのだ",
  marks: { 4: "背景の絵", 5: "流す曲", 8: "だれが話すか", 9: "立ち絵", 10: "画面効果", 11: "本文" },
  code: `
lunch: {
  chapter: { no: '01', title: 'ふたりの研究会', … },
  place: { name: '屋上', time: '12:35' },
  bg: 'roof_day',
  bgm: 'day',
  lines: [
    {
      speaker: 'ずんだもん',
      chara: 'zun_smile',
      fx: 'burst',
      text: 'あったのだ！ 購買の、*最後のずんだ餅*なのだ！',
    },
    // …セリフが続く
  ],
},
`,
}

const CV_MESSAGEBOX = {
  view: true,
  title: "メッセージ欄の部品",
  file: "src/components/MessageBox.vue",
  task: "1つのファイルに、動き・見た目・飾りの3つが入っているのだ（短くしてあるのだ）",
  marks: { 1: "動き（script）", 9: "見た目（template）", 19: "飾り（style）" },
  code: `
<script setup>
defineProps({
  speaker: String,
  chars: Array,
  done: Boolean,
})
</script>

<template>
  <div class="message">
    <div v-if="speaker" class="speaker">{{ speaker }}</div>
    <p>
      <span v-for="(c, i) in chars" :key="i">{{ c.ch }}</span>
    </p>
    <span v-if="done" class="hint">▼</span>
  </div>
</template>

<style scoped>
.message { position: absolute; bottom: 24px; }
</style>
`,
}

const CV_TYPING = {
  view: true,
  title: "1文字ずつ出すしくみ",
  file: "src/views/GameView.vue",
  task: "本物のゲーム画面でも、ref と computed でこう書いてあるのだ（短くしてあるのだ）",
  marks: { 2: "ref（箱）", 3: "computed", 4: "computed", 8: "増やすだけ！" },
  code: `
// ===== タイプライター演出（1文字ずつ表示する） =====
const typedLength = ref(0) // いま何文字目まで出しているか
const typedChars = computed(() => chars.value.slice(0, typedLength.value))
const isTyping = computed(() => typedLength.value < chars.value.length)

// 1文字出して、少し待ってから次の文字へ
function typeNext() {
  typedLength.value++
  if (!isTyping.value) return
  typeTimer = setTimeout(typeNext, …)
}
`,
}

const CV_CHOICES = {
  view: true,
  title: "選択肢を出すしくみ",
  file: "GameView.vue ／ ChoiceList.vue",
  task: "v-if と v-for は、本物ではこう組み合わさっているのだ",
  marks: { 3: "条件に合うときだけ", 10: "数だけくり返す", 11: "見分けるための名札", 14: "値を文字で出す" },
  code: `
<!-- GameView.vue：読み終わったときだけ、選択肢を出す -->
<ChoiceList
  v-if="choosing"
  :choices="game.visibleChoices"
  @choose="game.choose"
/>

<!-- ChoiceList.vue：選択肢の数だけ、ボタンを並べる -->
<button
  v-for="(choice, i) in choices"
  :key="choice.text"
  @click="select(choice, i)"
>
  {{ choice.text }}
</button>
`,
}

const CV_PROPS = {
  view: true,
  title: "親と子のやりとり",
  file: "GameView.vue ／ MessageBox.vue ／ ChoiceList.vue",
  task: "props は上から下へ、emit は下から上へなのだ（短くしてあるのだ）",
  marks: { 3: "↓ props で渡す", 7: "↑ emit を受け取る", 10: "受け取る約束", 18: "↑ 親に知らせる" },
  code: `
<!-- 親：GameView.vue -->
<MessageBox
  :speaker="game.line.speaker"
  :chars="typedChars"
  :done="!isTyping"
/>
<ChoiceList :choices="game.visibleChoices" @choose="game.choose" />

// 子：MessageBox.vue（受け取る）
defineProps({
  speaker: String,
  chars: Array,
  done: Boolean,
})

// 子：ChoiceList.vue（知らせる）
const emit = defineEmits(['choose', 'pick'])
emit('choose', choice)
`,
}

const CV_WATCH = {
  view: true,
  title: "観測計の watch",
  file: "src/components/NixieMeter.vue",
  task: "右上の観測計が回るのも、watch のおかげなのだ（短くしてあるのだ）",
  marks: { 8: "見張る値", 9: "変わったら動く", 11: "画面が変わる" },
  code: `
const props = defineProps({
  value: String,
})
const shown = ref(props.value) // 実際に画面に出している文字列

// watch：props.value が変わったときだけ、中の関数が呼ばれる
watch(
  () => props.value,
  (newValue) => {
    // しばらく数字をランダムに回してから……
    shown.value = newValue // 本当の値を表示して止める
  },
)
`,
}

const CV_STORE = {
  view: true,
  title: "ゲームのストア",
  file: "src/stores/game.js",
  task: "state・getters・actions の3つでできているのだ（短くしてあるのだ）",
  marks: { 3: "ref にあたる", 10: "computed にあたる", 15: "ふつうの関数", 17: "クリックで1つ進む" },
  code: `
export const useGameStore = defineStore('game', {
  // state：保存しておくデータ
  state: () => ({
    sceneId: 'lunch', // いまのシーン
    lineIndex: 0,     // シーンの中で何番目のセリフか
    path: '',         // 今回の選び方
  }),

  // getters：state から計算する値
  getters: {
    scene: (state) => scenes[state.sceneId],
  },

  // actions：state を変える関数
  actions: {
    next() {
      this.lineIndex++
    },
  },
})
`,
}

const CV_ROUTER = {
  view: true,
  title: "URL とページの対応表",
  file: "src/router/index.js",
  task: "URL と画面の組を、配列に並べるだけなのだ（短くしてあるのだ）",
  marks: { 1: "ふつうの URL を使う", 8: "URL と画面の組", 10: "/ending/true など" },
  code: `
import { createRouter, createWebHistory } from 'vue-router'
import TitleView from '../views/TitleView.vue'
import GameView from '../views/GameView.vue'
// …

const routes = [
  { path: '/', component: TitleView },
  { path: '/game', component: GameView },
  // :type は「ルートパラメータ」
  { path: '/ending/:type', component: EndingView },
  { path: '/credits', component: CreditsView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
`,
}

const CV_START = {
  view: true,
  title: "START ボタン",
  file: "src/views/TitleView.vue",
  task: "START を押したときに動く関数なのだ",
  marks: { 5: "ここでページが変わる" },
  code: `
function start() {
  play('impact')
  game.reset()               // ストアの action を呼んで、最初から始める
  game.playMovie('opening')  // オープニングムービーから始める
  router.push('/game')       // コードでページ移動する
}
`,
}

const CV_CSS = {
  view: true,
  title: "メッセージ欄の CSS",
  file: "src/components/MessageBox.vue",
  task: "場所と大きさを決めているのが CSS なのだ（一部だけ）",
  marks: { 4: "画面の下のほうに", 5: "重なりの順番", 6: "スマホでもはみ出さない幅", 7: "まんなかにそろえる" },
  code: `
.message {
  position: absolute;
  left: 50%;
  bottom: 24px;
  z-index: 2;
  width: min(900px, calc(100% - 32px));
  transform: translateX(-50%);
  min-height: 130px;
  padding: 22px 28px;
}
`,
}

const CV_PKG = {
  view: true,
  title: "package.json",
  file: "package.json",
  task: "借りている道具のリストと、命令のあだ名が書いてあるのだ",
  marks: { 7: "npm run dev", 8: "npm run build", 11: "遊ぶときに使う道具", 16: "作るときだけ使う道具" },
  code: `
{
  "name": "neko-novel",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "pinia": "^4.0.3",
    "vue": "^3.5.43",
    "vue-router": "^5.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.9",
    "vite": "^8.3.1"
  }
}
`,
}

const CV_INDEX = {
  view: true,
  title: "いちばん最初に開くファイル",
  file: "index.html",
  task: "中身はほとんど空っぽなのだ（短くしてあるのだ）",
  marks: { 9: "ここに Vue が画面を作る", 10: "main.js を読みこむ" },
  code: `
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>放課後リライト</title>
    <link href="https://fonts.googleapis.com/…" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`,
}

const CV_MAIN = {
  view: true,
  title: "アプリの入り口",
  file: "src/main.js",
  task: "import で道具を借りて、アプリを組み立てているのだ",
  marks: { 2: "npm で借りた道具", 4: "自分で書いたファイル", 10: "index.html の #app に出す" },
  code: `
// アプリの入り口
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

createApp(App)
  .use(createPinia()) // Pinia（共有データ）を使えるようにする
  .use(router)        // Vue Router（ページ切り替え）を使えるようにする
  .mount('#app')
`,
}

const CV_EXPORT = {
  view: true,
  title: "export と import",
  file: "lessons.js ／ stores/game.js",
  task: "export で貸して、import で借りるのだ",
  marks: { 2: "export で貸す", 3: "export で貸す", 6: "import で借りる" },
  code: `
// data/lessons.js（貸す側）
export const LESSON_START = 'lesson_intro'
export const lessonScenes = { … }

// stores/game.js（借りる側）
import { lessonScenes, LESSON_START } from '../data/lessons'
`,
}

const CV_HMR = {
  view: true,
  title: "ストアの差し替え",
  file: "src/stores/game.js",
  task: "ストアを書きかえたときも、ページを読みこみ直さずに差し替わるのだ",
  marks: { 3: "開発中だけ動く" },
  code: `
// 開発中にこのファイルを書き換えたとき、開いているページのストアも
// 新しい中身に差し替える（ホットリロード）
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
}
`,
}

const CV_VITECONFIG = {
  view: true,
  title: "Vite の設定",
  file: "vite.config.js",
  task: "このゲームの Vite の設定は、これだけなのだ",
  marks: { 5: ".vue を読めるようにする" },
  code: `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
`,
}

const CV_DIST_INDEX = {
  view: true,
  title: "ビルドしたあとの index.html",
  file: "dist/index.html",
  task: "ビルドすると、読みこむファイルが書きかわるのだ（短くしてあるのだ）",
  marks: { 6: "まとめた JavaScript", 7: "まとめた CSS" },
  code: `
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>放課後リライト</title>
    <script type="module" crossorigin src="/assets/index-D5ke4YzN.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-FGgbxRK9.css">
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`,
}

const CV_BASE = {
  view: true,
  title: "GitHub Pages に置くとき",
  file: "vite.config.js",
  task: "URL の途中のフォルダに置くなら、base を足すのだ（いまのゲームには、まだ書いていないのだ）",
  marks: { 5: "置く場所のフォルダ名" },
  code: `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/リポジトリ名/',
  plugins: [vue()],
})
`,
}


// ===== HTML・CSS 編のコード =====
const CV_HTML_MESSAGE = {
  view: true,
  title: "メッセージ欄の HTML",
  file: "src/components/MessageBox.vue",
  task: "タグの中にタグが入っている「入れ子」なのだ（短くしてあるのだ）",
  marks: { 1: "いちばん外の箱", 2: "左上のかざり", 3: "名前", 4: "本文", 5: "1文字ずつ span" },
  code: `
<div class="message">
  <span class="bracket tl"></span>
  <div class="speaker">ずんだもん</div>
  <p>
    <span class="char">待</span>
    <span class="char">っ</span>
    <span class="char">て</span>
  </p>
  <span class="hint">▼</span>
</div>
`,
}

const CV_SELECTOR = {
  view: true,
  title: "四隅のかざりの CSS",
  file: "src/components/MessageBox.vue",
  task: "同じ class に、もう1つ class を足して、場所だけ変えているのだ",
  marks: { 2: "4つ共通の見た目", 8: "左上だけ", 11: "右下だけ" },
  code: `
/* 四隅の照準枠（飾り） */
.bracket {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 0 solid #ffb066;
}
.bracket.tl { top: -6px; left: -6px; border-top-width: 2px; border-left-width: 2px; }
.bracket.tr { top: -6px; right: -6px; border-top-width: 2px; border-right-width: 2px; }
.bracket.bl { bottom: -6px; left: -6px; border-bottom-width: 2px; border-left-width: 2px; }
.bracket.br { bottom: -6px; right: -6px; border-bottom-width: 2px; border-right-width: 2px; }
`,
}

const CV_BOX_MESSAGE = {
  view: true,
  title: "メッセージ欄の箱",
  file: "src/components/MessageBox.vue",
  task: "padding と border と box-sizing で、箱の大きさが決まるのだ（一部だけ）",
  marks: { 4: "上下22px・左右28px", 5: "幅に padding と枠をふくめる", 7: "左だけオレンジの太い線" },
  code: `
.message {
  width: min(900px, calc(100% - 32px));
  min-height: 130px;
  padding: 22px 28px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-left: 4px solid #ff7b00;
  background: linear-gradient(rgba(8, 10, 20, 0.86), rgba(8, 10, 20, 0.72));
}
`,
}

const CV_FLEX_TITLE = {
  view: true,
  title: "タイトル画面の並べ方",
  file: "src/views/TitleView.vue",
  task: "タイトル画面は、flex で縦にも横にも並べているのだ",
  marks: { 6: "縦に並べる", 7: "横方向のまんなか", 8: "縦方向のまんなか", 16: "すきま24px" },
  code: `
/* ロゴ・START・リンクを、縦にまんなかへ並べる */
.content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
}

/* WORLDLINE・ARCHIVE・CREDITS を横に並べる */
.sub-links {
  display: flex;
  gap: 24px;
}
`,
}

const CV_ZINDEX = {
  view: true,
  title: "重なりの順番",
  file: "MessageBox.vue ／ ChoiceList.vue ／ MoviePlayer.vue",
  task: "position: absolute で重ねて、z-index で順番を決めているのだ（一部だけ）",
  marks: { 3: "自由な場所に置く", 5: "2番目くらい", 11: "画面いっぱい", 12: "メッセージ欄より手前", 16: "いちばん手前" },
  code: `
/* MessageBox.vue：メッセージ欄 */
.message {
  position: absolute;
  bottom: 24px;
  z-index: 2;
}

/* ChoiceList.vue：選択肢（メッセージ欄より手前） */
.choices {
  position: absolute;
  inset: 0;
  z-index: 4;
}

/* MoviePlayer.vue：ムービー（いちばん手前） */
z-index: 10;
`,
}

const CV_ANIM_TITLE = {
  view: true,
  title: "START ボタンの光",
  file: "src/views/TitleView.vue",
  task: "START ボタンを光がなでていくのは、この CSS なのだ",
  marks: { 2: "ボタンの上に光の帯を足す", 10: "3.2秒ごとにくり返す", 12: "動きの台本", 14: "最初の4割で通りすぎる" },
  code: `
/* START ボタンを光がなでるように通り過ぎる */
.start::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40%;
  left: -60%;
  background: linear-gradient(90deg, transparent, rgba(255, 180, 100, 0.35), transparent);
  animation: sweep 3.2s ease-in-out infinite 1.5s;
}
@keyframes sweep {
  0% { left: -60%; }
  40%, 100% { left: 120%; }
}
`,
}

const PG_HTML = {
  title: "HTML のタグ",
  task: "<li> の行をコピーして、部員を3人にしてみるのだ",
  code: `
<template>
  <h1>時間工学研究会</h1>
  <p>部員<strong>募集中</strong>なのだ！</p>
  <ul>
    <li>ずんだもん（部長）</li>
    <li>僕（部員）</li>
  </ul>
  <button>入部する</button>
</template>

<style>
h1 { font-size: 22px; }
li { font-size: 16px; }
button { padding: 6px 14px; font-size: 16px; }
</style>
`,
  check: (el) => el.querySelectorAll('li').length >= 3,
}

const PG_SELECTOR = {
  title: "セレクタ",
  task: "2つめの <p> に class=\"metan\" を付けて、.metan { color: deeppink; } を足してみるのだ",
  code: `
<template>
  <p class="zun">ずんだもん：枝豆は最高なのだ！</p>
  <p>四国めたん：わたくしはお茶をいただきますわ。</p>
  <p>僕：……カップラーメンでいいや。</p>
</template>

<style>
/* セレクタ { プロパティ: 値; } */
.zun {
  color: green;
  font-weight: bold;
}
p {
  font-size: 16px;
}
</style>
`,
  check: (el) => {
    const p = el.querySelector('.metan')
    return Boolean(p) && getComputedStyle(p).color !== 'rgb(34, 34, 34)'
  },
}

const PG_BOX = {
  title: "ボックスモデル",
  task: "padding を 24px に、margin を 20px にして、箱がどう変わるか見るのだ",
  code: `
<template>
  <div class="box">メッセージ欄なのだ</div>
  <div class="box">となりの箱なのだ</div>
</template>

<style>
.box {
  padding: 4px;
  border: 3px solid #ff9a3c;
  margin: 4px;
  background: #fff3e6;
  font-size: 16px;
}
</style>
`,
  check: (el) => {
    const st = getComputedStyle(el.querySelector('.box'))
    return parseFloat(st.paddingTop) >= 20 && parseFloat(st.marginTop) >= 16
  },
}

const PG_FLEX = {
  title: "flex で並べる",
  task: "justify-content を center に変えてみるのだ。flex-direction: column; を足すと縦になるのだ",
  code: `
<template>
  <nav class="links">
    <a>WORLDLINE</a>
    <a>ARCHIVE</a>
    <a>CREDITS</a>
  </nav>
</template>

<style>
.links {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}
a {
  padding: 8px 12px;
  border: 1px solid #999;
  font-size: 14px;
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.links')).justifyContent === 'center',
}

const PG_LAYER = {
  title: "z-index で重ねる",
  task: ".bg の z-index を 5 にすると……背景がいちばん前に来てしまうのだ。やってみるのだ",
  code: `
<template>
  <div class="stage">
    <div class="layer bg">背景</div>
    <div class="layer chara">立ち絵</div>
    <div class="layer message">メッセージ欄</div>
  </div>
</template>

<style>
.stage { position: relative; height: 170px; }
.layer {
  position: absolute;
  width: 150px;
  height: 80px;
  padding: 6px;
  color: #fff;
  font-size: 15px;
}
.bg      { left: 0;    top: 0;    background: #4a6fa5; z-index: 1; }
.chara   { left: 40px; top: 35px; background: #4f9a40; z-index: 2; }
.message { left: 80px; top: 70px; background: #e07b20; z-index: 3; }
</style>
`,
  check: (el) => Number(getComputedStyle(el.querySelector('.bg')).zIndex) > 3,
}

const PG_ANIM = {
  title: "アニメーション",
  task: "2s を 0.5s に変えたり、-10px を -40px にしてみるのだ",
  code: `
<template>
  <p class="logo">放課後リライト</p>
</template>

<style>
.logo {
  margin-top: 40px;
  font-size: 28px;
  font-weight: bold;
  color: #ff7b00;
  animation: float 2s ease-in-out infinite;
}
/* @keyframes：動きの台本。0% から 100% までの変化を書く */
@keyframes float {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.logo')).animationDuration !== '2s',
}


// ===== Web のしくみ編・CSS もっと編のコード =====
const CV_URL = {
  view: true,
  title: "URL の読み方",
  file: "（例）",
  task: "URL は、いくつかの部品がつながってできているのだ",
  marks: { 1: "ぜんぶで1つの URL", 3: "鍵つきの通信なら https", 4: "サーバーの住所" },
  code: `
https://example.github.io/after-school/game?ending=true#top

https://            … プロトコル（どうやって通信するか）
example.github.io   … ドメイン（どのサーバーか）
/after-school/game  … パス（サーバーの中の、どの場所か）
?ending=true        … クエリ（おまけの情報）
#top                … ハッシュ（ページの中の位置）
`,
}

const PG_URL = {
  title: "URL を分解する",
  task: "URL の game を credits に書きかえて、パスが変わるのを見るのだ",
  code: `
<script setup>
// ブラウザにある URL という道具で、URL を部品に分ける
const url = new URL('https://example.github.io/after-school/game?ending=true#top')
</script>

<template>
  <table>
    <tr><th>プロトコル</th><td>{{ url.protocol }}</td></tr>
    <tr><th>ドメイン</th><td>{{ url.host }}</td></tr>
    <tr><th>パス</th><td>{{ url.pathname }}</td></tr>
    <tr><th>クエリ</th><td>{{ url.search }}</td></tr>
    <tr><th>ハッシュ</th><td>{{ url.hash }}</td></tr>
  </table>
</template>

<style>
table { border-collapse: collapse; font-size: 14px; }
th, td { padding: 6px 10px; border: 1px solid #ccc; text-align: left; }
th { background: #fff3e6; }
</style>
`,
  check: (el) => el.textContent.includes('/credits'),
}

const CV_SAVE = {
  view: true,
  title: "セーブデータ",
  file: "src/stores/game.js",
  task: "見たエンディングは、ブラウザの localStorage にしまってあるのだ",
  marks: { 2: "しまうときの名前", 6: "読み出す", 7: "うまくいかなくても止まらない", 14: "しまう" },
  code: `
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
`,
}

const CV_CONSOLE = {
  view: true,
  title: "Console に書き出す",
  file: "（例）",
  task: "console.log で、いまの値を Console に書き出せるのだ",
  marks: { 2: "値をのぞく", 6: "Console の表示" },
  code: `
// コードの好きな場所に書いておくと……
console.log('いまのシーン:', game.sceneId)
console.log('選んだ番号:', game.path)

// Console タブに、こう出る
// > いまのシーン: lunch
// > 選んだ番号: 10
`,
}

const CV_ENDING = {
  view: true,
  title: "エンディングの決め方",
  file: "src/data/scenario.js",
  task: "オブジェクトと関数で、選び方からエンディングを決めているのだ（一部だけ）",
  marks: { 2: "オブジェクト（対応表）", 7: "TRUE END の選び方", 11: "関数", 12: "見つからないときは lost" },
  code: `
// 3回の選び方で、8通りのエンディングに分かれる
export const endingByPath = {
  '000': 'deja',
  '001': 'allB',
  '010': 'lost',
  '011': 'night',
  '101': 'true',
  // …
}

export function getEndingType(path) {
  return endingByPath[path] ?? 'lost'
}
`,
}

const PG_JS = {
  title: "JavaScript のきほん",
  task: "mochi を 5 にして、club に '四国めたん' を足してみるのだ",
  code: `
<script setup>
// 変数：名前を付けて、値をしまう
let mochi = 3

// 配列：値をまとめて並べる
const club = ['ずんだもん', '僕']

// 関数：やることをまとめて、名前を付ける
function judge(count) {
  // if：条件で分ける
  if (count >= 5) {
    return 'ずんだ餅パーティーなのだ！'
  }
  return 'もっとずんだ餅がほしいのだ'
}
</script>

<template>
  <p>部員は {{ club.length }} 人：{{ club.join('・') }}</p>
  <p>ずんだ餅 {{ mochi }} 個 → {{ judge(mochi) }}</p>
</template>

<style>
p { font-size: 17px; }
</style>
`,
  check: (el) => el.textContent.includes('パーティー') && el.textContent.includes('3 人'),
}

const CV_VANILLA = {
  view: true,
  title: "Vue があるとき・ないとき",
  file: "（例）くらべてみる",
  task: "Vue がないと、画面を書きかえるのも自分でやるのだ",
  marks: { 2: "要素を探す", 6: "クリックを待つ", 8: "自分で書きかえる", 12: "Vue なら1行" },
  code: `
// Vue を使わないとき：自分で要素を探して、書きかえる
const button = document.querySelector('#next')
const message = document.querySelector('#message')
let index = 0

button.addEventListener('click', () => {
  index++
  message.textContent = lines[index]
})

// Vue を使うとき：値を変えるだけ（画面は Vue が書きかえる）
// <button @click="game.next()">つぎへ</button>
// <p>{{ game.line.text }}</p>
`,
}

const PG_DOM = {
  title: "いろいろなイベント",
  task: "ボタンを押したり、マウスを乗せたり、文字を打ったりしてみるのだ（記録が3つたまったらクリア）",
  code: `
<script setup>
const log = ref([])
function add(text) {
  log.value = [text, ...log.value].slice(0, 5) // 新しいものを上に、5つまで
}
</script>

<template>
  <button @click="add('クリックされたのだ')">クリック</button>
  <button @mouseenter="add('マウスが乗ったのだ')">乗せるだけ</button>
  <input placeholder="ここに入力" @input="add('入力：' + $event.target.value)" />
  <ul>
    <li v-for="(item, i) in log" :key="i">{{ item }}</li>
  </ul>
</template>

<style>
button { margin: 0 6px 6px 0; padding: 6px 12px; font-size: 15px; }
input { padding: 6px; font-size: 16px; width: 140px; }
li { font-size: 15px; }
</style>
`,
  check: (el) => el.querySelectorAll('li').length >= 3,
}

const PG_STORAGE = {
  title: "localStorage にしまう",
  task: "メモを書いて保存したら、「もとに戻す」を押してみるのだ。コードが最初に戻っても、メモは残っているのだ",
  code: `
<script setup>
// localStorage：ブラウザに文字をしまっておける（ページを閉じても残る）
const KEY = 'after-school-rewrite:memo'
const memo = ref(localStorage.getItem(KEY) ?? '')
const saved = ref('')

function save() {
  localStorage.setItem(KEY, memo.value)
  saved.value = '保存したのだ！'
}
</script>

<template>
  <textarea v-model="memo" rows="3" placeholder="キミのメモ"></textarea>
  <button @click="save">保存する</button>
  <p>{{ saved }}</p>
</template>

<style>
textarea { display: block; width: 100%; box-sizing: border-box; font-size: 16px; }
button { margin-top: 6px; padding: 6px 14px; font-size: 15px; }
</style>
`,
  check: () => Boolean(localStorage.getItem('after-school-rewrite:memo')),
}

const CV_UNITS = {
  view: true,
  title: "大きさと色の書き方",
  file: "GameView.vue ／ TitleView.vue ／ MessageBox.vue",
  task: "このゲームでは、いろいろな単位を使い分けているのだ",
  marks: { 2: "画面の高さの100%", 5: "小さすぎず大きすぎず", 8: "小さいほうを使う", 11: "0.86 = ほぼ黒" },
  code: `
/* GameView.vue：画面の高さいっぱい */
.screen { height: 100vh; }

/* TitleView.vue：画面の幅に合わせて、ロゴの大きさを変える */
h1 { font-size: clamp(2.4rem, 8vw, 4.5rem); }

/* MessageBox.vue：最大 900px。せまい画面では左右を 16px ずつあける */
.message { width: min(900px, calc(100% - 32px)); }

/* MessageBox.vue：少しすけた黒（最後の数字が濃さ） */
background: linear-gradient(rgba(8, 10, 20, 0.86), rgba(8, 10, 20, 0.72));
`,
}

const PG_UNITS = {
  title: "単位と色",
  task: "50% を 100% に、rgba の 0.4 を 1 にしてみるのだ（0 でとうめい、1 ではっきり）",
  code: `
<template>
  <div class="bar px">200px</div>
  <div class="bar percent">50%</div>
  <div class="bar em">10em</div>
  <span class="dot" style="background: #ff7b00">#ff7b00</span>
  <span class="dot" style="background: rgb(77, 160, 60)">rgb()</span>
  <span class="dot alpha">rgba()</span>
</template>

<style>
.bar {
  height: 28px;
  margin-bottom: 6px;
  padding-left: 6px;
  line-height: 28px;
  font-size: 12px;
  color: #fff;
  background: #4a6fa5;
}
.px      { width: 200px; }
.percent { width: 50%; }
.em      { width: 10em; }
.dot {
  display: inline-block;
  width: 72px;
  margin: 6px 6px 0 0;
  line-height: 48px;
  text-align: center;
  font-size: 11px;
  color: #fff;
}
.alpha { background: rgba(74, 111, 165, 0.4); }
</style>
`,
  check: (el) => {
    const bar = el.querySelector('.percent')
    return Boolean(bar) && bar.offsetWidth >= el.offsetWidth * 0.9
  },
}

const CV_PSEUDO = {
  view: true,
  title: "ボタンとロゴのしかけ",
  file: "App.vue ／ TitleView.vue",
  task: ":hover と ::before・::after は、このゲームのあちこちで使っているのだ（一部だけ）",
  marks: { 2: "マウスが乗っているあいだ", 8: "文字の前に、もう1枚", 10: "data-text の文字を使う", 14: "赤いずれ", 15: "青いずれ" },
  code: `
/* App.vue：マウスが乗ったら、ボタンが光る */
button:hover {
  background: rgba(255, 123, 0, 0.25);
  box-shadow: 0 0 18px rgba(255, 123, 0, 0.5);
}

/* TitleView.vue：ロゴのグリッチ。同じ文字を、もう2枚重ねる */
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text); /* 同じ文字をもう2枚重ねる */
  position: absolute;
  inset: 0;
}
.glitch-text::before { color: #ff2a6d; }
.glitch-text::after { color: #05d9e8; }
`,
}

const PG_PSEUDO = {
  title: ":hover と ::before",
  task: "ボタンにマウスを乗せてみるのだ。それから content: '' を content: '▶ ' にしてみるのだ",
  code: `
<template>
  <button class="btn">START</button>
</template>

<style>
.btn {
  padding: 10px 28px;
  font-size: 18px;
  color: #fff;
  background: #1c2033;
  border: 1px solid #ff9a3c;
}
/* :hover … マウスが乗っているあいだだけ */
.btn:hover {
  background: #ff7b00;
}
/* ::before … 中身の前に、文字や飾りを足す */
.btn::before {
  content: '';
}
</style>
`,
  check: (el) => {
    const btn = el.querySelector('.btn')
    return Boolean(btn) && getComputedStyle(btn, '::before').content.includes('▶')
  },
}

const CV_TRANSITION = {
  view: true,
  title: "なめらかに変わるところ",
  file: "App.vue ／ GameView.vue",
  task: "選択肢が出るとき、背景がゆっくり暗くなるのも transition なのだ",
  marks: { 3: "0.2秒でなめらかに", 8: "0.6秒と0.8秒", 11: "選択肢のときだけ", 12: "色をうすく・暗く" },
  code: `
/* App.vue：ボタンの色と光を、0.2秒かけて変える */
button {
  transition: background 0.2s, box-shadow 0.2s;
}

/* GameView.vue：背景の層 */
.world {
  transition: filter 0.6s, transform 0.8s;
}
/* 選択肢が出ている間は、世界が止まったように色が抜ける */
.choosing .world {
  filter: saturate(0.35) brightness(0.65);
  transform: scale(1.03);
}
`,
}

const PG_TRANSITION = {
  title: "transition",
  task: "0.3s を 1s にしたり、transition の行を消したりしてみるのだ。消すと、いきなり変わるのだ",
  code: `
<template>
  <div class="card">マウスを乗せるのだ</div>
</template>

<style>
.card {
  width: 180px;
  padding: 24px;
  text-align: center;
  font-size: 16px;
  background: #fff;
  border: 2px solid #ff9a3c;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.card:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.card')).transitionDuration !== '0.3s, 0.3s',
}

const CV_EFFECTS = {
  view: true,
  title: "このゲームの色づくり",
  file: "GameView.vue ／ MessageBox.vue",
  task: "シーンの色味や、メッセージ欄のすけ感は、こう作っているのだ（一部だけ）",
  marks: { 2: "夕焼けっぽく", 4: "冷たい感じに", 8: "上から下へ色が変わる", 9: "後ろをぼかす", 10: "影" },
  code: `
/* GameView.vue：色調補正（シーンの grade で切りかえる） */
.grade-warm { filter: sepia(0.25) saturate(1.25) contrast(1.05); }
.grade-teal { filter: hue-rotate(-12deg) saturate(1.2) contrast(1.15) brightness(0.95); }
.grade-cold { filter: saturate(0.7) hue-rotate(15deg) brightness(0.9) contrast(1.1); }

/* MessageBox.vue：メッセージ欄 */
.message {
  background: linear-gradient(rgba(8, 10, 20, 0.86), rgba(8, 10, 20, 0.72));
  backdrop-filter: blur(6px); /* 後ろの背景をぼかす */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}
`,
}

const PG_EFFECTS = {
  title: "フィルターとグラデーション",
  task: "filter を grayscale(1) や hue-rotate(90deg) や blur(3px) に変えてみるのだ",
  code: `
<template>
  <div class="photo"></div>
  <p class="title">放課後リライト</p>
</template>

<style>
.photo {
  height: 150px;
  background: url(images/bg/roof_evening.webp) center / cover;
  filter: sepia(0.25) saturate(1.25);
}
.title {
  margin: 10px 0 0;
  padding: 6px 12px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #1c2033, #ff7b00);
  text-shadow: 0 0 8px #ff9a3c;
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.photo')).filter !== 'sepia(0.25) saturate(1.25)',
}

const CV_GRID = {
  view: true,
  title: "目次のカード",
  file: "src/components/LessonMenu.vue",
  task: "この授業の目次のカードも、grid で並べているのだ",
  marks: { 3: "マス目にする", 4: "同じ幅の列を4つ", 5: "すきま", 12: "こちらは2列" },
  code: `
/* 編のカード：同じ幅の列を4つ */
.cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  width: min(960px, 100%);
}

/* 授業の一覧：同じ幅の列を2つ */
.rows {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
`,
}

const PG_GRID = {
  title: "grid で並べる",
  task: "repeat(3, 1fr) の 3 を 2 や 6 に変えてみるのだ",
  code: `
<template>
  <div class="gallery">
    <div v-for="n in 6" :key="n" class="cell">スチル {{ n }}</div>
  </div>
</template>

<style>
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.cell {
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background: #4a6fa5;
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.gallery')).gridTemplateColumns.split(' ').length !== 3,
}

const CV_MEDIA = {
  view: true,
  title: "スマホのときだけ",
  file: "index.html ／ LessonMenu.vue",
  task: "画面がせまいときだけ、別の CSS を使っているのだ",
  marks: { 2: "これがないとスマホで小さく表示される", 5: "640px 以下のときだけ", 6: "カードは2列に", 7: "授業は1列に" },
  code: `
<!-- index.html：スマホでも、画面の幅どおりに表示する -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

/* LessonMenu.vue：画面の幅が 640px 以下のときだけ */
@media (max-width: 640px) {
  .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .rows { grid-template-columns: minmax(0, 1fr); }
}
`,
}

const PG_RESPONSIVE = {
  title: "幅で見た目を変える",
  task: "右下のかどをドラッグして、枠をせまくしてみるのだ。260px を 600px に変えてもいいのだ",
  code: `
<template>
  <div class="frame">
    <nav class="menu">
      <a>WORLDLINE</a>
      <a>ARCHIVE</a>
      <a>CREDITS</a>
    </nav>
  </div>
  <p class="tip">↑ 枠の右下のかどを、左へドラッグ</p>
</template>

<style>
/* 枠の幅で見た目を変える（スマホ対応の練習） */
.frame {
  container-type: inline-size;
  resize: horizontal;
  overflow: auto;
  width: 100%;
  min-width: 120px;
  padding: 8px;
  border: 2px dashed #999;
  box-sizing: border-box;
}
.menu { display: flex; gap: 8px; }
.menu a { padding: 8px; border: 1px solid #ff9a3c; font-size: 13px; }
.tip { font-size: 12px; color: #888; }

/* 枠の幅が 260px 以下になったら、縦に並べる */
@container (max-width: 260px) {
  .menu { flex-direction: column; }
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.menu')).flexDirection === 'column',
}

// ===== TypeScript 編・AWS 編のコード =====
const CV_TS_BUG = {
  view: true,
  title: "JavaScript と TypeScript",
  file: "（例）",
  task: "同じまちがいでも、気づくタイミングがちがうのだ",
  marks: { 3: "実行してやっと気づく", 6: ": Line が型", 7: "動かす前に気づける" },
  code: `
// JavaScript：書きまちがえても、動かすまで気づけない
const line = { speaker: 'ずんだもん', txt: 'あったのだ！' }
showMessage(line.text)   // → 画面に undefined と出る

// TypeScript：保存した瞬間に、エディタが赤線を引く
const line: Line = { speaker: 'ずんだもん', txt: 'あったのだ！' }
// エラー TS2561：'txt' というプロパティは Line にない。
//               'text' のまちがいでは？
`,
}

const CV_TS_SCENE = {
  view: true,
  title: "このゲームのデータに型を付けると",
  file: "src/types/scene.ts（もし TypeScript なら）",
  task: "シーンやセリフの「形」を、型で決めておくのだ",
  marks: { 1: "union 型（どれか1つ）", 6: "null もありえる", 8: "なくてもよい", 18: "配列の型" },
  code: `
type Speaker = 'ずんだもん' | '四国めたん' | '僕' | 'SYSTEM' | ''
type Fx = 'shake' | 'flash' | 'glitch' | 'burst'

interface Line {
  speaker: Speaker
  chara: string | null   // 立ち絵がないときは null
  text: string
  fx?: Fx                // ? は「なくてもよい」
}

interface Choice {
  text: string
  next: string
}

interface Scene {
  bg: string
  lines: Line[]          // Line の配列
  choices?: Choice[]
  next?: string
}
`,
}

const CV_TS_UNION = {
  view: true,
  title: "決まった値しか入らない",
  file: "（例）",
  task: "union 型にしておくと、打ちまちがいがエラーになるのだ",
  marks: { 5: "打ちまちがい", 7: "すぐ気づける", 11: "これもエラー" },
  code: `
const line: Line = {
  speaker: 'ずんだもん',
  chara: 'zun_surprise',
  text: '揺れるのだ！',
  fx: 'shoke',
}
// エラー TS2322：'"shoke"' は Fx 型に入れられない
//   （Fx は 'shake' | 'flash' | 'glitch' | 'burst'）

const who: Speaker = 'ずんだもん'  // OK
const who2: Speaker = 'ずんだ'     // エラー：候補にない
`,
}

const CV_TS_FUNC = {
  view: true,
  title: "関数・推論・ジェネリクス",
  file: "（例）",
  task: "型は全部書かなくても、TypeScript がかなり見ぬいてくれるのだ",
  marks: { 2: "引数と戻り値の型", 7: "書かなくてもわかる", 11: "T はあとで決まる型", 14: "T = number" },
  code: `
// 引数と戻り値に型を付ける
function getEndingType(path: string): EndingId {
  return endingByPath[path] ?? 'lost'
}

// 型推論：書かなくても、型がわかる
const count = 3              // number
const club = ['ずんだもん']  // string[]

// ジェネリクス：「中身の型」を、使うときに決める
function last<T>(items: T[]): T | undefined {
  return items[items.length - 1]
}
const a = last([1, 2, 3])        // number | undefined
const b = last(['僕', 'めたん']) // string | undefined
`,
}

const CV_TS_ANY = {
  view: true,
  title: "any と unknown",
  file: "（例）",
  task: "any は型チェックを止めてしまうのだ。わからないときは unknown なのだ",
  marks: { 2: "チェックが止まる", 3: "本番で落ちる", 6: "わからないなら unknown", 9: "確かめてから使う" },
  code: `
// any：型チェックが止まる（なんでも通ってしまう）
const a: any = JSON.parse(text)
a.foo.bar.baz()       // エラーにならない → 実行してから落ちる

// unknown：確かめるまで使えない
const u: unknown = JSON.parse(text)
u.foo                 // エラー TS18046：'u' の型は unknown

if (typeof u === 'object' && u !== null && 'foo' in u) {
  // ここまで確かめれば、安全に使える
}
`,
}

const CV_TS_VUE = {
  view: true,
  title: "Vue の部品に型を付ける",
  file: "MessageBox.vue（もし TypeScript なら）",
  task: "<script setup lang=\"ts\"> にすると、props や emit に型が付くのだ",
  marks: { 1: "TypeScript で書く", 9: "props の型", 15: "emit の型", 19: "型は推論される" },
  code: `
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Char {
  ch: string
  style: string | null
}

const props = defineProps<{
  speaker: string
  chars: Char[]
  done: boolean
}>()

const emit = defineEmits<{
  next: []                  // 引数なし
}>()

const typedLength = ref(0)  // Ref<number>（推論される）
const isTyping = computed(() => typedLength.value < props.chars.length)
</script>
`,
}

const CV_TS_PROPS_ERR = {
  view: true,
  title: "部品の使い方もチェックされる",
  file: "GameView.vue（もし TypeScript なら）",
  task: "vue-tsc を使うと、template の中のまちがいも見つかるのだ",
  marks: { 2: "型がちがう", 7: "渡し忘れ" },
  code: `
<!-- speaker は string のはず -->
<MessageBox :speaker="123" :chars="typedChars" :done="!isTyping" />
<!-- エラー：number は string に入れられない -->

<!-- done を渡し忘れた -->
<MessageBox :speaker="game.line.speaker" :chars="typedChars" />
<!-- エラー：done がたりない -->
`,
}

const CV_TS_FETCH = {
  view: true,
  title: "外から来たデータを確かめる",
  file: "（例）",
  task: "as は「決めつけ」なのだ。外から来たものは、中身を確かめるのだ",
  marks: { 6: "決めつけ（確かめていない）", 9: "型ガード", 15: "だめなら止める", 18: "ここからは安全" },
  code: `
interface SaveData {
  visited: string[]
}

// あぶない：as で「SaveData だ」と決めつけるだけ（中身は見ていない）
const data = (await res.json()) as SaveData

// よい：中身を確かめてから使う（型ガード）
function isSaveData(v: unknown): v is SaveData {
  return typeof v === 'object' && v !== null &&
    Array.isArray((v as { visited?: unknown }).visited)
}

const json: unknown = await res.json()
if (!isSaveData(json)) {
  throw new Error('セーブデータがこわれています')
}
json.visited  // ここからは SaveData として安全に使える
`,
}

const CV_TS_NULL = {
  view: true,
  title: "null と undefined",
  file: "（例）",
  task: "null かもしれない値は、そのままでは使えないのだ",
  marks: { 1: "見つからないと null", 3: "そのままは使えない", 6: "?. で安全に", 9: "なかったときの値" },
  code: `
const el = document.querySelector('#app')  // Element | null
el.textContent = 'hi'
// エラー TS18047：'el' は null かもしれない

// ?. … null・undefined なら、そこで止まる
el?.classList.add('ready')

// ?? … null・undefined のときだけ、右の値を使う
const name = user.name ?? '名無し'

// noUncheckedIndexedAccess を有効にすると……
const first = lines[0]   // Line | undefined（ないかもしれない）
`,
}

const CV_TSCONFIG = {
  view: true,
  title: "tsconfig.json",
  file: "tsconfig.json（Vite + Vue の例）",
  task: "型チェックの厳しさは、ここで決めるのだ",
  marks: { 6: "きびしいチェックを全部オン", 7: "配列[0] も undefined かも", 8: "チェックだけ（変換は Vite）", 9: "import.meta.env などの型" },
  code: `
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
`,
}

const CV_TS_SCRIPTS = {
  view: true,
  title: "型チェックを止めないしくみ",
  file: "package.json ／ src/env.d.ts",
  task: "Vite はビルドのときに型チェックをしないのだ。だから自分で入れるのだ",
  marks: { 4: "型チェックだけ", 5: "エラーならビルドしない", 10: "打ちまちがいを防ぐ" },
  code: `
// package.json
"scripts": {
  "dev": "vite",
  "typecheck": "vue-tsc --noEmit",
  "build": "vue-tsc --noEmit && vite build"
}

// src/env.d.ts：自分で決めた環境変数にも型を付ける
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}
`,
}

const CV_IAM_POLICY = {
  view: true,
  title: "デプロイ用のポリシー",
  file: "IAM ポリシー（JSON）",
  task: "S3 へのアップロードと、CloudFront のキャッシュ消しだけを許可するのだ",
  marks: { 5: "許可する（Deny もある）", 6: "何をしてよいか", 7: "どれに対して", 16: "必要なものだけ" },
  code: `
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::after-school-site/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::after-school-site"
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::123456789012:distribution/E1EXAMPLE"
    }
  ]
}
`,
}

const CV_SSO = {
  view: true,
  title: "SSO でログインする設定",
  file: "~/.aws/config",
  task: "アクセスキーを作らずに、ブラウザでログインして使うのだ",
  marks: { 4: "借りる権限", 8: "会社のログイン画面", 13: "数時間で切れる鍵をもらう" },
  code: `
[profile dev]
sso_session = my-sso
sso_account_id = 123456789012
sso_role_name = DeveloperAccess
region = ap-northeast-1

[sso-session my-sso]
sso_start_url = https://my-org.awsapps.com/start
sso_region = ap-northeast-1
sso_registration_scopes = sso:account:access

# 使うとき
# $ aws sso login --profile dev   ← ブラウザが開く
# $ aws s3 ls --profile dev       ← 一時的な鍵で動く
`,
}

const CV_TRUST = {
  view: true,
  title: "ロールの信頼ポリシー",
  file: "IAM ロール（信頼ポリシー）",
  task: "「このリポジトリの main ブランチだけに貸す」と決めるのだ",
  marks: { 6: "GitHub を信頼する", 8: "トークンと交換で貸す", 14: "どのリポジトリ・ブランチか" },
  code: `
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
      },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:my-org/after-school:ref:refs/heads/main"
      }
    }
  }]
}
`,
}

const CV_BUCKET_POLICY = {
  view: true,
  title: "S3 のバケットポリシー",
  file: "S3 バケットポリシー（OAC）",
  task: "S3 は非公開のまま、この CloudFront からだけ読ませるのだ",
  marks: { 5: "CloudFront に", 6: "読むことだけ", 10: "この CloudFront だけ" },
  code: `
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "cloudfront.amazonaws.com" },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::after-school-site/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/E1EXAMPLE"
      }
    }
  }]
}
`,
}

const CV_CDK_SITE = {
  view: true,
  title: "公開先をコードで作る",
  file: "AWS CDK（TypeScript）",
  task: "手作業ではなく、コードで作っておくと、何度でも同じものが作れるのだ",
  marks: { 2: "S3 は公開しない", 7: "OAC で CloudFront からだけ", 8: "http は https へ", 12: "SPA のための設定" },
  code: `
const bucket = new s3.Bucket(this, 'Site', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
})

new cloudfront.Distribution(this, 'Cdn', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
  defaultRootObject: 'index.html',
  // /game などを直接開いたときも、index.html を返す（Vue Router のため）
  errorResponses: [
    { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html' },
    { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' },
  ],
})
`,
}

const CV_DEPLOY = {
  view: true,
  title: "自動デプロイ",
  file: ".github/workflows/deploy.yml",
  task: "main に push したら、ビルドして S3 に置いて、キャッシュを消すのだ",
  marks: { 3: "OIDC を使う", 15: "鍵ではなくロールを借りる", 18: "1年キャッシュ", 20: "毎回確認", 21: "CloudFront のキャッシュを消す" },
  code: `
on: { push: { branches: [main] } }
permissions:
  id-token: write   # OIDC のトークンをもらうため
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci && npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-deploy
          aws-region: ap-northeast-1
      # 名前が毎回変わる assets は、長くキャッシュしてよい
      - run: aws s3 sync dist/assets s3://after-school-site/assets --cache-control "max-age=31536000,immutable"
      # index.html などは、毎回確かめさせる
      - run: aws s3 sync dist s3://after-school-site --delete --exclude "assets/*" --cache-control "no-cache"
      - run: aws cloudfront create-invalidation --distribution-id E1EXAMPLE --paths "/index.html"
`,
}

const CV_LAMBDA = {
  view: true,
  title: "Lambda の関数",
  file: "handler.mjs（Node.js）",
  task: "API Gateway から呼ばれて、返事を返すだけの関数なのだ",
  marks: { 2: "呼ばれる入り口", 3: "リクエストの中身", 6: "返事" },
  code: `
// API Gateway から呼ばれる関数
export const handler = async (event) => {
  const name = event.queryStringParameters?.name ?? 'キミ'

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: \`\${name}、おかえりなのだ！\` }),
  }
}
`,
}

const CV_DYNAMO = {
  view: true,
  title: "クラウドにセーブする",
  file: "save-ending.mjs（Lambda）",
  task: "このゲームのセーブを、DynamoDB に置くならこうなるのだ",
  marks: { 5: "使い回す", 9: "ユーザー ID はトークンから", 13: "名前は環境変数で", 14: "保存する中身" },
  code: `
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

// 関数の外で作っておくと、次の呼び出しで使い回せる
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler = async (event) => {
  // だれのデータかは、ログインのトークンから取る（送られてきた値は信じない）
  const userId = event.requestContext.authorizer.jwt.claims.sub
  const { endingId } = JSON.parse(event.body ?? '{}')

  await db.send(new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: { userId, endingId, clearedAt: new Date().toISOString() },
  }))
  return { statusCode: 204 }
}
`,
}

const CV_SG = {
  view: true,
  title: "セキュリティグループ",
  file: "セキュリティグループの設定（例）",
  task: "「どこからの通信を受け入れるか」を、階段のように絞っていくのだ",
  marks: { 2: "入口だけ公開", 5: "前の段からだけ", 8: "DB はアプリからだけ" },
  code: `
ALB 用
  受け入れ：443（HTTPS）     ← 0.0.0.0/0（だれでも）

アプリ用
  受け入れ：3000             ← ALB 用の SG からだけ

DB 用
  受け入れ：5432（PostgreSQL）← アプリ用の SG からだけ

※ 出ていく通信は、ふだんはすべて許可
※ DB に 0.0.0.0/0 は、ぜったいに付けない
`,
}

const CV_JWT = {
  view: true,
  title: "トークン（JWT）の中身",
  file: "ID トークンの中身（例・説明のためにコメント付き）",
  task: "JWT は . で区切られた3つの部分。まん中に、こんな情報が入っているのだ",
  marks: { 2: "だれか", 4: "だれが発行したか", 8: "期限が切れたら使えない", 12: "API に付けて送る" },
  code: `
{
  "sub": "8c1f2a…",            // ユーザーの ID（ずっと変わらない）
  "email": "kimi@example.com",
  "iss": "https://cognito-idp.ap-northeast-1.amazonaws.com/…",
  "aud": "1example23456789",    // どのアプリ向けか
  "token_use": "id",
  "iat": 1760000000,            // 発行した時刻
  "exp": 1760003600             // 期限（この例では1時間後）
}

// ヘッダーに付けて API を呼ぶ
// Authorization: Bearer eyJraWQiOi…
`,
}

export const lessonScenes = {
  lesson_intro: {
    chapter: { no: 'EX', title: 'ずんだもんのVue教室', sub: 'TECH LESSON MODE' },
    place: { name: '物理準備室', time: '16:50' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'top', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'burst', text: 'ようこそなのだ！ ここは*技術説明モード*なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', text: 'いまキミが遊んでいるこのゲームは、*Vue（ビュー）*という道具で作られているのだ。' },
      { speaker: '僕', chara: 'zun_smile', text: '「ビュー？ 名前だけは聞いたことある」' },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'Vue は、ウェブの画面を作るための道具なのだ。今日は*このゲームの中身*を見ながら説明するのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', text: 'わたくしも助手として付き合いますわ。コードは左の端末に、図は右の画面に映しますわね。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'flow', focus: 'data' }, text: 'まずは全体の地図なのだ。セリフは scenario.js というファイルに、*データ*として書いてあるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'flow', focus: 'store' }, text: 'いま何番目のセリフを読んでいるかは、Pinia の*ストア*が覚えていますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'flow', focus: 'view' }, text: 'GameView が、その番号のセリフを読んで画面に出すのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'flow', focus: 'click' }, text: 'キミがクリックすると番号が1つ進んで、また画面が変わる。この*ぐるぐる*が、ノベルゲームの正体なのだ！' },
      { speaker: '僕', chara: 'zun_smile', diagram: 'flow', text: '「光の点が回ってるのが、その流れってことか」' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_SCENE, text: 'ちなみに、いま流れているこの会話も、ただの*データ*として書かれていますのよ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: '授業は7つの編に分かれているのだ。はじめてなら、1番から順番に聞くのがおすすめなのだ！' },
    ],
    choices: MENU,
  },

  // 目次（説明のあとに戻ってくる場所）
  lesson_menu: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'top', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_smile', text: '次は、どれを聞くのだ？ 見終わった授業には印が付いているのだ。' },
    ],
    choices: MENU,
  },

  lesson_menu_vue: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'vue', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_proud', text: '*Vue のしくみ編*なのだ。このゲームの画面が、どう動いているかの話なのだ。' },
    ],
    choices: VUE_MENU,
  },

  lesson_menu_tools: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'tools', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: '四国めたん', chara: 'metan_smug', text: '*Web の道具編*ですわ。作ったものを動かして、みんなに届けるまでのお話ですの。' },
    ],
    choices: TOOLS_MENU,
  },

  // ----- コンポーネント -----
  lesson_component: {
    place: { name: 'LESSON 01 コンポーネント', time: '16:52' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000001',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'Vue の画面は、*部品（コンポーネント）*を組み合わせてできているのだ。プラモデルみたいなものなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'tree', focus: 'MessageBox' }, camera: 'close', text: 'たとえば、いま下に出ている*このメッセージ欄*。これがひとつの部品なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['> ls src/components', 'MessageBox.vue   … メッセージ欄', 'StageLayer.vue   … 背景と立ち絵', 'ChoiceList.vue   … 選択肢', 'NixieMeter.vue   … 右上の観測計'], text: '部品は1つずつ、.vue というファイルになっていますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'tree', focus: 'NixieMeter' }, fx: 'meter', text: '右上の観測計も部品なのだ。タイトル画面でも同じ部品を使い回しているのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['<template>', '  <StageLayer :bg="..." />', '  <NixieMeter :value="..." />', '  <MessageBox :speaker="..." />', '</template>'], text: 'ゲーム画面（GameView.vue）は、こうして部品を並べて作っていますのよ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'tree', focus: 'GameView' }, text: '図にすると、こうなるのだ。親の GameView の下に、子の部品がぶら下がっているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'tree', focus: 'CharaSprite' }, text: '部品の中に、さらに部品を入れることもできるのだ。StageLayer の中には、立ち絵1枚ぶんの CharaSprite が入っているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', playground: CV_MESSAGEBOX, text: '1つの .vue ファイルには、見た目（template）・動き（script）・飾り（style）がまとめて入っているのだ。' },
      { speaker: '僕', chara: 'zun_proud', diagram: 'tree', text: '「部品ごとに分けておけば、直すときも探しやすいってことか」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', fx: 'flash', text: 'そのとおりなのだ！ 部品はコンポーネント、おぼえたのだ？' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- ref・computed -----
  lesson_reactive: {
    place: { name: 'LESSON 02 ref・computed', time: '16:54' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000002',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'Vue のいちばんすごいところは、*値を変えるだけで、画面が勝手に変わる*ことなのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['const typedLength = ref(0)', '', '// 1文字出すたびに', 'typedLength.value++'], text: 'このセリフが1文字ずつ出ているのは、「何文字目まで出したか」という数を、少しずつ増やしているからですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', speed: 'slow', text: 'ref は、*見張られている箱*なのだ。中身が変わると、Vue が気づいて画面を書き直すのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'reactive', focus: 'ref' }, text: '右の図を見るのだ。上の数（ref）が1つ増えるたびに、画面の文字も1つ増えているのだ。' },
      { speaker: '僕', chara: 'zun_proud', text: '「画面を書き直す命令は、自分で書かなくていいの？」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: 'reactive', fx: 'burst', text: 'いらないのだ！ 数を増やすだけで、文字が1つ増えて見えるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', playground: PG_COUNTER, text: 'キミも*やってみる*のだ！ ボタンを押して、それからコードも書きかえてみるのだ。' },
      { speaker: '僕', chara: 'zun_proud', text: '「0 を書きかえただけで、最初の数が変わった」' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['const isTyping = computed(() =>', '  typedLength.value < chars.length', ')'], text: 'computed は、ほかの値から計算して出す値。「まだ文字を出している途中か」は、こうして決めていますの。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: PG_COMPUTED, text: 'computed も、さわってたしかめてごらんなさいな。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', playground: CV_TYPING, text: 'いま読んでいるこのセリフも、*本物のコード*ではこう書いてあるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'reactive', focus: 'computed' }, text: 'typedLength が変わると、isTyping も自動で計算し直されるのだ。図の下の値が、最後まで出すと false に変わるのを見るのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: 'reactive', text: 'ref は「箱」、computed は「箱から計算した答え」。おぼえたのだ？' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- v-if・v-for -----
  lesson_directive: {
    place: { name: 'LESSON 03 v-if・v-for', time: '16:56' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000003',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'template の中では、*v- で始まる特別な書き方*が使えるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['<ChoiceList', '  v-if="choosing"', '  :choices="visibleChoices"', '/>'], text: 'v-if は「条件に合うときだけ出す」。選択肢は、セリフを読み終わったときだけ出てきますわね。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'directive', focus: 'if' }, text: 'choosing が true になった瞬間に選択肢が出て、false になったら消えるのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['<button', '  v-for="choice in choices"', '  :key="choice.text"', '>', '  {{ choice.text }}', '</button>'], text: 'v-for は「くり返して並べる」。選択肢がいくつあっても、この数行で並べられますの。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'directive', focus: 'for' }, text: 'choices の数が増えると、ボタンも勝手に増えるのだ。右の図で、選択肢が1つずつ増えていくのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_LIST, text: '配列に1つ足すだけで、画面の行も増えるのだ。やってみるのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_smile', text: '{{ }} の中に書いたものは、その値が文字として画面に出るのだ。' },
      { speaker: '僕', chara: 'zun_smile', text: '「この目次が8個並んでるのも、v-for なのか」' },
      { speaker: 'ずんだもん', chara: 'zun_normal', playground: CV_CHOICES, text: 'そうなのだ。本物のコードでは、v-if と v-for がこう組み合わさっているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: 'directive', fx: 'flash', text: 'そうなのだ！ 出す・消すは v-if、くり返すは v-for なのだ。' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- props・emit -----
  lesson_props: {
    place: { name: 'LESSON 04 props・emit', time: '16:58' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000004',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'props', text: '部品と部品は、*お手紙*をやりとりして会話するのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['<!-- 親（GameView）が渡す -->', '<MessageBox :speaker="line.speaker" />', '', '// 子（MessageBox）が受け取る', 'defineProps({ speaker: String })'], text: '親から子へ渡すお手紙が props。メッセージ欄は、名前と本文を受け取って表示しているだけですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'props', focus: 'props' }, text: 'だからメッセージ欄は、これがずんだもんのセリフか、めたんのセリフか、自分では知らないのだ。渡されたものを出すだけなのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['// 子（ChoiceList）が知らせる', "emit('choose', choice)", '', '<!-- 親が受け取る -->', '<ChoiceList @choose="game.choose" />'], text: '反対に、子から親へ「選ばれましたわ」と知らせるのが emit ですの。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'props', focus: 'emit' }, text: '青いお手紙が、下から上に戻っていくのだ。選択肢が押されたら、こうやって親に知らせるのだ。' },
      { speaker: '僕', chara: 'metan_smug', diagram: 'props', text: '「下に渡すのが props、上に知らせるのが emit……」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', fx: 'burst', text: '完璧なのだ！ 役目を分けておくと、部品を別の場所でも使い回せるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_PROPS, text: '本物のコードで、お手紙の行き来をたどってみましょう。' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- watch -----
  lesson_watch: {
    place: { name: 'LESSON 05 watch', time: '17:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000005',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'watch', focus: 'watch' }, text: 'watch は、*値が変わったときに、何かをする*ための見張り番なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['watch(', '  () => game.line,', '  (line) => {', '    if (line.fx) playFx(line.fx)', '  },', ')'], text: 'たとえば、セリフが変わるたびに「画面効果の指定があるか」を確かめていますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', diagram: { type: 'watch', focus: 'action' }, fx: 'shake', text: 'こういうふうに、セリフに fx: \'shake\' と書いておくと……揺れるのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: 'watch', text: 'computed は「新しい値を作る」、watch は「変わったときに動く」。似てるけど役目がちがうのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', text: '音楽を切り替えるのも、文字を1つずつ出し始めるのも、この見張り番のお仕事ですのよ。' },
      { speaker: '僕', chara: 'metan_smug', text: '「さっきの揺れも、watch が気づいて動かしたわけか」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: CV_WATCH, text: '右上の観測計の数字がパラパラ回るのも、watch のおかげなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', playground: PG_WATCH, text: '見張り番を、キミも作ってみるのだ。' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- Pinia -----
  lesson_pinia: {
    place: { name: 'LESSON 06 Pinia', time: '17:02' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000006',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'pinia', text: 'ゲーム画面、エンディング、世界線の分岐図。いろんなページが、*同じ進み具合*を知っている必要があるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['> open src/stores/game.js', 'state: () => ({', "  sceneId: 'lunch',", '  lineIndex: 0,', "  path: '',", '})'], text: 'そこで使うのが Pinia。どのページからでも読める、*みんなの共有データ置き場*ですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'pinia', focus: 'store' }, text: 'いまどのシーンの、何番目のセリフか。どの選択肢を選んだか。ぜんぶここに入っているのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_STORE, text: 'ストアの中身を、もう少しくわしく見てみましょう。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['next() {', '  this.lineIndex++', '}'], text: 'キミが画面をクリックすると、この next() が呼ばれて、セリフの番号が1つ進みますの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'flow', focus: 'click' }, text: '番号が進むと、ref と同じで画面が勝手に次のセリフになるのだ。さっきの話とつながったのだ？' },
      { speaker: '僕', chara: 'zun_smile', text: '「じゃあ、エンディングが分岐できるのも……」' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'meter', text: 'path に、選んだ番号が「101」みたいに並んでいくのだ。それでエンディングが決まるのだ！' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- Vue Router -----
  lesson_router: {
    place: { name: 'LESSON 07 Vue Router', time: '17:04' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000007',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'router', text: 'タイトル、ゲーム、エンディング、記録室。ページの切り替えは *Vue Router* の担当なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['> open src/router/index.js', "{ path: '/',        TitleView }", "{ path: '/game',    GameView }", "{ path: '/credits', CreditsView }", "{ path: '/ending/:type', … }"], text: 'URL と、表示するページの対応表ですわ。アドレスが /game なら、ゲーム画面が出ますの。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', playground: CV_ROUTER, diagram: { type: 'router', focus: 'ending' }, text: ':type のところには、エンディングの名前が入るのだ。/ending/true なら TRUE END なのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['<RouterLink to="/credits">', '  CREDITS', '</RouterLink>', '', "router.push('/game')"], text: 'リンクで移るときは RouterLink、コードで移るときは router.push を使いますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: CV_START, diagram: { type: 'router', focus: 'game' }, text: 'タイトルの START を押すと、router.push(\'/game\') でゲーム画面に来るのだ。' },
      { speaker: '僕', chara: 'zun_smile', text: '「ページを読みこみ直さずに切り替わるから、音楽も途切れないのか」' },
    ],
    next: 'lesson_menu_vue',
  },

  // ===================================================================
  // HTML・CSS 編
  // ===================================================================

  lesson_menu_css: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'css', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_smile', text: '*HTML・CSS 編*なのだ！ 画面の見た目は、ぜんぶこの2つで決まっているのだ。' },
    ],
    choices: CSS_MENU,
  },

  lesson_html: {
    place: { name: 'CSS 01 HTML', time: '17:30' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000021',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'HTML は、画面に*何があるか*を書く言葉なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['<p>こんにちは</p>', '', '<p>  … 始まりのタグ', '</p> … 終わりのタグ（/ が付く）'], text: '<p> と </p> みたいに、*タグ*ではさんで書くのだ。p は「段落」の意味なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['<h1>     … 大見出し', '<p>      … 段落', '<ul><li> … 箇条書き', '<button> … ボタン', '<img>    … 画像', '<div>    … ただの箱'], text: 'タグには、それぞれ意味がありますわ。よく使うのはこのあたりですの。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'dom', focus: 'message' }, text: 'タグの中に、またタグを入れられるのだ。これを*入れ子*っていうのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'dom', focus: 'p' }, text: 'メッセージ欄も、箱の中に名前と本文があって、本文の中に1文字ずつの span が入っているのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_HTML_MESSAGE, text: '本物の HTML を見てごらんなさいな。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_HTML, text: 'キミも HTML を書いてみるのだ！' },
      { speaker: '僕', chara: 'zun_smile', text: '「1行足したら、箇条書きが1つ増えた」' },
      { speaker: '四国めたん', chara: 'metan_normal', text: 'class="〇〇" は、タグに付ける*名札*。次の授業で、CSS から名札を使って色を付けますわ。' },
    ],
    next: 'lesson_menu_css',
  },

  lesson_selector: {
    place: { name: 'CSS 02 セレクタ', time: '17:32' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000022',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'CSS は、*どこを・どう見せるか*を書く言葉なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['.zun {', '  color: green;', '}', '', '.zun   … セレクタ（どこに）', 'color  … プロパティ（何を）', 'green  … 値（どうする）'], text: '形はいつも同じ。*セレクタ*で場所を決めて、{ } の中に「プロパティ: 値;」を並べますの。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['p       … <p> ぜんぶ', '.zun    … class="zun" の名札', '#app    … id="app" のもの', '.a.b    … 名札を2つ持つもの', '.a p    … .a の中の <p>'], text: 'セレクタの書き方は、このへんを覚えておけば大丈夫なのだ。. は class、# は id なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_SELECTOR, text: 'めたんのセリフに名札を付けて、色を変えてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_SELECTOR, text: 'メッセージ欄の四隅のかざりは、名札を2つ組み合わせて書き分けていますのよ。' },
      { speaker: '僕', chara: 'metan_smug', text: '「共通のところは .bracket にまとめて、ちがうところだけ .tl とかに書くのか」' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'flash', text: 'そうなのだ！ 同じことを何回も書かないのがコツなのだ。' },
    ],
    next: 'lesson_menu_css',
  },

  lesson_box: {
    place: { name: 'CSS 03 ボックスモデル', time: '17:34' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000023',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'HTML のタグは、ぜんぶ*四角い箱*なのだ。文字も、ボタンも、画像も、箱なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'box', focus: 'content' }, text: '箱のまんなかに、中身（文字など）があるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'box', focus: 'padding' }, text: '中身と枠のあいだのすきまが padding。内側の余白ですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'box', focus: 'border' }, text: 'border は枠線なのだ。太さと線の種類と色を書くのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'box', focus: 'margin' }, text: 'そして、となりの箱とのすきまが margin。外側の余白ですの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_BOX, text: '数字を変えて、どこがふくらむか見てみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_BOX_MESSAGE, text: 'メッセージ欄の箱は、こう書いてありますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: 'box-sizing: border-box を書いておくと、幅の中に padding と枠がふくまれるのだ。計算がらくになるのだ。' },
    ],
    next: 'lesson_menu_css',
  },

  lesson_flex: {
    place: { name: 'CSS 04 flex', time: '17:36' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000024',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '箱は、何もしないと*上から順に縦に*積まれていくのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'flex', focus: 'container' }, text: '親の箱に display: flex と書くと、中の子どもたちが*横に並ぶ*のだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'flex', focus: 'gap' }, text: 'gap はすきま。子どもどうしの間を、まとめてあけられますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'flex', focus: 'axis' }, text: 'flex-direction: column にすると、縦に並ぶのだ。justify-content と align-items で、どこに寄せるか決めるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_FLEX, text: 'タイトル画面のリンクを、並べ直してみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_FLEX_TITLE, text: '本物のタイトル画面は、縦と横の flex を組み合わせていますの。' },
      { speaker: '僕', chara: 'metan_smug', text: '「ロゴと START が画面のまんなかにあるのは、これだったのか」' },
    ],
    next: 'lesson_menu_css',
  },

  lesson_layer: {
    place: { name: 'CSS 05 重ねる', time: '17:38' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000025',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'ノベルゲームの画面は、*何枚も重なって*できているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: 'layers', text: '背景の上に立ち絵、その上にメッセージ欄、さらに上に選択肢やムービーなのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['position: absolute;', 'top: 0;  left: 0;', '', '… ほかの箱を気にせず、', '  好きな場所に置ける'], text: 'position: absolute と書くと、順番に積まれるのをやめて、好きな場所に置けますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'layers', focus: 'axis' }, text: '重なったときにどれが手前か決めるのが z-index なのだ。数字が大きいほど手前なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_LAYER, text: '重なりの順番を、入れかえてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_ZINDEX, text: 'このゲームでは、こんなふうに数字を割りふっていますのよ。' },
      { speaker: '僕', chara: 'metan_smug', text: '「選択肢がメッセージ欄の上に出るのは、4 が 2 より大きいからか」' },
    ],
    next: 'lesson_menu_css',
  },

  lesson_anim: {
    place: { name: 'CSS 06 アニメーション', time: '17:40' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000026',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '最後は、CSS で*動かす*方法なのだ。このゲームの演出は、ほとんど CSS で動いているのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['@keyframes float {', '  0%   { … }', '  50%  { … }', '  100% { … }', '}', '', 'animation: float 2s infinite;'], text: '@keyframes に動きの台本を書いて、animation で「どの台本を、何秒で」と指定しますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_ANIM, text: 'ロゴをふわふわ動かしてみるのだ！ 速さや高さを変えてみるのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_ANIM_TITLE, text: 'タイトル画面の START ボタンを光がなでていくのも、この方法ですの。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'shake', text: '画面が揺れるのも、CSS のアニメーションなのだ！' },
      { speaker: '僕', chara: 'zun_proud', text: '「HTML で中身を書いて、CSS で見た目と動きを付ける」' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', fx: 'leak', speed: 'slow', text: 'それがわかれば、どんな画面だって作れるのだ。' },
    ],
    next: 'lesson_menu_css',
  },

  // ===================================================================
  // Web のしくみ編
  // ===================================================================

  lesson_menu_web: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'web', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '*Web のしくみ編*なのだ。ページが届くしくみや、JavaScript の話なのだ。' },
    ],
    choices: WEB_MENU,
  },

  lesson_http: {
    place: { name: 'WEB 01 URL とサーバー', time: '17:50' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000031',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'URL を開くと、ページが出てくる。そのあいだに何が起きているか、知ってるのだ？' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_URL, text: 'まずは URL の読み方から。URL は*住所*のようなものですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'http', focus: 'request' }, text: 'ブラウザは、その住所のサーバーに「このファイルください」ってお願いするのだ。これが*リクエスト*なのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'http', focus: 'response' }, text: 'サーバーは「どうぞ」とファイルを返します。これが*レスポンス*ですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'http', focus: 'files' }, text: '届いた HTML を読むと、JavaScript や CSS や画像も必要だってわかるのだ。だから、またリクエストするのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', text: 'このやりとりのお約束が HTTP。https の s は、通信に鍵をかけているという意味ですの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_URL, text: 'URL を部品に分けてみるのだ！' },
      { speaker: '僕', chara: 'zun_smile', text: '「パスを変えると、サーバーの中の別の場所をお願いすることになるのか」' },
    ],
    next: 'lesson_menu_web',
  },

  lesson_devtools: {
    place: { name: 'WEB 02 開発者ツール', time: '17:52' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000032',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'ブラウザには、ページの*裏側をのぞく道具*が入っているのだ。パソコンで F12 キーを押すと開くのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'devtools', focus: 'elements' }, text: 'Elements では、画面の HTML と CSS が見られるのだ。CSS をその場で書きかえて、ためすこともできるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'devtools', focus: 'console' }, text: 'Console には、エラーやログが出ますわ。動かないときは、まずここを見ますの。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_CONSOLE, text: 'console.log と書いておけば、いまの値をのぞけますのよ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'devtools', focus: 'network' }, text: 'Network では、さっきのリクエストとレスポンスが、1つずつ全部見られるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'devtools', focus: 'application' }, text: 'Application では、ブラウザにしまってあるデータが見られるのだ。このゲームのセーブデータも、ここにあるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_SAVE, text: '見たエンディングは、こうやってしまってありますわ。' },
      { speaker: '僕', chara: 'metan_normal', text: '「エンディングの記録が消えないのは、ブラウザにしまってあったからか」' },
    ],
    next: 'lesson_menu_web',
  },

  lesson_js: {
    place: { name: 'WEB 03 JavaScript', time: '17:54' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000033',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'JavaScript は、ブラウザの中で動く*プログラムの言葉*なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['const name = \'ずんだもん\'  … 変えない値', 'let mochi = 3           … 変える値', '', 'mochi = mochi + 1     … 4 になる'], text: '値に名前を付けてしまっておくのが*変数*。変えないものは const、変えるものは let ですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['const club = [\'ずんだもん\', \'僕\']', 'club.length   … 2', 'club[0]       … \'ずんだもん\'', '', 'const line = { speaker: \'僕\', text: \'…\' }', 'line.speaker  … \'僕\''], text: '[ ] で並べるのが*配列*、{ } で名前と値を組にするのが*オブジェクト*なのだ。セリフ1行も、オブジェクトなのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['function judge(count) {', '  if (count >= 5) {', '    return \'パーティー\'', '  }', '  return \'まだ\'', '}'], text: 'やることをまとめて名前を付けたのが*関数*。if で、条件によって分けられますの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_JS, text: '変数・配列・関数・if を、ぜんぶさわってみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_ENDING, text: 'エンディングの分かれ方も、オブジェクトと関数で書いてありますわ。' },
      { speaker: '僕', chara: 'metan_normal', text: '「選んだ番号の並びを、対応表で引いているだけなのか」' },
    ],
    next: 'lesson_menu_web',
  },

  lesson_dom: {
    place: { name: 'WEB 04 DOM とイベント', time: '17:56' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000034',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'ブラウザは、HTML を読みこむと、それを*木の形のデータ*にして持っているのだ。これを DOM っていうのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: 'dom', text: 'HTML の入れ子が、そのまま木になるのだ。JavaScript からこの木を書きかえると、画面が変わるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', text: 'そして、クリックやキー入力のような「起きたこと」を*イベント*と言いますわ。イベントを待って、何かをするのがプログラムのお仕事ですの。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_VANILLA, text: 'Vue を使わずに書くと、こうなりますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '要素を探して、イベントを待って、自分で書きかえる……。Vue は、このめんどうなところを代わりにやってくれているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_DOM, text: 'イベントにはいろいろな種類があるのだ。ためしてみるのだ！' },
      { speaker: '僕', chara: 'zun_smile', text: '「@click のほかにも、@mouseenter とか @input とかがあるのか」' },
    ],
    next: 'lesson_menu_web',
  },

  lesson_storage: {
    place: { name: 'WEB 05 localStorage', time: '17:58' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000035',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'ページを閉じると、ref の中身はぜんぶ消えちゃうのだ。でも、セーブデータは残したいのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['localStorage.setItem(\'名前\', \'中身\')  … しまう', 'localStorage.getItem(\'名前\')         … 読み出す', 'localStorage.removeItem(\'名前\')      … 消す'], text: 'そこで使うのが localStorage。ブラウザの中の、小さな*引き出し*ですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: 'しまえるのは文字だけなのだ。だから配列は、JSON.stringify で文字に変えてからしまうのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_SAVE, text: 'このゲームのセーブも、まさにそのとおりですの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_STORAGE, text: 'キミのメモを、ブラウザにしまってみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_normal', text: 'ただし、引き出しはそのブラウザだけのもの。別のスマホや別のブラウザからは見えませんわ。' },
      { speaker: '僕', chara: 'metan_normal', text: '「だからスマホで遊んだ記録は、パソコンには引きつがれないのか」' },
    ],
    next: 'lesson_menu_web',
  },

  // ===================================================================
  // CSS もっと編
  // ===================================================================

  lesson_menu_css2: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'css2', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: '四国めたん', chara: 'metan_smug', text: '*CSS もっと編*ですわ。このゲームの見た目の、ひみつをお教えしますの。' },
    ],
    choices: CSS2_MENU,
  },

  lesson_units: {
    place: { name: 'CSS+ 01 大きさと色', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000041',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '大きさの書き方は、px だけじゃないのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['px   … 画面の点の数（決まった大きさ）', '%    … 親の箱にくらべて何%か', 'vw   … 画面の横幅の何%か', 'vh   … 画面の高さの何%か', 'em   … 文字の大きさの何倍か', 'rem  … いちばん元の文字の大きさの何倍か'], text: 'よく使う単位はこのあたり。% や vw は、画面の大きさに合わせて変わりますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['#ff7b00                … 赤・緑・青を16進数で', 'rgb(255, 123, 0)       … 0〜255 で', 'rgba(255, 123, 0, 0.5) … さいごは濃さ（0〜1）'], text: '色は、赤・緑・青のまぜ方で書くのだ。rgba の a は、すけぐあいなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_UNITS, text: '単位と色を、変えてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_UNITS, text: 'このゲームでは、こう使い分けていますの。min() や clamp() で、小さすぎず大きすぎずにしていますわ。' },
      { speaker: '僕', chara: 'metan_smug', text: '「スマホでもパソコンでもちょうどいいのは、決まった px だけじゃないからか」' },
    ],
    next: 'lesson_menu_css2',
  },

  lesson_pseudo: {
    place: { name: 'CSS+ 02 :hover と ::before', time: '18:02' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000042',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'セレクタに : を付けると、「〜のときだけ」を書けるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: [':hover        … マウスが乗っているとき', ':active       … 押しているとき', ':focus        … 入力中のとき', ':first-child  … 最初の子どものとき'], text: 'これを*疑似クラス*と言いますわ。いちばんよく使うのは :hover ですの。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['::before  … 中身の前に足す', '::after   … 中身のうしろに足す', '', 'content: \'▶ \';  … 足す中身'], text: ':: を2つ付けると、HTML に書いていない飾りを、CSS だけで足せるのだ。これが*疑似要素*なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_PSEUDO, text: 'ボタンに、光るしかけと飾りを付けてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_PSEUDO, text: 'タイトルのロゴがずれて光るのは、::before と ::after で同じ文字を重ねているからですわ。' },
      { speaker: '僕', chara: 'metan_smug', text: '「HTML は1つなのに、文字が3枚重なってたのか」' },
    ],
    next: 'lesson_menu_css2',
  },

  lesson_transition: {
    place: { name: 'CSS+ 03 transition', time: '18:04' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000043',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'CSS が変わるとき、ふつうは*一瞬で*切りかわるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['transition: background 0.2s;', '', 'background … 何を', '0.2s       … 何秒かけて'], text: 'transition を書いておくと、そのあいだを*なめらかに*つないでくれますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: 'animation は自分で動き続けるけど、transition は「何かが変わったとき」だけ動くのだ。:hover と相性ばつぐんなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_TRANSITION, text: 'カードを、ふわっと浮かせてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_TRANSITION, text: '選択肢が出るとき、背景がゆっくり暗くなるのも transition ですの。' },
      { speaker: '僕', chara: 'metan_smug', text: '「クラスを1つ付けるだけで、ゆっくり変わるのか」' },
    ],
    next: 'lesson_menu_css2',
  },

  lesson_effects: {
    place: { name: 'CSS+ 04 色づくり', time: '18:06' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000044',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'このゲームの雰囲気は、CSS の*色づくり*でかなり変わっているのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['linear-gradient(…)  … グラデーション', 'box-shadow          … 箱の影', 'text-shadow         … 文字の影・光', 'filter              … 写真の加工', 'backdrop-filter     … うしろをぼかす'], text: 'よく使うのは、このあたりですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['sepia(0.3)        … セピア色に', 'grayscale(1)      … 白黒に', 'hue-rotate(90deg) … 色相をずらす', 'blur(3px)         … ぼかす', 'brightness(0.8)   … 暗く'], text: 'filter は、写真アプリの加工みたいなものなのだ。いくつも並べて組み合わせられるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_EFFECTS, text: '屋上の写真を、加工してみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_EFFECTS, text: 'シーンごとの色味や、メッセージ欄のすりガラスは、こう作っていますの。' },
      { speaker: '僕', chara: 'metan_smug', text: '「同じ背景の絵でも、filter で夕方っぽくも冷たくもできるのか」' },
    ],
    next: 'lesson_menu_css2',
  },

  lesson_grid: {
    place: { name: 'CSS+ 05 grid', time: '18:08' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000045',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'flex は1列に並べるのが得意。*マス目*に並べたいときは grid なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'grid', focus: 'container' }, text: '親に display: grid と書いて、列の数と幅を決めるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'grid', focus: 'col' }, text: '1fr は「残りを等分したうちの1つ」。repeat(3, 1fr) で、同じ幅の列が3つになりますわ。あふれた子どもは、自動で次の行に行きますの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_GRID, text: '列の数を変えてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_GRID, text: 'この授業の目次のカードも、grid ですのよ。' },
      { speaker: '僕', chara: 'metan_smug', text: '「記録室のギャラリーみたいに並べるなら、grid が楽そうだ」' },
    ],
    next: 'lesson_menu_css2',
  },

  lesson_responsive: {
    place: { name: 'CSS+ 06 スマホ対応', time: '18:10' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000046',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'スマホとパソコンでは、画面の幅がぜんぜんちがうのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'responsive', focus: 'pc' }, text: 'パソコンでは横に2列で並べたいけど……' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'responsive', focus: 'sp' }, text: 'スマホでは、1列にしないとせますぎるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'responsive', focus: 'media' }, text: 'そこで @media。「画面の幅が〇〇px 以下のときだけ、この CSS を使う」と書けますわ。これがレスポンシブですの。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_MEDIA, text: 'この授業の目次も、スマホではカードが2列、授業が1列になりますのよ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_RESPONSIVE, text: '@container を使うと、画面じゃなくて*箱の幅*で変えられるのだ。枠をせまくしてみるのだ！' },
      { speaker: '僕', chara: 'zun_smile', text: '「せまくしたら、ちゃんと縦に並びかわった」' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', fx: 'leak', speed: 'slow', text: 'どんな画面で開いても、ちゃんと遊べる。それも、作る人のやさしさなのだ。' },
    ],
    next: 'lesson_menu_css2',
  },

  // ===================================================================
  // TypeScript 編（夜の部室：仕事で使うレベルの話）
  // ===================================================================

  lesson_menu_ts: {
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000000',
    lessonMenu: 'ts', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: "ずんだもん", chara: 'zun_proud', text: "*TypeScript 編*なのだ。仕事のプロジェクトでは、ほとんどこれなのだ。" },
    ],
    choices: TS_MENU,
  },

  lesson_ts_why: {
    place: { name: 'TS 01 なぜ TypeScript', time: '20:00' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000051',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "このゲームは JavaScript で書いてあるのだ。でも、仕事のプロジェクトでは *TypeScript* がよく使われるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "TypeScript は、JavaScript に*型*を足したもの。「この変数には文字が入る」「このオブジェクトにはこの項目がある」と書いておけますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_TS_BUG, text: "同じまちがいでも、気づくタイミングがぜんぜんちがうのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'tscheck', focus: 'tsc' }, text: "型チェックは、*動かす前*にまちがいを見つけてくれるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'tscheck', focus: 'js' }, text: "そして大事なこと。型は、ブラウザで動くときには*消えて*、ふつうの JavaScript になりますわ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'tscheck', focus: 'browser' }, text: "だから、型チェックに通っても「実行時に来たデータが正しい」保証にはなりません。そこは別に確かめる必要がありますの。" },
      { speaker: "ずんだもん", chara: 'zun_smile', text: "エディタの補完がよく効くのも大きいのだ。項目の名前を覚えていなくても、候補が出てくるのだ。" },
      { speaker: "僕", chara: 'zun_smile', text: "「人が多くて、コードが大きいほど効いてくるわけか」" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ 型エラーが残ったまま出さない", "  （CI で止める）", "✔ any で黙らせない", "✔ 型は実行時には消える", "  → 外から来るデータは確かめる"], text: "仕事での心得なのだ。" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_types: {
    place: { name: 'TS 02 型のきほん', time: '20:02' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000052',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["let title: string = '放課後'", "let count: number = 0", "let done: boolean = false", "let club: string[] = []", "let bg: string | null = null"], text: "まずは基本の型なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_TS_SCENE, text: "オブジェクトの形は、interface か type で名前を付けて書きますわ。このゲームのデータなら、こうですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "| でつなぐと「このうちのどれか」になるのだ。*union 型*っていうのだ。ありえる値を全部書いておけるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_UNION, text: "fx に打ちまちがいがあれば、すぐにエラーになりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "? を付けた項目は「なくてもよい」なのだ。あるかないかわからないから、使うときは確かめる必要があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "interface と type はほとんど同じことができます。どちらを使うかは、チームでそろえるのが一番ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「データの形を先に決めておけば、書く人がちがっても形がそろうのか」" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_func: {
    place: { name: 'TS 03 関数と any', time: '20:04' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000053',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_TS_FUNC, text: "関数には、引数と戻り値に型を付けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "全部に型を書く必要はありませんわ。TypeScript は、かなりの部分を*推論*してくれますの。関数の引数や、外に見せる部分に書けば十分ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "<T> は*ジェネリクス*なのだ。「中身の型は、使うときに決める」っていう書き方なのだ。配列や Promise でいつも使われているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_ANY, text: "そして、いちばん大事な注意。any は使わないこと。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "any にすると、そこから先は型チェックが止まるのだ。型エラーを消したいからって any にするのは、警報器の電池を抜くようなものなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "as で「この型だ」と決めつけるのも同じですわ。わからないものは unknown で受けて、確かめてから使いますの。" },
      { speaker: "僕", chara: 'metan_normal', text: "「エラーを消すんじゃなくて、エラーの原因を直すのか」" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_vue: {
    place: { name: 'TS 04 Vue と TypeScript', time: '20:06' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000054',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "Vue でも TypeScript が使えるのだ。<script setup lang=\"ts\"> と書くだけなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_TS_VUE, text: "props と emit は、型の書き方で定義できますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "ref や computed は、中身から型を推論してくれるのだ。最初が null のときは ref<Scene | null>(null) みたいに書くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_PROPS_ERR, text: "部品を使う側のまちがいも、見つけてくれますのよ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "ただし、.vue ファイルの template までチェックするには、tsc じゃなくて *vue-tsc* を使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "Pinia のストアも、state の初期値から型が付きますわ。決まった文字しか入らない値は、型を書いておくと安心ですの。" },
      { speaker: "僕", chara: 'metan_normal', text: "「props を渡し忘れても、動かす前に教えてくれるのか」" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_data: {
    place: { name: 'TS 05 外から来るデータ', time: '20:08' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000055',
    lines: [
      { speaker: "四国めたん", chara: 'metan_normal', text: "TypeScript の型が守れるのは、*自分のコードの中*だけですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "サーバーから来たデータ、localStorage の中身、URL のパラメータ……。外から来るものは、実行してみるまで何が入っているかわからないのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_FETCH, text: "as で決めつけず、中身を確かめてから使いますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "確かめる関数を毎回書くのは大変なので、仕事では *zod* みたいなライブラリで「形」を書いて、まとめて確かめることが多いのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_TS_NULL, text: "もう1つの落とし穴が、null と undefined ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "strict にしておけば、「null かもしれない」を見のがさないのだ。?. と ?? で、短く安全に書けるのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「本番でよく見る『undefined を読めません』みたいなエラーが、だいぶ減りそうだ」" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_config: {
    place: { name: 'TS 06 tsconfig と運用', time: '20:10' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000056',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_TSCONFIG, text: "型チェックのきびしさは、tsconfig.json で決めるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "新しく始めるなら、strict: true が基本。あとからきびしくするのは、とても大変ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "それから、意外な落とし穴があるのだ。*Vite はビルドのときに型チェックをしない*のだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_SCRIPTS, text: "Vite は型を消して変換するだけ。型エラーがあっても、ビルドは通ってしまいますの。だから自分でチェックを入れますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "プルリクエストのたびに、CI で npm run typecheck を動かしておくのだ。型エラーがあったら、マージできないようにするのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "型がないライブラリには @types/〇〇 を入れます。// @ts-ignore でエラーを消すのは、最後の最後の手段ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「ビルドが通ったから大丈夫、とは限らないのか」" },
    ],
    next: 'lesson_menu_ts',
  },

  // ===================================================================
  // AWS 編（夜の部室：仕事で使うレベルの話）
  // ===================================================================

  lesson_menu_aws: {
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000000',
    lessonMenu: 'aws', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: "四国めたん", chara: 'metan_smug', text: "*AWS 編*ですわ。仕事で知っておいてほしい、主なサービスと認証のお話ですの。" },
    ],
    choices: AWS_MENU,
  },

  lesson_aws_overview: {
    place: { name: 'AWS 01 全体像', time: '20:20' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000061',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "AWS は、Amazon が貸し出している*クラウド*なのだ。サーバーもデータベースも、使った分だけお金を払って借りられるのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'region', focus: 'region' }, text: "AWS は世界中に*リージョン*を持っているのだ。日本なら東京（ap-northeast-1）と大阪（ap-northeast-3）なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'region', focus: 'az' }, text: "リージョンの中には、はなれた場所にあるデータセンターのまとまり、*AZ（アベイラビリティゾーン）*がいくつもありますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'region', focus: 'app' }, text: "大事なシステムは、2つ以上の AZ に分けて置くのだ。1つの AZ が止まっても、ほかで動き続けられるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'responsibility', text: "そして*責任共有モデル*。AWS が守るのは建物や機械まで。設定のまちがいで情報がもれたら、それは使う側の責任ですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'responsibility', focus: 'you' }, text: "線の上が使う側の仕事なのだ。EC2 なら OS の更新も使う側。Lambda なら OS は AWS の仕事になるのだ。サービスによって、線の高さが変わるのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 基本は使った分だけ払う", "✔ 止め忘れ・消し忘れに注意", "✔ 最初に Budgets で予算の通知", "✔ 本番と開発でアカウントを分ける"], text: "お金のこともこわいのだ。止め忘れたサーバーは、だれも使っていなくても課金され続けるのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「借りるのは簡単だけど、設定の責任はこっちにあるのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_authbasics: {
    place: { name: 'AWS 02 認証のきほん', time: '20:21' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000069',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "IAM や Cognito の話に入る前に、*認証*そのものを整理しておくのだ。ここがわかると、AWS の話がぐっと楽になるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'authnz', text: "まず、よく似た2つの言葉。*認証*と*認可*ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'authnz', focus: 'authn' }, text: "*認証*は「あなたはだれ？」を確かめることなのだ。会社の入口で、社員証を見せるのと同じなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'authnz', focus: 'authz' }, text: "*認可*は「その人は何をしてよいか」を決めること。社員でも、入れるフロアは人によってちがいますわね。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'authnz', focus: 'room' }, text: "順番は、いつも認証が先なのだ。だれかわからないと、何を許すかも決められないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "英語では Authentication と Authorization。略して AuthN・AuthZ と書くこともありますわ。エラーの 401 は認証の失敗、403 は認可の失敗ですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["① 知っているもの", "   パスワード・暗証番号", "② 持っているもの", "   スマホのアプリ・セキュリティキー", "③ 本人そのもの", "   指紋・顔", "", "MFA … 2種類以上を組み合わせる"], text: "本人かどうかを確かめる方法は、3種類あるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "パスワードだけだと、もれたら終わり。スマホのアプリの6桁の数字のような「持っているもの」を足すのが *MFA* ですわ。AWS では必ず設定しますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'ticket', focus: 'login' }, text: "それから、ログインするたびにパスワードを送るのはあぶないし、めんどうなのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'ticket', focus: 'badge' }, text: "だから、一度ログインしたら*入館証*をもらうのだ。これが*トークン*（やセッション）なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'ticket', focus: 'api' }, text: "あとは、入館証を見せるだけで通れますわ。入館証には*期限*があって、切れたらもう一度もらい直しますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "入館証を盗まれたら、期限が切れるまで、なりすまされてしまうのだ！ だから期限は短めにするのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'authtwo', text: "そしてもう1つ大事なこと。AWS の話には、*2種類の認証*が出てきますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'authtwo', focus: 'aws' }, text: "1つは、*AWS を操作する側*。開発者や GitHub Actions、AWS の上で動くプログラムが、AWS の機能を使うための認証なのだ。これは IAM の担当なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'authtwo', focus: 'app' }, text: "もう1つは、*アプリを使う側*。このゲームのプレイヤーのような、お客さんのログインですわ。こちらは Cognito などの担当ですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "このふたつをまぜて考えると、わけがわからなくなるのだ。「いま、だれが、何にログインする話か」をいつも意識するのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'keylife', text: "AWS を操作するための鍵にも、寿命のちがうものがありますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'keylife', focus: 'temp' }, text: "期限のない鍵は、もれたら消すまで使われ放題なのだ。数時間で切れる鍵なら、被害は短くてすむのだ。だから、なるべく一時的な鍵を使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["認証 AuthN  … だれかを確かめる", "認可 AuthZ  … 何をしてよいか決める", "MFA        … 2種類以上で確かめる", "トークン   … ログイン後の入館証", "IdP        … 本人確認をする係", "SSO        … 1回のログインで色々使う", "OAuth 2.0  … 権限を貸すしくみ", "OIDC       … OAuth にログインを足したもの"], text: "最後に、よく出てくる言葉をまとめておきますわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「だれか確かめて、入館証をわたして、入館証で何をしてよいか決める……。AWS も Cognito も、同じ形なのか」" },
      { speaker: "ずんだもん", chara: 'zun_smile', text: "そのとおりなのだ！ この形がわかっていれば、このあとの IAM と Cognito の話がすっと入るのだ。" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_iam: {
    place: { name: 'AWS 03 IAM', time: '20:22' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000062',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "AWS で一番大事なのが *IAM（アイアム）*なのだ。「だれが・何をしてよいか」を決めるしくみなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["ルートユーザー", "  アカウントを作ったメールアドレス", "  なんでもできる", "", "✔ MFA（2段階認証）を必ず設定", "✔ ふだんは使わない", "✔ アクセスキーを作らない"], text: "アカウントを作ったときの*ルートユーザー*は、請求も解約も、なんでもできてしまう特別な存在ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'iam', focus: 'user' }, text: "ふだん使う人には、別のユーザーを用意するのだ。会社では、あとで話す SSO でログインすることが多いのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'iam', focus: 'group' }, text: "ひとりずつ権限を付けると、管理しきれなくなるのだ。グループにまとめて付けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'iam', focus: 'role' }, text: "*ロール*は、一時的に借りる権限。EC2 や Lambda のようなサービスや、GitHub Actions のような外のしくみが、必要なときだけ借りますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'iam', focus: 'policy' }, text: "権限の中身は、*ポリシー*という JSON に書くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_IAM_POLICY, text: "たとえば、デプロイに必要なことだけを許可すると、こうなりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: 'policyeval', text: "*最小権限*が大原則なのだ。「とりあえず AdministratorAccess」は、事故のもとなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'policyeval', focus: 'deny' }, text: "AWS は、リクエストのたびにこの順番で判定しますわ。まず、拒否（Deny）に当たるものがあれば、ほかに何が書いてあっても拒否。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'policyeval', focus: 'allow' }, text: "次に、許可（Allow）に当たるものがあれば許可なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'policyeval', focus: 'implicit' }, text: "そして、どちらにも当たらなければ*拒否*。書いていないことは、できないのが基本ですの。" },
      { speaker: "僕", chara: 'zun_proud', text: "「できることを最初から絞っておけば、まちがえても被害が小さくてすむのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_creds: {
    place: { name: 'AWS 04 認証情報', time: '20:24' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000063',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "プログラムやコマンドから AWS を使うには、*認証情報（鍵）*が必要なのだ。ここでの事故が、とても多いのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["アクセスキー（長く使える鍵）", "  AKIA… で始まる ID と、秘密のキー", "", "✔ GitHub に push しない", "✔ コードや .env に書かない", "✔ できれば作らない"], text: "IAM ユーザーのアクセスキーは、期限のない合鍵ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'keylife', focus: 'key' }, fx: "shake", text: "公開リポジトリに鍵を push すると、数分で見つけられて、勝手にサーバーを立てられることもあるのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_SSO, text: "だから人が使うときは、IAM Identity Center（SSO）でログインして、*一時的な鍵*をもらいますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'sso', focus: 's1' }, text: "流れを図にすると、こうなるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'sso', focus: 's2' }, text: "ブラウザで会社のアカウントにログインして、MFA を通します。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'sso', focus: 's3' }, text: "すると、数時間で切れる鍵が手元に届くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'sso', focus: 's4' }, text: "その鍵で、開発用や本番用のアカウントを操作しますの。切れたら、またログインするだけですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'oidc', focus: 'gha' }, text: "CI からデプロイするときも、鍵を GitHub にしまわなくていいのだ。*OIDC* を使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'oidc', focus: 'role' }, text: "GitHub が発行するトークンを AWS が確かめて、ロールを貸してくれますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'oidc', focus: 'creds' }, text: "もらえるのは、1時間ほどで切れる鍵なのだ。もれても、すぐに使えなくなるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TRUST, text: "どのリポジトリの、どのブランチに貸すかは、ロールの信頼ポリシーで決めますの。ここをゆるくすると、他人のリポジトリからも借りられてしまいますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'secrets', text: "アプリが使うパスワードや API キーは、*Secrets Manager* や *Parameter Store* にしまって、動くときに読み出すのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'secrets', focus: 'read' }, text: "コードには、パスワードそのものを書きません。Lambda は、自分のロールの権限で Secrets Manager から読み出しますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'secrets', focus: 'connect' }, text: "受け取ったパスワードで、データベースにつなぐのだ。パスワードを変えるときも、コードはそのままでいいのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["鍵がもれたら", "1. すぐに無効化して削除", "2. CloudTrail で使われた操作を確認", "3. 作られたリソースを消す", "4. 請求を確認・上の人に報告"], text: "もし鍵がもれてしまったら、かくさずに、すぐに動くこと。" },
      { speaker: "僕", chara: 'metan_normal', text: "「長く使える鍵を、そもそも持たないのが一番なのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_static: {
    place: { name: 'AWS 05 このゲームを公開', time: '20:26' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000064',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "このゲームを AWS で公開するなら、どうするか考えてみるのだ。ビルドした dist は、ただのファイルなのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'staticsite', focus: 's3' }, text: "ファイルは *S3* に置くのだ。S3 は、ファイルをしまっておく、ものすごく丈夫な倉庫なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'staticsite', focus: 'cf' }, text: "その前に *CloudFront* を置きます。世界中の近い場所から配ってくれる CDN で、HTTPS もここで受けますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'staticsite', focus: 'r53' }, text: "*ACM* で無料の SSL 証明書をもらって、*Route 53* で自分のドメインを CloudFront に向けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_BUCKET_POLICY, text: "S3 は*公開しない*のが今の作法。OAC を使って、CloudFront からだけ読めるようにしますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "ここで落とし穴なのだ！ このゲームは Vue Router で /game みたいな URL を使っているのだ。でも S3 には game というファイルはないのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'spa', focus: 'r2' }, text: "ブラウザが /game をお願いすると、CloudFront はそのまま S3 に取りに行くのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'spa', focus: 'r3' }, text: "でも S3 に game というファイルはないので、403 が返ってきますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'spa', focus: 'r4' }, text: "そこで CloudFront が、エラーのかわりに index.html を返すのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'spa', focus: 'router' }, text: "index.html が読みこまれたら、Vue Router が URL の /game を見て、ゲーム画面を出しますの。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_CDK_SITE, text: "この設定は、コードで書くとこうなりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_DEPLOY, text: "デプロイは GitHub Actions で自動にするのだ。OIDC でロールを借りるから、鍵はいらないのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'cache', focus: 'cf' }, text: "キャッシュの考え方も大事なのだ。CloudFront は、近くの場所にファイルのコピーを持っていて、そこから配るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'cache', focus: 'assets' }, text: "assets のファイルは、中身が変わると名前も変わります。だから1年キャッシュしても困りませんの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'cache', focus: 'index' }, text: "でも index.html は名前が変わらないのだ。キャッシュされると、古いゲームが出てしまうのだ。だから毎回確かめさせるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["✔ CloudFront 用の証明書は", "  us-east-1（バージニア）で作る", "✔ assets は長くキャッシュ", "  （名前が毎回変わるから）", "✔ index.html はキャッシュさせない", "✔ S3 のパブリックアクセスはブロック"], text: "覚えておくと得をするポイントですわ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「ファイルを置くだけかと思ったら、キャッシュと URL の設定が大事なのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_compute: {
    place: { name: 'AWS 06 サーバーとサーバーレス', time: '20:28' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000065',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'compute', focus: 'axis' }, text: "プログラムを動かす場所の借り方は、大きく3つあるのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'compute', focus: 'ec2' }, text: "*EC2* は、仮想のサーバーを1台まるごと借りるのだ。なんでもできるけど、OS の更新やセキュリティ対策も自分の仕事なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'compute', focus: 'ecs' }, text: "*ECS / Fargate* は、Docker のコンテナを動かすサービス。サーバーの管理は AWS にまかせて、アプリだけ用意しますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'compute', focus: 'lambda' }, text: "*Lambda* は、関数を1つ置いておくだけなのだ。呼ばれたときだけ動いて、動いた時間だけお金がかかるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'serverless', playground: CV_LAMBDA, text: "Lambda の関数は、こんなに短く書けますのよ。前に *API Gateway* を置けば、URL から呼べる API になりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'serverless', focus: 'lambda' }, text: "つなげると、こんな形になるのだ。API Gateway が URL の入口、Lambda が処理、DynamoDB が保存なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'serverless', focus: 'logs' }, text: "Lambda の console.log は、自動で CloudWatch Logs に残りますわ。動かないときは、まずここを見ますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "でも Lambda には向き不向きがあるのだ。1回で動けるのは最大15分なのだ。しばらく呼ばれないと、最初の1回が少し遅くなるのだ（コールドスタート）。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["迷ったら", "  API・ちょっとした処理 → Lambda", "  ずっと動く Web アプリ → ECS Fargate", "  特別な事情がある → EC2", "", "✔ 止め忘れた EC2 は課金され続ける"], text: "迷ったときの目安ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「自由がほしいか、管理を楽にしたいかで選ぶのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_data: {
    place: { name: 'AWS 07 データベースとネットワーク', time: '20:30' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000066',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["RDS / Aurora", "  いつもの SQL データベース", "  （MySQL・PostgreSQL）", "DynamoDB", "  キーで引く NoSQL・サーバーレス", "S3", "  ファイル・画像・ログ"], text: "データをしまう場所も、使い分けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_DYNAMO, text: "このゲームのセーブを、DynamoDB に置くならこうなりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "ユーザー ID を、送られてきた値じゃなくて*ログインのトークン*から取っているところが大事なのだ。送られてきた値は、いくらでもいじれるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'dynamokey', focus: 'pk' }, text: "DynamoDB は「どう読むか」を先に決めて、キーを設計しますの。あとから自由に検索するのは苦手ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'dynamokey', focus: 'sk' }, text: "パーティションキーで「だれのデータか」、ソートキーで「その中のどれか」を決めるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'dynamokey', focus: 'query' }, text: "「この人のエンディング一覧」はすぐ読めます。でも「全員の TRUE END を探す」のは、このキーでは苦手。読み方が決まってから設計しますのよ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'vpc', focus: 'vpc' }, text: "サーバーやデータベースは、*VPC* という自分専用のネットワークの中に置くのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'vpc', focus: 'public' }, text: "インターネットとつながるのは、入口の*パブリックサブネット*だけ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'vpc', focus: 'db' }, text: "データベースは、外から入れない*プライベートサブネット*に置くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_SG, text: "どこからの通信を受け入れるかは、*セキュリティグループ*で絞りますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: 'sgchain', text: "図にすると、入口から奥へ、通れる相手を1段ずつ絞っているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'sgchain', focus: 'blocked' }, text: "インターネットから、データベースに直接はとどきません。もし入口がやられても、奥までは入りにくくなりますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ DB をインターネットに出さない", "✔ 自動バックアップと削除保護", "✔ NAT Gateway は意外と高い", "✔ SG は「どこから」を絞る"], text: "仕事で気をつけたいところなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「入口から奥へ、段階的に通れる相手を絞っていくのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_auth: {
    place: { name: 'AWS 08 アプリのログイン', time: '20:32' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000067',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "IAM は「AWS を操作する人」のためのしくみなのだ。アプリを使う*お客さん*のログインは、別のしくみなのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'authflow', focus: 'cognito' }, text: "*Cognito* を使うと、ユーザーの登録やログイン、パスワードの管理をまかせられるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'authflow', focus: 'jwt' }, text: "ログインすると、*JWT* というトークンがもらえますわ。署名のついた JSON で、期限がありますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'loginflow', focus: 'l1' }, text: "流れを順番に見るのだ。まず、ID とパスワード（と MFA）を Cognito に送るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'loginflow', focus: 'l2' }, text: "合っていれば、Cognito がトークンを3つくれますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["ID トークン", "  だれか（名前・メール）", "アクセストークン", "  API を呼ぶための入館証", "リフレッシュトークン", "  入館証をもらい直す券（長め）"], text: "3つのトークンは、役目がちがうのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'loginflow', focus: 'l3' }, text: "API を呼ぶときは、*アクセストークン*をヘッダーに付けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'loginflow', focus: 'l5' }, text: "アクセストークンは1時間ほどで切れます。切れたら、リフレッシュトークンで新しいものをもらいますの。パスワードを入れ直さなくていいのは、このおかげですわ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'jwt', playground: CV_JWT, text: "JWT は、ピリオドで区切られた3つの部分でできていますの。まん中の中身は、だいたいこんな感じですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'jwt', focus: 'payload' }, fx: "shake", text: "JWT の中身は、*だれでも読める*のだ！ 暗号化じゃなくて署名だから、いじられていないことはわかるけど、秘密の情報は入れちゃだめなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'authflow', focus: 'api' }, text: "API を呼ぶときは、ヘッダーにトークンを付けます。API Gateway がトークンを確かめて、合格したものだけを Lambda に通しますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'verify', focus: 'c1' }, text: "API Gateway は、トークンをこの順番で確かめるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'verify', focus: 'c2' }, text: "期限が切れていないか。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'verify', focus: 'c3' }, text: "自分たちの Cognito が、このアプリ向けに出したものか。ちがうところで出したトークンは通さないのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'verify', focus: 'ok' }, text: "全部通ったら Lambda へ。だめなら 401 で追い返しますの。Lambda に届いた時点で、だれからのリクエストかは確かになっていますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "「Google でログイン」みたいなしくみは、*OAuth 2.0* と *OpenID Connect* なのだ。Cognito は、これにも対応しているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["✔ パスワードを自分で保存しない", "✔ トークンの期限と更新を考える", "✔ localStorage のトークンは", "  XSS で盗まれうる", "✔ 権限のチェックは", "  必ずサーバー側でも"], text: "仕事で気をつけたいところですわ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「画面でボタンを隠しても、API を直接呼ばれたら意味がないのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_ops: {
    place: { name: 'AWS 09 監視・監査・コスト', time: '20:34' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000068',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "作って終わりじゃないのだ。動かし続けるための道具も大事なのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'ops', focus: 'cw' }, text: "*CloudWatch* は、ログと数値を集めて、おかしいときに知らせてくれるのだ。Lambda のログも、ここに出るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'alarm', focus: 'alarm' }, text: "たとえば「5分で5回以上エラーが出たら知らせる」というアラームを作っておきますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'alarm', focus: 'notify' }, text: "人がずっと画面を見張らなくても、Slack やメールで教えてくれるのだ。だれが見るかも決めておくのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'ops', focus: 'ct' }, text: "*CloudTrail* は、AWS への操作を記録します。「だれが・いつ・何をしたか」がわかるので、事故のときの手がかりになりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'ops', focus: 'budgets' }, text: "*Budgets* で予算を決めて、こえそうになったらメールで知らせてもらうのだ。アカウントを作ったら、最初にやるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'ops', focus: 'iac' }, text: "そして仕事では、コンソールでぽちぽち作りません。設定を*コード*で書いて管理しますの。これを IaC と言いますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'iacflow', focus: 'ci' }, text: "コードを書いて、プルリクエストでレビューして、CI が自動で AWS に反映するのだ。アプリのコードと同じ流れなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'iacflow', focus: 'manual' }, text: "コンソールでの手作業は、記録が残らず、同じものを作り直せません。本番では特に、手で変えないのが鉄則ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "コードにしておけば、レビューもできるし、同じものを何度でも作れるのだ。さっきの CDK のコードも IaC なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ ログの保存期間を決める", "  （ずっと残すとお金がかかる）", "✔ タグで「だれの・何の」を管理", "✔ 本番を手作業で変えない", "✔ アラームの通知先を決めておく"], text: "運用で気をつけたいところですわ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', text: "AWS のサービスは200以上あるけど、まずはここまでを押さえれば、仕事の会話についていけるのだ！" },
      { speaker: "僕", chara: 'zun_smile', text: "「全部覚えなくても、地図があれば迷わずにすみそうだ」" },
    ],
    next: 'lesson_menu_aws',
  },

  // ===================================================================
  // Web の道具編
  // ===================================================================

  // ----- HTML・CSS・JavaScript -----
  lesson_web: {
    place: { name: 'TOOLS 01 HTML・CSS・JS', time: '17:10' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000011',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'まずは基本なのだ。Web ページは、*3つの材料*でできているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'web', focus: 'html' }, text: 'HTML は*骨組み*なのだ。「ここに見出し」「ここにボタン」って、何があるかを書くのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'web', focus: 'css' }, text: 'CSS は*見た目*。色や大きさ、どこに置くか。メッセージ欄のオレンジの枠も CSS ですわ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_CSS, text: 'メッセージ欄の CSS を、のぞいてみますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'web', focus: 'js' }, text: 'JavaScript は*動き*なのだ。クリックしたらセリフが進む、みたいなことを書くのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'web', focus: 'browser' }, text: 'ブラウザは、この3つを読みこんで画面を作りますの。どんなに大きなゲームでも、最後はこの3つになりますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_WEB, text: '3つの材料を、さわってみるのだ。見た目を変えるのは CSS の役目なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['<template>  … HTML（骨組み）', '<script>    … JavaScript（動き）', '<style>     … CSS（見た目）'], text: 'Vue の .vue ファイルにあった3つの区切りも、ちょうどこの3つに分かれていますのよ。' },
      { speaker: '僕', chara: 'metan_normal', text: '「じゃあ Vue は、この3つを書きやすくしてくれる道具なのか」' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'flash', text: 'そういうことなのだ！' },
    ],
    next: 'lesson_menu_tools',
  },

  // ----- npm -----
  lesson_npm: {
    place: { name: 'TOOLS 02 npm', time: '17:12' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000012',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'Vue も Pinia も、ボクたちが作ったものじゃないのだ。世界中の人が作った*道具*を借りているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'npm', focus: 'registry' }, text: 'その道具がしまってある、巨大な*倉庫*が npm なのだ。道具のことは「パッケージ」って呼ぶのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_PKG, text: 'どの道具を借りるかは、package.json というファイルに*リスト*にして書いてありますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'npm', focus: 'pkg' }, text: '数字はバージョンなのだ。「vue の 3.5.43 くらいを使う」って意味なのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'npm', focus: 'install' }, text: 'npm install と打つと、リストを読んで、倉庫から道具をまとめて取ってきてくれますの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'npm', focus: 'nm' }, text: '取ってきた道具は、node_modules というフォルダに入るのだ。中身はものすごく多いけど、自分では触らなくていいのだ。' },
      { speaker: '僕', chara: 'zun_smile', text: '「リストさえあれば、誰のパソコンでも同じ道具がそろうのか」' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['"scripts": {', '  "dev": "vite",', '  "build": "vite build",', '  "preview": "vite preview"', '}'], text: 'package.json には、よく使う命令のあだ名も書けますわ。npm run dev は「vite を動かして」という意味ですの。' },
    ],
    next: 'lesson_menu_tools',
  },

  // ----- import -----
  lesson_modules: {
    place: { name: 'TOOLS 03 import', time: '17:14' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000013',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'このゲームは、何十個ものファイルに分かれているのだ。ファイルどうしは *import* でつながっているのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_INDEX, diagram: { type: 'modules', focus: 'index' }, text: 'いちばん最初にブラウザが開くのは index.html。中身はほとんど空っぽで、main.js を読みこむ一行があるだけですわ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_MAIN, text: 'main.js が、Vue や router を import して、アプリを組み立てていますの。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'modules', focus: 'import' }, text: 'import は「あのファイルの、あれを借りてくる」っていう意味なのだ。借りた先でも、また import しているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'modules', focus: 'views' }, text: 'こうやってたどっていくと、最後はタイトル画面やゲーム画面にたどり着くのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_EXPORT, text: '反対に、ファイルの中身を外に貸すときは export と書きますわ。lessons.js も export で、この授業のセリフを貸していますの。' },
      { speaker: '僕', chara: 'metan_normal', text: '「export で貸して、import で借りる」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', fx: 'burst', text: 'それでファイルを分けても、ちゃんと1つのゲームとして動くのだ！' },
    ],
    next: 'lesson_menu_tools',
  },

  // ----- Vite の開発サーバー -----
  lesson_dev: {
    place: { name: 'TOOLS 04 Vite', time: '17:16' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000014',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '作っているあいだに使う、いちばん大事な道具が *Vite（ヴィート）*なのだ。フランス語で「速い」って意味なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['> npm run dev', '', '  VITE v8.3.1  ready in 312 ms', '', '  ➜  Local: http://localhost:5173/'], text: 'npm run dev と打つと、自分のパソコンの中に、小さな*お試し用のサーバー*が立ち上がりますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'dev', focus: 'cmd' }, text: '表示された URL をブラウザで開くと、作りかけのゲームが遊べるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'dev', focus: 'edit' }, text: 'すごいのはここからなのだ。scenario.js のセリフを書きかえて保存すると……' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', fx: 'flash', diagram: { type: 'dev', focus: 'browser' }, text: 'ページを読みこみ直さなくても、*一瞬で*画面に映るのだ！ これを HMR って呼ぶのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_HMR, text: 'このゲームでは、ストアを書きかえたときも差し替わるように、こんな一文を足してありますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'dev', focus: 'vite' }, text: '.vue ファイルは、本当はブラウザには読めないのだ。Vite が、その場で読める形に変えて渡してくれているのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_VITECONFIG, text: 'その仕事を Vite に頼んでいるのが、vite.config.js ですわ。' },
      { speaker: '僕', chara: 'zun_normal', text: '「書いて、保存して、すぐ見る。だから試しながら作れるのか」' },
    ],
    next: 'lesson_menu_tools',
  },

  // ----- ビルド -----
  lesson_build: {
    place: { name: 'TOOLS 05 build', time: '17:18' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000015',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'お試し用のサーバーは、自分のパソコンの中だけのものなのだ。みんなに配るには、*ビルド*が必要なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'build', focus: 'src' }, text: 'src の中のファイルは、人が読みやすいように分けて書いた形。ブラウザにとっては、ばらばらで読みにくいのですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'build', focus: 'build' }, text: 'npm run build と打つと、Vite が全部をまとめて、ブラウザが読める HTML・CSS・JavaScript に変えてくれるのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['> npm run build', 'dist/index.html             0.9 kB', 'dist/assets/index-xxxx.css   83 kB', 'dist/assets/index-xxxx.js   275 kB', '✓ built in 0.33s'], text: 'できあがりは dist というフォルダに入りますの。何十個もあったファイルが、ほんの数個になりますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', playground: CV_DIST_INDEX, text: 'できあがった index.html を見ると、読みこむファイルが変わっているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'build', focus: 'dist' }, text: 'xxxx のところは、中身が変わるたびに変わる名前なのだ。古いファイルが残って、昔のゲームが出ちゃうのを防いでいるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'build', focus: 'public' }, text: 'public の中の画像や動画は、変換せずにそのまま dist にコピーされますの。技術解説のページも、ここに置いてありますわ。' },
      { speaker: '僕', chara: 'metan_normal', text: '「作るときは src、配るときは dist」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', fx: 'flash', text: 'そうなのだ！ npm run preview で、できあがった dist をお試しで開くこともできるのだ。' },
    ],
    next: 'lesson_menu_tools',
  },

  // ----- 公開 -----
  lesson_deploy: {
    place: { name: 'TOOLS 06 deploy', time: '17:20' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000016',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '最後は、作ったゲームを*みんなに遊んでもらう*方法なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'deploy', focus: 'server' }, text: 'dist フォルダを、インターネットにつながった*サーバー*に置きますの。これを公開（デプロイ）と言いますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'deploy', focus: 'user' }, text: 'そうすると、スマホでもパソコンでも、URL を開くだけで遊べるのだ。インストールはいらないのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', text: 'GitHub Pages のように、こういう*静的なファイル*を無料で置ける場所もありますのよ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_BASE, text: 'ただし、URL の途中のフォルダに置くときは、vite.config.js にその場所（base）を書いておく必要がありますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'deploy', text: 'それを忘れると、画像やプログラムが見つからなくて、まっ白な画面になっちゃうのだ。' },
      { speaker: '僕', chara: 'zun_normal', text: '「書いて、試して、まとめて、置く。それで誰かのスマホに届くのか」' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', fx: 'leak', speed: 'slow', text: 'キミの作ったものが、知らない誰かの放課後に届くのだ。……すごいことなのだ。' },
    ],
    next: 'lesson_menu_tools',
  },

  // ----- おしまい -----
  lesson_end: {
    finish: true, // 最後のセリフのあと、タイトルへ戻る
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.409431',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_proud', text: '今日の授業はここまでなのだ！' },
      { speaker: '四国めたん', chara: 'metan_normal', text: 'もっと詳しく知りたいなら、public/docs/tech.html に、くわしい解説をまとめてありますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', text: 'それから、src/data/scenario.js を開いてみるのだ。セリフを1行書きかえるだけで、ゲームの話が変わるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', fx: 'leak', speed: 'slow', text: 'キミも、*自分の世界線*を作ってみるのだ。' },
    ],
  },
}

<script setup>
// コードエディタ（技術説明モード）
// セリフに playground: { title, task, code, check } を書くと、文字を出し終わったあとに開く。
//   title : エディタの見出し
//   task  : やってみること・見てほしいところ（例：「0 を 100 に変えてみるのだ」）
//   code  : 最初に入っているコード。.vue ファイルと同じ形（<template> / <script setup> / <style>）
//   check : 右の結果の要素を受け取って、できたら true を返す関数（なくてもよい）
// コードを「見せて説明する」ときは、次の3つを使う
//   view  : true なら見るだけ（書きかえられない・右の結果も出さない）
//   file  : ファイル名のタブ（例：'src/components/MessageBox.vue'）
//   marks : 光らせる行と、その横に出す書きこみ { 3: '← ここが props' }（行番号は 1 から）
// 書きかえると、少し待ってから右の「結果」が作り直される。
// コードを動かすには、テンプレートを読める Vue（コンパイラ入り）が必要なので、エディタを開いたときにだけ読みこむ
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useSound } from '../composables/useSound'

const props = defineProps({
  playground: Object,
})
const emit = defineEmits(['done'])
const { play } = useSound()

const code = ref(props.playground.code.trim())
const error = ref('')
const cleared = ref(false)

// ===== シンタックスハイライト：色を付けた HTML を作って、透明な textarea の後ろに敷く =====
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const TOKEN = new RegExp(
  [
    /(<!--[\s\S]*?-->|\/\/[^\n]*)/.source, // 1: コメント
    /('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`[^`]*`)/.source, // 2: 文字列
    /(\{\{|\}\})/.source, // 3: {{ }}
    /(<\/?[A-Za-z][\w-]*|\/?>)/.source, // 4: タグ
    /((?:v-[\w-]+|[@:][\w.-]+|class|style)(?==))/.source, // 5: 属性
    /\b(const|let|function|return|if|else|true|false|ref|computed|watch|reactive|import|export|default|from|this|async|await)\b/.source, // 6: キーワード
    /\b(\d+(?:\.\d+)?)\b/.source, // 7: 数字
  ].join('|'),
  'g',
)
const CLASS = [null, 'c', 's', 'm', 't', 'a', 'k', 'n']
const highlighted = computed(() => {
  let html = ''
  let last = 0
  for (const m of code.value.matchAll(TOKEN)) {
    html += escape(code.value.slice(last, m.index))
    const group = m.findIndex((g, i) => i > 0 && g !== undefined)
    html += `<span class="${CLASS[group]}">${escape(m[0])}</span>`
    last = m.index + m[0].length
  }
  return html + escape(code.value.slice(last)) + '\n' // 最後の改行のぶんだけ、高さを textarea と合わせる
})
const lineCount = computed(() => code.value.split('\n').length)

const view = Boolean(props.playground.view) // 見るだけのモード
const marks = Object.entries(props.playground.marks ?? {}).map(([n, note]) => ({ n: Number(n), note }))
// 見るだけのときは、コードの行数に合わせてエディタの高さを決める（長いときはスクロール）
const editorStyle = computed(() => (view ? { height: `calc(${Math.min(lineCount.value, 22) * 1.6}em + 22px)` } : null))

// textarea と色付きの層（と、行の書きこみ）を、いっしょにスクロールさせる
const pre = ref(null)
const gutter = ref(null)
const marksLayer = ref(null)
function onScroll(e) {
  pre.value.scrollTop = gutter.value.scrollTop = e.target.scrollTop
  pre.value.scrollLeft = e.target.scrollLeft
  if (marksLayer.value) marksLayer.value.scrollTop = e.target.scrollTop
}

// Tab キーで、フォーカスが外に逃げずに空白2つが入るようにする
function onKeydown(e) {
  if (e.key !== 'Tab') return
  e.preventDefault()
  const el = e.target
  const { selectionStart: a, selectionEnd: b } = el
  code.value = code.value.slice(0, a) + '  ' + code.value.slice(b)
  requestAnimationFrame(() => (el.selectionStart = el.selectionEnd = a + 2))
}

// ===== 結果：書いたコードを、本物の Vue で動かす =====
// .vue と同じ形のコードを、<template> / <script setup> / <style> に分ける
function parse(src) {
  const template = src.match(/<template>([\s\S]*)<\/template>/)?.[1] ?? ''
  const script = src.match(/<script setup>([\s\S]*?)<\/script>/)?.[1] ?? ''
  const style = src.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? ''
  return { template, script, style }
}

// <script setup> の中身を、変数を返す関数に作り変える（const / let / function で作った名前を、template から使えるようにする）
function makeSetup(script, vue) {
  const names = [...script.matchAll(/^\s*(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1])
  // eslint-disable-next-line no-new-func
  const fn = new Function('ref', 'computed', 'watch', 'reactive', `${script}\nreturn { ${names.join(', ')} }`)
  return () => fn(vue.ref, vue.computed, vue.watch, vue.reactive)
}

const host = ref(null) // 結果を出す場所。Shadow DOM の中に出して、ゲームの CSS と混ざらないようにする
let shadow = null
let app = null
let fullVue = null

async function run() {
  fullVue ??= await import('vue/dist/vue.esm-browser.prod.js')
  const { template, script, style } = parse(code.value)
  let setup, render
  try {
    // 先に読めるかどうかだけ確かめる。まちがっていたら、前の結果は残したままエラーだけ出す
    setup = makeSetup(script, fullVue)
    render = fullVue.compile(template, {
      onError: (err) => {
        throw err
      },
    })
  } catch (err) {
    showError(err)
    return
  }
  app?.unmount()
  app = null
  shadow.innerHTML = ''
  error.value = ''
  try {
    const styleEl = document.createElement('style')
    styleEl.textContent = `:host { all: initial; display: block; font-family: 'Zen Kaku Gothic New', sans-serif; color: #222; } ${style}`
    const mountEl = document.createElement('div')
    shadow.append(styleEl, mountEl)
    app = fullVue.createApp({ setup, render })
    app.config.errorHandler = showError // ボタンを押したときなど、動いている途中のエラー
    app.mount(mountEl)
    // できたかどうかの確認は、画面が書きかわるのを待ってから
    await fullVue.nextTick()
    if (props.playground.check?.(mountEl) && !cleared.value) {
      cleared.value = true
      play('select')
    }
  } catch (err) {
    showError(err)
  }
}
function showError(err) {
  error.value = String(err?.message ?? err)
}

// 打っている途中で毎回作り直さないように、手が止まってから動かす
let runTimer = null
watch(code, () => {
  if (view) return
  clearTimeout(runTimer)
  runTimer = setTimeout(run, 350)
})
// 結果の中でボタンを押したとき・文字を打ったとき・マウスを乗せたときも、もう一度「できたか」を確かめる
function recheck() {
  setTimeout(() => {
    const mountEl = shadow?.querySelector('div')
    if (mountEl && !cleared.value && props.playground.check?.(mountEl)) {
      cleared.value = true
      play('select')
    }
  }, 50)
}

onMounted(() => {
  if (view) return // 見るだけのときは、コードを動かさない
  shadow = host.value.attachShadow({ mode: 'open' })
  run()
})
onUnmounted(() => {
  clearTimeout(runTimer)
  app?.unmount()
})

function reset() {
  code.value = props.playground.code.trim()
}
</script>

<template>
  <!-- @click.stop：エディタの中のクリックで、セリフが進まないようにする -->
  <div class="playground" @click.stop>
    <div class="panel" :class="{ view }">
      <header>
        <span class="tag">{{ view ? 'CODE' : 'PLAYGROUND' }}</span>
        <span class="title">{{ playground.title }}</span>
        <span v-if="playground.file" class="file">{{ playground.file }}</span>
        <span v-if="cleared" class="clear">CLEAR!</span>
      </header>
      <p v-if="playground.task" class="task">▶ {{ playground.task }}</p>

      <div class="body" :class="{ single: view }">
        <!-- エディタ：行番号 ＋ 色付きの層 ＋ 透明な textarea（打った文字は textarea に入り、見えているのは色付きの層） -->
        <div class="editor" :style="editorStyle">
          <div ref="gutter" class="gutter" aria-hidden="true">
            <span v-for="n in lineCount" :key="n">{{ n }}</span>
          </div>
          <div class="code-area">
            <!-- 光らせる行と書きこみ（コードといっしょにスクロールする） -->
            <div v-if="marks.length" ref="marksLayer" class="layer marks" aria-hidden="true">
              <div v-for="m in marks" :key="m.n" class="mark" :style="{ top: `calc(${(m.n - 1) * 1.6}em + 10px)` }">
                <span class="note">{{ m.note }}</span>
              </div>
              <div class="marks-end" :style="{ top: `calc(${lineCount * 1.6}em + 20px)` }"></div>
            </div>
            <pre ref="pre" class="layer" aria-hidden="true" v-html="highlighted"></pre>
            <textarea
              v-model="code"
              class="layer input"
              spellcheck="false"
              autocapitalize="off"
              autocomplete="off"
              :readonly="view"
              aria-label="コードエディタ"
              @scroll="onScroll"
              @keydown="onKeydown"
            ></textarea>
          </div>
        </div>

        <!-- 結果 -->
        <div v-if="!view" class="result">
          <span class="result-label">結果</span>
          <div ref="host" class="preview" @click="recheck" @input="recheck" @mouseover="recheck"></div>
          <p v-if="error" class="error"><b>⚠ コードのどこかが、まちがっているのだ</b>{{ error }}</p>
        </div>
      </div>

      <footer>
        <button v-if="!view" class="sub-btn" @click="reset">もとに戻す</button>
        <button class="next-btn" @click="emit('done')">つづける ▶</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.playground {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.55);
  cursor: default;
  animation: fade-in 0.3s ease-out both;
}
@keyframes fade-in { from { opacity: 0; } }
.panel {
  width: min(960px, 100%);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  box-sizing: border-box;
  background: linear-gradient(rgba(8, 18, 26, 0.97), rgba(5, 10, 18, 0.97));
  border: 1px solid rgba(110, 255, 240, 0.6);
  box-shadow: 0 0 40px rgba(80, 255, 230, 0.25);
  animation: rise 0.35s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes rise { from { opacity: 0; transform: translateY(16px) scale(0.98); } }
header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.tag {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: #8ffff2;
  opacity: 0.8;
}
.title {
  font-weight: 700;
  color: #fff;
}
.clear {
  margin-left: auto;
  padding: 2px 10px;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.2em;
  color: #1a0d00;
  background: #ffb066;
  box-shadow: 0 0 16px rgba(255, 150, 50, 0.8);
  animation: clear-in 0.5s cubic-bezier(0.2, 1.6, 0.4, 1) both;
}
@keyframes clear-in { from { transform: scale(2); opacity: 0; } }
.task {
  margin: 0;
  color: #ffd166;
  font-size: 0.95rem;
}
.body {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 12px;
  min-height: 0;
}

/* ===== エディタ ===== */
.editor {
  display: flex;
  height: 300px;
  border: 1px solid rgba(110, 255, 240, 0.3);
  background: #0a141c;
  font-family: 'Share Tech Mono', 'Zen Kaku Gothic New', monospace;
  font-size: 14px;
  line-height: 1.6;
}
.gutter {
  display: flex;
  flex-direction: column;
  padding: 10px 8px;
  overflow: hidden;
  text-align: right;
  color: rgba(143, 255, 242, 0.35);
  border-right: 1px solid rgba(110, 255, 240, 0.15);
  user-select: none;
}
.code-area {
  position: relative;
  flex: 1;
  min-width: 0;
}
/* 色付きの層と textarea は、文字の大きさ・余白・折り返しをぴったりそろえる */
.layer {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 10px 12px;
  box-sizing: border-box;
  font: inherit;
  line-height: inherit;
  white-space: pre;
  overflow: auto;
  tab-size: 2;
}
pre.layer {
  color: #d8e6ee;
  overflow: hidden;
  pointer-events: none;
}
.input {
  color: transparent;
  caret-color: #ffd166;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
}
.input::selection { background: rgba(255, 209, 102, 0.3); }
/* 色分け（v-html で入れた span なので :deep で届かせる） */
:deep(.c) { color: #6b8794; font-style: italic; }
:deep(.s) { color: #a5e57a; }
:deep(.m) { color: #ff9a3c; font-weight: 700; }
:deep(.t) { color: #6fc3ff; }
:deep(.a) { color: #ffd166; }
:deep(.k) { color: #ff8ad8; }
:deep(.n) { color: #ffb066; }

/* ===== 見るだけのモード ===== */
.body.single { grid-template-columns: minmax(0, 1fr); }
/* 見るだけのときは、textarea にさわれないようにする（スマホでタップしたときに画面が拡大されないように）。22行までは全部見える */
.view .input { pointer-events: none; }
/* 見るだけのときは、たくさんの行が入るように文字を少し小さく */
.view .editor { font-size: 13px; }
/* ファイル名のタブ（見出しの横） */
.file {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 1px 8px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  color: #8ffff2;
  background: rgba(10, 40, 50, 0.9);
  border: 1px solid rgba(110, 255, 240, 0.3);
}
/* 光らせる行：うしろを明るくして、右はしに書きこみを出す */
.marks {
  overflow: hidden;
  pointer-events: none;
  padding: 0;
}
.mark {
  position: absolute;
  left: 0;
  right: 0;
  height: 1.6em;
  background: linear-gradient(90deg, rgba(255, 176, 102, 0.22), rgba(255, 176, 102, 0.06));
  border-left: 3px solid #ffb066;
  animation: mark-in 0.5s ease-out both;
}
.mark:nth-child(2) { animation-delay: 0.15s; }
.mark:nth-child(3) { animation-delay: 0.3s; }
.mark:nth-child(n + 4) { animation-delay: 0.45s; }
@keyframes mark-in { from { opacity: 0; transform: translateX(-12px); } }
.note {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 8px;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.6;
  white-space: nowrap;
  color: #1a0d00;
  background: #ffb066;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(255, 150, 50, 0.6);
}
.marks-end { position: absolute; height: 1px; width: 1px; } /* スクロールできる長さを、コードとそろえるため */

/* ===== 結果 ===== */
.result {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 300px;
  border: 1px solid rgba(110, 255, 240, 0.3);
  background: #f6f4ef;
}
.result-label {
  padding: 4px 10px;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: #8ffff2;
  background: #0a141c;
}
.preview {
  flex: 1;
  padding: 14px;
  overflow: auto;
}
.error b {
  display: block;
  margin-bottom: 2px;
  font-family: 'Zen Kaku Gothic New', sans-serif;
}
.error {
  margin: 0;
  padding: 8px 10px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #fff;
  background: #b3243f;
}

footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
footer button {
  padding: 8px 20px;
  font-size: 0.9rem;
}
.sub-btn {
  border-color: rgba(255, 255, 255, 0.3);
}

/* スマホ：エディタと結果を縦に並べる */
@media (max-width: 720px) {
  .body { grid-template-columns: minmax(0, 1fr); }
  .editor { height: 220px; font-size: 16px; } /* 16px 未満だと、iPhone で入力したときに画面が拡大されてしまう */
  .result { height: 150px; }
}
</style>

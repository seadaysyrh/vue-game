<script setup>
// 選択肢。選ばれたものを親に知らせる部品
//   variant 'message' … 過去へのメッセージを選ぶ画面（スマホの送信画面風。選ぶと「送信中」になってから決定）
//   variant 'speech'  … セリフを選ぶ画面
//   timer があると、制限時間つき。時間切れになると default 番の選択肢を自動で選ぶ
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  choices: Array,
  variant: { type: String, default: 'speech' },
  remaining: Number, // メッセージの残り送信回数（表示用）
  timer: Object, // { seconds: 10, default: 1 }（制限時間と、時間切れのときに選ばれる番号）
})
const emit = defineEmits(['choose', 'pick'])

const sending = ref(null) // 送信中の選択肢の番号
const composed = ref('')  // 入力欄に打ちこまれていく文字
const sent = ref(false)   // 送信ボタンが押されたか
let waitTimer = null // 決定までの待ち時間用（制限時間の props.timer とは別物）

function select(choice, index) {
  if (sending.value !== null) return // 送信中は二重に押せない
  emit('pick') // 押した瞬間の効果音用
  if (props.variant !== 'message') {
    // 選んだものに照準が絞りこみ、ほかが散ってから決定する
    sending.value = index
    waitTimer = setTimeout(() => emit('choose', choice), 550)
    return
  }
  sending.value = index
  // 入力欄に1文字ずつ打ちこんで、最後に送信ボタンを押す
  let i = 0
  waitTimer = setInterval(() => {
    i++
    composed.value = choice.text.slice(0, i)
    if (i >= choice.text.length) {
      clearInterval(waitTimer)
      sent.value = true
      waitTimer = setTimeout(() => emit('choose', choice), 700)
    }
  }, 45)
}

// ===== 制限時間 =====
const left = ref(props.timer?.seconds ?? 0) // 残り秒数
const ratio = computed(() => (props.timer ? left.value / props.timer.seconds : 0))
let countdown = null

// ほかのタブを見ている間は止める（戻ってきたら勝手に決まっていた、とならないように）
function tick() {
  if (document.hidden || sending.value !== null) return
  left.value = Math.max(0, left.value - 0.1)
  if (left.value === 0) {
    clearInterval(countdown)
    const i = props.timer.default
    select(props.choices[i], i) // 時間切れ：迷ったまま、選べなかったことになる
  }
}
onMounted(() => {
  if (props.timer) countdown = setInterval(tick, 100)
})

onUnmounted(() => {
  clearInterval(waitTimer)
  clearTimeout(waitTimer)
  clearInterval(countdown)
})
</script>

<template>
  <!-- @click.stop：ここでのクリックが、親（GameView）の「クリックで進む」まで伝わらないようにする -->
  <div class="choices" :class="variant" @click.stop>
    <!-- ===== スマホの送信画面 ===== -->
    <div v-if="variant === 'message'" class="phone">
      <header>
        <span>〈REWRITER〉</span>
        <span>残り送信 {{ remaining }}</span>
      </header>
      <p class="to">TO: <b>昨日の自分</b></p>
      <button
        v-for="(choice, i) in choices"
        :key="choice.text"
        class="draft"
        :class="{ sending: sending === i, dim: sending !== null && sending !== i, secret: choice.secret }"
        :style="{ animationDelay: `${0.15 + i * 0.12}s` }"
        @click="select(choice, i)"
      >
        <span class="draft-text">{{ choice.text }}</span>
        <span class="status">{{ sending === i ? 'SELECTED' : 'SEND ▶' }}</span>
      </button>
      <!-- 入力欄：選んだ文章が打ちこまれていき、送信ボタンが光る -->
      <div v-if="sending !== null" class="composer" :class="{ sent }">
        <span class="field">{{ composed }}<i class="caret"></i></span>
        <span class="send-btn">{{ sent ? '送信済' : '送信' }}</span>
      </div>
    </div>

    <!-- ===== セリフの選択 ===== -->
    <template v-else>
      <p class="label">CHOOSE YOUR WORDS</p>
      <!-- 制限時間のバー：だんだん短くなり、残りわずかでオレンジから赤になる -->
      <div v-if="timer" class="timer" :class="{ urgent: left <= 3 }">
        <span class="bar" :style="{ transform: `scaleX(${ratio})` }"></span>
        <span class="sec">{{ left.toFixed(1) }}</span>
      </div>
      <button
        v-for="(choice, i) in choices"
        :key="choice.text"
        class="speech-option"
        :class="{ locked: sending === i, dismissed: sending !== null && sending !== i }"
        :style="{ animationDelay: `${0.1 + i * 0.12}s` }"
        @click="select(choice, i)"
      >
        {{ choice.text }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.choices {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 0 16px 150px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.7));
  cursor: default;
  animation: fade-in 0.4s ease-out both;
}
@keyframes fade-in { from { opacity: 0; } }
@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== スマホ ===== */
.phone {
  width: min(440px, 100%);
  padding: 18px;
  border: 1px solid rgba(120, 255, 220, 0.35);
  border-radius: 18px;
  background: linear-gradient(rgba(6, 14, 18, 0.94), rgba(4, 8, 12, 0.94));
  box-shadow: 0 0 40px rgba(80, 255, 210, 0.18), inset 0 0 30px rgba(80, 255, 210, 0.06);
  display: grid;
  gap: 12px;
  animation: rise 0.45s ease-out both;
}
.phone header {
  display: flex;
  justify-content: space-between;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #6dffb0;
}
.to {
  margin: 0;
  font-size: 0.85rem;
  color: #9aa2b4;
}
.to b { color: #e6e8ee; }
.draft {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  text-align: left;
  border: 1px solid rgba(120, 255, 220, 0.3);
  border-radius: 12px;
  background: rgba(20, 40, 44, 0.6);
  animation: rise 0.4s ease-out both;
  transition: opacity 0.3s, transform 0.3s, border-color 0.2s;
}
.draft:hover { border-color: #6dffb0; background: rgba(40, 80, 70, 0.6); box-shadow: 0 0 18px rgba(80, 255, 210, 0.3); }
.status {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: #6dffb0;
}
.draft.sending { border-color: #6dffb0; transform: scale(1.02); }
.draft.sending .status { animation: blink 0.3s steps(2) infinite; }
.draft.dim { opacity: 0.25; }
/* 隠された選択肢：むらさきに光る */
.draft.secret {
  border-color: rgba(200, 160, 255, 0.7);
  background: rgba(60, 30, 90, 0.6);
  box-shadow: 0 0 20px rgba(180, 130, 255, 0.4);
}
.draft.secret .status { color: #d4b8ff; }
.composer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  animation: rise 0.3s ease-out both;
}
.field {
  font-size: 0.85rem;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: -2px;
  background: #6dffb0;
  animation: blink 0.5s steps(2) infinite;
}
.send-btn {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #04110c;
  background: #3d8f6e;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
}
.composer.sent .send-btn {
  background: #6dffb0;
  box-shadow: 0 0 20px #6dffb0;
  transform: scale(1.12);
}
@keyframes blink { 50% { opacity: 0.2; } }

/* ===== 制限時間 ===== */
.timer {
  position: relative;
  width: min(560px, 100%);
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
}
.timer .bar {
  position: absolute;
  inset: 0;
  background: #ff9a3c;
  box-shadow: 0 0 10px #ff7b00;
  transform-origin: left;
  transition: transform 0.1s linear, background 0.3s;
}
.timer .sec {
  position: absolute;
  right: 0;
  top: 8px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  color: #ffb066;
  font-variant-numeric: tabular-nums;
}
.timer.urgent .bar {
  background: #ff3b3b;
  box-shadow: 0 0 14px #ff3b3b;
}
.timer.urgent .sec {
  color: #ff6b6b;
}

/* ===== セリフ ===== */
.label {
  margin: 0;
  font-family: 'Share Tech Mono', monospace;
  color: #ff9a3c;
  letter-spacing: 0.35em;
  animation: rise 0.4s ease-out both;
}
.speech-option {
  width: min(560px, 100%);
  padding: 16px 28px;
  font-size: 1.1rem;
  border: none;
  border-top: 1px solid rgba(255, 154, 60, 0.5);
  border-bottom: 1px solid rgba(255, 154, 60, 0.5);
  background: linear-gradient(90deg, transparent, rgba(10, 12, 25, 0.9), transparent);
  animation: rise 0.4s ease-out both;
}
.speech-option {
  position: relative;
}
/* 照準：選んだ選択肢の左右から、カッコが締まってくる */
.speech-option::before,
.speech-option::after {
  position: absolute;
  top: 50%;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.6rem;
  color: #ffb066;
  text-shadow: 0 0 10px #ff7b00;
  opacity: 0;
  transition: transform 0.35s cubic-bezier(0.2, 1.4, 0.4, 1), opacity 0.2s;
}
.speech-option::before { content: '['; left: 0; transform: translate(-40px, -50%); }
.speech-option::after { content: ']'; right: 0; transform: translate(40px, -50%); }
.speech-option:hover::before,
.speech-option.locked::before { opacity: 1; transform: translate(-6px, -50%); }
.speech-option:hover::after,
.speech-option.locked::after { opacity: 1; transform: translate(6px, -50%); }
.speech-option.locked {
  background: linear-gradient(90deg, transparent, rgba(255, 123, 0, 0.45), transparent);
  letter-spacing: 0.16em;
  transition: letter-spacing 0.4s, background 0.2s;
}
/* 選ばれなかった選択肢は、横に流れて消える */
.speech-option.dismissed {
  animation: dismiss 0.4s cubic-bezier(0.6, 0, 0.8, 0.4) forwards;
}
@keyframes dismiss {
  to { opacity: 0; transform: translateX(-30%) scaleY(0.2); filter: blur(6px); }
}
.speech-option:hover {
  background: linear-gradient(90deg, transparent, rgba(255, 123, 0, 0.3), transparent);
  box-shadow: none;
  letter-spacing: 0.12em;
}
@media (prefers-reduced-motion: reduce) {
  .choices, .phone, .draft, .label, .speech-option { animation: none; }
}
</style>

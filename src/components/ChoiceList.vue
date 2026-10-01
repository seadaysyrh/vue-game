<script setup>
// 選択肢。選ばれたものを親に知らせる部品
//   variant 'message' … 過去へのメッセージを選ぶ画面（スマホの送信画面風。選ぶと「送信中」になってから決定）
//   variant 'speech'  … セリフを選ぶ画面
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  choices: Array,
  variant: { type: String, default: 'speech' },
  remaining: Number, // メッセージの残り送信回数（表示用）
})
const emit = defineEmits(['choose', 'pick'])

const sending = ref(null) // 送信中の選択肢の番号
const composed = ref('')  // 入力欄に打ちこまれていく文字
const sent = ref(false)   // 送信ボタンが押されたか
let timer = null

function select(choice, index) {
  if (sending.value !== null) return // 送信中は二重に押せない
  emit('pick') // 押した瞬間の効果音用
  if (props.variant !== 'message') {
    emit('choose', choice)
    return
  }
  sending.value = index
  // 入力欄に1文字ずつ打ちこんで、最後に送信ボタンを押す
  let i = 0
  timer = setInterval(() => {
    i++
    composed.value = choice.text.slice(0, i)
    if (i >= choice.text.length) {
      clearInterval(timer)
      sent.value = true
      timer = setTimeout(() => emit('choose', choice), 700)
    }
  }, 45)
}

onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(timer)
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
        :class="{ sending: sending === i, dim: sending !== null && sending !== i }"
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
      <button
        v-for="(choice, i) in choices"
        :key="choice.text"
        class="speech-option"
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
.speech-option:hover {
  background: linear-gradient(90deg, transparent, rgba(255, 123, 0, 0.3), transparent);
  box-shadow: none;
  letter-spacing: 0.12em;
}
@media (prefers-reduced-motion: reduce) {
  .choices, .phone, .draft, .label, .speech-option { animation: none; }
}
</style>

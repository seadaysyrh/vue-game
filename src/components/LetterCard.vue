<script setup>
// 手紙：便せんが舞い降りてきて、手書きの文字が1文字ずつ、インクがにじむように書かれていく
// 書き終わると、最後に差出人の名前が入る。クリックで次へ（書いている途中なら、全部書き終える）
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  letter: Object, // { from: 'ずんだもん', lines: ['キミへ。', '……'] }
})
const emit = defineEmits(['close'])

// 全部の行を1つの文字列にして、何文字目まで書いたかで表示する
const full = computed(() => props.letter.lines.join('\n'))
const written = ref(0)
const done = computed(() => written.value >= full.value.length)
let timer = null

// 1行ずつ配列にして、各文字に「何番目の文字か」を付けておく（書かれた文字だけ表示するため）
const rows = computed(() => {
  let n = 0
  return props.letter.lines.map((line) => [...line].map((ch) => ({ ch, n: n++ })).concat([{ ch: '', n: n++ }]))
})

function write() {
  written.value++
  if (done.value) return
  const ch = full.value[written.value - 1]
  // 句読点や改行では、ペンを止めて少し考える
  const pause = '。、…\n'.includes(ch) ? 260 : 70
  timer = setTimeout(write, pause)
}

onMounted(() => {
  timer = setTimeout(write, 1200) // 便せんが降りてくるのを待ってから書き始める
})
onUnmounted(() => clearTimeout(timer))

function onClick() {
  if (!done.value) {
    clearTimeout(timer)
    written.value = full.value.length
    return
  }
  emit('close')
}
</script>

<template>
  <div class="letter-wrap" @click.stop="onClick">
    <div class="paper">
      <p v-for="(row, r) in rows" :key="r" class="row">
        <span v-for="c in row" :key="c.n" class="ch" :class="{ on: c.n < written }">{{ c.ch }}</span>
      </p>
      <p class="from" :class="{ on: done }">{{ letter.from }} より</p>
    </div>
    <span v-if="done" class="hint">CLICK ▶</span>
  </div>
</template>

<style scoped>
.letter-wrap {
  position: absolute;
  inset: 0;
  z-index: 6;
  display: grid;
  place-items: center;
  padding: 16px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.75));
  cursor: pointer;
  animation: fade 0.8s ease-out both;
}
@keyframes fade { from { opacity: 0; } }
/* 便せん：少し傾いて、ふわりと舞い降りる */
.paper {
  width: min(520px, 100%);
  padding: 34px 40px 30px;
  box-sizing: border-box;
  color: #3b2f2a;
  font-family: 'Zen Kurenaido', 'Zen Kaku Gothic New', sans-serif;
  font-size: 1.2rem;
  line-height: 2.2;
  background:
    repeating-linear-gradient(transparent 0 calc(2.2em - 1px), rgba(120, 160, 200, 0.35) calc(2.2em - 1px) 2.2em),
    linear-gradient(#fdf8ec, #f6efdd);
  background-position: 0 30px, 0 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.05);
  transform: rotate(-2deg);
  animation: drop 1.2s cubic-bezier(0.2, 0.8, 0.3, 1) both;
}
@keyframes drop {
  from { transform: translateY(-40vh) rotate(-14deg); opacity: 0; }
  60% { transform: translateY(8px) rotate(1deg); opacity: 1; }
  to { transform: rotate(-2deg); }
}
.row {
  margin: 0;
  min-height: 2.2em;
}
/* 1文字ずつ：書かれた瞬間は、にじんで少し濃く、すぐに落ち着く */
.ch {
  opacity: 0;
}
.ch.on {
  opacity: 1;
  animation: ink 0.5s ease-out both;
}
@keyframes ink {
  from { opacity: 0; filter: blur(3px); color: #120c08; }
  to { opacity: 1; filter: blur(0); }
}
.from {
  margin: 10px 0 0;
  text-align: right;
  font-size: 1.3rem;
  opacity: 0;
  transition: opacity 1.2s;
}
.from.on { opacity: 1; }
.hint {
  position: absolute;
  bottom: 6%;
  right: 6%;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #aaa;
}
@media (prefers-reduced-motion: reduce) {
  .letter-wrap, .paper, .ch.on { animation: none; }
}
</style>

<script setup>
// ホログラムの端末：空中に半透明の画面が浮かび、ログが1行ずつ打ちこまれていく
// セリフに terminal: ['> rewriter --boot', 'COIL ...... OK', …] を書くと出る。
// 画面は 3D で少し斜めに傾けて、「空中に投影されている」感じにしている
import { ref, onMounted, onUnmounted } from 'vue'
import { useSound } from '../../composables/useSound'

const props = defineProps({
  lines: Array,
})
const { play } = useSound()

const shown = ref([]) // 表示中の行（最後の行は打ちこみ途中）
let timer = null

// 1文字ずつ打ちこむ。行の終わりでは少し待つ（コマンドの実行を待っている感じ）
function type(row = 0, col = 0) {
  if (row >= props.lines.length) return
  const line = props.lines[row]
  shown.value[row] = line.slice(0, col)
  if (col % 3 === 0) play('tick')
  if (col < line.length) {
    timer = setTimeout(() => type(row, col + 1), line.startsWith('>') ? 45 : 14)
  } else {
    timer = setTimeout(() => type(row + 1, 0), 220)
  }
}
onMounted(() => (timer = setTimeout(() => type(), 450))) // 画面が点くのを待ってから
onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <div class="holo-wrap">
    <div class="holo">
      <header><span>REWRITER OS</span><span>v0.9.4β</span></header>
      <p v-for="(line, i) in shown" :key="i" :class="{ cmd: line.startsWith('>'), warn: /WARN|▼|ERR/.test(lines[i]) }">
        {{ line }}<span v-if="i === shown.length - 1" class="caret">▌</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.holo-wrap {
  position: absolute;
  top: 12%;
  left: 4%;
  z-index: 1;
  pointer-events: none;
  perspective: 900px;
}
.holo {
  width: min(400px, 80vw);
  min-height: 150px;
  padding: 10px 14px 14px;
  box-sizing: border-box;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  color: #8ffff2;
  text-shadow: 0 0 6px rgba(80, 255, 230, 0.8);
  background:
    repeating-linear-gradient(transparent 0 2px, rgba(120, 255, 240, 0.06) 2px 3px),
    linear-gradient(160deg, rgba(20, 90, 110, 0.4), rgba(5, 30, 45, 0.25));
  border: 1px solid rgba(110, 255, 240, 0.7);
  box-shadow: 0 0 24px rgba(80, 255, 230, 0.35), inset 0 0 30px rgba(80, 255, 230, 0.12);
  /* 空中に斜めに浮かぶ画面。ブラウン管のように、横一線から縦に開いて点く */
  transform: rotateY(22deg) rotateX(6deg);
  transform-origin: left center;
  animation: power-on 0.5s cubic-bezier(0.2, 0.9, 0.2, 1) both, hover 4s ease-in-out 0.5s infinite alternate, flicker 5s steps(1) infinite;
}
@keyframes power-on {
  from { transform: rotateY(22deg) rotateX(6deg) scaleY(0.01) scaleX(0.3); filter: brightness(3); }
  50% { transform: rotateY(22deg) rotateX(6deg) scaleY(0.01) scaleX(1); }
}
@keyframes hover {
  from { transform: rotateY(22deg) rotateX(6deg) translateY(0); }
  to { transform: rotateY(18deg) rotateX(4deg) translateY(-6px); }
}
/* ときどき、映像が途切れるようにちらつく */
@keyframes flicker {
  0%, 100% { opacity: 1; }
  92% { opacity: 0.55; }
  93% { opacity: 1; }
  95% { opacity: 0.7; }
}
header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  padding-bottom: 4px;
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  border-bottom: 1px solid rgba(110, 255, 240, 0.4);
  opacity: 0.8;
}
p {
  margin: 0;
  white-space: pre;
}
.cmd { color: #fff; }
.warn { color: #ff8aa0; text-shadow: 0 0 6px rgba(255, 60, 90, 0.8); }
.caret { animation: blink 0.5s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .holo { animation: none; }
}
</style>

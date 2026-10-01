<script setup>
// シネマ字幕：大事なセリフだけ、メッセージ欄の代わりに画面中央へ大きく出す
// 上下から黒帯が入り、文字は1文字ずつ、ぼやけた状態から浮かび上がる
defineProps({
  speaker: String,
  chars: Array, // MessageBox と同じ、1文字ずつの配列
  lineId: String,
})
</script>

<template>
  <div class="cinema">
    <div class="bar top"></div>
    <div class="bar bottom"></div>
    <p v-if="speaker && speaker !== 'SYSTEM'" class="who">— {{ speaker }} —</p>
    <p :key="lineId" class="text">
      <span v-for="(c, i) in chars" :key="i" class="char" :class="c.style">{{ c.ch }}</span>
    </p>
  </div>
</template>

<style scoped>
.cinema {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 14px;
  padding: 0 24px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.15) 70%);
  pointer-events: none;
}
.bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 12%;
  background: #000;
  animation: bar-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.bar.top { top: 0; transform-origin: top; }
.bar.bottom { bottom: 0; transform-origin: bottom; }
@keyframes bar-in {
  from { transform: scaleY(0); }
}
.who {
  margin: 0;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.4em;
  color: #ff9a3c;
}
.text {
  margin: 0;
  max-width: 22em;
  text-align: center;
  font-size: clamp(1.6rem, 4.5vw, 3rem);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.12em;
  text-shadow: 0 0 24px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 1);
}
.char {
  display: inline-block;
  animation: rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes rise {
  from { opacity: 0; transform: translateY(10px) scale(1.4); filter: blur(10px); }
  to { opacity: 1; transform: none; filter: blur(0); }
}
.char.em {
  color: #ffb066;
  text-shadow: 0 0 18px rgba(255, 123, 0, 0.9);
}
.char.shake {
  color: #ffd7e4;
  animation: rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both, tremble 0.16s steps(2) infinite 0.6s;
}
@keyframes tremble {
  0% { transform: translate(0, 0); }
  50% { transform: translate(2px, -1px); }
  100% { transform: translate(-1px, 2px); }
}
@media (prefers-reduced-motion: reduce) {
  .bar, .char { animation: none; }
}
</style>

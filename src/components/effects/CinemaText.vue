<script setup>
// シネマ字幕：大事なセリフだけ、メッセージ欄の代わりに画面中央へ大きく出す
// 上下から黒帯が入り、文字は1文字ずつ、奥から回転しながら飛び出してくる。
// 全部出たあとに、光の筋が文字の上をなでる
defineProps({
  speaker: String,
  chars: Array, // MessageBox と同じ、1文字ずつの配列
  lineId: String,
  done: Boolean, // 全部表示し終わったか
})
</script>

<template>
  <div class="cinema">
    <div class="bar top"></div>
    <div class="bar bottom"></div>
    <p v-if="speaker && speaker !== 'SYSTEM'" class="who">— {{ speaker }} —</p>
    <p :key="lineId" class="text" :class="{ done }">
      <span
        v-for="(c, i) in chars"
        :key="i"
        class="char"
        :class="c.style"
        :style="{ '--rx': `${(i % 3) * 40 - 40}deg`, '--ry': `${(i % 2 ? 1 : -1) * 50}deg` }"
      >{{ c.ch }}</span>
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
  animation: who-in 0.6s ease-out both;
}
@keyframes who-in {
  from { opacity: 0; letter-spacing: 1.2em; }
}
.text {
  position: relative;
  margin: 0;
  max-width: 22em;
  text-align: center;
  font-size: clamp(1.6rem, 4.5vw, 3rem);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.12em;
  text-shadow: 0 0 24px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 1);
  perspective: 600px; /* 文字の3D回転に奥行きを付ける */
}
/* 1文字ずつ、奥から回転しながら飛び出す */
.char {
  display: inline-block;
  animation: fly 0.7s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes fly {
  from { opacity: 0; transform: translateZ(-400px) rotateX(var(--rx)) rotateY(var(--ry)); filter: blur(12px); }
  to { opacity: 1; transform: none; filter: blur(0); }
}
.char.em {
  color: #ffb066;
  text-shadow: 0 0 18px rgba(255, 123, 0, 0.9);
}
.char.shake {
  color: #ffd7e4;
  animation: fly 0.7s cubic-bezier(0.2, 0.9, 0.2, 1) both, tremble 0.16s steps(2) infinite 0.7s;
}
@keyframes tremble {
  0% { transform: translate(0, 0); }
  50% { transform: translate(2px, -1px); }
  100% { transform: translate(-1px, 2px); }
}
/* 全部出たら、光の筋が左から右へ文字をなでる */
.text.done::after {
  content: '';
  position: absolute;
  inset: -10% -20%;
  background: linear-gradient(105deg, transparent 40%, rgba(255, 230, 200, 0.55) 50%, transparent 60%);
  mix-blend-mode: overlay;
  animation: shine 1.2s ease-out forwards;
}
@keyframes shine {
  from { transform: translateX(-60%); }
  to { transform: translateX(60%); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .bar, .char, .who, .text.done::after { animation: none; }
}
</style>

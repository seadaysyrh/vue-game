<template>
  <!--
    光漏れ（ライトリーク）：古いフィルムカメラに光が入ったときのような、
    オレンジやピンクのにじんだ光が画面を流れていく。感情が動く場面で使う
  -->
  <div class="leak">
    <span class="a"></span>
    <span class="b"></span>
    <span class="c"></span>
  </div>
</template>

<style scoped>
.leak {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  mix-blend-mode: screen;
  animation: life 2.6s ease-in-out forwards;
}
@keyframes life {
  0% { opacity: 0; }
  25%, 60% { opacity: 1; }
  100% { opacity: 0; }
}
.leak span {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}
.a {
  width: 70vw;
  height: 90vh;
  left: -20vw;
  top: -10vh;
  background: radial-gradient(circle, rgba(255, 130, 40, 0.85), transparent 65%);
  animation: drift-a 2.6s ease-in-out forwards;
}
.b {
  width: 50vw;
  height: 70vh;
  right: -15vw;
  bottom: -20vh;
  background: radial-gradient(circle, rgba(255, 60, 120, 0.6), transparent 65%);
  animation: drift-b 2.6s ease-in-out forwards;
}
.c {
  width: 30vw;
  height: 120vh;
  left: 40vw;
  top: -10vh;
  background: linear-gradient(90deg, transparent, rgba(255, 230, 180, 0.5), transparent);
  border-radius: 0;
  animation: sweep 2.6s ease-in-out forwards;
}
@keyframes drift-a { to { transform: translate(25vw, 10vh) scale(1.2); } }
@keyframes drift-b { to { transform: translate(-20vw, -10vh) scale(1.3); } }
@keyframes sweep { from { transform: translateX(-60vw) skewX(-20deg); } to { transform: translateX(60vw) skewX(-20deg); } }
@media (prefers-reduced-motion: reduce) {
  .leak, .leak span { animation: none; opacity: 0.4; }
}
</style>

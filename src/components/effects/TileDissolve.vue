<script setup>
// 場面転換「データ分解」：画面いっぱいの黒いタイルが、ある1点から順番に光って消えていき、
// その下から新しい場面が現れる（デジタルにほどけていく感じ）
const COLS = 16
const ROWS = 9

// 消え始める中心をランダムに決めて、そこからの距離で各タイルの遅れを決める
const ox = Math.random() * COLS
const oy = Math.random() * ROWS
const tiles = []
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const dist = Math.hypot(c - ox, r - oy)
    tiles.push({ key: `${r}-${c}`, delay: `${dist * 0.035 + Math.random() * 0.08}s` })
  }
}
</script>

<template>
  <div class="dissolve" aria-hidden="true">
    <span v-for="t in tiles" :key="t.key" class="tile" :style="{ animationDelay: t.delay }"></span>
  </div>
</template>

<style scoped>
.dissolve {
  position: absolute;
  inset: 0;
  z-index: 7;
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(9, 1fr);
  pointer-events: none;
}
.tile {
  background: #05060a;
  animation: tile-out 0.45s cubic-bezier(0.6, 0, 0.4, 1) both;
}
/* 一瞬オレンジのふちが光って、縮みながら消える */
@keyframes tile-out {
  0% { transform: scale(1); box-shadow: inset 0 0 0 0 rgba(255, 140, 50, 0); }
  30% { transform: scale(1); box-shadow: inset 0 0 0 2px rgba(255, 140, 50, 0.9); }
  100% { transform: scale(0) rotate(45deg); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dissolve { display: none; }
}
</style>

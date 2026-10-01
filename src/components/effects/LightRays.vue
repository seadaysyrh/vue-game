<script setup>
// 光の筋（ゴッドレイ）：窓から差しこむ光を、ぼかした細長い帯を何本か重ねて表現する
//   sunset … 左上から差すオレンジの夕日
//   moon   … 右上から差す青白い月明かり
defineProps({
  mode: String,
})
</script>

<template>
  <div v-if="mode" class="rays" :class="mode">
    <span v-for="i in 6" :key="i" :style="{ '--i': i }"></span>
  </div>
</template>

<style scoped>
.rays {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  mix-blend-mode: screen; /* 明るさを足すように重ねる */
  /* マウスと一緒に、光の向きも少しだけ動く */
  transform: translate(calc(var(--mx, 0) * -2%), 0);
  transition: transform 1s ease-out;
}
.rays span {
  position: absolute;
  top: -30%;
  height: 170%;
  width: calc(6% + var(--i) * 1.5%);
  filter: blur(22px);
  transform-origin: 50% 0;
  animation: sway calc(7s + var(--i) * 1.3s) ease-in-out infinite alternate;
  animation-delay: calc(var(--i) * -1.7s);
}
.sunset span {
  left: calc(var(--i) * 9% - 6%);
  background: linear-gradient(rgba(255, 190, 120, 0.42), rgba(255, 140, 60, 0.08) 60%, transparent 85%);
  --tilt: -28deg;
}
.moon span {
  right: calc(var(--i) * 8% - 4%);
  background: linear-gradient(rgba(170, 200, 255, 0.3), rgba(140, 170, 255, 0.06) 60%, transparent 85%);
  --tilt: 26deg;
}
@keyframes sway {
  from { transform: rotate(var(--tilt)) scaleX(1); opacity: 0.6; }
  to { transform: rotate(calc(var(--tilt) + 4deg)) scaleX(1.3); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .rays span { animation: none; transform: rotate(var(--tilt)); }
}
</style>

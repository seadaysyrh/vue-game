<script setup>
// 観測計の大写し：世界が動いた瞬間に、観測計を画面の中央に大きく出す
// 光の輪が広がり、ラベルが点滅して、2秒ほどで消える
import NixieMeter from '../NixieMeter.vue'

defineProps({
  value: String,
  label: { type: String, default: 'WORLDLINE DIVERGENCE' },
})
</script>

<template>
  <div class="meter-burst">
    <div class="halo"></div>
    <div class="halo late"></div>
    <p class="label">{{ label }}</p>
    <!-- 同じ NixieMeter 部品を、CSS で大きく拡大して使っている -->
    <div class="big"><NixieMeter :value="value" /></div>
    <div class="scan"></div>
  </div>
</template>

<style scoped>
.meter-burst {
  position: absolute;
  inset: 0;
  z-index: 6;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 18px;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(20, 8, 0, 0.75), rgba(0, 0, 0, 0.4) 60%, transparent);
  animation: burst-life 2.4s ease-in-out forwards;
}
@keyframes burst-life {
  0% { opacity: 0; }
  10%, 80% { opacity: 1; }
  100% { opacity: 0; }
}
.big {
  transform: scale(2.6);
  animation: zoom 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes zoom {
  from { transform: scale(4); filter: blur(8px); }
  25% { transform: scale(2.6); filter: blur(0); }
  to { transform: scale(2.8); }
}
.label {
  margin: 0 0 40px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.6em;
  color: #ff9a3c;
  animation: blink 0.5s steps(2) 3;
}
@keyframes blink { 50% { opacity: 0.2; } }
.halo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30vmin;
  height: 30vmin;
  border-radius: 50%;
  border: 2px solid rgba(255, 138, 42, 0.7);
  box-shadow: 0 0 30px rgba(255, 100, 0, 0.6);
  transform: translate(-50%, -50%) scale(0.3);
  animation: halo 1.6s cubic-bezier(0.1, 0.7, 0.3, 1) forwards;
}
.halo.late { animation-delay: 0.25s; border-width: 1px; }
@keyframes halo {
  from { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
  to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
}
/* 上から下へ走る走査線 */
.scan {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 180, 110, 0.7);
  box-shadow: 0 0 16px #ff7b00;
  animation: scan 1.2s ease-in-out 2;
}
@keyframes scan {
  from { top: 0; }
  to { top: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .big, .halo, .scan, .label { animation: none; }
}
</style>

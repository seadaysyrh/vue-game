<script setup>
// クリックの手応え：クリックした場所から、オレンジの輪と光の粒が弾ける
// 親から spawn(x, y) を呼んでもらう（defineExpose で外から呼べるようにしている）
import { ref } from 'vue'

const ripples = ref([]) // いま画面に出ている波紋の一覧
let nextId = 0

function spawn(x, y) {
  const id = nextId++
  // 光の粒：8方向に少しずつランダムに飛ばす
  const sparks = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.4
    const dist = 30 + Math.random() * 40
    return { dx: `${Math.cos(angle) * dist}px`, dy: `${Math.sin(angle) * dist}px` }
  })
  ripples.value.push({ id, x, y, sparks })
  // 0.7秒で消す
  setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== id)
  }, 700)
}

defineExpose({ spawn })
</script>

<template>
  <div class="ripples" aria-hidden="true">
    <div v-for="r in ripples" :key="r.id" class="ripple" :style="{ left: `${r.x}px`, top: `${r.y}px` }">
      <span class="ring"></span>
      <span class="ring late"></span>
      <span v-for="(s, i) in r.sparks" :key="i" class="spark" :style="{ '--dx': s.dx, '--dy': s.dy }"></span>
    </div>
  </div>
</template>

<style scoped>
.ripples {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  overflow: hidden;
}
.ripple {
  position: absolute;
}
.ring {
  position: absolute;
  left: -30px;
  top: -30px;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 170, 90, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(255, 123, 0, 0.8);
  animation: ring 0.6s cubic-bezier(0.1, 0.7, 0.3, 1) forwards;
}
.ring.late {
  border-width: 1px;
  animation-delay: 0.08s;
}
@keyframes ring {
  from { transform: scale(0.1); opacity: 1; }
  to { transform: scale(1.6); opacity: 0; }
}
.spark {
  position: absolute;
  left: -2px;
  top: -2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ffd0a0;
  box-shadow: 0 0 8px #ff7b00;
  animation: spark 0.55s ease-out forwards;
}
@keyframes spark {
  from { transform: translate(0, 0) scale(1); opacity: 1; }
  to { transform: translate(var(--dx), var(--dy)) scale(0.2); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ripples { display: none; }
}
</style>

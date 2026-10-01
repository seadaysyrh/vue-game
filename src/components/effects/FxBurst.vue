<script setup>
// 集中線：漫画の「ドンッ！」の線。画面の外側から中心に向かって細い線を描く
// 少しずつ描き直して、線がチリチリ動いて見えるようにする
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let timer = null

function draw() {
  const c = canvas.value
  const ctx = c.getContext('2d')
  const w = c.width
  const h = c.height
  const cx = w / 2
  const cy = h * 0.42 // 顔のあたりを中心にする
  const far = Math.hypot(w, h)
  ctx.clearRect(0, 0, w, h)
  for (let i = 0; i < 110; i++) {
    const angle = Math.random() * Math.PI * 2
    const inner = far * (0.22 + Math.random() * 0.2) // 線の内側の端（中心にはかからない）
    const spread = 0.004 + Math.random() * 0.012 // 線の太さ（角度）
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner)
    ctx.lineTo(cx + Math.cos(angle - spread) * far, cy + Math.sin(angle - spread) * far)
    ctx.lineTo(cx + Math.cos(angle + spread) * far, cy + Math.sin(angle + spread) * far)
    ctx.closePath()
    ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + Math.random() * 0.45})`
    ctx.fill()
  }
}

onMounted(() => {
  const c = canvas.value
  c.width = c.clientWidth
  c.height = c.clientHeight
  draw()
  timer = setInterval(draw, 70)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <canvas ref="canvas" class="burst"></canvas>
</template>

<style scoped>
.burst {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  animation: burst 0.9s ease-out forwards;
}
@keyframes burst {
  0% { opacity: 0; transform: scale(1.15); }
  15% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.02); }
}
</style>

<script setup>
// 数字の雨：<canvas> に、オレンジの数字を上から降らせる（ムービー用）
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null) // template の ref="canvas" の要素が入る
let frameId = 0

onMounted(() => {
  const c = canvas.value
  const ctx = c.getContext('2d')
  c.width = c.clientWidth
  c.height = c.clientHeight

  const size = 22
  const columns = Math.ceil(c.width / size)
  const drops = Array.from({ length: columns }, () => Math.random() * -30) // 各列の文字の位置

  function draw() {
    // 半透明の黒を重ねて、前の文字を少しずつ消す（残像になる）
    ctx.fillStyle = 'rgba(5, 3, 0, 0.18)'
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.font = `${size}px 'Share Tech Mono', monospace`

    drops.forEach((y, i) => {
      const ch = Math.random() < 0.1 ? '.' : String(Math.floor(Math.random() * 10))
      ctx.fillStyle = Math.random() < 0.05 ? '#fff3e0' : '#ff8a2a'
      ctx.fillText(ch, i * size, y * size)
      drops[i] = y * size > c.height && Math.random() > 0.95 ? 0 : y + 0.7
    })
    frameId = requestAnimationFrame(draw) // 次の画面更新でもう一度描く
  }
  draw()
})

// 画面から消えるときに、描画ループを必ず止める
onUnmounted(() => cancelAnimationFrame(frameId))
</script>

<template>
  <canvas ref="canvas" class="rain"></canvas>
</template>

<style scoped>
.rain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #050300;
}
</style>

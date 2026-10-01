<script setup>
// 空気感の粒子：<canvas> に、ゆっくり漂う光の粒を描く
//   dust  … 夕方の光のチリ（オレンジ）
//   stars … 夜空のまたたき＋ふわっと光る粒
//   echo  … 残響の光（青緑）が下から立ちのぼる
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  mode: String, // 'dust' | 'stars' | 'echo' | null
})

const SETTINGS = {
  dust: { count: 60, color: [255, 190, 120], speedY: -0.08, size: [1, 3.2], glow: 8 },
  stars: { count: 90, color: [220, 235, 255], speedY: -0.03, size: [0.6, 2], glow: 6 },
  echo: { count: 70, color: [120, 255, 220], speedY: -0.35, size: [1, 3.5], glow: 12 },
}

const canvas = ref(null)
let frameId = 0
let particles = []
let resize = null

function makeParticle(w, h, s, anywhere) {
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : h + 10,
    r: s.size[0] + Math.random() * (s.size[1] - s.size[0]),
    vx: (Math.random() - 0.5) * 0.15,
    vy: s.speedY * (0.5 + Math.random()),
    phase: Math.random() * Math.PI * 2, // またたきのタイミングをずらす
  }
}

function reset() {
  const c = canvas.value
  const s = SETTINGS[props.mode]
  particles = s ? Array.from({ length: s.count }, () => makeParticle(c.width, c.height, s, true)) : []
}

onMounted(() => {
  const c = canvas.value
  const ctx = c.getContext('2d')
  resize = () => {
    c.width = c.clientWidth
    c.height = c.clientHeight
  }
  resize()
  reset()
  window.addEventListener('resize', resize)

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function draw(time) {
    ctx.clearRect(0, 0, c.width, c.height)
    const s = SETTINGS[props.mode]
    if (s) {
      const [r, g, b] = s.color
      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx
          p.y += p.vy
        }
        if (p.y < -10) Object.assign(p, makeParticle(c.width, c.height, s, false))
        const alpha = 0.35 + 0.35 * Math.sin(time / 900 + p.phase)
        ctx.shadowBlur = s.glow
        ctx.shadowColor = `rgba(${r},${g},${b},${alpha})`
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    frameId = requestAnimationFrame(draw)
  }
  frameId = requestAnimationFrame(draw)
})

// 画面から消えるときに、描画ループとイベントを必ず止める
// （onUnmounted は onMounted の中ではなく、ここ＝setup の直下で登録する決まり）
onUnmounted(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('resize', resize)
})

// モードが変わったら粒を作り直す
watch(() => props.mode, () => canvas.value && reset())
</script>

<template>
  <canvas ref="canvas" class="ambient"></canvas>
</template>

<style scoped>
.ambient {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>

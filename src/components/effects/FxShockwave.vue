<script setup>
// 衝撃波：画面の中心から輪が広がり、そこだけ画面がぐにゃっと歪む
// しくみ：「どちらにどれだけずらすか」を色で描いた画像（変位マップ）を作り、
//         SVG の feDisplacementMap で、その色のとおりに画面のピクセルをずらす。
//         輪の大きさを変えた画像を何枚か先に作っておき、パラパラ漫画のように差し替える
import { ref, onMounted, onUnmounted } from 'vue'

const FRAMES = 16
const W = 256
const H = 144
let cache = null // 一度作った画像は使い回す

function makeFrames() {
  if (cache) return cache
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  cache = []
  for (let f = 0; f < FRAMES; f++) {
    const radius = 0.05 + (f / (FRAMES - 1)) * 1.3 // 輪の半径（画面の高さを1とした大きさ）
    const img = ctx.createImageData(W, H)
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const nx = ((x / W - 0.5) * 2 * W) / H
        const ny = (y / H - 0.5) * 2
        const d = Math.sqrt(nx * nx + ny * ny) || 0.0001
        const ring = Math.exp(-(((d - radius) / 0.12) ** 2)) // 輪の上だけ大きくずらす
        const i = (y * W + x) * 4
        img.data[i] = 128 + (nx / d) * ring * 127 // 赤 = 横にずらす量
        img.data[i + 1] = 128 + (ny / d) * ring * 127 // 緑 = 縦にずらす量
        img.data[i + 2] = 128
        img.data[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
    cache.push(canvas.toDataURL())
  }
  return cache
}

const feImage = ref(null)
const feMap = ref(null)
let frameId = 0

onMounted(() => {
  const frames = makeFrames()
  const start = performance.now()
  const duration = 900
  function step(now) {
    const t = Math.min((now - start) / duration, 1)
    const index = Math.min(FRAMES - 1, Math.floor(t * FRAMES))
    feImage.value.setAttribute('href', frames[index])
    feMap.value.setAttribute('scale', String(0.08 * (1 - t))) // だんだん歪みを弱める
    if (t < 1) frameId = requestAnimationFrame(step)
  }
  frameId = requestAnimationFrame(step)
})
onUnmounted(() => cancelAnimationFrame(frameId))
</script>

<template>
  <div class="shockwave">
    <svg class="defs" aria-hidden="true">
      <!-- primitiveUnits="objectBoundingBox"：位置や量を「要素の大きさに対する割合」で指定する -->
      <filter id="shockwave" x="0" y="0" width="1" height="1" primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB">
        <feImage ref="feImage" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
        <feDisplacementMap ref="feMap" in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
    <!-- 目に見える輪（歪みに合わせて広がる光の輪） -->
    <div class="ring"></div>
    <div class="ring late"></div>
  </div>
</template>

<style scoped>
.shockwave {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}
.defs {
  position: absolute;
  width: 0;
  height: 0;
}
.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10vmax;
  height: 10vmax;
  border-radius: 50%;
  border: 3px solid rgba(255, 220, 180, 0.8);
  box-shadow: 0 0 40px rgba(255, 150, 60, 0.8), inset 0 0 40px rgba(255, 150, 60, 0.6);
  transform: translate(-50%, -50%) scale(0.1);
  animation: ring 0.9s cubic-bezier(0.1, 0.6, 0.3, 1) forwards;
}
.ring.late {
  border-width: 1px;
  animation-delay: 0.12s;
  opacity: 0.6;
}
@keyframes ring {
  from { transform: translate(-50%, -50%) scale(0.1); opacity: 1; }
  to { transform: translate(-50%, -50%) scale(14); opacity: 0; }
}
</style>

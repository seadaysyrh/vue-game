<script setup>
// タイムリープのトンネル：<canvas> に「時間の流れ」を3Dで描いて、その中を飛んでいく（ムービー用）
//   ・光の筋 … 画面の奥から手前へ飛んでくる点を、前の位置から線でつなぐ（速いほど長い線になる）
//   ・時計の輪 … 数字が書かれた輪が、奥からくぐり抜けてくる
//   ・思い出の絵 … 通りすぎる景色が、カードになって横をかすめていく
//   ・数字の雨 … 送信のときの「数字の雨」が、トンネルの後ろでも降り続ける（速くなるほど速く降る）
//   ・時計 … 画面下の時刻が、どんどん速く巻き戻っていく
// reverse: true なら逆向き（すべてが奥へ吸いこまれていく = 巻き戻し）
// 「奥行き」の計算はかんたん：奥にあるもの（z が大きい）ほど、中心に寄せて小さく描く（x / z, y / z）
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  duration: Number, // ミリ秒
  images: { type: Array, default: () => [] }, // 通りすぎる景色（画像のURL）
  reverse: Boolean,
  label: { type: String, default: 'TIME LEAP' },
})

const canvas = ref(null)
const clock = ref('16:48:00.00')
const shake = ref('')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let frameId = 0
const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']

// 速さの変化：ゆっくり動き出して、一気に最高速へ（p は 0〜1 の進み具合）
const speedAt = (p) => 0.25 + 4.2 * Math.pow(Math.min(p / 0.8, 1), 2.2)

// 時刻の表示：16:48:00 から、巻き戻る量がどんどん増えていく
function clockAt(p) {
  const back = (Math.exp(p * 11.4) - 1) * 0.9 // 巻き戻した秒数（最後は約1日ぶん = 昨日まで戻る）
  const t = ((16 * 3600 + 48 * 60 - back) % 86400 + 86400) % 86400
  const pad = (n) => String(Math.floor(n)).padStart(2, '0')
  return `${pad(t / 3600)}:${pad((t / 60) % 60)}:${pad(t % 60)}.${pad((t * 100) % 100)}`
}

onMounted(() => {
  const c = canvas.value
  const ctx = c.getContext('2d')
  c.width = c.clientWidth
  c.height = c.clientHeight
  const cx = c.width / 2
  const cy = c.height / 2
  const F = Math.min(c.width, c.height) * 0.5 // 奥行きの強さ（大きいほど広角）
  const dir = props.reverse ? -1 : 1 // 1 = 手前へ飛んでくる、-1 = 奥へ吸いこまれる
  const FAR = 6
  const NEAR = 0.08

  // 光の筋の点：角度 a・中心からの距離 r・奥行き z
  const stars = Array.from({ length: 520 }, () => ({
    a: Math.random() * Math.PI * 2,
    r: 0.25 + Math.random() * 2.2,
    z: NEAR + Math.random() * (FAR - NEAR),
    hue: Math.random() < 0.3 ? 'cyan' : 'orange',
  }))
  // 時計の輪
  const rings = Array.from({ length: 7 }, (_, i) => ({ z: NEAR + ((i + 0.5) / 7) * (FAR - NEAR), turn: Math.random() * 6 }))
  // 通りすぎる景色：順番に奥から現れる
  const cards = props.images.map((src, i) => {
    const img = new Image()
    img.src = src
    const side = i % 2 ? 1 : -1
    return { img, start: 0.1 + (i / props.images.length) * 0.7, a: side * (0.4 + Math.random() * 0.5) + (side < 0 ? Math.PI : 0), tilt: side * 0.25 }
  })

  // 数字の雨：列ごとの文字の位置（DigitRain.vue と同じしくみ）。巻き戻しのときは下から上へ昇っていく
  const SIZE = 20
  const drops = Array.from({ length: Math.ceil(c.width / SIZE) }, () => Math.random() * (c.height / SIZE))

  let spin = 0
  const begin = performance.now()
  let last = begin

  function project(a, r, z) {
    const s = F / z
    return [cx + Math.cos(a + spin) * r * s, cy + Math.sin(a + spin) * r * s, s]
  }

  function draw(now) {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    const p = Math.min((now - begin) / props.duration, 1)
    const v = speedAt(p)
    spin += dir * v * 0.35 * dt

    // 完全に消さずに、半透明の黒を重ねる → 前のコマが残像になって、スピード感が出る
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = `rgba(3, 4, 12, ${0.28 + 0.2 * (1 - p)})`
    ctx.fillRect(0, 0, c.width, c.height)

    // 数字の雨（揺れの影響を受けない、いちばん奥の層）
    ctx.font = `${SIZE}px 'Share Tech Mono', monospace`
    ctx.textAlign = 'left'
    const rows = c.height / SIZE
    drops.forEach((y, i) => {
      ctx.fillStyle = Math.random() < 0.06 ? 'rgba(255, 243, 224, 0.9)' : 'rgba(255, 138, 42, 0.7)'
      ctx.fillText(String(Math.floor(Math.random() * 10)), i * SIZE, y * SIZE)
      let next = y + dir * (0.5 + v * 0.6)
      if (next > rows && Math.random() > 0.9) next = 0
      if (next < 0 && Math.random() > 0.9) next = rows
      drops[i] = next
    })

    // 速いほど画面が揺れる
    const amp = reduceMotion ? 0 : v * 2.2
    const sx = (Math.random() - 0.5) * amp
    const sy = (Math.random() - 0.5) * amp
    ctx.setTransform(1, 0, 0, 1, sx, sy)
    shake.value = `translate(${sx * 1.5}px, ${sy * 1.5}px)`

    // 中心の光：速くなるほど大きく、明るく
    const core = F * (0.08 + v * 0.06) * (1 + 0.15 * Math.sin(now / 60))
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, core * 3)
    g.addColorStop(0, 'rgba(255, 250, 235, 0.95)')
    g.addColorStop(0.25, 'rgba(255, 160, 70, 0.55)')
    g.addColorStop(1, 'rgba(255, 120, 30, 0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx, cy, core * 3, 0, Math.PI * 2)
    ctx.fill()

    // 時計の輪：数字が円に沿って並び、輪ごとに回る
    ctx.font = `${Math.round(F * 0.05)}px 'Share Tech Mono', monospace`
    ctx.textAlign = 'center'
    for (const ring of rings) {
      ring.z -= dir * v * 1.4 * dt
      if (ring.z < NEAR) ring.z += FAR - NEAR
      if (ring.z > FAR) ring.z -= FAR - NEAR
      const s = F / ring.z
      const R = 1.5 * s
      const alpha = Math.min(1, (FAR - ring.z) / 2) * Math.min(1, ring.z * 1.5)
      ctx.strokeStyle = `rgba(255, 150, 60, ${alpha * 0.45})`
      ctx.lineWidth = Math.max(1, s * 0.012)
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = `rgba(255, 220, 180, ${alpha * 0.7})`
      const count = 24
      for (let k = 0; k < count; k++) {
        const ang = (k / count) * Math.PI * 2 + ring.turn + spin * 2
        ctx.save()
        ctx.translate(cx + Math.cos(ang) * R * 0.94, cy + Math.sin(ang) * R * 0.94)
        ctx.rotate(ang + Math.PI / 2)
        ctx.scale(s / F * 4, s / F * 4)
        // ローマ数字（時計の文字盤）と、ぐるぐる変わる数字を交互に並べる
        ctx.fillText(k % 2 ? String((k * 7 + Math.floor(now / 90)) % 60).padStart(2, '0') : ROMAN[(k / 2) % 12], 0, 0)
        ctx.restore()
      }
    }

    // 光の筋：今の位置と、少し前の位置を線でつなぐ（速いほど線が長い）
    ctx.lineCap = 'round'
    for (const st of stars) {
      const step = dir * v * 1.6 * dt
      st.z -= step
      if (st.z < NEAR) { st.z = FAR; st.a = Math.random() * Math.PI * 2 }
      if (st.z > FAR) { st.z = NEAR + 0.2; st.a = Math.random() * Math.PI * 2 }
      const [x1, y1, s] = project(st.a, st.r, st.z)
      const [x0, y0] = project(st.a, st.r, st.z + dir * v * 0.09)
      const alpha = Math.min(1, (FAR - st.z) / 2.5)
      ctx.strokeStyle = st.hue === 'cyan' ? `rgba(120, 230, 255, ${alpha})` : `rgba(255, 170, 80, ${alpha})`
      ctx.lineWidth = Math.max(0.6, s * 0.006)
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.lineTo(x1, y1)
      ctx.stroke()
    }

    // 思い出の絵：奥から現れて、横をかすめていく（逆向きなら、横から奥へ吸いこまれていく）
    for (const card of cards) {
      const local = (p - card.start) / 0.32 // 0〜1 の間だけ見える
      if (local < 0 || local > 1 || !card.img.complete) continue
      const z = props.reverse ? NEAR + 0.3 + local * 4.5 : FAR - local * (FAR - NEAR - 0.25)
      const s = F / z
      const [x, y] = project(card.a, 1.1, z)
      const w = 1.6 * s
      const h = 0.9 * s
      const alpha = Math.min(1, Math.min(local, 1 - local) * 5)
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.rotate(card.tilt + spin)
      ctx.drawImage(card.img, -w / 2, -h / 2, w, h)
      ctx.strokeStyle = 'rgba(255, 160, 70, 0.9)'
      ctx.lineWidth = Math.max(1, s * 0.01)
      ctx.strokeRect(-w / 2, -h / 2, w, h)
      ctx.restore()
    }

    // 最後は白く飛ぶ（次のカットのフラッシュにつながる）
    if (p > 0.82) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.fillStyle = `rgba(255, 248, 235, ${((p - 0.82) / 0.18) ** 2})`
      ctx.fillRect(0, 0, c.width, c.height)
    }

    clock.value = clockAt(p)
    frameId = requestAnimationFrame(draw)
  }
  ctx.fillStyle = '#03040c'
  ctx.fillRect(0, 0, c.width, c.height)
  frameId = requestAnimationFrame(draw)
})

onUnmounted(() => cancelAnimationFrame(frameId))
</script>

<template>
  <div class="leap">
    <canvas ref="canvas" class="tunnel"></canvas>
    <div class="hud" :style="{ transform: shake }">
      <span class="label">{{ reverse ? '◀◀' : '▶▶' }} {{ label }}</span>
      <span class="clock">{{ clock }}</span>
    </div>
  </div>
</template>

<style scoped>
.leap {
  position: absolute;
  inset: 0;
  background: #03040c;
}
.tunnel {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
/* 画面下の時計：数字が光ってにじむ */
.hud {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 14%;
  display: grid;
  justify-items: center;
  gap: 4px;
  font-family: 'Share Tech Mono', monospace;
  color: #ffd2a0;
  text-shadow: 0 0 10px rgba(255, 130, 40, 0.9), 0 0 2px #000;
  mix-blend-mode: screen;
}
.label {
  font-size: clamp(0.7rem, 1.6vw, 0.95rem);
  letter-spacing: 0.5em;
  animation: blink 0.5s steps(2) infinite;
}
.clock {
  font-size: clamp(1.6rem, 5vw, 3.2rem);
  letter-spacing: 0.08em;
}
@keyframes blink { 50% { opacity: 0.3; } }
</style>

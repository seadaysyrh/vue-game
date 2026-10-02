<script setup>
// カットイン（インサートショット）：画面を切り取った「窓」の中に、キャラの目や顔を大きく映す
//   type 'eyes'     … 目だけを横長の帯でアップ
//   type 'face'     … 顔のアップ（口も映るので口パクする）
//   type 'split'    … 画面を左右に割って、2人の目を並べる
//   type 'diagonal' … 斜めに傾いた帯で、目のアップ（angle で傾きを変えられる）
//   type 'vertical' … 縦長の細い帯で、片目だけをアップ（side: 'left' | 'center' | 'right'）
//   type 'triptych' … 縦の帯を3本並べて、左目・口・右目を別々に映す
//   type 'slash'    … 斜めの帯を2本、反対側から滑りこませて、2人の目をにらみ合わせる
// 中身はふつうの立ち絵部品（CharaSprite）を巨大に拡大して、見せたい場所が窓の中心に来るようにずらしているだけ。
// なので、アップの中でもまばたきや口パクがそのまま動く
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CharaSprite from '../CharaSprite.vue'
import { FACES } from '../../data/faces'

const props = defineProps({
  cutin: Object, // { type, chara, echo, ... } （type ごとの追加の指定は上のコメントを参照）
  talking: Boolean,
})

// 画面サイズ（変わったら計算し直す）
const size = ref({ w: window.innerWidth, h: window.innerHeight })
const onResize = () => (size.value = { w: window.innerWidth, h: window.innerHeight })
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

// 「どこを映すか」ごとの、中心の位置（目の位置からのずれ）と、窓の幅に対してどれくらい大きく映すか
//   dx, dy … 目の中心からのずれ。dx は両目の幅に対する割合、dy は立ち絵の高さに対する割合
//   part   … 映したい部分の幅（両目の幅に対する割合）
//   fill   … その部分が、窓の幅の何割になるようにするか
//   maxH   … その部分の幅は、窓の高さの何倍まで（横長すぎる画面で、アップが帯からはみ出さないように）
const FOCUS = {
  eyes: { dx: 0, dy: 0, part: 1, fill: 0.46, maxH: 2.2 },
  face: { dx: 0, dy: 0.035, part: 1, fill: 0.24, maxH: 0.9 },
  'eye-left': { dx: -0.27, dy: 0, part: 0.45, fill: 0.8, maxH: 2.2 },
  'eye-right': { dx: 0.27, dy: 0, part: 0.45, fill: 0.8, maxH: 2.2 },
  mouth: { dx: 0, dy: 'mouth', part: 0.55, fill: 0.75, maxH: 2.2 }, // dy はキャラごとの mouthY（faces.js）を使う
}

// 窓（幅 panelW・高さ panelH）の中で、立ち絵をどれだけ拡大してどこに置くかを計算する
//   viewW … 窓のうち、画面に見えている幅（斜めの帯は画面より長いので、見えている幅で大きさを決める）
function framing(chara, panelW, panelH, focus = 'eyes', viewW = panelW) {
  const face = FACES[chara]
  if (!face) return {}
  const f = FOCUS[focus]
  const spriteW = Math.min(viewW * f.fill, panelH * f.maxH) / (face.eyeSpan * f.part)
  const spriteH = spriteW / face.aspect
  const cx = face.x + f.dx * face.eyeSpan
  const cy = face.y + (f.dy === 'mouth' ? face.mouthY : f.dy)
  return {
    height: `${spriteH}px`,
    left: `${panelW / 2 - cx * spriteW}px`,
    top: `${panelH / 2 - cy * spriteH}px`,
  }
}

// 窓を1枚作る（box … 画面のどこに置くか。extra … 傾き rotate・入ってくる方向 enter・遅れ delay・切り抜き clip）
function panel(key, chara, echo, box, focus, extra = {}) {
  const viewW = Math.min(box.width, size.value.w)
  return { key, chara, echo, box, focus, style: framing(chara, box.width, box.height, focus, viewW), ...extra }
}

const panels = computed(() => {
  const { w, h } = size.value
  const c = props.cutin
  switch (c.type) {
    case 'split': {
      const pw = w / 2
      const ph = h * 0.42
      const top = h * 0.29
      return [
        panel('left', c.left.chara, c.left.echo, { left: 0, top, width: pw, height: ph }, 'eyes', { enter: 'from-left', clip: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }),
        panel('right', c.right.chara, c.right.echo, { left: pw - w * 0.04, top, width: pw + w * 0.04, height: ph }, 'eyes', { enter: 'from-right', clip: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)', delay: 0.12 }),
      ]
    }
    case 'face':
      return [panel('face', c.chara, c.echo, { left: 0, top: h * 0.17, width: w, height: h * 0.5 }, 'face', { enter: 'from-right' })]
    case 'diagonal': {
      // 画面より長い帯を斜めに置く（傾けても端が見えないように）
      const bw = w * 1.7
      const bh = h * 0.3
      return [panel('diag', c.chara, c.echo, { left: (w - bw) / 2, top: h * 0.33, width: bw, height: bh }, 'eyes', { rotate: c.angle ?? -14, enter: 'from-right' })]
    }
    case 'vertical': {
      const sw = Math.max(w * 0.24, 180)
      const left = c.side === 'left' ? w * 0.1 : c.side === 'center' ? (w - sw) / 2 : w * 0.9 - sw
      return [panel('vert', c.chara, c.echo, { left, top: -h * 0.05, width: sw, height: h * 1.1 }, c.focus ?? 'eye-right', { enter: 'from-top' })]
    }
    case 'triptych': {
      const sw = w * 0.22
      const gap = w * 0.04
      const start = (w - sw * 3 - gap * 2) / 2
      const focuses = c.focuses ?? ['eye-left', 'mouth', 'eye-right']
      return focuses.map((focus, i) =>
        panel(`tri${i}`, c.chara, c.echo, { left: start + i * (sw + gap), top: -h * 0.05, width: sw, height: h * 1.1 }, focus, {
          enter: i % 2 ? 'from-bottom' : 'from-top',
          delay: i * 0.12,
        }),
      )
    }
    case 'slash': {
      const bw = w * 1.7
      const bh = h * 0.27
      return [
        panel('slashA', c.left.chara, c.left.echo, { left: (w - bw) / 2, top: h * 0.14, width: bw, height: bh }, 'eyes', { rotate: -10, enter: 'from-left' }),
        panel('slashB', c.right.chara, c.right.echo, { left: (w - bw) / 2, top: h * 0.5, width: bw, height: bh }, 'eyes', { rotate: -10, enter: 'from-right', delay: 0.15 }),
      ]
    }
    default: // 'eyes'
      return [panel('eyes', c.chara, c.echo, { left: 0, top: h * 0.29, width: w, height: h * 0.26 }, 'eyes', { enter: 'from-right' })]
  }
})
</script>

<template>
  <div class="cutin" :class="cutin.type">
    <div class="dim"></div>
    <!-- 傾きは外側の箱、登場の動きは内側の箱に付ける（transform がぶつからないように） -->
    <div
      v-for="p in panels"
      :key="p.key"
      class="holder"
      :style="{
        left: `${p.box.left}px`,
        top: `${p.box.top}px`,
        width: `${p.box.width}px`,
        height: `${p.box.height}px`,
        transform: p.rotate ? `rotate(${p.rotate}deg)` : null,
      }"
    >
      <div class="panel" :class="p.enter" :style="{ clipPath: p.clip, animationDelay: `${p.delay ?? 0}s` }">
        <div class="push">
          <CharaSprite :name="p.chara" :echo="p.echo" :talking="cutin.type === 'face' && talking" class="giant" :style="p.style" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cutin {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}
.dim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  animation: fade 0.35s ease-out both;
}
@keyframes fade { from { opacity: 0; } }

.holder {
  position: absolute;
}
.panel {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #05060a;
  /* ふちのオレンジの光 */
  box-shadow: 0 0 0 2px #ff8a2a, 0 0 22px rgba(255, 123, 0, 0.55);
  animation-duration: 0.55s;
  animation-timing-function: cubic-bezier(0.2, 0.9, 0.2, 1);
  animation-fill-mode: both;
}
/* 入ってくる方向。入る瞬間だけブレ（モーションブラー）と光をかける */
.from-right { animation-name: from-right; }
.from-left { animation-name: from-left; }
.from-top { animation-name: from-top; }
.from-bottom { animation-name: from-bottom; }
@keyframes from-right {
  from { transform: translateX(30%) skewX(-12deg); filter: blur(14px) brightness(1.8); opacity: 0; }
}
@keyframes from-left {
  from { transform: translateX(-30%) skewX(12deg); filter: blur(14px) brightness(1.8); opacity: 0; }
}
@keyframes from-top {
  from { transform: translateY(-40%) skewY(-6deg); filter: blur(14px) brightness(1.8); opacity: 0; }
}
@keyframes from-bottom {
  from { transform: translateY(40%) skewY(6deg); filter: blur(14px) brightness(1.8); opacity: 0; }
}

/* 窓の中でも、じわじわ寄り続ける */
.push {
  position: absolute;
  inset: 0;
  animation: push 8s ease-out both;
}
@keyframes push {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
.giant {
  position: absolute;
}
@media (prefers-reduced-motion: reduce) {
  .panel, .push, .dim { animation: none; }
}
</style>

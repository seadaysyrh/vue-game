<script setup>
// カットイン（インサートショット）：画面を横切る帯の中に、キャラの目や顔を大きく映す映画的な演出
//   type 'eyes'  … 目だけを横長の帯でアップ
//   type 'face'  … 顔のアップ（口も映るので口パクする）
//   type 'split' … 画面を左右に割って、2人の目を並べる（にらみ合い・向かい合い）
// 中身はふつうの立ち絵部品（CharaSprite）を巨大に拡大して、目の位置が帯の中心に来るようにずらしているだけ。
// なので、アップの中でもまばたきや口パクがそのまま動く
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CharaSprite from '../CharaSprite.vue'
import { FACES } from '../../data/faces'

const props = defineProps({
  cutin: Object, // { type, chara, echo } または { type: 'split', left: {chara, echo}, right: {chara, echo} }
  talking: Boolean,
})

// 画面サイズ（変わったら計算し直す）
const size = ref({ w: window.innerWidth, h: window.innerHeight })
const onResize = () => (size.value = { w: window.innerWidth, h: window.innerHeight })
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

// 帯（パネル）の大きさと、その中で立ち絵をどれだけ拡大してどこに置くかを計算する
function framing(chara, panelW, panelH, mode) {
  const face = FACES[chara]
  if (!face) return {}
  // 両目の幅が、パネルの横幅の何割になるようにするか（目のアップほど大きく）
  const target = mode === 'face' ? 0.24 : 0.46
  const spriteW = (panelW * target) / face.eyeSpan
  const spriteH = spriteW / face.aspect
  const focusY = mode === 'face' ? face.y + 0.035 : face.y // 顔のアップは少し下（鼻のあたり）を中心に
  return {
    height: `${spriteH}px`,
    left: `${panelW / 2 - face.x * spriteW}px`,
    top: `${panelH / 2 - focusY * spriteH}px`,
  }
}

const panels = computed(() => {
  const { w, h } = size.value
  const c = props.cutin
  if (c.type === 'split') {
    const panelW = w / 2
    const panelH = h * 0.42
    return [
      { key: 'left', ...c.left, style: framing(c.left.chara, panelW, panelH, 'eyes') },
      { key: 'right', ...c.right, style: framing(c.right.chara, panelW, panelH, 'eyes') },
    ]
  }
  const panelH = c.type === 'face' ? h * 0.5 : h * 0.26
  return [{ key: 'single', chara: c.chara, echo: c.echo, style: framing(c.chara, w, panelH, c.type) }]
})
</script>

<template>
  <div class="cutin" :class="cutin.type">
    <div class="dim"></div>
    <div class="band">
      <div v-for="(p, i) in panels" :key="p.key" class="panel" :style="{ animationDelay: `${i * 0.12}s` }">
        <div class="push">
          <CharaSprite :name="p.chara" :echo="p.echo" :talking="cutin.type === 'face' && talking" class="giant" :style="p.style" />
        </div>
      </div>
      <span class="edge top"></span>
      <span class="edge bottom"></span>
    </div>
  </div>
</template>

<style scoped>
.cutin {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.dim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  animation: fade 0.35s ease-out both;
}
@keyframes fade { from { opacity: 0; } }

.band {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-58%);
  display: flex;
  height: 26vh;
}
.face .band { height: 50vh; }
.split .band { height: 42vh; }

.panel {
  position: relative;
  flex: 1;
  overflow: hidden;
  background: #05060a;
  /* 横からスッと入ってくる。入る瞬間だけブレ（モーションブラー）をかける */
  animation: slide-in 0.55s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
.split .panel:first-child { clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%); }
.split .panel:last-child { clip-path: polygon(8% 0, 100% 0, 100% 100%, 0 100%); margin-left: -4%; }
.split .panel:last-child { animation-name: slide-in-left; }
@keyframes slide-in {
  from { transform: translateX(30%) skewX(-12deg); filter: blur(14px) brightness(1.8); opacity: 0; }
  to { transform: none; filter: none; opacity: 1; }
}
@keyframes slide-in-left {
  from { transform: translateX(-30%) skewX(12deg); filter: blur(14px) brightness(1.8); opacity: 0; }
  to { transform: none; filter: none; opacity: 1; }
}
/* 帯の中でも、じわじわ寄り続ける */
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
/* 帯のふちのオレンジの線 */
.edge {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #ff8a2a;
  box-shadow: 0 0 12px #ff7b00;
  transform-origin: left;
  animation: edge 0.6s cubic-bezier(0.7, 0, 0.2, 1) both;
}
.edge.top { top: -2px; }
.edge.bottom { bottom: -2px; transform-origin: right; }
@keyframes edge { from { transform: scaleX(0); } }
@media (prefers-reduced-motion: reduce) {
  .panel, .push, .edge, .dim { animation: none; }
}
</style>

<script setup>
// ターゲットロック：キャラの顔に照準が吸いつき、横に「解析データ」が打ち出される（SF の HUD）
// セリフに scan: { name, rows: [[項目, 値, 0〜1のゲージ（省略可）], …], alert } を書くと出る。
// alert: true なら赤い警告表示（存在が不安定なキャラなど）
// 照準の位置は、立ち絵の大きさ（画面の高さの 92%・中央・下ぞろえ）と、faces.js の顔の位置から計算している
import { computed, onMounted } from 'vue'
import { FACES } from '../../data/faces'
import { useSound } from '../../composables/useSound'

const props = defineProps({
  scan: Object,
  chara: String,
})
const { play } = useSound()
onMounted(() => play(props.scan.alert ? 'alarm' : 'lock'))

const layout = computed(() => {
  const W = window.innerWidth
  const H = window.innerHeight
  const face = FACES[props.chara] ?? { x: 0.5, y: 0.2, aspect: 0.5, eyeSpan: 0.3 }
  const spriteH = H * 0.92
  const spriteW = spriteH * face.aspect
  const left = W / 2 - spriteW / 2
  const fx = left + face.x * spriteW
  const fy = H - spriteH + face.y * spriteH
  const box = Math.max(face.eyeSpan * spriteW * 1.7, 90) // 照準の大きさ（顔がおさまるくらい）
  const panelW = Math.min(300, W * 0.4)
  // データの窓は、画面の広いほうに出す
  const panelLeft = Math.min(fx + box * 0.75 + 40, W - panelW - 16)
  return {
    reticle: { left: `${fx - box / 2}px`, top: `${fy - box / 2}px`, width: `${box}px`, height: `${box}px` },
    body: { left: `${left}px`, top: `${fy - box / 2}px`, width: `${spriteW}px`, height: `${H - fy + box / 2}px` },
    panel: { left: `${panelLeft}px`, top: `${Math.max(16, fy - box * 0.9)}px`, width: `${panelW}px` },
    // 照準の右上の角から、データの窓へ引く線
    leader: { x1: fx + box / 2, y1: fy - box / 2, x2: panelLeft, y2: Math.max(16, fy - box * 0.9) + 14 },
  }
})
</script>

<template>
  <div class="scan" :class="{ alert: scan.alert }">
    <!-- 体を上から下へなめる、解析の光 -->
    <div class="body-sweep" :style="layout.body"></div>

    <!-- 照準：4つの角が、大きく開いた位置から顔へ吸いつく -->
    <div class="reticle" :style="layout.reticle">
      <span class="corner tl"></span><span class="corner tr"></span>
      <span class="corner bl"></span><span class="corner br"></span>
      <svg class="ring" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="38" class="dash" />
      </svg>
      <span class="lock">{{ scan.alert ? 'WARNING' : 'LOCK' }}</span>
    </div>

    <svg class="leader">
      <line :x1="layout.leader.x1" :y1="layout.leader.y1" :x2="layout.leader.x2" :y2="layout.leader.y2" />
    </svg>

    <!-- 解析データ：1行ずつ、タイプライターのように打ち出される -->
    <div class="panel" :style="layout.panel">
      <p class="head">{{ scan.alert ? '⚠ ANOMALY DETECTED' : 'TARGET ANALYSIS' }}</p>
      <p class="name">{{ scan.name }}</p>
      <div v-for="(row, i) in scan.rows" :key="i" class="row" :style="{ animationDelay: `${0.75 + i * 0.22}s` }">
        <span class="label">{{ row[0] }}</span>
        <span class="value">{{ row[1] }}</span>
        <span v-if="row[2] !== undefined" class="gauge"><i :style="{ '--to': row[2], animationDelay: `${0.9 + i * 0.22}s` }"></i></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scan {
  --c: #6dfff0;
  --glow: rgba(80, 255, 230, 0.6);
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  font-family: 'Share Tech Mono', monospace;
}
.scan.alert {
  --c: #ff4d6a;
  --glow: rgba(255, 60, 90, 0.65);
}
/* 体をなめる光：上から下へ1回 */
.body-sweep {
  position: absolute;
  overflow: hidden;
}
.body-sweep::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--c);
  box-shadow: 0 0 16px 4px var(--glow);
  animation: sweep 1.1s ease-in-out 0.2s both;
}
@keyframes sweep {
  from { top: 0; opacity: 1; }
  to { top: 100%; opacity: 0.2; }
}

.reticle {
  position: absolute;
  animation: snap 0.5s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes snap {
  from { transform: scale(2.6) rotate(45deg); opacity: 0; }
  70% { transform: scale(0.94); opacity: 1; }
  to { transform: none; }
}
.corner {
  position: absolute;
  width: 22%;
  height: 22%;
  border: 0 solid var(--c);
  filter: drop-shadow(0 0 4px var(--glow));
}
.tl { top: 0; left: 0; border-top-width: 3px; border-left-width: 3px; }
.tr { top: 0; right: 0; border-top-width: 3px; border-right-width: 3px; }
.bl { bottom: 0; left: 0; border-bottom-width: 3px; border-left-width: 3px; }
.br { bottom: 0; right: 0; border-bottom-width: 3px; border-right-width: 3px; }
.ring {
  position: absolute;
  inset: 12%;
  fill: none;
  stroke: var(--c);
  stroke-width: 0.8;
  opacity: 0.7;
  animation: spin 6s linear infinite;
}
.ring .dash { stroke-dasharray: 4 6; stroke-width: 1.6; }
@keyframes spin { to { transform: rotate(360deg); } }
.lock {
  position: absolute;
  left: 0;
  bottom: -1.6em;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: var(--c);
  text-shadow: 0 0 6px var(--glow);
  animation: blink 0.35s steps(2) 3 0.45s both;
}
@keyframes blink { 50% { opacity: 0; } }

.leader {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.leader line {
  stroke: var(--c);
  stroke-width: 1;
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  filter: drop-shadow(0 0 3px var(--glow));
  animation: draw 0.4s ease-out 0.45s forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }

.panel {
  position: absolute;
  padding: 10px 14px 12px;
  box-sizing: border-box;
  color: var(--c);
  background: linear-gradient(135deg, rgba(5, 30, 40, 0.72), rgba(5, 15, 25, 0.5));
  border: 1px solid var(--c);
  border-left-width: 4px;
  box-shadow: 0 0 18px var(--glow), inset 0 0 20px rgba(80, 255, 230, 0.08);
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
  animation: panel-in 0.4s cubic-bezier(0.2, 0.9, 0.2, 1) 0.6s both;
}
@keyframes panel-in {
  from { transform: scaleY(0.02) scaleX(0.4); opacity: 0; }
  50% { transform: scaleY(0.02) scaleX(1); opacity: 1; }
}
.head {
  margin: 0;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  opacity: 0.8;
}
.alert .head { animation: blink 0.6s steps(2) infinite; }
.name {
  margin: 4px 0 8px;
  font-size: 1.15rem;
  letter-spacing: 0.12em;
  color: #fff;
  text-shadow: 0 0 8px var(--glow);
}
/* 1行ずつ、左から右へ打ち出す（clip-path で、見える幅を段階的に広げる） */
.row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2px 10px;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  padding: 2px 0;
  border-top: 1px dashed rgba(109, 255, 240, 0.2);
  animation: type 0.4s steps(14) both;
}
@keyframes type { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
.label { opacity: 0.65; }
.value { color: #fff; }
.gauge {
  grid-column: 1 / -1;
  height: 4px;
  background: rgba(109, 255, 240, 0.15);
}
.gauge i {
  display: block;
  height: 100%;
  background: var(--c);
  box-shadow: 0 0 6px var(--glow);
  transform-origin: left;
  transform: scaleX(var(--to));
  animation: gauge 0.8s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes gauge { from { transform: scaleX(0); } }
@media (prefers-reduced-motion: reduce) {
  .scan * { animation-duration: 0.01s !important; animation-iteration-count: 1 !important; }
}
</style>

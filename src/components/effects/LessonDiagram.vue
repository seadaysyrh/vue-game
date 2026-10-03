<script setup>
// 技術説明モードの図解：空中にホログラムの図が浮かぶ
// セリフに diagram: 'tree' や diagram: { type: 'tree', focus: 'MessageBox' } を書くと出る。
//   type  : どの図を出すか（data/diagrams.js の DIAGRAMS のキー）
//   focus : 図の中で光らせる箱・矢印の id（ほかは暗くなる）
// 同じ type が続くあいだは、図を出したまま focus だけが移っていく（GameView で :key を type にしている）
// 'reactive' と 'directive' の図は、中で本物の ref を動かして、値が変わると図も変わる様子を見せる
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { DIAGRAMS } from '../../data/diagrams'

const props = defineProps({
  diagram: [String, Object],
})
const type = computed(() => (typeof props.diagram === 'string' ? props.diagram : props.diagram.type))
const focus = computed(() => (typeof props.diagram === 'string' ? null : props.diagram.focus))

const data = computed(() => DIAGRAMS[type.value])
const isOn = (id) => !focus.value || focus.value === id
// 箱の中の文字の大きさ：箱の幅に合わせて小さくする（長い名前がはみ出さないように）
const labelSize = (n) => Math.min(13, (n.w - 10) / (n.label.length * 0.6))

// ===== 動く図：本物の ref を動かす =====
// 'reactive'：数（ref）が1ずつ増えると、画面の文字も1つずつ増える
const SAMPLE = 'こんにちはなのだ！'
const count = ref(0)
const typing = computed(() => count.value < SAMPLE.length) // computed：count から計算する
// 'directive'：choosing（v-if）が切り替わり、選択肢の数（v-for）が増えていく
const choosing = ref(true)
const items = ref(1)

let timer = null
let tickNo = 0
function tick() {
  tickNo++
  count.value = count.value >= SAMPLE.length + 6 ? 0 : count.value + 1 // 最後まで出したら少し待って、最初から
  if (tickNo % 8 === 0) choosing.value = !choosing.value
  if (tickNo % 6 === 0) items.value = (items.value % 4) + 1
}
onMounted(() => (timer = setInterval(tick, 220)))
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="diagram-wrap">
    <div class="diagram">
      <header><span>DIAGRAM</span><span>{{ data.title }}</span></header>
      <svg viewBox="0 0 400 250" role="img" :aria-label="data.title">
        <defs>
          <marker id="lesson-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
          </marker>
        </defs>

        <!-- 矢印：線が引かれていくように出る -->
        <!-- plain：矢印の先を付けない線　dashed：点線（シーケンス図の縦の線など） -->
        <g v-for="(e, i) in data.edges" :key="`e${i}`" class="edge" :class="{ on: focus === e.id, dim: !isOn(e.id), dashed: e.dashed }" :style="{ '--i': i }">
          <path :d="e.d" :pathLength="e.dashed ? null : 1" :marker-end="e.plain ? null : 'url(#lesson-arrow)'" :marker-start="e.both ? 'url(#lesson-arrow)' : null" />
          <text v-if="e.label" :x="e.lx" :y="e.ly" :text-anchor="e.anchor ?? 'start'" class="edge-label">{{ e.label }}</text>
        </g>

        <!-- ===== 光の点：データの流れ（pulse のある図だけ）。箱より先に描いて、箱の後ろを通るようにする ===== -->
        <circle v-if="data.pulse" :key="`p-${type}`" r="4.5" class="letter">
          <animateMotion :dur="data.pulse.dur" repeatCount="indefinite" :path="data.pulse.path" />
        </circle>

        <!-- 箱：ひとつずつ浮かび上がる -->
        <g v-for="(n, i) in data.nodes" :key="`n${i}`" class="node" :class="{ on: focus === n.id, dim: !isOn(n.id) }" :style="{ '--i': i }">
          <rect :x="n.x" :y="n.y" :width="n.w" :height="n.h" rx="4" :class="{ dashed: n.dashed }" />
          <text :x="n.x + n.w / 2" :y="n.top ? n.y + 18 : n.bottom ? n.y + n.h - 12 : n.y + (n.sub ? n.h / 2 - 2 : n.h / 2 + 4)" class="label" :class="{ mono: n.mono }" :font-size="labelSize(n)">{{ n.label }}</text>
          <text v-if="n.sub" :x="n.x + n.w / 2" :y="n.y + n.h / 2 + 13" class="sub">{{ n.sub }}</text>
        </g>

        <!-- ===== 動く図：ref と computed ===== -->
        <template v-if="type === 'reactive'">
          <text x="70" y="70" class="live">= {{ count > SAMPLE.length ? SAMPLE.length : count }}</text>
          <text x="70" y="216" class="live" :class="{ off: !typing }">= {{ typing }}</text>
          <text x="226" y="122" class="screen-text">{{ SAMPLE.slice(0, count) }}<tspan v-if="typing" class="caret">▌</tspan></text>
          <text v-if="!typing" x="380" y="172" text-anchor="end" class="live">▼</text>
        </template>

        <!-- ===== 動く図：v-if と v-for ===== -->
        <template v-if="type === 'directive'">
          <text x="98" y="22" class="live" :class="{ off: !choosing }">choosing = {{ choosing }}</text>
          <Transition name="pop">
            <g v-if="choosing" class="node item">
              <rect x="28" y="116" width="140" height="40" rx="4" />
              <text x="98" y="141" class="label" font-size="12">ChoiceList</text>
            </g>
          </Transition>
          <text v-if="!choosing" x="98" y="141" class="ghost-text">（出さない）</text>
          <text x="302" y="22" class="live">choices の数 = {{ items }}</text>
          <TransitionGroup name="pop" tag="g">
            <g v-for="k in items" :key="k" class="node item">
              <rect x="232" :y="112 + (k - 1) * 34" width="140" height="28" rx="4" />
              <text x="302" :y="131 + (k - 1) * 34" class="label" font-size="11">選択肢 {{ k }}</text>
            </g>
          </TransitionGroup>
        </template>

        <!-- ===== 動く図：props と emit（お手紙が行き来する） ===== -->
        <template v-if="type === 'props'">
          <circle v-if="focus !== 'emit'" r="5" class="letter">
            <animateMotion dur="1.6s" repeatCount="indefinite" path="M168 62 L168 188" />
          </circle>
          <circle v-if="focus !== 'props'" r="5" class="letter up">
            <animateMotion dur="1.6s" begin="0.8s" repeatCount="indefinite" path="M232 188 L232 62" />
          </circle>
        </template>

      </svg>
    </div>
  </div>
</template>

<style scoped>
.diagram-wrap {
  position: absolute;
  top: 11%;
  right: 3%;
  z-index: 1;
  pointer-events: none;
  perspective: 1000px;
}
.diagram {
  width: min(500px, 46vw);
  padding: 8px 12px 10px;
  box-sizing: border-box;
  color: #8ffff2;
  background:
    repeating-linear-gradient(transparent 0 2px, rgba(120, 255, 240, 0.05) 2px 3px),
    linear-gradient(200deg, rgba(12, 60, 76, 0.82), rgba(4, 22, 34, 0.78));
  border: 1px solid rgba(110, 255, 240, 0.7);
  box-shadow: 0 0 24px rgba(80, 255, 230, 0.3), inset 0 0 30px rgba(80, 255, 230, 0.1);
  backdrop-filter: blur(3px);
  /* 端末（左）と向かい合うように、反対向きに傾ける */
  transform: rotateY(-16deg) rotateX(4deg);
  transform-origin: right center;
  animation: power-on 0.5s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes power-on {
  from { transform: rotateY(-16deg) rotateX(4deg) scaleY(0.01) scaleX(0.3); filter: brightness(3); }
  50% { transform: rotateY(-16deg) rotateX(4deg) scaleY(0.01) scaleX(1); }
}
header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
  padding-bottom: 4px;
  font-family: 'Share Tech Mono', 'Zen Kaku Gothic New', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.15em;
  border-bottom: 1px solid rgba(110, 255, 240, 0.4);
}
header span:first-child { opacity: 0.7; }
svg {
  display: block;
  width: 100%;
  overflow: visible;
}

/* ===== 箱 ===== */
.node {
  animation: node-in 0.45s ease-out both;
  animation-delay: calc(0.35s + var(--i) * 0.12s);
  transition: opacity 0.4s;
}
.node rect {
  fill: rgba(10, 40, 50, 0.75);
  stroke: rgba(110, 255, 240, 0.8);
  stroke-width: 1;
  transition: fill 0.4s, stroke 0.4s;
}
.node rect.dashed { stroke-dasharray: 5 4; fill: rgba(10, 40, 50, 0.35); }
.label {
  fill: #e8fffb;
  text-anchor: middle;
  font-weight: 700;
}
.label.mono { font-family: 'Share Tech Mono', monospace; }
.sub {
  fill: #8ffff2;
  font-size: 9.5px;
  text-anchor: middle;
  opacity: 0.85;
}
/* 光らせる箱（focus）はオレンジに、ほかは暗く */
.node.on rect {
  fill: rgba(80, 40, 10, 0.8);
  stroke: #ffb066;
  stroke-width: 1.6;
  filter: drop-shadow(0 0 6px rgba(255, 140, 40, 0.9));
}
.node.on .sub { fill: #ffd2a1; }
.dim { opacity: 0.45; }
@keyframes node-in {
  from { opacity: 0; transform: translateY(6px); }
}

/* ===== 矢印 ===== */
.edge {
  color: rgba(143, 255, 242, 0.85);
  transition: opacity 0.4s;
}
.edge path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.3;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 0.6s ease-out forwards;
  animation-delay: calc(0.6s + var(--i) * 0.15s);
}
.edge.on { color: #ffb066; }
.edge.on path {
  stroke-width: 2;
  filter: drop-shadow(0 0 4px rgba(255, 140, 40, 0.9));
}
.edge-label {
  fill: currentColor;
  font-size: 10px;
  font-weight: 700;
  /* 線の上に重なっても読めるように、文字のふちを背景の色でかこむ */
  paint-order: stroke;
  stroke: rgba(6, 26, 36, 0.95);
  stroke-width: 3px;
  stroke-linejoin: round;
}
/* 点線は、線を引くアニメーションをせずに、うっすら出す */
.edge.dashed path {
  stroke-dasharray: 4 5;
  stroke-dashoffset: 0;
  animation: none;
  opacity: 0.5;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}

/* ===== 動く図 ===== */
.live {
  fill: #ffd166;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  text-anchor: middle;
}
.live.off { fill: #ff8aa0; }
.screen-text {
  fill: #fff;
  font-size: 15px;
  font-weight: 700;
}
.caret { animation: blink 0.5s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.ghost-text {
  fill: rgba(143, 255, 242, 0.45);
  font-size: 11px;
  text-anchor: middle;
}
.letter {
  fill: #ffd166;
  filter: drop-shadow(0 0 4px #ff9a3c);
}
.letter.up { fill: #8ffff2; filter: drop-shadow(0 0 4px #05d9e8); }
.item { animation: none; }
.pop-enter-active, .pop-leave-active { transition: opacity 0.3s, transform 0.3s; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateX(10px); }

/* スマホ：画面の上に横いっぱいで出す（傾けない） */
@media (max-width: 640px) {
  .diagram-wrap { top: 76px; left: 12px; right: 12px; perspective: none; }
  .diagram { width: 100%; transform: none; animation: none; }
}
@media (prefers-reduced-motion: reduce) {
  .diagram, .node, .edge path { animation: none; stroke-dashoffset: 0; }
}
</style>

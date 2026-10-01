<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { scenes, endings } from '../data/scenario'
import { routeTree } from '../data/routeTree'
import RouteCapture from '../components/RouteCapture.vue'
import NixieMeter from '../components/NixieMeter.vue'
import { useMusic } from '../composables/useMusic'

const router = useRouter()
const game = useGameStore()
useMusic().playMusic('night')

// ===== 1. 木を画面上の位置に並べる =====
const ROW_H = 84                     // 1行（エンディング1つぶん）の高さ
const COL_W = [170, 170, 170, 230]   // 列ごとのカードの幅（最後の列はエンディング）
const GAP = 80                       // 列と列のすき間（ここに線を引く）

// 列の左端の x 座標
function colX(col) {
  let x = 0
  for (let i = 0; i < col; i++) x += COL_W[i] + GAP
  return x
}

// そのノードの先にあるエンディングの数（＝縦に何行ぶん使うか）
function countLeaves(node) {
  if (node.children.length === 0) return 1
  return node.children.reduce((sum, child) => sum + countLeaves(child), 0)
}

const nodes = []
const edges = []
function place(node, col, rowStart, parent) {
  const rows = countLeaves(node)
  const item = { ...node, col, x: colX(col), y: (rowStart + rows / 2) * ROW_H }
  nodes.push(item)
  if (parent) edges.push({ from: parent, to: item })
  let row = rowStart
  for (const child of node.children) {
    place(child, col + 1, row, item)
    row += countLeaves(child)
  }
}
place(routeTree, 0, 0, null)

const WIDTH = colX(COL_W.length - 1) + COL_W[COL_W.length - 1]
const HEIGHT = countLeaves(routeTree) * ROW_H

// 線の形：親の右端から子の左端へ、なめらかな S 字カーブ（ベジェ曲線）
function edgePath({ from, to }) {
  const x1 = from.x + COL_W[from.col]
  const x2 = to.x
  const mid = (x1 + x2) / 2
  return `M ${x1} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${x2} ${to.y}`
}

// ===== 2. 通ったかどうか =====
const visitedSet = computed(() => new Set(game.visited))
const isVisited = (key) => visitedSet.value.has(key)
// 直前に遊んだルート上か（今回の path の途中までと一致するか）
const isOnPath = (key) => isVisited(game.path) && game.path.startsWith(key)

const foundEndings = computed(() => {
  const found = new Set(nodes.filter((n) => n.type === 'ending' && isVisited(n.key)).map((n) => n.ending))
  return found.size
})

// ===== 3. キャプチャに出す絵 =====
function captureOf(node) {
  if (node.type === 'ending') {
    const e = endings[node.ending]
    return { bg: e.bg, chara: e.chara, echo: e.echo, still: e.still }
  }
  const scene = scenes[node.sceneId]
  const last = scene.lines[scene.lines.length - 1] // 選択肢が出ている瞬間の絵
  return { bg: scene.bg, chara: last.chara, echo: last.echo, still: last.still }
}

function titleOf(node) {
  if (node.type === 'ending') {
    const e = endings[node.ending]
    return `${e.label}「${e.name}」`
  }
  return scenes[node.sceneId].title
}

// カードに出す短い名前（エンディングは名前だけ）
function shortTitleOf(node) {
  return node.type === 'ending' ? endings[node.ending].name : scenes[node.sceneId].title
}

const TOTAL_ENDINGS = Object.keys(endings).length

// ===== 4. 選んだノードの詳しい説明 =====
const selectedKey = ref(isVisited(game.path) ? game.path : '')
const selected = computed(() => nodes.find((n) => n.key === selectedKey.value))

// ルートの最初から、そのノードまでに選んだ選択肢を集める
const choicesTo = computed(() =>
  nodes.filter((n) => n.key && selectedKey.value.startsWith(n.key)).map((n) => n.choiceText),
)

const detailText = computed(() => {
  const n = selected.value
  if (!isVisited(n.key)) return 'まだ観測されていない世界線。ひとつ手前の分かれ道で、別の選択肢を選んでみよう。'
  return n.type === 'ending' ? endings[n.ending].text : scenes[n.sceneId].summary
})

function resume() {
  game.jumpTo(selected.value)
  router.push('/game')
}
</script>

<template>
  <div class="route">
    <header>
      <div>
        <p class="eyebrow">WORLDLINE DIVERGENCE MAP</p>
        <h1>世界線分岐図</h1>
      </div>
      <div class="found">
        <span>ENDINGS</span>
        <NixieMeter :value="`${foundEndings}/${TOTAL_ENDINGS}`" />
      </div>
    </header>

    <!-- ===== 樹形図 ===== -->
    <div class="tree-scroll">
      <div class="tree" :style="{ width: `${WIDTH}px`, height: `${HEIGHT}px` }">
        <!-- 線は SVG で引く。カードの後ろに置く -->
        <svg :width="WIDTH" :height="HEIGHT" class="edges" aria-hidden="true">
          <path
            v-for="(edge, i) in edges"
            :key="i"
            :d="edgePath(edge)"
            class="edge"
            :class="{ lit: isVisited(edge.to.key), current: isOnPath(edge.to.key) }"
            :style="{ animationDelay: `${edge.to.col * 0.25}s` }"
          />
        </svg>

        <!-- カード。v-for で全ノードを並べ、位置は style で指定する -->
        <button
          v-for="node in nodes"
          :key="node.key"
          class="node"
          :class="[node.type, { visited: isVisited(node.key), current: isOnPath(node.key), selected: node.key === selectedKey }]"
          :style="{ left: `${node.x}px`, top: `${node.y}px`, width: `${COL_W[node.col]}px`, animationDelay: `${node.col * 0.25}s` }"
          @click="selectedKey = node.key"
        >
          <RouteCapture v-bind="captureOf(node)" :visible="isVisited(node.key)" />
          <span class="info">
            <span class="node-title">{{ isVisited(node.key) ? shortTitleOf(node) : '???' }}</span>
            <span v-if="node.choiceText" class="node-choice">{{ isVisited(node.key) ? node.choiceText : '――――' }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- ===== 選んだノードの説明 ===== -->
    <section v-if="selected" class="detail">
      <RouteCapture class="detail-capture" v-bind="captureOf(selected)" :visible="isVisited(selected.key)" />
      <div class="detail-body">
        <p class="eyebrow">{{ selected.type === 'ending' ? 'ENDING' : 'DIVERGENCE POINT' }} · 選択 {{ selected.key.length }}/3</p>
        <h2>{{ isVisited(selected.key) ? titleOf(selected) : '???' }}</h2>
        <p>{{ detailText }}</p>

        <ol v-if="isVisited(selected.key) && choicesTo.length" class="trail">
          <li v-for="text in choicesTo" :key="text">{{ text }}</li>
        </ol>

        <div class="actions">
          <button v-if="selected.type === 'choice' && isVisited(selected.key)" @click="resume">ここから再開</button>
          <RouterLink v-if="selected.type === 'ending' && isVisited(selected.key)" :to="`/ending/${selected.ending}`" class="link">エンディングを見る</RouterLink>
          <RouterLink to="/" class="link">TITLE</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.route {
  min-height: 100vh;
  padding: 32px 20px 48px;
  box-sizing: border-box;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(255, 123, 0, 0.12), transparent 50%),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px) 0 0 / 100% 28px,
    #070910;
}
header {
  max-width: 980px;
  margin: 0 auto 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}
.eyebrow {
  margin: 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: #ff9a3c;
}
h1 {
  margin: 4px 0 0;
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  letter-spacing: 0.12em;
}
.found {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #ff9a3c;
}

/* ===== 樹形図 ===== */
.tree-scroll {
  overflow-x: auto; /* 画面が狭いときは横にスクロール */
  padding: 8px 0 16px;
}
.tree {
  position: relative;
  margin: 0 auto;
}
.edges {
  position: absolute;
  inset: 0;
  overflow: visible;
}
.edge {
  fill: none;
  stroke: #2a3142;
  stroke-width: 2;
  stroke-dasharray: 4 6;
}
/* 通った線：オレンジに光る。線を引くアニメーション付き */
.edge.lit {
  stroke: #b8621c;
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: draw 0.9s ease-out forwards;
}
/* 直前に遊んだルート：太く明るく */
.edge.current {
  stroke: #ffb066;
  stroke-width: 3;
  filter: drop-shadow(0 0 6px #ff7b00);
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.node {
  position: absolute;
  transform: translateY(-50%); /* top をカードの縦の中心にそろえる */
  display: grid;
  gap: 6px;
  padding: 6px;
  border: 1px solid #262d3d;
  border-radius: 4px;
  background: rgba(12, 15, 24, 0.92);
  color: inherit;
  text-align: left;
  cursor: pointer;
  animation: appear 0.5s ease-out both;
}
.node:hover,
.node:focus-visible {
  border-color: #ff9a3c;
  box-shadow: none;
}
.node.current {
  border-color: #b8621c;
}
.node.selected {
  border-color: #ffb066;
  box-shadow: 0 0 0 1px #ffb066, 0 0 22px rgba(255, 123, 0, 0.45);
}
/* エンディングは横長：左にキャプチャ、右に文字 */
.node.ending {
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: center;
}
.info {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.node-title {
  font-size: 0.85rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.node-choice {
  font-size: 0.72rem;
  color: #9aa2b4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.node:not(.visited) .node-title {
  font-family: 'Share Tech Mono', monospace;
  color: #5d6577;
}
@keyframes appear {
  from { opacity: 0; transform: translate(-12px, -50%); }
  to { opacity: 1; transform: translate(0, -50%); }
}

/* ===== 説明パネル ===== */
.detail {
  max-width: 980px;
  margin: 16px auto 0;
  display: grid;
  grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
  gap: 24px;
  padding: 20px;
  border-left: 4px solid #ff7b00;
  background: rgba(8, 10, 20, 0.88);
}
.detail-capture {
  border: 1px solid #262d3d;
}
.detail-body {
  display: grid;
  gap: 10px;
  align-content: start;
  min-width: 0;
}
h2 {
  margin: 0;
  font-size: 1.4rem;
  letter-spacing: 0.06em;
}
.detail-body p {
  margin: 0;
  line-height: 1.8;
}
.trail {
  margin: 0;
  padding-left: 1.4em;
  color: #9aa2b4;
  font-size: 0.9rem;
}
.trail li::marker {
  font-family: 'Share Tech Mono', monospace;
  color: #ff9a3c;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  margin-top: 6px;
}
.link {
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.15em;
  color: #ffd166;
}

@media (max-width: 720px) {
  .detail { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .node, .edge.lit { animation: none; stroke-dashoffset: 0; }
}
</style>

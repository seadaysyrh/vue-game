<script setup>
// チャプターカード：章の始まりに出る、モーショングラフィックスのタイトル画面
//   番号がパラパラ回って止まる → 線が走る → 題名が1文字ずつ切り出される → 横の帯に割れて消える
// クリックでスキップできる。終わったら 'end' を親に知らせる
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  chapter: Object, // { no: '01', title: 'リライター', sub: 'OBSERVED 0.409431' }
})
const emit = defineEmits(['end'])

const shownNo = ref('00')
const leaving = ref(false)
const timers = []

onMounted(() => {
  // 番号を 0.6 秒だけランダムに回してから、本当の番号で止める
  const roll = setInterval(() => {
    shownNo.value = String(Math.floor(Math.random() * 100)).padStart(2, '0')
  }, 50)
  timers.push(roll)
  timers.push(setTimeout(() => {
    clearInterval(roll)
    shownNo.value = props.chapter.no
  }, 650))
  timers.push(setTimeout(() => (leaving.value = true), 3100))
  timers.push(setTimeout(() => emit('end'), 3800))
})

onUnmounted(() => timers.forEach((t) => clearTimeout(t) || clearInterval(t)))

function skip() {
  emit('end')
}
</script>

<template>
  <div class="chapter" :class="{ leaving }" @click.stop="skip">
    <div class="grid"></div>

    <!-- 回転する観測リング（SVG）。目盛りは v-for で並べる -->
    <svg class="ring" viewBox="-100 -100 200 200" aria-hidden="true">
      <circle r="88" class="r1" />
      <circle r="72" class="r2" />
      <line v-for="i in 60" :key="i" :x1="0" :y1="-92" :x2="0" :y2="i % 5 === 0 ? -100 : -96" :transform="`rotate(${i * 6})`" />
    </svg>

    <div class="line l1"></div>
    <div class="line l2"></div>

    <div class="content">
      <div class="no">
        <span class="label">CHAPTER</span>
        <span class="num">{{ shownNo }}</span>
      </div>
      <h2 class="title">
        <!-- 1文字ずつずらして、下から切り出すように出す -->
        <span v-for="(ch, i) in chapter.title" :key="i" :style="{ animationDelay: `${0.7 + i * 0.07}s` }">{{ ch }}</span>
      </h2>
      <p class="sub">{{ chapter.sub }}</p>
    </div>

    <!-- 消えるとき：横の帯が順番に縮んで、ゲーム画面が見えてくる -->
    <div class="shutters">
      <span v-for="i in 8" :key="i" :style="{ transitionDelay: `${i * 0.04}s` }"></span>
    </div>
  </div>
</template>

<style scoped>
.chapter {
  position: absolute;
  inset: 0;
  z-index: 9;
  overflow: hidden;
  cursor: pointer;
  color: #fff;
}
/* 背景は「帯」に任せる（消えるときに帯ごと縮むので） */
.shutters {
  position: absolute;
  inset: 0;
  z-index: -1;
  display: grid;
  grid-template-rows: repeat(8, 1fr);
}
.shutters span {
  background: #06070c;
  transform-origin: 0 50%;
  transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
}
.leaving .shutters span {
  transform: scaleX(0);
}
.leaving .grid,
.leaving .ring,
.leaving .line,
.leaving .content {
  opacity: 0;
  transition: opacity 0.25s;
}
.grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(255, 138, 42, 0.07) 1px, transparent 1px) 0 0 / 48px 48px,
    linear-gradient(90deg, rgba(255, 138, 42, 0.07) 1px, transparent 1px) 0 0 / 48px 48px;
  animation: grid-move 4s linear infinite;
}
@keyframes grid-move {
  to { background-position: 48px 48px, 48px 48px; }
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(80vmin, 640px);
  transform: translate(-50%, -50%);
  animation: ring-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) both, spin 18s linear infinite;
}
.ring circle {
  fill: none;
  stroke: rgba(255, 138, 42, 0.5);
}
.ring .r1 { stroke-width: 0.6; stroke-dasharray: 4 3; }
.ring .r2 { stroke-width: 0.3; }
.ring line {
  stroke: rgba(255, 180, 110, 0.6);
  stroke-width: 0.6;
}
@keyframes ring-in {
  from { opacity: 0; scale: 0.6; }
  to { opacity: 1; scale: 1; }
}
@keyframes spin {
  to { rotate: 360deg; }
}

/* 画面を横切る光の線 */
.line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ff8a2a, transparent);
  box-shadow: 0 0 12px #ff8a2a;
  transform: scaleX(0);
  animation: line 1.1s cubic-bezier(0.7, 0, 0.2, 1) forwards;
}
.l1 { top: 38%; animation-delay: 0.3s; }
.l2 { top: 64%; animation-delay: 0.45s; transform-origin: 100% 50%; }
@keyframes line {
  to { transform: scaleX(1); }
}

.content {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 10px;
  text-align: center;
}
.no {
  display: flex;
  align-items: baseline;
  gap: 14px;
  font-family: 'Share Tech Mono', monospace;
  animation: fade-up 0.6s ease-out both;
}
.label {
  font-size: 0.9rem;
  letter-spacing: 0.5em;
  color: #ff9a3c;
}
.num {
  font-size: clamp(3rem, 10vw, 6rem);
  line-height: 1;
  color: #ffb066;
  text-shadow: 0 0 6px #ff7b00, 0 0 24px #ff5500;
  font-variant-numeric: tabular-nums;
}
.title {
  margin: 0;
  font-size: clamp(2rem, 7vw, 4.2rem);
  font-weight: 900;
  letter-spacing: 0.2em;
  overflow: hidden; /* 下から出てくる文字を、枠の外では隠す */
  padding-bottom: 0.1em;
}
.title span {
  display: inline-block;
  animation: slice-in 0.7s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes slice-in {
  from { transform: translateY(110%) skewY(8deg); opacity: 0; }
  to { transform: translateY(0) skewY(0); opacity: 1; }
}
.sub {
  margin: 4px 0 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.4em;
  color: #9aa2b4;
  animation: fade-up 0.6s ease-out 1.4s both;
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
}
@media (prefers-reduced-motion: reduce) {
  .ring, .grid, .line, .title span, .no, .sub { animation: none; transform: none; }
}
</style>

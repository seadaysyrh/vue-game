<script setup>
// SF の HUD（ヘッドアップディスプレイ）：観測装置のカメラ越しに見ているような画面の飾り
//   ・四隅の照準枠（場面が変わるたびに外から締まってくる）
//   ・撮影中のタイムコード（場所テロップの時刻から、時間が進んでいく）
//   ・画面の左端を流れ続けるデータ
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  sceneId: String,
  time: String,    // '19:24' のような場面の時刻
  meter: String,   // 観測値
  hidden: Boolean, // ムービー中などは隠す
})

// ===== タイムコード（時:分:秒:フレーム） =====
const elapsed = ref(0) // 場面が始まってからの経過フレーム数（1秒 = 24フレーム）
let timer = null
onMounted(() => {
  timer = setInterval(() => elapsed.value++, 1000 / 24)
})
onUnmounted(() => clearInterval(timer))
watch(() => props.sceneId, () => (elapsed.value = 0))

const timecode = computed(() => {
  const [h, m] = (props.time ?? '00:00').split(':').map(Number)
  const totalSec = h * 3600 + m * 60 + Math.floor(elapsed.value / 24)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(totalSec / 3600) % 24)}:${pad(Math.floor(totalSec / 60) % 60)}:${pad(totalSec % 60)}:${pad(elapsed.value % 24)}`
})

// ===== 左端を流れるデータ（それっぽい16進数の行） =====
const dataLines = Array.from({ length: 40 }, () =>
  Array.from({ length: 4 }, () => Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')).join(' '),
)
</script>

<template>
  <div class="hud-frame" :class="{ hidden }">
    <!-- :key を場面の ID にすると、場面が変わるたびに枠のアニメーションが最初からやり直しになる -->
    <div :key="sceneId" class="corners">
      <span class="corner tl"></span>
      <span class="corner tr"></span>
      <span class="corner bl"></span>
      <span class="corner br"></span>
    </div>

    <div class="rec"><i></i>REC <b>{{ timecode }}</b></div>

    <div class="stream">
      <div class="stream-inner">
        <span v-for="(line, i) in dataLines" :key="i">{{ line }}</span>
        <span v-for="(line, i) in dataLines" :key="`b${i}`">{{ line }}</span>
      </div>
    </div>

    <div class="coord">WL {{ meter }} ／ OBS-02</div>
  </div>
</template>

<style scoped>
.hud-frame {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  font-family: 'Share Tech Mono', monospace;
  color: rgba(255, 190, 130, 0.75);
  transition: opacity 0.4s;
}
.hud-frame.hidden {
  opacity: 0;
}

/* ===== 四隅の照準枠 ===== */
.corner {
  position: absolute;
  width: 34px;
  height: 34px;
  border-color: rgba(255, 160, 80, 0.8);
  border-style: solid;
  border-width: 0;
  filter: drop-shadow(0 0 4px rgba(255, 123, 0, 0.8));
  animation: lock 0.7s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
.tl { top: 14px; left: 14px; border-top-width: 2px; border-left-width: 2px; --from: translate(-40px, -40px); }
.tr { top: 14px; right: 14px; border-top-width: 2px; border-right-width: 2px; --from: translate(40px, -40px); }
.bl { bottom: 14px; left: 14px; border-bottom-width: 2px; border-left-width: 2px; --from: translate(-40px, 40px); }
.br { bottom: 14px; right: 14px; border-bottom-width: 2px; border-right-width: 2px; --from: translate(40px, 40px); }
@keyframes lock {
  0% { transform: var(--from) scale(2); opacity: 0; }
  60% { transform: none; opacity: 1; }
  70% { opacity: 0.3; }
  80% { opacity: 1; }
}

/* ===== REC とタイムコード ===== */
.rec {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
}
.rec i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff3b3b;
  box-shadow: 0 0 8px #ff3b3b;
  animation: blink 1s steps(2) infinite;
}
.rec b {
  font-weight: normal;
  color: rgba(255, 220, 190, 0.9);
  font-variant-numeric: tabular-nums;
}
@keyframes blink { 50% { opacity: 0.15; } }

/* ===== 左端のデータの流れ ===== */
.stream {
  position: absolute;
  top: 70px;
  bottom: 190px;
  left: 18px;
  width: 140px;
  overflow: hidden;
  font-size: 0.6rem;
  line-height: 1.6;
  opacity: 0.35;
  mask-image: linear-gradient(transparent, #000 20%, #000 80%, transparent);
}
.stream-inner {
  display: grid;
  animation: scroll 24s linear infinite;
}
@keyframes scroll {
  to { transform: translateY(-50%); }
}

.coord {
  position: absolute;
  bottom: 18px;
  right: 60px;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  opacity: 0.6;
}
@media (prefers-reduced-motion: reduce) {
  .corner, .stream-inner, .rec i { animation: none; }
}
</style>

<script setup>
// 調査パート：背景の気になる場所をクリックして調べる。
// 手がかり（clue: true の場所）を need 個見つけたら、調査完了。
//
// 背景は object-fit: cover で画面いっぱいに切り抜かれ、さらに視差やカメラで動いているので、
// その上に「画面の◯%」で印を置くとずれてしまう。
// そこで、調査中は止まった背景をもう1枚、16:9 の箱に入れて重ね、印もその箱の中に「絵の◯%」で置く。
// 箱は画面に「全部収まる」大きさにする（正方形に近い画面でも、端の調べる場所が切れないように）
import { ref, computed } from 'vue'
import { useSound } from '../composables/useSound'
const BASE = import.meta.env.BASE_URL // 置き場所のフォルダ（GitHub Pages では /リポジトリ名/）。画像の場所はここから始める

const props = defineProps({
  bg: String, // 背景の名前
  investigate: Object, // { need, hotspots: [{ id, x, y, w, h, label, text, clue }] }
})
const emit = defineEmits(['done'])
const { play } = useSound()

const found = ref(new Set()) // 調べた場所の id
const message = ref('') // いま表示している調べた結果
const messageKey = ref(0) // 文章のアニメーションをやり直すための番号

const clues = computed(() => props.investigate.hotspots.filter((h) => h.clue && found.value.has(h.id)).length)
const complete = computed(() => clues.value >= props.investigate.need)

function examine(spot) {
  if (complete.value) return
  found.value = new Set([...found.value, spot.id])
  message.value = spot.text
  messageKey.value++
  play(spot.clue ? 'notify' : 'tick')
  if (complete.value) play('impact')
}

function finish() {
  if (complete.value) emit('done')
}
</script>

<template>
  <!-- @click.stop：調査中のクリックは、ゲームの「次へ進む」に伝えない -->
  <div class="investigate" @click.stop="finish">
    <div class="frame">
      <img :src="`${BASE}images/bg/${bg}.webp`" class="bg" alt="" />
      <button
        v-for="spot in investigate.hotspots"
        :key="spot.id"
        class="spot"
        :class="{ found: found.has(spot.id) }"
        :style="{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.w}%`, height: `${spot.h}%` }"
        :aria-label="spot.label"
        @click.stop="examine(spot)"
      >
        <span class="ring"></span>
        <span class="label">{{ found.has(spot.id) ? '✔ ' : '' }}{{ spot.label }}</span>
      </button>
    </div>

    <div class="hud">
      <span class="title">INVESTIGATION</span>
      <span class="count">痕跡 <b>{{ clues }}</b> / {{ investigate.need }}</span>
    </div>

    <div v-if="message" :key="messageKey" class="result">{{ message }}</div>
    <div v-if="complete" class="complete">
      <p>あいつがいた<b>痕跡</b>を見つけた</p>
      <span>CLICK TO CONTINUE ▶</span>
    </div>
  </div>
</template>

<style scoped>
.investigate {
  position: absolute;
  inset: 0;
  z-index: 5;
  overflow: hidden;
  background: #000;
  cursor: default;
}
/* 16:9 の箱を、画面に全部収まる大きさで真ん中に置く（余った所は黒い帯になる） */
.frame {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(100vw, 177.78vh);
  height: min(100vh, 56.25vw);
  transform: translate(-50%, -50%);
}
.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: brightness(1.7) saturate(0.8);
}
.spot {
  position: absolute;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}
.spot:hover {
  background: rgba(255, 160, 80, 0.08);
  box-shadow: none;
}
/* 調べられる場所：真ん中で脈打つ光の輪 */
.ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 34px;
  height: 34px;
  margin: -17px 0 0 -17px;
  border: 2px solid #ffb066;
  border-radius: 50%;
  box-shadow: 0 0 12px #ff7b00;
  animation: pulse 1.6s ease-out infinite;
}
@keyframes pulse {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}
.found .ring {
  animation: none;
  border-color: #6dffb0;
  box-shadow: 0 0 10px #6dffb0;
  opacity: 0.8;
}
.label {
  position: absolute;
  left: 50%;
  top: calc(50% + 22px);
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 2px 8px;
  font-size: 0.8rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.2s;
}
.spot:hover .label,
.found .label {
  opacity: 1;
}
.found .label { color: #6dffb0; }

.hud {
  position: absolute;
  top: 18px;
  left: 22px;
  display: grid;
  gap: 2px;
  font-family: 'Share Tech Mono', monospace;
  pointer-events: none;
}
.title { font-size: 0.7rem; letter-spacing: 0.35em; color: #ff9a3c; }
.count { font-size: 1.1rem; letter-spacing: 0.1em; }
.count b { color: #6dffb0; font-size: 1.4rem; }

.result {
  position: absolute;
  left: 50%;
  bottom: 24px;
  width: min(900px, calc(100% - 32px));
  transform: translateX(-50%);
  padding: 20px 26px;
  box-sizing: border-box;
  border-left: 4px solid #6dffb0;
  background: rgba(8, 10, 20, 0.88);
  font-size: 1.1rem;
  line-height: 1.8;
  pointer-events: none;
  animation: reveal 0.5s ease-out both;
}
@keyframes reveal {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}
.complete {
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 22px 40px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(109, 255, 176, 0.6);
  cursor: pointer;
  animation: pop 0.4s cubic-bezier(0.2, 1.4, 0.4, 1) both;
}
.complete p { margin: 0; font-size: 1.3rem; letter-spacing: 0.1em; }
.complete b { color: #6dffb0; }
.complete span { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.2em; color: #aaa; }
@keyframes pop { from { transform: translate(-50%, -50%) scale(0.7); opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .ring, .result, .complete { animation: none; }
}
</style>

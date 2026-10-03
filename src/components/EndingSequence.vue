<script setup>
// エンディング画面：10秒のエンディング動画を流し、終わったら
// その最後のコマの上に、本文 → 手紙 → スタッフロール（＋思い出のアルバム）→ THANK YOU FOR PLAYING を出す
// 動画は public/videos/ending_<id>.mp4（レイヤー画像から Python で1コマずつ合成して作ったもの）
// どこかをクリックすると、最後の状態まで一気に飛ばせる
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useArchive } from '../composables/useArchive'
import LetterCard from './LetterCard.vue'

const props = defineProps({
  id: String,
  ending: Object,
})

// いまどこまで進んだか：0 動画 → 1 本文 → 2 手紙 → 3 スタッフロール → 4 最後
const phase = ref(0)
const typed = ref(0) // 本文を何文字まで出したか
const video = ref(null)
const timers = []
const at = (ms, fn) => timers.push(setTimeout(fn, ms))

// 「動きを減らす」設定のときは、動画を流さずに止め絵から始める
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// スタッフロールの中身
const CREDITS = [
  ['CAST', 'ずんだもん', '四国めたん'],
  ['CHARACTERS', '東北ずん子・ずんだもんプロジェクト'],
  ['CHARACTER ART', '坂本アヒル（立ち絵素材）'],
  ['BACKGROUNDS', 'Potat0Master'],
  ['STILLS & MOVIES', '素材を合成・加工して制作'],
  ['MUSIC & SOUND', 'Web Audio API で生成'],
  ['BUILT WITH', 'Vue 3 / Vue Router / Pinia / Vite'],
  ['AI', 'このゲームはAIで生成されています', 'Claude Opus 5.5'],
]

function clearTimers() {
  timers.forEach((t) => clearTimeout(t) || clearInterval(t))
}

// 動画が終わったら（または止め絵のときは少し待って）、本文を1文字ずつ出す
function showText() {
  if (phase.value >= 1) return
  phase.value = 1
  const timer = setInterval(() => {
    typed.value++
    if (typed.value >= props.ending.text.length) {
      clearInterval(timer)
      // 手紙があれば手紙へ、なければスタッフロールへ
      at(1800, () => (props.ending.letter ? (phase.value = 2) : startCredits()))
    }
  }, 45)
  timers.push(timer)
}

function startCredits() {
  phase.value = 3
  at(15000, () => (phase.value = 4)) // 流れきったら最後の画面へ
}

// 記録室のギャラリーに、このエンディングの絵を登録する
const { stills, seeStill } = useArchive()
seeStill(props.ending.still)

// ===== 思い出のアルバム：これまでに見たスチルを、スタッフロールの横で次々に見せる =====
const album = computed(() => [...stills.value])
const albumIndex = ref(0)
const albumTimer = setInterval(() => {
  if (phase.value === 3 && album.value.length) albumIndex.value = (albumIndex.value + 1) % album.value.length
}, 2800)
timers.push(albumTimer)

onMounted(() => {
  if (reduceMotion) at(800, showText)
})
onUnmounted(clearTimers)

// クリック：最後の状態まで飛ばす（動画は最後のコマで止める）
function skip() {
  if (phase.value >= 4 || phase.value === 2) return // 手紙の間は、手紙のほうでクリックを受け取る
  clearTimers()
  if (video.value && !video.value.ended) {
    video.value.currentTime = video.value.duration || 10
    video.value.pause()
  }
  typed.value = props.ending.text.length
  phase.value = 4
}
</script>

<template>
  <div class="sequence" @click="skip">
    <!--
      muted：音のない動画にしてある（BGM はゲームの自動演奏をそのまま流す）。
      muted だと、ブラウザがクリックなしでも自動再生を許してくれる。
      @ended：動画が最後まで流れたときに呼ばれる
    -->
    <video
      v-if="!reduceMotion"
      ref="video"
      class="movie"
      :src="`/videos/ending_${id}.mp4`"
      :poster="`/images/still/${ending.still}.webp`"
      autoplay
      muted
      playsinline
      @ended="showText"
    ></video>
    <img v-else class="movie" :src="`/images/still/${ending.still}.webp`" alt="" />

    <!-- フィルムのざらつき（動画に入れると重くなるので、画面側で重ねる） -->
    <div class="grain"></div>

    <!-- 本文 -->
    <div v-if="phase >= 1" class="card">
      <p>{{ ending.text.slice(0, typed) }}<i v-if="typed < ending.text.length" class="caret"></i></p>
    </div>

    <!-- 手紙 -->
    <LetterCard v-if="phase === 2" :letter="ending.letter" @close="startCredits" />

    <!-- 思い出のアルバム（スタッフロールの間、左側に） -->
    <div v-if="phase === 3 && album.length" class="album">
      <Transition name="album">
        <img :key="albumIndex" :src="`/images/still/${album[albumIndex]}.webp`" alt="" />
      </Transition>
      <span class="album-label">MEMORIES {{ albumIndex + 1 }} / {{ album.length }}</span>
    </div>

    <!-- スタッフロール -->
    <div v-if="phase === 3" class="roll">
      <div class="roll-inner">
        <div v-for="block in CREDITS" :key="block[0]" class="credit">
          <span class="role">{{ block[0] }}</span>
          <span v-for="name in block.slice(1)" :key="name" class="name">{{ name }}</span>
        </div>
      </div>
    </div>

    <!-- 最後 -->
    <div v-if="phase >= 4" class="finale">
      <p class="thanks">THANK YOU FOR PLAYING</p>
      <nav @click.stop>
        <RouterLink to="/route">WORLDLINE</RouterLink>
        <RouterLink to="/archive">ARCHIVE</RouterLink>
        <RouterLink to="/">TITLE</RouterLink>
        <RouterLink to="/credits">CREDITS</RouterLink>
      </nav>
    </div>

    <span v-if="phase < 4 && phase !== 2" class="skip">CLICK TO SKIP ▶▶</span>
  </div>
</template>

<style scoped>
.sequence {
  position: absolute;
  inset: 0;
  background: #000;
  cursor: pointer;
  overflow: hidden;
}
.movie {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.grain {
  position: absolute;
  inset: -50%;
  pointer-events: none;
  opacity: 0.06;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  animation: grain 0.6s steps(4) infinite;
}
@keyframes grain {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-3%, 2%); }
  50% { transform: translate(2%, -3%); }
  75% { transform: translate(-1%, -1%); }
}

/* ===== 本文 ===== */
.card {
  position: absolute;
  left: 50%;
  bottom: 9%;
  width: min(900px, calc(100% - 32px));
  transform: translateX(-50%);
  padding: 22px 28px;
  box-sizing: border-box;
  border-left: 4px solid #ff7b00;
  background: rgba(8, 10, 20, 0.78);
  backdrop-filter: blur(6px);
  animation: card-in 0.8s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes card-in {
  from { opacity: 0; transform: translate(-50%, 20px); }
}
.card p {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.9;
}
.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 3px;
  vertical-align: -2px;
  background: #ff9a3c;
  animation: blink 0.5s steps(2) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

/* ===== 思い出のアルバム：写真のように、少し傾けて、ゆっくり寄る ===== */
.album {
  position: absolute;
  left: 6%;
  top: 12%;
  width: min(46%, 560px);
  aspect-ratio: 16 / 9;
  transform: rotate(-2deg);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 0 6px #f4efe4;
  overflow: hidden;
  background: #000;
  animation: fade 1.2s ease-out both;
}
.album img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: album-zoom 3.2s ease-out both;
}
@keyframes album-zoom {
  from { transform: scale(1.12); }
  to { transform: scale(1); }
}
.album-enter-active,
.album-leave-active { transition: opacity 1s; }
.album-enter-from,
.album-leave-to { opacity: 0; }
.album-label {
  position: absolute;
  right: 10px;
  bottom: 6px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: #fff;
  text-shadow: 0 0 6px #000;
}

/* ===== スタッフロール：右側を下から上へ流れる ===== */
.roll {
  position: absolute;
  top: 8%;
  right: 6%;
  bottom: 34%;
  width: min(360px, 40%);
  overflow: hidden;
  mask-image: linear-gradient(transparent, #000 15%, #000 85%, transparent);
}
.roll-inner {
  display: grid;
  gap: 34px;
  padding: 100% 0;
  text-align: center;
  animation: roll 15s linear forwards;
}
@keyframes roll {
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
}
.credit {
  display: grid;
  gap: 4px;
}
.role {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.35em;
  color: #ff9a3c;
}
.name {
  font-size: 1.05rem;
  text-shadow: 0 0 10px #000, 0 0 3px #000;
}

/* ===== 最後 ===== */
.finale {
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  justify-items: center;
  gap: 18px;
  text-align: center;
}
.thanks {
  margin: 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(1.1rem, 3vw, 1.8rem);
  letter-spacing: 0.4em;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 123, 0, 0.8), 0 0 4px #000;
  animation: thanks-in 1.6s ease-out both;
}
@keyframes thanks-in {
  from { opacity: 0; letter-spacing: 1.2em; filter: blur(8px); }
}
nav {
  display: flex;
  gap: 28px;
  animation: fade 1s ease-out 0.8s both;
}
@keyframes fade { from { opacity: 0; } }
a {
  font-family: 'Share Tech Mono', monospace;
  color: #ffd166;
  letter-spacing: 0.2em;
  text-shadow: 0 0 6px #000;
}
.skip {
  position: absolute;
  right: 16px;
  bottom: 2%;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: #666;
}
@media (prefers-reduced-motion: reduce) {
  .grain, .card, .roll-inner, .thanks, nav { animation: none; }
}
</style>

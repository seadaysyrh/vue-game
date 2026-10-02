<script setup>
// ムービー再生：data/movies.js のカットを、時間どおりに順番に見せる
// クリックでスキップできる。最後まで（またはスキップで）終わったら 'end' を親に知らせる
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { movies } from '../data/movies'
import { useSound } from '../composables/useSound'
import DigitRain from './DigitRain.vue'
import TimeLeap from './TimeLeap.vue'
import CharaSprite from './CharaSprite.vue'

const props = defineProps({
  name: String, // 'opening' / 'shift' / 'rewind'
})
const emit = defineEmits(['end'])
const { play, muted, toggleMute } = useSound()

// 「動きを減らす」設定の人には、短く・フラッシュなしで見せる
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const shots = movies[props.name]
const index = ref(0)
const shot = computed(() => shots[index.value])
let timer = null

function imageOf(s) {
  if (s.still) return `/images/still/${s.still}.webp`
  if (s.bg) return `/images/bg/${s.bg}.webp`
  return null
}

// タイムリープのトンネルで、横を通りすぎる景色（flyby: ['roof_night', 'promise', …]。bg にも still にもある名前を使える）
const STILLS = ['echo', 'farewell', 'observer', 'promise', 'rain', 'ramen']
const flybyOf = (s) => (s.flyby ?? []).map((n) => (STILLS.includes(n) ? `/images/still/${n}.webp` : `/images/bg/${n}.webp`))

// 先に画像を読み込んでおく（カットが切り替わった瞬間に、絵が遅れて出ないように）
shots.forEach((s) => {
  const src = imageOf(s)
  if (src) new Image().src = src
  flybyOf(s).forEach((f) => (new Image().src = f))
})

// カットを表示して、duration ミリ秒後に次のカットへ。
// アニメーションの終わりを待たずに setTimeout で進めるので、タブを切り替えても止まらない
function showShot(i) {
  index.value = i
  const s = shots[i]
  if (s.sound) play(s.sound)
  const duration = reduceMotion ? Math.min(s.duration, 900) : s.duration
  timer = setTimeout(() => {
    if (i + 1 < shots.length) showShot(i + 1)
    else emit('end')
  }, duration)
}

function skip() {
  clearTimeout(timer)
  emit('end')
}

onMounted(() => showShot(0))
onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <!-- @click.stop：クリックはここで止めて、後ろのゲーム画面には伝えない -->
  <div class="movie" @click.stop="skip">
    <!-- カットごとに :key が変わるので、前のカットと重なりながら切り替わる -->
    <Transition name="cut">
      <div
        :key="index"
        class="shot"
        :class="[`motion-${shot.motion ?? 'none'}`, shot.effect ? `effect-${shot.effect}` : '']"
        :style="{ '--duration': `${shot.duration}ms` }"
      >
        <!-- 絵とキャラを1つの「フレーム」にまとめて、カメラの動きはフレームごと付ける -->
        <div class="frame">
          <img v-if="imageOf(shot)" :src="imageOf(shot)" class="shot-image" alt="" />
          <!-- 着地の瞬間だけ：赤と青にずれた絵を重ねて、だんだん1枚に重なっていく（色収差） -->
          <template v-if="shot.effect === 'arrive' && imageOf(shot)">
            <img :src="imageOf(shot)" class="shot-image ghost red" alt="" />
            <img :src="imageOf(shot)" class="shot-image ghost cyan" alt="" />
          </template>
          <CharaSprite v-if="shot.chara" :name="shot.chara" :echo="shot.echo" class="shot-chara" />
        </div>
        <DigitRain v-if="shot.effect === 'digits'" />
        <TimeLeap v-if="shot.effect === 'leap'" :duration="shot.duration" :images="flybyOf(shot)" :reverse="shot.reverse" :label="shot.label" />
        <div v-if="shot.effect === 'arrive'" class="shockwave"></div>
        <h1 v-if="shot.effect === 'title'" class="movie-title" :data-text="shot.caption">{{ shot.caption }}</h1>
        <div v-if="shot.effect === 'rewind'" class="rewind-label">◀◀ REWIND</div>
      </div>
    </Transition>

    <!-- 映画のような上下の黒帯 -->
    <div class="bar top"></div>
    <div class="bar bottom"></div>

    <Transition name="caption">
      <p v-if="shot.caption && shot.effect !== 'title'" :key="index" class="caption" :class="{ dark: shot.effect === 'white' }">
        {{ shot.caption }}
      </p>
    </Transition>

    <div v-if="shot.effect === 'flash' && !reduceMotion" :key="`flash-${index}`" class="flash"></div>

    <span class="skip">CLICK TO SKIP ▶▶</span>
    <!-- @click.stop：音の切り替えはスキップ扱いにしない -->
    <button class="sound" @click.stop="toggleMute">{{ muted ? 'SOUND OFF' : 'SOUND ON' }}</button>
  </div>
</template>

<style scoped>
.movie {
  position: absolute;
  inset: 0;
  z-index: 10;
  overflow: hidden;
  background: #000;
  cursor: pointer;
}
.shot {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.frame {
  position: absolute;
  inset: 0;
  /* カメラの動きは、カットの長さ（--duration）いっぱいにかけて動かす */
  animation-duration: var(--duration);
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}
.shot-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.shot-chara {
  position: absolute;
  bottom: 0;
  left: 50%;
  height: 92%;
  transform: translateX(-50%);
}

/* ===== カメラの動き ===== */
.motion-pan-right .frame { animation-name: pan-right; }
.motion-pan-left .frame { animation-name: pan-left; }
.motion-pan-up .frame { animation-name: pan-up; }
.motion-zoom-in .frame { animation-name: zoom-in; }
.motion-zoom-out .frame { animation-name: zoom-out; }
.motion-shake .frame { animation: shake 0.12s steps(2) infinite; }
@keyframes pan-right { from { transform: scale(1.18) translateX(-5%); } to { transform: scale(1.18) translateX(5%); } }
@keyframes pan-left { from { transform: scale(1.18) translateX(5%); } to { transform: scale(1.18) translateX(-5%); } }
@keyframes pan-up { from { transform: scale(1.18) translateY(6%); } to { transform: scale(1.18) translateY(-6%); } }
@keyframes zoom-in { from { transform: scale(1); } to { transform: scale(1.2); } }
@keyframes zoom-out { from { transform: scale(1.25); } to { transform: scale(1); } }
@keyframes shake {
  0% { transform: scale(1.1) translate(-1%, 1%); }
  50% { transform: scale(1.1) translate(1.5%, -1%); }
  100% { transform: scale(1.1) translate(-0.5%, 0.5%); }
}

/* ===== 特殊効果 ===== */
.effect-glitch .frame { filter: hue-rotate(80deg) saturate(2.5) contrast(1.4); }
/* 思い出（走馬灯）：色あせて、少しにじんで、フィルムのようにちらつく */
.effect-memory .frame {
  filter: sepia(0.55) saturate(0.7) brightness(1.08) contrast(0.9) blur(0.6px);
}
.effect-memory::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at center, transparent 45%, rgba(40, 20, 0, 0.65) 100%),
    radial-gradient(circle at 15% 20%, rgba(255, 190, 120, 0.25), transparent 40%);
  animation: film-flicker 0.18s steps(2) infinite;
}
@keyframes film-flicker {
  50% { opacity: 0.85; }
}
.effect-glitch::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(transparent 0 14px, rgba(255, 40, 120, 0.25) 14px 18px, transparent 18px 40px);
  mix-blend-mode: screen;
}
.effect-rewind .frame { filter: grayscale(0.7) contrast(1.3) brightness(0.9); }
.effect-rewind::after {
  /* ビデオテープの巻き戻しのような横線 */
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(transparent 0 3px, rgba(255, 255, 255, 0.08) 3px 4px);
  animation: tracking 0.3s linear infinite;
}
@keyframes tracking { from { background-position: 0 0; } to { background-position: 0 40px; } }

/* ===== タイムリープ ① 吸いこまれる：景色が渦を巻きながら、画面の中心の一点へ縮んでいく ===== */
.effect-suck .frame {
  overflow: hidden;
  animation: suck var(--duration) cubic-bezier(0.55, 0, 0.85, 0.35) forwards;
}
@keyframes suck {
  0% { transform: none; filter: none; border-radius: 0; }
  30% { transform: scale(0.9) rotate(-40deg); filter: blur(1px) saturate(1.4); border-radius: 12%; }
  100% { transform: scale(0.01) rotate(-1080deg); filter: blur(10px) brightness(3); border-radius: 50%; }
}
/* 後ろで回る渦（縞模様を円すい状に並べて、回す） */
.effect-suck::before {
  content: '';
  position: absolute;
  inset: -60%;
  background: repeating-conic-gradient(from 0deg, rgba(255, 140, 50, 0.35) 0deg 4deg, transparent 4deg 14deg, rgba(110, 220, 255, 0.25) 14deg 16deg, transparent 16deg 30deg);
  mask-image: radial-gradient(circle, transparent 4%, #000 20%, transparent 60%);
  animation: vortex 0.9s linear infinite, vortex-in var(--duration) ease-in both;
}
@keyframes vortex { to { transform: rotate(-360deg); } }
@keyframes vortex-in { from { opacity: 0; scale: 1.6; } to { opacity: 1; scale: 0.8; } }
/* まわりから闇が迫ってくる */
.effect-suck::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, transparent 0, transparent 20%, #000 70%);
  animation: close-in var(--duration) ease-in both;
}
@keyframes close-in { from { opacity: 0; transform: scale(2.5); } to { opacity: 1; transform: scale(1); } }

/* ===== タイムリープ ③ 着地：ぶれた景色が一気に止まり、衝撃の輪が広がる ===== */
.effect-arrive .frame {
  animation: arrive 1.3s cubic-bezier(0.1, 0.85, 0.2, 1) both, settle var(--duration) ease-out 1.3s both;
}
@keyframes arrive {
  0% { transform: scale(2.8) rotate(14deg); filter: blur(22px) brightness(3.5); }
  55% { transform: scale(0.97) rotate(-1deg); filter: blur(0) brightness(1.2); }
  70% { transform: scale(1.03) translate(1%, -1%); }
  85% { transform: scale(1.01) translate(-0.6%, 0.6%); }
  100% { transform: scale(1.02); filter: none; }
}
@keyframes settle { to { transform: scale(1.1); } }
.ghost {
  mix-blend-mode: screen;
  animation: ghost 1.6s cubic-bezier(0.1, 0.8, 0.2, 1) both;
}
.ghost.red { filter: sepia(1) saturate(8) hue-rotate(-40deg); --gx: -4%; }
.ghost.cyan { filter: sepia(1) saturate(8) hue-rotate(150deg); --gx: 4%; }
@keyframes ghost {
  from { transform: translateX(var(--gx)) scale(1.06); opacity: 0.8; }
  to { transform: none; opacity: 0; }
}
.shockwave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30vmin;
  height: 30vmin;
  border-radius: 50%;
  border: 4px solid rgba(255, 240, 220, 0.9);
  box-shadow: 0 0 40px rgba(255, 150, 60, 0.9), inset 0 0 30px rgba(255, 150, 60, 0.6);
  transform: translate(-50%, -50%) scale(0.1);
  animation: shockwave 1.2s cubic-bezier(0.1, 0.7, 0.3, 1) 0.15s forwards;
}
@keyframes shockwave { to { transform: translate(-50%, -50%) scale(7); opacity: 0; border-width: 1px; } }
.rewind-label {
  position: absolute;
  top: 14%;
  left: 6%;
  z-index: 1;
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(1.2rem, 3vw, 2rem);
  color: #fff;
  text-shadow: 0 0 8px #000;
  animation: blink 0.6s steps(2) infinite;
}
.effect-white { background: #f4f1ea; }

/* タイトル：文字を色ずれさせて重ねる */
.effect-title {
  display: grid;
  place-items: center;
  background: radial-gradient(ellipse at center, #1a1205, #000 70%);
}
.movie-title {
  position: relative;
  margin: 0;
  font-size: clamp(2.6rem, 9vw, 6rem);
  letter-spacing: 0.15em;
  color: #fff;
  animation: title-in 1.2s ease-out both;
}
.movie-title::before,
.movie-title::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  opacity: 0.7;
}
.movie-title::before { color: #ff2a6d; transform: translate(-4px, 1px); clip-path: inset(10% 0 55% 0); }
.movie-title::after { color: #05d9e8; transform: translate(4px, -1px); clip-path: inset(60% 0 5% 0); }
@keyframes title-in {
  0% { opacity: 0; letter-spacing: 0.6em; filter: blur(12px); }
  100% { opacity: 1; letter-spacing: 0.15em; filter: blur(0); }
}

/* ===== 黒帯・字幕・フラッシュ ===== */
.bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 9%;
  background: #000;
  z-index: 2;
}
.bar.top { top: 0; }
.bar.bottom { bottom: 0; }
.caption {
  position: absolute;
  left: 50%;
  bottom: 13%;
  z-index: 3;
  width: min(900px, calc(100% - 32px));
  margin: 0;
  transform: translateX(-50%);
  text-align: center;
  font-size: clamp(1rem, 2.4vw, 1.5rem);
  letter-spacing: 0.12em;
  color: #fff;
  text-shadow: 0 0 12px rgba(0, 0, 0, 0.9);
}
.caption.dark { color: #2a2420; text-shadow: none; }
.flash {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: #fff;
  animation: flash 0.6s ease-out forwards;
}
@keyframes flash { from { opacity: 1; } to { opacity: 0; } }
.sound {
  position: absolute;
  top: 2.5%;
  right: 16px;
  z-index: 5;
  padding: 4px 10px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  border-color: rgba(255, 255, 255, 0.25);
}
.skip {
  position: absolute;
  right: 16px;
  bottom: 2.5%;
  z-index: 5;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #888;
}
@keyframes blink { 50% { opacity: 0; } }

/* カットの切り替え（Transition name="cut"） */
.cut-enter-active { transition: opacity 0.35s; }
.cut-leave-active { transition: opacity 0.35s; }
.cut-enter-from,
.cut-leave-to { opacity: 0; }
.caption-enter-active { transition: opacity 0.6s, transform 0.6s; }
.caption-enter-from { opacity: 0; transform: translate(-50%, 8px); }
.caption-leave-active { transition: opacity 0.2s; }
.caption-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .frame, .movie-title, .effect-rewind::after, .effect-memory::after, .effect-suck::before, .effect-suck::after, .ghost, .shockwave { animation: none !important; }
}
</style>

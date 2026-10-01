<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import StageLayer from '../components/StageLayer.vue'
import AmbientLayer from '../components/AmbientLayer.vue'
import NixieMeter from '../components/NixieMeter.vue'
import { useSound } from '../composables/useSound'

const router = useRouter() // ページ移動に使う
const game = useGameStore() // Pinia のストアを使う
const { play, muted, toggleMute } = useSound()

// 視差：マウスの位置を -1〜1 にして CSS 変数で渡す
const mouse = ref({ x: 0, y: 0 })
function onMouseMove(e) {
  mouse.value = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 }
}

// ===== 起動ログ：装置が立ち上がるように、ログが1行ずつ流れてからタイトルが出る =====
const BOOT_LINES = [
  '> REWRITER OS v0.9 ……… boot',
  '> calibrating observer ……… OK',
  '> worldline lock ……… 0.409431',
  '> ready.',
]
const bootShown = ref(0)
const booted = ref(false)
const bootTimers = []
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    booted.value = true
    return
  }
  BOOT_LINES.forEach((_, i) => bootTimers.push(setTimeout(() => (bootShown.value = i + 1), 200 + i * 260)))
  bootTimers.push(setTimeout(() => (booted.value = true), 1500))
})
onUnmounted(() => bootTimers.forEach(clearTimeout))

// ===== ロゴ：1文字ずつ、ばらばらの方向から集まってくる =====
const LOGO = '放課後リライト'
const logoChars = [...LOGO].map((ch, i) => ({
  ch,
  style: {
    '--dx': `${(Math.random() - 0.5) * 600}px`,
    '--dy': `${(Math.random() - 0.5) * 400}px`,
    '--rot': `${(Math.random() - 0.5) * 180}deg`,
    animationDelay: `${0.15 + i * 0.07}s`,
  },
}))

function start() {
  play('impact')
  game.reset()               // ストアの action を呼んで、最初から始める
  game.playMovie('opening')  // オープニングムービーから始める
  router.push('/game')       // コードでページ移動する
}
</script>

<template>
  <div class="title" :style="{ '--mx': mouse.x, '--my': mouse.y }" @mousemove="onMouseMove">
    <StageLayer bg="roof_evening" :chara="null" />
    <AmbientLayer mode="dust" />
    <div class="shade"></div>

    <!-- ロゴの後ろで回る観測リング -->
    <svg v-if="booted" class="ring" viewBox="-100 -100 200 200" aria-hidden="true">
      <circle r="90" class="r1" />
      <circle r="78" class="r2" />
      <line v-for="i in 72" :key="i" :x1="0" :y1="-94" :x2="0" :y2="i % 6 === 0 ? -100 : -97" :transform="`rotate(${i * 5})`" />
    </svg>

    <!-- 起動ログ -->
    <Transition name="boot">
      <div v-if="!booted" class="boot">
        <p v-for="line in BOOT_LINES.slice(0, bootShown)" :key="line">{{ line }}</p>
      </div>
    </Transition>

    <div class="content" :class="{ on: booted }">
      <NixieMeter value="0.409431" />
      <!-- data-text は CSS の ::before / ::after で文字をずらして重ねるのに使う -->
      <h1 class="glitch-text" :data-text="LOGO">
        <span v-for="(c, i) in logoChars" :key="i" class="logo-char" :style="c.style">{{ c.ch }}</span>
      </h1>
      <p class="sub">AFTER SCHOOL REWRITE</p>
      <button class="start" @click="start">START</button>
      <!-- RouterLink：リンクでページ移動 -->
      <nav class="sub-links">
        <RouterLink to="/route" class="credit-link">WORLDLINE</RouterLink>
        <RouterLink to="/credits" class="credit-link">CREDITS</RouterLink>
      </nav>
      <button class="sound" @click="toggleMute">{{ muted ? 'SOUND OFF' : 'SOUND ON' }}</button>
    </div>
  </div>
</template>

<style scoped>
.title {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(5, 5, 20, 0.35), rgba(5, 5, 20, 0.9));
}
.content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
}
.content > * {
  opacity: 0;
}
/* 起動が終わったら（.on が付いたら）、上から順に浮かび上がる */
.content.on > * {
  opacity: 1;
  animation: rise 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.content > :nth-child(2) { animation-delay: 0.2s; }
.content > :nth-child(3) { animation-delay: 0.5s; }
.content > :nth-child(4) { animation-delay: 0.8s; }
.content > :nth-child(n + 5) { animation-delay: 1s; }
@keyframes rise {
  from { opacity: 0; transform: translateY(16px); filter: blur(6px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
.start {
  padding: 14px 56px;
  letter-spacing: 0.4em;
  position: relative;
  overflow: hidden;
}
/* START ボタンを光がなでるように通り過ぎる */
.start::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40%;
  left: -60%;
  background: linear-gradient(90deg, transparent, rgba(255, 180, 100, 0.35), transparent);
  animation: sweep 3.2s ease-in-out infinite 1.5s;
}
@keyframes sweep {
  0% { left: -60%; }
  40%, 100% { left: 120%; }
}
h1 {
  margin: 12px 0 0;
  text-shadow: 0 0 30px rgba(255, 123, 0, 0.35);
  font-size: clamp(2.4rem, 8vw, 4.5rem);
  letter-spacing: 0.15em;
}
.sub {
  margin: 0 0 24px;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.5em;
  color: #ff9a3c;
}
.sub-links {
  display: flex;
  gap: 24px;
}
.sound {
  padding: 4px 12px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  border-color: rgba(255, 255, 255, 0.25);
}
.credit-link {
  font-family: 'Share Tech Mono', monospace;
  color: #aaa;
  letter-spacing: 0.2em;
}

/* ===== ロゴの文字が集まってくる ===== */
.logo-char {
  display: inline-block;
}
.on .logo-char {
  animation: assemble 0.9s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes assemble {
  from { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(2.5); filter: blur(10px); }
  to { opacity: 1; transform: none; filter: blur(0); }
}

/* ===== 起動ログ ===== */
.boot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.95rem;
  color: #6dffb0;
  text-shadow: 0 0 6px rgba(109, 255, 176, 0.6);
}
.boot p {
  margin: 4px 0;
  animation: type-in 0.25s steps(12) both;
}
@keyframes type-in {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}
.boot-leave-active { transition: opacity 0.3s, transform 0.3s; }
.boot-leave-to { opacity: 0; transform: translate(-50%, -50%) scaleY(0.1); }

/* ===== 観測リング ===== */
.ring {
  position: absolute;
  top: 46%;
  left: 50%;
  width: min(90vmin, 720px);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ring-in 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) both, spin 40s linear infinite;
}
.ring circle { fill: none; stroke: rgba(255, 138, 42, 0.35); }
.ring .r1 { stroke-width: 0.5; stroke-dasharray: 3 4; }
.ring .r2 { stroke-width: 0.3; }
.ring line { stroke: rgba(255, 180, 110, 0.45); stroke-width: 0.5; }
@keyframes ring-in {
  from { opacity: 0; scale: 1.6; }
  to { opacity: 1; scale: 1; }
}
@keyframes spin {
  to { rotate: 360deg; }
}

/* ===== タイトル文字のグリッチ ===== */
.glitch-text {
  position: relative;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text); /* 同じ文字をもう2枚重ねる */
  position: absolute;
  inset: 0;
}
.glitch-text::before {
  color: #ff2a6d;
  animation: shift 3s infinite;
}
.glitch-text::after {
  color: #05d9e8;
  animation: shift 3s infinite reverse;
}
@media (prefers-reduced-motion: reduce) {
  .content > *, .content.on > *, .start::after, .on .logo-char, .ring { animation: none; opacity: 1; }
}
@keyframes shift {
  0%, 90%, 100% { transform: translate(0); opacity: 0; }
  92% { transform: translate(-4px, 1px); opacity: 0.8; clip-path: inset(10% 0 55% 0); }
  95% { transform: translate(4px, -1px); opacity: 0.8; clip-path: inset(60% 0 5% 0); }
}
</style>

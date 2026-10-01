<script setup>
import { ref } from 'vue'
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

    <div class="content">
      <NixieMeter value="0.409431" />
      <!-- data-text は CSS の ::before / ::after で文字をずらして重ねるのに使う -->
      <h1 class="glitch-text" data-text="放課後リライト">放課後リライト</h1>
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
  .content > *, .start::after { animation: none; }
}
@keyframes shift {
  0%, 90%, 100% { transform: translate(0); opacity: 0; }
  92% { transform: translate(-4px, 1px); opacity: 0.8; clip-path: inset(10% 0 55% 0); }
  95% { transform: translate(4px, -1px); opacity: 0.8; clip-path: inset(60% 0 5% 0); }
}
</style>

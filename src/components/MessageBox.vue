<script setup>
// メッセージ欄：名前と、1文字ずつの本文（utils/richText.js で作った配列）を表示する
defineProps({
  speaker: String,
  chars: Array,  // [{ ch: '待', style: null }, { ch: 'っ', style: 'em' }, ...]
  done: Boolean, // 文字を最後まで出し終わったか（▼ を出すかどうか）
  lineId: String, // セリフごとに違う値。変わると文字の span を作り直して、アニメーションをやり直す
})
</script>

<template>
  <!-- speaker が SYSTEM のときは、機械のログ風の見た目にする -->
  <div class="message" :class="{ system: speaker === 'SYSTEM' }">
    <!-- 四隅の照準枠と、上を走る光の線（飾り） -->
    <span class="bracket tl"></span>
    <span class="bracket tr"></span>
    <span class="bracket bl"></span>
    <span class="bracket br"></span>
    <span :key="lineId" class="sweep"></span>
    <!-- 名前が空（地の文）のときは名前欄を出さない -->
    <Transition name="speaker" mode="out-in">
      <div v-if="speaker && speaker !== 'SYSTEM'" :key="speaker" class="speaker">{{ speaker }}</div>
    </Transition>
    <p :key="lineId">
      <!-- 1文字ずつ span にすると、文字ごとにアニメーションを付けられる -->
      <span v-for="(c, i) in chars" :key="i" class="char" :class="c.style" :style="c.style === 'shake' ? { animationDelay: `${(i % 5) * 0.05}s` } : null">{{ c.ch }}</span>
    </p>
    <span v-if="done" class="hint">▼</span>
  </div>
</template>

<style scoped>
.message {
  position: absolute;
  left: 50%;
  bottom: 24px;
  z-index: 2;
  width: min(900px, calc(100% - 32px));
  transform: translateX(-50%);
  min-height: 130px;
  padding: 22px 28px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-left: 4px solid #ff7b00;
  background: linear-gradient(rgba(8, 10, 20, 0.86), rgba(8, 10, 20, 0.72));
  backdrop-filter: blur(6px); /* 後ろの背景をぼかす */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  /* 最初に出るとき：真ん中の1本の線から、上下に開く（起動するように） */
  animation: boot 0.55s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes boot {
  0% { clip-path: inset(50% 0 50% 0); }
  40% { clip-path: inset(48% 0 48% 0); }
  100% { clip-path: inset(-40px -20px -20px -20px); }
}
/* 四隅の照準枠（飾り） */
.bracket {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 0 solid #ffb066;
  filter: drop-shadow(0 0 4px #ff7b00);
}
.bracket.tl { top: -6px; left: -6px; border-top-width: 2px; border-left-width: 2px; }
.bracket.tr { top: -6px; right: -6px; border-top-width: 2px; border-right-width: 2px; }
.bracket.bl { bottom: -6px; left: -6px; border-bottom-width: 2px; border-left-width: 2px; }
.bracket.br { bottom: -6px; right: -6px; border-bottom-width: 2px; border-right-width: 2px; }
/* セリフが変わるたびに、上のふちを光が走る */
.sweep {
  position: absolute;
  top: -1px;
  left: 0;
  width: 30%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ffd0a0, transparent);
  box-shadow: 0 0 10px #ff7b00;
  animation: sweep 0.7s ease-out forwards;
  pointer-events: none;
}
@keyframes sweep {
  from { transform: translateX(-30%); opacity: 1; }
  to { transform: translateX(330%); opacity: 0; }
}
.speaker {
  position: absolute;
  top: -18px;
  left: 20px;
  padding: 4px 18px;
  background: #ff7b00;
  color: #111;
  font-weight: bold;
  letter-spacing: 0.1em;
  clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%); /* 右端を斜めに切る */
}
/* 名札：くるっと縦に回転して切り替わる */
.speaker-enter-active { transition: transform 0.35s cubic-bezier(0.2, 1.4, 0.4, 1), opacity 0.2s; }
.speaker-enter-from { transform: perspective(400px) rotateX(90deg); opacity: 0; }
.speaker-leave-active { transition: opacity 0.1s; }
.speaker-leave-to { opacity: 0; }

p {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.9;
  letter-spacing: 0.04em;
}
/* 1文字ずつ、下からふわっと現れる */
.char {
  display: inline-block;
  animation: char-in 0.28s ease-out both;
}
@keyframes char-in {
  from { opacity: 0; transform: translateY(5px); filter: blur(3px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
/* *強調*：オレンジに光る */
.char.em {
  color: #ffb066;
  text-shadow: 0 0 10px rgba(255, 123, 0, 0.8);
}
/* ~ふるえる~ */
.char.shake {
  animation: char-in 0.28s ease-out both, tremble 0.18s steps(2) infinite 0.3s;
  color: #ffd7e4;
}
@keyframes tremble {
  0% { transform: translate(0, 0); }
  50% { transform: translate(1px, -1px); }
  100% { transform: translate(-1px, 1px); }
}
.system p {
  font-family: 'Share Tech Mono', monospace;
  color: #6dffb0;
  text-shadow: 0 0 6px rgba(109, 255, 176, 0.6);
}
.hint {
  position: absolute;
  right: 18px;
  bottom: 10px;
  color: #ff7b00;
  animation: blink 1s infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .char, .char.shake, .message, .sweep { animation: none; }
}
</style>

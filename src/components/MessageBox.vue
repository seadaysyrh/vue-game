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
.speaker-enter-active { transition: transform 0.25s, opacity 0.25s; }
.speaker-enter-from { transform: translateX(-12px); opacity: 0; }
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
  .char, .char.shake { animation: none; }
}
</style>

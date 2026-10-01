<script setup>
// 携帯演出：画面にスマホが現れる
//   mode 'lock'   … ロック画面。ブルッと震えて、通知が1件ずつ届く
//   mode 'thread' … トーク画面。吹き出しが1つずつ出る。erase: true なら、そのあと履歴が消えていく
import { ref, onMounted, onUnmounted } from 'vue'
import { useSound } from '../../composables/useSound'

const props = defineProps({
  phone: Object,
  // { mode: 'lock', time, date, notices: [{ app, title, body }] }
  // { mode: 'thread', contact, bubbles: [{ from: 'me' | 'them', text, time }], erase }
})
const { play } = useSound()

const shown = ref(0)        // 何件目まで表示したか
const erased = ref(0)       // 何件消したか（erase のとき）
const vanished = ref(false) // 全部消えて「存在しない」表示になったか
const timers = []
const later = (ms, fn) => timers.push(setTimeout(fn, ms))

onMounted(() => {
  const items = props.phone.mode === 'lock' ? props.phone.notices : props.phone.bubbles
  if (props.phone.mode === 'lock') play('buzz')
  // 1件ずつ順番に出す
  items.forEach((_, i) => {
    later(500 + i * 700, () => {
      shown.value = i + 1
      play(props.phone.mode === 'lock' ? 'notify' : 'pop')
    })
  })
  // erase：全部出たあと、下から1件ずつノイズになって消える
  if (props.phone.erase) {
    const start = 500 + items.length * 700 + 1200
    items.forEach((_, i) => later(start + i * 450, () => {
      erased.value = i + 1
      play('glitch')
    }))
    later(start + items.length * 450 + 300, () => (vanished.value = true))
  }
})
onUnmounted(() => timers.forEach(clearTimeout))
</script>

<template>
  <div class="phone-wrap">
    <div class="phone" :class="[phone.mode, { buzz: phone.mode === 'lock' }]">
      <div class="notch"></div>

      <!-- ===== ロック画面 ===== -->
      <template v-if="phone.mode === 'lock'">
        <div class="lock-time">{{ phone.time }}</div>
        <div class="lock-date">{{ phone.date }}</div>
        <TransitionGroup name="notice" tag="div" class="notices">
          <div v-for="n in phone.notices.slice(0, shown)" :key="n.title + n.body" class="notice">
            <div class="notice-head"><span class="app">{{ n.app }}</span><span>今</span></div>
            <b>{{ n.title }}</b>
            <p>{{ n.body }}</p>
          </div>
        </TransitionGroup>
      </template>

      <!-- ===== トーク画面 ===== -->
      <template v-else>
        <header class="thread-head">
          <span class="back">‹</span>
          <span class="contact" :class="{ gone: vanished }">{{ vanished ? '（存在しないユーザー）' : phone.contact }}</span>
        </header>
        <div class="bubbles">
          <template v-for="(b, i) in phone.bubbles.slice(0, shown)" :key="i">
            <!-- 消すときは、下（新しいほう）から順番に消す -->
            <div class="bubble" :class="[b.from, { erasing: phone.erase && phone.bubbles.length - 1 - i < erased }]">
              <p>{{ b.text }}</p>
              <span v-if="b.time" class="time">{{ b.time }}</span>
            </div>
          </template>
          <p v-if="vanished" class="empty">トーク履歴はありません</p>
        </div>
        <footer class="composer"><span>メッセージを入力</span><span class="send">▶</span></footer>
      </template>
    </div>
  </div>
</template>

<style scoped>
.phone-wrap {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 9vw 120px;
  pointer-events: none;
  background: linear-gradient(90deg, transparent 30%, rgba(0, 0, 0, 0.55));
}
.phone {
  position: relative;
  height: min(68vh, 600px);
  aspect-ratio: 9 / 19;
  padding: 34px 14px 14px;
  box-sizing: border-box;
  border-radius: 34px;
  border: 3px solid #2b3040;
  background: linear-gradient(160deg, #141a2c, #070910 60%);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 0 30px rgba(120, 160, 255, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* 下から持ち上げるように登場 */
  animation: lift 0.6s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes lift {
  from { transform: translateY(40%) rotate(6deg); opacity: 0; }
  to { transform: none; opacity: 1; }
}
/* ブルッと震える */
.phone.buzz {
  animation: lift 0.6s cubic-bezier(0.2, 0.9, 0.2, 1) both, buzz 0.08s linear 0.7s 8;
}
@keyframes buzz {
  0%, 100% { translate: 0 0; }
  50% { translate: 3px -1px; }
}
.notch {
  position: absolute;
  top: 10px;
  left: 50%;
  width: 34%;
  height: 16px;
  transform: translateX(-50%);
  border-radius: 10px;
  background: #000;
}

/* ===== ロック画面 ===== */
.lock-time {
  margin-top: 24px;
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 3.2rem;
  color: #fff;
  text-shadow: 0 0 20px rgba(150, 180, 255, 0.4);
}
.lock-date {
  text-align: center;
  font-size: 0.8rem;
  color: #9aa2b4;
}
.notices {
  margin-top: 24px;
  display: grid;
  gap: 8px;
}
.notice {
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  font-size: 0.8rem;
}
.notice-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: #9aa2b4;
}
.app {
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.1em;
  color: #6dffb0;
}
.notice p { margin: 2px 0 0; color: #dfe3ec; }
.notice-enter-active { transition: transform 0.45s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.45s; }
.notice-enter-from { transform: translateY(-20px) scale(0.95); opacity: 0; }

/* ===== トーク画面 ===== */
.thread-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.9rem;
  font-weight: bold;
}
.back { font-size: 1.4rem; color: #6dffb0; }
.contact.gone { color: #ff6b7d; font-weight: normal; font-size: 0.8rem; }
.bubbles {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 0;
  overflow: hidden;
}
.bubble {
  max-width: 82%;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 0.82rem;
  line-height: 1.5;
  animation: pop 0.35s cubic-bezier(0.2, 1.4, 0.4, 1) both;
}
.bubble p { margin: 0; }
.bubble.them { align-self: flex-start; background: #23324a; border-bottom-left-radius: 4px; }
.bubble.me { align-self: flex-end; background: #1f6b4f; border-bottom-right-radius: 4px; }
.time { display: block; margin-top: 2px; font-size: 0.6rem; color: rgba(255, 255, 255, 0.5); }
@keyframes pop {
  from { transform: scale(0.6); opacity: 0; }
}
/* 消える：色がずれて、横に崩れながら消える */
.bubble.erasing {
  animation: erase 0.5s steps(5) forwards;
}
@keyframes erase {
  0% { filter: none; }
  30% { transform: translateX(-6px) skewX(20deg); filter: url(#rgb-split) brightness(1.6); }
  60% { transform: translateX(8px) scaleY(0.4); opacity: 0.6; clip-path: inset(30% 0 20% 0); }
  100% { transform: scaleY(0); opacity: 0; }
}
.empty {
  margin: auto;
  font-size: 0.8rem;
  color: #6b7285;
  animation: pop 0.4s ease-out both;
}
.composer {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.07);
  font-size: 0.75rem;
  color: #6b7285;
}
.send { color: #6dffb0; }

@media (max-width: 720px) {
  .phone-wrap { justify-content: center; padding: 0 16px 150px; background: rgba(0, 0, 0, 0.5); }
  .phone { height: min(58vh, 520px); }
}
@media (prefers-reduced-motion: reduce) {
  .phone, .phone.buzz, .bubble, .bubble.erasing { animation: none; }
}
</style>

<script setup>
// 場所と時刻のテロップ（ドラマのように、場面の始まりに左上に出る）
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  place: Object, // { name: '屋上', time: '19:24' }
})

const visible = ref(true)
let timer = null

// 3.5秒たったら消える
onMounted(() => {
  timer = setTimeout(() => (visible.value = false), 3500)
})
onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <Transition name="loc" appear>
    <div v-if="visible" class="location">
      <span class="label">LOCATION</span>
      <span class="name">{{ place.name }}</span>
      <span class="time">{{ place.time }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.location {
  position: absolute;
  top: 22px;
  left: 24px;
  z-index: 3;
  display: grid;
  gap: 2px;
  padding: 10px 22px 10px 16px;
  border-left: 3px solid #ff7b00;
  background: linear-gradient(90deg, rgba(5, 7, 14, 0.85), rgba(5, 7, 14, 0));
  pointer-events: none;
}
.label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.35em;
  color: #ff9a3c;
}
.name {
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 0.15em;
}
.time {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.95rem;
  letter-spacing: 0.2em;
  color: #c8ccd8;
}
/* 左からスッと拭うように出て、フェードで消える */
.loc-enter-active {
  transition: clip-path 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s;
}
.loc-enter-from {
  clip-path: inset(0 100% 0 0);
  opacity: 0;
}
.loc-enter-to {
  clip-path: inset(0 0 0 0);
}
.loc-leave-active {
  transition: opacity 0.8s;
}
.loc-leave-to {
  opacity: 0;
}
</style>

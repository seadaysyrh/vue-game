<script setup>
// TIPS 解放のお知らせ：右上に「TIPS 解放：〈リライター〉」と数秒だけ出る
defineProps({
  tips: Array, // 新しく解放された TIPS の配列
})
</script>

<template>
  <TransitionGroup name="toast" tag="div" class="toasts">
    <div v-for="tip in tips" :key="tip.id" class="toast">
      <span class="label">TIPS UNLOCKED</span>
      <span class="name">{{ tip.title }}</span>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.toasts {
  position: absolute;
  top: 64px;
  right: 16px;
  z-index: 6;
  display: grid;
  gap: 6px;
  pointer-events: none;
}
.toast {
  display: grid;
  padding: 8px 16px;
  border-right: 3px solid #6dffb0;
  background: linear-gradient(270deg, rgba(5, 12, 10, 0.9), rgba(5, 12, 10, 0.5));
  text-align: right;
}
.label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: #6dffb0;
}
.name { font-size: 0.95rem; }
.toast-enter-active { transition: transform 0.4s cubic-bezier(0.2, 1.2, 0.4, 1), opacity 0.4s; }
.toast-enter-from { transform: translateX(40px); opacity: 0; }
.toast-leave-active { transition: opacity 0.6s; }
.toast-leave-to { opacity: 0; }
</style>

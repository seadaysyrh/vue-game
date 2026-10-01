<script setup>
// 〈観測計〉：ニキシー管風に数字を光らせて表示する部品
// value が変わると、しばらく数字がランダムに回ってから新しい値で止まる
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  value: String,
})

const shown = ref(props.value) // 実際に画面に出している文字列
let timer = null

// watch：props.value が変わったときだけ、中の関数が呼ばれる
watch(
  () => props.value,
  (newValue) => {
    clearInterval(timer)
    let count = 0
    timer = setInterval(() => {
      count++
      if (count > 15) {
        // 回し終わったら、本当の値を表示して止める
        clearInterval(timer)
        shown.value = newValue
        return
      }
      // 数字の部分だけをランダムな数字に置き換える（"." はそのまま）
      shown.value = newValue.replace(/[0-9?]/g, () => Math.floor(Math.random() * 10))
    }, 60)
  },
)

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="meter">
    <!-- 1文字ずつ span に分けて、管が並んでいるように見せる -->
    <span v-for="(ch, i) in shown" :key="i" class="tube" :class="{ dot: ch === '.' }">{{ ch }}</span>
  </div>
</template>

<style scoped>
.meter {
  display: inline-flex;
  gap: 3px;
  padding: 6px 8px;
  border: 1px solid rgba(255, 140, 50, 0.4);
  border-radius: 6px;
  background: rgba(10, 5, 0, 0.75);
}
.tube {
  width: 0.9em;
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.6rem;
  color: #ffb066;
  /* 光のにじみを text-shadow で表現 */
  text-shadow: 0 0 4px #ff7b00, 0 0 12px #ff5500, 0 0 24px #ff3300;
  background: linear-gradient(rgba(255, 120, 0, 0.08), rgba(255, 120, 0, 0.02));
  border-radius: 4px;
}
.dot {
  width: 0.4em;
  background: none;
}
</style>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { endings } from '../data/scenario'
import { useMusic } from '../composables/useMusic'
import EndingSequence from '../components/EndingSequence.vue'

const route = useRoute() // いまの URL の情報を読むのに使う

// URL の :type 部分（/ending/true なら 'true'）を読んで、エンディングを選ぶ
// 知らない type が来たときは lost を表示する
const id = computed(() => (endings[route.params.type] ? route.params.type : 'lost'))
const ending = computed(() => endings[id.value])

// エンディングの BGM を流す
const { playMusic } = useMusic()
watch(() => ending.value.bgm, playMusic, { immediate: true })

// 視差：マウスの位置を -1〜1 にして CSS 変数で渡す
const mouse = ref({ x: 0, y: 0 })
function onMouseMove(e) {
  mouse.value = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 }
}
</script>

<template>
  <div class="ending" :style="{ '--mx': mouse.x, '--my': mouse.y }" @mousemove="onMouseMove">
    <!-- :key をエンディングの ID にすると、別のエンディングに移ったとき、最初から流れ直す -->
    <EndingSequence :key="id" :id="id" :ending="ending" />
  </div>
</template>

<style scoped>
.ending {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: #000;
}
</style>

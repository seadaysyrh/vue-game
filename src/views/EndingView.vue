<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { endings } from '../data/scenario'
import StageLayer from '../components/StageLayer.vue'
import NixieMeter from '../components/NixieMeter.vue'
import AmbientLayer from '../components/AmbientLayer.vue'
import MeterBurst from '../components/effects/MeterBurst.vue'
import { useMusic } from '../composables/useMusic'

const route = useRoute() // いまの URL の情報を読むのに使う

// URL の :type 部分（/ending/true なら 'true'）を読んで、エンディングを選ぶ
// 知らない type が来たときは lost を表示する
const ending = computed(() => endings[route.params.type] ?? endings.lost)

// エンディングの BGM を流す
const { playMusic } = useMusic()
watch(() => ending.value.bgm, playMusic, { immediate: true })

// 視差
const mouse = ref({ x: 0, y: 0 })
function onMouseMove(e) {
  mouse.value = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 }
}
</script>

<template>
  <div class="ending" :style="{ '--mx': mouse.x, '--my': mouse.y }" @mousemove="onMouseMove">
    <StageLayer :bg="ending.bg" :chara="ending.chara" :echo="ending.echo" :still="ending.still" />
    <AmbientLayer :mode="ending.ambient" />
    <!-- まず「たどり着いた世界の観測値」を大きく見せる -->
    <MeterBurst :key="`m-${route.params.type}`" :value="ending.meter" label="FINAL OBSERVATION" />

    <div class="hud">
      <NixieMeter :value="ending.meter" />
    </div>

    <!-- :key でエンディングが変わるたびに、カードの登場アニメーションをやり直す -->
    <div :key="route.params.type" class="card">
      <p class="label">{{ ending.label }}</p>
      <h1>「{{ ending.name }}」</h1>
      <p>{{ ending.text }}</p>
      <!-- RouterLink はページ移動用のリンク。a タグの Vue Router 版 -->
      <nav>
        <RouterLink to="/route">WORLDLINE</RouterLink>
        <RouterLink to="/">TITLE</RouterLink>
        <RouterLink to="/credits">CREDITS</RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.ending {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.hud {
  position: absolute;
  top: 16px;
  right: 16px;
}
.card {
  position: absolute;
  left: 50%;
  bottom: 24px;
  width: min(900px, calc(100% - 32px));
  transform: translateX(-50%);
  padding: 24px 28px;
  box-sizing: border-box;
  border-left: 4px solid #ff7b00;
  background: rgba(8, 10, 20, 0.85);
  backdrop-filter: blur(4px);
  animation: card-in 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) 2.4s both;
}
/* 絵をしばらく見せてから、文章のカードが上がってくる */
@keyframes card-in {
  from { opacity: 0; transform: translate(-50%, 30px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
.label {
  margin: 0 0 2px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.4em;
  color: #ff9a3c;
}
@media (prefers-reduced-motion: reduce) {
  .card { animation: none; }
}
h1 {
  margin: 0 0 8px;
  font-size: 1.5rem;
  letter-spacing: 0.1em;
  color: #ff9a3c;
}
p {
  margin: 0;
  line-height: 1.9;
}
nav {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}
a {
  font-family: 'Share Tech Mono', monospace;
  color: #ffd166;
  letter-spacing: 0.2em;
}
</style>

<script setup>
// 分岐図の「キャプチャ」。ゲーム画面を小さくしたような 16:9 のサムネイル
// まだ通っていないノードは、砂嵐の「NO SIGNAL」で隠す
import StageLayer from './StageLayer.vue'

defineProps({
  bg: String,
  chara: String,
  echo: Boolean,
  still: String,
  visible: Boolean, // false なら NO SIGNAL
})
</script>

<template>
  <div class="capture">
    <template v-if="visible">
      <!-- ゲーム画面と同じ部品を、小さい箱の中で使い回している -->
      <StageLayer :bg="bg" :chara="chara" :echo="echo" :still="still" />
      <div class="scan"></div>
    </template>
    <div v-else class="nosignal">
      <span>NO SIGNAL</span>
    </div>
  </div>
</template>

<style scoped>
.capture {
  position: relative; /* StageLayer（position: absolute）をこの箱の中に収める */
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
}
.scan {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(transparent 0 2px, rgba(0, 0, 0, 0.18) 2px 3px);
}
/* 砂嵐：細かい縞模様を動かして、ノイズっぽく見せる */
.nosignal {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background:
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0 2px, transparent 2px 5px),
    #0b0d14;
  animation: noise 0.4s steps(3) infinite;
}
.nosignal span {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: #5d6577;
}
@keyframes noise {
  0% { background-position: 0 0, 0 0; }
  50% { background-position: 0 2px, 3px 0; }
  100% { background-position: 0 -1px, -2px 0; }
}
@media (prefers-reduced-motion: reduce) {
  .nosignal { animation: none; }
}
</style>

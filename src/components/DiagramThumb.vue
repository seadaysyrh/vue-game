<script setup>
// 図のサムネイル：技術説明モードの図（data/diagrams.js）を、箱と線だけの小さな絵にする
// glyph を渡すと、絵の上に大きな文字（'Vue' や 'AWS' など）を重ねる
// 色は、親が CSS 変数 --accent で決める（目次のカードの色分けに合わせる）
import { computed } from 'vue'
import { DIAGRAMS } from '../data/diagrams'

const props = defineProps({
  type: String,
  glyph: String,
})
const data = computed(() => DIAGRAMS[props.type])
</script>

<template>
  <span class="thumb" :class="{ 'has-glyph': glyph }">
    <svg v-if="data" viewBox="0 0 400 250" aria-hidden="true">
      <path v-for="(e, i) in data.edges" :key="`e${i}`" :d="e.d" class="edge" :class="{ dashed: e.dashed }" />
      <rect v-for="(n, i) in data.nodes" :key="`n${i}`" :x="n.x" :y="n.y" :width="n.w" :height="n.h" rx="8" :class="{ dashed: n.dashed }" />
    </svg>
    <span v-if="glyph" class="glyph">{{ glyph }}</span>
  </span>
</template>

<style scoped>
.thumb {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  color: var(--accent, #8ffff2);
  background:
    repeating-linear-gradient(transparent 0 3px, rgba(255, 255, 255, 0.03) 3px 4px),
    linear-gradient(160deg, rgba(20, 50, 70, 0.9), rgba(6, 12, 22, 0.95));
}
svg {
  position: absolute;
  inset: 8% 6%;
  width: 88%;
  height: 84%;
}
rect {
  fill: currentColor;
  fill-opacity: 0.1;
  stroke: currentColor;
  stroke-opacity: 0.7;
  stroke-width: 3;
}
rect.dashed {
  fill-opacity: 0.03;
  stroke-dasharray: 10 8;
}
.edge {
  fill: none;
  stroke: currentColor;
  stroke-opacity: 0.6;
  stroke-width: 3;
}
.edge.dashed { stroke-dasharray: 8 8; stroke-opacity: 0.4; }
/* 大きな文字を重ねるときは、絵を少し暗くして文字を目立たせる */
.has-glyph svg { opacity: 0.45; }
.glyph {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(1.3rem, 3.2vw, 2rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #fff;
  text-shadow: 0 0 12px var(--accent, #8ffff2), 0 0 2px var(--accent, #8ffff2);
}
</style>

<script setup>
// 記録室（アーカイブ）：これまでの観測の記録
//   ENDINGS … 見たエンディング。まだのものは「???」とヒント
//   GALLERY … 見たスチル（CG）。クリックで大きく見られる
//   TIPS    … 本文で出会った用語の解説
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'
import { useArchive } from '../composables/useArchive'
import { endings, endingByPath } from '../data/scenario'
import { TIPS } from '../data/tips'
import NixieMeter from '../components/NixieMeter.vue'

const game = useGameStore()
const { tips, stills } = useArchive()

const tab = ref('endings')
const viewing = ref(null) // 大きく表示中のスチル

// ===== エンディング：通った分岐（visited）から、見たかどうかがわかる =====
// 1つのエンディングに、たどり着く選び方が複数あることもある（隠しエンディング）
const endingList = computed(() =>
  Object.entries(endings)
    .map(([id, e]) => {
      const paths = Object.keys(endingByPath).filter((p) => endingByPath[p] === id)
      return { id, ...e, seen: paths.some((p) => game.visited.includes(p)) }
    })
    // 隠しエンディングは、見たか、ほかを全部見るまでは存在ごと伏せる
    .filter((e) => !e.secret || e.seen || game.allEndingsSeen),
)

// ===== ギャラリー：本編のスチル＋エンディングの絵 =====
const STILLS = [
  { name: 'promise', title: '約束' },
  { name: 'rain', title: '雨の残響' },
  { name: 'echo', title: '残響' },
  { name: 'ramen', title: '雨上がりのカップラーメン' },
  { name: 'observer', title: '観測者' },
  { name: 'farewell', title: 'またね' },
]
const galleryList = computed(() => [
  ...STILLS.map((s) => ({ ...s, seen: stills.value.has(s.name) })),
  ...endingList.value.map((e) => ({ name: e.still, title: `${e.label}「${e.name}」`, seen: e.seen || stills.value.has(e.still) })),
])

const tipList = computed(() => TIPS.map((t) => ({ ...t, seen: tips.value.has(t.id) })))

// ===== 観測率：全部の項目のうち、いくつ見たか =====
const progress = computed(() => {
  const all = [...endingList.value, ...galleryList.value, ...tipList.value]
  return all.filter((x) => x.seen).length / all.length
})
const progressText = computed(() => (progress.value * 100).toFixed(1).padStart(5, '0'))
const count = (list) => `${list.filter((x) => x.seen).length}/${list.length}`
</script>

<template>
  <div class="archive">
    <header>
      <div>
        <p class="eyebrow">OBSERVATION ARCHIVE</p>
        <h1>記録室</h1>
      </div>
      <div class="rate">
        <span>観測率 %</span>
        <NixieMeter :value="progressText" />
      </div>
    </header>

    <nav class="tabs">
      <button :class="{ on: tab === 'endings' }" @click="tab = 'endings'">ENDINGS <small>{{ count(endingList) }}</small></button>
      <button :class="{ on: tab === 'gallery' }" @click="tab = 'gallery'">GALLERY <small>{{ count(galleryList) }}</small></button>
      <button :class="{ on: tab === 'tips' }" @click="tab = 'tips'">TIPS <small>{{ count(tipList) }}</small></button>
    </nav>

    <!-- ===== エンディング ===== -->
    <section v-if="tab === 'endings'" class="grid">
      <article v-for="e in endingList" :key="e.id" class="card" :class="{ locked: !e.seen }">
        <div class="thumb">
          <img v-if="e.seen" :src="`/images/still/${e.still}.webp`" alt="" />
          <span v-else>NO SIGNAL</span>
        </div>
        <p class="label">{{ e.label }}</p>
        <h2>{{ e.seen ? `「${e.name}」` : '???' }}</h2>
        <p class="note">{{ e.seen ? e.text : `ヒント：${e.hint}` }}</p>
        <RouterLink v-if="e.seen" :to="`/ending/${e.id}`" class="link">もう一度見る</RouterLink>
      </article>
    </section>

    <!-- ===== ギャラリー ===== -->
    <section v-if="tab === 'gallery'" class="grid gallery">
      <button v-for="g in galleryList" :key="g.name" class="still" :class="{ locked: !g.seen }" :disabled="!g.seen" @click="viewing = g">
        <img v-if="g.seen" :src="`/images/still/${g.name}.webp`" alt="" />
        <span v-else>???</span>
        <small>{{ g.seen ? g.title : '未観測' }}</small>
      </button>
    </section>

    <!-- ===== TIPS ===== -->
    <section v-if="tab === 'tips'" class="tips">
      <article v-for="t in tipList" :key="t.id" class="tip" :class="{ locked: !t.seen }">
        <h2>{{ t.seen ? t.title : '？？？' }}</h2>
        <p>{{ t.seen ? t.text : 'まだ出会っていない言葉。' }}</p>
      </article>
    </section>

    <RouterLink to="/" class="back">◀ TITLE</RouterLink>

    <!-- スチルを大きく見る -->
    <Transition name="view">
      <div v-if="viewing" class="viewer" @click="viewing = null">
        <img :src="`/images/still/${viewing.name}.webp`" alt="" />
        <p>{{ viewing.title }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.archive {
  min-height: 100vh;
  padding: 32px 20px 64px;
  box-sizing: border-box;
  background:
    radial-gradient(ellipse at 80% 0%, rgba(255, 123, 0, 0.1), transparent 50%),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px) 0 0 / 100% 28px,
    #070910;
}
header,
.tabs,
section,
.back {
  max-width: 1040px;
  margin-left: auto;
  margin-right: auto;
}
header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}
.eyebrow {
  margin: 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: #ff9a3c;
}
h1 {
  margin: 4px 0 0;
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  letter-spacing: 0.12em;
}
.rate {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #ff9a3c;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-top: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.tabs button {
  padding: 8px 18px;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.2em;
  border-color: rgba(255, 255, 255, 0.2);
}
.tabs button.on {
  border-color: #ff9a3c;
  background: rgba(255, 123, 0, 0.2);
}
.tabs small {
  margin-left: 6px;
  color: #ffb066;
}

/* ===== カード ===== */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
}
.card {
  display: grid;
  gap: 6px;
  align-content: start;
  padding: 10px;
  border: 1px solid #262d3d;
  background: rgba(12, 15, 24, 0.9);
}
.thumb,
.still {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.04) 0 1px, transparent 1px 3px), #0b0d14;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #5d6577;
}
.thumb img,
.still img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.label {
  margin: 4px 0 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: #ff9a3c;
}
.card h2 {
  margin: 0;
  font-size: 1.05rem;
}
.note {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.7;
  color: #b8bfcc;
}
.locked .note { color: #6b7285; }
.link {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #ffd166;
}

/* ===== ギャラリー ===== */
.gallery .still {
  padding: 0;
  border: 1px solid #262d3d;
  cursor: pointer;
}
.gallery .still:hover:not(:disabled) {
  border-color: #ff9a3c;
  background-color: transparent;
}
.gallery .still:disabled { cursor: default; }
.still small {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 4px 8px;
  font-family: 'Zen Kaku Gothic New', sans-serif;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
  text-align: left;
  color: #fff;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

/* ===== TIPS ===== */
.tips {
  display: grid;
  gap: 12px;
}
.tip {
  padding: 14px 18px;
  border-left: 3px solid #6dffb0;
  background: rgba(12, 15, 24, 0.9);
}
.tip.locked { border-left-color: #333a4a; }
.tip h2 {
  margin: 0 0 4px;
  font-size: 1.05rem;
}
.tip p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.8;
  color: #b8bfcc;
}
.tip.locked h2,
.tip.locked p { color: #5d6577; }

.back {
  display: block;
  margin-top: 28px;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.2em;
  color: #ffd166;
}

/* ===== 大きく見る ===== */
.viewer {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.92);
  cursor: zoom-out;
}
.viewer img {
  max-width: 100%;
  max-height: 85vh;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
}
.viewer p {
  margin: 0;
  letter-spacing: 0.1em;
}
.view-enter-active,
.view-leave-active { transition: opacity 0.3s; }
.view-enter-from,
.view-leave-to { opacity: 0; }
</style>

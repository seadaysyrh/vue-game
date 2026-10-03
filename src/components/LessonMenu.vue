<script setup>
// 技術説明モードの目次
//   menu が 'top' … 最初の目次。編をカードで並べる（サムネイル・説明・進み具合つき）
//   menu が編の id … 編の目次。授業を番号つきで一覧にする（見終わった授業には ✓）
// 選ばれたら、行き先のシーン ID を choose で親に知らせる
import { computed } from 'vue'
import { EDITIONS, TRACKS, lessonScenes } from '../data/lessons'
import { useLessonProgress } from '../composables/useLessonProgress'
import DiagramThumb from './DiagramThumb.vue'

const props = defineProps({
  menu: String,
})
const emit = defineEmits(['choose'])
const { seen } = useLessonProgress()

const edition = computed(() => EDITIONS.find((e) => e.id === props.menu))
const doneCount = (e) => e.lessons.filter((l) => seen.value.has(l.id)).length
const total = EDITIONS.reduce((n, e) => n + e.lessons.length, 0)
const allDone = computed(() => EDITIONS.reduce((n, e) => n + doneCount(e), 0))
// まだ見ていない最初の授業（「つぎはここ」の印を付ける）
const nextLesson = computed(() => edition.value?.lessons.find((l) => !seen.value.has(l.id)))

// 授業のサムネイル：その授業で最初に出てくる図。図がない授業は、編の図を使う
function lessonThumb(id) {
  for (const line of lessonScenes[id].lines) {
    if (line.diagram) return typeof line.diagram === 'string' ? line.diagram : line.diagram.type
  }
  return edition.value.thumb
}
</script>

<template>
  <!-- @click.stop：目次の中のクリックで、セリフが進まないようにする -->
  <div class="lesson-menu" @click.stop>
    <!-- ===== 最初の目次：編のカード ===== -->
    <template v-if="menu === 'top'">
      <header class="head">
        <div class="head-text">
          <p class="eyebrow">TECH DOCS</p>
          <h2>もくじ</h2>
          <p class="lead">おすすめは 1 から順番に。見終わった授業 {{ allDone }} / {{ total }}</p>
        </div>
        <button class="end" @click="emit('choose', 'lesson_end')">おしまいにする</button>
      </header>
      <div class="cards">
        <button
          v-for="(e, i) in EDITIONS"
          :key="e.id"
          class="card"
          :class="`track-${e.track}`"
          :style="{ animationDelay: `${0.05 + i * 0.05}s` }"
          @click="emit('choose', e.menu)"
        >
          <DiagramThumb class="card-thumb" :type="e.thumb" :glyph="e.glyph" />
          <span class="num">{{ i + 1 }}</span>
          <span class="body">
            <span class="track">{{ TRACKS[e.track] }}</span>
            <span class="title">{{ e.title }}</span>
            <span class="desc">{{ e.desc }}</span>
            <span class="meter">
              <span class="bar"><i :style="{ width: `${(doneCount(e) / e.lessons.length) * 100}%` }"></i></span>
              <span class="count">{{ doneCount(e) }} / {{ e.lessons.length }}</span>
            </span>
          </span>
        </button>
      </div>
    </template>

    <!-- ===== 編の目次：授業の一覧 ===== -->
    <template v-else>
      <header class="edition-head" :class="`track-${edition.track}`">
        <DiagramThumb class="head-thumb" :type="edition.thumb" :glyph="edition.glyph" />
        <div class="head-text">
          <span class="track">{{ TRACKS[edition.track] }}</span>
          <h2>{{ edition.title }}</h2>
          <p class="lead">{{ edition.desc }}　（{{ doneCount(edition) }} / {{ edition.lessons.length }}）</p>
        </div>
        <button class="back" @click="emit('choose', 'lesson_menu')">← もくじ</button>
      </header>
      <ol class="rows" :class="`track-${edition.track}`">
        <li v-for="(l, i) in edition.lessons" :key="l.id" :style="{ animationDelay: `${0.05 + i * 0.04}s` }">
          <button class="row" :class="{ done: seen.has(l.id), next: l === nextLesson }" @click="emit('choose', l.id)">
            <DiagramThumb class="row-thumb" :type="lessonThumb(l.id)" />
            <span class="row-num">{{ seen.has(l.id) ? '✓' : String(i + 1).padStart(2, '0') }}</span>
            <span class="row-text">
              <b>{{ l.title }}</b>
              <small>{{ l.desc }}</small>
            </span>
            <span v-if="l === nextLesson" class="next-tag">つぎはここ</span>
          </button>
        </li>
      </ol>
    </template>
  </div>
</template>

<style scoped>
.lesson-menu {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 64px 16px 160px;
  box-sizing: border-box;
  overflow-y: auto;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.8));
  cursor: default;
  animation: fade-in 0.35s ease-out both;
}
@keyframes fade-in { from { opacity: 0; } }
@keyframes rise { from { opacity: 0; transform: translateY(12px); } }

/* 編ごとの色：きほん＝青、つくる＝緑、公開する＝オレンジ、サーバー＝むらさき、セキュリティ＝赤、演出＝ピンク */
.track-basic { --accent: #6fc3ff; }
.track-build { --accent: #6dffb0; }
.track-ship { --accent: #ffb066; }
.track-direct { --accent: #ff8ad8; }
.track-server { --accent: #b48cff; }
.track-secure { --accent: #ff6b6b; }

/* ===== 見出し ===== */
.head {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  width: min(960px, 100%);
  text-align: left;
}
.eyebrow {
  margin: 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: #8ffff2;
}
h2 {
  margin: 2px 0 0;
  font-size: 1.4rem;
  letter-spacing: 0.1em;
  color: #fff;
}
.lead {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #aab4c4;
}

/* ===== 編のカード ===== */
.cards {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  width: min(960px, 100%);
}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  text-align: left;
  font-size: 1rem;
  letter-spacing: normal;
  background: rgba(8, 14, 24, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-top: 3px solid var(--accent);
  animation: rise 0.4s ease-out both;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.card:hover {
  background: rgba(8, 14, 24, 0.94);
  border-color: var(--accent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 45%, transparent);
  transform: translateY(-3px);
}
/* カードのサムネイルは横長にして、メッセージ欄より上に収める */
.card-thumb {
  aspect-ratio: 12 / 5;
}
.num {
  position: absolute;
  top: 8px;
  left: 8px;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85rem;
  color: #0a0f18;
  background: var(--accent);
  border-radius: 50%;
}
.body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px 12px;
}
.track {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--accent);
}
.title {
  font-weight: 700;
  color: #fff;
}
.desc {
  font-size: 0.75rem;
  line-height: 1.5;
  color: #aab4c4;
}
.meter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
}
.bar i {
  display: block;
  height: 100%;
  background: var(--accent);
  transition: width 0.4s;
}
.count {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #cfd6e2;
}
.end {
  flex-shrink: 0;
  padding: 8px 20px;
  font-size: 0.9rem;
  border-color: rgba(255, 255, 255, 0.3);
}

/* ===== 編の目次 ===== */
.edition-head {
  display: flex;
  align-items: center;
  gap: 14px;
  width: min(960px, 100%);
}
.head-thumb {
  width: 120px;
  flex-shrink: 0;
  border: 1px solid var(--accent);
}
.head-text {
  flex: 1;
  min-width: 0;
}
.back {
  flex-shrink: 0;
  padding: 8px 16px;
  font-size: 0.85rem;
  border-color: rgba(255, 255, 255, 0.3);
}
.rows {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: min(960px, 100%);
  margin: 0;
  padding: 0;
  list-style: none;
}
.rows li {
  animation: rise 0.35s ease-out both;
}
.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 12px 8px 8px;
  text-align: left;
  font-size: 1rem;
  letter-spacing: normal;
  background: rgba(8, 14, 24, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-left: 3px solid var(--accent);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.row:hover {
  background: rgba(8, 14, 24, 0.94);
  border-color: var(--accent);
  box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 40%, transparent);
}
.row-thumb {
  width: 72px;
  flex-shrink: 0;
}
.row-num {
  flex-shrink: 0;
  width: 28px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  color: var(--accent);
}
.row.done .row-num {
  font-size: 1.2rem;
  color: #6dffb0;
}
.row-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.row-text b { color: #fff; }
.row-text small {
  font-size: 0.75rem;
  color: #aab4c4;
}
.row.done .row-text b { color: #cfd6e2; }
.next-tag {
  margin-left: auto;
  flex-shrink: 0;
  padding: 2px 8px;
  font-size: 0.7rem;
  color: #0a0f18;
  background: var(--accent);
}

/* スマホ：カードは2列、授業は1列 */
@media (max-width: 640px) {
  .lesson-menu { padding: 64px 12px 150px; }
  .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .rows { grid-template-columns: minmax(0, 1fr); }
  .head-thumb { width: 84px; }
  .row-thumb { width: 56px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-menu, .card, .rows li { animation: none; }
}
</style>

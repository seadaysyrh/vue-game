<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { useSound } from '../composables/useSound'
import { useMusic } from '../composables/useMusic'
import { parseRichText, pauseAfter } from '../utils/richText'
import StageLayer from '../components/StageLayer.vue'
import AmbientLayer from '../components/AmbientLayer.vue'
import NixieMeter from '../components/NixieMeter.vue'
import MessageBox from '../components/MessageBox.vue'
import ChoiceList from '../components/ChoiceList.vue'
import LocationCard from '../components/LocationCard.vue'
import MoviePlayer from '../components/MoviePlayer.vue'
import FxFilters from '../components/effects/FxFilters.vue'
import FxShockwave from '../components/effects/FxShockwave.vue'
import FxBurst from '../components/effects/FxBurst.vue'
import ChapterCard from '../components/effects/ChapterCard.vue'
import MeterBurst from '../components/effects/MeterBurst.vue'
import CinemaText from '../components/effects/CinemaText.vue'
import CutIn from '../components/effects/CutIn.vue'
import PhoneScreen from '../components/effects/PhoneScreen.vue'
import LightLeak from '../components/effects/LightLeak.vue'
import ClickRipple from '../components/effects/ClickRipple.vue'
import HudFrame from '../components/effects/HudFrame.vue'
import TileDissolve from '../components/effects/TileDissolve.vue'
import { routeTree } from '../data/routeTree'

const router = useRouter()
const game = useGameStore()
const { play, muted, toggleMute } = useSound()
const { playMusic, setMood } = useMusic()

// ===== タイプライター演出（1文字ずつ表示する） =====
const chars = computed(() => parseRichText(game.line.text)) // 装飾付きの1文字ずつの配列
const typedLength = ref(0) // いま何文字目まで出しているか
const typedChars = computed(() => chars.value.slice(0, typedLength.value))
const isTyping = computed(() => typedLength.value < chars.value.length)
const lineId = computed(() => `${game.sceneId}-${game.lineIndex}`)
let typeTimer = null

// ===== チャプターカード：章の始まり（シーンの chapter）に1回だけ出す =====
const chapterActive = ref(false)
const shownChapters = new Set()
watch(
  () => [game.sceneId, game.movie],
  () => {
    if (game.movie || !game.scene.chapter || shownChapters.has(game.sceneId)) return
    shownChapters.add(game.sceneId)
    chapterActive.value = true
    play('impact')
  },
  { immediate: true },
)

// ムービーやチャプターカードが出ている間は、セリフを進めない
const blocking = computed(() => Boolean(game.movie) || chapterActive.value)

// 文字の速さ：セリフの speed で変える（'slow' は大事な言葉を、1文字ずつかみしめるように）
const SPEED = { slow: 2.6, fast: 0.5 }

// 1文字出して、句読点なら少し長めに待ってから次の文字へ（setTimeout をつなげていく）
function typeNext() {
  typedLength.value++
  if (typedLength.value % 2 === 0) play('tick')
  if (!isTyping.value) return
  const factor = SPEED[game.line.speed] ?? 1
  typeTimer = setTimeout(typeNext, pauseAfter(chars.value[typedLength.value - 1].ch) * factor)
}

function startTyping() {
  clearTimeout(typeTimer)
  typedLength.value = 0
  if (blocking.value) return // ムービーやチャプターの間は待つ（終わったらもう一度呼ばれる）
  // beat：セリフが始まる前の「間」。何も起きない時間が、次の言葉を重くする
  typeTimer = setTimeout(typeNext, game.line.beat ?? 250)
}

function finishTyping() {
  clearTimeout(typeTimer)
  typedLength.value = chars.value.length
}

// セリフが変わったとき・ムービーが終わったときに、タイプライターを最初から始める
// immediate: true で、画面を開いた最初の1回目も実行する
watch(() => [game.line, blocking.value], startTyping, { immediate: true })

// しゃべっている間だけ口パク（地の文・SYSTEM・スチル表示中はしない）
const talking = computed(
  () =>
    isTyping.value &&
    Boolean(game.line.speaker) &&
    !['SYSTEM', '僕'].includes(game.line.speaker) && // 主人公のセリフのときは、相手は口を動かさない
    !game.line.still &&
    !game.line.cinema,
)

// ===== BGM：シーンの bgm を流す。世界が変わる・巻き戻るムービーの間は無音にする =====
// さらに、セリフの music で音楽に「演技」をさせる（消える・こもる・小さくなる・ふくらむ）。
// 一度変えた演技は、次に music が出てくるか、シーンが変わるまで続く
let moodScene = null
watch(
  () => [lineId.value, game.movie],
  () => {
    playMusic(game.movie === 'shift' || game.movie === 'rewind' ? null : game.scene.bgm)
    if (moodScene !== game.sceneId) {
      moodScene = game.sceneId
      setMood(game.line.music ?? 'normal')
    } else if (game.line.music) {
      setMood(game.line.music)
    }
  },
  { immediate: true },
)

// ===== セリフ単位のムービー（走馬灯など）：そのセリフに来たとき、1回だけ流す =====
const playedLineMovies = new Set()
watch(
  lineId,
  (id) => {
    if (game.line.movie && !playedLineMovies.has(id)) {
      playedLineMovies.add(id)
      game.playMovie(game.line.movie)
    }
  },
  { immediate: true },
)

// ===== 画面効果（グリッチ・揺れ・フラッシュ） =====
const fx = ref(null) // いま再生中の効果の名前。CSS の fx-〇〇 クラスになる
let fxTimer = null

// 効果ごとの長さ（ミリ秒）と、いっしょに鳴らす効果音
const FX = {
  glitch: { ms: 1000, sound: 'glitch' },
  shake: { ms: 600, sound: 'shake' },
  flash: { ms: 1000, sound: 'flash' },
  shockwave: { ms: 950, sound: 'impact' },
  burst: { ms: 950, sound: 'shake' },
  meter: { ms: 2400, sound: 'send' },
  whip: { ms: 600, sound: 'whip' },     // カメラを素早く振る（ホイップパン）
  zoom: { ms: 1300, sound: 'impact' },  // 一気に寄る（クラッシュズーム）
  leak: { ms: 2600, sound: 'whoosh' },  // 光漏れ
  rack: { ms: 1600, sound: null },      // ピント送り（手前→奥）
}

function playFx(name) {
  fx.value = null // 同じ効果が続いても、もう一度最初から再生できるように一度消す
  setTimeout(() => {
    fx.value = name
    play(FX[name]?.sound ?? name)
    clearTimeout(fxTimer)
    fxTimer = setTimeout(() => (fx.value = null), FX[name]?.ms ?? 1000)
  }, 16)
}

// シーンに glitch: true があれば、入ったときに乱す
watch(
  () => game.sceneId,
  () => {
    if (game.scene.glitch) playFx('glitch')
  },
)
// セリフに fx があれば、そのセリフで効果を出す
watch(
  () => game.line,
  (line) => {
    if (line.fx && !blocking.value) playFx(line.fx)
    if (line.sfx && !blocking.value) play(line.sfx) // 心臓の音・耳鳴りなどの効果音
  },
)

// ===== 場面転換：ムービーやチャプターカードがない場面に移るときは、タイルでほどける =====
const dissolveKey = ref(0) // 0 のときは出さない。増やすたびに新しく再生する
let dissolveTimer = null
watch(
  () => game.sceneId,
  () => {
    if (game.movie || game.scene.chapter) return
    dissolveKey.value++
    clearTimeout(dissolveTimer)
    dissolveTimer = setTimeout(() => (dissolveKey.value = 0), 1200)
  },
)

// ===== クリックの波紋 =====
const ripple = ref(null) // template の ref="ripple"（ClickRipple 部品）が入る
function onScreenClick(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  ripple.value?.spawn(e.clientX - rect.left, e.clientY - rect.top)
  onNext()
}

// ===== 視差：マウスの位置を -1〜1 にして、CSS 変数で StageLayer に渡す =====
const mouse = ref({ x: 0, y: 0 })
function onMouseMove(e) {
  mouse.value = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 }
}

onUnmounted(() => {
  clearTimeout(typeTimer)
  clearTimeout(fxTimer)
  clearTimeout(dissolveTimer)
})

// ===== ムービー =====
function onMovieEnd() {
  const name = game.movie
  game.endMovie()
  // 巻き戻しムービーのあとは、そのエンディングのエピローグ（会話）へ
  if (name === 'rewind') game.goToScene(`ep_${game.endingType}`)
}

// ===== クリックで進む =====
function onNext() {
  // まだ文字を出している途中なら、全部表示するだけ
  if (isTyping.value) {
    finishTyping()
    return
  }
  // 選択肢が出ているときは、クリックで進ませない
  if (game.showChoices) return

  // 最後のシーンの最後のセリフなら、巻き戻しムービー → エピローグ
  if (game.isLastLine && game.scene.end) {
    game.playMovie('rewind')
    return
  }
  // エピローグの最後のセリフなら、エンディング（動画）のページへ
  if (game.isLastLine && game.scene.epilogue) {
    router.push(`/ending/${game.endingType}`)
    return
  }
  game.next()
}

const choosing = computed(() => game.showChoices && !isTyping.value)

// ===== カットイン：cutin: 'eyes' のような短い書き方も、{ type, chara, echo } の形にそろえる =====
const cutin = computed(() => {
  const c = game.line.cutin
  if (!c) return null
  const base = typeof c === 'string' ? { type: c } : c
  return { chara: game.line.chara, echo: game.line.echo, ...base }
})

// ===== 携帯演出：本文の {choice0} などを、プレイヤーが実際に選んだ選択肢の文章に置き換える =====
const chosenTexts = computed(() => {
  const texts = []
  let node = routeTree
  for (const digit of game.path) {
    node = node.children[Number(digit)]
    texts.push(node.choiceText)
  }
  return texts
})
const fill = (text) => text?.replace(/\{choice(\d)\}/g, (_, n) => chosenTexts.value[n] ?? '……')
const phone = computed(() => {
  const p = game.line.phone
  if (!p) return null
  return {
    ...p,
    notices: p.notices?.map((n) => ({ ...n, body: fill(n.body) })),
    bubbles: p.bubbles?.map((b) => ({ ...b, text: fill(b.text) })),
  }
})

// 選択肢を押した瞬間：メッセージの送信なら、画面に衝撃波を走らせる
function onPick() {
  play('select')
  if (game.scene.choiceStyle === 'message') playFx('shockwave')
}
// 残り送信回数：メッセージの選択肢は全部で2回（最初と最後）
const remaining = computed(() => (game.sceneId === 'start' ? 2 : 1))
</script>

<template>
  <div
    class="screen"
    :class="[fx ? `fx-${fx}` : '', { choosing }]"
    :style="{ '--mx': mouse.x, '--my': mouse.y }"
    @click="onScreenClick"
    @mousemove="onMouseMove"
  >
    <div class="world">
      <!-- 色調補正（カラーグレーディング）：シーンの grade で、映画のような色味にする -->
      <div class="grade" :class="game.scene.grade ? `grade-${game.scene.grade}` : ''">
      <StageLayer
        :bg="game.scene.bg"
        :chara="game.line.chara"
        :echo="game.line.echo"
        :still="game.line.still"
        :talking="talking"
        :camera="game.line.camera"
        :handheld="game.scene.handheld"
        :light="game.scene.light"
        :ghost="game.line.ghost"
      />
      <AmbientLayer :mode="game.scene.ambient" />
      </div>
    </div>

    <!-- SF の HUD（四隅の照準・タイムコード・データの流れ） -->
    <HudFrame :scene-id="game.sceneId" :time="game.scene.place?.time" :meter="game.scene.meter" :hidden="blocking || Boolean(game.line.cinema)" />

    <!-- 映画のような上下の黒帯（シーンの scope） -->
    <!-- 感情の山場（セリフの scope: 'wide'）では、黒帯がさらに広がって画面が横長になる -->
    <div class="scope" :class="{ on: game.scene.scope, wide: game.line.scope === 'wide' }"><span></span><span></span></div>

    <!-- カットイン（目のアップなど）と携帯演出。セリフごとに出す -->
    <CutIn v-if="cutin && !blocking" :key="`c-${lineId}`" :cutin="cutin" :talking="talking" />
    <PhoneScreen v-if="phone && !blocking" :key="`p-${lineId}`" :phone="phone" />

    <!-- 画面効果の部品（fx の名前に合わせて出す） -->
    <FxFilters />
    <FxShockwave v-if="fx === 'shockwave'" />
    <FxBurst v-if="fx === 'burst'" />
    <MeterBurst v-if="fx === 'meter'" :value="game.scene.meter" />
    <LightLeak v-if="fx === 'leak'" />

    <!-- 仕上げのフィルター：周辺を暗く（ビネット）＋フィルムのざらつき -->
    <div class="post"></div>

    <LocationCard v-if="!blocking && game.scene.place" :key="game.sceneId" :place="game.scene.place" />

    <div class="hud">
      <!-- @click.stop：音の切り替えで、セリフが進まないようにする -->
      <button class="sound" @click.stop="toggleMute">{{ muted ? 'SOUND OFF' : 'SOUND ON' }}</button>
      <span class="hud-label">OBSERVED</span>
      <NixieMeter :value="game.scene.meter" />
    </div>

    <!-- 選択肢は、文字を出し終わってから表示する -->
    <ChoiceList
      v-if="choosing"
      :choices="game.scene.choices"
      :variant="game.scene.choiceStyle"
      :remaining="remaining"
      @pick="onPick"
      @choose="game.choose"
    />

    <!-- cinema: true のセリフは、画面中央に大きく。それ以外はいつものメッセージ欄 -->
    <CinemaText v-if="game.line.cinema" :speaker="game.line.speaker" :chars="typedChars" :line-id="lineId" :done="!isTyping" />
    <MessageBox v-else :speaker="game.line.speaker" :chars="typedChars" :done="!isTyping" :line-id="lineId" />

    <ChapterCard v-if="chapterActive" :key="game.sceneId" :chapter="game.scene.chapter" @end="chapterActive = false" />

    <TileDissolve v-if="dissolveKey" :key="dissolveKey" />
    <ClickRipple ref="ripple" />

    <!-- ムービーは画面のいちばん上に重ねる -->
    <MoviePlayer v-if="game.movie" :key="game.movie" :name="game.movie" @end="onMovieEnd" />
  </div>
</template>

<style scoped>
.screen {
  position: relative;
  height: 100vh;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  background: #000;
}
.world {
  position: absolute;
  inset: 0;
  transition: filter 0.6s, transform 0.8s;
}
/* 選択肢が出ている間は、世界が止まったように色が抜ける */
/* ===== 色調補正 ===== */
.grade {
  position: absolute;
  inset: 0;
  transition: filter 2s;
}
.grade-warm { filter: sepia(0.25) saturate(1.25) contrast(1.05); }
.grade-teal { filter: hue-rotate(-12deg) saturate(1.2) contrast(1.15) brightness(0.95); }
.grade-cold { filter: saturate(0.7) hue-rotate(15deg) brightness(0.9) contrast(1.1); }
.grade-bleach { filter: saturate(0.35) contrast(1.35) brightness(1.05); }

/* ===== 映画の黒帯 ===== */
.scope span {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  height: 0;
  background: #000;
  pointer-events: none;
  transition: height 1.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.scope span:first-child { top: 0; }
.scope span:last-child { bottom: 0; }
.scope.on span { height: 8%; }
.scope.wide span { height: 14%; }

.choosing .world {
  filter: saturate(0.35) brightness(0.65);
  transform: scale(1.03);
}
.post {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none; /* クリックを邪魔しない */
  background:
    radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.55) 100%),
    repeating-linear-gradient(transparent 0 2px, rgba(0, 0, 0, 0.08) 2px 3px);
}
/* フィルムのざらつき：SVG のノイズ模様を、少しずつずらして動かす */
.post::after {
  content: '';
  position: absolute;
  inset: -50%;
  opacity: 0.07;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  animation: grain 0.6s steps(4) infinite;
}
@keyframes grain {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-3%, 2%); }
  50% { transform: translate(2%, -3%); }
  75% { transform: translate(-1%, -1%); }
}
.hud {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 10px;
}
.hud-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: #ff9a3c;
}
.sound {
  padding: 4px 10px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  border-color: rgba(255, 255, 255, 0.25);
}

/* ===== 画面効果 ===== */
/* グリッチ：色ずれ＋ガタガタ揺れる（明滅しすぎないよう、反転は使わない） */
.fx-glitch .world {
  animation: glitch 0.25s steps(2) 4;
}
@keyframes glitch {
  0% { transform: translate(0); filter: none; }
  25% { transform: translate(-8px, 3px) skewX(6deg); filter: url(#rgb-split) hue-rotate(90deg) saturate(3); }
  50% { transform: translate(6px, -4px); filter: url(#rgb-split) contrast(1.6) saturate(0.4); }
  75% { transform: translate(-3px, 6px) skewX(-8deg); filter: hue-rotate(-90deg); }
  100% { transform: translate(0); filter: none; }
}
/* 衝撃波：FxShockwave が定義した SVG フィルターで、世界をぐにゃっと歪める */
.fx-shockwave .world {
  filter: url(#shockwave);
}
/* 集中線のとき：一瞬だけ前に寄る */
.fx-burst .world {
  animation: punch 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
@keyframes punch {
  0% { transform: scale(1); }
  20% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
/* ホイップパン：カメラを横に素早く振って、ブレながら止まる */
.fx-whip .world {
  animation: whip 0.55s cubic-bezier(0.2, 0.9, 0.2, 1);
}
@keyframes whip {
  0% { transform: translateX(22%) skewX(-10deg); filter: blur(16px) brightness(1.3); }
  100% { transform: none; filter: none; }
}
/* クラッシュズーム：一瞬で寄って、ゆっくり戻る */
.fx-zoom .world {
  animation: crash 1.3s cubic-bezier(0.2, 0.9, 0.2, 1);
}
@keyframes crash {
  0% { transform: scale(1); filter: none; }
  12% { transform: scale(1.28); filter: blur(3px) contrast(1.3); }
  30% { transform: scale(1.22); filter: none; }
  100% { transform: scale(1); }
}
/* ピント送り：最初は人物がぼけていて、だんだん人物にピントが合い、背景がぼける */
.fx-rack :deep(.layer-chara) {
  animation: rack-fg 1.6s ease-in-out;
}
.fx-rack :deep(.layer-bg) {
  animation: rack-bg 1.6s ease-in-out;
}
@keyframes rack-fg { from { filter: blur(10px); } to { filter: blur(0); } }
@keyframes rack-bg { from { filter: blur(0); } 60%, to { filter: blur(5px); } }
/* 揺れ：ドンッと重い揺れ */
.fx-shake .world {
  animation: shake 0.5s ease-out;
}
@keyframes shake {
  0%, 100% { transform: translate(0); }
  15% { transform: translate(-14px, 6px); }
  30% { transform: translate(12px, -8px); }
  45% { transform: translate(-8px, 4px); }
  60% { transform: translate(5px, -3px); }
  80% { transform: translate(-2px, 1px); }
}
/* フラッシュ：白く光って消える（1回だけ） */
.fx-flash::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 5;
  background: #fff;
  pointer-events: none;
  animation: flash 0.9s ease-out forwards;
}
@keyframes flash {
  from { opacity: 0.9; }
  to { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .fx-glitch .world, .fx-shake .world, .fx-burst .world, .fx-whip .world, .fx-zoom .world, .post::after { animation: none; }
  .fx-shockwave .world { filter: none; }
  .fx-flash::after { display: none; }
}
</style>

<script setup>
// 背景と立ち絵を表示する部品。ゲーム画面・エンディング・分岐図で使い回す
// 舞台は本物の3D空間：背景は奥（translateZ がマイナス）、立ち絵は真ん中、光の玉は手前に置いてある。
// 親が CSS 変数 --mx / --my（-1〜1。マウスの位置）を渡すと、舞台全体がそっちへ少し回る。
// 奥のものほど大きくずれて見えるので、ただの絵なのに奥行きが生まれる（CSS の perspective と preserve-3d）
import { ref, computed, watch, onUnmounted } from 'vue'
import CharaSprite from './CharaSprite.vue'
import LightRays from './effects/LightRays.vue'

const props = defineProps({
  bg: String,       // 背景の名前（例：'lab_evening'）
  chara: String,    // 立ち絵の名前（例：'zun_smile'）。null なら誰も表示しない
  echo: Boolean,    // true なら「残響」として、ゆらゆら透ける演出を付ける
  still: String,    // スチル（1枚絵）の名前。指定すると背景と立ち絵の代わりに表示する
  talking: Boolean, // 立ち絵が口パクするか
  camera: String,   // カメラワーク：'close'（寄る） / 'push'（ゆっくり寄っていく） / 'dutch'（傾ける） / 'pan'（横に流す）
                    //   'tilt-up'（足元から顔へ見上げる） / 'pull-back'（寄りから引いて、ひとりぼっちを見せる） / 'drift'（ゆっくり横に漂う）
                    //   3D：'orbit'（キャラのまわりを回りこむ） / 'crane'（上から降りてくる） / 'vertigo'（キャラはそのまま、背景だけが遠のく）
  ghost: String,    // 不在のカット：誰もいない場所に、このキャラの薄い残像を出して消していく
  handheld: Boolean, // 手持ちカメラのように、ずっと少し揺れる
  light: String,    // 光の筋：'sunset' / 'moon'
})

// 名前から画像の場所を組み立てる（public/ に置いたファイルは "/" から始まる URL で読める）
const bgSrc = computed(() => `/images/bg/${props.bg}.webp`)
const stillSrc = computed(() => (props.still ? `/images/still/${props.still}.webp` : null))

// 立ち絵の「キャラ名」の部分だけを取り出す（'zun_smile' → 'zun'、'metan_sad' → 'metan'）
// これを :key に使うと、同じキャラの表情が変わるだけならアニメーションせず、すぐ差し替わる
const charaKey = computed(() => props.chara?.split('_')[0])

// ===== 自動カメラ：キャラ・表情・カメラワークが変わるたびに、カメラが軽く寄り直す（一瞬ブレる） =====
const cutting = ref(false)
let cutTimer = null
watch(
  () => [props.chara, props.camera],
  () => {
    cutting.value = false
    clearTimeout(cutTimer)
    // 一度クラスを外してから付け直すと、CSS アニメーションが最初から再生される
    cutTimer = setTimeout(() => {
      cutting.value = true
      cutTimer = setTimeout(() => (cutting.value = false), 520)
    }, 16)
  },
)
onUnmounted(() => clearTimeout(cutTimer))

// 手前に浮かぶ光の玉（ピンぼけした光）。位置や大きさは最初に一度だけ決める
const bokeh = Array.from({ length: 9 }, (_, i) => ({
  left: `${(i * 37 + 8) % 100}%`,
  top: `${(i * 53 + 15) % 90}%`,
  size: `${6 + ((i * 7) % 9)}vmin`,
  delay: `${-i * 1.7}s`,
  dur: `${9 + (i % 4) * 3}s`,
}))
</script>

<template>
  <div class="stage" :class="[camera && !stillSrc ? `cam-${camera}` : '', { handheld }]">
    <!-- 手持ちカメラの揺れ（ずっと続く）と、カメラワーク（セリフごと）は別の箱で動かす -->
    <div class="handheld-box">
    <div class="cut-box" :class="{ cutting }">
    <!-- マウスで舞台ごと回す箱（カメラワークの動きとぶつからないように、別の箱にしている） -->
    <div class="orbit-box">
    <div class="camera">
      <!--
        <Transition>：中身が入れ替わるときに CSS アニメーションを付けてくれる。
        :key が変わると「別の要素」とみなされ、古い画像はフェードアウト、新しい画像はフェードインする。
      -->
      <div class="layer-bg">
        <Transition name="fade">
          <img :key="bgSrc" :src="bgSrc" class="bg" alt="" />
        </Transition>
      </div>

      <!--
        立ち絵は mode="out-in"：古いキャラが消えきってから、新しいキャラを出す（重ならない）。
        :key はキャラ名なので、表情の変化ではフェードしない。
      -->
      <div class="layer-chara">
        <!-- 残響のキャラは、色ずれのノイズとともに現れる（Transition の name を切り替える） -->
        <Transition :name="echo ? 'chara-glitch' : 'chara-fade'" mode="out-in">
          <CharaSprite v-if="chara && !stillSrc" :key="charaKey" :name="chara" :echo="echo" :talking="talking" class="chara" />
        </Transition>
        <!-- さっきまでそこにいた人の残像（キャラがいないときだけ） -->
        <CharaSprite v-if="ghost && !chara && !stillSrc" :key="`ghost-${ghost}`" :name="ghost" class="chara absence" />
      </div>

      <LightRays :mode="light" />

      <!-- いちばん手前：ピンぼけした光の玉。カメラに近いので、回すといちばん大きく動く -->
      <div v-if="!stillSrc" class="layer-near">
        <span
          v-for="(b, i) in bokeh"
          :key="i"
          class="orb"
          :style="{ left: b.left, top: b.top, width: b.size, height: b.size, animationDelay: b.delay, animationDuration: b.dur }"
        ></span>
      </div>
    </div>
    </div>
    </div>
    </div>

    <!-- スチル：白く光りながら現れ、ゆっくりズームする。マウスで、額縁の絵をのぞきこむように少し傾く -->
    <div class="still-tilt">
      <Transition name="still">
        <img v-if="stillSrc" :key="stillSrc" :src="stillSrc" class="still" alt="" />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  /* 3Dの「カメラ」：この距離（px）から舞台をのぞいている。小さいほど広角で、奥行きが強く出る */
  perspective: 1000px;
  perspective-origin: 50% 40%;
}
/* preserve-3d：子どもの3Dの位置（translateZ）を、平らにつぶさずにそのまま使う。
   舞台からレイヤーまでの間の箱すべてに付けないと、途中で平らになってしまう */
.handheld-box,
.cut-box,
.orbit-box,
.camera {
  transform-style: preserve-3d;
}
.handheld-box {
  position: absolute;
  inset: 0;
}
/* マウスのほうへ、舞台ごと少し回る */
.orbit-box {
  position: absolute;
  inset: 0;
  transform: rotateY(calc(var(--mx, 0) * 5deg)) rotateX(calc(var(--my, 0) * -3deg));
  transition: transform 0.9s ease-out;
}
/* 手持ちカメラ：ゆっくり不規則に、ほんの少し揺れ続ける */
.handheld .handheld-box {
  animation: handheld 9s ease-in-out infinite;
}
@keyframes handheld {
  0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1.03); }
  20% { transform: translate(-0.6%, 0.4%) rotate(-0.3deg) scale(1.03); }
  45% { transform: translate(0.5%, -0.3%) rotate(0.25deg) scale(1.035); }
  70% { transform: translate(-0.3%, -0.5%) rotate(-0.15deg) scale(1.03); }
}
.cut-box {
  position: absolute;
  inset: 0;
}
/* カット：少し寄った位置から、ブレながら定位置に戻る */
/* （filter を箱に付けると3Dが平らになってしまうので、ぼかしは中のレイヤーに付ける） */
.cut-box.cutting {
  animation: cut 0.5s cubic-bezier(0.2, 0.9, 0.2, 1);
}
.cut-box.cutting .layer-chara {
  animation: cut-blur 0.5s ease-out;
}
@keyframes cut {
  from { transform: scale(1.045); }
  to { transform: scale(1); }
}
@keyframes cut-blur {
  from { filter: blur(3px); }
}
.camera {
  position: absolute;
  inset: 0;
  transform-origin: 50% 30%;
  transition: transform 1.4s cubic-bezier(0.2, 0.7, 0.2, 1);
}
/* 背景は奥へ 320px 下げる。遠くのものは小さく見えるので、そのぶん拡大して画面を埋める
   （見た目の大きさ = 1000 / (1000 + 320) ≒ 0.76倍 → 1.42倍に拡大して、少し余裕を持たせる） */
.layer-bg {
  position: absolute;
  inset: -4%;
  transform: translateZ(-320px) scale(1.42);
  transition: transform 1.2s cubic-bezier(0.3, 0, 0.2, 1), filter 1.4s;
}
.layer-chara {
  position: absolute;
  inset: 0;
}
/* いちばん手前の光の玉：カメラ側へ 220px 出す */
.layer-near {
  position: absolute;
  inset: 0;
  transform: translateZ(220px);
  pointer-events: none;
}
.orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 236, 200, 0.28), rgba(255, 200, 140, 0.1) 45%, transparent 70%);
  filter: blur(3px);
  mix-blend-mode: screen;
  animation: orb-float 12s ease-in-out infinite alternate;
}
@keyframes orb-float {
  from { transform: translate(0, 0) scale(1); opacity: 0.35; }
  to { transform: translate(4vmin, -6vmin) scale(1.25); opacity: 0.9; }
}
/* ===== カメラワーク ===== */
/* close：顔に寄る。背景だけぼかす（被写界深度） */
.cam-close .camera {
  transform: scale(1.32);
}
.cam-close .layer-bg,
.cam-dutch .layer-bg {
  filter: blur(4px) brightness(0.8);
}
/* push：セリフのあいだ、じわじわ寄っていく（ドリーイン） */
.cam-push .camera {
  transform: scale(1.18);
  transition: transform 7s cubic-bezier(0.3, 0, 0.3, 1);
}
/* dutch：カメラを傾けて、不安や緊張を出す（ダッチアングル） */
.cam-dutch .camera {
  transform: rotate(-5deg) scale(1.28);
}
/* tilt-up：足元のあたりから、ゆっくり顔まで見上げていく（登場・正体を明かす場面） */
.cam-tilt-up .camera {
  animation: tilt-up 3.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}
@keyframes tilt-up {
  from { transform: translateY(-18%) scale(1.35); }
  to { transform: none; }
}
/* pull-back：顔の寄りから、ゆっくり引いていく。広い場所にひとりでいることが見えてくる */
.cam-pull-back .camera {
  animation: pull-back 7s cubic-bezier(0.3, 0, 0.2, 1) both;
}
@keyframes pull-back {
  from { transform: scale(1.45); }
  to { transform: scale(1); }
}
/* drift：ゆっくり横に漂う（静かな場面の、見回すような視線） */
.cam-drift .camera {
  animation: drift-cam 9s ease-in-out both;
}
@keyframes drift-cam {
  from { transform: translateX(3%) scale(1.1); }
  to { transform: translateX(-3%) scale(1.1); }
}
/* 不在：白っぽく透けた残像が、ゆっくり消えていく（立ち絵の影の指定より優先させるため、セレクタを長くしている） */
.layer-chara .absence {
  filter: grayscale(1) brightness(1.8) blur(1.5px);
  animation: absence 5s ease-out forwards;
}
@keyframes absence {
  0% { opacity: 0; }
  15% { opacity: 0.22; }
  100% { opacity: 0; }
}
/* ===== 3Dのカメラワーク ===== */
/* orbit：キャラのまわりを回りこむ。キャラ（真ん中）はほぼそのまま、奥の背景だけが大きく流れる */
.cam-orbit .camera {
  animation: orbit 9s cubic-bezier(0.45, 0, 0.4, 1) both;
}
@keyframes orbit {
  from { transform: rotateY(-12deg) scale(1.1); }
  to { transform: rotateY(9deg) scale(1.1); }
}
/* crane：上からのぞきこむ位置から、ゆっくり降りてきて正面になる */
.cam-crane .camera {
  animation: crane 6s cubic-bezier(0.3, 0, 0.2, 1) both;
}
@keyframes crane {
  from { transform: translateY(-10%) rotateX(18deg) scale(1.25); }
  to { transform: none; }
}
/* vertigo（めまいショット）：カメラが下がりながら望遠→広角に変わる映画の技。
   キャラ（奥行き 0）の大きさは perspective を変えても変わらないが、奥の背景だけは遠のいていく。
   → 世界がぐにゃりと引き伸ばされる、ぞっとする感覚になる */
.cam-vertigo {
  animation: vertigo 5s cubic-bezier(0.4, 0, 0.2, 1) both;
}
@keyframes vertigo {
  from { perspective: 2600px; }
  to { perspective: 420px; }
}
.cam-vertigo .layer-bg {
  transform: translateZ(-320px) scale(2.3);
}

/* pan：横にゆっくり流す */
.cam-pan .camera {
  transform: translateX(-5%) scale(1.14);
  transition: transform 6s cubic-bezier(0.3, 0, 0.3, 1);
}
.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 画面いっぱいに、縦横比を保って表示 */
  /* 背景はいつも、ゆっくり寄ったり流れたりしている（止まった絵に見せない） */
  animation: drift 26s ease-in-out infinite alternate;
}
@keyframes drift {
  from { transform: scale(1.03) translate(0, 0); }
  to { transform: scale(1.1) translate(-1.5%, -1%); }
}
.chara {
  position: absolute;
  bottom: 0;
  left: 50%;
  height: 92%;
  transform: translateX(-50%);
}

/* Transition name="fade"（背景）が付けるクラス */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transition name="chara-glitch"（残響の登場）：色がずれ、横にちらつきながら現れる */
/* （残響のゆらめきアニメーションより優先させるため、セレクタを長くして強くしている） */
.stage .layer-chara .chara-glitch-enter-active {
  animation: glitch-in 0.7s steps(7);
}
.stage .layer-chara .chara-glitch-leave-active {
  animation: glitch-in 0.35s steps(4) reverse;
}
@keyframes glitch-in {
  0% { opacity: 0; transform: translate(-50%, 0) scaleX(1.4); filter: url(#rgb-split) brightness(2); clip-path: inset(40% 0 40% 0); }
  30% { opacity: 0.8; transform: translate(-46%, 0); filter: url(#rgb-split) brightness(1.6); clip-path: inset(10% 0 55% 0); }
  60% { opacity: 0.5; transform: translate(-53%, 0); filter: url(#rgb-split); clip-path: inset(50% 0 5% 0); }
  100% { opacity: 1; transform: translate(-50%, 0); filter: none; clip-path: inset(0); }
}

/* Transition name="chara-fade"（立ち絵）：下からふわっと登場 */
.chara-fade-enter-active {
  transition: opacity 0.35s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.chara-fade-leave-active {
  transition: opacity 0.2s;
}
.chara-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, 24px);
}
.chara-fade-leave-to {
  opacity: 0;
}

/* ===== スチル ===== */
.still-tilt {
  position: absolute;
  inset: 0;
  transform: rotateY(calc(var(--mx, 0) * 2.5deg)) rotateX(calc(var(--my, 0) * -1.8deg)) scale(1.05);
  transition: transform 0.9s ease-out;
}
.still {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: still-zoom 16s ease-out forwards;
}
@keyframes still-zoom {
  from { transform: scale(1.02); }
  to { transform: scale(1.1); }
}
.still-enter-active {
  transition: opacity 0.9s, filter 1.4s;
}
.still-enter-from {
  opacity: 0;
  filter: brightness(2.2) blur(6px);
}
.still-leave-active {
  transition: opacity 0.6s;
}
.still-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .still { animation: none; }
  .camera, .layer-bg, .layer-chara, .orbit-box, .still-tilt { transition: none; }
  .orbit-box, .still-tilt { transform: none; }
  .handheld .handheld-box, .cut-box.cutting, .bg, .camera, .orb, .cam-vertigo, .cut-box.cutting .layer-chara { animation: none; }
}
</style>

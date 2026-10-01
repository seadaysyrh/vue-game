<script setup>
// 背景と立ち絵を表示する部品。ゲーム画面・エンディング・分岐図で使い回す
// 親が CSS 変数 --mx / --my（-1〜1。マウスの位置）を渡すと、背景と立ち絵が別々にずれて奥行きが出る（視差）
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
</script>

<template>
  <div class="stage" :class="[camera && !stillSrc ? `cam-${camera}` : '', { handheld }]">
    <!-- 手持ちカメラの揺れ（ずっと続く）と、カメラワーク（セリフごと）は別の箱で動かす -->
    <div class="handheld-box">
    <div class="cut-box" :class="{ cutting }">
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
    </div>
    </div>
    </div>

    <!-- スチル：白く光りながら現れ、ゆっくりズームする -->
    <Transition name="still">
      <img v-if="stillSrc" :key="stillSrc" :src="stillSrc" class="still" alt="" />
    </Transition>
  </div>
</template>

<style scoped>
.stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.handheld-box {
  position: absolute;
  inset: 0;
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
.cut-box.cutting {
  animation: cut 0.5s cubic-bezier(0.2, 0.9, 0.2, 1);
}
@keyframes cut {
  from { transform: scale(1.045); filter: blur(3px); }
  to { transform: scale(1); filter: blur(0); }
}
.camera {
  position: absolute;
  inset: 0;
  transform-origin: 50% 30%;
  transition: transform 1.4s cubic-bezier(0.2, 0.7, 0.2, 1);
}
/* 視差：背景は大きめに置いて、マウスと逆に少しずらす。立ち絵は同じ向きに少しだけ */
.layer-bg {
  position: absolute;
  inset: -4%;
  transform: translate(calc(var(--mx, 0) * -1.6%), calc(var(--my, 0) * -1.2%));
  transition: transform 0.8s ease-out, filter 1.4s;
}
.layer-chara {
  position: absolute;
  inset: 0;
  transform: translate(calc(var(--mx, 0) * 0.9%), calc(var(--my, 0) * 0.5%));
  transition: transform 0.8s ease-out;
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
  .camera, .layer-bg, .layer-chara { transition: none; }
  .handheld .handheld-box, .cut-box.cutting, .bg, .camera { animation: none; }
}
</style>

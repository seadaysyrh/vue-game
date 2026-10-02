<template>
  <!--
    世界の書き換え（fx: 'rewrite'）：光の線が上から下へ走り、通りすぎたところから世界が「書き換わる」。
      ・まだ書き換わっていない下側 … mix-blend-mode: saturation で色を抜き、黒を重ねて暗くして「古い世界」に見せる
        （saturation：下の絵の明るさはそのままで、「鮮やかさ」だけを上の層＝黒（鮮やかさ 0）に置きかえる → 白黒になる）
      ・線のすぐ上 … 方眼の光（ワイヤーフレーム）が残って、まだ組み立て中に見える
    3つの層の「見える範囲」（clip-path）を、線と同じ速さで動かしているだけ
  -->
  <div class="rewrite">
    <div class="old"></div>
    <div class="old dark"></div>
    <div class="wire"></div>
    <div class="line">
      <span>REWRITING WORLD LINE</span>
      <span class="hex">0x7F3A·C21E·09B4·∆1.130205</span>
    </div>
  </div>
</template>

<style scoped>
/* この箱には z-index を付けない（付けると、中の層が後ろの画面と混ざり合えなくなる） */
.rewrite {
  --t: 1.8s;
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.rewrite > * {
  z-index: 2; /* メッセージ欄（同じ 2 で、あとに書かれている）よりは下 */
}
.old {
  position: absolute;
  inset: 0;
  background: #000;
  mix-blend-mode: saturation;
  animation: old var(--t) cubic-bezier(0.5, 0, 0.5, 1) both;
}
.old.dark {
  background: rgba(0, 0, 10, 0.45);
  mix-blend-mode: normal;
}
@keyframes old {
  from { clip-path: inset(0 0 0 0); }
  to { clip-path: inset(100% 0 0 0); }
}
.wire {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(90deg, rgba(110, 255, 240, 0.5) 0 1px, transparent 1px 48px),
    repeating-linear-gradient(0deg, rgba(110, 255, 240, 0.5) 0 1px, transparent 1px 48px),
    linear-gradient(transparent, rgba(80, 255, 230, 0.25));
  mix-blend-mode: screen;
  animation: wire var(--t) cubic-bezier(0.5, 0, 0.5, 1) both;
}
/* 線の上、高さ 18% ぶんだけ見せる */
@keyframes wire {
  from { clip-path: inset(-18% 0 100% 0); }
  to { clip-path: inset(82% 0 0 0); }
}
.line {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: #e8fffd;
  box-shadow: 0 0 18px 6px rgba(80, 255, 230, 0.8), 0 0 60px 10px rgba(80, 255, 230, 0.35);
  animation: line var(--t) cubic-bezier(0.5, 0, 0.5, 1) both;
}
@keyframes line {
  from { top: 0; }
  95% { opacity: 1; }
  to { top: 100%; opacity: 0; }
}
.line span {
  position: absolute;
  top: 8px;
  left: 3%;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: #bffff7;
  text-shadow: 0 0 6px rgba(80, 255, 230, 0.9);
}
.line .hex {
  left: auto;
  right: 3%;
  animation: flicker 0.12s steps(2) infinite;
}
@keyframes flicker { 50% { opacity: 0.4; } }
@media (prefers-reduced-motion: reduce) {
  .rewrite { display: none; }
}
</style>

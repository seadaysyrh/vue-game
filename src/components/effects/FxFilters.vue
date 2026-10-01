<template>
  <!--
    SVG フィルターの定義だけを置く見えない部品。
    CSS で filter: url(#rgb-split) と書くと、HTML の要素にもこのフィルターがかかる。
  -->
  <svg class="defs" aria-hidden="true">
    <!-- 色収差：赤・緑・青を別々に取り出して、左右にずらして重ねる -->
    <filter id="rgb-split" x="-5%" y="0" width="110%" height="100%" color-interpolation-filters="sRGB">
      <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
      <feOffset in="r" dx="-10" result="r2" />
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
      <feOffset in="b" dx="10" result="b2" />
      <feBlend in="r2" in2="g" mode="screen" result="rg" />
      <feBlend in="rg" in2="b2" mode="screen" />
    </filter>
  </svg>
</template>

<style scoped>
.defs {
  position: absolute;
  width: 0;
  height: 0;
}
</style>

<script setup>
// 生きて動く立ち絵：まばたき・口パク・呼吸
// 「基本」「目を閉じた絵」「口を変えた絵」の3枚を重ねておき、上の2枚を出したり消したりする
// （src を差し替えるより、重ねて切り替えるほうがチラつかない）
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  name: String,     // 'zun_smile' など
  echo: Boolean,    // 残響（透けて光る）
  talking: Boolean, // しゃべっている間 true（口パクする）
})

const src = (suffix) => `/images/chara/${props.name}${suffix}.webp`

// ===== まばたき =====
const blinking = ref(false)
let blinkTimer = null

function scheduleBlink() {
  // 2〜6秒に1回。ときどき2回続けてまばたきする
  blinkTimer = setTimeout(() => {
    blinking.value = true
    blinkTimer = setTimeout(() => {
      blinking.value = false
      if (Math.random() < 0.2) {
        blinkTimer = setTimeout(() => {
          blinking.value = true
          blinkTimer = setTimeout(() => {
            blinking.value = false
            scheduleBlink()
          }, 110)
        }, 140)
      } else {
        scheduleBlink()
      }
    }, 120)
  }, 2000 + Math.random() * 4000)
}

// ===== 口パク =====
const mouthOpen = ref(false)
let talkTimer = null

watch(
  () => props.talking,
  (talking) => {
    clearInterval(talkTimer)
    mouthOpen.value = false
    if (!talking) return
    talkTimer = setInterval(() => {
      // 規則正しすぎると機械っぽいので、少しだけランダムにする
      mouthOpen.value = Math.random() < 0.8 ? !mouthOpen.value : mouthOpen.value
    }, 95)
  },
  { immediate: true },
)

const showTalk = computed(() => mouthOpen.value && !blinking.value)

onMounted(scheduleBlink)
onUnmounted(() => {
  clearTimeout(blinkTimer)
  clearInterval(talkTimer)
})
</script>

<template>
  <div class="sprite" :class="{ echo }">
    <div class="breath">
      <img :src="src('')" class="base" alt="" />
      <img :src="src('_blink')" class="layer" :class="{ on: blinking }" alt="" />
      <img :src="src('_talk')" class="layer" :class="{ on: showTalk }" alt="" />
    </div>
  </div>
</template>

<style scoped>
/* 高さは親（StageLayer の .chara）が決める */
.sprite {
  filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.6));
}
/* 呼吸：足元を支点に、ほんの少しだけ伸び縮みする */
.breath {
  position: relative;
  height: 100%;
  transform-origin: 50% 100%;
  animation: breath 4.2s ease-in-out infinite;
}
@keyframes breath {
  0%, 100% { transform: scale(1, 1); }
  50% { transform: scale(1.004, 1.012); }
}
.base {
  display: block;
  height: 100%;
}
.layer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  opacity: 0;
}
.layer.on {
  opacity: 1;
}

/* 残響：ふわふわ点滅して、青白く光る */
.sprite.echo {
  animation: flicker 3s infinite;
  filter: brightness(1.3) saturate(0.6) drop-shadow(0 0 18px rgba(120, 255, 220, 0.9));
}
@keyframes flicker {
  0%, 100% { opacity: 0.85; }
  45% { opacity: 0.6; }
  50% { opacity: 0.3; }
  55% { opacity: 0.7; }
}
@media (prefers-reduced-motion: reduce) {
  .breath, .sprite.echo { animation: none; }
}
</style>

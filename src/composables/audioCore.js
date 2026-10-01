// ===== 音の土台（効果音と BGM で共有する） =====
// AudioContext はページに1つあれば十分なので、ここで1つだけ作って使い回す
import { ref } from 'vue'

const SAVE_KEY = 'after-school-rewrite:sound'

function loadMuted() {
  try {
    return localStorage.getItem(SAVE_KEY) === 'off'
  } catch {
    return false
  }
}

// 関数の外に置くと、どのコンポーネントから使っても同じ値を共有できる
export const muted = ref(loadMuted())

let ctx = null
let master = null

export function getAudio() {
  if (!ctx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = muted.value ? 0 : 1
    master.connect(ctx.destination)
  }
  // ブラウザは「クリックされるまで音を出さない」ので、止まっていたら再開する
  if (ctx.state === 'suspended') ctx.resume()
  return { ctx, master }
}

export function toggleMute() {
  muted.value = !muted.value
  if (master) master.gain.setTargetAtTime(muted.value ? 0 : 1, ctx.currentTime, 0.05)
  try {
    localStorage.setItem(SAVE_KEY, muted.value ? 'off' : 'on')
  } catch {
    // 保存できなくても、音のオンオフ自体は効く
  }
}

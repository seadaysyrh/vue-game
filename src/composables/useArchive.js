// ===== 記録室（アーカイブ）の解放状況 =====
// TIPS（用語集）と、見たスチル（CG）を、ブラウザに保存しておく。
// エンディングを見たかどうかは、ストアの visited（通った分岐）からわかるので、ここでは保存しない
import { ref } from 'vue'
import { TIPS } from '../data/tips'

const TIPS_KEY = 'after-school-rewrite:tips'
const STILLS_KEY = 'after-school-rewrite:stills'

function load(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key)) ?? [])
  } catch {
    return new Set()
  }
}
function save(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]))
  } catch {
    // 保存できなくても、遊ぶのには困らない
  }
}

// 関数の外に置いて、どの画面からでも同じものを共有する
// （Set の中身が変わったことを Vue に伝えるため、変えるたびに新しい Set を入れ直す）
const tips = ref(load(TIPS_KEY))
const stills = ref(load(STILLS_KEY))

export function useArchive() {
  // 本文に出てきた用語を解放する。新しく解放した TIPS を配列で返す（お知らせ表示用）
  function unlockTipsIn(text) {
    const found = TIPS.filter((t) => text.includes(t.keyword) && !tips.value.has(t.id))
    if (found.length) {
      tips.value = new Set([...tips.value, ...found.map((t) => t.id)])
      save(TIPS_KEY, tips.value)
    }
    return found
  }

  // スチルを「見た」ことにする
  function seeStill(name) {
    if (!name || stills.value.has(name)) return
    stills.value = new Set([...stills.value, name])
    save(STILLS_KEY, stills.value)
  }

  return { tips, stills, unlockTipsIn, seeStill }
}

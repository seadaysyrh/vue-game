// ===== 技術説明モードの「見終わった授業」 =====
// 授業の最後まで進んで目次に戻ったら、その授業のシーン ID を覚えておく（目次の ✓ と進み具合に使う）。
// 本編のセーブ（stores/game.js）とは別の名前で、ブラウザに保存する
import { ref } from 'vue'

const KEY = 'after-school-rewrite:lessons'

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY)) ?? [])
  } catch {
    return new Set()
  }
}

// 関数の外に置いて、目次とゲーム画面で同じものを共有する
// （Set の中身が変わったことを Vue に伝えるため、変えるたびに新しい Set を入れ直す）
const seen = ref(load())

export function useLessonProgress() {
  function markSeen(id) {
    if (seen.value.has(id)) return
    seen.value = new Set([...seen.value, id])
    try {
      localStorage.setItem(KEY, JSON.stringify([...seen.value]))
    } catch {
      // 保存できなくても、授業を見るのには困らない
    }
  }
  return { seen, markSeen }
}

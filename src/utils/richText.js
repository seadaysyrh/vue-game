// ===== 文字の装飾 =====
// シナリオの本文に、かんたんな記号で装飾を付けられるようにする
//   *ことば*  → 光る強調
//   ~ことば~  → ふるえる文字
// 本文を「1文字ずつの配列」に変換する。タイプライターは、この配列を前から順に表示する
const MARKS = { '*': 'em', '~': 'shake' }

export function parseRichText(text) {
  const chars = []
  let style = null
  for (const ch of text) {
    if (MARKS[ch]) {
      // 同じ記号が来たら装飾を終える、違えば始める
      style = style === MARKS[ch] ? null : MARKS[ch]
      continue
    }
    chars.push({ ch, style })
  }
  return chars
}

// 文字を出したあとに、どれだけ間をあけるか（ミリ秒）。句読点で少し止まると、読みやすく自然になる
export function pauseAfter(ch) {
  if ('。！？!?'.includes(ch)) return 320
  if ('、，,'.includes(ch)) return 160
  if ('…―—'.includes(ch)) return 90
  return 32
}

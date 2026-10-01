// ===== 世界線の樹形図（ルート分岐のデータ） =====
// scenario.js のシーンをたどって、「選択肢の分かれ道」だけを木の形に組み立てる。
// シナリオを書き換えると、分岐図も自動で変わる。
//
// ノードの形：
//   key        : そこまでの選び方。選んだ選択肢の番号を並べた文字列（'' = 最初、'10' = 1つ目で2番、2つ目で1番）
//   type       : 'choice'（選択肢のあるシーン）か 'ending'（エンディング）
//   sceneId    : 選択肢のあるシーンの ID（type が 'choice' のとき）
//   ending     : エンディングの ID（type が 'ending' のとき。scenario.js の endings のキー）
//   choiceText : そのノードに来るために選んだ選択肢の文章
//   children   : 次の分かれ道
import { scenes, getEndingType } from './scenario'

// next をたどって、次の「選択肢があるシーン」か「end のシーン」を探す
function findNextStop(sceneId) {
  let id = sceneId
  while (!scenes[id].choices && !scenes[id].end) {
    id = scenes[id].next
  }
  return id
}

function buildNode(sceneId, key, choiceText) {
  const stopId = findNextStop(sceneId)
  const stop = scenes[stopId]

  if (stop.end) {
    return { key, type: 'ending', ending: getEndingType(key), choiceText, children: [] }
  }

  return {
    key,
    type: 'choice',
    sceneId: stopId,
    choiceText,
    // 選択肢ごとに、その先の木を作る（関数が自分自身を呼ぶ「再帰」）
    children: stop.choices.map((choice, i) => buildNode(choice.next, key + i, choice.text)),
  }
}

export const routeTree = buildNode('start', '', null)

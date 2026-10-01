# 放課後リライト（Vue 3 + Vue Router + Pinia 学習用）

過去にメッセージを送れる装置〈リライター〉で、世界が書き換わってしまう SF ノベルゲームです。
ずんだもんと四国めたんが登場します。3回の選択の組み合わせ（2×2×2）で、エンディングが8種類に分かれます。

## 動かし方

```
npm install
npm run dev
```

## ファイル構成

```
public/images/          画像素材（bg：背景、chara：立ち絵、still：スチル＝1枚絵）
src/
├─ main.js              アプリの入り口（Pinia と Router を登録）
├─ App.vue              <RouterView /> と全体のスタイル
├─ router/index.js      URL とページの対応表
├─ stores/game.js       Pinia ストア（ゲームの進行状況）
├─ data/scenario.js     シナリオ（セリフ・選択肢・エンディング）
├─ data/routeTree.js    シナリオから組み立てた「世界線の樹形図」
├─ data/movies.js       ムービー（カットの並び）
├─ composables/audioCore.js 音の土台（AudioContext と消音の共有）
├─ composables/useSound.js  効果音（Web Audio API で生成）
├─ composables/useMusic.js  BGM（コード進行から自動演奏）
├─ utils/richText.js    *強調* と ~ふるえ~ の文字装飾
├─ components/effects/  派手な演出の部品（下の表を参照）
├─ views/               ページ（URL ごとに切り替わる）
│  ├─ TitleView.vue     /
│  ├─ GameView.vue      /game         ← 演出の中心
│  ├─ EndingView.vue    /ending/:type
│  ├─ CreditsView.vue   /credits
│  └─ RouteView.vue     /route         ← 世界線分岐図
└─ components/          ページの中で使う部品
   ├─ StageLayer.vue    背景＋立ち絵（<Transition> でフェード）
   ├─ NixieMeter.vue    〈観測計〉（watch で数字がパラパラ回る）
   ├─ RouteCapture.vue  分岐図のキャプチャ（未到達は NO SIGNAL）
   ├─ MoviePlayer.vue   ムービー再生（カットを時間どおりに切り替える）
   ├─ DigitRain.vue     数字の雨（canvas）
   ├─ CharaSprite.vue   生きて動く立ち絵（まばたき・口パク・呼吸）
   ├─ AmbientLayer.vue  空気感の粒子（canvas）
   └─ LocationCard.vue  場所と時刻のテロップ
   ├─ MessageBox.vue    メッセージ欄
   └─ ChoiceList.vue    選択肢
```

## 読む順番

1. `main.js` → `router/index.js` → `App.vue`（ページが切り替わるしくみ）
2. `data/scenario.js`（データの形）
3. `stores/game.js`（データをどう進めるか）
4. `views/GameView.vue`（タイプライター・グリッチの演出）
5. `components/`（部品）

## 学べること

### Vue Router

| 機能 | 場所 |
|---|---|
| `<RouterView />`：ページの表示場所 | App.vue |
| `router.push()`：コードでページ移動 | TitleView.vue / GameView.vue |
| `<RouterLink>`：リンクでページ移動 | EndingView.vue / CreditsView.vue |
| `:type` と `route.params`：URL から値を受け取る | router/index.js / EndingView.vue |

### Pinia

| Pinia | コンポーネントでいうと | 例 |
|---|---|---|
| `state` | `ref` | sceneId, lineIndex, path, visited |
| `getters` | `computed` | line, showChoices, endingType |
| `actions` | 普通の関数 | next(), choose(), reset() |

### 演出に使っている Vue の機能

| 演出 | 使っている機能 | 場所 |
|---|---|---|
| 1文字ずつ表示 | `ref` + `computed` + `watch` + `setInterval` | GameView.vue |
| 画面のグリッチ | `watch` でシーン変化を見て、`:class` で CSS アニメを付ける | GameView.vue |
| 観測計の数字が回る | `watch` で props の変化を見る | NixieMeter.vue |
| 背景・立ち絵のフェード | `<Transition>` と `:key`（立ち絵は `mode="out-in"` で重ならないように） | StageLayer.vue |
| 残響（透けて点滅） | props の `echo` で `:class` を切り替え | StageLayer.vue |

### 世界線分岐図（/route）

| しくみ | 使っている機能 | 場所 |
|---|---|---|
| シナリオから分岐の木を作る | 自分自身を呼ぶ関数（再帰） | data/routeTree.js |
| 通った分岐を覚える | ストアの `visited` と `localStorage` | stores/game.js |
| カードと線を並べる | `v-for` と `:style` で位置指定、線は SVG | RouteView.vue |
| 「ここから再開」 | ストアの `jumpTo()` → `router.push('/game')` | RouteView.vue |
| キャプチャ | `StageLayer` を小さい箱の中で使い回す | RouteCapture.vue |

### スチル・ムービー・効果音

| しくみ | 使っている機能 | 場所 |
|---|---|---|
| スチル（1枚絵） | セリフに `still: '〇〇'`。`<Transition>` で白く光って登場 | scenario.js / StageLayer.vue |
| ムービー | カットのデータを `setTimeout` で順番に表示。カメラの動きは CSS アニメ | movies.js / MoviePlayer.vue |
| ムービーの開始 | ストアの `movie`。シーンに `movie` があると `goToScene` で再生 | stores/game.js |
| 数字の雨 | `<canvas>` と `requestAnimationFrame`。`onUnmounted` で止める | DigitRain.vue |
| 揺れ・フラッシュ | セリフに `fx: 'shake'`。`:class` で CSS アニメを付ける | GameView.vue |
| 効果音 | コンポーザブル `useSound()`。音声ファイルなしで音を合成 | composables/useSound.js |

### 生きているような演出

| 演出 | しくみ | 場所 |
|---|---|---|
| まばたき・口パク | 「基本・目閉じ・口違い」の3枚を重ね、上の2枚を出したり消したりする | CharaSprite.vue |
| 呼吸 | 足元を支点に、ほんの少し伸び縮みする CSS アニメ | CharaSprite.vue |
| 視差（奥行き） | マウス位置を CSS 変数 `--mx` `--my` で渡し、背景と立ち絵を逆向きにずらす | GameView.vue / StageLayer.vue |
| カメラが寄る | セリフに `camera: 'close'`。全体を拡大して背景だけぼかす | StageLayer.vue |
| 空気の粒子 | シーンの `ambient`。canvas に光の粒を描き続ける | AmbientLayer.vue |
| 場所テロップ | シーンの `place`。`:key` をシーン ID にして、シーンごとに出し直す | LocationCard.vue |
| 文字の演出 | 本文を1文字ずつの配列にして、文字ごとに CSS アニメ。句読点で少し止まる | richText.js / MessageBox.vue |
| BGM | シーンの `bgm`。先読みスケジューラで、少し先の音符を予約し続ける | useMusic.js |
| 選択肢 | `choiceStyle: 'message'` でスマホ送信画面。選ぶ間は世界の色が抜ける | ChoiceList.vue |

### 派手な演出（components/effects/）

| 演出 | しくみ | 部品 |
|---|---|---|
| チャプターカード | 番号を回して止め、文字を1文字ずつ下から切り出し、横の帯に割れて消える | ChapterCard.vue |
| カメラワーク | `camera: 'push' / 'dutch' / 'pan' / 'close'` を CSS クラスにして transform を変える。手持ち揺れは別の箱で動かす | StageLayer.vue |
| 衝撃波 | 色で「ずらす量」を描いた画像を作り、SVG の feDisplacementMap で画面を歪める | FxShockwave.vue |
| 色収差グリッチ | SVG フィルターで赤・緑・青をずらして重ねる | FxFilters.vue |
| 集中線 | canvas に中心へ向かう細い三角形を描き直し続ける | FxBurst.vue |
| 光の筋 | ぼかした細長い帯を `mix-blend-mode: screen` で重ねて揺らす | LightRays.vue |
| 観測計の大写し | NixieMeter 部品を CSS で拡大し、光の輪と走査線を重ねる | MeterBurst.vue |
| シネマ字幕 | `cinema: true` のセリフは、黒帯を入れて画面中央に大きく出す | CinemaText.vue |
| 目のアップ（カットイン） | 立ち絵部品を巨大に拡大し、`data/faces.js` の目の位置が帯の中心に来るようにずらす。まばたき・口パクもそのまま動く | CutIn.vue |
| 携帯演出 | ロック画面の通知・トーク画面・履歴が消える演出。`{choice0}` は実際に選んだ文章に置き換わる | PhoneScreen.vue |
| 光漏れ | ぼかした色の光を `mix-blend-mode: screen` で流す | LightLeak.vue |
| ホイップ・クラッシュズーム・ピント送り | セリフの `fx` を CSS クラスにして、ブレ・急な拡大・ぼかしを付ける | GameView.vue |
| 色調補正・黒帯 | シーンの `grade`（CSS filter）と `scope` | GameView.vue |

## 素材について

- キャラクター：ずんだもん・四国めたん（[東北ずん子・ずんだもんPJ ガイドライン](https://zunko.jp/guideline.html)に沿って非商用で利用）
- 立ち絵：坂本アヒル「ずんだもん立ち絵素材V3.2」「四国めたん立ち絵素材2.1」
  （PSD のレイヤーを切り替えて、表情ごとに PNG に書き出したもの）
- スチル：上記の立ち絵と背景を合成・加工して作ったもの（`public/images/still`）
- 背景：Potat0Master「Free Visual Novel Backgrounds (School Mini Pack 1)」
  （改変・ゲームへの組み込みは OK。**素材そのものの再配布は禁止**なので、`public/images` だけを配ったりしないこと）

## 改造してみよう

- `scenario.js` にシーンを足す（背景は `public/images/bg` に置いて名前を書くだけ）
- 選択肢によって観測計の数字を変える
- ストアに `log: []` を追加して、バックログ画面（新しいページ）を作る

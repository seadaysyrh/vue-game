// ===== 図解のデータ =====
// 技術説明モードの図（components/effects/LessonDiagram.vue）と、
// 目次のサムネイル（components/DiagramThumb.vue）の両方から使う
//   nodes : 箱 { id, x, y, w, h, label, sub, top / bottom（名前を箱の上・下の端に出す）, dashed（点線の枠） }（座標は viewBox 400×250 の中）
//   edges : 矢印 { id, d（SVG のパス）, label, lx, ly, both（両向き） }
//   pulse : 光の点が流れる道すじ { path, dur }（データの流れを見せる）
const tree = (x, label, sub) => ({ id: label, x, y: 92, w: 74, h: 44, label, sub })

// ===== シーケンス図：縦の点線（登場人物）と、横の矢印（やりとり）で、順番を見せる =====
//   lanes : [{ id, label, sub }]（左から順に、3人まで）
//   steps : [{ id, from, to, y, label }]（from / to は lanes の番号。y は上からの位置）
//   extra : { nodes, edges, pulse }（ほかに足したい箱や線）
const LANE_X = [63, 200, 337]
function seq(title, lanes, steps, extra = {}) {
  return {
    title,
    nodes: [
      ...lanes.map((l, i) => ({ id: l.id, x: LANE_X[i] - 58, y: 6, w: 116, h: 46, label: l.label, sub: l.sub })),
      ...(extra.nodes ?? []),
    ],
    edges: [
      ...lanes.map((l, i) => ({ id: l.id, d: `M${LANE_X[i]} 52 L${LANE_X[i]} 246`, plain: true, dashed: true })),
      ...steps.map((st) => {
        const dir = st.to > st.from ? 1 : -1
        return {
          id: st.id,
          d: `M${LANE_X[st.from] + dir * 4} ${st.y} L${LANE_X[st.to] - dir * 4} ${st.y}`,
          label: st.label,
          lx: (LANE_X[st.from] + LANE_X[st.to]) / 2,
          ly: st.y - 6,
          anchor: 'middle',
        }
      }),
      ...(extra.edges ?? []),
    ],
    pulse: extra.pulse,
  }
}

export const DIAGRAMS = {
  flow: {
    title: 'このゲームの動くしくみ',
    nodes: [
      { id: 'data', x: 8, y: 60, w: 112, h: 56, label: 'scenario.js', sub: 'セリフのデータ' },
      { id: 'store', x: 144, y: 60, w: 112, h: 56, label: 'Pinia ストア', sub: 'いま何番目？' },
      { id: 'view', x: 280, y: 60, w: 112, h: 56, label: 'GameView', sub: '画面に出す' },
      { id: 'click', x: 144, y: 176, w: 112, h: 48, label: 'クリック', sub: 'next() で1つ進む' },
    ],
    edges: [
      { id: 'data', d: 'M120 88 L144 88' },
      { id: 'view', d: 'M256 88 L280 88' },
      { id: 'click', d: 'M336 116 L336 200 L256 200' },
      { id: 'click', d: 'M200 176 L200 116' },
    ],
    pulse: { path: 'M64 88 L336 88 L336 200 L200 200 L200 88 L64 88', dur: '4s' },
  },
  tree: {
    title: 'GameView の部品',
    nodes: [
      { id: 'GameView', x: 140, y: 8, w: 120, h: 44, label: 'GameView', sub: 'ゲーム画面（親）' },
      tree(4, 'StageLayer', '背景・立ち絵'),
      tree(84, 'MessageBox', 'メッセージ欄'),
      tree(164, 'ChoiceList', '選択肢'),
      tree(244, 'NixieMeter', '観測計'),
      tree(322, 'HoloTerminal', 'この端末'),
      { id: 'CharaSprite', x: 4, y: 186, w: 74, h: 44, label: 'CharaSprite', sub: '立ち絵1枚' },
    ],
    edges: [
      ...[41, 121, 201, 281, 359].map((cx) => ({ id: 'tree', d: `M200 52 L200 72 L${cx} 72 L${cx} 92` })),
      { id: 'tree', d: 'M41 136 L41 186' },
    ],
  },
  reactive: {
    title: 'ref と computed',
    nodes: [
      { id: 'ref', x: 8, y: 14, w: 124, h: 64, label: 'ref', sub: 'typedLength' },
      { id: 'computed', x: 8, y: 160, w: 124, h: 64, label: 'computed', sub: 'isTyping' },
      { id: 'screen', x: 214, y: 56, w: 178, h: 128, label: '画面', sub: '', top: true },
    ],
    edges: [
      { id: 'ref', d: 'M132 46 L214 92', label: '変わった！', lx: 176, ly: 56 },
      { id: 'computed', d: 'M70 78 L70 160', label: '計算し直す', lx: 76, ly: 124 },
      { id: 'computed', d: 'M132 192 L214 150' },
    ],
  },
  directive: {
    title: 'v-if と v-for',
    nodes: [
      { id: 'if', x: 8, y: 30, w: 180, h: 52, label: 'v-if="choosing"', sub: '' },
      { id: 'for', x: 212, y: 30, w: 180, h: 52, label: 'v-for="c in choices"', sub: '' },
    ],
    edges: [
      { id: 'if', d: 'M98 82 L98 112' },
      { id: 'for', d: 'M302 82 L302 112' },
    ],
  },
  props: {
    title: 'props と emit',
    nodes: [
      { id: 'parent', x: 120, y: 10, w: 160, h: 52, label: 'GameView', sub: '親' },
      { id: 'child', x: 120, y: 188, w: 160, h: 52, label: 'ChoiceList', sub: '子' },
    ],
    edges: [
      { id: 'props', d: 'M168 62 L168 188', label: 'props：選択肢を渡す', lx: 160, ly: 128, anchor: 'end' },
      { id: 'emit', d: 'M232 188 L232 62', label: 'emit：選ばれた！', lx: 240, ly: 128, anchor: 'start' },
    ],
  },
  watch: {
    title: 'watch（見張り番）',
    nodes: [
      { id: 'value', x: 8, y: 52, w: 112, h: 60, label: 'game.line', sub: 'セリフが変わる' },
      { id: 'watch', x: 144, y: 52, w: 112, h: 60, label: 'watch', sub: '見張り番' },
      { id: 'action', x: 280, y: 52, w: 112, h: 60, label: 'playFx()', sub: '画面を揺らす' },
      { id: 'computed', x: 8, y: 160, w: 184, h: 60, label: 'computed', sub: '新しい「値」を作る' },
      { id: 'watch2', x: 208, y: 160, w: 184, h: 60, label: 'watch', sub: '変わったら「動く」' },
    ],
    edges: [
      { id: 'watch', d: 'M120 82 L144 82' },
      { id: 'action', d: 'M256 82 L280 82' },
    ],
  },
  pinia: {
    title: 'Pinia（みんなの共有データ）',
    nodes: [
      { id: 'store', x: 130, y: 96, w: 140, h: 58, label: 'Pinia ストア', sub: 'sceneId・lineIndex・path' },
      { id: 'title', x: 8, y: 10, w: 104, h: 44, label: 'TitleView', sub: 'タイトル' },
      { id: 'game', x: 288, y: 10, w: 104, h: 44, label: 'GameView', sub: 'ゲーム画面' },
      { id: 'route', x: 8, y: 196, w: 104, h: 44, label: 'RouteView', sub: '分岐図' },
      { id: 'ending', x: 288, y: 196, w: 104, h: 44, label: 'EndingView', sub: 'エンディング' },
    ],
    edges: [
      { id: 'title', d: 'M112 46 L150 96', both: true },
      { id: 'game', d: 'M288 46 L250 96', both: true },
      { id: 'route', d: 'M112 204 L150 154', both: true },
      { id: 'ending', d: 'M288 204 L250 154', both: true },
    ],
  },
  router: {
    title: 'Vue Router（URL とページの対応表）',
    nodes: [
      ['title', '/', 'TitleView', 'タイトル'],
      ['game', '/game', 'GameView', 'ゲーム画面'],
      ['ending', '/ending/:type', 'EndingView', 'エンディング'],
      ['credits', '/credits', 'CreditsView', 'クレジット'],
    ].flatMap(([id, url, page, sub], i) => [
      { id, x: 8, y: 12 + i * 58, w: 150, h: 44, label: url, sub: 'URL', mono: true },
      { id, x: 242, y: 12 + i * 58, w: 150, h: 44, label: page, sub },
    ]),
    edges: ['title', 'game', 'ending', 'credits'].map((id, i) => ({ id, d: `M158 ${34 + i * 58} L242 ${34 + i * 58}` })),
  },

  // ===== ここから「Web の道具編」 =====
  web: {
    title: 'Web ページの3つの材料',
    nodes: [
      { id: 'html', x: 8, y: 16, w: 120, h: 60, label: 'HTML', sub: '骨組み（何があるか）' },
      { id: 'css', x: 140, y: 16, w: 120, h: 60, label: 'CSS', sub: '見た目（色・配置）' },
      { id: 'js', x: 272, y: 16, w: 120, h: 60, label: 'JavaScript', sub: '動き（押したら…）' },
      { id: 'browser', x: 100, y: 164, w: 200, h: 64, label: 'ブラウザ', sub: '3つを読んで画面にする' },
    ],
    edges: [
      { id: 'html', d: 'M68 76 L150 164' },
      { id: 'css', d: 'M200 76 L200 164' },
      { id: 'js', d: 'M332 76 L250 164' },
    ],
  },
  npm: {
    title: 'npm（道具の倉庫）',
    nodes: [
      { id: 'registry', x: 8, y: 14, w: 150, h: 60, label: 'npm の倉庫', sub: '世界中の道具（パッケージ）' },
      { id: 'pkg', x: 242, y: 14, w: 150, h: 60, label: 'package.json', sub: '使う道具のリスト', mono: true },
      { id: 'install', x: 125, y: 112, w: 150, h: 40, label: 'npm install', mono: true },
      { id: 'nm', x: 125, y: 190, w: 150, h: 52, label: 'node_modules', sub: '道具が届く場所', mono: true },
    ],
    edges: [
      { id: 'registry', d: 'M83 74 L165 112', label: 'ダウンロード', lx: 70, ly: 102, anchor: 'middle' },
      { id: 'pkg', d: 'M317 74 L235 112', label: 'リストを読む', lx: 330, ly: 102, anchor: 'middle' },
      { id: 'nm', d: 'M200 152 L200 190' },
    ],
    pulse: { path: 'M83 74 L165 112 L200 130 L200 190', dur: '2.4s' },
  },
  modules: {
    title: 'import でつながるファイル',
    nodes: [
      { id: 'index', x: 140, y: 4, w: 120, h: 36, label: 'index.html', mono: true },
      { id: 'main', x: 140, y: 66, w: 120, h: 36, label: 'main.js', mono: true },
      { id: 'app', x: 14, y: 132, w: 112, h: 36, label: 'App.vue', mono: true },
      { id: 'router', x: 144, y: 132, w: 112, h: 36, label: 'router', mono: true },
      { id: 'pinia', x: 274, y: 132, w: 112, h: 36, label: 'pinia', mono: true },
      { id: 'views', x: 130, y: 200, w: 140, h: 44, label: 'TitleView.vue', sub: 'GameView.vue …', mono: true },
    ],
    edges: [
      { id: 'main', d: 'M200 40 L200 66', label: '<script src>', lx: 208, ly: 58 },
      { id: 'import', d: 'M170 102 L70 132', label: 'import', lx: 100, ly: 112, anchor: 'middle' },
      { id: 'import', d: 'M200 102 L200 132' },
      { id: 'import', d: 'M230 102 L330 132', label: 'import', lx: 300, ly: 112, anchor: 'middle' },
      { id: 'import', d: 'M200 168 L200 200' },
    ],
    pulse: { path: 'M200 40 L200 132 L200 200', dur: '2.4s' },
  },
  dev: {
    title: 'Vite の開発サーバー',
    nodes: [
      { id: 'edit', x: 8, y: 30, w: 110, h: 60, label: 'ファイルを保存', sub: 'scenario.js など' },
      { id: 'vite', x: 145, y: 30, w: 110, h: 60, label: 'Vite', sub: '変わった所を見つける' },
      { id: 'browser', x: 282, y: 30, w: 110, h: 60, label: 'ブラウザ', sub: 'そこだけ差し替え' },
      { id: 'cmd', x: 8, y: 160, w: 384, h: 60, label: 'npm run dev', sub: '→ http://localhost:5173 で開ける', mono: true },
    ],
    edges: [
      { id: 'vite', d: 'M118 60 L145 60' },
      { id: 'browser', d: 'M255 60 L282 60', label: 'HMR', lx: 268, ly: 24, anchor: 'middle' },
      { id: 'cmd', d: 'M200 160 L200 90', label: 'Vite を起動', lx: 208, ly: 130 },
    ],
    pulse: { path: 'M63 60 L337 60', dur: '1.6s' },
  },
  build: {
    title: 'vite build（ビルド）',
    nodes: [
      { id: 'src', x: 8, y: 30, w: 124, h: 60, label: 'src/', sub: '.vue・.js（人が読む形）', mono: true },
      { id: 'public', x: 8, y: 140, w: 124, h: 60, label: 'public/', sub: '画像・動画（そのまま）', mono: true },
      { id: 'build', x: 152, y: 84, w: 92, h: 60, label: 'vite build', sub: 'まとめて変換', mono: true },
      { id: 'dist', x: 264, y: 8, w: 128, h: 234, label: 'dist/', top: true, mono: true },
      { id: 'dist', x: 274, y: 40, w: 108, h: 34, label: 'index.html', mono: true },
      { id: 'dist', x: 274, y: 86, w: 108, h: 34, label: 'index-xxxx.js', mono: true },
      { id: 'dist', x: 274, y: 132, w: 108, h: 34, label: 'index-xxxx.css', mono: true },
      { id: 'dist', x: 274, y: 178, w: 108, h: 34, label: 'images/ …', mono: true },
    ],
    edges: [
      { id: 'src', d: 'M132 60 L152 100' },
      { id: 'public', d: 'M132 170 L152 128' },
      { id: 'build', d: 'M244 114 L264 114' },
    ],
    pulse: { path: 'M70 60 L132 60 L198 114 L274 114', dur: '2.2s' },
  },
  deploy: {
    title: '公開（デプロイ）',
    nodes: [
      { id: 'dist', x: 8, y: 94, w: 110, h: 60, label: 'dist/', sub: 'できあがり', mono: true },
      { id: 'server', x: 145, y: 94, w: 110, h: 60, label: 'サーバー', sub: 'GitHub Pages など' },
      { id: 'user', x: 282, y: 14, w: 110, h: 48, label: 'スマホ', sub: 'URL を開くだけ' },
      { id: 'user', x: 282, y: 100, w: 110, h: 48, label: 'パソコン', sub: 'URL を開くだけ' },
      { id: 'user', x: 282, y: 186, w: 110, h: 48, label: 'タブレット', sub: 'URL を開くだけ' },
    ],
    edges: [
      { id: 'server', d: 'M118 124 L145 124', label: 'アップロード', lx: 131, ly: 84, anchor: 'middle' },
      { id: 'user', d: 'M255 110 L282 40' },
      { id: 'user', d: 'M255 124 L282 124' },
      { id: 'user', d: 'M255 138 L282 210' },
    ],
    pulse: { path: 'M63 124 L268 124 L337 124', dur: '2s' },
  },

  // ===== ここから「HTML・CSS 編」 =====
  dom: {
    title: 'HTML は入れ子（メッセージ欄）',
    nodes: [
      { id: 'message', x: 130, y: 6, w: 140, h: 44, label: '<div class="message">', sub: 'いちばん外の箱', mono: true },
      { id: 'speaker', x: 6, y: 96, w: 120, h: 44, label: '<div class="speaker">', sub: '名前', mono: true },
      { id: 'p', x: 140, y: 96, w: 120, h: 44, label: '<p>', sub: '本文', mono: true },
      { id: 'hint', x: 274, y: 96, w: 120, h: 44, label: '<span class="hint">', sub: '▼', mono: true },
      { id: 'span', x: 116, y: 190, w: 52, h: 44, label: '<span>', sub: '待', mono: true },
      { id: 'span', x: 174, y: 190, w: 52, h: 44, label: '<span>', sub: 'っ', mono: true },
      { id: 'span', x: 232, y: 190, w: 52, h: 44, label: '<span>', sub: 'て', mono: true },
    ],
    edges: [
      { id: 'speaker', d: 'M200 50 L200 72 L66 72 L66 96' },
      { id: 'p', d: 'M200 50 L200 96' },
      { id: 'hint', d: 'M200 50 L200 72 L334 72 L334 96' },
      { id: 'span', d: 'M200 140 L200 162 L142 162 L142 190' },
      { id: 'span', d: 'M200 140 L200 190' },
      { id: 'span', d: 'M200 140 L200 162 L258 162 L258 190' },
    ],
  },
  box: {
    title: 'ボックスモデル（箱の4つの層）',
    nodes: [
      { id: 'margin', x: 6, y: 6, w: 388, h: 238, label: 'margin（外側の余白）', top: true, dashed: true },
      { id: 'border', x: 36, y: 34, w: 328, h: 182, label: 'border（枠線）', top: true },
      { id: 'padding', x: 62, y: 62, w: 276, h: 126, label: 'padding（内側の余白）', top: true },
      { id: 'content', x: 100, y: 96, w: 200, h: 64, label: 'content（中身）', sub: 'セリフの文字' },
    ],
    edges: [],
  },
  flex: {
    title: 'display: flex（横に並べる）',
    nodes: [
      { id: 'container', x: 6, y: 20, w: 388, h: 140, label: '<nav>  display: flex;', top: true, mono: true },
      { id: 'item', x: 26, y: 70, w: 104, h: 60, label: 'WORLDLINE', sub: '子 1', mono: true },
      { id: 'item', x: 148, y: 70, w: 104, h: 60, label: 'ARCHIVE', sub: '子 2', mono: true },
      { id: 'item', x: 270, y: 70, w: 104, h: 60, label: 'CREDITS', sub: '子 3', mono: true },
    ],
    edges: [
      { id: 'axis', d: 'M26 196 L374 196', label: '並ぶ向き（flex-direction: row）', lx: 200, ly: 222, anchor: 'middle' },
      { id: 'gap', d: 'M130 146 L148 146', both: true, label: 'gap', lx: 139, ly: 158, anchor: 'middle' },
    ],
  },
  layers: {
    title: 'z-index（画面の重なり）',
    nodes: [
      { id: 'bg', x: 8, y: 160, w: 210, h: 80, label: '背景・立ち絵（z-index なし）', bottom: true },
      { id: 'hud', x: 48, y: 124, w: 210, h: 80, label: 'HUD・端末（1）', bottom: true },
      { id: 'message', x: 88, y: 88, w: 210, h: 80, label: 'メッセージ欄（2）', bottom: true },
      { id: 'choices', x: 128, y: 52, w: 210, h: 80, label: '選択肢（4）', bottom: true },
      { id: 'movie', x: 168, y: 16, w: 210, h: 80, label: 'ムービー（10）', bottom: true },
    ],
    edges: [
      { id: 'axis', d: 'M380 236 L380 24', label: '数字が大きいほど手前', lx: 372, ly: 14, anchor: 'end' },
    ],
  },

  // ===== ここから「Web のしくみ編」「CSS もっと編」 =====
  http: {
    title: 'Web ページが届くまで',
    nodes: [
      { id: 'browser', x: 8, y: 14, w: 120, h: 64, label: 'ブラウザ', sub: 'URL を開く' },
      { id: 'server', x: 272, y: 14, w: 120, h: 64, label: 'サーバー', sub: 'ファイルを持っている' },
      { id: 'files', x: 8, y: 180, w: 90, h: 44, label: 'index.html', sub: '1番目', mono: true },
      { id: 'files', x: 106, y: 180, w: 90, h: 44, label: 'index-xxxx.js', sub: '2番目', mono: true },
      { id: 'files', x: 204, y: 180, w: 90, h: 44, label: 'index-xxxx.css', sub: '2番目', mono: true },
      { id: 'files', x: 302, y: 180, w: 90, h: 44, label: 'images/…', sub: 'そのあと', mono: true },
    ],
    edges: [
      { id: 'request', d: 'M128 36 L272 36', label: 'リクエスト「ください」', lx: 200, ly: 28, anchor: 'middle' },
      { id: 'response', d: 'M272 60 L128 60', label: 'レスポンス「どうぞ」', lx: 200, ly: 78, anchor: 'middle' },
      { id: 'files', d: 'M68 78 L68 180', label: 'HTML を読んで、必要なものを次々にリクエスト', lx: 76, ly: 140 },
    ],
    pulse: { path: 'M128 36 L272 36 L272 60 L128 60', dur: '2s' },
  },
  devtools: {
    title: '開発者ツール（F12 キー）',
    nodes: [
      { id: 'elements', x: 8, y: 10, w: 90, h: 46, label: 'Elements', sub: 'HTML と CSS', mono: true },
      { id: 'console', x: 106, y: 10, w: 90, h: 46, label: 'Console', sub: 'ログ・エラー', mono: true },
      { id: 'network', x: 204, y: 10, w: 90, h: 46, label: 'Network', sub: '通信の記録', mono: true },
      { id: 'application', x: 302, y: 10, w: 90, h: 46, label: 'Application', sub: '保存データ', mono: true },
      { id: 'panel', x: 8, y: 76, w: 384, h: 164, label: 'ページを開いたまま、裏側をのぞける', sub: 'Mac は ⌥ + ⌘ + I', top: false },
    ],
    edges: [
      { id: 'elements', d: 'M53 56 L53 76' },
      { id: 'console', d: 'M151 56 L151 76' },
      { id: 'network', d: 'M249 56 L249 76' },
      { id: 'application', d: 'M347 56 L347 76' },
    ],
  },
  grid: {
    title: 'display: grid（マス目に並べる）',
    nodes: [
      { id: 'container', x: 6, y: 6, w: 388, h: 238, label: 'grid-template-columns: repeat(3, 1fr);', top: true, mono: true },
      { id: 'col', x: 22, y: 40, w: 108, h: 90, label: '1fr', sub: '1列目', mono: true },
      { id: 'cell', x: 146, y: 40, w: 108, h: 90, label: '1fr', sub: '2列目', mono: true },
      { id: 'cell', x: 270, y: 40, w: 108, h: 90, label: '1fr', sub: '3列目', mono: true },
      { id: 'col', x: 22, y: 142, w: 108, h: 90, label: '4', sub: '自動で次の行へ', mono: true },
      { id: 'cell', x: 146, y: 142, w: 108, h: 90, label: '5', mono: true },
      { id: 'cell', x: 270, y: 142, w: 108, h: 90, label: '6', mono: true },
    ],
    edges: [],
  },
  responsive: {
    title: 'レスポンシブ（画面の幅で変える）',
    nodes: [
      { id: 'pc', x: 8, y: 20, w: 230, h: 150, label: 'パソコン（広い）', top: true },
      { id: 'pc', x: 22, y: 50, w: 96, h: 50, label: 'メニュー 1' },
      { id: 'pc', x: 128, y: 50, w: 96, h: 50, label: 'メニュー 2' },
      { id: 'pc', x: 22, y: 108, w: 96, h: 50, label: 'メニュー 3' },
      { id: 'pc', x: 128, y: 108, w: 96, h: 50, label: 'メニュー 4' },
      { id: 'sp', x: 270, y: 8, w: 122, h: 234, label: 'スマホ（せまい）', top: true },
      { id: 'sp', x: 282, y: 40, w: 98, h: 40, label: 'メニュー 1' },
      { id: 'sp', x: 282, y: 88, w: 98, h: 40, label: 'メニュー 2' },
      { id: 'sp', x: 282, y: 136, w: 98, h: 40, label: 'メニュー 3' },
      { id: 'sp', x: 282, y: 184, w: 98, h: 40, label: 'メニュー 4' },
    ],
    edges: [
      { id: 'media', d: 'M238 95 L270 95', label: '@media', lx: 254, ly: 200, anchor: 'middle' },
    ],
  },

  // ===== ここから「TypeScript 編」「AWS 編」 =====
  tscheck: {
    title: 'TypeScript の型チェック',
    nodes: [
      { id: 'ts', x: 8, y: 20, w: 110, h: 60, label: '.ts / .vue', sub: '型を書いたコード', mono: true },
      { id: 'tsc', x: 145, y: 20, w: 110, h: 60, label: '型チェック', sub: 'tsc / vue-tsc' },
      { id: 'js', x: 282, y: 20, w: 110, h: 60, label: '.js', sub: '型は消える', mono: true },
      { id: 'error', x: 145, y: 160, w: 110, h: 60, label: 'エラー', sub: '動かす前に見つかる' },
      { id: 'browser', x: 282, y: 160, w: 110, h: 60, label: 'ブラウザ', sub: 'JS だけを動かす' },
    ],
    edges: [
      { id: 'tsc', d: 'M118 50 L145 50' },
      { id: 'js', d: 'M255 50 L282 50', label: 'OK なら', lx: 268, ly: 14, anchor: 'middle' },
      { id: 'error', d: 'M200 80 L200 160', label: 'まちがい', lx: 208, ly: 124 },
      { id: 'browser', d: 'M337 80 L337 160' },
    ],
    pulse: { path: 'M63 50 L337 50 L337 190', dur: '2.4s' },
  },
  region: {
    title: 'リージョンと AZ',
    nodes: [
      { id: 'region', x: 6, y: 6, w: 388, h: 238, label: 'リージョン：ap-northeast-1（東京）', top: true },
      { id: 'az', x: 20, y: 40, w: 112, h: 190, label: 'AZ 1a', top: true, dashed: true },
      { id: 'az', x: 144, y: 40, w: 112, h: 190, label: 'AZ 1c', top: true, dashed: true },
      { id: 'az', x: 268, y: 40, w: 112, h: 190, label: 'AZ 1d', top: true, dashed: true },
      { id: 'app', x: 34, y: 110, w: 84, h: 56, label: 'サーバー', sub: '1台目' },
      { id: 'app', x: 158, y: 110, w: 84, h: 56, label: 'サーバー', sub: '2台目' },
      { id: 'stop', x: 282, y: 110, w: 84, h: 56, label: '（止まっても）', sub: 'ほかで動き続ける' },
    ],
    edges: [],
  },
  iam: {
    title: 'IAM（だれが・何をしてよいか）',
    nodes: [
      { id: 'user', x: 8, y: 10, w: 116, h: 60, label: 'IAM ユーザー', sub: '人（なるべく SSO で）' },
      { id: 'group', x: 8, y: 95, w: 116, h: 60, label: 'グループ', sub: 'ユーザーのまとまり' },
      { id: 'role', x: 8, y: 180, w: 116, h: 60, label: 'ロール', sub: '一時的に借りる権限' },
      { id: 'policy', x: 146, y: 95, w: 112, h: 60, label: 'ポリシー', sub: '許可の中身（JSON）' },
      { id: 'resource', x: 280, y: 95, w: 112, h: 60, label: 'S3・EC2 …', sub: 'AWS のリソース' },
    ],
    edges: [
      { id: 'user', d: 'M124 40 L146 112' },
      { id: 'group', d: 'M124 125 L146 125' },
      { id: 'role', d: 'M124 210 L146 138' },
      { id: 'resource', d: 'M258 125 L280 125', label: '許可', lx: 269, ly: 88, anchor: 'middle' },
    ],
  },
  oidc: {
    title: 'GitHub Actions から鍵なしでデプロイ（OIDC）',
    nodes: [
      { id: 'gha', x: 8, y: 94, w: 110, h: 60, label: 'GitHub Actions', sub: 'デプロイの作業' },
      { id: 'sts', x: 145, y: 14, w: 110, h: 60, label: 'AWS STS', sub: 'ロールを貸す係' },
      { id: 'role', x: 282, y: 14, w: 110, h: 60, label: 'IAM ロール', sub: '相手を確かめる' },
      { id: 'creds', x: 145, y: 174, w: 110, h: 60, label: '一時的な鍵', sub: '1時間ほどで失効' },
      { id: 's3', x: 282, y: 174, w: 110, h: 60, label: 'S3・CloudFront', sub: 'デプロイ先' },
    ],
    edges: [
      { id: 'gha', d: 'M118 110 L145 52', label: '① トークン', lx: 96, ly: 74 },
      { id: 'role', d: 'M255 44 L282 44', label: '② 確認', lx: 268, ly: 92, anchor: 'middle' },
      { id: 'creds', d: 'M200 74 L200 174', label: '③ 発行', lx: 208, ly: 128 },
      { id: 's3', d: 'M255 204 L282 204', label: '④', lx: 268, ly: 196, anchor: 'middle' },
    ],
    pulse: { path: 'M118 110 L145 52 L200 52 L200 204 L282 204', dur: '3s' },
  },
  staticsite: {
    title: 'このゲームを AWS で公開するなら',
    nodes: [
      { id: 'user', x: 8, y: 94, w: 90, h: 60, label: 'ユーザー', sub: 'ブラウザ' },
      { id: 'r53', x: 124, y: 10, w: 116, h: 54, label: 'Route 53', sub: 'ドメイン → 場所' },
      { id: 'cf', x: 124, y: 94, w: 116, h: 60, label: 'CloudFront', sub: 'CDN・HTTPS' },
      { id: 'acm', x: 124, y: 186, w: 116, h: 54, label: 'ACM', sub: 'SSL 証明書' },
      { id: 's3', x: 282, y: 94, w: 110, h: 60, label: 'S3', sub: 'dist を置く（非公開）' },
    ],
    edges: [
      { id: 'r53', d: 'M98 110 L124 44', label: '①', lx: 104, ly: 70 },
      { id: 'cf', d: 'M98 124 L124 124', label: '②', lx: 111, ly: 146, anchor: 'middle' },
      { id: 'acm', d: 'M182 186 L182 154' },
      { id: 's3', d: 'M240 124 L282 124', label: 'OAC', lx: 261, ly: 116, anchor: 'middle' },
    ],
    pulse: { path: 'M53 124 L337 124', dur: '2s' },
  },
  compute: {
    title: 'サーバーの借り方',
    nodes: [
      { id: 'ec2', x: 8, y: 20, w: 120, h: 76, label: 'EC2', sub: '仮想サーバー' },
      { id: 'ecs', x: 140, y: 20, w: 120, h: 76, label: 'ECS / Fargate', sub: 'コンテナ' },
      { id: 'lambda', x: 272, y: 20, w: 120, h: 76, label: 'Lambda', sub: '関数だけ' },
      { id: 'ec2', x: 8, y: 180, w: 120, h: 54, label: 'ずっと動かす', sub: 'OS の管理も自分' },
      { id: 'ecs', x: 140, y: 180, w: 120, h: 54, label: 'Docker で動かす', sub: 'OS は AWS まかせ' },
      { id: 'lambda', x: 272, y: 180, w: 120, h: 54, label: '呼ばれた時だけ', sub: '最大15分' },
    ],
    edges: [
      { id: 'axis', d: 'M20 138 L380 138', both: true, label: '自由度が高い ←　　　→ 管理がらく', lx: 200, ly: 162, anchor: 'middle' },
    ],
  },
  vpc: {
    title: 'VPC（自分専用のネットワーク）',
    nodes: [
      { id: 'vpc', x: 6, y: 6, w: 388, h: 238, label: 'VPC', top: true },
      { id: 'public', x: 20, y: 34, w: 360, h: 74, label: 'パブリックサブネット（インターネットとつながる）', top: true, dashed: true },
      { id: 'alb', x: 145, y: 58, w: 110, h: 42, label: 'ALB', sub: '入口' },
      { id: 'private', x: 20, y: 120, w: 360, h: 114, label: 'プライベートサブネット（外から入れない）', top: true, dashed: true },
      { id: 'app', x: 50, y: 154, w: 120, h: 60, label: 'アプリ', sub: 'ECS / EC2' },
      { id: 'db', x: 230, y: 154, w: 120, h: 60, label: 'RDS', sub: 'データベース' },
    ],
    edges: [
      { id: 'alb', d: 'M175 100 L130 154' },
      { id: 'sg', d: 'M170 184 L230 184', label: 'SG で許可', lx: 200, ly: 176, anchor: 'middle' },
    ],
  },
  authflow: {
    title: 'アプリのログイン（Cognito）',
    nodes: [
      { id: 'user', x: 8, y: 20, w: 100, h: 60, label: 'ユーザー', sub: 'ログインする' },
      { id: 'cognito', x: 150, y: 20, w: 110, h: 60, label: 'Cognito', sub: '本人か確かめる' },
      { id: 'jwt', x: 290, y: 20, w: 102, h: 60, label: 'トークン', sub: 'JWT・期限つき' },
      { id: 'api', x: 150, y: 160, w: 110, h: 60, label: 'API Gateway', sub: 'トークンを確認' },
      { id: 'lambda', x: 290, y: 160, w: 102, h: 60, label: 'Lambda', sub: '処理する' },
    ],
    edges: [
      { id: 'cognito', d: 'M108 50 L150 50' },
      { id: 'jwt', d: 'M260 50 L290 50' },
      { id: 'api', d: 'M58 80 L58 190 L150 190', label: 'トークンを付けて呼ぶ', lx: 66, ly: 140 },
      { id: 'lambda', d: 'M260 190 L290 190' },
    ],
    pulse: { path: 'M108 50 L341 50 L341 110 L58 110 L58 190 L341 190', dur: '4s' },
  },
  ops: {
    title: '監視・監査・コスト',
    nodes: [
      { id: 'cw', x: 8, y: 20, w: 120, h: 76, label: 'CloudWatch', sub: 'ログ・数値・アラーム' },
      { id: 'ct', x: 140, y: 20, w: 120, h: 76, label: 'CloudTrail', sub: 'だれが何をしたか' },
      { id: 'budgets', x: 272, y: 20, w: 120, h: 76, label: 'Budgets', sub: '使いすぎを知らせる' },
      { id: 'iac', x: 8, y: 140, w: 384, h: 84, label: 'IaC（CloudFormation・CDK・Terraform）', sub: '設定をコードで管理して、手作業をなくす' },
    ],
    edges: [],
  },
  // ===== AWS 編の図（認証まわりを中心に） =====
  authnz: {
    title: '認証と認可',
    nodes: [
      { id: 'person', x: 8, y: 95, w: 92, h: 60, label: 'ずんだもん', sub: '入りたい人' },
      { id: 'authn', x: 136, y: 18, w: 128, h: 74, label: '① 認証', sub: 'あなたはだれ？' },
      { id: 'authz', x: 136, y: 160, w: 128, h: 74, label: '② 認可', sub: '何をしてよい？' },
      { id: 'room', x: 300, y: 95, w: 92, h: 60, label: 'リソース', sub: 'S3・API など' },
    ],
    edges: [
      { id: 'authn', d: 'M100 112 L136 64', label: '社員証', lx: 92, ly: 78 },
      { id: 'authz', d: 'M200 92 L200 160', label: '本人とわかったら', lx: 208, ly: 130 },
      { id: 'room', d: 'M264 190 L300 136', label: '許された所だけ', lx: 272, ly: 182 },
    ],
    pulse: { path: 'M100 112 L136 64 L200 92 L200 160 L264 190 L300 136', dur: '3s' },
  },
  ticket: {
    title: '一度ログインしたら「入館証」',
    nodes: [
      { id: 'person', x: 8, y: 20, w: 92, h: 60, label: 'ユーザー', sub: 'ブラウザ' },
      { id: 'login', x: 140, y: 20, w: 120, h: 60, label: 'ログイン', sub: 'パスワード＋MFA' },
      { id: 'badge', x: 290, y: 20, w: 102, h: 60, label: '入館証', sub: 'トークン・期限つき' },
      { id: 'api', x: 140, y: 170, w: 120, h: 60, label: 'API ①', sub: '入館証を見せる' },
      { id: 'api', x: 290, y: 170, w: 102, h: 60, label: 'API ②', sub: '入館証を見せる' },
    ],
    edges: [
      { id: 'login', d: 'M100 50 L140 50', label: '1回だけ', lx: 120, ly: 42, anchor: 'middle' },
      { id: 'badge', d: 'M260 50 L290 50' },
      { id: 'api', d: 'M54 80 L54 200 L140 200', label: '毎回、入館証だけ見せる', lx: 62, ly: 140 },
      { id: 'api', d: 'M260 200 L290 200' },
    ],
  },
  authtwo: {
    title: '認証は2種類ある',
    nodes: [
      { id: 'aws', x: 8, y: 8, w: 186, h: 50, label: 'AWS を操作する側', sub: '開発者・CI・サーバー' },
      { id: 'aws', x: 8, y: 92, w: 186, h: 60, label: 'IAM・Identity Center', sub: 'AWS の API を使う権限' },
      { id: 'aws', x: 8, y: 186, w: 186, h: 56, label: '例：S3 にアップロード', sub: 'EC2 を作る・ログを見る' },
      { id: 'app', x: 206, y: 8, w: 186, h: 50, label: 'アプリを使う側', sub: 'ゲームのプレイヤー' },
      { id: 'app', x: 206, y: 92, w: 186, h: 60, label: 'Cognito など', sub: 'アプリのログイン' },
      { id: 'app', x: 206, y: 186, w: 186, h: 56, label: '例：セーブを保存', sub: '自分のデータだけ読む' },
    ],
    edges: [
      { id: 'aws', d: 'M101 58 L101 92' },
      { id: 'aws', d: 'M101 152 L101 186' },
      { id: 'app', d: 'M299 58 L299 92' },
      { id: 'app', d: 'M299 152 L299 186' },
    ],
  },
  keylife: {
    title: '鍵の寿命くらべ',
    nodes: [
      { id: 'key', x: 8, y: 40, w: 384, h: 54, label: 'アクセスキー（AKIA…）', sub: '消すまで、ずっと使える → もれたら使われ放題' },
      { id: 'temp', x: 8, y: 130, w: 104, h: 54, label: '一時的な鍵', sub: 'ASIA…・数時間' },
      { id: 'temp', x: 122, y: 130, w: 270, h: 54, label: 'ここから先は、もう使えない', sub: 'もれても被害は短い時間だけ', dashed: true },
    ],
    edges: [
      { id: 'axis', d: 'M8 222 L392 222', label: '時間 →', lx: 200, ly: 242, anchor: 'middle' },
    ],
  },
  sso: seq('SSO でログインする流れ', [
    { id: 'you', label: 'あなた', sub: 'CLI・ブラウザ' },
    { id: 'ic', label: 'Identity Center', sub: '会社のログイン' },
    { id: 'acct', label: 'AWS アカウント', sub: '開発・本番など' },
  ], [
    { id: 's1', from: 0, to: 1, y: 86, label: '① aws sso login' },
    { id: 's2', from: 1, to: 0, y: 126, label: '② ログイン・MFA' },
    { id: 's3', from: 1, to: 0, y: 166, label: '③ 一時的な鍵' },
    { id: 's4', from: 0, to: 2, y: 214, label: '④ 一時的な鍵で操作' },
  ]),
  secrets: {
    title: 'パスワードをコードに書かない',
    nodes: [
      { id: 'lambda', x: 8, y: 100, w: 110, h: 60, label: 'Lambda', sub: '実行ロールつき' },
      { id: 'sm', x: 145, y: 100, w: 110, h: 60, label: 'Secrets Manager', sub: 'パスワードを保管' },
      { id: 'db', x: 282, y: 100, w: 110, h: 60, label: 'RDS', sub: 'データベース' },
    ],
    edges: [
      { id: 'read', d: 'M118 120 L145 120', label: '① ロールで読む', lx: 131, ly: 94, anchor: 'middle' },
      { id: 'secret', d: 'M200 160 L200 200 L63 200 L63 160', label: '② パスワード', lx: 131, ly: 218, anchor: 'middle' },
      { id: 'connect', d: 'M63 100 L63 50 L337 50 L337 100', label: '③ DB に接続', lx: 200, ly: 42, anchor: 'middle' },
    ],
  },
  responsibility: {
    title: '責任共有モデル',
    nodes: [
      { id: 'you', x: 8, y: 8, w: 384, h: 40, label: 'データ・だれに見せるか' },
      { id: 'you', x: 8, y: 54, w: 384, h: 40, label: 'IAM の権限・セキュリティグループの設定' },
      { id: 'you', x: 8, y: 100, w: 384, h: 40, label: 'OS やアプリの更新（EC2 のとき）' },
      { id: 'aws', x: 8, y: 160, w: 384, h: 38, label: 'サーバーの機械・仮想化' },
      { id: 'aws', x: 8, y: 204, w: 384, h: 38, label: 'データセンターの建物・ネットワーク' },
    ],
    edges: [
      { id: 'line', d: 'M8 150 L392 150', plain: true, dashed: true, label: '↑ 使う側の責任　／　↓ AWS の責任', lx: 200, ly: 146, anchor: 'middle' },
    ],
  },
  policyeval: {
    title: 'ポリシーの判定',
    nodes: [
      { id: 'start', x: 130, y: 4, w: 140, h: 44, label: 'リクエスト', sub: '例：s3:PutObject' },
      { id: 'q1', x: 130, y: 72, w: 140, h: 44, label: 'Deny に当たる？' },
      { id: 'deny', x: 296, y: 72, w: 96, h: 44, label: '拒否', sub: 'Deny が最優先' },
      { id: 'q2', x: 130, y: 140, w: 140, h: 44, label: 'Allow に当たる？' },
      { id: 'allow', x: 296, y: 140, w: 96, h: 44, label: '許可' },
      { id: 'implicit', x: 130, y: 204, w: 140, h: 42, label: '拒否', sub: '何も書いてなければ' },
    ],
    edges: [
      { id: 'q1', d: 'M200 48 L200 72' },
      { id: 'deny', d: 'M270 94 L296 94', label: 'はい', lx: 283, ly: 88, anchor: 'middle' },
      { id: 'q2', d: 'M200 116 L200 140', label: 'いいえ', lx: 208, ly: 132 },
      { id: 'allow', d: 'M270 162 L296 162', label: 'はい', lx: 283, ly: 156, anchor: 'middle' },
      { id: 'implicit', d: 'M200 184 L200 204', label: 'いいえ', lx: 208, ly: 198 },
    ],
  },
  spa: seq('/game を開き直したとき', [
    { id: 'browser', label: 'ブラウザ', sub: '/game を再読み込み' },
    { id: 'cf', label: 'CloudFront', sub: 'エラーページの設定' },
    { id: 's3', label: 'S3', sub: 'game というファイルはない' },
  ], [
    { id: 'r1', from: 0, to: 1, y: 82, label: 'GET /game' },
    { id: 'r2', from: 1, to: 2, y: 112, label: 'GET /game' },
    { id: 'r3', from: 2, to: 1, y: 142, label: '403（ない）' },
    { id: 'r4', from: 1, to: 0, y: 172, label: 'index.html（200）' },
  ], {
    nodes: [{ id: 'router', x: 8, y: 196, w: 220, h: 48, label: 'Vue Router が /game を見て', sub: 'ゲーム画面を出す' }],
  }),
  cache: {
    title: 'CloudFront のキャッシュ',
    nodes: [
      { id: 'user', x: 8, y: 60, w: 92, h: 60, label: 'ユーザー', sub: '東京・大阪…' },
      { id: 'cf', x: 146, y: 60, w: 112, h: 60, label: 'CloudFront', sub: '近くでコピーを配る' },
      { id: 's3', x: 300, y: 60, w: 92, h: 60, label: 'S3', sub: '本物' },
      { id: 'assets', x: 8, y: 160, w: 186, h: 80, label: 'assets/index-xxxx.js', sub: '1年キャッシュしてよい（名前が毎回変わる）', mono: true },
      { id: 'index', x: 206, y: 160, w: 186, h: 80, label: 'index.html', sub: '毎回確かめる（no-cache）', mono: true },
    ],
    edges: [
      { id: 'cf', d: 'M100 90 L146 90', label: 'リクエスト', lx: 123, ly: 82, anchor: 'middle' },
      { id: 's3', d: 'M258 90 L300 90', label: 'なければ', lx: 279, ly: 82, anchor: 'middle' },
    ],
    pulse: { path: 'M54 90 L346 90', dur: '2s' },
  },
  serverless: {
    title: 'サーバーレスの API',
    nodes: [
      { id: 'user', x: 8, y: 60, w: 72, h: 60, label: 'アプリ', sub: 'fetch' },
      { id: 'apigw', x: 100, y: 60, w: 96, h: 60, label: 'API Gateway', sub: 'URL の入口' },
      { id: 'lambda', x: 216, y: 60, w: 80, h: 60, label: 'Lambda', sub: '処理' },
      { id: 'ddb', x: 316, y: 60, w: 76, h: 60, label: 'DynamoDB', sub: '保存' },
      { id: 'logs', x: 186, y: 176, w: 140, h: 56, label: 'CloudWatch Logs', sub: 'ログが自動で残る' },
    ],
    edges: [
      { id: 'apigw', d: 'M80 90 L100 90' },
      { id: 'lambda', d: 'M196 90 L216 90' },
      { id: 'ddb', d: 'M296 90 L316 90' },
      { id: 'logs', d: 'M256 120 L256 176', label: 'console.log', lx: 262, ly: 152 },
    ],
    pulse: { path: 'M44 90 L354 90', dur: '2.2s' },
  },
  dynamokey: {
    title: 'DynamoDB のキー設計',
    nodes: [
      { id: 'pk', x: 8, y: 20, w: 140, h: 36, label: 'userId', sub: 'パーティションキー', mono: true },
      { id: 'sk', x: 152, y: 20, w: 130, h: 36, label: 'endingId', sub: 'ソートキー', mono: true },
      { id: 'attr', x: 286, y: 20, w: 106, h: 36, label: 'clearedAt', mono: true },
      { id: 'pk', x: 8, y: 62, w: 140, h: 32, label: 'u-123', mono: true },
      { id: 'sk', x: 152, y: 62, w: 130, h: 32, label: 'deja', mono: true },
      { id: 'attr', x: 286, y: 62, w: 106, h: 32, label: '10-01', mono: true },
      { id: 'pk', x: 8, y: 98, w: 140, h: 32, label: 'u-123', mono: true },
      { id: 'sk', x: 152, y: 98, w: 130, h: 32, label: 'true', mono: true },
      { id: 'attr', x: 286, y: 98, w: 106, h: 32, label: '10-03', mono: true },
      { id: 'other', x: 8, y: 134, w: 140, h: 32, label: 'u-456', mono: true },
      { id: 'other', x: 152, y: 134, w: 130, h: 32, label: 'lost', mono: true },
      { id: 'other', x: 286, y: 134, w: 106, h: 32, label: '10-02', mono: true },
      { id: 'query', x: 8, y: 190, w: 384, h: 52, label: '「u-123 のエンディング一覧」はすぐ読める', sub: '「全員の TRUE END」を探すのは苦手（あとから決めにくい）' },
    ],
    edges: [],
  },
  sgchain: {
    title: 'セキュリティグループの段階',
    nodes: [
      { id: 'net', x: 8, y: 80, w: 76, h: 60, label: 'インター', sub: 'ネット' },
      { id: 'alb', x: 110, y: 80, w: 82, h: 60, label: 'ALB', sub: '443 だけ' },
      { id: 'app', x: 218, y: 80, w: 82, h: 60, label: 'アプリ', sub: 'ALB からだけ' },
      { id: 'db', x: 326, y: 80, w: 66, h: 60, label: 'DB', sub: 'アプリから' },
    ],
    edges: [
      { id: 'alb', d: 'M84 110 L110 110', label: '443', lx: 97, ly: 102, anchor: 'middle' },
      { id: 'app', d: 'M192 110 L218 110', label: '3000', lx: 205, ly: 102, anchor: 'middle' },
      { id: 'db', d: 'M300 110 L326 110', label: '5432', lx: 313, ly: 102, anchor: 'middle' },
      { id: 'blocked', d: 'M46 140 L46 200 L359 200 L359 140', plain: true, dashed: true, label: '✕ インターネットから DB へは、直接とどかない', lx: 200, ly: 222, anchor: 'middle' },
    ],
    pulse: { path: 'M46 110 L359 110', dur: '2.4s' },
  },
  loginflow: seq('ログインとトークン', [
    { id: 'browser', label: 'ブラウザ', sub: 'アプリ' },
    { id: 'cognito', label: 'Cognito', sub: 'ログインの係' },
    { id: 'api', label: 'API', sub: 'API Gateway' },
  ], [
    { id: 'l1', from: 0, to: 1, y: 80, label: '① ID・パスワード・MFA' },
    { id: 'l2', from: 1, to: 0, y: 114, label: '② トークン3つ' },
    { id: 'l3', from: 0, to: 2, y: 150, label: '③ アクセストークンを付けて呼ぶ' },
    { id: 'l4', from: 2, to: 0, y: 184, label: '④ 自分のデータ' },
    { id: 'l5', from: 0, to: 1, y: 226, label: '⑤ 期限切れ → 更新' },
  ]),
  jwt: {
    title: 'JWT の3つの部分',
    nodes: [
      { id: 'header', x: 8, y: 20, w: 110, h: 70, label: 'ヘッダー', sub: '署名のしかた' },
      { id: 'payload', x: 136, y: 20, w: 128, h: 70, label: 'ペイロード', sub: 'sub・email・exp' },
      { id: 'sig', x: 282, y: 20, w: 110, h: 70, label: '署名', sub: 'いじられていない証明' },
      { id: 'raw', x: 8, y: 124, w: 384, h: 40, label: 'eyJraWQiOi… . eyJzdWIiOi… . SflKxwRJSM…', mono: true },
      { id: 'payload', x: 8, y: 190, w: 384, h: 52, label: 'まん中は Base64 で、だれでも読める', sub: 'だから秘密の情報は入れない（署名はあるが、暗号化ではない）' },
    ],
    edges: [
      { id: 'header', d: 'M63 90 L63 124', plain: true },
      { id: 'payload', d: 'M200 90 L200 124', plain: true },
      { id: 'sig', d: 'M337 90 L337 124', plain: true },
    ],
  },
  verify: {
    title: 'API Gateway がトークンを確かめる',
    nodes: [
      { id: 'req', x: 8, y: 94, w: 92, h: 62, label: 'リクエスト', sub: 'Bearer トークン' },
      { id: 'gw', x: 124, y: 30, w: 150, h: 190, label: 'API Gateway', top: true },
      { id: 'c1', x: 134, y: 62, w: 130, h: 44, label: '① 署名は正しい？', sub: 'いじられていないか' },
      { id: 'c2', x: 134, y: 114, w: 130, h: 44, label: '② 期限内？', sub: 'exp を見る' },
      { id: 'c3', x: 134, y: 166, w: 130, h: 44, label: '③ 発行元とアプリは？', sub: 'iss・aud を見る' },
      { id: 'ok', x: 298, y: 40, w: 94, h: 62, label: 'Lambda へ', sub: '全部 OK なら' },
      { id: 'ng', x: 298, y: 150, w: 94, h: 62, label: '401', sub: 'だめなら追い返す' },
    ],
    edges: [
      { id: 'req', d: 'M100 125 L124 125' },
      { id: 'ok', d: 'M274 80 L298 72' },
      { id: 'ng', d: 'M274 170 L298 180' },
    ],
  },
  alarm: {
    title: 'アラームのしくみ',
    nodes: [
      { id: 'src', x: 8, y: 70, w: 80, h: 60, label: 'Lambda', sub: 'エラー発生' },
      { id: 'metric', x: 106, y: 70, w: 86, h: 60, label: 'メトリクス', sub: 'エラーの数' },
      { id: 'alarm', x: 210, y: 70, w: 90, h: 60, label: 'アラーム', sub: '5分で5回以上' },
      { id: 'notify', x: 318, y: 70, w: 74, h: 60, label: '通知', sub: 'Slack・メール' },
      { id: 'note', x: 8, y: 174, w: 384, h: 56, label: '人が画面を見張らなくても、おかしくなったら知らせてくれる', sub: '通知先（だれが見るか）まで決めておく' },
    ],
    edges: [
      { id: 'metric', d: 'M88 100 L106 100' },
      { id: 'alarm', d: 'M192 100 L210 100' },
      { id: 'notify', d: 'M300 100 L318 100' },
    ],
    pulse: { path: 'M48 100 L355 100', dur: '2.2s' },
  },
  iacflow: {
    title: 'IaC の流れ',
    nodes: [
      { id: 'code', x: 8, y: 60, w: 84, h: 60, label: 'コード', sub: 'CDK など' },
      { id: 'review', x: 108, y: 60, w: 90, h: 60, label: 'レビュー', sub: 'プルリクエスト' },
      { id: 'ci', x: 214, y: 60, w: 86, h: 60, label: 'CI', sub: '自動で反映' },
      { id: 'aws', x: 316, y: 60, w: 76, h: 60, label: 'AWS', sub: '本番' },
      { id: 'manual', x: 8, y: 170, w: 384, h: 60, label: '✕ コンソールで手作業', sub: '記録が残らない・同じものを作り直せない・まちがいに気づけない', dashed: true },
    ],
    edges: [
      { id: 'review', d: 'M92 90 L108 90' },
      { id: 'ci', d: 'M198 90 L214 90' },
      { id: 'aws', d: 'M300 90 L316 90' },
    ],
    pulse: { path: 'M50 90 L354 90', dur: '2.4s' },
  },
}

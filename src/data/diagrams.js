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
  // ===== 演出編の図 =====
  typing: {
    title: '文字を出す「間」',
    nodes: [
      { id: 'beat', x: 8, y: 60, w: 64, h: 64, label: 'beat', sub: '250ms 待つ', mono: true },
      { id: 'char', x: 84, y: 60, w: 30, h: 64, label: 'ず' },
      { id: 'char', x: 118, y: 60, w: 30, h: 64, label: 'ん' },
      { id: 'char', x: 152, y: 60, w: 30, h: 64, label: 'だ' },
      { id: 'char', x: 186, y: 60, w: 30, h: 64, label: '、' },
      { id: 'char', x: 254, y: 60, w: 30, h: 64, label: 'の' },
      { id: 'char', x: 288, y: 60, w: 30, h: 64, label: 'だ' },
      { id: 'char', x: 322, y: 60, w: 30, h: 64, label: '。' },
      { id: 'note', x: 8, y: 176, w: 384, h: 60, label: '句読点のあとで、少し止まる', sub: 'ふつうの文字 32ms ／ 、のあと 160ms ／ 。！？のあと 320ms' },
    ],
    edges: [
      { id: 'beat', d: 'M72 92 L84 92', plain: true },
      { id: 'g160', d: 'M218 140 L252 140', both: true, label: '160ms', lx: 235, ly: 160, anchor: 'middle' },
      { id: 'g32', d: 'M114 140 L118 140', plain: true, label: '32ms', lx: 116, ly: 160, anchor: 'middle' },
    ],
  },
  looklayers: {
    title: '画面の重なり（絵をなじませる層）',
    nodes: [
      { id: 'top', x: 8, y: 6, w: 384, h: 34, label: 'ムービー・クリックの波紋（いちばん手前）' },
      { id: 'ui', x: 8, y: 44, w: 384, h: 34, label: 'メッセージ欄・選択肢・HUD' },
      { id: 'fx', x: 8, y: 82, w: 384, h: 34, label: '画面効果（集中線・衝撃波・光漏れ）' },
      { id: 'post', x: 8, y: 120, w: 384, h: 38, label: '.post：周りを暗く・走査線・フィルムのざらつき', mono: true },
      { id: 'grade', x: 8, y: 164, w: 384, h: 80, label: '.grade：色調補正（中の絵にまとめてかかる）', top: true, mono: true },
      { id: 'stage', x: 20, y: 192, w: 230, h: 44, label: '背景・立ち絵・光', sub: 'StageLayer' },
      { id: 'stage', x: 258, y: 192, w: 122, h: 44, label: '空気の粒', sub: 'AmbientLayer' },
    ],
    edges: [],
  },
  stage3d: {
    title: 'CSS の 3D の舞台（横から見た図）',
    nodes: [
      { id: 'eye', x: 8, y: 98, w: 64, h: 54, label: 'カメラ', sub: '1000px 手前' },
      { id: 'near', x: 112, y: 62, w: 64, h: 126, label: '光の玉', sub: '+220px' },
      { id: 'chara', x: 200, y: 50, w: 76, h: 150, label: '立ち絵', sub: '0px' },
      { id: 'bg', x: 300, y: 22, w: 92, h: 206, label: '背景', sub: '−320px' },
    ],
    edges: [
      { id: 'eye', d: 'M72 112 L300 22', plain: true, dashed: true },
      { id: 'eye', d: 'M72 138 L300 228', plain: true, dashed: true },
      { id: 'axis', d: 'M112 244 L392 244', label: '奥ほど、マウスで動かしたときに動きが小さい', lx: 252, ly: 238, anchor: 'middle' },
    ],
  },
  cutinmath: {
    title: 'カットインのしくみ',
    nodes: [
      { id: 'sprite', x: 16, y: 8, w: 150, h: 236, label: 'いつもの立ち絵', top: true },
      { id: 'eyes', x: 46, y: 66, w: 90, h: 24, label: '目（faces.js）' },
      { id: 'panel', x: 208, y: 92, w: 184, h: 60, label: 'カットインの帯', sub: '目がまん中に来るように' },
      { id: 'formula', x: 208, y: 176, w: 184, h: 66, label: '帯に合わせて大きく拡大', sub: '目の位置のぶんだけ、ずらす' },
    ],
    edges: [
      { id: 'panel', d: 'M136 78 L208 122', label: '大きくして、ずらす', lx: 142, ly: 66 },
    ],
  },
  fxflow: {
    title: '画面効果のしくみ',
    nodes: [
      { id: 'line', x: 8, y: 50, w: 86, h: 64, label: "fx: 'shake'", sub: 'セリフに書く', mono: true },
      { id: 'play', x: 108, y: 50, w: 86, h: 64, label: 'playFx()', sub: '効果音も鳴らす', mono: true },
      { id: 'class', x: 208, y: 50, w: 86, h: 64, label: 'fx-shake', sub: 'クラスを付ける', mono: true },
      { id: 'css', x: 308, y: 50, w: 84, h: 64, label: 'CSS', sub: 'アニメーション' },
      { id: 'timer', x: 108, y: 164, w: 284, h: 70, label: '600ms たったら、クラスを外す', sub: '続けて同じ効果が来ても、もう一度動くように' },
    ],
    edges: [
      { id: 'play', d: 'M94 82 L108 82' },
      { id: 'class', d: 'M194 82 L208 82' },
      { id: 'css', d: 'M294 82 L308 82' },
      { id: 'timer', d: 'M350 114 L350 164' },
    ],
    pulse: { path: 'M51 82 L350 82 L350 164', dur: '2.4s' },
  },
  audiograph: {
    title: 'Web Audio で音を作る',
    nodes: [
      { id: 'notes', x: 8, y: 14, w: 120, h: 54, label: '曲のデータ', sub: 'コード進行・速さ' },
      { id: 'osc', x: 8, y: 100, w: 84, h: 58, label: '発振器', sub: '音の波' },
      { id: 'filter', x: 106, y: 100, w: 84, h: 58, label: 'フィルター', sub: 'こもらせる' },
      { id: 'gain', x: 204, y: 100, w: 84, h: 58, label: '音量', sub: '大きく・小さく' },
      { id: 'reverb', x: 302, y: 100, w: 90, h: 58, label: 'リバーブ', sub: '響き' },
      { id: 'out', x: 302, y: 190, w: 90, h: 50, label: 'スピーカー' },
      { id: 'mood', x: 106, y: 190, w: 182, h: 50, label: "music: 'muffle' など", sub: 'フィルターと音量を動かす', mono: true },
    ],
    edges: [
      { id: 'osc', d: 'M50 68 L50 100' },
      { id: 'filter', d: 'M92 129 L106 129' },
      { id: 'gain', d: 'M190 129 L204 129' },
      { id: 'reverb', d: 'M288 129 L302 129' },
      { id: 'out', d: 'M347 158 L347 190' },
      { id: 'mood', d: 'M148 190 L148 158' },
      { id: 'mood', d: 'M246 190 L246 158' },
    ],
    pulse: { path: 'M50 129 L347 129 L347 215', dur: '2.6s' },
  },
  movieshots: {
    title: 'ムービーは「カット」の集まり',
    nodes: [
      { id: 'shot', x: 8, y: 46, w: 130, h: 76, label: 'カット 1', sub: '3000ms・寄っていく' },
      { id: 'shot', x: 146, y: 46, w: 90, h: 76, label: 'カット 2', sub: '2000ms' },
      { id: 'shot', x: 244, y: 46, w: 148, h: 76, label: 'カット 3', sub: '3500ms・効果つき' },
      { id: 'caption', x: 8, y: 146, w: 384, h: 42, label: '字幕・効果音も、カットごとに書く' },
      { id: 'note', x: 8, y: 198, w: 384, h: 44, label: '動画ファイルはない', sub: '画像と CSS だけで「動画」を作っている' },
    ],
    edges: [
      { id: 'axis', d: 'M8 28 L392 28', label: '時間 →', lx: 200, ly: 20, anchor: 'middle' },
    ],
  },
  scenechange: {
    title: '場面転換（シーンが切りかわる瞬間）',
    nodes: [
      { id: 'before', x: 8, y: 20, w: 110, h: 66, label: '場面 A', sub: '例：階段' },
      { id: 'mid', x: 145, y: 20, w: 110, h: 66, label: '切りかえの演出', sub: 'この回の話' },
      { id: 'after', x: 282, y: 20, w: 110, h: 66, label: '場面 B', sub: '例：部室' },
      { id: 'tile', x: 8, y: 136, w: 120, h: 104, label: 'タイル', sub: 'ふつうの切りかえ' },
      { id: 'chapter', x: 140, y: 136, w: 120, h: 104, label: 'チャプターカード', sub: '章の始まり' },
      { id: 'movie', x: 272, y: 136, w: 120, h: 104, label: 'ムービー', sub: '大きな出来事' },
    ],
    edges: [
      { id: 'mid', d: 'M118 53 L145 53' },
      { id: 'after', d: 'M255 53 L282 53' },
      { id: 'tile', d: 'M200 86 L200 112 L68 112 L68 136' },
      { id: 'chapter', d: 'M200 86 L200 136' },
      { id: 'movie', d: 'M200 86 L200 112 L332 112 L332 136' },
    ],
  },
  // ===== バックエンド・Docker 編の図 =====
  backend: {
    title: 'フロントエンドとバックエンド',
    nodes: [
      { id: 'front', x: 8, y: 30, w: 110, h: 70, label: 'フロントエンド', sub: 'ブラウザで動く' },
      { id: 'api', x: 145, y: 30, w: 110, h: 70, label: 'バックエンド', sub: 'サーバーで動く API' },
      { id: 'db', x: 282, y: 30, w: 110, h: 70, label: 'データベース', sub: 'データをためる' },
      { id: 'fnote', x: 8, y: 150, w: 110, h: 90, label: '見せる・さわる', sub: '中身はだれでも見られる' },
      { id: 'ext', x: 145, y: 150, w: 110, h: 90, label: '外のサービス', sub: '決済・メールなど' },
      { id: 'bnote', x: 282, y: 150, w: 110, h: 90, label: '守る・ためる', sub: '秘密の鍵はここだけ' },
    ],
    edges: [
      { id: 'api', d: 'M118 65 L145 65', both: true, label: 'HTTP・JSON', lx: 131, ly: 22, anchor: 'middle' },
      { id: 'db', d: 'M255 65 L282 65', both: true, label: 'SQL', lx: 268, ly: 22, anchor: 'middle' },
      { id: 'ext', d: 'M200 100 L200 150' },
    ],
  },
  reqflow: seq('API がリクエストを処理する流れ', [
    { id: 'browser', label: 'ブラウザ', sub: 'ゲーム' },
    { id: 'api', label: 'API サーバー', sub: 'Node.js など' },
    { id: 'db', label: 'データベース', sub: 'PostgreSQL など' },
  ], [
    { id: 'r1', from: 0, to: 1, y: 80, label: '① POST /api/endings' },
    { id: 'r3', from: 1, to: 2, y: 150, label: '③ INSERT …' },
    { id: 'r4', from: 2, to: 1, y: 180, label: '④ 保存できた' },
    { id: 'r5', from: 1, to: 0, y: 220, label: '⑤ 201 Created' },
  ], {
    nodes: [{ id: 'check', x: 146, y: 94, w: 108, h: 36, label: '② ログイン・中身を確認' }],
  }),
  dbtables: {
    title: 'テーブルをキーでつなぐ',
    nodes: [
      { id: 'users', x: 8, y: 20, w: 150, h: 34, label: 'users', mono: true },
      { id: 'users', x: 8, y: 58, w: 150, h: 28, label: 'id（主キー）', mono: true },
      { id: 'users', x: 8, y: 90, w: 150, h: 28, label: 'email（重複なし）', mono: true },
      { id: 'users', x: 8, y: 122, w: 150, h: 28, label: 'created_at', mono: true },
      { id: 'cleared', x: 222, y: 20, w: 170, h: 34, label: 'cleared_endings', mono: true },
      { id: 'cleared', x: 222, y: 58, w: 170, h: 28, label: 'user_id → users.id', mono: true },
      { id: 'cleared', x: 222, y: 90, w: 170, h: 28, label: 'ending_id', mono: true },
      { id: 'cleared', x: 222, y: 122, w: 170, h: 28, label: 'cleared_at', mono: true },
      { id: 'note', x: 8, y: 178, w: 384, h: 62, label: '表（テーブル）を、キーでつなぐ', sub: '同じデータを何度も書かない・ありえない組を入れさせない' },
    ],
    edges: [
      { id: 'fk', d: 'M222 72 L158 72', label: '外部キー', lx: 190, ly: 64, anchor: 'middle' },
    ],
  },
  container: {
    title: '仮想マシンとコンテナ',
    nodes: [
      { id: 'vm', x: 8, y: 8, w: 186, h: 234, label: '仮想マシン（VM）', top: true },
      { id: 'vm', x: 20, y: 44, w: 162, h: 38, label: 'アプリ' },
      { id: 'vm', x: 20, y: 88, w: 162, h: 50, label: 'OS まるごと', sub: '重い・起動に分単位' },
      { id: 'vm', x: 20, y: 190, w: 162, h: 40, label: '仮想化のしくみ' },
      { id: 'container', x: 206, y: 8, w: 186, h: 234, label: 'コンテナ', top: true },
      { id: 'container', x: 218, y: 44, w: 76, h: 38, label: 'アプリ A' },
      { id: 'container', x: 304, y: 44, w: 76, h: 38, label: 'アプリ B' },
      { id: 'container', x: 218, y: 88, w: 162, h: 50, label: '必要なものだけ', sub: '軽い・起動は秒単位' },
      { id: 'container', x: 218, y: 190, w: 162, h: 40, label: 'Docker（OS を共有）' },
    ],
    edges: [],
  },
  dockerflow: {
    title: 'Dockerfile からコンテナまで',
    nodes: [
      { id: 'file', x: 8, y: 30, w: 100, h: 62, label: 'Dockerfile', sub: '作り方の手順', mono: true },
      { id: 'image', x: 150, y: 30, w: 100, h: 62, label: 'イメージ', sub: 'できあがった型' },
      { id: 'registry', x: 292, y: 30, w: 100, h: 62, label: 'レジストリ', sub: 'ECR・Docker Hub' },
      { id: 'container', x: 96, y: 170, w: 64, h: 60, label: 'コンテナ', sub: '動いている' },
      { id: 'container', x: 168, y: 170, w: 64, h: 60, label: 'コンテナ', sub: '同じ型から' },
      { id: 'container', x: 240, y: 170, w: 64, h: 60, label: 'コンテナ', sub: 'いくつでも' },
    ],
    edges: [
      { id: 'image', d: 'M108 61 L150 61', label: 'build', lx: 129, ly: 53, anchor: 'middle' },
      { id: 'registry', d: 'M250 61 L292 61', label: 'push', lx: 271, ly: 53, anchor: 'middle' },
      { id: 'container', d: 'M200 92 L200 170', label: 'docker run', lx: 208, ly: 134 },
      { id: 'container', d: 'M200 128 L128 128 L128 170' },
      { id: 'container', d: 'M200 128 L272 128 L272 170' },
    ],
  },
  compose: {
    title: 'docker compose（手元でまとめて動かす）',
    nodes: [
      { id: 'box', x: 6, y: 6, w: 388, h: 238, label: 'docker compose up', top: true, mono: true },
      { id: 'api', x: 30, y: 46, w: 140, h: 70, label: 'api', sub: 'Node.js（3000番）', mono: true },
      { id: 'db', x: 230, y: 46, w: 140, h: 70, label: 'db', sub: 'PostgreSQL（5432番）', mono: true },
      { id: 'host', x: 30, y: 170, w: 140, h: 60, label: 'あなたのパソコン', sub: 'localhost:3000' },
      { id: 'vol', x: 230, y: 170, w: 140, h: 60, label: 'ボリューム', sub: 'データを残す場所' },
    ],
    edges: [
      { id: 'net', d: 'M170 81 L230 81', label: 'db:5432', lx: 200, ly: 73, anchor: 'middle' },
      { id: 'host', d: 'M100 170 L100 116', label: 'ports', lx: 108, ly: 146 },
      { id: 'vol', d: 'M300 116 L300 170', both: true },
    ],
  },
  deployflow: {
    title: 'コンテナを本番に出すまで',
    nodes: [
      { id: 'push', x: 8, y: 40, w: 76, h: 62, label: 'git push', mono: true },
      { id: 'ci', x: 100, y: 40, w: 84, h: 62, label: 'CI', sub: 'テスト・ビルド' },
      { id: 'ecr', x: 200, y: 40, w: 84, h: 62, label: 'ECR', sub: 'イメージを置く' },
      { id: 'ecs', x: 300, y: 40, w: 92, h: 62, label: 'ECS', sub: '新しい版へ' },
      { id: 'rolling', x: 100, y: 150, w: 292, h: 84, label: '少しずつ入れかえる（ローリング）', sub: 'ヘルスチェックに合格した新しいコンテナから、順番に切りかえる' },
    ],
    edges: [
      { id: 'ci', d: 'M84 71 L100 71' },
      { id: 'ecr', d: 'M184 71 L200 71' },
      { id: 'ecs', d: 'M284 71 L300 71' },
      { id: 'rolling', d: 'M346 102 L346 150' },
    ],
    pulse: { path: 'M46 71 L346 71 L346 150', dur: '2.6s' },
  },
  scale: {
    title: 'たくさんの人が来ても動き続ける',
    nodes: [
      { id: 'lb', x: 8, y: 94, w: 84, h: 62, label: 'ロード', sub: 'バランサー' },
      { id: 'app', x: 118, y: 20, w: 100, h: 46, label: 'API コンテナ' },
      { id: 'app', x: 118, y: 102, w: 100, h: 46, label: 'API コンテナ' },
      { id: 'app', x: 118, y: 184, w: 100, h: 46, label: 'API コンテナ' },
      { id: 'db', x: 250, y: 20, w: 142, h: 56, label: 'データベース', sub: 'みんなで共有' },
      { id: 'cache', x: 250, y: 98, w: 142, h: 54, label: 'キャッシュ', sub: 'Redis・よく読むもの' },
      { id: 'queue', x: 250, y: 174, w: 66, h: 66, label: 'キュー', sub: 'SQS' },
      { id: 'worker', x: 326, y: 174, w: 66, h: 66, label: 'ワーカー', sub: '重い処理' },
    ],
    edges: [
      { id: 'lb', d: 'M92 125 L118 43' },
      { id: 'lb', d: 'M92 125 L118 125' },
      { id: 'lb', d: 'M92 125 L118 207' },
      { id: 'db', d: 'M218 43 L250 48' },
      { id: 'cache', d: 'M218 125 L250 125' },
      { id: 'queue', d: 'M218 207 L250 207' },
      { id: 'worker', d: 'M316 207 L326 207' },
    ],
  },
  // ===== HTTP 編の図 =====
  journey: seq('URL を開いてから表示されるまで', [
    { id: 'browser', label: 'ブラウザ', sub: 'URL を入力' },
    { id: 'dns', label: 'DNS', sub: '名前 → 住所の係' },
    { id: 'server', label: 'サーバー', sub: 'game.example.com' },
  ], [
    { id: 'j1', from: 0, to: 1, y: 78, label: '① どこにある？' },
    { id: 'j2', from: 1, to: 0, y: 108, label: '② IP アドレス' },
    { id: 'j3', from: 0, to: 2, y: 144, label: '③ 接続・TLS のあいさつ' },
    { id: 'j4', from: 0, to: 2, y: 180, label: '④ GET /index.html' },
    { id: 'j5', from: 2, to: 0, y: 216, label: '⑤ 200 OK ＋ HTML' },
  ]),
  httpmsg: {
    title: 'HTTP のメッセージの形',
    nodes: [
      { id: 'req', x: 8, y: 6, w: 186, h: 30, label: 'リクエスト', top: false },
      { id: 'line', x: 8, y: 42, w: 186, h: 44, label: 'GET /index.html HTTP/1.1', sub: '開始行：何を・どこに', mono: true },
      { id: 'headers', x: 8, y: 92, w: 186, h: 70, label: 'ヘッダー', sub: 'Host・Accept・Cookie…' },
      { id: 'body', x: 8, y: 168, w: 186, h: 74, label: '本文', sub: '（GET はふつう空）' },
      { id: 'res', x: 206, y: 6, w: 186, h: 30, label: 'レスポンス' },
      { id: 'line', x: 206, y: 42, w: 186, h: 44, label: 'HTTP/1.1 200 OK', sub: '開始行：どうなったか', mono: true },
      { id: 'headers', x: 206, y: 92, w: 186, h: 70, label: 'ヘッダー', sub: 'Content-Type・Cache-Control…' },
      { id: 'body', x: 206, y: 168, w: 186, h: 74, label: '本文', sub: 'HTML・JSON・画像など' },
    ],
    edges: [],
  },
  statusclass: {
    title: 'ステータスコードの5つのグループ',
    nodes: [
      { id: 'info', x: 8, y: 10, w: 384, h: 40, label: '1xx　情報（とちゅう経過）', sub: '101：WebSocket に切りかえ など' },
      { id: 'ok', x: 8, y: 56, w: 384, h: 40, label: '2xx　成功', sub: '200 OK・201 作った・204 中身なし' },
      { id: 'redirect', x: 8, y: 102, w: 384, h: 40, label: '3xx　ほかを見て', sub: '301・308 ずっと移動／302・307 いまだけ／304 キャッシュでOK' },
      { id: 'client', x: 8, y: 148, w: 384, h: 44, label: '4xx　送った側の問題', sub: '400・401・403・404・429' },
      { id: 'server', x: 8, y: 198, w: 384, h: 44, label: '5xx　サーバー側の問題', sub: '500・502・503・504' },
    ],
    edges: [],
  },
  etag: seq('キャッシュの確かめ方（ETag と 304）', [
    { id: 'browser', label: 'ブラウザ', sub: 'ゲーム' },
    { id: 'cache', label: 'キャッシュ', sub: 'ブラウザの中' },
    { id: 'server', label: 'サーバー', sub: '本物' },
  ], [
    { id: 'e1', from: 0, to: 2, y: 76, label: '① GET（1回目）' },
    { id: 'e2', from: 2, to: 0, y: 104, label: '② 200 ＋ ETag: "abc"' },
    { id: 'e3', from: 0, to: 1, y: 132, label: '③ しまっておく' },
    { id: 'e4', from: 0, to: 2, y: 168, label: '④ If-None-Match: "abc"' },
    { id: 'e5', from: 2, to: 0, y: 196, label: '⑤ 304（中身なし）' },
    { id: 'e6', from: 1, to: 0, y: 228, label: '⑥ しまった分を使う' },
  ]),
  cookieflow: seq('Cookie でログインを覚える', [
    { id: 'browser', label: 'ブラウザ', sub: 'Cookie をしまう' },
    { id: 'server', label: 'API サーバー', sub: 'だれか調べる' },
    { id: 'store', label: 'セッション置き場', sub: 'DB・Redis' },
  ], [
    { id: 'c1', from: 0, to: 1, y: 78, label: '① POST /login' },
    { id: 'c2', from: 1, to: 2, y: 106, label: '② セッションを作る' },
    { id: 'c3', from: 1, to: 0, y: 136, label: '③ Set-Cookie: sid=…' },
    { id: 'c4', from: 0, to: 1, y: 178, label: '④ Cookie: sid=…（自動）' },
    { id: 'c5', from: 1, to: 2, y: 208, label: '⑤ sid からだれか調べる' },
  ]),
  origin: {
    title: 'オリジン（＝ プロトコル ＋ ホスト ＋ ポート）',
    nodes: [
      { id: 'scheme', x: 8, y: 10, w: 100, h: 54, label: 'https://', sub: 'プロトコル', mono: true },
      { id: 'host', x: 116, y: 10, w: 190, h: 54, label: 'game.example.com', sub: 'ホスト', mono: true },
      { id: 'port', x: 314, y: 10, w: 78, h: 54, label: ':443', sub: 'ポート', mono: true },
      { id: 'same', x: 8, y: 84, w: 384, h: 34, label: '◯ https://game.example.com/api …… 同じオリジン', mono: true },
      { id: 'diff', x: 8, y: 124, w: 384, h: 34, label: '✕ https://api.example.com …… ホストがちがう', mono: true },
      { id: 'diff', x: 8, y: 164, w: 384, h: 34, label: '✕ http://game.example.com …… プロトコルがちがう', mono: true },
      { id: 'diff', x: 8, y: 204, w: 384, h: 34, label: '✕ https://game.example.com:8443 …… ポートがちがう', mono: true },
    ],
    edges: [],
  },
  preflight: seq('CORS のプリフライト（下見）', [
    { id: 'js', label: 'ゲームの JS', sub: 'game.example.com' },
    { id: 'browser', label: 'ブラウザ', sub: '見張り役' },
    { id: 'api', label: 'API', sub: 'api.example.com' },
  ], [
    { id: 'p1', from: 0, to: 1, y: 74, label: '① fetch（PUT）' },
    { id: 'p2', from: 1, to: 2, y: 102, label: '② OPTIONS（下見）' },
    { id: 'p3', from: 2, to: 1, y: 130, label: '③ この相手なら OK' },
    { id: 'p4', from: 1, to: 2, y: 164, label: '④ 本番の PUT' },
    { id: 'p5', from: 2, to: 1, y: 192, label: '⑤ 結果 ＋ 許可' },
    { id: 'p6', from: 1, to: 0, y: 226, label: '⑥ JS に渡す' },
  ]),
  tls: {
    title: 'HTTPS（TLS）のしくみ',
    nodes: [
      { id: 'ca', x: 145, y: 8, w: 110, h: 56, label: '認証局（CA）', sub: '身元を保証する係' },
      { id: 'browser', x: 8, y: 110, w: 110, h: 64, label: 'ブラウザ', sub: 'CA のリストを持つ' },
      { id: 'server', x: 282, y: 110, w: 110, h: 64, label: 'サーバー', sub: '証明書を持つ' },
      { id: 'secret', x: 8, y: 196, w: 384, h: 46, label: '確かめたら、2人だけの鍵を決めて暗号化', sub: '中身・ヘッダー・Cookie は見えない（行き先のドメイン名は見える）' },
    ],
    edges: [
      { id: 'issue', d: 'M255 36 L337 36 L337 110', label: '① 証明書を発行（前もって）', lx: 270, ly: 28 },
      { id: 'show', d: 'M282 130 L118 130', label: '② 証明書を見せる', lx: 200, ly: 122, anchor: 'middle' },
      { id: 'verify', d: 'M63 110 L63 36 L145 36', label: '③ CA の署名を確かめる', lx: 8, ly: 28 },
      { id: 'secret', d: 'M118 158 L282 158', both: true, label: '④ 暗号化して通信', lx: 200, ly: 176, anchor: 'middle' },
    ],
  },
  httpver: {
    title: 'HTTP/1.1・HTTP/2・HTTP/3',
    nodes: [
      { id: 'h1', x: 8, y: 10, w: 100, h: 66, label: 'HTTP/1.1', sub: '1本に1つずつ', mono: true },
      { id: 'h1', x: 120, y: 18, w: 70, h: 22, label: 'HTML' },
      { id: 'h1', x: 196, y: 18, w: 70, h: 22, label: 'JS' },
      { id: 'h1', x: 272, y: 18, w: 70, h: 22, label: 'CSS' },
      { id: 'h1', x: 120, y: 46, w: 70, h: 22, label: '画像' },
      { id: 'h1', x: 196, y: 46, w: 70, h: 22, label: '画像' },
      { id: 'h2', x: 8, y: 90, w: 100, h: 66, label: 'HTTP/2', sub: '1本で同時に', mono: true },
      { id: 'h2', x: 120, y: 98, w: 272, h: 22, label: 'HTML・JS・CSS・画像を まぜて送る' },
      { id: 'h2', x: 120, y: 126, w: 272, h: 22, label: '1つ落とすと、全部が待つことがある' },
      { id: 'h3', x: 8, y: 170, w: 100, h: 66, label: 'HTTP/3', sub: 'QUIC（UDP）', mono: true },
      { id: 'h3', x: 120, y: 178, w: 272, h: 22, label: 'それぞれが別々に届く' },
      { id: 'h3', x: 120, y: 206, w: 272, h: 22, label: '回線が切りかわってもつながりやすい' },
    ],
    edges: [],
  },
  // ===== 非同期 JavaScript 編の図 =====
  jsthread: {
    title: '待っているあいだ、どうするか',
    nodes: [
      { id: 'sync', x: 8, y: 8, w: 384, h: 26, label: 'もし全部を順番に待ったら（同期）', top: false },
      { id: 'sync', x: 8, y: 40, w: 70, h: 44, label: '処理 A' },
      { id: 'sync', x: 82, y: 40, w: 220, h: 44, label: 'API の返事を待つ……', sub: 'この間、画面が固まる' },
      { id: 'sync', x: 306, y: 40, w: 86, h: 44, label: '処理 B' },
      { id: 'async', x: 8, y: 116, w: 384, h: 26, label: '待つのはブラウザにまかせる（非同期）' },
      { id: 'async', x: 8, y: 148, w: 70, h: 44, label: '処理 A' },
      { id: 'async', x: 82, y: 148, w: 70, h: 44, label: 'API を頼む' },
      { id: 'async', x: 156, y: 148, w: 70, h: 44, label: '処理 B' },
      { id: 'async', x: 230, y: 148, w: 70, h: 44, label: 'クリック', sub: '反応できる' },
      { id: 'async', x: 304, y: 148, w: 88, h: 44, label: '返事の続き' },
      { id: 'note', x: 8, y: 206, w: 384, h: 38, label: 'JavaScript の手は1本。だから「待つ」を手放す' },
    ],
    edges: [],
  },
  eventloop: {
    title: 'イベントループ',
    nodes: [
      { id: 'stack', x: 8, y: 20, w: 116, h: 150, label: 'コールスタック', sub: 'いま実行中', top: true },
      { id: 'apis', x: 150, y: 14, w: 242, h: 58, label: 'ブラウザの機能', sub: 'タイマー・fetch・クリックを見張る' },
      { id: 'micro', x: 150, y: 96, w: 242, h: 52, label: 'マイクロタスク', sub: 'Promise の続き（空になるまで全部）' },
      { id: 'task', x: 150, y: 168, w: 242, h: 52, label: 'タスク', sub: 'setTimeout・クリック（1回に1つ）' },
      { id: 'loop', x: 8, y: 186, w: 116, h: 56, label: 'イベントループ', sub: '空いたら次を入れる' },
    ],
    edges: [
      { id: 'apis', d: 'M124 43 L150 43', label: 'たのむ', lx: 137, ly: 35, anchor: 'middle' },
      { id: 'micro', d: 'M271 72 L271 96', label: 'できたら並ぶ', lx: 279, ly: 88 },
      { id: 'micro', d: 'M150 122 L124 122' },
      { id: 'task', d: 'M150 194 L124 150' },
    ],
  },
  promisestate: {
    title: 'Promise の3つの状態',
    nodes: [
      { id: 'pending', x: 8, y: 90, w: 120, h: 70, label: 'pending', sub: 'まだ待っている', mono: true },
      { id: 'fulfilled', x: 200, y: 20, w: 192, h: 70, label: 'fulfilled（成功）', sub: '→ then の中が動く' },
      { id: 'rejected', x: 200, y: 160, w: 192, h: 70, label: 'rejected（失敗）', sub: '→ catch の中が動く' },
    ],
    edges: [
      { id: 'fulfilled', d: 'M128 112 L200 55', label: 'resolve', lx: 140, ly: 76 },
      { id: 'rejected', d: 'M128 138 L200 195', label: 'reject', lx: 140, ly: 182 },
    ],
  },
  seqpar: {
    title: '順番に待つ・まとめて待つ',
    nodes: [
      { id: 'seq', x: 8, y: 14, w: 384, h: 24, label: 'await を3回（順番）… 3秒' },
      { id: 'seq', x: 8, y: 44, w: 124, h: 34, label: 'ユーザー（1秒）' },
      { id: 'seq', x: 138, y: 44, w: 124, h: 34, label: 'セーブ（1秒）' },
      { id: 'seq', x: 268, y: 44, w: 124, h: 34, label: 'エンディング（1秒）' },
      { id: 'par', x: 8, y: 104, w: 384, h: 24, label: 'Promise.all（まとめて）… 1秒' },
      { id: 'par', x: 8, y: 134, w: 124, h: 30, label: 'ユーザー' },
      { id: 'par', x: 8, y: 168, w: 124, h: 30, label: 'セーブ' },
      { id: 'par', x: 8, y: 202, w: 124, h: 30, label: 'エンディング' },
      { id: 'note', x: 150, y: 150, w: 242, h: 70, label: 'たがいに関係ないなら、同時に頼む', sub: 'ただし1つでも失敗すると全体が失敗' },
    ],
    edges: [
      { id: 'axis', d: 'M8 246 L392 246', label: '時間 →', lx: 200, ly: 240, anchor: 'middle' },
    ],
  },
  staleres: seq('古い結果で上書きされる', [
    { id: 'input', label: '入力', sub: '検索ボックス' },
    { id: 'app', label: '画面（JS）', sub: '結果を出す' },
    { id: 'api', label: 'API', sub: '速さはまちまち' },
  ], [
    { id: 's1', from: 0, to: 1, y: 74, label: '①「ず」' },
    { id: 's2', from: 1, to: 2, y: 100, label: '② 検索 A' },
    { id: 's3', from: 0, to: 1, y: 128, label: '③「ずんだ」' },
    { id: 's4', from: 1, to: 2, y: 154, label: '④ 検索 B' },
    { id: 's5', from: 2, to: 1, y: 184, label: '⑤ B の結果（速い）' },
    { id: 's6', from: 2, to: 1, y: 222, label: '⑥ A の結果で上書き！' },
  ]),

  // ===== セキュリティ編の図 =====
  trust: {
    title: '信頼の境界',
    nodes: [
      { id: 'client', x: 8, y: 8, w: 170, h: 234, label: 'ブラウザ側（信用しない）', top: true },
      { id: 'client', x: 20, y: 44, w: 146, h: 34, label: 'フォームの入力' },
      { id: 'client', x: 20, y: 84, w: 146, h: 34, label: 'URL・クエリ' },
      { id: 'client', x: 20, y: 124, w: 146, h: 34, label: 'Cookie・ヘッダー' },
      { id: 'client', x: 20, y: 164, w: 146, h: 34, label: 'localStorage' },
      { id: 'client', x: 20, y: 204, w: 146, h: 30, label: '画面のチェック' },
      { id: 'server', x: 222, y: 8, w: 170, h: 234, label: 'サーバー側（ここで守る）', top: true },
      { id: 'server', x: 234, y: 44, w: 146, h: 40, label: '① 形を確かめる', sub: '入力チェック' },
      { id: 'server', x: 234, y: 92, w: 146, h: 40, label: '② だれか確かめる', sub: '認証' },
      { id: 'server', x: 234, y: 140, w: 146, h: 40, label: '③ してよいか', sub: '認可' },
      { id: 'server', x: 234, y: 188, w: 146, h: 44, label: '④ 安全に使う', sub: 'プレースホルダーなど' },
    ],
    edges: [
      { id: 'boundary', d: 'M200 8 L200 242', plain: true, dashed: true, label: '境界', lx: 200, ly: 128, anchor: 'middle' },
    ],
  },
  defense: {
    title: '多層防御（1枚やぶられても止める）',
    nodes: [
      { id: 'l1', x: 8, y: 8, w: 384, h: 34, label: 'WAF・CDN … おかしなリクエストをはじく' },
      { id: 'l2', x: 22, y: 48, w: 356, h: 34, label: '入力チェック … 形と範囲を確かめる' },
      { id: 'l3', x: 36, y: 88, w: 328, h: 34, label: '認証・認可 … だれが・何をしてよいか' },
      { id: 'l4', x: 50, y: 128, w: 300, h: 34, label: '安全な書き方 … プレースホルダー・エスケープ' },
      { id: 'l5', x: 64, y: 168, w: 272, h: 34, label: '最小権限・暗号化 … やぶられても被害を小さく' },
      { id: 'l6', x: 78, y: 208, w: 244, h: 34, label: 'ログ・監視 … 気づいて止める' },
    ],
    edges: [],
  },
  xssflow: seq('保存型 XSS', [
    { id: 'attacker', label: '悪い人', sub: 'コメントを書く' },
    { id: 'server', label: 'サーバー', sub: 'コメントを保存' },
    { id: 'victim', label: 'ほかの人', sub: 'ページを見る' },
  ], [
    { id: 'x1', from: 0, to: 1, y: 82, label: '① スクリプト入りのコメント' },
    { id: 'x2', from: 2, to: 1, y: 126, label: '② ページを開く' },
    { id: 'x3', from: 1, to: 2, y: 162, label: '③ そのまま HTML に入れて返す' },
    { id: 'x4', from: 2, to: 0, y: 212, label: '④ スクリプトが動いて情報が盗まれる' },
  ]),
  idor: {
    title: '他人のデータが見えてしまう（認可もれ）',
    nodes: [
      { id: 'user', x: 8, y: 90, w: 104, h: 70, label: 'ユーザー A', sub: 'セーブ 123 の持ち主' },
      { id: 'req', x: 140, y: 14, w: 252, h: 44, label: 'GET /api/saves/124', sub: '番号を1つ変えてみる', mono: true },
      { id: 'bad', x: 140, y: 96, w: 252, h: 56, label: '✕ ログインしているから返す', sub: 'B さんのセーブが見えてしまう' },
      { id: 'good', x: 140, y: 176, w: 252, h: 64, label: '◯ 持ち主か確かめる', sub: 'ちがえば 404（「ない」と同じに見せる）' },
    ],
    edges: [
      { id: 'req', d: 'M112 110 L140 36' },
      { id: 'bad', d: 'M112 125 L140 124' },
      { id: 'good', d: 'M112 140 L140 208' },
    ],
  },
  csrfflow: seq('CSRF（なりすましの送信）', [
    { id: 'browser', label: 'あなたのブラウザ', sub: '銀行にログイン中' },
    { id: 'evil', label: '悪いサイト', sub: '罠のページ' },
    { id: 'bank', label: '銀行の API', sub: 'Cookie で本人確認' },
  ], [
    { id: 'f1', from: 0, to: 1, y: 82, label: '① 罠のページを開く' },
    { id: 'f2', from: 1, to: 0, y: 116, label: '② 隠れたフォーム' },
    { id: 'f3', from: 0, to: 2, y: 160, label: '③ 送金 ＋ Cookie（自動で付く）' },
    { id: 'f4', from: 2, to: 0, y: 206, label: '④ 本人の操作だと思って実行' },
  ]),
  supply: {
    title: '依存ライブラリのリスク',
    nodes: [
      { id: 'app', x: 140, y: 8, w: 120, h: 44, label: 'あなたのアプリ' },
      { id: 'dep', x: 20, y: 86, w: 110, h: 40, label: 'vue' },
      { id: 'dep', x: 145, y: 86, w: 110, h: 40, label: 'pinia' },
      { id: 'dep', x: 270, y: 86, w: 110, h: 40, label: 'vite' },
      { id: 'deep', x: 20, y: 156, w: 70, h: 34, label: '…' },
      { id: 'deep', x: 98, y: 156, w: 70, h: 34, label: '…' },
      { id: 'deep', x: 176, y: 156, w: 70, h: 34, label: '…' },
      { id: 'deep', x: 254, y: 156, w: 70, h: 34, label: '…' },
      { id: 'deep', x: 332, y: 156, w: 60, h: 34, label: '…' },
      { id: 'note', x: 8, y: 204, w: 384, h: 40, label: 'node_modules には、何百ものパッケージが入っている' },
    ],
    edges: [
      { id: 'dep', d: 'M200 52 L200 70 L75 70 L75 86' },
      { id: 'dep', d: 'M200 52 L200 86' },
      { id: 'dep', d: 'M200 52 L200 70 L325 70 L325 86' },
      { id: 'deep', d: 'M75 126 L55 156', plain: true },
      { id: 'deep', d: 'M200 126 L133 156', plain: true },
      { id: 'deep', d: 'M200 126 L211 156', plain: true },
      { id: 'deep', d: 'M325 126 L289 156', plain: true },
      { id: 'deep', d: 'M325 126 L362 156', plain: true },
    ],
  },
  // ===== 授業の拡充で足した図 =====
  slot: {
    title: 'スロット（部品の「穴」）',
    nodes: [
      { id: 'child', x: 8, y: 14, w: 180, h: 222, label: 'Card.vue（枠）', top: true },
      { id: 'child', x: 22, y: 48, w: 152, h: 40, label: '<slot name="title">', mono: true },
      { id: 'child', x: 22, y: 96, w: 152, h: 80, label: '<slot>', sub: 'ふつうの中身', mono: true },
      { id: 'child', x: 22, y: 184, w: 152, h: 40, label: '<slot name="footer">', mono: true },
      { id: 'parent', x: 222, y: 14, w: 170, h: 222, label: '使う側が入れる中身', top: true },
      { id: 'parent', x: 236, y: 48, w: 142, h: 40, label: 'ずんだもんの手紙' },
      { id: 'parent', x: 236, y: 96, w: 142, h: 80, label: '<p>本文…</p>', mono: true },
      { id: 'parent', x: 236, y: 184, w: 142, h: 40, label: '返事を書く' },
    ],
    edges: [
      { id: 'parent', d: 'M236 68 L174 68' },
      { id: 'parent', d: 'M236 136 L174 136' },
      { id: 'parent', d: 'M236 204 L174 204' },
    ],
  },
  lifecycle: {
    title: '部品の一生（ライフサイクル）',
    nodes: [
      { id: 'setup', x: 8, y: 30, w: 110, h: 70, label: 'setup', sub: '作られる（1回だけ）', mono: true },
      { id: 'mounted', x: 145, y: 30, w: 110, h: 70, label: 'onMounted', sub: '画面に出た', mono: true },
      { id: 'unmounted', x: 282, y: 30, w: 110, h: 70, label: 'onUnmounted', sub: '画面から消える', mono: true },
      { id: 'mounted', x: 145, y: 150, w: 110, h: 86, label: 'ここで始める', sub: 'イベント・タイマー・測る' },
      { id: 'unmounted', x: 282, y: 150, w: 110, h: 86, label: 'ここで片付け', sub: '止める・外す・取り消す' },
    ],
    edges: [
      { id: 'mounted', d: 'M118 65 L145 65' },
      { id: 'unmounted', d: 'M255 65 L282 65', label: '値が変わると更新', lx: 268, ly: 18, anchor: 'middle' },
      { id: 'mounted', d: 'M200 100 L200 150', plain: true },
      { id: 'unmounted', d: 'M337 100 L337 150', plain: true },
    ],
    pulse: { path: 'M63 65 L337 65', dur: '2.4s' },
  },
  vtransition: {
    title: '<Transition> が付けるクラス',
    nodes: [
      { id: 'enter', x: 8, y: 14, w: 384, h: 24, label: '出るとき' },
      { id: 'enter', x: 8, y: 44, w: 120, h: 56, label: 'enter-from', sub: '出はじめ（透明・下）', mono: true },
      { id: 'enter', x: 140, y: 44, w: 120, h: 56, label: 'enter-active', sub: '出ているあいだ', mono: true },
      { id: 'enter', x: 272, y: 44, w: 120, h: 56, label: 'enter-to', sub: 'ふつうの見た目', mono: true },
      { id: 'leave', x: 8, y: 128, w: 384, h: 24, label: '消えるとき' },
      { id: 'leave', x: 8, y: 158, w: 120, h: 56, label: 'leave-from', sub: 'ふつうの見た目', mono: true },
      { id: 'leave', x: 140, y: 158, w: 120, h: 56, label: 'leave-active', sub: '消えているあいだ', mono: true },
      { id: 'leave', x: 272, y: 158, w: 120, h: 56, label: 'leave-to', sub: '消えおわり（透明）', mono: true },
    ],
    edges: [
      { id: 'enter', d: 'M128 72 L140 72' },
      { id: 'enter', d: 'M260 72 L272 72' },
      { id: 'leave', d: 'M128 186 L140 186' },
      { id: 'leave', d: 'M260 186 L272 186' },
      { id: 'axis', d: 'M8 236 L392 236', label: '時間 →', lx: 200, ly: 232, anchor: 'middle' },
    ],
  },
  rendering: {
    title: 'ブラウザが画面を描くまで',
    nodes: [
      { id: 'parse', x: 8, y: 24, w: 86, h: 66, label: 'DOM と', sub: 'スタイル' },
      { id: 'layout', x: 106, y: 24, w: 86, h: 66, label: 'レイアウト', sub: '位置と大きさ' },
      { id: 'paint', x: 204, y: 24, w: 86, h: 66, label: 'ペイント', sub: '色・文字を塗る' },
      { id: 'composite', x: 302, y: 24, w: 90, h: 66, label: '合成', sub: '層を1枚に' },
      { id: 'heavy', x: 8, y: 128, w: 384, h: 50, label: 'width・height・top・left を変える', sub: '→ レイアウトからやり直し（重い）' },
      { id: 'cheap', x: 8, y: 188, w: 384, h: 50, label: 'transform・opacity を変える', sub: '→ 合成だけで済む（軽い）' },
    ],
    edges: [
      { id: 'layout', d: 'M94 57 L106 57' },
      { id: 'paint', d: 'M192 57 L204 57' },
      { id: 'composite', d: 'M290 57 L302 57' },
      { id: 'heavy', d: 'M149 128 L149 90', plain: true },
      { id: 'cheap', d: 'M347 188 L347 90', plain: true },
    ],
    pulse: { path: 'M51 57 L347 57', dur: '2.2s' },
  },
  // ===== Node.js 編の図 =====
  nodeworld: {
    title: 'ブラウザの JS と Node.js',
    nodes: [
      { id: 'browser', x: 8, y: 8, w: 186, h: 160, label: 'ブラウザ', top: true },
      { id: 'browser', x: 20, y: 40, w: 162, h: 28, label: 'document（画面）', mono: true },
      { id: 'browser', x: 20, y: 74, w: 162, h: 28, label: 'window・localStorage', mono: true },
      { id: 'browser', x: 20, y: 108, w: 162, h: 28, label: 'fetch', mono: true },
      { id: 'node', x: 206, y: 8, w: 186, h: 160, label: 'Node.js', top: true },
      { id: 'node', x: 218, y: 40, w: 162, h: 28, label: 'fs（ファイル）', mono: true },
      { id: 'node', x: 218, y: 74, w: 162, h: 28, label: 'http（サーバー）', mono: true },
      { id: 'node', x: 218, y: 108, w: 162, h: 28, label: 'process・fetch', mono: true },
      { id: 'engine', x: 8, y: 186, w: 384, h: 56, label: 'JavaScript の言葉そのもの', sub: 'V8 エンジン（Chrome と同じ）' },
    ],
    edges: [
      { id: 'engine', d: 'M101 168 L101 186', plain: true },
      { id: 'engine', d: 'M299 168 L299 186', plain: true },
    ],
  },
  nodeloop: {
    title: 'Node.js がたくさんの人をさばくしくみ',
    nodes: [
      { id: 'main', x: 8, y: 14, w: 160, h: 130, label: 'メインスレッド', sub: 'JS はここだけで動く', top: false },
      { id: 'libuv', x: 210, y: 14, w: 182, h: 130, label: '待つ係（libuv・OS）', top: true },
      { id: 'libuv', x: 222, y: 44, w: 158, h: 26, label: 'ネットワーク' },
      { id: 'libuv', x: 222, y: 76, w: 158, h: 26, label: 'ファイル' },
      { id: 'libuv', x: 222, y: 108, w: 158, h: 26, label: '暗号・圧縮' },
      { id: 'queue', x: 8, y: 180, w: 384, h: 60, label: '終わったら、続きを列に並べる', sub: 'メインスレッドが空いたら、順番に動かす' },
    ],
    edges: [
      { id: 'libuv', d: 'M168 60 L210 60', label: 'たのむ', lx: 189, ly: 52, anchor: 'middle' },
      { id: 'queue', d: 'M301 144 L301 180', label: 'できた', lx: 309, ly: 166 },
      { id: 'queue', d: 'M88 180 L88 144' },
    ],
  },
  streamflow: {
    title: 'ストリーム（少しずつ流す）',
    nodes: [
      { id: 'file', x: 8, y: 60, w: 84, h: 66, label: 'ファイル', sub: '1GB' },
      { id: 'pipe', x: 120, y: 60, w: 84, h: 66, label: '読む', sub: 'createReadStream', mono: false },
      { id: 'pipe', x: 214, y: 60, w: 84, h: 66, label: '圧縮', sub: 'gzip' },
      { id: 'res', x: 308, y: 60, w: 84, h: 66, label: 'ブラウザへ', sub: 'レスポンス' },
      { id: 'chunk', x: 120, y: 150, w: 30, h: 26, label: '■' },
      { id: 'chunk', x: 156, y: 150, w: 30, h: 26, label: '■' },
      { id: 'chunk', x: 192, y: 150, w: 30, h: 26, label: '■' },
      { id: 'chunk', x: 228, y: 150, w: 30, h: 26, label: '■' },
      { id: 'note', x: 8, y: 196, w: 384, h: 46, label: '小さなかたまりで、順番に流れていく', sub: 'メモリに乗るのは、いつも少しだけ' },
    ],
    edges: [
      { id: 'pipe', d: 'M92 93 L120 93' },
      { id: 'pipe', d: 'M204 93 L214 93' },
      { id: 'res', d: 'M298 93 L308 93' },
    ],
    pulse: { path: 'M50 93 L350 93', dur: '1.4s' },
  },
  middleware: {
    title: 'ミドルウェア（順番に通る関所）',
    nodes: [
      { id: 'req', x: 8, y: 50, w: 64, h: 60, label: 'リクエスト' },
      { id: 'json', x: 84, y: 50, w: 64, h: 60, label: 'JSON を', sub: '読む' },
      { id: 'log', x: 160, y: 50, w: 64, h: 60, label: 'ログを', sub: '残す' },
      { id: 'auth', x: 236, y: 50, w: 70, h: 60, label: 'ログイン', sub: '確認' },
      { id: 'handler', x: 318, y: 50, w: 74, h: 60, label: '本番の', sub: '処理' },
      { id: 'stop', x: 236, y: 150, w: 70, h: 40, label: '401', sub: 'ここで止める' },
      { id: 'error', x: 84, y: 200, w: 308, h: 42, label: 'エラーの受け皿（最後にまとめて）' },
    ],
    edges: [
      { id: 'json', d: 'M72 80 L84 80' },
      { id: 'log', d: 'M148 80 L160 80' },
      { id: 'auth', d: 'M224 80 L236 80' },
      { id: 'handler', d: 'M306 80 L318 80' },
      { id: 'auth', d: 'M271 110 L271 150', label: 'だめなら', lx: 279, ly: 134 },
      { id: 'error', d: 'M355 110 L355 200', label: '失敗したら', lx: 300, ly: 180 },
    ],
    pulse: { path: 'M40 80 L355 80', dur: '2.4s' },
  },
  // ===== 資料拡充（2回目）の図 =====
  tsnarrow: {
    title: '型の絞りこみ',
    nodes: [
      { id: 'union', x: 8, y: 94, w: 120, h: 62, label: 'Cutin', sub: 'どれか1つ', mono: true },
      { id: 'branch', x: 170, y: 10, w: 222, h: 50, label: "type === 'eyes'", sub: '何も持っていない', mono: true },
      { id: 'branch', x: 170, y: 70, w: 222, h: 50, label: "type === 'split'", sub: 'left・right が使える', mono: true },
      { id: 'branch', x: 170, y: 130, w: 222, h: 50, label: "type === 'diagonal'", sub: 'angle が使える', mono: true },
      { id: 'never', x: 170, y: 192, w: 222, h: 50, label: 'それ以外 → never', sub: '書きわすれたらエラー', mono: true },
    ],
    edges: [
      { id: 'branch', d: 'M128 112 L170 35' },
      { id: 'branch', d: 'M128 120 L170 95' },
      { id: 'branch', d: 'M128 132 L170 155' },
      { id: 'never', d: 'M128 142 L170 217' },
    ],
  },
  gitflow: {
    title: 'ブランチとプルリクエスト',
    nodes: [
      { id: 'main', x: 8, y: 20, w: 384, h: 40, label: 'main（いつも動く状態）', mono: true },
      { id: 'branch', x: 40, y: 110, w: 200, h: 40, label: 'feature/lesson-git', sub: '作業用のブランチ', mono: true },
      { id: 'pr', x: 250, y: 100, w: 142, h: 60, label: 'プルリクエスト', sub: 'CI・レビュー' },
      { id: 'merge', x: 200, y: 190, w: 192, h: 50, label: 'マージ → 自動で公開', sub: 'GitHub Actions' },
    ],
    edges: [
      { id: 'branch', d: 'M60 60 L60 110', label: '分ける', lx: 68, ly: 88 },
      { id: 'pr', d: 'M240 130 L250 130' },
      { id: 'merge', d: 'M321 160 L321 190' },
      { id: 'merge', d: 'M380 60 L380 100', plain: true, dashed: true },
    ],
    pulse: { path: 'M60 60 L60 130 L321 130 L321 215', dur: '3s' },
  },
  // ===== ソフトウェア設計編の図 =====
  cohesion: {
    title: '凝集は高く・結合は低く',
    nodes: [
      { id: 'high', x: 8, y: 8, w: 186, h: 140, label: '◯ よい形', top: true },
      { id: 'high', x: 20, y: 40, w: 74, h: 46, label: '画面' },
      { id: 'high', x: 108, y: 40, w: 74, h: 46, label: '計算' },
      { id: 'high', x: 64, y: 96, w: 74, h: 40, label: '保存' },
      { id: 'bad', x: 206, y: 8, w: 186, h: 140, label: '✕ よくない形', top: true },
      { id: 'bad', x: 218, y: 40, w: 162, h: 96, label: 'なんでも係', sub: '画面も計算も保存も' },
      { id: 'low', x: 8, y: 168, w: 384, h: 74, label: '凝集：中身が同じ目的でまとまっている（高く）', sub: '結合：部品どうしが知りすぎていない（低く）' },
    ],
    edges: [
      { id: 'low', d: 'M94 63 L108 63', plain: true },
      { id: 'low', d: 'M101 86 L101 96', plain: true },
    ],
  },
  layers2: {
    title: 'アプリの層',
    nodes: [
      { id: 'ui', x: 40, y: 10, w: 320, h: 58, label: '画面（プレゼンテーション）', sub: 'Vue の部品・見せる・受け取る' },
      { id: 'domain', x: 40, y: 94, w: 320, h: 58, label: '決まりごと（ドメイン）', sub: '選び方 → エンディング など' },
      { id: 'data', x: 40, y: 178, w: 320, h: 58, label: 'データ（インフラ）', sub: 'API・localStorage・DB' },
    ],
    edges: [
      { id: 'ui', d: 'M200 68 L200 94', label: '使う', lx: 208, ly: 86 },
      { id: 'domain', d: 'M200 152 L200 178', label: '使う', lx: 208, ly: 170 },
      { id: 'note', d: 'M380 200 L380 30', label: '逆向きには呼ばない', lx: 372, ly: 248, anchor: 'end' },
    ],
  },
  depinv: {
    title: '依存の向きを逆にする',
    nodes: [
      { id: 'before', x: 8, y: 8, w: 384, h: 26, label: '✕ 直接つながっている' },
      { id: 'before', x: 30, y: 40, w: 140, h: 50, label: 'セーブの処理' },
      { id: 'before', x: 230, y: 40, w: 140, h: 50, label: 'localStorage', mono: true },
      { id: 'after', x: 8, y: 116, w: 384, h: 26, label: '◯ 約束（つなぎ口）を間にはさむ' },
      { id: 'after', x: 30, y: 150, w: 140, h: 50, label: 'セーブの処理' },
      { id: 'after', x: 230, y: 150, w: 140, h: 40, label: '「保存できるもの」', sub: 'get・set' },
      { id: 'impl', x: 190, y: 206, w: 64, h: 36, label: '本番', sub: 'local' },
      { id: 'impl', x: 262, y: 206, w: 64, h: 36, label: 'クラウド' },
      { id: 'impl', x: 334, y: 206, w: 58, h: 36, label: 'テスト' },
    ],
    edges: [
      { id: 'before', d: 'M170 65 L230 65' },
      { id: 'after', d: 'M170 175 L230 172' },
      { id: 'impl', d: 'M300 206 L300 190' },
    ],
  },
  statehome: {
    title: '状態の置き場所',
    nodes: [
      { id: 'local', x: 8, y: 10, w: 186, h: 60, label: '部品の中（ref）', sub: '入力中の文字・開閉' },
      { id: 'store', x: 206, y: 10, w: 186, h: 60, label: 'ストア（Pinia）', sub: '画面をまたいで使う' },
      { id: 'url', x: 8, y: 86, w: 186, h: 60, label: 'URL', sub: '検索の言葉・ページ番号' },
      { id: 'server', x: 206, y: 86, w: 186, h: 60, label: 'サーバー', sub: '本当のデータの持ち主' },
      { id: 'source', x: 8, y: 166, w: 384, h: 76, label: '同じ情報は1か所に（Single Source of Truth）', sub: '計算できるものは持たずに計算する（computed・getters）' },
    ],
    edges: [],
  },
  datadriven: {
    title: 'データで動かす（このゲームの設計）',
    nodes: [
      { id: 'data', x: 8, y: 14, w: 120, h: 130, label: 'データ', top: true },
      { id: 'data', x: 18, y: 44, w: 100, h: 26, label: 'scenario.js', mono: true },
      { id: 'data', x: 18, y: 76, w: 100, h: 26, label: 'lessons.js', mono: true },
      { id: 'data', x: 18, y: 108, w: 100, h: 26, label: 'diagrams.js', mono: true },
      { id: 'engine', x: 150, y: 44, w: 110, h: 70, label: 'エンジン', sub: 'GameView・ストア' },
      { id: 'screen', x: 282, y: 44, w: 110, h: 70, label: '画面', sub: 'セリフ・演出・図' },
      { id: 'check', x: 8, y: 176, w: 384, h: 64, label: '書き方が決まっているので、機械でチェックできる', sub: '背景の名前・図の名前・行き先のシーン' },
    ],
    edges: [
      { id: 'engine', d: 'M128 79 L150 79', label: '読む', lx: 139, ly: 71, anchor: 'middle' },
      { id: 'screen', d: 'M260 79 L282 79' },
      { id: 'check', d: 'M68 144 L68 176', plain: true },
    ],
    pulse: { path: 'M68 79 L337 79', dur: '2.2s' },
  },
  archstyles: {
    title: 'モノリスとマイクロサービス',
    nodes: [
      { id: 'mono', x: 8, y: 10, w: 180, h: 230, label: 'モノリス', top: true },
      { id: 'mono', x: 20, y: 44, w: 156, h: 120, label: '1つのアプリ', sub: 'ゲーム・セーブ・ランキング' },
      { id: 'mono', x: 20, y: 176, w: 156, h: 52, label: 'データベース 1つ' },
      { id: 'micro', x: 212, y: 10, w: 180, h: 230, label: 'マイクロサービス', top: true },
      { id: 'micro', x: 224, y: 44, w: 72, h: 50, label: 'ゲーム' },
      { id: 'micro', x: 308, y: 44, w: 72, h: 50, label: 'セーブ' },
      { id: 'micro', x: 266, y: 104, w: 72, h: 50, label: 'ランキング' },
      { id: 'micro', x: 224, y: 176, w: 156, h: 52, label: 'サービスごとに DB', sub: '通信・監視が増える' },
    ],
    edges: [
      { id: 'mono', d: 'M98 164 L98 176', plain: true },
      { id: 'micro', d: 'M296 69 L308 69', both: true },
      { id: 'micro', d: 'M260 94 L280 104', both: true },
    ],
  },
  // ===== 有名なライブラリ編の図 =====
  ecomap: {
    title: 'ライブラリの地図',
    nodes: [
      { id: 'front', x: 8, y: 8, w: 186, h: 70, label: '画面を作る', sub: 'React・Vue・Svelte・Angular' },
      { id: 'meta', x: 206, y: 8, w: 186, h: 70, label: 'ページ・SSR まで', sub: 'Next.js・Nuxt・SvelteKit' },
      { id: 'app', x: 8, y: 88, w: 186, h: 70, label: 'アプリにする', sub: 'Electron・Tauri・React Native' },
      { id: 'server', x: 206, y: 88, w: 186, h: 70, label: 'サーバー・DB', sub: 'Express・NestJS・Prisma' },
      { id: 'tools', x: 8, y: 168, w: 384, h: 72, label: '作るのを支える道具', sub: 'Vite（ビルド）・Vitest・Playwright（テスト）・ESLint（点検）' },
    ],
    edges: [],
  },
  rendermode: {
    title: 'HTML をどこで作るか',
    nodes: [
      { id: 'csr', x: 8, y: 10, w: 384, h: 66, label: 'CSR（このゲーム）', sub: '空の HTML ＋ JS → ブラウザで画面を作る' },
      { id: 'ssr', x: 8, y: 88, w: 384, h: 66, label: 'SSR', sub: 'リクエストのたびにサーバーで HTML を作る' },
      { id: 'ssg', x: 8, y: 166, w: 384, h: 74, label: 'SSG', sub: 'ビルドのときに HTML を全部作っておく' },
    ],
    edges: [],
  },
  desktop: {
    title: 'Electron と Tauri',
    nodes: [
      { id: 'electron', x: 8, y: 8, w: 186, h: 166, label: 'Electron', top: true },
      { id: 'electron', x: 20, y: 40, w: 162, h: 40, label: '画面（HTML・CSS・JS）' },
      { id: 'bridge', x: 20, y: 86, w: 162, h: 28, label: 'preload（橋）', mono: true },
      { id: 'electron', x: 20, y: 120, w: 162, h: 44, label: 'Chromium ＋ Node.js', sub: '同梱 → 大きい' },
      { id: 'tauri', x: 206, y: 8, w: 186, h: 166, label: 'Tauri', top: true },
      { id: 'tauri', x: 218, y: 40, w: 162, h: 40, label: '画面（HTML・CSS・JS）' },
      { id: 'bridge', x: 218, y: 86, w: 162, h: 28, label: 'invoke（許可制）', mono: true },
      { id: 'tauri', x: 218, y: 120, w: 162, h: 44, label: 'OS の WebView ＋ Rust', sub: '借りる → 小さい' },
      { id: 'note', x: 8, y: 186, w: 384, h: 56, label: 'どちらも、このゲームの dist をそのまま入れられる' },
    ],
    edges: [],
  },
  mobile: {
    title: 'スマホアプリの作り方',
    nodes: [
      { id: 'rn', x: 8, y: 10, w: 186, h: 104, label: 'React Native', sub: 'React で書く・本物の部品で表示' },
      { id: 'flutter', x: 206, y: 10, w: 186, h: 104, label: 'Flutter', sub: 'Dart で書く・画面を全部自分で描く' },
      { id: 'capacitor', x: 8, y: 126, w: 186, h: 114, label: 'Capacitor', sub: 'Web の画面をそのままアプリに' },
      { id: 'pwa', x: 206, y: 126, w: 186, h: 114, label: 'PWA', sub: 'Web のままホーム画面へ・ストア不要' },
    ],
    edges: [],
  },
  // ===== 各編に足した授業の図 =====
  sworker: seq('Service Worker（ページとネットの間の門番）', [
    { id: 'page', label: 'ページ', sub: 'fetch する' },
    { id: 'sw', label: 'Service Worker', sub: '門番' },
    { id: 'net', label: 'ネットワーク', sub: 'サーバー' },
  ], [
    { id: 'req', from: 0, to: 1, y: 84, label: '① GET /index.html' },
    { id: 'cache', from: 1, to: 0, y: 122, label: '② キャッシュから返す（オフラインでも）' },
    { id: 'net', from: 1, to: 2, y: 168, label: '③ なければネットへ' },
    { id: 'net', from: 2, to: 1, y: 204, label: '④ 返事をしまっておく' },
  ]),
  realtime: {
    title: 'サーバーから知らせる方法',
    nodes: [
      { id: 'poll', x: 8, y: 10, w: 384, h: 66, label: 'ポーリング', sub: '数秒ごとに「何か来た？」と聞く（むだが多い）' },
      { id: 'ws', x: 8, y: 88, w: 384, h: 66, label: 'WebSocket', sub: 'つなぎっぱなし・どちらからでも送れる' },
      { id: 'sse', x: 8, y: 166, w: 384, h: 74, label: 'SSE', sub: 'サーバー → ブラウザの一方向・自動で再接続' },
    ],
    edges: [],
  },
  testpyramid: {
    title: 'テストピラミッド',
    nodes: [
      { id: 'e2e', x: 140, y: 10, w: 120, h: 56, label: 'E2E', sub: '少し・遅い' },
      { id: 'integration', x: 90, y: 80, w: 220, h: 66, label: '結合テスト', sub: '部品と API を組み合わせて' },
      { id: 'unit', x: 30, y: 160, w: 340, h: 80, label: '単体テスト', sub: 'たくさん・速い・関数や部品ひとつ' },
    ],
    edges: [],
  },
  cicd: {
    title: 'CI/CD',
    nodes: [
      { id: 'push', x: 8, y: 60, w: 72, h: 60, label: 'push' },
      { id: 'ci', x: 96, y: 30, w: 150, h: 120, label: 'CI（確かめる）', top: true },
      { id: 'ci', x: 108, y: 60, w: 126, h: 24, label: 'lint・型チェック' },
      { id: 'ci', x: 108, y: 90, w: 126, h: 24, label: 'テスト・ビルド' },
      { id: 'cd', x: 262, y: 30, w: 130, h: 120, label: 'CD（届ける）', top: true },
      { id: 'cd', x: 274, y: 60, w: 106, h: 24, label: '確認用の環境' },
      { id: 'cd', x: 274, y: 90, w: 106, h: 24, label: '本番' },
      { id: 'note', x: 8, y: 176, w: 384, h: 64, label: '失敗したら、そこで止まる', sub: 'こわれたものは本番に届かない' },
    ],
    edges: [
      { id: 'ci', d: 'M80 90 L96 90' },
      { id: 'cd', d: 'M246 90 L262 90' },
    ],
    pulse: { path: 'M44 90 L327 90', dur: '2.4s' },
  },
  observe: {
    title: '可観測性の3本の柱',
    nodes: [
      { id: 'logs', x: 8, y: 20, w: 120, h: 140, label: 'ログ', sub: '何が起きたか' },
      { id: 'metrics', x: 140, y: 20, w: 120, h: 140, label: 'メトリクス', sub: '数字の変化' },
      { id: 'traces', x: 272, y: 20, w: 120, h: 140, label: 'トレース', sub: 'どこで時間を使ったか' },
      { id: 'note', x: 8, y: 180, w: 384, h: 60, label: '3つをリクエストの番号でつなぐ', sub: 'OpenTelemetry・CloudWatch・Datadog など' },
    ],
    edges: [],
  },
}

// ===== 技術説明モードのシナリオ =====
// ずんだもんと四国めたんが、このゲーム自身を教材にして Vue を説明する。
// 書き方は scenario.js のシーンとまったく同じ（同じ GameView で再生する）。
// ちがうのは次の2つだけ：
//   ・選択肢を選んでも、本編の選び方（path）や通った分岐（visited）には記録しない
//   ・finish: true のシーンの最後のセリフで、タイトルに戻る
//   ・lessonMenu: 'top' / 'vue' など … 目次のシーン。選択肢のかわりに、サムネイルつきの目次を出す
// terminal はコードの表示に使う（1行40文字くらいまで。先頭の空白はそのまま出る）
// diagram は右側に図を出す（components/effects/LessonDiagram.vue）。'tree' か { type: 'tree', focus: 'MessageBox' }
// playground はコードエディタを開く（下の PG_〇〇）。プレイヤーが書きかえると、その場で動く

export const LESSON_START = 'lesson_intro'

// ===== 目次 =====
// 目次は2段：最初の目次で「編」を選び、編の目次で「授業」を選ぶ（components/LessonMenu.vue が表示する）
// 授業が終わると、その編の目次に戻ってくる。並び順は、おすすめの順番
//   section : 授業の見出し（まとめたコースの中で、もとの編の名前を出す）
//   track : 'basic'（きほん） | 'build'（つくる） | 'ship'（公開する） | 'server'（サーバー） | 'secure'（セキュリティ） | 'direct'（演出）  … カードの色分け
//   thumb : サムネイルに使う図（data/diagrams.js）  glyph : サムネイルに大きく出す文字
export const TRACKS = {
  basic: 'きほん',
  build: 'つくる',
  ship: '公開する',
  direct: '演出',
  eco: 'ライブラリ',
  server: 'サーバー',
  secure: 'セキュリティ',
}
export const EDITIONS = [
  {
    id: 'webhttp', menu: 'lesson_menu_webhttp', track: 'basic', thumb: 'internet', glyph: 'NET',
    title: 'インターネットと Web', desc: 'ネット・ブラウザ・HTTP',
    lessons: [
      { id: 'lesson_net_internet', title: "インターネットとは", desc: "ネットワークのネットワーク", section: 'インターネットのしくみ' },
      { id: 'lesson_net_ip', title: "IP アドレスとポート", desc: "あて先の住所と部屋番号", section: 'インターネットのしくみ' },
      { id: 'lesson_net_tcp', title: "TCP と UDP", desc: "とどけ方の2つの約束", section: 'インターネットのしくみ' },
      { id: 'lesson_net_dns', title: "DNS くわしく", desc: "名前から住所を調べる", section: 'インターネットのしくみ' },
      { id: 'lesson_net_layers', title: "階層と速さ", desc: "何層にも重なる約束・遅延と帯域", section: 'インターネットのしくみ' },
      { id: 'lesson_br_parts', title: "ブラウザの部品", desc: "エンジン・JS エンジン", section: 'ブラウザのしくみ' },
      { id: 'lesson_br_process', title: "タブとサンドボックス", desc: "ブラウザの安全なしくみ", section: 'ブラウザのしくみ' },
      { id: 'lesson_br_loading', title: "読みこみの順番", desc: "script・defer・preload", section: 'ブラウザのしくみ' },
      { id: 'lesson_br_storage', title: "ブラウザの保存場所", desc: "キャッシュ・Cookie・IndexedDB", section: 'ブラウザのしくみ' },
      { id: 'lesson_br_standards', title: "標準とブラウザのちがい", desc: "W3C・WHATWG・Can I use", section: 'ブラウザのしくみ' },
      { id: 'lesson_http', title: 'URL とサーバー', desc: 'Web ページが届くまで', section: 'Web のしくみ' },
      { id: 'lesson_devtools', title: '開発者ツール', desc: '画面の裏側をのぞく', section: 'Web のしくみ' },
      { id: 'lesson_js', title: 'JavaScript のきほん', desc: '変数・配列・関数・if', section: 'Web のしくみ' },
      { id: 'lesson_dom', title: 'DOM とイベント', desc: '画面を動かすしくみ', section: 'Web のしくみ' },
      { id: 'lesson_render', title: '描画のしくみ', desc: 'なぜ重くなるのか', section: 'Web のしくみ' },
      { id: 'lesson_storage', title: 'localStorage', desc: 'ブラウザにしまう', section: 'Web のしくみ' },
      { id: 'lesson_web_apis', title: "ブラウザの便利な API", desc: "見えたら・コピー・通知 など", section: 'Web のしくみ' },
      { id: 'lesson_web_pwa', title: "Service Worker と PWA", desc: "オフラインで動く Web", section: 'Web のしくみ' },
      { id: 'lesson_http_journey', title: '表示されるまで', desc: 'DNS・接続・TLS・リクエスト', section: 'HTTP' },
      { id: 'lesson_http_message', title: 'メッセージの中身', desc: '開始行・ヘッダー・本文', section: 'HTTP' },
      { id: 'lesson_http_status', title: 'ステータスコード', desc: 'だれの問題かを読む', section: 'HTTP' },
      { id: 'lesson_http_cache', title: 'キャッシュ', desc: 'Cache-Control・ETag・304', section: 'HTTP' },
      { id: 'lesson_http_cookie', title: 'Cookie とセッション', desc: 'ログインを覚えるしくみ', section: 'HTTP' },
      { id: 'lesson_http_cors', title: '同一オリジンと CORS', desc: 'プリフライトの下見', section: 'HTTP' },
      { id: 'lesson_http_https', title: 'HTTPS と HTTP/2・3', desc: 'TLS・証明書・新しい版', section: 'HTTP' },
      { id: 'lesson_http_realtime', title: "リアルタイム通信", desc: "WebSocket・SSE", section: 'HTTP' },
      { id: 'lesson_http_api_styles', title: "REST・GraphQL・gRPC", desc: "API の形いろいろ", section: 'HTTP' },
    ],
  },
  {
    id: 'htmlcss', menu: 'lesson_menu_htmlcss', track: 'basic', thumb: 'box', glyph: 'CSS',
    title: 'HTML と CSS', desc: 'はじめて〜スマホ対応',
    lessons: [
      { id: 'lesson_c0_first', title: 'CSS ってなに？', desc: '文字に色をつける', section: 'CSS はじめて' },
      { id: 'lesson_c0_text', title: '文字の見た目', desc: '大きさ・太さ・そろえ方', section: 'CSS はじめて' },
      { id: 'lesson_c0_color', title: '色の書き方', desc: '名前・#・rgb', section: 'CSS はじめて' },
      { id: 'lesson_c0_box', title: '背景と枠', desc: 'background・border', section: 'CSS はじめて' },
      { id: 'lesson_c0_space', title: 'すきまを作る', desc: 'padding・margin', section: 'CSS はじめて' },
      { id: 'lesson_c0_size', title: '大きさを決める', desc: 'width・height・%', section: 'CSS はじめて' },
      { id: 'lesson_c0_class', title: 'class で選ぶ', desc: '色をつける場所を決める', section: 'CSS はじめて' },
      { id: 'lesson_html', title: 'HTML', desc: 'タグで中身を書く', section: 'HTML・CSS' },
      { id: 'lesson_selector', title: 'セレクタ', desc: 'どこに・何を', section: 'HTML・CSS' },
      { id: 'lesson_box', title: 'ボックスモデル', desc: '箱の4つの層', section: 'HTML・CSS' },
      { id: 'lesson_flex', title: 'flex', desc: '横や縦に並べる', section: 'HTML・CSS' },
      { id: 'lesson_layer', title: 'position・z-index', desc: '重ねる', section: 'HTML・CSS' },
      { id: 'lesson_anim', title: 'アニメーション', desc: '動かす', section: 'HTML・CSS' },
      { id: 'lesson_form', title: 'フォーム', desc: 'label・入力の種類・チェック', section: 'HTML・CSS' },
      { id: 'lesson_a11y', title: 'アクセシビリティ', desc: 'だれでも使える画面', section: 'HTML・CSS' },
      { id: 'lesson_css_arch', title: "CSS の設計", desc: "名前の付け方・scoped・Modules", section: 'HTML・CSS' },
      { id: 'lesson_units', title: '大きさと色', desc: 'px・%・vw・rgba', section: 'CSS もっと' },
      { id: 'lesson_cssvars', title: 'CSS 変数', desc: '色や値をまとめて変える', section: 'CSS もっと' },
      { id: 'lesson_pseudo', title: ':hover・::before', desc: 'マウスを乗せたら', section: 'CSS もっと' },
      { id: 'lesson_transition', title: 'transition', desc: 'なめらかに変える', section: 'CSS もっと' },
      { id: 'lesson_effects', title: '色づくり', desc: 'グラデーション・影・フィルター', section: 'CSS もっと' },
      { id: 'lesson_grid', title: 'grid', desc: 'マス目に並べる', section: 'CSS もっと' },
      { id: 'lesson_responsive', title: 'レスポンシブ', desc: 'スマホ対応', section: 'CSS もっと' },
      { id: 'lesson_dark', title: "ダークモード", desc: "prefers-color-scheme", section: 'CSS もっと' },
    ],
  },
  {
    id: 'async', menu: 'lesson_menu_async', track: 'build', thumb: 'eventloop', glyph: 'ASYNC',
    title: '非同期 JS', desc: 'Promise・async/await',
    lessons: [
      { id: 'lesson_async_why', title: 'なぜ非同期？', desc: 'JavaScript の手は1本' },
      { id: 'lesson_async_loop', title: 'イベントループ', desc: '動く順番を予想する' },
      { id: 'lesson_async_promise', title: 'Promise', desc: 'コールバック地獄からの卒業' },
      { id: 'lesson_async_await', title: 'async / await', desc: '順番に待つ・まとめて待つ' },
      { id: 'lesson_async_tools', title: 'まとめて待つ・取り消す', desc: 'Promise.all・AbortController' },
      { id: 'lesson_async_ui', title: '画面での非同期', desc: 'ローディング・古い結果の上書き' },
      { id: 'lesson_async_retry', title: "失敗とやり直し", desc: "タイムアウト・リトライ" },
      { id: 'lesson_async_worker', title: "Web Worker", desc: "重い計算を別の手に" },
    ],
  },
  {
    id: 'vue', menu: 'lesson_menu_vue', track: 'build', thumb: 'tree', glyph: 'Vue',
    title: 'Vue のしくみ', desc: '画面が動くしくみ',
    lessons: [
      { id: 'lesson_component', title: 'コンポーネント', desc: '画面は「部品」でできている' },
      { id: 'lesson_reactive', title: 'ref・computed', desc: '値が変わると画面も変わる' },
      { id: 'lesson_directive', title: 'v-if・v-for', desc: '出す・消す・くり返す' },
      { id: 'lesson_props', title: 'props・emit', desc: '部品どうしの会話' },
      { id: 'lesson_vmodel', title: 'v-model とフォーム', desc: '入力と値をつなぐ' },
      { id: 'lesson_slot', title: 'スロット', desc: '部品に中身を差しこむ' },
      { id: 'lesson_watch', title: 'watch', desc: '変化を見張る' },
      { id: 'lesson_lifecycle', title: 'ライフサイクル', desc: '作られる・消える・後片付け' },
      { id: 'lesson_composable', title: 'コンポーザブル', desc: 'ロジックを使い回す' },
      { id: 'lesson_vue_transition', title: 'Transition', desc: '出入りのアニメーション' },
      { id: 'lesson_pinia', title: 'Pinia', desc: 'みんなの共有データ' },
      { id: 'lesson_router', title: 'Vue Router', desc: 'ページの切り替え' },
      { id: 'lesson_vue_perf', title: 'Vue を速くする', desc: 'computed・遅延読みこみ' },
    ],
  },
  {
    id: 'ts', menu: 'lesson_menu_ts', track: 'build', thumb: 'tscheck', glyph: 'TS',
    title: 'TypeScript', desc: '型で事故をふせぐ',
    lessons: [
      { id: 'lesson_ts_why', title: 'なぜ TypeScript', desc: '型チェックとは' },
      { id: 'lesson_ts_types', title: '型のきほん', desc: 'type・interface・union' },
      { id: 'lesson_ts_func', title: '関数と any', desc: 'ジェネリクス・unknown' },
      { id: 'lesson_ts_narrow', title: '型の絞りこみ', desc: 'union・switch・never' },
      { id: 'lesson_ts_util', title: 'ユーティリティ型', desc: 'Partial・Pick・as const・satisfies' },
      { id: 'lesson_ts_vue', title: 'Vue と TypeScript', desc: 'props・emit に型' },
      { id: 'lesson_ts_data', title: '外から来るデータ', desc: '型ガード・null' },
      { id: 'lesson_ts_config', title: 'tsconfig と運用', desc: 'strict・CI での型チェック' },
    ],
  },
  {
    id: 'design', menu: 'lesson_menu_design', track: 'build', thumb: 'layers2', glyph: 'ARCH',
    title: '設計', desc: '変えやすいコードの作り方',
    lessons: [
      { id: 'lesson_ds_good', title: '良い設計とは', desc: '凝集と結合' },
      { id: 'lesson_ds_srp', title: '役目を分ける', desc: '責務の分離・レイヤー' },
      { id: 'lesson_ds_di', title: '依存の向き', desc: '入れかえやすく・テストしやすく' },
      { id: 'lesson_ds_state', title: '状態の置き場所', desc: '1か所に・計算できるものは持たない' },
      { id: 'lesson_ds_data', title: 'データで動かす', desc: 'このゲームの設計' },
      { id: 'lesson_ds_principles', title: '原則とアンチパターン', desc: 'DRY・KISS・YAGNI・SOLID' },
      { id: 'lesson_ds_test', title: "テストしやすい設計", desc: "ピラミッド・依存を外に" },
      { id: 'lesson_ds_naming', title: "名前とコメント", desc: "読める コードのために" },
      { id: 'lesson_ds_arch', title: 'アーキテクチャと進め方', desc: 'モノリス・ADR・リファクタリング' },
    ],
  },
  {
    id: 'toolslib', menu: 'lesson_menu_toolslib', track: 'ship', thumb: 'ecomap', glyph: 'npm',
    title: '道具とライブラリ', desc: 'npm・Git・Electron…',
    lessons: [
      { id: 'lesson_web', title: 'HTML・CSS・JS', desc: 'Web ページの3つの材料', section: 'Web の道具' },
      { id: 'lesson_npm', title: 'npm', desc: '道具の倉庫', section: 'Web の道具' },
      { id: 'lesson_modules', title: 'import・export', desc: 'ファイルどうしをつなぐ', section: 'Web の道具' },
      { id: 'lesson_dev', title: 'Vite', desc: '保存したらすぐ映る', section: 'Web の道具' },
      { id: 'lesson_lint', title: 'ESLint と Prettier', desc: 'まちがいと見た目をそろえる', section: 'Web の道具' },
      { id: 'lesson_git', title: 'Git と GitHub', desc: 'ブランチ・PR・レビュー', section: 'Web の道具' },
      { id: 'lesson_build', title: 'ビルド', desc: '配れる形にまとめる', section: 'Web の道具' },
      { id: 'lesson_deploy', title: '公開', desc: 'みんなに遊んでもらう', section: 'Web の道具' },
      { id: 'lesson_cicd', title: "CI/CD", desc: "自動でテストして公開", section: 'Web の道具' },
      { id: 'lesson_monorepo', title: "パッケージ管理とモノレポ", desc: "npm・pnpm・ワークスペース", section: 'Web の道具' },
      { id: 'lesson_eco_map', title: '全体の地図', desc: 'どの道具が何をするか', section: '有名なライブラリ' },
      { id: 'lesson_eco_front', title: 'フロントのフレームワーク', desc: 'React・Vue・Svelte・Angular', section: '有名なライブラリ' },
      { id: 'lesson_eco_meta', title: 'メタフレームワーク', desc: 'Next.js・Nuxt・SSR・SSG', section: '有名なライブラリ' },
      { id: 'lesson_eco_desktop', title: 'デスクトップアプリ', desc: 'Electron と Tauri', section: '有名なライブラリ' },
      { id: 'lesson_eco_mobile', title: 'スマホアプリ', desc: 'React Native・Flutter・Capacitor', section: '有名なライブラリ' },
      { id: 'lesson_eco_ui', title: 'UI・状態・データ取得', desc: 'Tailwind・TanStack Query', section: '有名なライブラリ' },
      { id: 'lesson_eco_server', title: 'サーバーとデータベース', desc: 'NestJS・Hono・Prisma・zod', section: '有名なライブラリ' },
      { id: 'lesson_eco_choose', title: 'テストの道具と選び方', desc: 'Vitest・Playwright・選ぶ基準', section: '有名なライブラリ' },
      { id: 'lesson_eco_graphics', title: "グラフィックスの道具", desc: "Canvas・Three.js・PixiJS", section: '有名なライブラリ' },
      { id: 'lesson_eco_ai', title: "AI を組みこむ道具", desc: "LLM の SDK・気をつけること", section: '有名なライブラリ' },
    ],
  },
  {
    id: 'server', menu: 'lesson_menu_server', track: 'server', thumb: 'backend', glyph: 'API',
    title: 'サーバー', desc: 'Node.js・API・DB・Docker',
    lessons: [
      { id: 'lesson_node_what', title: 'Node.js とは', desc: 'ブラウザの外の JavaScript', section: 'Node.js' },
      { id: 'lesson_node_modules', title: 'モジュール', desc: 'ESM と CommonJS', section: 'Node.js' },
      { id: 'lesson_node_io', title: 'ノンブロッキング I/O', desc: '1本の手でたくさんさばく', section: 'Node.js' },
      { id: 'lesson_node_stream', title: 'ストリーム', desc: '大きなデータを少しずつ', section: 'Node.js' },
      { id: 'lesson_node_http', title: 'HTTP サーバーとミドルウェア', desc: 'Node だけ・Express', section: 'Node.js' },
      { id: 'lesson_node_errors', title: 'エラーと止まり方', desc: '落ちたとき・止めるとき', section: 'Node.js' },
      { id: 'lesson_node_tools', title: 'バージョンと道具', desc: 'LTS・nvm・--watch', section: 'Node.js' },
      { id: 'lesson_be_intro', title: 'バックエンドとは', desc: 'フロントとのちがい・処理の流れ', section: 'バックエンド' },
      { id: 'lesson_be_api', title: 'REST API', desc: 'メソッド・URL・ステータスコード', section: 'バックエンド' },
      { id: 'lesson_be_db', title: 'データベースと SQL', desc: 'テーブル・キー・トランザクション', section: 'バックエンド' },
      { id: 'lesson_be_security', title: '安全な API', desc: '入力チェック・SQL インジェクション', section: 'バックエンド' },
      { id: 'lesson_be_docker', title: 'Docker のきほん', desc: 'コンテナ・イメージ', section: 'バックエンド' },
      { id: 'lesson_be_dockerfile', title: 'Dockerfile', desc: 'このゲームをコンテナに入れる', section: 'バックエンド' },
      { id: 'lesson_be_compose', title: 'docker compose', desc: '手元でまとめて動かす', section: 'バックエンド' },
      { id: 'lesson_be_prod', title: '本番で動かす', desc: '環境変数・ログ・デプロイ', section: 'バックエンド' },
      { id: 'lesson_be_scale', title: 'スケールとキャッシュ', desc: 'たくさんの人が来たとき', section: 'バックエンド' },
      { id: 'lesson_be_paging', title: "一覧と検索", desc: "ページング・インデックス", section: 'バックエンド' },
      { id: 'lesson_be_observability', title: "可観測性", desc: "ログ・メトリクス・トレース", section: 'バックエンド' },
    ],
  },
  {
    id: 'security', menu: 'lesson_menu_security', track: 'secure', thumb: 'defense', glyph: 'SEC',
    title: 'セキュリティ', desc: 'OWASP Top 10 の守り',
    lessons: [
      { id: 'lesson_sec_mindset', title: '守りの考え方', desc: '信頼の境界・多層防御' },
      { id: 'lesson_sec_xss', title: 'XSS', desc: 'スクリプトを埋めこまれる' },
      { id: 'lesson_sec_injection', title: 'インジェクション', desc: 'SQL・コマンド・パス' },
      { id: 'lesson_sec_access', title: '認証と認可の守り', desc: '他人のデータ・パスワード' },
      { id: 'lesson_sec_csrf', title: 'CSRF・クリックジャッキング', desc: 'なりすましの操作' },
      { id: 'lesson_sec_secrets', title: '秘密と依存ライブラリ', desc: '.env・npm audit' },
      { id: 'lesson_sec_ops', title: 'ログと事故対応', desc: '気づいて、すぐ動く' },
      { id: 'lesson_sec_threat', title: "脅威モデリング", desc: "作る前に攻め方を考える" },
    ],
  },
  {
    id: 'aws', menu: 'lesson_menu_aws', track: 'ship', thumb: 'staticsite', glyph: 'CLOUD',
    title: 'クラウドとサービス', desc: 'AWS・Firebase など',
    lessons: [
      { id: 'lesson_aws_overview', title: '全体像', desc: 'リージョン・責任・料金', section: 'AWS' },
      { id: 'lesson_aws_authbasics', title: '認証のきほん', desc: '認証と認可・トークン・2種類の認証', section: 'AWS' },
      { id: 'lesson_aws_iam', title: 'IAM', desc: 'だれが・何をしてよいか', section: 'AWS' },
      { id: 'lesson_aws_creds', title: '認証情報', desc: 'SSO・OIDC・鍵の事故', section: 'AWS' },
      { id: 'lesson_aws_static', title: 'このゲームを公開', desc: 'S3・CloudFront', section: 'AWS' },
      { id: 'lesson_aws_compute', title: 'サーバーとサーバーレス', desc: 'EC2・ECS・Lambda', section: 'AWS' },
      { id: 'lesson_aws_data', title: 'DB とネットワーク', desc: 'RDS・DynamoDB・VPC', section: 'AWS' },
      { id: 'lesson_aws_auth', title: 'アプリのログイン', desc: 'Cognito・JWT', section: 'AWS' },
      { id: 'lesson_aws_ops', title: '監視・監査・コスト', desc: 'CloudWatch・IaC', section: 'AWS' },
      { id: 'lesson_aws_s3more', title: "S3 くわしく", desc: "署名付き URL・ライフサイクル", section: 'AWS' },
      { id: 'lesson_svc_map', title: "サービスの地図", desc: "何を借りるか", section: 'よく使うサービス' },
      { id: 'lesson_svc_baas', title: "Firebase と Supabase", desc: "ログイン・DB・保存をまとめて", section: 'よく使うサービス' },
      { id: 'lesson_svc_hosting', title: "公開の場所", desc: "Vercel・Netlify・Cloudflare", section: 'よく使うサービス' },
      { id: 'lesson_svc_pay', title: "支払い・メール・ログイン", desc: "Stripe・Resend・Auth0", section: 'よく使うサービス' },
      { id: 'lesson_svc_monitor', title: "見張りと分析", desc: "Sentry・Datadog・Analytics", section: 'よく使うサービス' },
    ],
  },
  {
    id: 'fx', menu: 'lesson_menu_fx', track: 'direct', thumb: 'stage3d', glyph: 'FX',
    title: '演出のひみつ', desc: 'カメラ・光・音の作り方',
    lessons: [
      { id: 'lesson_fx_text', title: '文字の「間」', desc: '1文字ずつ・沈黙・強調' },
      { id: 'lesson_fx_chara', title: '立ち絵の芝居', desc: 'まばたき・口パク・残響' },
      { id: 'lesson_fx_camera', title: 'カメラワーク', desc: '3D の舞台・めまいショット' },
      { id: 'lesson_fx_cutin', title: 'カットイン', desc: '目のアップの計算' },
      { id: 'lesson_fx_color', title: '色と光', desc: '色調補正・黒帯・光漏れ・粒' },
      { id: 'lesson_fx_screen', title: '画面効果', desc: 'グリッチ・集中線・衝撃波' },
      { id: 'lesson_fx_transition', title: '場面転換とムービー', desc: 'タイル・タイムリープ' },
      { id: 'lesson_fx_sound', title: '音の演出', desc: 'その場で作る音楽' },
      { id: 'lesson_fx_design', title: '演出の設計', desc: '重ね方・やりすぎない' },
    ],
  },
]
// 授業のシーン ID（見終わったかどうかを覚えるときに使う）
export const LESSON_IDS = new Set(EDITIONS.flatMap((e) => e.lessons.map((l) => l.id)))

// 目次のシーンの choices（ストアやスキップは、ふつうの選択肢として扱う）
const BACK = { text: '目次にもどる', next: 'lesson_menu' }
const MENU = [...EDITIONS.map((e) => ({ text: e.title, next: e.menu })), { text: 'おしまいにする', next: 'lesson_end' }]
const menuOf = (id) => [...EDITIONS.find((e) => e.id === id).lessons.map((l) => ({ text: l.title, next: l.id })), BACK]
const WEBHTTP_MENU = menuOf('webhttp')
const HTMLCSS_MENU = menuOf('htmlcss')
const SERVER_MENU = menuOf('server')
const TOOLSLIB_MENU = menuOf('toolslib')
const VUE_MENU = menuOf('vue')
const TS_MENU = menuOf('ts')
const AWS_MENU = menuOf('aws')
const FX_MENU = menuOf('fx')
const DESIGN_MENU = menuOf('design')
const ASYNC_MENU = menuOf('async')
const SECURITY_MENU = menuOf('security')


// ===== コードエディタの「やってみよう」（components/CodePlayground.vue） =====
// セリフに playground: PG_COUNTER のように書くと、文字を出し終わったあとにエディタが開く。
// check は右の結果の要素を受け取って、できたら true を返す（CLEAR! が出る）
const PG_COUNTER = {
  title: 'ref を動かしてみる',
  task: 'ボタンを押してみるのだ。それから ref(0) の 0 を 100 に書きかえてみるのだ',
  code: `
<script setup>
const count = ref(0)
</script>

<template>
  <p>ずんだ餅：{{ count }} 個</p>
  <button @click="count++">もう1個</button>
</template>

<style>
p { font-size: 20px; }
button { padding: 6px 14px; font-size: 16px; }
</style>
`,
  check: (el) => Number(el.textContent.match(/(\d+)\s*個/)?.[1]) >= 100,
}

const PG_COMPUTED = {
  title: 'computed で計算する',
  task: 'ボタンを押すと、下の数もいっしょに変わるのだ。* 2 を * 10 にしてみるのだ',
  code: `
<script setup>
const count = ref(1)
const result = computed(() => count.value * 2)
</script>

<template>
  <p>count：{{ count }}</p>
  <p>計算した答え：{{ result }}</p>
  <button @click="count++">count を増やす</button>
</template>

<style>
p { font-size: 18px; }
button { padding: 6px 14px; font-size: 16px; }
</style>
`,
  check: (el) => {
    const [a, b] = [...el.textContent.matchAll(/：(\d+)/g)].map((m) => Number(m[1]))
    return a > 0 && b === a * 10
  },
}

const PG_LIST = {
  title: 'v-for と v-if',
  task: "items に 'カップラーメン' を足して、3つにしてみるのだ（'枝豆' のうしろに , を付けて書く）",
  code: `
<script setup>
const items = ref(['ずんだ餅', '枝豆'])
const show = ref(true)
</script>

<template>
  <button @click="show = !show">出す・消す</button>
  <ul v-if="show">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>

<style>
button { padding: 6px 14px; font-size: 16px; }
li { font-size: 18px; margin: 4px 0; }
</style>
`,
  check: (el) => el.querySelectorAll('li').length >= 3,
}

const PG_WATCH = {
  title: 'watch で見張る',
  task: 'ボタンを3回押してみるのだ。できたら 3 を 5 に変えて、もう一度ためすのだ',
  code: `
<script setup>
const count = ref(0)
const message = ref('まだなのだ')

watch(count, (n) => {
  if (n === 3) message.value = n + '回押したのだ！'
})
</script>

<template>
  <button @click="count++">押す（{{ count }}）</button>
  <p>{{ message }}</p>
</template>

<style>
button { padding: 6px 14px; font-size: 16px; }
p { font-size: 20px; }
</style>
`,
  check: (el) => el.textContent.includes('回押したのだ'),
}

const PG_WEB = {
  title: 'HTML・CSS・JavaScript',
  task: 'CSS の orange を green や hotpink に変えてみるのだ。ボタンも押してみるのだ',
  code: `
<template>
  <h1 class="title">放課後リライト</h1>
  <button @click="pushed = true">押してみる</button>
  <p v-if="pushed">押したのだ！</p>
</template>

<script setup>
const pushed = ref(false)
</script>

<style>
.title { color: orange; }
button { padding: 6px 14px; font-size: 16px; }
</style>
`,
  check: (el) => {
    const h1 = el.querySelector('h1')
    return Boolean(h1) && getComputedStyle(h1).color !== 'rgb(255, 165, 0)'
  },
}


// ===== コードを見せる画面（components/CodePlayground.vue の view モード） =====
// 本物のファイルから抜き出した中身。marks の数字は、光らせる行（1 から数える）
const CV_SCENE = {
  view: true,
  title: "シーンのデータ",
  file: "src/data/scenario.js",
  task: "ゲームの中身は、こういうデータで書いてあるのだ",
  marks: { 4: "背景の絵", 5: "流す曲", 8: "だれが話すか", 9: "立ち絵", 10: "画面効果", 11: "本文" },
  code: `
lunch: {
  chapter: { no: '01', title: 'ふたりの研究会', … },
  place: { name: '屋上', time: '12:35' },
  bg: 'roof_day',
  bgm: 'day',
  lines: [
    {
      speaker: 'ずんだもん',
      chara: 'zun_smile',
      fx: 'burst',
      text: 'あったのだ！ 購買の、*最後のずんだ餅*なのだ！',
    },
    // …セリフが続く
  ],
},
`,
}

const CV_MESSAGEBOX = {
  view: true,
  title: "メッセージ欄の部品",
  file: "src/components/MessageBox.vue",
  task: "1つのファイルに、動き・見た目・飾りの3つが入っているのだ（短くしてあるのだ）",
  marks: { 1: "動き（script）", 9: "見た目（template）", 19: "飾り（style）" },
  code: `
<script setup>
defineProps({
  speaker: String,
  chars: Array,
  done: Boolean,
})
</script>

<template>
  <div class="message">
    <div v-if="speaker" class="speaker">{{ speaker }}</div>
    <p>
      <span v-for="(c, i) in chars" :key="i">{{ c.ch }}</span>
    </p>
    <span v-if="done" class="hint">▼</span>
  </div>
</template>

<style scoped>
.message { position: absolute; bottom: 24px; }
</style>
`,
}

const CV_TYPING = {
  view: true,
  title: "1文字ずつ出すしくみ",
  file: "src/views/GameView.vue",
  task: "本物のゲーム画面でも、ref と computed でこう書いてあるのだ（短くしてあるのだ）",
  marks: { 2: "ref（箱）", 3: "computed", 4: "computed", 8: "増やすだけ！" },
  code: `
// ===== タイプライター演出（1文字ずつ表示する） =====
const typedLength = ref(0) // いま何文字目まで出しているか
const typedChars = computed(() => chars.value.slice(0, typedLength.value))
const isTyping = computed(() => typedLength.value < chars.value.length)

// 1文字出して、少し待ってから次の文字へ
function typeNext() {
  typedLength.value++
  if (!isTyping.value) return
  typeTimer = setTimeout(typeNext, …)
}
`,
}

const CV_CHOICES = {
  view: true,
  title: "選択肢を出すしくみ",
  file: "GameView.vue ／ ChoiceList.vue",
  task: "v-if と v-for は、本物ではこう組み合わさっているのだ",
  marks: { 3: "条件に合うときだけ", 10: "数だけくり返す", 11: "見分けるための名札", 14: "値を文字で出す" },
  code: `
<!-- GameView.vue：読み終わったときだけ、選択肢を出す -->
<ChoiceList
  v-if="choosing"
  :choices="game.visibleChoices"
  @choose="game.choose"
/>

<!-- ChoiceList.vue：選択肢の数だけ、ボタンを並べる -->
<button
  v-for="(choice, i) in choices"
  :key="choice.text"
  @click="select(choice, i)"
>
  {{ choice.text }}
</button>
`,
}

const CV_PROPS = {
  view: true,
  title: "親と子のやりとり",
  file: "GameView.vue ／ MessageBox.vue ／ ChoiceList.vue",
  task: "props は上から下へ、emit は下から上へなのだ（短くしてあるのだ）",
  marks: { 3: "↓ props で渡す", 7: "↑ emit を受け取る", 10: "受け取る約束", 18: "↑ 親に知らせる" },
  code: `
<!-- 親：GameView.vue -->
<MessageBox
  :speaker="game.line.speaker"
  :chars="typedChars"
  :done="!isTyping"
/>
<ChoiceList :choices="game.visibleChoices" @choose="game.choose" />

// 子：MessageBox.vue（受け取る）
defineProps({
  speaker: String,
  chars: Array,
  done: Boolean,
})

// 子：ChoiceList.vue（知らせる）
const emit = defineEmits(['choose', 'pick'])
emit('choose', choice)
`,
}

const CV_WATCH = {
  view: true,
  title: "観測計の watch",
  file: "src/components/NixieMeter.vue",
  task: "右上の観測計が回るのも、watch のおかげなのだ（短くしてあるのだ）",
  marks: { 8: "見張る値", 9: "変わったら動く", 11: "画面が変わる" },
  code: `
const props = defineProps({
  value: String,
})
const shown = ref(props.value) // 実際に画面に出している文字列

// watch：props.value が変わったときだけ、中の関数が呼ばれる
watch(
  () => props.value,
  (newValue) => {
    // しばらく数字をランダムに回してから……
    shown.value = newValue // 本当の値を表示して止める
  },
)
`,
}

const CV_STORE = {
  view: true,
  title: "ゲームのストア",
  file: "src/stores/game.js",
  task: "state・getters・actions の3つでできているのだ（短くしてあるのだ）",
  marks: { 3: "ref にあたる", 10: "computed にあたる", 15: "ふつうの関数", 17: "クリックで1つ進む" },
  code: `
export const useGameStore = defineStore('game', {
  // state：保存しておくデータ
  state: () => ({
    sceneId: 'lunch', // いまのシーン
    lineIndex: 0,     // シーンの中で何番目のセリフか
    path: '',         // 今回の選び方
  }),

  // getters：state から計算する値
  getters: {
    scene: (state) => scenes[state.sceneId],
  },

  // actions：state を変える関数
  actions: {
    next() {
      this.lineIndex++
    },
  },
})
`,
}

const CV_ROUTER = {
  view: true,
  title: "URL とページの対応表",
  file: "src/router/index.js",
  task: "URL と画面の組を、配列に並べるだけなのだ（短くしてあるのだ）",
  marks: { 1: "ふつうの URL を使う", 8: "URL と画面の組", 10: "/ending/true など" },
  code: `
import { createRouter, createWebHistory } from 'vue-router'
import TitleView from '../views/TitleView.vue'
import GameView from '../views/GameView.vue'
// …

const routes = [
  { path: '/', component: TitleView },
  { path: '/game', component: GameView },
  { path: '/docs', component: GameView }, // 解説（同じ画面で授業を再生）
  // :type は「ルートパラメータ」
  { path: '/ending/:type', component: EndingView },
  { path: '/credits', component: CreditsView },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
`,
}

const CV_START = {
  view: true,
  title: "START ボタン",
  file: "src/views/TitleView.vue",
  task: "START を押したときに動く関数なのだ",
  marks: { 5: "ここでページが変わる" },
  code: `
function start() {
  play('impact')
  game.reset()               // ストアの action を呼んで、最初から始める
  game.playMovie('opening')  // オープニングムービーから始める
  router.push('/game')       // コードでページ移動する
}
`,
}

const CV_CSS = {
  view: true,
  title: "メッセージ欄の CSS",
  file: "src/components/MessageBox.vue",
  task: "場所と大きさを決めているのが CSS なのだ（一部だけ）",
  marks: { 4: "画面の下のほうに", 5: "重なりの順番", 6: "スマホでもはみ出さない幅", 7: "まんなかにそろえる" },
  code: `
.message {
  position: absolute;
  left: 50%;
  bottom: 24px;
  z-index: 2;
  width: min(900px, calc(100% - 32px));
  transform: translateX(-50%);
  min-height: 130px;
  padding: 22px 28px;
}
`,
}

const CV_PKG = {
  view: true,
  title: "package.json",
  file: "package.json",
  task: "借りている道具のリストと、命令のあだ名が書いてあるのだ",
  marks: { 7: "npm run dev", 8: "npm run build", 11: "遊ぶときに使う道具", 16: "作るときだけ使う道具" },
  code: `
{
  "name": "neko-novel",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "pinia": "^4.0.3",
    "vue": "^3.5.43",
    "vue-router": "^5.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.9",
    "vite": "^8.3.1"
  }
}
`,
}

const CV_INDEX = {
  view: true,
  title: "いちばん最初に開くファイル",
  file: "index.html",
  task: "中身はほとんど空っぽなのだ（短くしてあるのだ）",
  marks: { 9: "ここに Vue が画面を作る", 10: "main.js を読みこむ" },
  code: `
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>放課後リライト</title>
    <link href="https://fonts.googleapis.com/…" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`,
}

const CV_MAIN = {
  view: true,
  title: "アプリの入り口",
  file: "src/main.js",
  task: "import で道具を借りて、アプリを組み立てているのだ",
  marks: { 2: "npm で借りた道具", 4: "自分で書いたファイル", 10: "index.html の #app に出す" },
  code: `
// アプリの入り口
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

createApp(App)
  .use(createPinia()) // Pinia（共有データ）を使えるようにする
  .use(router)        // Vue Router（ページ切り替え）を使えるようにする
  .mount('#app')
`,
}

const CV_EXPORT = {
  view: true,
  title: "export と import",
  file: "lessons.js ／ stores/game.js",
  task: "export で貸して、import で借りるのだ",
  marks: { 2: "export で貸す", 3: "export で貸す", 6: "import で借りる" },
  code: `
// data/lessons.js（貸す側）
export const LESSON_START = 'lesson_intro'
export const lessonScenes = { … }

// stores/game.js（借りる側）
import { lessonScenes, LESSON_START } from '../data/lessons'
`,
}

const CV_HMR = {
  view: true,
  title: "ストアの差し替え",
  file: "src/stores/game.js",
  task: "ストアを書きかえたときも、ページを読みこみ直さずに差し替わるのだ",
  marks: { 3: "開発中だけ動く" },
  code: `
// 開発中にこのファイルを書き換えたとき、開いているページのストアも
// 新しい中身に差し替える（ホットリロード）
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
}
`,
}

const CV_VITECONFIG = {
  view: true,
  title: "Vite の設定",
  file: "vite.config.js",
  task: "このゲームの Vite の設定は、これだけなのだ",
  marks: { 7: "置き場所のフォルダ", 8: ".vue を読めるようにする" },
  code: `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // GitHub Pages では https://ユーザー名.github.io/リポジトリ名/ に置かれるので、
  // ビルドのときに BASE_PATH（例：/vuenovel/）を渡す。手元では / のまま
  base: process.env.BASE_PATH ?? '/',
  plugins: [vue()],
})
`,
}

const CV_DIST_INDEX = {
  view: true,
  title: "ビルドしたあとの index.html",
  file: "dist/index.html",
  task: "ビルドすると、読みこむファイルが書きかわるのだ（短くしてあるのだ）",
  marks: { 6: "まとめた JavaScript", 7: "まとめた CSS" },
  code: `
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>放課後リライト</title>
    <script type="module" crossorigin src="/assets/index-D5ke4YzN.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-FGgbxRK9.css">
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`,
}

const CV_BASE = {
  view: true,
  title: "GitHub Pages に置くとき",
  file: "vite.config.js",
  task: "URL の途中のフォルダに置くなら、base を設定するのだ。このゲームは、GitHub Actions からフォルダ名を渡しているのだ",
  marks: { 6: "ビルドのときに渡す", 7: "置き場所のフォルダ名" },
  code: `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // GitHub Pages では https://ユーザー名.github.io/リポジトリ名/ に置かれるので、
  // ビルドのときに BASE_PATH（例：/vuenovel/）を渡す。手元では / のまま
  base: process.env.BASE_PATH ?? '/',
  plugins: [vue()],
})
`,
}


// ===== HTML・CSS 編のコード =====
const CV_HTML_MESSAGE = {
  view: true,
  title: "メッセージ欄の HTML",
  file: "src/components/MessageBox.vue",
  task: "タグの中にタグが入っている「入れ子」なのだ（短くしてあるのだ）",
  marks: { 1: "いちばん外の箱", 2: "左上のかざり", 3: "名前", 4: "本文", 5: "1文字ずつ span" },
  code: `
<div class="message">
  <span class="bracket tl"></span>
  <div class="speaker">ずんだもん</div>
  <p>
    <span class="char">待</span>
    <span class="char">っ</span>
    <span class="char">て</span>
  </p>
  <span class="hint">▼</span>
</div>
`,
}

const CV_SELECTOR = {
  view: true,
  title: "四隅のかざりの CSS",
  file: "src/components/MessageBox.vue",
  task: "同じ class に、もう1つ class を足して、場所だけ変えているのだ",
  marks: { 2: "4つ共通の見た目", 8: "左上だけ", 11: "右下だけ" },
  code: `
/* 四隅の照準枠（飾り） */
.bracket {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 0 solid #ffb066;
}
.bracket.tl { top: -6px; left: -6px; border-top-width: 2px; border-left-width: 2px; }
.bracket.tr { top: -6px; right: -6px; border-top-width: 2px; border-right-width: 2px; }
.bracket.bl { bottom: -6px; left: -6px; border-bottom-width: 2px; border-left-width: 2px; }
.bracket.br { bottom: -6px; right: -6px; border-bottom-width: 2px; border-right-width: 2px; }
`,
}

const CV_BOX_MESSAGE = {
  view: true,
  title: "メッセージ欄の箱",
  file: "src/components/MessageBox.vue",
  task: "padding と border と box-sizing で、箱の大きさが決まるのだ（一部だけ）",
  marks: { 4: "上下22px・左右28px", 5: "幅に padding と枠をふくめる", 7: "左だけオレンジの太い線" },
  code: `
.message {
  width: min(900px, calc(100% - 32px));
  min-height: 130px;
  padding: 22px 28px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-left: 4px solid #ff7b00;
  background: linear-gradient(rgba(8, 10, 20, 0.86), rgba(8, 10, 20, 0.72));
}
`,
}

const CV_FLEX_TITLE = {
  view: true,
  title: "タイトル画面の並べ方",
  file: "src/views/TitleView.vue",
  task: "タイトル画面は、flex で縦にも横にも並べているのだ",
  marks: { 6: "縦に並べる", 7: "横方向のまんなか", 8: "縦方向のまんなか", 16: "すきま24px" },
  code: `
/* ロゴ・START・リンクを、縦にまんなかへ並べる */
.content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
}

/* WORLDLINE・ARCHIVE・CREDITS を横に並べる */
.sub-links {
  display: flex;
  gap: 24px;
}
`,
}

const CV_ZINDEX = {
  view: true,
  title: "重なりの順番",
  file: "MessageBox.vue ／ ChoiceList.vue ／ MoviePlayer.vue",
  task: "position: absolute で重ねて、z-index で順番を決めているのだ（一部だけ）",
  marks: { 3: "自由な場所に置く", 5: "2番目くらい", 11: "画面いっぱい", 12: "メッセージ欄より手前", 16: "いちばん手前" },
  code: `
/* MessageBox.vue：メッセージ欄 */
.message {
  position: absolute;
  bottom: 24px;
  z-index: 2;
}

/* ChoiceList.vue：選択肢（メッセージ欄より手前） */
.choices {
  position: absolute;
  inset: 0;
  z-index: 4;
}

/* MoviePlayer.vue：ムービー（いちばん手前） */
z-index: 10;
`,
}

const CV_ANIM_TITLE = {
  view: true,
  title: "START ボタンの光",
  file: "src/views/TitleView.vue",
  task: "START ボタンを光がなでていくのは、この CSS なのだ",
  marks: { 2: "ボタンの上に光の帯を足す", 10: "3.2秒ごとにくり返す", 12: "動きの台本", 14: "最初の4割で通りすぎる" },
  code: `
/* START ボタンを光がなでるように通り過ぎる */
.start::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40%;
  left: -60%;
  background: linear-gradient(90deg, transparent, rgba(255, 180, 100, 0.35), transparent);
  animation: sweep 3.2s ease-in-out infinite 1.5s;
}
@keyframes sweep {
  0% { left: -60%; }
  40%, 100% { left: 120%; }
}
`,
}

const PG_HTML = {
  title: "HTML のタグ",
  task: "<li> の行をコピーして、部員を3人にしてみるのだ",
  code: `
<template>
  <h1>時間工学研究会</h1>
  <p>部員<strong>募集中</strong>なのだ！</p>
  <ul>
    <li>ずんだもん（部長）</li>
    <li>僕（部員）</li>
  </ul>
  <button>入部する</button>
</template>

<style>
h1 { font-size: 22px; }
li { font-size: 16px; }
button { padding: 6px 14px; font-size: 16px; }
</style>
`,
  check: (el) => el.querySelectorAll('li').length >= 3,
}

const PG_SELECTOR = {
  title: "セレクタ",
  task: "2つめの <p> に class=\"metan\" を付けて、.metan { color: deeppink; } を足してみるのだ",
  code: `
<template>
  <p class="zun">ずんだもん：枝豆は最高なのだ！</p>
  <p>四国めたん：わたくしはお茶をいただきますわ。</p>
  <p>僕：……カップラーメンでいいや。</p>
</template>

<style>
/* セレクタ { プロパティ: 値; } */
.zun {
  color: green;
  font-weight: bold;
}
p {
  font-size: 16px;
}
</style>
`,
  check: (el) => {
    const p = el.querySelector('.metan')
    return Boolean(p) && getComputedStyle(p).color !== 'rgb(34, 34, 34)'
  },
}

const PG_BOX = {
  title: "ボックスモデル",
  task: "padding を 24px に、margin を 20px にして、箱がどう変わるか見るのだ",
  code: `
<template>
  <div class="box">メッセージ欄なのだ</div>
  <div class="box">となりの箱なのだ</div>
</template>

<style>
.box {
  padding: 4px;
  border: 3px solid #ff9a3c;
  margin: 4px;
  background: #fff3e6;
  font-size: 16px;
}
</style>
`,
  check: (el) => {
    const st = getComputedStyle(el.querySelector('.box'))
    return parseFloat(st.paddingTop) >= 20 && parseFloat(st.marginTop) >= 16
  },
}

const PG_FLEX = {
  title: "flex で並べる",
  task: "justify-content を center に変えてみるのだ。flex-direction: column; を足すと縦になるのだ",
  code: `
<template>
  <nav class="links">
    <a>WORLDLINE</a>
    <a>ARCHIVE</a>
    <a>CREDITS</a>
  </nav>
</template>

<style>
.links {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}
a {
  padding: 8px 12px;
  border: 1px solid #999;
  font-size: 14px;
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.links')).justifyContent === 'center',
}

const PG_LAYER = {
  title: "z-index で重ねる",
  task: ".bg の z-index を 5 にすると……背景がいちばん前に来てしまうのだ。やってみるのだ",
  code: `
<template>
  <div class="stage">
    <div class="layer bg">背景</div>
    <div class="layer chara">立ち絵</div>
    <div class="layer message">メッセージ欄</div>
  </div>
</template>

<style>
.stage { position: relative; height: 170px; }
.layer {
  position: absolute;
  width: 150px;
  height: 80px;
  padding: 6px;
  color: #fff;
  font-size: 15px;
}
.bg      { left: 0;    top: 0;    background: #4a6fa5; z-index: 1; }
.chara   { left: 40px; top: 35px; background: #4f9a40; z-index: 2; }
.message { left: 80px; top: 70px; background: #e07b20; z-index: 3; }
</style>
`,
  check: (el) => Number(getComputedStyle(el.querySelector('.bg')).zIndex) > 3,
}

const PG_ANIM = {
  title: "アニメーション",
  task: "2s を 0.5s に変えたり、-10px を -40px にしてみるのだ",
  code: `
<template>
  <p class="logo">放課後リライト</p>
</template>

<style>
.logo {
  margin-top: 40px;
  font-size: 28px;
  font-weight: bold;
  color: #ff7b00;
  animation: float 2s ease-in-out infinite;
}
/* @keyframes：動きの台本。0% から 100% までの変化を書く */
@keyframes float {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.logo')).animationDuration !== '2s',
}


// ===== Web のしくみ編・CSS もっと編のコード =====
const CV_URL = {
  view: true,
  title: "URL の読み方",
  file: "（例）",
  task: "URL は、いくつかの部品がつながってできているのだ",
  marks: { 1: "ぜんぶで1つの URL", 3: "鍵つきの通信なら https", 4: "サーバーの住所" },
  code: `
https://example.github.io/after-school/game?ending=true#top

https://            … プロトコル（どうやって通信するか）
example.github.io   … ドメイン（どのサーバーか）
/after-school/game  … パス（サーバーの中の、どの場所か）
?ending=true        … クエリ（おまけの情報）
#top                … ハッシュ（ページの中の位置）
`,
}

const PG_URL = {
  title: "URL を分解する",
  task: "URL の game を credits に書きかえて、パスが変わるのを見るのだ",
  code: `
<script setup>
// ブラウザにある URL という道具で、URL を部品に分ける
const url = new URL('https://example.github.io/after-school/game?ending=true#top')
</script>

<template>
  <table>
    <tr><th>プロトコル</th><td>{{ url.protocol }}</td></tr>
    <tr><th>ドメイン</th><td>{{ url.host }}</td></tr>
    <tr><th>パス</th><td>{{ url.pathname }}</td></tr>
    <tr><th>クエリ</th><td>{{ url.search }}</td></tr>
    <tr><th>ハッシュ</th><td>{{ url.hash }}</td></tr>
  </table>
</template>

<style>
table { border-collapse: collapse; font-size: 14px; }
th, td { padding: 6px 10px; border: 1px solid #ccc; text-align: left; }
th { background: #fff3e6; }
</style>
`,
  check: (el) => el.textContent.includes('/credits'),
}

const CV_SAVE = {
  view: true,
  title: "セーブデータ",
  file: "src/stores/game.js",
  task: "見たエンディングは、ブラウザの localStorage にしまってあるのだ",
  marks: { 2: "しまうときの名前", 6: "読み出す", 7: "うまくいかなくても止まらない", 14: "しまう" },
  code: `
// ----- 通った世界線をブラウザに保存する（ページを閉じても残る） -----
const SAVE_KEY = 'after-school-rewrite:visited'

function loadVisited() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) ?? []
  } catch {
    return [] // 保存が使えない環境でも、ゲームは動くようにする
  }
}

function saveVisited(visited) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(visited))
  } catch {
    // 保存できなくても、遊ぶのには困らないので何もしない
  }
}
`,
}

const CV_CONSOLE = {
  view: true,
  title: "Console に書き出す",
  file: "（例）",
  task: "console.log で、いまの値を Console に書き出せるのだ",
  marks: { 2: "値をのぞく", 6: "Console の表示" },
  code: `
// コードの好きな場所に書いておくと……
console.log('いまのシーン:', game.sceneId)
console.log('選んだ番号:', game.path)

// Console タブに、こう出る
// > いまのシーン: lunch
// > 選んだ番号: 10
`,
}

const CV_ENDING = {
  view: true,
  title: "エンディングの決め方",
  file: "src/data/scenario.js",
  task: "オブジェクトと関数で、選び方からエンディングを決めているのだ（一部だけ）",
  marks: { 2: "オブジェクト（対応表）", 7: "TRUE END の選び方", 11: "関数", 12: "見つからないときは lost" },
  code: `
// 3回の選び方で、8通りのエンディングに分かれる
export const endingByPath = {
  '000': 'deja',
  '001': 'allB',
  '010': 'lost',
  '011': 'night',
  '101': 'true',
  // …
}

export function getEndingType(path) {
  return endingByPath[path] ?? 'lost'
}
`,
}

const PG_JS = {
  title: "JavaScript のきほん",
  task: "mochi を 5 にして、club に '四国めたん' を足してみるのだ",
  code: `
<script setup>
// 変数：名前を付けて、値をしまう
let mochi = 3

// 配列：値をまとめて並べる
const club = ['ずんだもん', '僕']

// 関数：やることをまとめて、名前を付ける
function judge(count) {
  // if：条件で分ける
  if (count >= 5) {
    return 'ずんだ餅パーティーなのだ！'
  }
  return 'もっとずんだ餅がほしいのだ'
}
</script>

<template>
  <p>部員は {{ club.length }} 人：{{ club.join('・') }}</p>
  <p>ずんだ餅 {{ mochi }} 個 → {{ judge(mochi) }}</p>
</template>

<style>
p { font-size: 17px; }
</style>
`,
  check: (el) => el.textContent.includes('パーティー') && el.textContent.includes('3 人'),
}

const CV_VANILLA = {
  view: true,
  title: "Vue があるとき・ないとき",
  file: "（例）くらべてみる",
  task: "Vue がないと、画面を書きかえるのも自分でやるのだ",
  marks: { 2: "要素を探す", 6: "クリックを待つ", 8: "自分で書きかえる", 12: "Vue なら1行" },
  code: `
// Vue を使わないとき：自分で要素を探して、書きかえる
const button = document.querySelector('#next')
const message = document.querySelector('#message')
let index = 0

button.addEventListener('click', () => {
  index++
  message.textContent = lines[index]
})

// Vue を使うとき：値を変えるだけ（画面は Vue が書きかえる）
// <button @click="game.next()">つぎへ</button>
// <p>{{ game.line.text }}</p>
`,
}

const PG_DOM = {
  title: "いろいろなイベント",
  task: "ボタンを押したり、マウスを乗せたり、文字を打ったりしてみるのだ（記録が3つたまったらクリア）",
  code: `
<script setup>
const log = ref([])
function add(text) {
  log.value = [text, ...log.value].slice(0, 5) // 新しいものを上に、5つまで
}
</script>

<template>
  <button @click="add('クリックされたのだ')">クリック</button>
  <button @mouseenter="add('マウスが乗ったのだ')">乗せるだけ</button>
  <input placeholder="ここに入力" @input="add('入力：' + $event.target.value)" />
  <ul>
    <li v-for="(item, i) in log" :key="i">{{ item }}</li>
  </ul>
</template>

<style>
button { margin: 0 6px 6px 0; padding: 6px 12px; font-size: 15px; }
input { padding: 6px; font-size: 16px; width: 140px; }
li { font-size: 15px; }
</style>
`,
  check: (el) => el.querySelectorAll('li').length >= 3,
}

const PG_STORAGE = {
  title: "localStorage にしまう",
  task: "メモを書いて保存したら、「もとに戻す」を押してみるのだ。コードが最初に戻っても、メモは残っているのだ",
  code: `
<script setup>
// localStorage：ブラウザに文字をしまっておける（ページを閉じても残る）
const KEY = 'after-school-rewrite:memo'
const memo = ref(localStorage.getItem(KEY) ?? '')
const saved = ref('')

function save() {
  localStorage.setItem(KEY, memo.value)
  saved.value = '保存したのだ！'
}
</script>

<template>
  <textarea v-model="memo" rows="3" placeholder="キミのメモ"></textarea>
  <button @click="save">保存する</button>
  <p>{{ saved }}</p>
</template>

<style>
textarea { display: block; width: 100%; box-sizing: border-box; font-size: 16px; }
button { margin-top: 6px; padding: 6px 14px; font-size: 15px; }
</style>
`,
  check: () => Boolean(localStorage.getItem('after-school-rewrite:memo')),
}

const CV_UNITS = {
  view: true,
  title: "大きさと色の書き方",
  file: "GameView.vue ／ TitleView.vue ／ MessageBox.vue",
  task: "このゲームでは、いろいろな単位を使い分けているのだ",
  marks: { 2: "画面の高さの100%", 5: "小さすぎず大きすぎず", 8: "小さいほうを使う", 11: "0.86 = ほぼ黒" },
  code: `
/* GameView.vue：画面の高さいっぱい */
.screen { height: 100vh; }

/* TitleView.vue：画面の幅に合わせて、ロゴの大きさを変える */
h1 { font-size: clamp(2.4rem, 8vw, 4.5rem); }

/* MessageBox.vue：最大 900px。せまい画面では左右を 16px ずつあける */
.message { width: min(900px, calc(100% - 32px)); }

/* MessageBox.vue：少しすけた黒（最後の数字が濃さ） */
background: linear-gradient(rgba(8, 10, 20, 0.86), rgba(8, 10, 20, 0.72));
`,
}

const PG_UNITS = {
  title: "単位と色",
  task: "50% を 100% に、rgba の 0.4 を 1 にしてみるのだ（0 でとうめい、1 ではっきり）",
  code: `
<template>
  <div class="bar px">200px</div>
  <div class="bar percent">50%</div>
  <div class="bar em">10em</div>
  <span class="dot" style="background: #ff7b00">#ff7b00</span>
  <span class="dot" style="background: rgb(77, 160, 60)">rgb()</span>
  <span class="dot alpha">rgba()</span>
</template>

<style>
.bar {
  height: 28px;
  margin-bottom: 6px;
  padding-left: 6px;
  line-height: 28px;
  font-size: 12px;
  color: #fff;
  background: #4a6fa5;
}
.px      { width: 200px; }
.percent { width: 50%; }
.em      { width: 10em; }
.dot {
  display: inline-block;
  width: 72px;
  margin: 6px 6px 0 0;
  line-height: 48px;
  text-align: center;
  font-size: 11px;
  color: #fff;
}
.alpha { background: rgba(74, 111, 165, 0.4); }
</style>
`,
  check: (el) => {
    const bar = el.querySelector('.percent')
    return Boolean(bar) && bar.offsetWidth >= el.offsetWidth * 0.9
  },
}

const CV_PSEUDO = {
  view: true,
  title: "ボタンとロゴのしかけ",
  file: "App.vue ／ TitleView.vue",
  task: ":hover と ::before・::after は、このゲームのあちこちで使っているのだ（一部だけ）",
  marks: { 2: "マウスが乗っているあいだ", 8: "文字の前に、もう1枚", 10: "data-text の文字を使う", 14: "赤いずれ", 15: "青いずれ" },
  code: `
/* App.vue：マウスが乗ったら、ボタンが光る */
button:hover {
  background: rgba(255, 123, 0, 0.25);
  box-shadow: 0 0 18px rgba(255, 123, 0, 0.5);
}

/* TitleView.vue：ロゴのグリッチ。同じ文字を、もう2枚重ねる */
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text); /* 同じ文字をもう2枚重ねる */
  position: absolute;
  inset: 0;
}
.glitch-text::before { color: #ff2a6d; }
.glitch-text::after { color: #05d9e8; }
`,
}

const PG_PSEUDO = {
  title: ":hover と ::before",
  task: "ボタンにマウスを乗せてみるのだ。それから content: '' を content: '▶ ' にしてみるのだ",
  code: `
<template>
  <button class="btn">START</button>
</template>

<style>
.btn {
  padding: 10px 28px;
  font-size: 18px;
  color: #fff;
  background: #1c2033;
  border: 1px solid #ff9a3c;
}
/* :hover … マウスが乗っているあいだだけ */
.btn:hover {
  background: #ff7b00;
}
/* ::before … 中身の前に、文字や飾りを足す */
.btn::before {
  content: '';
}
</style>
`,
  check: (el) => {
    const btn = el.querySelector('.btn')
    return Boolean(btn) && getComputedStyle(btn, '::before').content.includes('▶')
  },
}

const CV_TRANSITION = {
  view: true,
  title: "なめらかに変わるところ",
  file: "App.vue ／ GameView.vue",
  task: "選択肢が出るとき、背景がゆっくり暗くなるのも transition なのだ",
  marks: { 3: "0.2秒でなめらかに", 8: "0.6秒と0.8秒", 11: "選択肢のときだけ", 12: "色をうすく・暗く" },
  code: `
/* App.vue：ボタンの色と光を、0.2秒かけて変える */
button {
  transition: background 0.2s, box-shadow 0.2s;
}

/* GameView.vue：背景の層 */
.world {
  transition: filter 0.6s, transform 0.8s;
}
/* 選択肢が出ている間は、世界が止まったように色が抜ける */
.choosing .world {
  filter: saturate(0.35) brightness(0.65);
  transform: scale(1.03);
}
`,
}

const PG_TRANSITION = {
  title: "transition",
  task: "0.3s を 1s にしたり、transition の行を消したりしてみるのだ。消すと、いきなり変わるのだ",
  code: `
<template>
  <div class="card">マウスを乗せるのだ</div>
</template>

<style>
.card {
  width: 180px;
  padding: 24px;
  text-align: center;
  font-size: 16px;
  background: #fff;
  border: 2px solid #ff9a3c;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.card:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.card')).transitionDuration !== '0.3s, 0.3s',
}

const CV_EFFECTS = {
  view: true,
  title: "このゲームの色づくり",
  file: "GameView.vue ／ MessageBox.vue",
  task: "シーンの色味や、メッセージ欄のすけ感は、こう作っているのだ（一部だけ）",
  marks: { 2: "夕焼けっぽく", 4: "冷たい感じに", 8: "上から下へ色が変わる", 9: "後ろをぼかす", 10: "影" },
  code: `
/* GameView.vue：色調補正（シーンの grade で切りかえる） */
.grade-warm { filter: sepia(0.25) saturate(1.25) contrast(1.05); }
.grade-teal { filter: hue-rotate(-12deg) saturate(1.2) contrast(1.15) brightness(0.95); }
.grade-cold { filter: saturate(0.7) hue-rotate(15deg) brightness(0.9) contrast(1.1); }

/* MessageBox.vue：メッセージ欄 */
.message {
  background: linear-gradient(rgba(8, 10, 20, 0.86), rgba(8, 10, 20, 0.72));
  backdrop-filter: blur(6px); /* 後ろの背景をぼかす */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}
`,
}

const PG_EFFECTS = {
  title: "フィルターとグラデーション",
  task: "filter を grayscale(1) や hue-rotate(90deg) や blur(3px) に変えてみるのだ",
  code: `
<template>
  <div class="photo"></div>
  <p class="title">放課後リライト</p>
</template>

<style>
.photo {
  height: 150px;
  background: url(images/bg/roof_evening.webp) center / cover;
  filter: sepia(0.25) saturate(1.25);
}
.title {
  margin: 10px 0 0;
  padding: 6px 12px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #1c2033, #ff7b00);
  text-shadow: 0 0 8px #ff9a3c;
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.photo')).filter !== 'sepia(0.25) saturate(1.25)',
}

const CV_GRID = {
  view: true,
  title: "目次のカード",
  file: "src/components/LessonMenu.vue",
  task: "この授業の目次のカードも、grid で並べているのだ",
  marks: { 3: "マス目にする", 4: "同じ幅の列を6つ", 5: "すきま", 12: "こちらは2列" },
  code: `
/* 編のカード：同じ幅の列を6つ */
.cards {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  width: min(1120px, 100%);
}

/* 授業の一覧：同じ幅の列を2つ */
.rows {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
`,
}

const PG_GRID = {
  title: "grid で並べる",
  task: "repeat(3, 1fr) の 3 を 2 や 6 に変えてみるのだ",
  code: `
<template>
  <div class="gallery">
    <div v-for="n in 6" :key="n" class="cell">スチル {{ n }}</div>
  </div>
</template>

<style>
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.cell {
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background: #4a6fa5;
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.gallery')).gridTemplateColumns.split(' ').length !== 3,
}

const CV_MEDIA = {
  view: true,
  title: "スマホのときだけ",
  file: "index.html ／ LessonMenu.vue",
  task: "画面がせまいときだけ、別の CSS を使っているのだ",
  marks: { 2: "これがないとスマホで小さく表示される", 5: "640px 以下のときだけ", 6: "カードは2列に", 7: "授業は1列に" },
  code: `
<!-- index.html：スマホでも、画面の幅どおりに表示する -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

/* LessonMenu.vue：画面の幅が 640px 以下のときだけ */
@media (max-width: 640px) {
  .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .rows { grid-template-columns: minmax(0, 1fr); }
}
`,
}

const PG_RESPONSIVE = {
  title: "幅で見た目を変える",
  task: "右下のかどをドラッグして、枠をせまくしてみるのだ。260px を 600px に変えてもいいのだ",
  code: `
<template>
  <div class="frame">
    <nav class="menu">
      <a>WORLDLINE</a>
      <a>ARCHIVE</a>
      <a>CREDITS</a>
    </nav>
  </div>
  <p class="tip">↑ 枠の右下のかどを、左へドラッグ</p>
</template>

<style>
/* 枠の幅で見た目を変える（スマホ対応の練習） */
.frame {
  container-type: inline-size;
  resize: horizontal;
  overflow: auto;
  width: 100%;
  min-width: 120px;
  padding: 8px;
  border: 2px dashed #999;
  box-sizing: border-box;
}
.menu { display: flex; gap: 8px; }
.menu a { padding: 8px; border: 1px solid #ff9a3c; font-size: 13px; }
.tip { font-size: 12px; color: #888; }

/* 枠の幅が 260px 以下になったら、縦に並べる */
@container (max-width: 260px) {
  .menu { flex-direction: column; }
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.menu')).flexDirection === 'column',
}

// ===== TypeScript 編・AWS 編のコード =====
const CV_TS_BUG = {
  view: true,
  title: "JavaScript と TypeScript",
  file: "（例）",
  task: "同じまちがいでも、気づくタイミングがちがうのだ",
  marks: { 3: "実行してやっと気づく", 6: ": Line が型", 7: "動かす前に気づける" },
  code: `
// JavaScript：書きまちがえても、動かすまで気づけない
const line = { speaker: 'ずんだもん', txt: 'あったのだ！' }
showMessage(line.text)   // → 画面に undefined と出る

// TypeScript：保存した瞬間に、エディタが赤線を引く
const line: Line = { speaker: 'ずんだもん', txt: 'あったのだ！' }
// エラー TS2561：'txt' というプロパティは Line にない。
//               'text' のまちがいでは？
`,
}

const CV_TS_SCENE = {
  view: true,
  title: "このゲームのデータに型を付けると",
  file: "src/types/scene.ts（もし TypeScript なら）",
  task: "シーンやセリフの「形」を、型で決めておくのだ",
  marks: { 1: "union 型（どれか1つ）", 6: "null もありえる", 8: "なくてもよい", 18: "配列の型" },
  code: `
type Speaker = 'ずんだもん' | '四国めたん' | '僕' | 'SYSTEM' | ''
type Fx = 'shake' | 'flash' | 'glitch' | 'burst'

interface Line {
  speaker: Speaker
  chara: string | null   // 立ち絵がないときは null
  text: string
  fx?: Fx                // ? は「なくてもよい」
}

interface Choice {
  text: string
  next: string
}

interface Scene {
  bg: string
  lines: Line[]          // Line の配列
  choices?: Choice[]
  next?: string
}
`,
}

const CV_TS_UNION = {
  view: true,
  title: "決まった値しか入らない",
  file: "（例）",
  task: "union 型にしておくと、打ちまちがいがエラーになるのだ",
  marks: { 5: "打ちまちがい", 7: "すぐ気づける", 11: "これもエラー" },
  code: `
const line: Line = {
  speaker: 'ずんだもん',
  chara: 'zun_surprise',
  text: '揺れるのだ！',
  fx: 'shoke',
}
// エラー TS2322：'"shoke"' は Fx 型に入れられない
//   （Fx は 'shake' | 'flash' | 'glitch' | 'burst'）

const who: Speaker = 'ずんだもん'  // OK
const who2: Speaker = 'ずんだ'     // エラー：候補にない
`,
}

const CV_TS_FUNC = {
  view: true,
  title: "関数・推論・ジェネリクス",
  file: "（例）",
  task: "型は全部書かなくても、TypeScript がかなり見ぬいてくれるのだ",
  marks: { 2: "引数と戻り値の型", 7: "書かなくてもわかる", 11: "T はあとで決まる型", 14: "T = number" },
  code: `
// 引数と戻り値に型を付ける
function getEndingType(path: string): EndingId {
  return endingByPath[path] ?? 'lost'
}

// 型推論：書かなくても、型がわかる
const count = 3              // number
const club = ['ずんだもん']  // string[]

// ジェネリクス：「中身の型」を、使うときに決める
function last<T>(items: T[]): T | undefined {
  return items[items.length - 1]
}
const a = last([1, 2, 3])        // number | undefined
const b = last(['僕', 'めたん']) // string | undefined
`,
}

const CV_TS_ANY = {
  view: true,
  title: "any と unknown",
  file: "（例）",
  task: "any は型チェックを止めてしまうのだ。わからないときは unknown なのだ",
  marks: { 2: "チェックが止まる", 3: "本番で落ちる", 6: "わからないなら unknown", 9: "確かめてから使う" },
  code: `
// any：型チェックが止まる（なんでも通ってしまう）
const a: any = JSON.parse(text)
a.foo.bar.baz()       // エラーにならない → 実行してから落ちる

// unknown：確かめるまで使えない
const u: unknown = JSON.parse(text)
u.foo                 // エラー TS18046：'u' の型は unknown

if (typeof u === 'object' && u !== null && 'foo' in u) {
  // ここまで確かめれば、安全に使える
}
`,
}

const CV_TS_VUE = {
  view: true,
  title: "Vue の部品に型を付ける",
  file: "MessageBox.vue（もし TypeScript なら）",
  task: "<script setup lang=\"ts\"> にすると、props や emit に型が付くのだ",
  marks: { 1: "TypeScript で書く", 9: "props の型", 15: "emit の型", 19: "型は推論される" },
  code: `
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Char {
  ch: string
  style: string | null
}

const props = defineProps<{
  speaker: string
  chars: Char[]
  done: boolean
}>()

const emit = defineEmits<{
  next: []                  // 引数なし
}>()

const typedLength = ref(0)  // Ref<number>（推論される）
const isTyping = computed(() => typedLength.value < props.chars.length)
</script>
`,
}

const CV_TS_PROPS_ERR = {
  view: true,
  title: "部品の使い方もチェックされる",
  file: "GameView.vue（もし TypeScript なら）",
  task: "vue-tsc を使うと、template の中のまちがいも見つかるのだ",
  marks: { 2: "型がちがう", 7: "渡し忘れ" },
  code: `
<!-- speaker は string のはず -->
<MessageBox :speaker="123" :chars="typedChars" :done="!isTyping" />
<!-- エラー：number は string に入れられない -->

<!-- done を渡し忘れた -->
<MessageBox :speaker="game.line.speaker" :chars="typedChars" />
<!-- エラー：done がたりない -->
`,
}

const CV_TS_FETCH = {
  view: true,
  title: "外から来たデータを確かめる",
  file: "（例）",
  task: "as は「決めつけ」なのだ。外から来たものは、中身を確かめるのだ",
  marks: { 6: "決めつけ（確かめていない）", 9: "型ガード", 15: "だめなら止める", 18: "ここからは安全" },
  code: `
interface SaveData {
  visited: string[]
}

// あぶない：as で「SaveData だ」と決めつけるだけ（中身は見ていない）
const data = (await res.json()) as SaveData

// よい：中身を確かめてから使う（型ガード）
function isSaveData(v: unknown): v is SaveData {
  return typeof v === 'object' && v !== null &&
    Array.isArray((v as { visited?: unknown }).visited)
}

const json: unknown = await res.json()
if (!isSaveData(json)) {
  throw new Error('セーブデータがこわれています')
}
json.visited  // ここからは SaveData として安全に使える
`,
}

const CV_TS_NULL = {
  view: true,
  title: "null と undefined",
  file: "（例）",
  task: "null かもしれない値は、そのままでは使えないのだ",
  marks: { 1: "見つからないと null", 3: "そのままは使えない", 6: "?. で安全に", 9: "なかったときの値" },
  code: `
const el = document.querySelector('#app')  // Element | null
el.textContent = 'hi'
// エラー TS18047：'el' は null かもしれない

// ?. … null・undefined なら、そこで止まる
el?.classList.add('ready')

// ?? … null・undefined のときだけ、右の値を使う
const name = user.name ?? '名無し'

// noUncheckedIndexedAccess を有効にすると……
const first = lines[0]   // Line | undefined（ないかもしれない）
`,
}

const CV_TSCONFIG = {
  view: true,
  title: "tsconfig.json",
  file: "tsconfig.json（Vite + Vue の例）",
  task: "型チェックの厳しさは、ここで決めるのだ",
  marks: { 6: "きびしいチェックを全部オン", 7: "配列[0] も undefined かも", 8: "チェックだけ（変換は Vite）", 9: "import.meta.env などの型" },
  code: `
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
`,
}

const CV_TS_SCRIPTS = {
  view: true,
  title: "型チェックを止めないしくみ",
  file: "package.json ／ src/env.d.ts",
  task: "Vite はビルドのときに型チェックをしないのだ。だから自分で入れるのだ",
  marks: { 4: "型チェックだけ", 5: "エラーならビルドしない", 10: "打ちまちがいを防ぐ" },
  code: `
// package.json
"scripts": {
  "dev": "vite",
  "typecheck": "vue-tsc --noEmit",
  "build": "vue-tsc --noEmit && vite build"
}

// src/env.d.ts：自分で決めた環境変数にも型を付ける
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}
`,
}

const CV_IAM_POLICY = {
  view: true,
  title: "デプロイ用のポリシー",
  file: "IAM ポリシー（JSON）",
  task: "S3 へのアップロードと、CloudFront のキャッシュ消しだけを許可するのだ",
  marks: { 5: "許可する（Deny もある）", 6: "何をしてよいか", 7: "どれに対して", 16: "必要なものだけ" },
  code: `
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::after-school-site/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::after-school-site"
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::123456789012:distribution/E1EXAMPLE"
    }
  ]
}
`,
}

const CV_SSO = {
  view: true,
  title: "SSO でログインする設定",
  file: "~/.aws/config",
  task: "アクセスキーを作らずに、ブラウザでログインして使うのだ",
  marks: { 4: "借りる権限", 8: "会社のログイン画面", 13: "数時間で切れる鍵をもらう" },
  code: `
[profile dev]
sso_session = my-sso
sso_account_id = 123456789012
sso_role_name = DeveloperAccess
region = ap-northeast-1

[sso-session my-sso]
sso_start_url = https://my-org.awsapps.com/start
sso_region = ap-northeast-1
sso_registration_scopes = sso:account:access

# 使うとき
# $ aws sso login --profile dev   ← ブラウザが開く
# $ aws s3 ls --profile dev       ← 一時的な鍵で動く
`,
}

const CV_TRUST = {
  view: true,
  title: "ロールの信頼ポリシー",
  file: "IAM ロール（信頼ポリシー）",
  task: "「このリポジトリの main ブランチだけに貸す」と決めるのだ",
  marks: { 6: "GitHub を信頼する", 8: "トークンと交換で貸す", 14: "どのリポジトリ・ブランチか" },
  code: `
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
      },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:my-org/after-school:ref:refs/heads/main"
      }
    }
  }]
}
`,
}

const CV_BUCKET_POLICY = {
  view: true,
  title: "S3 のバケットポリシー",
  file: "S3 バケットポリシー（OAC）",
  task: "S3 は非公開のまま、この CloudFront からだけ読ませるのだ",
  marks: { 5: "CloudFront に", 6: "読むことだけ", 10: "この CloudFront だけ" },
  code: `
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "cloudfront.amazonaws.com" },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::after-school-site/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/E1EXAMPLE"
      }
    }
  }]
}
`,
}

const CV_CDK_SITE = {
  view: true,
  title: "公開先をコードで作る",
  file: "AWS CDK（TypeScript）",
  task: "手作業ではなく、コードで作っておくと、何度でも同じものが作れるのだ",
  marks: { 2: "S3 は公開しない", 7: "OAC で CloudFront からだけ", 8: "http は https へ", 12: "SPA のための設定" },
  code: `
const bucket = new s3.Bucket(this, 'Site', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
})

new cloudfront.Distribution(this, 'Cdn', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
  defaultRootObject: 'index.html',
  // /game などを直接開いたときも、index.html を返す（Vue Router のため）
  errorResponses: [
    { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html' },
    { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' },
  ],
})
`,
}

const CV_DEPLOY = {
  view: true,
  title: "自動デプロイ",
  file: ".github/workflows/deploy.yml",
  task: "main に push したら、ビルドして S3 に置いて、キャッシュを消すのだ",
  marks: { 3: "OIDC を使う", 15: "鍵ではなくロールを借りる", 18: "1年キャッシュ", 20: "毎回確認", 21: "CloudFront のキャッシュを消す" },
  code: `
on: { push: { branches: [main] } }
permissions:
  id-token: write   # OIDC のトークンをもらうため
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci && npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-deploy
          aws-region: ap-northeast-1
      # 名前が毎回変わる assets は、長くキャッシュしてよい
      - run: aws s3 sync dist/assets s3://after-school-site/assets --cache-control "max-age=31536000,immutable"
      # index.html などは、毎回確かめさせる
      - run: aws s3 sync dist s3://after-school-site --delete --exclude "assets/*" --cache-control "no-cache"
      - run: aws cloudfront create-invalidation --distribution-id E1EXAMPLE --paths "/index.html"
`,
}

const CV_LAMBDA = {
  view: true,
  title: "Lambda の関数",
  file: "handler.mjs（Node.js）",
  task: "API Gateway から呼ばれて、返事を返すだけの関数なのだ",
  marks: { 2: "呼ばれる入り口", 3: "リクエストの中身", 6: "返事" },
  code: `
// API Gateway から呼ばれる関数
export const handler = async (event) => {
  const name = event.queryStringParameters?.name ?? 'キミ'

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: \`\${name}、おかえりなのだ！\` }),
  }
}
`,
}

const CV_DYNAMO = {
  view: true,
  title: "クラウドにセーブする",
  file: "save-ending.mjs（Lambda）",
  task: "このゲームのセーブを、DynamoDB に置くならこうなるのだ",
  marks: { 5: "使い回す", 9: "ユーザー ID はトークンから", 13: "名前は環境変数で", 14: "保存する中身" },
  code: `
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

// 関数の外で作っておくと、次の呼び出しで使い回せる
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler = async (event) => {
  // だれのデータかは、ログインのトークンから取る（送られてきた値は信じない）
  const userId = event.requestContext.authorizer.jwt.claims.sub
  const { endingId } = JSON.parse(event.body ?? '{}')

  await db.send(new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: { userId, endingId, clearedAt: new Date().toISOString() },
  }))
  return { statusCode: 204 }
}
`,
}

const CV_SG = {
  view: true,
  title: "セキュリティグループ",
  file: "セキュリティグループの設定（例）",
  task: "「どこからの通信を受け入れるか」を、階段のように絞っていくのだ",
  marks: { 2: "入口だけ公開", 5: "前の段からだけ", 8: "DB はアプリからだけ" },
  code: `
ALB 用
  受け入れ：443（HTTPS）     ← 0.0.0.0/0（だれでも）

アプリ用
  受け入れ：3000             ← ALB 用の SG からだけ

DB 用
  受け入れ：5432（PostgreSQL）← アプリ用の SG からだけ

※ 出ていく通信は、ふだんはすべて許可
※ DB に 0.0.0.0/0 は、ぜったいに付けない
`,
}

const CV_JWT = {
  view: true,
  title: "トークン（JWT）の中身",
  file: "ID トークンの中身（例・説明のためにコメント付き）",
  task: "JWT は . で区切られた3つの部分。まん中に、こんな情報が入っているのだ",
  marks: { 2: "だれか", 4: "だれが発行したか", 8: "期限が切れたら使えない", 12: "API に付けて送る" },
  code: `
{
  "sub": "8c1f2a…",            // ユーザーの ID（ずっと変わらない）
  "email": "kimi@example.com",
  "iss": "https://cognito-idp.ap-northeast-1.amazonaws.com/…",
  "aud": "1example23456789",    // どのアプリ向けか
  "token_use": "id",
  "iat": 1760000000,            // 発行した時刻
  "exp": 1760003600             // 期限（この例では1時間後）
}

// ヘッダーに付けて API を呼ぶ
// Authorization: Bearer eyJraWQiOi…
`,
}

// ===== 演出編のコード（本物のファイルから、そのまま抜き出したもの） =====
const CV_FX_PAUSE = {
  view: true,
  title: "文字の「間」",
  file: "utils/richText.js ／ views/GameView.vue",
  task: "文字ごとに、次の文字までの待ち時間を決めているのだ",
  marks: { 3: "ふつうの文字", 4: "、のあと", 14: "セリフの前の「間」" },
  code: `
// 文字を出したあとに、どれだけ間をあけるか（ミリ秒）。句読点で少し止まると、読みやすく自然になる
export function pauseAfter(ch) {
  if ('。！？!?'.includes(ch)) return 320
  if ('、，,'.includes(ch)) return 160
  if ('…―—'.includes(ch)) return 90
  return 32
}

function startTyping() {
  clearTimeout(typeTimer)
  typedLength.value = 0
  if (blocking.value) return // ムービーやチャプターの間は待つ（終わったらもう一度呼ばれる）
  // beat：セリフが始まる前の「間」。何も起きない時間が、次の言葉を重くする
  typeTimer = setTimeout(typeNext, game.line.beat ?? 250)
}
`,
}

const CV_FX_RICH = {
  view: true,
  title: "強調とふるえる文字",
  file: "utils/richText.js",
  task: "* と ~ ではさむと、文字に飾りが付くのだ",
  marks: { 1: "記号と飾りの対応", 9: "始める・終わる", 12: "1文字ずつ、飾りといっしょに" },
  code: `
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
`,
}

const CV_FX_SPRITE = {
  view: true,
  title: "立ち絵は3枚重ね",
  file: "components/CharaSprite.vue",
  task: "ふつう・目を閉じた・口を開けた、の3枚を重ねているのだ",
  marks: { 4: "ふつうの顔", 5: "目を閉じた顔", 6: "口を開けた顔", 14: "残響の見た目" },
  code: `
<template>
  <div class="sprite" :class="{ echo }">
    <div class="breath">
      <img :src="src('')" class="base" alt="" />
      <img :src="src('_blink')" class="layer" :class="{ on: blinking }" alt="" />
      <img :src="src('_talk')" class="layer" :class="{ on: showTalk }" alt="" />
    </div>
<!-- … -->
.layer.on {
  opacity: 1;
}

/* 残響：ふわふわ点滅して、青白く光る */
.sprite.echo {
  animation: flicker 3s infinite;
  filter: brightness(1.3) saturate(0.6) drop-shadow(0 0 18px rgba(120, 255, 220, 0.9));
}
`,
}

const CV_FX_BLINK = {
  view: true,
  title: "まばたき",
  file: "components/CharaSprite.vue",
  task: "まばたきの間隔は、わざとバラバラにしているのだ",
  marks: { 7: "2割の確率で2回続ける", 18: "目を閉じるのは0.12秒", 19: "2〜6秒のどこか" },
  code: `
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
`,
}

const CV_FX_STAGE = {
  view: true,
  title: "3D の舞台",
  file: "components/StageLayer.vue",
  task: "背景・立ち絵・光の玉を、奥行きをつけて並べているのだ",
  marks: { 2: "カメラの距離", 9: "マウスで舞台が回る", 16: "背景は奥へ", 21: "光の玉は手前へ" },
  code: `
  /* 3Dの「カメラ」：この距離（px）から舞台をのぞいている。小さいほど広角で、奥行きが強く出る */
  perspective: 1000px;
  perspective-origin: 50% 40%;
/* … */
/* マウスのほうへ、舞台ごと少し回る */
.orbit-box {
  position: absolute;
  inset: 0;
  transform: rotateY(calc(var(--mx, 0) * 5deg)) rotateX(calc(var(--my, 0) * -3deg));
  transition: transform 0.9s ease-out;
}
/* … */
.layer-bg {
  position: absolute;
  inset: -4%;
  transform: translateZ(-320px) scale(1.42);
/* … */
.layer-near {
  position: absolute;
  inset: 0;
  transform: translateZ(220px);
`,
}

const CV_FX_VERTIGO = {
  view: true,
  title: "めまいショット",
  file: "components/StageLayer.vue",
  task: "立ち絵の大きさは変えずに、背景だけを遠ざけるのだ",
  marks: { 8: "遠くから（望遠）", 9: "近くへ（広角）", 12: "背景を大きくしておく" },
  code: `
/* vertigo（めまいショット）：カメラが下がりながら望遠→広角に変わる映画の技。
   キャラ（奥行き 0）の大きさは perspective を変えても変わらないが、奥の背景だけは遠のいていく。
   → 世界がぐにゃりと引き伸ばされる、ぞっとする感覚になる */
.cam-vertigo {
  animation: vertigo 5s cubic-bezier(0.4, 0, 0.2, 1) both;
}
@keyframes vertigo {
  from { perspective: 2600px; }
  to { perspective: 420px; }
}
.cam-vertigo .layer-bg {
  transform: translateZ(-320px) scale(2.3);
}
`,
}

const CV_FX_CUTIN = {
  view: true,
  title: "目の位置からアップを計算する",
  file: "components/effects/CutIn.vue",
  task: "帯の大きさと目の位置から、立ち絵の大きさと位置を決めるのだ",
  marks: { 2: "表情ごとの目の位置", 5: "目の幅が帯に合う大きさ", 11: "目が帯のまん中に来るように" },
  code: `
function framing(chara, panelW, panelH, focus = 'eyes', viewW = panelW) {
  const face = FACES[chara]
  if (!face) return {}
  const f = FOCUS[focus]
  const spriteW = Math.min(viewW * f.fill, panelH * f.maxH) / (face.eyeSpan * f.part)
  const spriteH = spriteW / face.aspect
  const cx = face.x + f.dx * face.eyeSpan
  const cy = face.y + (f.dy === 'mouth' ? face.mouthY : f.dy)
  return {
    height: \`\${spriteH}px\`,
    left: \`\${panelW / 2 - cx * spriteW}px\`,
    top: \`\${panelH / 2 - cy * spriteH}px\`,
  }
}
`,
}

const CV_FX_GRADE = {
  view: true,
  title: "色調補正と黒帯",
  file: "views/GameView.vue",
  task: "どれも CSS の filter と、黒い帯の高さだけなのだ",
  marks: { 1: "セピアで、なつかしく", 3: "青く、うすく、暗く", 15: "1.6秒かけて出る", 19: "山場ではもっと広く" },
  code: `
.grade-warm { filter: sepia(0.25) saturate(1.25) contrast(1.05); }
.grade-teal { filter: hue-rotate(-12deg) saturate(1.2) contrast(1.15) brightness(0.95); }
.grade-cold { filter: saturate(0.7) hue-rotate(15deg) brightness(0.9) contrast(1.1); }
.grade-bleach { filter: saturate(0.35) contrast(1.35) brightness(1.05); }

/* ===== 映画の黒帯 ===== */
.scope span {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  height: 0;
  background: #000;
  pointer-events: none;
  transition: height 1.6s cubic-bezier(0.4, 0, 0.2, 1);
}
/* … */
.scope.on span { height: 8%; }
.scope.wide span { height: 14%; }
`,
}

const CV_FX_TABLE = {
  view: true,
  title: "画面効果の一覧",
  file: "views/GameView.vue",
  task: "効果ごとに、長さと、いっしょに鳴らす音を決めているのだ",
  marks: { 3: "0.6秒・揺れる音", 10: "ゆっくり2.6秒", 11: "音なし" },
  code: `
const FX = {
  glitch: { ms: 1000, sound: 'glitch' },
  shake: { ms: 600, sound: 'shake' },
  flash: { ms: 1000, sound: 'flash' },
  shockwave: { ms: 950, sound: 'impact' },
  burst: { ms: 950, sound: 'shake' },
  meter: { ms: 2400, sound: 'send' },
  whip: { ms: 600, sound: 'whip' },     // カメラを素早く振る（ホイップパン）
  zoom: { ms: 1300, sound: 'impact' },  // 一気に寄る（クラッシュズーム）
  leak: { ms: 2600, sound: 'whoosh' },  // 光漏れ
  rack: { ms: 1600, sound: null },      // ピント送り（手前→奥）
  rewrite: { ms: 2000, sound: 'rewrite' }, // 世界の書き換え（光の線が走り、通ったところから世界が変わる）
}
`,
}

const CV_FX_RGB = {
  view: true,
  title: "グリッチの色ずれ",
  file: "components/effects/FxFilters.vue",
  task: "赤・緑・青を別々に取り出して、ずらして重ねるのだ",
  marks: { 4: "赤を左へ", 7: "青を右へ", 8: "光を足すように重ねる" },
  code: `
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
`,
}

const CV_FX_SHOCK = {
  view: true,
  title: "衝撃波のゆがみ",
  file: "components/effects/FxShockwave.vue",
  task: "「どれだけずらすか」を、色で表した絵を作るのだ",
  marks: { 1: "輪のところだけ", 3: "赤 = 横のずれ", 4: "緑 = 縦のずれ" },
  code: `
        const ring = Math.exp(-(((d - radius) / 0.12) ** 2)) // 輪の上だけ大きくずらす
        const i = (y * W + x) * 4
        img.data[i] = 128 + (nx / d) * ring * 127 // 赤 = 横にずらす量
        img.data[i + 1] = 128 + (ny / d) * ring * 127 // 緑 = 縦にずらす量
`,
}

const CV_FX_TILE = {
  view: true,
  title: "タイルがほどける",
  file: "components/effects/TileDissolve.vue",
  task: "ランダムな点からの距離で、消える時間をずらすのだ",
  marks: { 2: "消え始める点", 7: "点からの距離", 8: "遠いほど、あとで消える", 16: "回りながら縮む" },
  code: `
// 消え始める中心をランダムに決めて、そこからの距離で各タイルの遅れを決める
const ox = Math.random() * COLS
const oy = Math.random() * ROWS
const tiles = []
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const dist = Math.hypot(c - ox, r - oy)
    tiles.push({ key: \`\${r}-\${c}\`, delay: \`\${dist * 0.035 + Math.random() * 0.08}s\` })
  }
}
/* … */
/* 一瞬オレンジのふちが光って、縮みながら消える */
@keyframes tile-out {
  0% { transform: scale(1); box-shadow: inset 0 0 0 0 rgba(255, 140, 50, 0); }
  30% { transform: scale(1); box-shadow: inset 0 0 0 2px rgba(255, 140, 50, 0.9); }
  100% { transform: scale(0) rotate(45deg); opacity: 0; }
}
`,
}

const CV_FX_LEAP = {
  view: true,
  title: "タイムリープのトンネル",
  file: "components/TimeLeap.vue",
  task: "Canvas に、自分で遠近法の計算をして描いているのだ",
  marks: { 2: "遠いほど小さく", 8: "半透明の黒で残像に", 12: "速いほど長い光の線" },
  code: `
  function project(a, r, z) {
    const s = F / z
    return [cx + Math.cos(a + spin) * r * s, cy + Math.sin(a + spin) * r * s, s]
  }
// …
    // 完全に消さずに、半透明の黒を重ねる → 前のコマが残像になって、スピード感が出る
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = \`rgba(3, 4, 12, \${0.28 + 0.2 * (1 - p)})\`
    ctx.fillRect(0, 0, c.width, c.height)
// …
      const [x1, y1, s] = project(st.a, st.r, st.z)
      const [x0, y0] = project(st.a, st.r, st.z + dir * v * 0.09)
`,
}

const CV_FX_MOVIE = {
  view: true,
  title: "ムービーを再生する",
  file: "components/MoviePlayer.vue",
  task: "カットを順番に見せて、カメラの動きは CSS でつけるのだ",
  marks: { 5: "動きが苦手な人には短く", 7: "次のカットへ", 16: "カットの長さいっぱいに動く" },
  code: `
function showShot(i) {
  index.value = i
  const s = shots[i]
  if (s.sound) play(s.sound)
  const duration = reduceMotion ? Math.min(s.duration, 900) : s.duration
  timer = setTimeout(() => {
    if (i + 1 < shots.length) showShot(i + 1)
    else emit('end')
  }, duration)
}
/* … */
.frame {
  position: absolute;
  inset: 0;
  /* カメラの動きは、カットの長さ（--duration）いっぱいにかけて動かす */
  animation-duration: var(--duration);
  animation-timing-function: ease-out;
  animation-fill-mode: both;
`,
}

const CV_FX_MOOD = {
  view: true,
  title: "音楽の演技",
  file: "composables/useMusic.js",
  task: "音量とフィルターを、時間をかけてなめらかに動かすだけなのだ",
  marks: { 3: "音量を35%に", 4: "高い音を切る＝こもる", 5: "0.06秒で消える", 11: "時間をかけて変える" },
  code: `
    const MOODS = {
      normal: { vol: 1, cutoff: 20000, time: 1.5 },
      duck: { vol: 0.35, cutoff: 20000, time: 1 },
      muffle: { vol: 0.8, cutoff: 450, time: 1.2 },
      cut: { vol: 0, cutoff: 20000, time: 0.06 },
      swell: { vol: 1.5, cutoff: 20000, time: 3 },
    }
    const m = MOODS[mood] ?? MOODS.normal
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.linearRampToValueAtTime(m.vol, now + m.time)
    filter.frequency.cancelScheduledValues(now)
    filter.frequency.setValueAtTime(filter.frequency.value, now)
    filter.frequency.exponentialRampToValueAtTime(m.cutoff, now + m.time)
`,
}

const CV_FX_AMBIENT = {
  view: true,
  title: "空気の粒",
  file: "components/AmbientLayer.vue",
  task: "粒の数・色・速さを決めて、Canvas に毎フレーム描くのだ",
  marks: { 2: "ほこり：ゆっくり上へ", 5: "雨：260本・速く下へ", 8: "sin でまたたく", 9: "ぼんやり光らせる" },
  code: `
const SETTINGS = {
  dust: { count: 60, color: [255, 190, 120], speedY: -0.08, size: [1, 3.2], glow: 8 },
  stars: { count: 90, color: [220, 235, 255], speedY: -0.03, size: [0.6, 2], glow: 6 },
  echo: { count: 70, color: [120, 255, 220], speedY: -0.35, size: [1, 3.5], glow: 12 },
  rain: { count: 260, color: [200, 215, 240], speedY: 14, size: [10, 26], glow: 0 },
}
// …
        const alpha = 0.35 + 0.35 * Math.sin(time / 900 + p.phase)
        ctx.shadowBlur = s.glow
        ctx.shadowColor = \`rgba(\${r},\${g},\${b},\${alpha})\`
        ctx.fillStyle = \`rgba(\${r},\${g},\${b},\${alpha})\`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
`,
}

const CV_FX_LINE = {
  view: true,
  title: "演出を重ねたセリフ",
  file: "data/scenario.js（見やすく改行）",
  task: "1行のセリフに、カメラ・効果・間・速さを重ねているのだ",
  marks: { 4: "残響", 5: "カメラ", 6: "画面効果", 7: "間", 8: "文字の速さ" },
  code: `
{
  speaker: '？？？',
  chara: 'zun_sad',
  echo: true,           // 透けて光る「残響」
  camera: 'vertigo',    // めまいショット
  fx: 'rack',           // ピント送り
  beat: 1600,           // 1.6秒の沈黙のあとで
  speed: 'slow',        // ゆっくり
  text: '……やっぱり。キミには、見えるのだ？',
},
`,
}

// ===== バックエンド・Docker 編のコード（このゲームにセーブ用の API を足すなら、という例） =====
const CV_BE_API = {
  view: true,
  title: "API の設計",
  file: "API の一覧（例）",
  task: "URL は「もの」、メソッドは「何をするか」を表すのだ",
  marks: { 1: "GET は読むだけ", 3: "POST は新しく作る", 8: "認証の失敗", 9: "認可の失敗", 13: "5xx はサーバー側の問題" },
  code: `
GET    /api/saves/me     自分のセーブを読む        → 200
PUT    /api/saves/me     セーブを上書きする        → 200
POST   /api/endings      見たエンディングを足す    → 201
DELETE /api/saves/me     セーブを消す              → 204

うまくいかなかったとき
400  送られた中身がおかしい
401  ログインしていない
403  ログインしているが、権限がない
404  見つからない
409  すでにある・重なっている
422  形は合っているが、内容がおかしい
500  サーバーの不具合（こちらの責任）
`,
}

const CV_BE_EXPRESS = {
  view: true,
  title: "API を書く",
  file: "api/server.js（Node.js ＋ Express の例）",
  task: "URL とメソッドごとに、何をするかを書くのだ",
  marks: { 7: "先にログインを確かめる", 10: "入力チェック", 15: "値は別に渡す（安全）", 17: "作れたら 201" },
  code: `
import express from 'express'

const app = express()
app.use(express.json()) // 送られてきた JSON を読めるようにする

// 見たエンディングを記録する（ログインしている人だけ）
app.post('/api/endings', requireLogin, async (req, res) => {
  const { endingId } = req.body
  // 送られてきた値は、必ず確かめる
  if (!ENDING_IDS.includes(endingId)) {
    return res.status(400).json({ error: 'endingId が正しくありません' })
  }
  await db.query(
    'INSERT INTO cleared_endings (user_id, ending_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [req.user.id, endingId], // だれのデータかは、ログイン情報から取る
  )
  res.status(201).json({ ok: true })
})

app.listen(3000)
`,
}

const CV_BE_SQL = {
  view: true,
  title: "テーブルと SQL",
  file: "db/schema.sql（PostgreSQL の例）",
  task: "テーブルの形を決めて、SQL で読み書きするのだ",
  marks: { 3: "主キー（1つに決まる番号）", 4: "同じメールは2つ入らない", 10: "外部キー（いない人は入らない）", 13: "同じ組は1回だけ", 19: "条件で絞って読む" },
  code: `
-- ユーザー
CREATE TABLE users (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 見たエンディング（ユーザーとエンディングの組）
CREATE TABLE cleared_endings (
  user_id    BIGINT NOT NULL REFERENCES users(id),
  ending_id  TEXT   NOT NULL,
  cleared_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, ending_id)
);

-- 「この人が見たエンディング」を読む
SELECT ending_id, cleared_at
FROM cleared_endings
WHERE user_id = $1
ORDER BY cleared_at;
`,
}

const CV_BE_INJECTION = {
  view: true,
  title: "SQL インジェクション",
  file: "（例）",
  task: "入力をそのまま SQL に混ぜると、命令を書きかえられてしまうのだ",
  marks: { 2: "入力を混ぜている", 4: "命令が書きかわる", 8: "値は別に渡す" },
  code: `
// あぶない：入力をそのまま SQL の文字に混ぜる
db.query(\`SELECT * FROM users WHERE email = '\${email}'\`)
// email に  ' OR '1'='1  と送られると……
// SELECT * FROM users WHERE email = '' OR '1'='1'
// → 条件がいつも正しくなって、全員のデータが返ってしまう

// よい：プレースホルダーで、値として別に渡す
db.query('SELECT * FROM users WHERE email = $1', [email])
// → 何が送られても「ただの文字」として扱われる
`,
}

const CV_BE_COOKIE = {
  view: true,
  title: "ログインの Cookie と CORS",
  file: "api/server.js（例）",
  task: "Cookie には安全のための設定を付けるのだ",
  marks: { 3: "JS から読めない", 4: "HTTPS だけ", 5: "CSRF 対策", 10: "許すサイトを決める" },
  code: `
// ログインに成功したら、セッション ID を Cookie で渡す
res.cookie('sid', sessionId, {
  httpOnly: true,   // JavaScript から読めない → XSS で盗まれにくい
  secure: true,     // HTTPS のときだけ送る
  sameSite: 'lax',  // ほかのサイトからの送信を制限（CSRF 対策）
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7日で切れる
})

// CORS：どのサイトからの呼び出しを許すか（* にしない）
app.use(cors({ origin: 'https://game.example.com', credentials: true }))
`,
}

const CV_DOCKERFILE = {
  view: true,
  title: "このゲームを Docker に入れる",
  file: "Dockerfile",
  task: "ビルド用と本番用の、2段階で作るのだ（マルチステージビルド）",
  marks: { 2: "元にするイメージ", 4: "先に依存だけコピー", 5: "ここはキャッシュされやすい", 10: "本番は Node.js なし", 11: "できあがりだけ持ってくる" },
  code: `
# ① ビルド用：Node.js でゲームをビルドする
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ② 本番用：できた dist だけを、軽い nginx に入れる
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
`,
}

const CV_NGINX = {
  view: true,
  title: "nginx の設定",
  file: "nginx.conf",
  task: "/game を開き直しても index.html を返すようにするのだ",
  marks: { 3: "dist を置いた場所", 7: "なければ index.html", 12: "1年キャッシュ" },
  code: `
server {
  listen 80;
  root /usr/share/nginx/html;

  location / {
    # /game など、ファイルがない URL は index.html を返す（Vue Router のため）
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    # 名前が毎回変わるファイルは、長くキャッシュしてよい
    add_header Cache-Control "public, max-age=31536000, immutable";
  }
}
`,
}

const CV_COMPOSE = {
  view: true,
  title: "API とデータベースをまとめて起動",
  file: "compose.yaml",
  task: "手元で、本番に近い組み合わせを1コマンドで動かすのだ",
  marks: { 3: "api/Dockerfile から作る", 5: "パソコンの3000番 → コンテナの3000番", 7: "サービス名 db で届く", 11: "できあいのイメージを使う", 17: "データを残す" },
  code: `
services:
  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://app:secret@db:5432/game
    depends_on:
      - db
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret   # 手元で使うだけの仮のもの
      POSTGRES_DB: game
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
`,
}

const CV_BE_PROD = {
  view: true,
  title: "本番で動かすための作法",
  file: "api/server.js（例）",
  task: "コンテナで動かすときに、必ずやっておきたいことなのだ",
  marks: { 2: "環境変数から読む", 6: "ヘルスチェック", 10: "ログは JSON で標準出力へ", 14: "きれいに止まる" },
  code: `
// 設定は環境変数から読む（コードに書かない・環境ごとに変える）
const port = process.env.PORT ?? 3000
const databaseUrl = process.env.DATABASE_URL

// ヘルスチェック：ロードバランサーが「生きてる？」と定期的に聞きに来る
app.get('/health', (req, res) => res.status(200).send('ok'))

// ログは標準出力へ（ファイルに書かない → CloudWatch などが集める）
const server = app.listen(port, () => {
  console.log(JSON.stringify({ level: 'info', msg: 'started', port }))
})

// 「止まって」と言われたら、処理中のリクエストを終えてから止まる
process.on('SIGTERM', () => server.close(() => process.exit(0)))
`,
}

// ===== HTTP 編のコード（説明用の例） =====
const CV_HTTP_RAW = {
  view: true,
  title: "HTTP のメッセージ（そのまま）",
  file: "リクエストとレスポンスの例",
  task: "HTTP は、じつは人が読める文字のやりとりなのだ（HTTP/1.1 の場合）",
  marks: { 1: "何を・どこに", 2: "どのサイトあてか", 5: "ブラウザが自動で付ける", 7: "どうなったか", 8: "本文の種類", 13: "空行のあとが本文" },
  code: `
GET /index.html HTTP/1.1
Host: game.example.com
Accept: text/html
Accept-Language: ja
Cookie: sid=8c1f2a…

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 891
Cache-Control: no-cache
ETag: "5f3a-19c2"

<!doctype html>
<html lang="ja">
…
`,
}

const PG_FETCH = {
  title: "HTTP リクエストを送ってみる",
  task: "このゲームのサーバーに、本当にリクエストを送っているのだ。URL を images/bg/roof_day.webp に変えて送ると、Content-Type が変わるのだ",
  code: `
<script setup>
const url = ref('index.html')
const result = ref(null)

async function send() {
  const started = performance.now()
  const res = await fetch(url.value)
  const body = await res.blob()
  result.value = {
    status: res.status + ' ' + res.statusText,
    type: res.headers.get('content-type'),
    length: body.size + ' バイト',
    cache: res.headers.get('cache-control') ?? '（なし）',
    etag: res.headers.get('etag') ?? '（なし）',
    time: Math.round(performance.now() - started) + ' ms',
  }
}
</script>

<template>
  <input v-model="url" /> <button @click="send">GET を送る</button>
  <table v-if="result">
    <tr v-for="(value, key) in result" :key="key"><th>{{ key }}</th><td>{{ value }}</td></tr>
  </table>
</template>

<style>
input { width: 230px; padding: 4px; font-size: 14px; }
button { padding: 4px 12px; font-size: 14px; }
table { margin-top: 10px; border-collapse: collapse; font-size: 13px; }
th, td { padding: 4px 8px; border: 1px solid #ccc; text-align: left; }
th { background: #fff3e6; }
</style>
`,
  check: (el) => /image\//.test(el.textContent),
}

const CV_HTTP_STATUS = {
  view: true,
  title: "よく見るステータスコード",
  file: "ステータスコードの一覧",
  task: "最初の数字で、だれの問題かがわかるのだ",
  marks: { 8: "キャッシュの話で出てくる", 11: "名前は Unauthorized だけど認証", 14: "回数制限", 17: "アプリが落ちていることが多い", 19: "処理が重すぎる" },
  code: `
2xx 成功
  200 OK              うまくいった
  201 Created         作った（POST のあと）
  204 No Content      うまくいった・返すものはない
3xx ほかを見て
  301 / 308           ずっと引っ越した（308 はメソッドもそのまま）
  302 / 307           いまだけ別の場所（307 はメソッドもそのまま）
  304 Not Modified    持っているキャッシュを使って
4xx 送った側の問題
  400 Bad Request     中身がおかしい
  401 Unauthorized    ログインしていない（認証）
  403 Forbidden       権限がない（認可）
  404 Not Found       ない
  429 Too Many        送りすぎ・ちょっと待って
5xx サーバー側の問題
  500 Internal        サーバーのプログラムの不具合
  502 Bad Gateway     奥のサーバーから変な返事
  503 Unavailable     混んでいる・メンテナンス中
  504 Gateway Timeout 奥のサーバーが時間切れ
`,
}

const CV_HTTP_CACHE = {
  view: true,
  title: "キャッシュのヘッダー",
  file: "レスポンスのヘッダーの例",
  task: "ファイルの性質によって、キャッシュのさせ方を変えるのだ",
  marks: { 2: "1年・変わらない", 5: "「毎回確かめて」の意味", 9: "持っている版", 13: "ブラウザだけ", 16: "保存しない" },
  code: `
# assets（名前が毎回変わる）… 1年そのまま使ってよい
Cache-Control: public, max-age=31536000, immutable

# index.html … 使う前に、毎回サーバーに確かめる
Cache-Control: no-cache
ETag: "5f3a-19c2"

# 2回目：持っている版を伝える
If-None-Match: "5f3a-19c2"
→ HTTP/1.1 304 Not Modified（本文は送られてこない）

# 人ごとにちがう中身 … CDN などには置かせない
Cache-Control: private, no-cache

# 個人情報など … どこにも保存させない
Cache-Control: no-store
`,
}

const CV_HTTP_COOKIE = {
  view: true,
  title: "Cookie のやりとり",
  file: "レスポンスとリクエストの例",
  task: "サーバーが渡した Cookie を、ブラウザが次から自動で付けるのだ",
  marks: { 3: "自動で付けて送る", 11: "JS から読めない", 13: "CSRF 対策" },
  code: `
# ログインの返事で、サーバーが Cookie を渡す
HTTP/1.1 200 OK
Set-Cookie: sid=8c1f2a…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800

# それ以降のリクエストに、ブラウザが自動で付ける
GET /api/saves/me HTTP/1.1
Host: game.example.com
Cookie: sid=8c1f2a…

# 属性の意味
#   HttpOnly … JavaScript から読めない（XSS で盗まれにくい）
#   Secure   … HTTPS のときだけ送る
#   SameSite … ほかのサイトから来たリクエストには付けない（CSRF 対策）
#   Max-Age  … 何秒で消えるか（604800 秒 = 7日）
`,
}

const CV_HTTP_CORS = {
  view: true,
  title: "CORS のヘッダー",
  file: "プリフライトのやりとりの例",
  task: "ブラウザが下見をして、サーバーが「この相手なら OK」と返すのだ",
  marks: { 2: "下見のリクエスト", 3: "どこの画面からか", 9: "許す相手", 12: "Cookie を付けてもよい", 13: "10分は下見を省ける" },
  code: `
# ① 下見（プリフライト）：ブラウザが自動で送る
OPTIONS /api/saves/me HTTP/1.1
Origin: https://game.example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type

# ② サーバーの返事：「その相手・その方法なら OK」
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://game.example.com
Access-Control-Allow-Methods: GET, PUT
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 600
`,
}

const CV_HTTP_SECURITY = {
  view: true,
  title: "安全のためのヘッダー",
  file: "レスポンスのヘッダーの例",
  task: "HTTPS といっしょに付けておきたいヘッダーなのだ",
  marks: { 2: "HSTS", 5: "CSP", 8: "枠に入れさせない", 11: "推測させない" },
  code: `
# 次からは必ず HTTPS で来てね（ブラウザが自動で https にする）
Strict-Transport-Security: max-age=31536000; includeSubDomains

# 読みこんでよい場所を決める（XSS の被害を小さくする）
Content-Security-Policy: default-src 'self'; img-src 'self' data:

# ほかのサイトの枠（iframe）に入れさせない（クリックジャッキング対策）
X-Frame-Options: DENY

# 中身の種類を勝手に推測させない
X-Content-Type-Options: nosniff

# よそのサイトへ移るとき、URL をどこまで伝えるか
Referrer-Policy: strict-origin-when-cross-origin
`,
}

// ===== 非同期 JavaScript 編・セキュリティ編のコード =====
const PG_EVENTLOOP = {
  title: "どの順番で動く？",
  task: "表示される順番を予想してから「動かす」を押すのだ。予想は当たったのだ？",
  code: `
<script setup>
const log = ref([])

function run() {
  log.value = []
  const add = (text) => log.value.push(text)
  add('① ふつうの処理')
  setTimeout(() => add('② setTimeout（0ミリ秒）'), 0)
  Promise.resolve().then(() => add('③ Promise の then'))
  queueMicrotask(() => add('④ queueMicrotask'))
  add('⑤ ふつうの処理（最後の行）')
}
</script>

<template>
  <button @click="run">動かす</button>
  <ol>
    <li v-for="(text, i) in log" :key="i">{{ text }}</li>
  </ol>
</template>

<style>
button { padding: 6px 14px; font-size: 15px; }
li { font-size: 15px; margin: 4px 0; }
</style>
`,
  check: (el) => el.querySelectorAll('li').length >= 5,
}

const CV_ASYNC_STYLES = {
  view: true,
  title: "コールバック・Promise・async/await",
  file: "（例）同じ処理の3つの書き方",
  task: "同じ「ユーザー → セーブ → エンディング」を読む処理なのだ",
  marks: { 2: "どんどん右へ", 12: "つなげて書ける", 15: "エラーはまとめて", 18: "ふつうの文のように" },
  code: `
// コールバック：入れ子が深くなる（コールバック地獄）
loadUser(id, (user) => {
  loadSave(user.id, (save) => {
    loadEnding(save.last, (ending) => {
      show(ending)
    })
  })
})

// Promise：then でつなぐ。エラーは最後の catch でまとめて
loadUser(id)
  .then((user) => loadSave(user.id))
  .then((save) => loadEnding(save.last))
  .then(show)
  .catch(showError)

// async / await：上から順に読める
const user = await loadUser(id)
const save = await loadSave(user.id)
show(await loadEnding(save.last))
`,
}

const PG_PARALLEL = {
  title: "順番に待つ・まとめて待つ",
  task: "3行の await を Promise.all にまとめて、時間がどう変わるか見るのだ（下のコメントの書き方を使うのだ）",
  code: `
<script setup>
const result = ref('')
// 1秒かかる「API」のまね
const wait = (name) => new Promise((resolve) => setTimeout(() => resolve(name), 1000))

async function run() {
  result.value = '待っています…'
  const start = performance.now()
  // 1つずつ順番に待つ
  const a = await wait('ユーザー')
  const b = await wait('セーブ')
  const c = await wait('エンディング')
  // まとめて待つなら：const [a, b, c] = await Promise.all([wait('ユーザー'), wait('セーブ'), wait('エンディング')])
  const ms = Math.round(performance.now() - start)
  result.value = \`\${a}・\${b}・\${c} がそろった（\${ms} ms）\`
}
</script>

<template>
  <button @click="run">3つ取ってくる</button>
  <p>{{ result }}</p>
</template>

<style>
button { padding: 6px 14px; font-size: 15px; }
p { font-size: 16px; }
</style>
`,
  check: (el) => {
    const m = el.textContent.match(/（(\d+) ms）/)
    return Boolean(m) && Number(m[1]) < 1500
  },
}

const CV_ASYNC_PITFALL = {
  view: true,
  title: "非同期のよくあるまちがい",
  file: "（例）",
  task: "レビューでよく見つかるまちがいなのだ",
  marks: { 2: "await がない", 6: "forEach は待たない", 10: "順番に待つ", 12: "同時に待つ", 19: "ステータスを確かめる" },
  code: `
// ✕ await を忘れる → Promise のまま進んでしまう
const user = loadUser(id)
console.log(user.name)            // undefined（まだ Promise）

// ✕ forEach の中の await は、待ってくれない
items.forEach(async (item) => { await save(item) })
console.log('全部保存した？')     // ← まだ終わっていない

// ◯ 順番に待つなら for...of
for (const item of items) { await save(item) }
// ◯ 同時でよいなら Promise.all
await Promise.all(items.map((item) => save(item)))

// ✕ catch しない → エラーが静かに消える（Unhandled Rejection）
fetch(url).then((res) => res.json())

// ✕ fetch は 404 や 500 でも失敗にならない
const res = await fetch(url)
if (!res.ok) throw new Error(\`HTTP \${res.status}\`)  // ◯ 自分で確かめる
`,
}

const CV_ASYNC_TOOLS = {
  view: true,
  title: "まとめて待つ・取り消す",
  file: "（例）",
  task: "待ち方にも、いろいろな道具があるのだ",
  marks: { 2: "全部そろったら", 5: "失敗もふくめて全部", 9: "いちばん早いもの", 14: "取り消し", 17: "5秒でタイムアウト" },
  code: `
// 全部そろうまで待つ（1つでも失敗したら、すぐ catch へ）
const [user, save] = await Promise.all([loadUser(id), loadSave(id)])

// 成功も失敗も、全部の結果を待つ
const results = await Promise.allSettled(tasks)
const failed = results.filter((r) => r.status === 'rejected')

// いちばん早く終わったものを使う
const first = await Promise.race([fetchFromA(), fetchFromB()])

// 取り消す：AbortController
const controller = new AbortController()
fetch(url, { signal: controller.signal })
controller.abort()      // 待つのをやめる（fetch は AbortError で失敗する）

// 決まった時間で、自動で取り消す（タイムアウト）
await fetch(url, { signal: AbortSignal.timeout(5000) })
`,
}

const CV_ASYNC_VUE = {
  view: true,
  title: "画面で API を呼ぶときの形",
  file: "（例）Vue の部品の script",
  task: "ローディング・エラー・取り消しまで、セットで書くのだ",
  marks: { 7: "前のリクエストを取り消す", 9: "ローディングを出す", 13: "失敗のステータス", 17: "かならず最後に通る", 21: "画面を離れたら" },
  code: `
const loading = ref(false)
const error = ref('')
const saves = ref([])
let controller = null

async function load() {
  controller?.abort()                 // 前のリクエストは取り消す（古い結果で上書きしない）
  controller = new AbortController()
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/saves/me', { signal: controller.signal })
    if (!res.ok) throw new Error(\`読みこめませんでした（\${res.status}）\`)
    saves.value = await res.json()
  } catch (e) {
    if (e.name !== 'AbortError') error.value = e.message
  } finally {
    loading.value = false              // 成功しても失敗しても、ローディングは終わる
  }
}
onUnmounted(() => controller?.abort())  // 画面を離れたら取り消す
`,
}

const CV_ASYNC_REAL = {
  view: true,
  title: "このゲームの非同期",
  file: "CodePlayground.vue ／ stores/game.js ／ TitleView.vue",
  task: "このゲームでも、必要なときにだけファイルを読みこむところで使っているのだ",
  marks: { 3: "必要になってから読みこむ", 7: "2回目からは読みこまない", 12: "終わるまで待ってから", 13: "それから画面を移る" },
  code: `
// CodePlayground.vue：コードを動かす Vue を、はじめて使うときに読みこむ
async function run() {
  fullVue ??= await import('vue/dist/vue.esm-browser.prod.js')

// stores/game.js：授業のデータを、TECH DOCS を押したときに読みこむ
    async startLesson() {
      lessonData ??= await import('../data/lessons')

// TitleView.vue：読みこみが終わってから、解説の画面（/docs）へ
async function startLesson() {
  play('impact')
  await game.startLesson() // 授業のデータを読みこんで、最初から始める
  router.push('/docs')
}
`,
}

const PG_XSS = {
  title: "v-html のこわさ",
  task: "コメント欄に HTML が書かれたら……。下の v-html の行を {{ comment }} に書きかえて、ちがいを見るのだ",
  code: `
<script setup>
// ほかの人が書いたコメント（外から来た文字）、とする
const comment = ref('こんにちは<b>太字</b><span style="color:red">（勝手に赤くされた）</span>')
</script>

<template>
  <p class="label">二重かっこで出す（安全）</p>
  <div class="box">{{ comment }}</div>
  <p class="label">v-html で出す（あぶない）</p>
  <div class="box" v-html="comment"></div>
</template>

<style>
.label { margin: 8px 0 2px; font-size: 13px; color: #666; }
.box { padding: 8px; border: 1px solid #ccc; font-size: 15px; }
</style>
`,
  check: (el) => el.querySelectorAll('span[style]').length === 0 && el.textContent.includes('こんにちは'),
}

const CV_SEC_XSS = {
  view: true,
  title: "XSS を防ぐ書き方",
  file: "（例）",
  task: "外から来た文字は、HTML として読ませないのだ",
  marks: { 2: "HTML として解釈される", 7: "ただの文字として", 9: "Vue のふつうの書き方", 12: "どうしてもなら消毒", 15: "保険" },
  code: `
// ✕ 外から来た文字を HTML として入れる
el.innerHTML = comment
// Vue なら
<div v-html="comment"></div>

// ◯ 文字として入れる（< や > は、ただの記号として表示される）
el.textContent = comment
// Vue なら（{{ }} は自動で無害化される）
<div>{{ comment }}</div>

// どうしても HTML を出すなら、DOMPurify などで危ない部分を取りのぞく
<div v-html="DOMPurify.sanitize(comment)"></div>

// さらに CSP で「読みこんでよい場所」を決めておく（もしもの保険）
Content-Security-Policy: script-src 'self'
`,
}

const CV_SEC_XSS_REAL = {
  view: true,
  title: "このゲームのエディタの対策",
  file: "components/CodePlayground.vue",
  task: "エディタの色分けは v-html を使うけど、先に記号を無害にしているのだ",
  marks: { 1: "< や > を無害な文字に", 3: "打った文字は必ず escape", 5: "色を付ける部分も escape", 7: "だから v-html でも安全" },
  code: `
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// …
    html += escape(code.value.slice(last, m.index))
// …
    html += \`<span class="\${CLASS[group]}">\${escape(m[0])}</span>\`
// …
            <pre ref="pre" class="layer" aria-hidden="true" v-html="highlighted"></pre>
`,
}

const CV_SEC_INJECT = {
  view: true,
  title: "インジェクションのいろいろ",
  file: "（例）Node.js",
  task: "入力を「命令の一部」にすると、命令を書きかえられるのだ",
  marks: { 2: "シェルに入力を混ぜている", 3: "引数として渡す", 6: "../ で外に出られる", 9: "フォルダの中か確かめる", 12: "値は別に渡す" },
  code: `
// コマンドインジェクション：入力をシェルのコマンドに混ぜる
exec(\`convert \${fileName} out.png\`)           // fileName = "a.png; rm -rf ~"
execFile('convert', [fileName, 'out.png'])    // ◯ 引数として渡す（シェルを通さない）

// パストラバーサル：入力をファイルの場所に使う
const file = path.join('/app/saves', req.query.name)   // name = "../../etc/passwd"
// ◯ 決められたフォルダの中かどうか確かめる
const safe = path.resolve('/app/saves', req.query.name)
if (!safe.startsWith('/app/saves/')) return res.status(400).end()

// SQL インジェクション（バックエンド編のおさらい）
db.query('SELECT * FROM users WHERE email = $1', [email])  // ◯ プレースホルダー
`,
}

const CV_SEC_IDOR = {
  view: true,
  title: "持ち主かどうかを確かめる",
  file: "（例）Express",
  task: "ログインしているだけでは足りないのだ",
  marks: { 4: "だれのものでも返している", 10: "持ち主か確かめる", 11: "ないふりをする" },
  code: `
// ✕ ログインしていれば、だれのセーブでも読めてしまう
app.get('/api/saves/:id', requireLogin, async (req, res) => {
  const save = await db.findSave(req.params.id)
  res.json(save)
})

// ◯ 持ち主かどうかを、毎回確かめる
app.get('/api/saves/:id', requireLogin, async (req, res) => {
  const save = await db.findSave(req.params.id)
  if (!save || save.userId !== req.user.id) {
    return res.status(404).end()   // 「ない」と同じに見せる（あるかどうかも教えない）
  }
  res.json(save)
})
`,
}

const CV_SEC_PASSWORD = {
  view: true,
  title: "パスワードの保存",
  file: "（例）Node.js ＋ bcrypt",
  task: "パスワードそのものは、どこにも保存しないのだ",
  marks: { 4: "わざと遅い計算でハッシュに", 5: "保存するのはハッシュだけ", 8: "くらべるだけ", 11: "どちらかは言わない" },
  code: `
import bcrypt from 'bcrypt'

// 登録：パスワードを、元に戻せない「ハッシュ」にして保存する
const hash = await bcrypt.hash(password, 12)
await db.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hash])

// ログイン：同じ計算をして、くらべる
const ok = await bcrypt.compare(password, user.password_hash)
if (!ok) {
  // どちらがちがうかは言わない（登録されているメールを探られないように）
  return res.status(401).json({ error: 'メールかパスワードがちがいます' })
}
`,
}

const CV_SEC_SECRETS = {
  view: true,
  title: "秘密の置き場所",
  file: ".env ／ .gitignore",
  task: "VITE_ で始まる変数は、ブラウザに配られてしまうのだ",
  marks: { 3: "サーバーの中だけ", 6: "公開されてもよいもの", 7: "ブラウザに配られてしまう", 12: "見本だけはコミット" },
  code: `
# .env（Git に入れない）
DATABASE_URL=postgres://…
STRIPE_SECRET_KEY=sk_live_…           ← サーバーだけで使う秘密

# VITE_ で始まるものは、ビルドした JS に入って、だれでも見られる
VITE_API_URL=https://api.example.com  ← 公開してよいものだけ
VITE_STRIPE_SECRET=sk_live_…          ← ✕ ぜったいダメ

# .gitignore
.env
.env.*
!.env.example
`,
}

const CV_SEC_LOG = {
  view: true,
  title: "ログに残すもの・残さないもの",
  file: "（例）",
  task: "ログは便利だけど、それ自体が情報もれの原因にもなるのだ",
  marks: { 2: "パスワードがログに残る", 3: "トークンも出てしまう", 6: "何が起きたかだけ", 10: "監査ログ" },
  code: `
// ✕ パスワードやトークンをログに出す
console.log('login', { email, password })
console.log('request', req.headers)     // Authorization や Cookie まで出てしまう

// ◯ 必要なことだけを残す
logger.info({ event: 'login_failed', userId: user?.id, ip: req.ip })

// ◯ 監査ログ：だれが・いつ・何をしたか（あとから調べられるように）
logger.info({
  event: 'save_deleted',
  userId: req.user.id,
  saveId,
  at: new Date().toISOString(),
})
`,
}

// ===== 授業の拡充で足したコード =====
const CV_LIFECYCLE = {
  view: true,
  title: "作られる・消えるときの後片付け",
  file: "views/GameView.vue",
  task: "ゲーム画面が出たらキーを見張りはじめて、消えたら見張りをやめるのだ",
  marks: { 1: "画面に出たら", 2: "見張りを始める", 6: "画面から消えたら", 7: "見張りをやめる", 10: "タイマーも止める" },
  code: `
onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', stopSkip)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('blur', stopSkip)
  clearInterval(skipTimer)
})
`,
}

const CV_COMPOSABLE = {
  view: true,
  title: "コンポーザブル",
  file: "composables/useLessonProgress.js",
  task: "「見終わった授業」の記録を、目次とゲーム画面の両方で使い回しているのだ",
  marks: { 12: "外に置くと、みんなで共有", 14: "use〇〇 という名前にする", 20: "使う側に渡すもの" },
  code: `
const KEY = 'after-school-rewrite:lessons'

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY)) ?? [])
  } catch {
    return new Set()
  }
}

// 関数の外に置いて、目次とゲーム画面で同じものを共有する
const seen = ref(load())

export function useLessonProgress() {
  function markSeen(id) {
    if (seen.value.has(id)) return
    seen.value = new Set([...seen.value, id])
    // …
  }
  return { seen, markSeen }
}
`,
}

const CV_COMPOSABLE_USE = {
  view: true,
  title: "コンポーザブルを使う側",
  file: "GameView.vue ／ LessonMenu.vue",
  task: "使う側は、呼ぶだけなのだ",
  marks: { 2: "記録する側", 5: "読む側" },
  code: `
// GameView.vue：授業を見終わったら記録する
const { markSeen } = useLessonProgress()

// LessonMenu.vue：記録を見て ✓ を付ける
const { seen } = useLessonProgress()
`,
}

const CV_VUE_TRANSITION = {
  view: true,
  title: "立ち絵の出入り",
  file: "components/StageLayer.vue",
  task: "<Transition> で囲むと、出るとき・消えるときに CSS のクラスが付くのだ",
  marks: { 1: "残響のときは別の出方", 2: "key が変わると入れかわる", 6: "出るあいだ", 12: "出はじめの見た目", 16: "消えおわりの見た目" },
  code: `
<Transition :name="echo ? 'chara-glitch' : 'chara-fade'" mode="out-in">
  <CharaSprite v-if="chara && !stillSrc" :key="charaKey" :name="chara" :echo="echo" :talking="talking" class="chara" />
</Transition>

/* Transition name="chara-fade"（立ち絵）：下からふわっと登場 */
.chara-fade-enter-active {
  transition: opacity 0.35s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.chara-fade-leave-active {
  transition: opacity 0.2s;
}
.chara-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, 24px);
}
.chara-fade-leave-to {
  opacity: 0;
}
`,
}

const CV_SLOT = {
  view: true,
  title: "スロット",
  file: "（例）Card.vue と使う側",
  task: "部品に「穴」をあけておいて、使う側が中身を入れるのだ",
  marks: { 4: "名前つきの穴", 5: "ふつうの穴", 6: "何も入れないときの中身", 12: "名前つきの穴に入れる" },
  code: `
<!-- Card.vue：枠だけを持つ部品 -->
<template>
  <div class="card">
    <header><slot name="title" /></header>
    <slot />                       <!-- 名前なし＝ふつうの中身 -->
    <footer><slot name="footer">閉じる</slot></footer>
  </div>
</template>

<!-- 使う側：中身を差しこむ -->
<Card>
  <template #title>ずんだもんの手紙</template>
  <p>今夜は屋上で、カップラーメンなのだ。</p>
  <template #footer><button>返事を書く</button></template>
</Card>
`,
}

const CV_CSSVAR = {
  view: true,
  title: "CSS 変数",
  file: "LessonMenu.vue ／ GameView.vue ／ StageLayer.vue",
  task: "-- で始まる名前に値を入れて、var() で使うのだ",
  marks: { 2: "変数に色を入れる", 3: "変数を使う", 7: "JS から値を渡す", 10: "なければ 0" },
  code: `
/* LessonMenu.vue：編ごとの色を、変数1つで切りかえる */
.track-basic { --accent: #6fc3ff; }
  border-top: 3px solid var(--accent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 45%, transparent);

<!-- GameView.vue：マウスの位置を、JS から変数として渡す -->
    :style="{ '--mx': mouse.x, '--my': mouse.y }"

/* StageLayer.vue：その変数で、舞台を回す */
  transform: rotateY(calc(var(--mx, 0) * 5deg)) rotateX(calc(var(--my, 0) * -3deg));
`,
}

const CV_RENDER = {
  view: true,
  title: "重くなる CSS・軽い CSS",
  file: "（例）",
  task: "動かすプロパティで、ブラウザの仕事の量が変わるのだ",
  marks: { 2: "レイアウトからやり直し", 5: "合成だけで軽い", 9: "読み書きを交互にしている", 13: "先にまとめて読む" },
  code: `
/* ✕ 重い：位置や大きさを変える → レイアウトからやり直し */
.box { transition: left 0.3s, width 0.3s; }

/* ◯ 軽い：見た目を動かすだけ → 合成だけで済む */
.box { transition: transform 0.3s, opacity 0.3s; }

// ✕ 読む・書くを交互にすると、そのたびにレイアウトし直す（強制リフロー）
for (const el of items) {
  el.style.width = box.offsetWidth + 'px'   // 読む → 書く → 読む → …
}

// ◯ 先にまとめて読んでから、まとめて書く
const width = box.offsetWidth
for (const el of items) {
  el.style.width = width + 'px'
}
`,
}

// ===== Node.js 編のコード =====
const CV_NODE_REAL = {
  view: true,
  title: "このゲームの中の Node.js",
  file: "package.json ／ vite.config.js",
  task: "このゲームも、ビルドや開発サーバーは Node.js で動いているのだ",
  marks: { 2: "import / export で書く", 5: "npm run build で Node が Vite を動かす", 8: "Node の環境変数" },
  code: `
// package.json：Node に「このプロジェクトは ESM で書く」と伝える
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",

// vite.config.js：Node で動く設定ファイル（process は Node の道具）
  base: process.env.BASE_PATH ?? '/',
`,
}

const CV_NODE_MODULES = {
  view: true,
  title: "ESM と CommonJS",
  file: "（例）",
  task: "モジュールの書き方は2種類あるのだ",
  marks: { 2: "ESM の読みこみ", 7: "CommonJS の読みこみ", 8: "CommonJS の書き出し", 10: "組みこみの道具の目印" },
  code: `
// ESM（いまの標準）… package.json に "type": "module" と書く
import fs from 'node:fs/promises'
import { createServer } from 'node:http'
export function hello() {}

// CommonJS（昔からある書き方）… 古いライブラリや設定ファイルで見る
const fs = require('node:fs')
module.exports = { hello }

// node: を付けると「Node に最初から入っている道具」だとはっきりする
// .mjs は ESM、.cjs は CommonJS として、いつでも扱われる
`,
}

const CV_NODE_BLOCKING = {
  view: true,
  title: "みんなを待たせる書き方",
  file: "（例）Express",
  task: "1本の手が止まると、ほかの人のリクエストも全部止まるのだ",
  marks: { 3: "Sync は止まる", 9: "待つのは OS にまかせる", 15: "計算は手が止まる" },
  code: `
// ✕ 同期の API：読み終わるまで、ほかのリクエストを全部止める
app.get('/save', (req, res) => {
  const data = fs.readFileSync('big.json', 'utf8')
  res.send(data)
})

// ◯ 非同期の API：読んでいる間も、ほかのリクエストに応えられる
app.get('/save', async (req, res) => {
  const data = await fs.promises.readFile('big.json', 'utf8')
  res.send(data)
})

// ✕ 重い計算も、ほかを全部止める → worker_threads や別のサービスへ
app.get('/report', (req, res) => {
  res.json(heavyCalculation())   // 3秒かかると、その3秒はだれも使えない
})
`,
}

const CV_NODE_STREAM = {
  view: true,
  title: "ストリームで少しずつ流す",
  file: "（例）",
  task: "大きなファイルは、全部読まずに流すのだ",
  marks: { 6: "全部メモリに乗る", 11: "流しながら圧縮", 13: "背圧・後片付け" },
  code: `
import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { createGzip } from 'node:zlib'

// ✕ 1GB のログを、全部メモリに読みこむ
const text = await fs.promises.readFile('access.log', 'utf8')

// ◯ 少しずつ読んで、圧縮しながら、少しずつ返す
app.get('/log', async (req, res) => {
  res.setHeader('Content-Encoding', 'gzip')
  await pipeline(createReadStream('access.log'), createGzip(), res)
})
// pipeline は、相手が受け取れないときは読むのを待ってくれる（背圧）
// とちゅうで失敗したら、全部をきちんと閉じてくれる
`,
}

const CV_NODE_HTTP = {
  view: true,
  title: "Node だけで作る HTTP サーバー",
  file: "（例）",
  task: "Node には、最初から HTTP サーバーの道具が入っているのだ",
  marks: { 3: "リクエストのたびに呼ばれる", 4: "自分で振り分ける", 5: "ステータスとヘッダー", 11: "3000番で待つ" },
  code: `
import { createServer } from 'node:http'

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return res.end('ok')
  }
  res.writeHead(404).end()
})

server.listen(3000, () => console.log('http://localhost:3000'))
`,
}

const CV_NODE_MIDDLEWARE = {
  view: true,
  title: "ミドルウェアの順番",
  file: "（例）Express",
  task: "リクエストは、上から順番に通っていくのだ",
  marks: { 3: "最初に通る", 5: "ここで止めることもできる", 10: "エラーの受け皿は最後", 15: "次へ進む" },
  code: `
const app = express()

app.use(express.json())           // ① JSON を読む
app.use(requestLogger)            // ② ログを残す
app.use('/api', requireLogin)     // ③ /api はログインが必要

app.get('/api/saves/me', getSave) // ④ 本番の処理

// ⑤ エラーをまとめて受け止める（引数が4つ）
app.use((err, req, res, next) => {
  logger.error({ err, path: req.path })
  res.status(500).json({ error: 'サーバーで問題が起きました' })
})

// ミドルウェアの形：次へ進むなら next() を呼ぶ
function requestLogger(req, res, next) {
  console.log(req.method, req.url)
  next()
}
`,
}

const CV_NODE_ERRORS = {
  view: true,
  title: "エラーと止まり方",
  file: "（例）",
  task: "プロセスが落ちたとき・止めるときの作法なのだ",
  marks: { 2: "だれも受け止めなかった例外", 4: "1 = 失敗で終わる", 12: "止めての合図", 16: "0 だけが成功" },
  code: `
// 受け止めそこねたエラー：記録して、プロセスを終わらせる（作り直してもらう）
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'uncaughtException')
  process.exit(1)
})
process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'unhandledRejection')
  process.exit(1)
})

// 止めてと言われたら、受付をやめて、処理中のものを終えてから止まる
process.on('SIGTERM', () => {
  server.close(() => process.exit(0))
})

// 終わり方の番号：0 = 成功、それ以外 = 失敗（CI やコンテナはこれを見る）
`,
}

const CV_NODE_TOOLS = {
  view: true,
  title: "バージョンと道具",
  file: ".nvmrc ／ package.json ／ コマンド",
  task: "チームで Node のバージョンをそろえるのだ",
  marks: { 2: "バージョンを固定", 5: "動く範囲", 9: "開発で便利", 11: "dotenv がいらない" },
  code: `
# .nvmrc：チームでそろえる Node のバージョン
24

# package.json：動く Node のバージョンを書いておく
"engines": { "node": ">=22" }

# よく使うコマンド
$ node --version
$ node --watch server.js        # 保存したら自動で再起動
$ node --test                   # 組みこみのテストを動かす
$ node --env-file=.env app.js   # .env を読んでから動かす
$ npx vitest                    # 入れなくても、道具を1回動かす
`,
}

// ===== 資料拡充（2回目）で足したコード =====
const CV_TS_NARROW = {
  view: true,
  title: "型の絞りこみ",
  file: "（例）このゲームの演出の型",
  task: "if で確かめると、TypeScript がその先の型を絞ってくれるのだ",
  marks: { 2: "type で見分けられる union", 7: "type で分ける", 11: "split のときだけ使える", 15: "全部書いたか確かめる" },
  code: `
type Cutin =
  | { type: 'eyes' }
  | { type: 'split'; left: string; right: string }
  | { type: 'diagonal'; angle: number }

function describe(c: Cutin): string {
  switch (c.type) {
    case 'eyes':
      return '目のアップ'
    case 'split':
      return \`\${c.left} と \${c.right}\`   // ここでは left が使える
    case 'diagonal':
      return \`\${c.angle} 度の帯\`         // ここでは angle が使える
    default: {
      const never: never = c             // 書きわすれがあるとエラー
      return never
    }
  }
}
`,
}

const CV_TS_UTIL = {
  view: true,
  title: "ユーティリティ型と satisfies",
  file: "（例）",
  task: "型から型を作る道具なのだ",
  marks: { 3: "全部オプションに", 4: "取り出す", 5: "のぞく", 8: "文字そのものの型", 15: "確かめるだけ" },
  code: `
interface Scene { bg: string; bgm: string; lines: Line[]; next?: string }

type SceneDraft = Partial<Scene>            // 全部「なくてもよい」に
type SceneLook  = Pick<Scene, 'bg' | 'bgm'> // 一部だけ取り出す
type NoLines    = Omit<Scene, 'lines'>      // 一部だけのぞく
type Scenes     = Record<string, Scene>     // キー → 値 の表

// as const：値を「その文字そのもの」の型にする
const MOODS = ['normal', 'duck', 'muffle', 'cut', 'swell'] as const
type Mood = (typeof MOODS)[number]          // 'normal' | 'duck' | …

// satisfies：型に合っているか確かめつつ、細かい型は残す
const scenes = {
  lunch: { bg: 'roof_day', bgm: 'day', lines: [] },
} satisfies Scenes
scenes.lunch                                // lunch があると分かっている
`,
}

const PG_FORM = {
  title: "フォームを作る",
  task: "メールの欄に type=\"email\" と required を付けて、変な値のまま送ってみるのだ",
  code: `
<script setup>
const sent = ref('')
function submit(e) {
  sent.value = '送信した：' + new FormData(e.target).get('email')
}
</script>

<template>
  <form @submit.prevent="submit">
    <label for="email">メールアドレス</label>
    <input id="email" name="email" type="text" />
    <button type="submit">登録する</button>
  </form>
  <p>{{ sent }}</p>
</template>

<style>
label { display: block; font-size: 14px; }
input { padding: 6px; font-size: 16px; width: 220px; }
button { margin-left: 6px; padding: 6px 12px; font-size: 15px; }
input:invalid { border: 2px solid #e05050; }
</style>
`,
  check: (el) => Boolean(el.querySelector('input[type="email"][required]')),
}

const PG_A11Y = {
  title: "だれでも使えるように",
  task: "<div> のボタンを <button> に、画像に alt を付けるのだ（Tab キーで動かしてみるのだ）",
  code: `
<script setup>
const count = ref(0)
</script>

<template>
  <img src="images/chara/zun_smile.webp" width="80" />
  <div class="btn" @click="count++">ずんだ餅をあげる</div>
  <p>あげた数：{{ count }}</p>
</template>

<style>
.btn {
  display: inline-block;
  padding: 6px 12px;
  border: 1px solid #999;
  font-size: 15px;
  cursor: pointer;
}
</style>
`,
  check: (el) => Boolean(el.querySelector('button')) && Boolean(el.querySelector('img[alt]')?.getAttribute('alt')),
}

const CV_ESLINT = {
  view: true,
  title: "ESLint と Prettier",
  file: "eslint.config.js ／ package.json（例）",
  task: "見た目は Prettier、まちがいは ESLint に任せるのだ",
  marks: { 6: "おすすめのルール", 7: "Vue 用のルール", 8: "使っていない変数はエラー", 13: "CI でも動かす", 14: "見た目をそろえる" },
  code: `
// eslint.config.js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  { rules: { 'no-unused-vars': 'error' } },
]

// package.json
"scripts": {
  "lint": "eslint .",
  "format": "prettier --write ."
}
`,
}

const CV_GIT = {
  view: true,
  title: "Git のよく使うコマンド",
  file: "コマンドの例",
  task: "毎日使うのは、だいたいこれだけなのだ",
  marks: { 1: "main で直接作業しない", 4: "入れるものを選ぶ", 5: "何をしたか短く書く", 7: "レビューしてもらう", 11: "消えた変更は戻らない" },
  code: `
$ git switch -c feature/lesson-git   # 作業用のブランチを作る
$ git status                         # 何が変わったか
$ git diff                           # 変えた中身
$ git add src/data/lessons.js        # コミットに入れるものを選ぶ
$ git commit -m "Git の授業を追加"    # 記録する
$ git push -u origin feature/lesson-git
  → GitHub でプルリクエストを作る → レビュー → マージ

$ git pull --rebase                  # みんなの変更を取りこむ
$ git log --oneline                  # 歴史を見る
$ git restore src/App.vue            # 変更を取り消す（注意）
`,
}

// ===== ソフトウェア設計編のコード =====
const CV_DS_SRP = {
  view: true,
  title: "役目を分ける",
  file: "（例）セーブを読む処理",
  task: "1つの関数に、いろいろな役目を詰めこまないのだ",
  marks: { 2: "何でも屋の関数", 11: "通信の係", 12: "計算の係（純粋な関数）", 13: "保存の係", 18: "組み合わせるだけ" },
  code: `
// ✕ 画面・通信・計算・保存が、1つの関数にまざっている
async function onClickLoad() {
  const res = await fetch('/api/saves/me')
  const save = await res.json()
  const count = new Set(save.visited.filter((p) => p.length === 3)).size
  localStorage.setItem('cache', JSON.stringify(save))
  document.querySelector('#count').textContent = \`\${count} / 8\`
}

// ◯ 役目ごとに分ける（それぞれを別々に直せる・テストできる）
const api = { loadSave: () => fetch('/api/saves/me').then((r) => r.json()) }
const countEndings = (visited) => new Set(visited.filter((p) => p.length === 3)).size
const cache = { put: (save) => localStorage.setItem('cache', JSON.stringify(save)) }

async function onClickLoad() {
  const save = await api.loadSave()
  cache.put(save)
  count.value = countEndings(save.visited)   // 画面は Vue に任せる
}
`,
}

const CV_DS_DI = {
  view: true,
  title: "依存の向きを逆にする",
  file: "（例）セーブの保存先",
  task: "「何に保存するか」を外から渡すと、入れかえやすいのだ",
  marks: { 3: "具体的なものに直接つながっている", 8: "外から受け取る", 12: "どこに保存するかは知らない", 20: "テストでは入れかえる" },
  code: `
// ✕ 中で localStorage を直接使う → テストしにくい・入れかえられない
function saveEnding(id) {
  const list = JSON.parse(localStorage.getItem('endings') ?? '[]')
  localStorage.setItem('endings', JSON.stringify([...list, id]))
}

// ◯ 「保存できるもの」を外から渡す
function createEndingService(storage) {
  return {
    async saveEnding(id) {
      const list = (await storage.get('endings')) ?? []
      await storage.set('endings', [...list, id])
    },
  }
}

// 本番はブラウザ、あとでクラウド、テストでは中身を見られるニセモノ
const service = createEndingService(localStorageAdapter)
// const service = createEndingService(apiStorage)
// const service = createEndingService(memoryStorageForTest)
`,
}

const CV_DS_DERIVED = {
  view: true,
  title: "計算できるものは持たない",
  file: "stores/game.js",
  task: "見たエンディングの数は「覚える」のではなく、記録から「計算」しているのだ",
  marks: { 2: "数は visited から計算", 4: "全部見たかも計算" },
  code: `
    // これまでに見たエンディングの数（最後まで選んだ選び方の数）
    endingsSeenCount: (state) => new Set(state.visited.filter((p) => p.length === 3).map(getEndingType)).size,
    // 隠しエンディング以外の、8つのエンディングをすべて見たか
    allEndingsSeen: (state) =>
      Object.entries(endingByPath)
        .filter(([, id]) => !endings[id].secret)
        .every(([path]) => state.visited.includes(path)),
`,
}

const CV_DS_DATA = {
  view: true,
  title: "データで動かす",
  file: "data/scenario.js ／ stores/game.js",
  task: "中身はデータ、動かし方はコード。だから話を足してもコードは変えないのだ",
  marks: { 2: "中身は1か所に", 6: "エンジンは読むだけ" },
  code: `
// ===== シナリオデータ =====
// ゲームの「中身」はここだけに書く。コードを触らずに話を増やせるようにするため。

// stores/game.js：データを読んで、いまのセリフを決めるだけ
    line() {
      return this.lines[this.lineIndex]
    },
    isLastLine() {
      return this.lineIndex === this.lines.length - 1
    },
`,
}

const CV_DS_ADR = {
  view: true,
  title: "設計の記録（ADR）",
  file: "docs/adr/0003-lesson-lazy-load.md（例）",
  task: "「なぜそう決めたか」を残しておくのだ",
  marks: { 3: "なぜ考えたか", 7: "何にしたか", 10: "選ばなかった理由", 14: "よくなったこと・がまんしたこと" },
  code: `
# 0003 授業のデータを、TECH DOCS を押したときに読みこむ

## 状況
授業が増えて、最初に読みこむ JS が 519KB になった。
本編だけ遊ぶ人にも、授業のデータを配っている。

## 決めたこと
lessons.js と授業専用の部品を、動的 import で分ける。

## ほかの案
- 何もしない … 本編が遅いまま
- 授業を別のサイトにする … 演出の部品を共有できない

## 結果
最初の JS は 243KB に。TECH DOCS を初めて押したときだけ少し待つ。
`,
}

// ===== 有名なライブラリ編のコード（説明用の例） =====
const CV_ECO_FRAMEWORKS = {
  view: true,
  title: "同じ部品を4つのフレームワークで",
  file: "（例）ボタンを押すと数が増える部品",
  task: "書き方はちがっても、考え方はほとんど同じなのだ",
  marks: { 2: "Vue：ref", 7: "React：useState と JSX", 12: "Svelte：コンパイラが変換", 17: "Angular：シグナル" },
  code: `
<!-- Vue -->
<script setup>const count = ref(0)</script>
<button @click="count++">{{ count }}</button>

// React
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

<!-- Svelte -->
<script>let count = $state(0)</script>
<button onclick={() => count++}>{count}</button>

// Angular
@Component({ selector: 'app-counter', template: \`<button (click)="count.set(count() + 1)">{{ count() }}</button>\` })
export class Counter { count = signal(0) }
`,
}

const CV_ECO_NUXT = {
  view: true,
  title: "メタフレームワークのページ",
  file: "pages/endings/[id].vue（Nuxt の例）",
  task: "ファイルを置くだけで URL になって、サーバーでデータを取れるのだ",
  marks: { 1: "ファイルの場所が URL", 6: "サーバーでもブラウザでも動く", 14: "API も同じ場所に" },
  code: `
<!-- pages/endings/[id].vue → /endings/true のような URL になる -->
<script setup>
const route = useRoute()

// サーバーで先にデータを取ってから HTML を作る（SSR）
const { data: ending } = await useFetch(\`/api/endings/\${route.params.id}\`)
</script>

<template>
  <h1>{{ ending.name }}</h1>
  <p>{{ ending.text }}</p>
</template>

<!-- server/api/endings/[id].get.js：同じプロジェクトに API も書ける -->
`,
}

const CV_ELECTRON = {
  view: true,
  title: "Electron のアプリ",
  file: "main.js ／ preload.js（Electron の例）",
  task: "画面はいつもの Web、OS の機能は main プロセスに頼むのだ",
  marks: { 2: "main プロセス", 9: "安全のため必ず", 13: "Web の画面をそのまま", 15: "画面からの頼みを受ける", 19: "見せる機能を選ぶ" },
  code: `
// main.js（main プロセス：Node.js で動く。OS の機能が使える）
const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('node:fs/promises')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: __dirname + '/preload.js',
      contextIsolation: true,   // 画面と Node を切りはなす（必ず true）
      nodeIntegration: false,   // 画面から Node を直接使わせない
    },
  })
  win.loadFile('dist/index.html')   // このゲームの dist をそのまま表示できる
})
ipcMain.handle('load-save', () => fs.readFile('save.json', 'utf8'))

// preload.js：画面に見せてよい機能だけを渡す「橋」
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('api', {
  loadSave: () => ipcRenderer.invoke('load-save'),
})
`,
}

const CV_TAURI = {
  view: true,
  title: "Tauri のアプリ",
  file: "src-tauri/src/lib.rs ／ 画面の JS（Tauri 2 の例）",
  task: "OS の機能は Rust で書いて、画面から呼ぶのだ",
  marks: { 2: "画面から呼べる関数", 9: "登録する", 16: "画面から呼ぶ", 18: "許可した機能だけ使える" },
  code: `
// src-tauri/src/lib.rs（Rust：OS の機能を書く）
#[tauri::command]
fn load_save() -> Result<String, String> {
    std::fs::read_to_string("save.json").map_err(|e| e.to_string())
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_save])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// 画面の JS（Vue でもそのまま使える）
import { invoke } from '@tauri-apps/api/core'
const save = await invoke('load_save')

// src-tauri/capabilities/*.json で、使ってよい機能を1つずつ許可する
`,
}

const CV_ECO_QUERY = {
  view: true,
  title: "サーバーのデータを扱う道具",
  file: "（例）TanStack Query（Vue）",
  task: "読みこみ中・エラー・キャッシュ・再取得を、まとめてやってくれるのだ",
  marks: { 1: "書きこみ", 4: "同じキーなら同じキャッシュ", 6: "取り直すまでの時間", 12: "書いたら最新を取り直す" },
  code: `
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

const { data: save, isPending, error } = useQuery({
  queryKey: ['save', 'me'],                 // キャッシュの名前
  queryFn: () => fetch('/api/saves/me').then((r) => r.json()),
  staleTime: 60_000,                        // 1分は取り直さない
})

const queryClient = useQueryClient()
const { mutate: addEnding } = useMutation({
  mutationFn: (id) => fetch('/api/endings', { method: 'POST', body: JSON.stringify({ id }) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['save', 'me'] }), // 取り直す
})
`,
}

const CV_ECO_SERVER = {
  view: true,
  title: "サーバー側の定番の組み合わせ",
  file: "（例）Hono ＋ zod ＋ Drizzle",
  task: "ルーティング・入力チェック・データベースを、それぞれの道具でつなぐのだ",
  marks: { 5: "軽いフレームワーク", 6: "zod：形を決める", 9: "合わなければ 400", 12: "Drizzle：型つきで SQL" },
  code: `
import { Hono } from 'hono'
import { z } from 'zod'
import { db, clearedEndings } from './db'   // Drizzle で定義したテーブル

const app = new Hono()
const Body = z.object({ endingId: z.enum(['true', 'deja', 'lost']) })

app.post('/api/endings', async (c) => {
  const parsed = Body.safeParse(await c.req.json())
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400)

  await db.insert(clearedEndings).values({
    userId: c.get('userId'),
    endingId: parsed.data.endingId,
  })
  return c.json({ ok: true }, 201)
})
`,
}

const CV_ECO_TEST = {
  view: true,
  title: "テストの道具",
  file: "（例）Vitest と Playwright",
  task: "小さく速いテストと、本物のブラウザで動かすテストを組み合わせるのだ",
  marks: { 2: "単体テスト", 6: "結果を確かめる", 10: "E2E テスト", 15: "画面の移り変わりを確かめる" },
  code: `
// Vitest：関数や部品のテスト（速い・たくさん書く）
import { test, expect } from 'vitest'
import { getEndingType } from '../src/data/scenario'

test('101 を選ぶと TRUE END', () => {
  expect(getEndingType('101')).toBe('true')
})

// Playwright：本物のブラウザで画面を操作する（遅い・大事な流れだけ）
import { test, expect } from '@playwright/test'

test('TECH DOCS から授業が始まる', async ({ page }) => {
  await page.goto('/')
  await page.getByText('TECH DOCS').click()
  await expect(page).toHaveURL(/\\/docs$/)
})
`,
}

// ===== 各編に足した授業のコード =====
const CV_CI_REAL = {
  view: true,
  title: "このゲームの CI/CD",
  file: ".github/workflows/deploy.yml",
  task: "main に push すると、GitHub Actions が自動でビルドして公開するのだ",
  marks: { 3: "main に来たら動く", 5: "lock どおりに入れる", 6: "ビルド", 13: "GitHub Pages に公開" },
  code: `
on:
  push:
    branches: [main]
# …
      - run: npm ci
      - run: npm run build
        env:
          BASE_PATH: /\${{ github.event.repository.name }}/
      - run: cp dist/index.html dist/404.html
      - uses: actions/upload-pages-artifact@v3
# …
      - id: deployment
        uses: actions/deploy-pages@v4
`,
}

const PG_VMODEL = {
  title: "v-model",
  task: "入力すると、下の文字も変わるのだ。チェックボックスにも v-model を付けてみるのだ",
  code: `
<script setup>
const name = ref('')
const agree = ref(false)
</script>

<template>
  <input v-model="name" placeholder="キミの名前" />
  <label><input type="checkbox" /> 部員になる</label>
  <p>{{ name || '（名前なし）' }} ／ 入部：{{ agree ? 'する' : 'しない' }}</p>
</template>

<style>
input { padding: 6px; font-size: 16px; }
label { margin-left: 8px; font-size: 15px; }
p { font-size: 16px; }
</style>
`,
  check: (el) => { const cb = el.querySelector('input[type="checkbox"]'); return Boolean(cb?.checked) && el.textContent.includes('入部：する') },
}

const PG_DARK = {
  title: "ダークモード",
  task: "下の @media の中に、暗いときの色を足すのだ（--bg を #1c2033 に、--text を #f2f2f2 に）。OS が暗い設定なら、すぐ変わるのだ",
  code: `
<template>
  <div class="card">
    <h2>放課後リライト</h2>
    <p>ダークモードにすると、色が入れかわるのだ。</p>
  </div>
</template>

<style>
.card {
  --bg: #ffffff;
  --text: #222222;
  padding: 16px;
  background: var(--bg);
  color: var(--text);
  border: 1px solid #999;
}
@media (prefers-color-scheme: dark) {
  .card {
  }
}
</style>
`,
  check: (el) => /--bg:\s*#1c2033/i.test(el.parentNode.querySelector('style')?.textContent ?? ''),
}

const CV_RETRY = {
  view: true,
  title: "やり直しの作法",
  file: "（例）",
  task: "失敗したら、間をあけながら数回だけやり直すのだ",
  marks: { 4: "1回ごとにタイムアウト", 5: "サーバーの失敗だけやり直す", 8: "回数を決める", 9: "だんだん間を広げる" },
  code: `
async function fetchWithRetry(url, { retries = 3 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
      if (res.status >= 500 || res.status === 429) throw new Error(\`HTTP \${res.status}\`)
      return res                                 // 4xx はやり直しても同じなので、そのまま返す
    } catch (e) {
      if (attempt >= retries) throw e            // 回数を使い切ったらあきらめる
      const wait = 2 ** attempt * 500 + Math.random() * 300   // 0.5秒 → 1秒 → 2秒 …（＋ゆらぎ）
      await new Promise((r) => setTimeout(r, wait))
    }
  }
}
`,
}

const CV_WORKER = {
  view: true,
  title: "Web Worker",
  file: "（例）main.js ／ worker.js",
  task: "重い計算は、別の手（スレッド）にお願いするのだ",
  marks: { 2: "別の手を作る", 3: "メッセージでお願い", 9: "worker 側で受け取る", 11: "結果を返す" },
  code: `
// main.js（画面の手）
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
worker.postMessage({ width: 1920, height: 1080 })   // お願いする
worker.onmessage = (e) => {
  draw(e.data)                                       // 結果が届いたら描く
}

// worker.js（別の手：画面にはさわれない）
self.onmessage = (e) => {
  const result = heavyImageProcessing(e.data)        // 何秒かかっても画面は止まらない
  self.postMessage(result)
}
`,
}

const CV_SSE = {
  view: true,
  title: "サーバーからの知らせ",
  file: "（例）WebSocket と SSE",
  task: "サーバーから、つぎつぎに知らせを送ってもらうのだ",
  marks: { 2: "wss = 暗号化した WebSocket", 4: "こちらからも送れる", 7: "SSE は受け取るだけ", 9: "自動で再接続" },
  code: `
// WebSocket：両方向にいつでも送れる（チャット・対戦ゲーム）
const ws = new WebSocket('wss://game.example.com/room/1')
ws.onmessage = (e) => showChat(JSON.parse(e.data))
ws.send(JSON.stringify({ type: 'chat', text: 'こんにちはなのだ' }))

// SSE（Server-Sent Events）：サーバー → ブラウザの一方向（通知・進み具合）
const events = new EventSource('/api/notifications')
events.onmessage = (e) => showToast(e.data)
// 切れても、ブラウザが自動でつなぎ直してくれる
`,
}

const CV_PAGING = {
  view: true,
  title: "一覧を区切って返す",
  file: "（例）API と SQL",
  task: "何万件もあるデータは、少しずつ返すのだ",
  marks: { 2: "全件はダメ", 6: "奥ほど遅い", 9: "続きの目印", 11: "目印より後ろだけ", 14: "速さの鍵" },
  code: `
// ✕ 全件を返す → 遅い・重い・いつか落ちる
GET /api/rankings

// △ ページ番号（OFFSET）… 奥のページほど遅く、途中で増えるとずれる
GET /api/rankings?page=500&limit=20
SELECT * FROM rankings ORDER BY score DESC LIMIT 20 OFFSET 9980;

// ◯ カーソル … 「前回の最後」から続きを取る（速く、ずれない）
GET /api/rankings?after=9800_12345&limit=20
SELECT * FROM rankings
WHERE (score, id) < (9800, 12345)
ORDER BY score DESC, id DESC
LIMIT 20;
-- (score, id) にインデックスを張っておく
`,
}

const CV_PRESIGN = {
  view: true,
  title: "署名付き URL",
  file: "（例）AWS SDK for JavaScript v3",
  task: "サーバーを通さずに、ブラウザから S3 へ直接アップロードさせるのだ",
  marks: { 2: "署名付き URL を作る", 8: "置き場所はサーバーが決める", 13: "5分で使えなくなる", 18: "ブラウザから直接" },
  code: `
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({ region: 'ap-northeast-1' })

// API：ログインしている人に、「5分だけ・この場所に・置いてよい」URL を渡す
app.post('/api/screenshots', requireLogin, async (req, res) => {
  const key = \`screenshots/\${req.user.id}/\${crypto.randomUUID()}.webp\`
  const url = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: 'after-school-uploads',
    Key: key,
    ContentType: 'image/webp',
  }), { expiresIn: 300 })
  res.json({ url, key })
})

// ブラウザ：もらった URL に、そのまま PUT する（S3 は非公開のまま）
await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': 'image/webp' } })
`,
}

const CV_THREE = {
  view: true,
  title: "Three.js で 3D",
  file: "（例）",
  task: "このゲームは CSS で 3D を作ったけど、本格的な 3D は WebGL の道具を使うのだ",
  marks: { 3: "舞台", 4: "カメラ", 7: "GPU で描く", 11: "形＋材質", 17: "毎フレーム描く" },
  code: `
import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

const mochi = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: '#8fd14f' }),  // ずんだ色
)
scene.add(mochi, new THREE.DirectionalLight('#ffffff', 2))

renderer.setAnimationLoop(() => {
  mochi.rotation.y += 0.01
  renderer.render(scene, camera)
})
`,
}

const CV_TESTABLE = {
  view: true,
  title: "テストしやすいコード",
  file: "（例）",
  task: "時刻や乱数を外から渡すと、テストで結果を決められるのだ",
  marks: { 3: "中で時刻を取っている", 8: "外から渡せる", 13: "テストで時刻を決める" },
  code: `
// ✕ 中で現在時刻を使う → テストのたびに結果が変わる
function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'おはようなのだ' : 'こんにちはなのだ'
}

// ◯ 時刻を引数でもらう → テストで好きな時刻を渡せる
function greeting(now = new Date()) {
  return now.getHours() < 12 ? 'おはようなのだ' : 'こんにちはなのだ'
}

test('朝はおはよう', () => {
  expect(greeting(new Date('2026-10-01T08:00'))).toBe('おはようなのだ')
})
`,
}

// ===== CSS はじめて編の「やってみよう」 =====
const PG_C0_FIRST = {
  title: "はじめての CSS",
  task: "red を blue に変えてみるのだ。ほかの色の名前（green・orange・hotpink など）でもいいのだ",
  code: `
<template>
  <p>ずんだもんなのだ！</p>
</template>

<style>
p {
  color: red;
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('p')).color !== 'rgb(255, 0, 0)',
}

const PG_C0_TEXT = {
  title: "文字の見た目",
  task: "font-size を 32px に、text-align を center に変えてみるのだ",
  code: `
<template>
  <h1>放課後リライト</h1>
  <p>その放課後、世界は一度だけ書き換わった。</p>
</template>

<style>
h1 {
  font-size: 16px;
  font-weight: bold;
  text-align: left;
}
p {
  line-height: 1.2;
}
</style>
`,
  check: (el) => parseFloat(getComputedStyle(el.querySelector('h1')).fontSize) >= 30 && getComputedStyle(el.querySelector('h1')).textAlign === 'center',
}

const PG_C0_COLOR = {
  title: "色の書き方",
  task: "#ff7b00 の数字を変えたり、rgb(…) の3つの数を変えたりしてみるのだ（どれか1つ変えれば OK）",
  code: `
<template>
  <p class="a">名前で書く：orange</p>
  <p class="b">16進数で書く：#ff7b00</p>
  <p class="c">rgb で書く：rgb(77, 160, 60)</p>
</template>

<style>
p { font-size: 18px; font-weight: bold; }
.a { color: orange; }
.b { color: #ff7b00; }
.c { color: rgb(77, 160, 60); }
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.b')).color !== 'rgb(255, 123, 0)' || getComputedStyle(el.querySelector('.c')).color !== 'rgb(77, 160, 60)',
}

const PG_C0_BOX = {
  title: "背景と枠",
  task: "background を lightyellow に、border-radius を 16px にしてみるのだ",
  code: `
<template>
  <div class="card">ずんだ餅、あげるのだ</div>
</template>

<style>
.card {
  background: white;
  border: 3px solid green;
  border-radius: 0px;
  padding: 12px;
  font-size: 18px;
}
</style>
`,
  check: (el) => { const st = getComputedStyle(el.querySelector('.card')); return st.backgroundColor !== 'rgb(255, 255, 255)' && parseFloat(st.borderTopLeftRadius) >= 8 },
}

const PG_C0_SPACE = {
  title: "すきまを作る",
  task: "padding を 20px にして、margin-bottom を 20px にしてみるのだ",
  code: `
<template>
  <p class="bubble">ずんだもん：おはようなのだ</p>
  <p class="bubble">めたん：ごきげんよう</p>
</template>

<style>
.bubble {
  background: #fff3e6;
  border: 2px solid orange;
  padding: 0px;
  margin: 0px;
  margin-bottom: 0px;
  font-size: 17px;
}
</style>
`,
  check: (el) => { const st = getComputedStyle(el.querySelector('.bubble')); return parseFloat(st.paddingTop) >= 16 && parseFloat(st.marginBottom) >= 16 },
}

const PG_C0_SIZE = {
  title: "大きさを決める",
  task: "width を 50% にしてみるのだ。px と % のちがいを見るのだ",
  code: `
<template>
  <div class="bar">体力ゲージ</div>
</template>

<style>
.bar {
  width: 120px;
  height: 30px;
  background: #4f9a40;
  color: white;
  font-size: 14px;
}
</style>
`,
  check: (el) => getComputedStyle(el.querySelector('.bar')).width !== '120px',
}

const PG_C0_CLASS = {
  title: "class で選ぶ",
  task: "2つめの <p> に class=\"metan\" を付けて、.metan の色を pink にしてみるのだ",
  code: `
<template>
  <p class="zun">ずんだもん：ずんだ餅が好きなのだ</p>
  <p>めたん：わたくしは紅茶ですわ</p>
</template>

<style>
p {
  font-size: 17px;
}
.zun {
  color: green;
}
.metan {
  color: black;
}
</style>
`,
  check: (el) => { const m = el.querySelector('.metan'); return Boolean(m) && getComputedStyle(m).color !== 'rgb(0, 0, 0)' },
}

// ===== インターネット・ブラウザのしくみのコード =====
const CV_NET_DIG = {
  view: true,
  title: "名前と道のりを調べるコマンド",
  file: "コマンドの例（Windows ならかっこの中）",
  task: "ネットワークの中のようすは、コマンドでのぞけるのだ",
  marks: { 1: "A レコード", 3: "キャッシュしてよい秒数", 8: "往復の時間", 9: "通り道", 12: "HTTPS は 443 番" },
  code: `
$ dig github.com           # 名前 → IP アドレス（nslookup github.com）
  github.com.   60   IN   A   20.27.177.113
                 ↑ TTL（60秒は覚えておいてよい）

$ dig github.com MX        # メールの届け先
$ dig github.com TXT       # 持ち主の確認などに使う文字

$ ping github.com          # 届くか・往復に何ミリ秒か
$ traceroute github.com    # 途中のルーターを順番に表示（tracert）

$ curl -v https://github.com/ 2>&1 | head
  * Connected to github.com (20.27.177.113) port 443
  * SSL connection using TLSv1.3
`,
}

const CV_SCRIPT_LOAD = {
  view: true,
  title: "スクリプトの読みこみ方",
  file: "（例）index.html",
  task: "書き方で、HTML を読むのを止めるかどうかが変わるのだ",
  marks: { 2: "表示が止まる", 5: "読み終わってから順番に", 8: "届いたらすぐ", 10: "defer と同じ", 14: "先に取りに行く" },
  code: `
<!-- ✕ ふつうの script：ここで HTML を読むのを止めて、ダウンロードして実行 -->
<script src="big.js"></script>

<!-- ◯ defer：ダウンロードは並行。HTML を読み終わってから、順番に実行 -->
<script defer src="app.js"></script>

<!-- ◯ async：ダウンロードは並行。届いたらすぐ実行（順番はばらばら） -->
<script async src="analytics.js"></script>

<!-- type="module" は、最初から defer と同じ動き（このゲームもこれ） -->
<script type="module" src="/src/main.js"></script>

<!-- 大事なものは先に知らせておく -->
<link rel="preload" href="/fonts/zen.woff2" as="font" crossorigin />
<link rel="preconnect" href="https://fonts.gstatic.com" />
`,
}

// ===== よく使うサービスのコード（説明用の例） =====
const CV_FIREBASE = {
  view: true,
  title: "Firebase でセーブを保存する",
  file: "（例）画面の JS ／ firestore.rules",
  task: "画面から直接データベースを使えるけど、守るのはルールなのだ",
  marks: { 2: "ログインの係も Firebase", 6: "自分の番号の場所に保存", 10: "守りはルールで書く", 15: "自分のデータだけ" },
  code: `
// 画面の JS（Firebase の Web SDK）
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const { user } = await signInAnonymously(getAuth())   // 名前なしでログイン
await setDoc(doc(getFirestore(), 'saves', user.uid), {
  visited: ['101', '110'],
})

// firestore.rules：だれが何を読み書きできるか（ここが守りのかなめ）
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /saves/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
`,
}

const CV_WEBHOOK = {
  view: true,
  title: "Stripe の Webhook を受け取る",
  file: "（例）Express",
  task: "支払いが終わったことは、Stripe からサーバーに知らせが来るのだ",
  marks: { 2: "秘密のキーはサーバーだけ", 5: "そのままの本文", 8: "署名を確かめる", 16: "支払いが終わった", 17: "べき等に" },
  code: `
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// 署名を確かめるため、JSON にする前の「そのままの本文」で受け取る
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,       // 本物の Stripe からか確かめる
    )
  } catch {
    return res.status(400).end()
  }
  if (event.type === 'checkout.session.completed') {
    unlockSecretEnding(event.data.object.client_reference_id)   // 同じ知らせが2回来ても大丈夫に
  }
  res.json({ received: true })
})
`,
}

export const lessonScenes = {
  lesson_intro: {
    chapter: { no: 'EX', title: '放課後テックゼミ', sub: 'AFTER SCHOOL TECH SEMINAR' },
    place: { name: '物理準備室', time: '16:50' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'top', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'burst', text: 'ようこそ、*放課後テックゼミ*へなのだ！ ボクとめたんが、技術のことを教えるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', text: 'いまキミが遊んでいるこのゲームは、*Vue（ビュー）*という道具で作られているのだ。' },
      { speaker: '僕', chara: 'zun_smile', text: '「ビュー？ 名前だけは聞いたことある」' },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'Vue は、ウェブの画面を作るための道具なのだ。今日は*このゲームの中身*を見ながら説明するのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', text: 'わたくしも助手として付き合いますわ。コードは左の端末に、図は右の画面に映しますわね。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'flow', focus: 'data' }, text: 'まずは全体の地図なのだ。セリフは scenario.js というファイルに、*データ*として書いてあるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'flow', focus: 'store' }, text: 'いま何番目のセリフを読んでいるかは、Pinia の*ストア*が覚えていますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'flow', focus: 'view' }, text: 'GameView が、その番号のセリフを読んで画面に出すのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'flow', focus: 'click' }, text: 'キミがクリックすると番号が1つ進んで、また画面が変わる。この*ぐるぐる*が、ノベルゲームの正体なのだ！' },
      { speaker: '僕', chara: 'zun_smile', diagram: 'flow', text: '「光の点が回ってるのが、その流れってことか」' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_SCENE, text: 'ちなみに、いま流れているこの会話も、ただの*データ*として書かれていますのよ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: '授業は11のコースに分かれているのだ。はじめてなら、1番から順番に聞くのがおすすめなのだ！' },
    ],
    choices: MENU,
  },

  // 目次（説明のあとに戻ってくる場所）
  lesson_menu_webhttp: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'webhttp', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '*インターネットと Web*のコースなのだ。見出しごとに、やさしい順に並んでいるのだ。' },
    ],
    choices: WEBHTTP_MENU,
  },

  lesson_menu_htmlcss: {
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'htmlcss', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_proud', text: "*HTML と CSS*のコースなのだ。見出しごとに、やさしい順に並んでいるのだ。" },
    ],
    choices: HTMLCSS_MENU,
  },

  lesson_menu_server: {
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000000',
    lessonMenu: 'server', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_proud', text: "*サーバー*のコースなのだ。見出しごとに、やさしい順に並んでいるのだ。" },
    ],
    choices: SERVER_MENU,
  },

  lesson_menu_toolslib: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'toolslib', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: '四国めたん', chara: 'metan_smug', text: '*道具とライブラリ*のコースなのだ。見出しごとに、やさしい順に並んでいるのだ。' },
    ],
    choices: TOOLSLIB_MENU,
  },

  lesson_menu: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'top', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_smile', text: '次は、どれを聞くのだ？ 見終わった授業には印が付いているのだ。' },
    ],
    choices: MENU,
  },

  lesson_menu_vue: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'vue', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_proud', text: '*Vue のしくみ編*なのだ。このゲームの画面が、どう動いているかの話なのだ。' },
    ],
    choices: VUE_MENU,
  },


  // ----- コンポーネント -----
  lesson_component: {
    place: { name: 'LESSON 01 コンポーネント', time: '16:52' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000001',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'Vue の画面は、*部品（コンポーネント）*を組み合わせてできているのだ。プラモデルみたいなものなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'tree', focus: 'MessageBox' }, camera: 'close', text: 'たとえば、いま下に出ている*このメッセージ欄*。これがひとつの部品なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['> ls src/components', 'MessageBox.vue   … メッセージ欄', 'StageLayer.vue   … 背景と立ち絵', 'ChoiceList.vue   … 選択肢', 'NixieMeter.vue   … 右上の観測計'], text: '部品は1つずつ、.vue というファイルになっていますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'tree', focus: 'NixieMeter' }, fx: 'meter', text: '右上の観測計も部品なのだ。タイトル画面でも同じ部品を使い回しているのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['<template>', '  <StageLayer :bg="..." />', '  <NixieMeter :value="..." />', '  <MessageBox :speaker="..." />', '</template>'], text: 'ゲーム画面（GameView.vue）は、こうして部品を並べて作っていますのよ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'tree', focus: 'GameView' }, text: '図にすると、こうなるのだ。親の GameView の下に、子の部品がぶら下がっているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'tree', focus: 'CharaSprite' }, text: '部品の中に、さらに部品を入れることもできるのだ。StageLayer の中には、立ち絵1枚ぶんの CharaSprite が入っているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', playground: CV_MESSAGEBOX, text: '1つの .vue ファイルには、見た目（template）・動き（script）・飾り（style）がまとめて入っているのだ。' },
      { speaker: '僕', chara: 'zun_proud', diagram: 'tree', text: '「部品ごとに分けておけば、直すときも探しやすいってことか」' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 1つの部品には1つの役目", "✔ 何百行にもなったら分ける", "✔ 名前は PascalCase", "  （MessageBox.vue など）", "✔ 見た目だけの部品と", "  データを扱う部品を分ける"], text: "部品を作るときの、仕事でのコツなのだ。" },
      { speaker: 'ずんだもん', chara: 'zun_smile', fx: 'flash', text: 'そのとおりなのだ！ 部品はコンポーネント、おぼえたのだ？' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- ref・computed -----
  lesson_reactive: {
    place: { name: 'LESSON 02 ref・computed', time: '16:54' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000002',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'Vue のいちばんすごいところは、*値を変えるだけで、画面が勝手に変わる*ことなのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['const typedLength = ref(0)', '', '// 1文字出すたびに', 'typedLength.value++'], text: 'このセリフが1文字ずつ出ているのは、「何文字目まで出したか」という数を、少しずつ増やしているからですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', speed: 'slow', text: 'ref は、*見張られている箱*なのだ。中身が変わると、Vue が気づいて画面を書き直すのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'reactive', focus: 'ref' }, text: '右の図を見るのだ。上の数（ref）が1つ増えるたびに、画面の文字も1つ増えているのだ。' },
      { speaker: '僕', chara: 'zun_proud', text: '「画面を書き直す命令は、自分で書かなくていいの？」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: 'reactive', fx: 'burst', text: 'いらないのだ！ 数を増やすだけで、文字が1つ増えて見えるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', playground: PG_COUNTER, text: 'キミも*やってみる*のだ！ ボタンを押して、それからコードも書きかえてみるのだ。' },
      { speaker: '僕', chara: 'zun_proud', text: '「0 を書きかえただけで、最初の数が変わった」' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['const isTyping = computed(() =>', '  typedLength.value < chars.length', ')'], text: 'computed は、ほかの値から計算して出す値。「まだ文字を出している途中か」は、こうして決めていますの。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: PG_COMPUTED, text: 'computed も、さわってたしかめてごらんなさいな。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', playground: CV_TYPING, text: 'いま読んでいるこのセリフも、*本物のコード*ではこう書いてあるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'reactive', focus: 'computed' }, text: 'typedLength が変わると、isTyping も自動で計算し直されるのだ。図の下の値が、最後まで出すと false に変わるのを見るのだ。' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ script では .value を忘れない", "  （template では不要）", "✔ reactive を分割代入すると", "  リアクティブでなくなる", "✔ computed の中で値を", "  書きかえない（副作用なし）"], text: "つまずきやすいところですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: 'reactive', text: 'ref は「箱」、computed は「箱から計算した答え」。おぼえたのだ？' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- v-if・v-for -----
  lesson_directive: {
    place: { name: 'LESSON 03 v-if・v-for', time: '16:56' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000003',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'template の中では、*v- で始まる特別な書き方*が使えるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['<ChoiceList', '  v-if="choosing"', '  :choices="visibleChoices"', '/>'], text: 'v-if は「条件に合うときだけ出す」。選択肢は、セリフを読み終わったときだけ出てきますわね。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'directive', focus: 'if' }, text: 'choosing が true になった瞬間に選択肢が出て、false になったら消えるのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['<button', '  v-for="choice in choices"', '  :key="choice.text"', '>', '  {{ choice.text }}', '</button>'], text: 'v-for は「くり返して並べる」。選択肢がいくつあっても、この数行で並べられますの。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'directive', focus: 'for' }, text: 'choices の数が増えると、ボタンも勝手に増えるのだ。右の図で、選択肢が1つずつ増えていくのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_LIST, text: '配列に1つ足すだけで、画面の行も増えるのだ。やってみるのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_smile', text: '{{ }} の中に書いたものは、その値が文字として画面に出るのだ。' },
      { speaker: '僕', chara: 'zun_smile', text: '「この目次が8個並んでるのも、v-for なのか」' },
      { speaker: 'ずんだもん', chara: 'zun_normal', playground: CV_CHOICES, text: 'そうなのだ。本物のコードでは、v-if と v-for がこう組み合わさっているのだ。' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ v-for の key に配列の番号を", "  使わない（並べかえ・削除でずれる）", "✔ v-if と v-for を", "  同じタグに書かない", "✔ よく切りかえるなら v-show", "  （作り直さず、かくすだけ）"], text: "レビューでよく指摘されるところなのだ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: 'directive', fx: 'flash', text: 'そうなのだ！ 出す・消すは v-if、くり返すは v-for なのだ。' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- props・emit -----
  lesson_props: {
    place: { name: 'LESSON 04 props・emit', time: '16:58' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000004',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'props', text: '部品と部品は、*お手紙*をやりとりして会話するのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['<!-- 親（GameView）が渡す -->', '<MessageBox :speaker="line.speaker" />', '', '// 子（MessageBox）が受け取る', 'defineProps({ speaker: String })'], text: '親から子へ渡すお手紙が props。メッセージ欄は、名前と本文を受け取って表示しているだけですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'props', focus: 'props' }, text: 'だからメッセージ欄は、これがずんだもんのセリフか、めたんのセリフか、自分では知らないのだ。渡されたものを出すだけなのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['// 子（ChoiceList）が知らせる', "emit('choose', choice)", '', '<!-- 親が受け取る -->', '<ChoiceList @choose="game.choose" />'], text: '反対に、子から親へ「選ばれましたわ」と知らせるのが emit ですの。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'props', focus: 'emit' }, text: '青いお手紙が、下から上に戻っていくのだ。選択肢が押されたら、こうやって親に知らせるのだ。' },
      { speaker: '僕', chara: 'metan_smug', diagram: 'props', text: '「下に渡すのが props、上に知らせるのが emit……」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', fx: 'burst', text: '完璧なのだ！ 役目を分けておくと、部品を別の場所でも使い回せるのだ。' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 子で props を書きかえない", "  （親に emit でお願いする）", "✔ props と emit に型を付ける", "✔ 深い入れ子のバケツリレーは", "  provide / inject や Pinia を検討"], text: "仕事で守りたい約束ですわ。" },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_PROPS, text: '本物のコードで、お手紙の行き来をたどってみましょう。' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- watch -----
  lesson_watch: {
    place: { name: 'LESSON 07 watch', time: '17:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000005',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'watch', focus: 'watch' }, text: 'watch は、*値が変わったときに、何かをする*ための見張り番なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['watch(', '  () => game.line,', '  (line) => {', '    if (line.fx) playFx(line.fx)', '  },', ')'], text: 'たとえば、セリフが変わるたびに「画面効果の指定があるか」を確かめていますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', diagram: { type: 'watch', focus: 'action' }, fx: 'shake', text: 'こういうふうに、セリフに fx: \'shake\' と書いておくと……揺れるのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: 'watch', text: 'computed は「新しい値を作る」、watch は「変わったときに動く」。似てるけど役目がちがうのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', text: '音楽を切り替えるのも、文字を1つずつ出し始めるのも、この見張り番のお仕事ですのよ。' },
      { speaker: '僕', chara: 'metan_smug', text: '「さっきの揺れも、watch が気づいて動かしたわけか」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: CV_WATCH, text: '右上の観測計の数字がパラパラ回るのも、watch のおかげなのだ。' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ computed で済むなら computed", "✔ タイマーやイベントは", "  onUnmounted で止める", "  （止めないとメモリリーク）", "✔ deep: true は重いので", "  必要なときだけ"], text: "watch を使うときの注意ですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', playground: PG_WATCH, text: '見張り番を、キミも作ってみるのだ。' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- Pinia -----
  lesson_pinia: {
    place: { name: 'LESSON 11 Pinia', time: '17:02' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000006',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'pinia', text: 'ゲーム画面、エンディング、世界線の分岐図。いろんなページが、*同じ進み具合*を知っている必要があるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['> open src/stores/game.js', 'state: () => ({', "  sceneId: 'lunch',", '  lineIndex: 0,', "  path: '',", '})'], text: 'そこで使うのが Pinia。どのページからでも読める、*みんなの共有データ置き場*ですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'pinia', focus: 'store' }, text: 'いまどのシーンの、何番目のセリフか。どの選択肢を選んだか。ぜんぶここに入っているのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_STORE, text: 'ストアの中身を、もう少しくわしく見てみましょう。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['next() {', '  this.lineIndex++', '}'], text: 'キミが画面をクリックすると、この next() が呼ばれて、セリフの番号が1つ進みますの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'flow', focus: 'click' }, text: '番号が進むと、ref と同じで画面が勝手に次のセリフになるのだ。さっきの話とつながったのだ？' },
      { speaker: '僕', chara: 'zun_smile', text: '「じゃあ、エンディングが分岐できるのも……」' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 何でもストアに入れない", "  画面の中だけの値は ref で", "✔ 分割代入は storeToRefs で", "✔ state はアクションで変える", "✔ ページを閉じると消える", "  （残すなら保存が必要）"], text: "ストアの使い方のコツなのだ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'meter', text: 'path に、選んだ番号が「101」みたいに並んでいくのだ。それでエンディングが決まるのだ！' },
    ],
    next: 'lesson_menu_vue',
  },

  // ----- Vue Router -----
  lesson_router: {
    place: { name: 'LESSON 12 Vue Router', time: '17:04' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000007',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'router', text: 'タイトル、ゲーム、エンディング、記録室。ページの切り替えは *Vue Router* の担当なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['> open src/router/index.js', "{ path: '/',        TitleView }", "{ path: '/game',    GameView }", "{ path: '/credits', CreditsView }", "{ path: '/ending/:type', … }"], text: 'URL と、表示するページの対応表ですわ。アドレスが /game なら、ゲーム画面が出ますの。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', playground: CV_ROUTER, diagram: { type: 'router', focus: 'ending' }, text: ':type のところには、エンディングの名前が入るのだ。/ending/true なら TRUE END なのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['<RouterLink to="/credits">', '  CREDITS', '</RouterLink>', '', "router.push('/game')"], text: 'リンクで移るときは RouterLink、コードで移るときは router.push を使いますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: CV_START, diagram: { type: 'router', focus: 'game' }, text: 'タイトルの START を押すと、router.push(\'/game\') でゲーム画面に来るのだ。' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 存在しない URL 用の", "  404 ページを用意する", "✔ ページは () => import() で", "  あとから読みこむ（軽くなる）", "✔ 普通の URL を使うときは", "  サーバー側の設定も必要", "✔ ガードで画面を守っても、", "  本当の守りはサーバー側"], text: "ルーターで気をつけたいことですわ。" },
      { speaker: '僕', chara: 'zun_smile', text: '「ページを読みこみ直さずに切り替わるから、音楽も途切れないのか」' },
    ],
    next: 'lesson_menu_vue',
  },

  // ===================================================================
  // HTML・CSS 編
  // ===================================================================


  lesson_html: {
    place: { name: 'CSS 01 HTML', time: '17:30' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000021',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'HTML は、画面に*何があるか*を書く言葉なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['<p>こんにちは</p>', '', '<p>  … 始まりのタグ', '</p> … 終わりのタグ（/ が付く）'], text: '<p> と </p> みたいに、*タグ*ではさんで書くのだ。p は「段落」の意味なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['<h1>     … 大見出し', '<p>      … 段落', '<ul><li> … 箇条書き', '<button> … ボタン', '<img>    … 画像', '<div>    … ただの箱'], text: 'タグには、それぞれ意味がありますわ。よく使うのはこのあたりですの。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'dom', focus: 'message' }, text: 'タグの中に、またタグを入れられるのだ。これを*入れ子*っていうのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'dom', focus: 'p' }, text: 'メッセージ欄も、箱の中に名前と本文があって、本文の中に1文字ずつの span が入っているのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_HTML_MESSAGE, text: '本物の HTML を見てごらんなさいな。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_HTML, text: 'キミも HTML を書いてみるのだ！' },
      { speaker: '僕', chara: 'zun_smile', text: '「1行足したら、箇条書きが1つ増えた」' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 見出しは h1→h2→h3 の順", "✔ <div> だらけにしない", "  （<nav> <main> <section>）", "✔ 入力欄には <label>", "✔ クリックするものは", "  <button> か <a>"], text: "HTML を書くときのコツなのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', text: 'class="〇〇" は、タグに付ける*名札*。次の授業で、CSS から名札を使って色を付けますわ。' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_selector: {
    place: { name: 'CSS 02 セレクタ', time: '17:32' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000022',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'CSS は、*どこを・どう見せるか*を書く言葉なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['.zun {', '  color: green;', '}', '', '.zun   … セレクタ（どこに）', 'color  … プロパティ（何を）', 'green  … 値（どうする）'], text: '形はいつも同じ。*セレクタ*で場所を決めて、{ } の中に「プロパティ: 値;」を並べますの。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['p       … <p> ぜんぶ', '.zun    … class="zun" の名札', '#app    … id="app" のもの', '.a.b    … 名札を2つ持つもの', '.a p    … .a の中の <p>'], text: 'セレクタの書き方は、このへんを覚えておけば大丈夫なのだ。. は class、# は id なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_SELECTOR, text: 'めたんのセリフに名札を付けて、色を変えてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_SELECTOR, text: 'メッセージ欄の四隅のかざりは、名札を2つ組み合わせて書き分けていますのよ。' },
      { speaker: '僕', chara: 'metan_smug', text: '「共通のところは .bracket にまとめて、ちがうところだけ .tl とかに書くのか」' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 強さ：#id > .class > タグ", "  強いセレクタが勝つ", "✔ !important は最後の手段", "✔ Vue では scoped で", "  ほかの部品に効かせない", "✔ class の名前の付け方を", "  チームでそろえる"], text: "CSS が増えてきたときに困らないためのコツですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'flash', text: 'そうなのだ！ 同じことを何回も書かないのがコツなのだ。' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_box: {
    place: { name: 'CSS 03 ボックスモデル', time: '17:34' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000023',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'HTML のタグは、ぜんぶ*四角い箱*なのだ。文字も、ボタンも、画像も、箱なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'box', focus: 'content' }, text: '箱のまんなかに、中身（文字など）があるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'box', focus: 'padding' }, text: '中身と枠のあいだのすきまが padding。内側の余白ですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'box', focus: 'border' }, text: 'border は枠線なのだ。太さと線の種類と色を書くのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'box', focus: 'margin' }, text: 'そして、となりの箱とのすきまが margin。外側の余白ですの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_BOX, text: '数字を変えて、どこがふくらむか見てみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_BOX_MESSAGE, text: 'メッセージ欄の箱は、こう書いてありますわ。' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 最初に全体へ", "  box-sizing: border-box", "✔ 余白は margin か padding か", "  ルールを決める", "✔ 高さを固定しない", "  （文字が増えるとはみ出す）"], text: "箱を扱うときのコツなのだ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: 'box-sizing: border-box を書いておくと、幅の中に padding と枠がふくまれるのだ。計算がらくになるのだ。' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_flex: {
    place: { name: 'CSS 04 flex', time: '17:36' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000024',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '箱は、何もしないと*上から順に縦に*積まれていくのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'flex', focus: 'container' }, text: '親の箱に display: flex と書くと、中の子どもたちが*横に並ぶ*のだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'flex', focus: 'gap' }, text: 'gap はすきま。子どもどうしの間を、まとめてあけられますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'flex', focus: 'axis' }, text: 'flex-direction: column にすると、縦に並ぶのだ。justify-content と align-items で、どこに寄せるか決めるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_FLEX, text: 'タイトル画面のリンクを、並べ直してみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_FLEX_TITLE, text: '本物のタイトル画面は、縦と横の flex を組み合わせていますの。' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 中身がはみ出すときは", "  min-width: 0 を疑う", "  （このゲームのエディタでも使用）", "✔ すきまは margin より gap", "✔ 1列は flex、", "  縦横のマス目は grid"], text: "flex でよくある困りごとですわ。" },
      { speaker: '僕', chara: 'metan_smug', text: '「ロゴと START が画面のまんなかにあるのは、これだったのか」' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_layer: {
    place: { name: 'CSS 05 重ねる', time: '17:38' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000025',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'ノベルゲームの画面は、*何枚も重なって*できているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: 'layers', text: '背景の上に立ち絵、その上にメッセージ欄、さらに上に選択肢やムービーなのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['position: absolute;', 'top: 0;  left: 0;', '', '… ほかの箱を気にせず、', '  好きな場所に置ける'], text: 'position: absolute と書くと、順番に積まれるのをやめて、好きな場所に置けますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'layers', focus: 'axis' }, text: '重なったときにどれが手前か決めるのが z-index なのだ。数字が大きいほど手前なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_LAYER, text: '重なりの順番を、入れかえてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_ZINDEX, text: 'このゲームでは、こんなふうに数字を割りふっていますのよ。' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ z-index は 1, 2, 10 など", "  ルールを決めて使う", "  （9999 合戦にしない）", "✔ transform や opacity で", "  新しい「重なりのグループ」が", "  できて、外と比べられなくなる"], text: "重なりで困らないためのコツなのだ。" },
      { speaker: '僕', chara: 'metan_smug', text: '「選択肢がメッセージ欄の上に出るのは、4 が 2 より大きいからか」' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_anim: {
    place: { name: 'CSS 06 アニメーション', time: '17:40' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000026',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '最後は、CSS で*動かす*方法なのだ。このゲームの演出は、ほとんど CSS で動いているのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['@keyframes float {', '  0%   { … }', '  50%  { … }', '  100% { … }', '}', '', 'animation: float 2s infinite;'], text: '@keyframes に動きの台本を書いて、animation で「どの台本を、何秒で」と指定しますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_ANIM, text: 'ロゴをふわふわ動かしてみるのだ！ 速さや高さを変えてみるのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_ANIM_TITLE, text: 'タイトル画面の START ボタンを光がなでていくのも、この方法ですの。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'shake', text: '画面が揺れるのも、CSS のアニメーションなのだ！' },
      { speaker: '僕', chara: 'zun_proud', text: '「HTML で中身を書いて、CSS で見た目と動きを付ける」' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 動かすのは transform と", "  opacity が軽い", "  （width や top は重い）", "✔ 動きが苦手な人のために", "  prefers-reduced-motion", "  （このゲームも対応）"], text: "動きを付けるときの、仕事でのコツですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_gentle', fx: 'leak', speed: 'slow', text: 'それがわかれば、どんな画面だって作れるのだ。' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  // ===================================================================
  // Web のしくみ編
  // ===================================================================


  lesson_http: {
    place: { name: 'WEB 01 URL とサーバー', time: '17:50' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000031',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'URL を開くと、ページが出てくる。そのあいだに何が起きているか、知ってるのだ？' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_URL, text: 'まずは URL の読み方から。URL は*住所*のようなものですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'http', focus: 'request' }, text: 'ブラウザは、その住所のサーバーに「このファイルください」ってお願いするのだ。これが*リクエスト*なのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'http', focus: 'response' }, text: 'サーバーは「どうぞ」とファイルを返します。これが*レスポンス*ですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'http', focus: 'files' }, text: '届いた HTML を読むと、JavaScript や CSS や画像も必要だってわかるのだ。だから、またリクエストするのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', text: 'このやりとりのお約束が HTTP。https の s は、通信に鍵をかけているという意味ですの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_URL, text: 'URL を部品に分けてみるのだ！' },
      { speaker: '僕', chara: 'zun_smile', text: '「パスを変えると、サーバーの中の別の場所をお願いすることになるのか」' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ GET は取得、POST は作成", "✔ 2xx 成功・4xx 送った側・", "  5xx サーバー側", "✔ https で鍵をかけて通信", "✔ くわしくは HTTP 編へ"], text: "HTTP は、HTTP 編でもっとくわしくやるのだ。ここでは基本だけ覚えるのだ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: 'HTTP は、*HTTP 編*でもっとくわしく話すのだ。キャッシュや Cookie や CORS も、そっちで見るのだ！' },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_devtools: {
    place: { name: 'WEB 02 開発者ツール', time: '17:52' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000032',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'ブラウザには、ページの*裏側をのぞく道具*が入っているのだ。パソコンで F12 キーを押すと開くのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'devtools', focus: 'elements' }, text: 'Elements では、画面の HTML と CSS が見られるのだ。CSS をその場で書きかえて、ためすこともできるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'devtools', focus: 'console' }, text: 'Console には、エラーやログが出ますわ。動かないときは、まずここを見ますの。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_CONSOLE, text: 'console.log と書いておけば、いまの値をのぞけますのよ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'devtools', focus: 'network' }, text: 'Network では、さっきのリクエストとレスポンスが、1つずつ全部見られるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'devtools', focus: 'application' }, text: 'Application では、ブラウザにしまってあるデータが見られるのだ。このゲームのセーブデータも、ここにあるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_SAVE, text: '見たエンディングは、こうやってしまってありますわ。' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ Network で API の", "  リクエストと返事を確認", "✔ Disable cache で", "  キャッシュなしを再現", "✔ 回線を遅くして確かめる", "✔ Lighthouse で", "  速さ・使いやすさを点検"], text: "開発者ツールの、仕事での使いどころですわ。" },
      { speaker: '僕', chara: 'metan_normal', text: '「エンディングの記録が消えないのは、ブラウザにしまってあったからか」' },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_js: {
    place: { name: 'WEB 03 JavaScript', time: '17:54' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000033',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'JavaScript は、ブラウザの中で動く*プログラムの言葉*なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['const name = \'ずんだもん\'  … 変えない値', 'let mochi = 3           … 変える値', '', 'mochi = mochi + 1     … 4 になる'], text: '値に名前を付けてしまっておくのが*変数*。変えないものは const、変えるものは let ですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['const club = [\'ずんだもん\', \'僕\']', 'club.length   … 2', 'club[0]       … \'ずんだもん\'', '', 'const line = { speaker: \'僕\', text: \'…\' }', 'line.speaker  … \'僕\''], text: '[ ] で並べるのが*配列*、{ } で名前と値を組にするのが*オブジェクト*なのだ。セリフ1行も、オブジェクトなのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['function judge(count) {', '  if (count >= 5) {', '    return \'パーティー\'', '  }', '  return \'まだ\'', '}'], text: 'やることをまとめて名前を付けたのが*関数*。if で、条件によって分けられますの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_JS, text: '変数・配列・関数・if を、ぜんぶさわってみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_ENDING, text: 'エンディングの分かれ方も、オブジェクトと関数で書いてありますわ。' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 比べるときは === を使う", "  （== は型を変えて比べる）", "✔ 基本は const、", "  変えるときだけ let", "✔ 待つ処理は async / await", "  → 非同期 JS 編へ", "✔ 失敗しうる処理は try / catch"], text: "JavaScript の、仕事での書き方のコツなのだ。" },
      { speaker: '僕', chara: 'metan_normal', text: '「選んだ番号の並びを、対応表で引いているだけなのか」' },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_dom: {
    place: { name: 'WEB 04 DOM とイベント', time: '17:56' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000034',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'ブラウザは、HTML を読みこむと、それを*木の形のデータ*にして持っているのだ。これを DOM っていうのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: 'dom', text: 'HTML の入れ子が、そのまま木になるのだ。JavaScript からこの木を書きかえると、画面が変わるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', text: 'そして、クリックやキー入力のような「起きたこと」を*イベント*と言いますわ。イベントを待って、何かをするのがプログラムのお仕事ですの。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_VANILLA, text: 'Vue を使わずに書くと、こうなりますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '要素を探して、イベントを待って、自分で書きかえる……。Vue は、このめんどうなところを代わりにやってくれているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_DOM, text: 'イベントにはいろいろな種類があるのだ。ためしてみるのだ！' },
      { speaker: "四国めたん", chara: 'metan_serious', terminal: ["✔ innerHTML や v-html に", "  外から来た文字を入れない", "  → XSS（セキュリティ編へ）", "✔ Vue の {{ }} は", "  自動で無害化される", "✔ 足したイベントは、外す"], text: "DOM をさわるときの、大事な注意ですわ。" },
      { speaker: '僕', chara: 'zun_smile', text: '「@click のほかにも、@mouseenter とか @input とかがあるのか」' },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_storage: {
    place: { name: 'WEB 06 localStorage', time: '17:58' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000035',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'ページを閉じると、ref の中身はぜんぶ消えちゃうのだ。でも、セーブデータは残したいのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['localStorage.setItem(\'名前\', \'中身\')  … しまう', 'localStorage.getItem(\'名前\')         … 読み出す', 'localStorage.removeItem(\'名前\')      … 消す'], text: 'そこで使うのが localStorage。ブラウザの中の、小さな*引き出し*ですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: 'しまえるのは文字だけなのだ。だから配列は、JSON.stringify で文字に変えてからしまうのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_SAVE, text: 'このゲームのセーブも、まさにそのとおりですの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_STORAGE, text: 'キミのメモを、ブラウザにしまってみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_normal', text: 'ただし、引き出しはそのブラウザだけのもの。別のスマホや別のブラウザからは見えませんわ。' },
      { speaker: "四国めたん", chara: 'metan_serious', terminal: ["✔ パスワードやトークン、", "  個人情報を入れない", "  （XSS で読まれる）", "✔ 入るのは 5MB くらいまで", "✔ 中身は利用者が書きかえられる", "  → 信用しすぎない", "✔ sessionStorage は", "  タブを閉じると消える"], text: "localStorage で、やってはいけないことですわ。" },
      { speaker: '僕', chara: 'metan_normal', text: '「だからスマホで遊んだ記録は、パソコンには引きつがれないのか」' },
    ],
    next: 'lesson_menu_webhttp',
  },

  // ===================================================================
  // CSS もっと編
  // ===================================================================


  lesson_units: {
    place: { name: 'CSS+ 01 大きさと色', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000041',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '大きさの書き方は、px だけじゃないのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['px   … 画面の点の数（決まった大きさ）', '%    … 親の箱にくらべて何%か', 'vw   … 画面の横幅の何%か', 'vh   … 画面の高さの何%か', 'em   … 文字の大きさの何倍か', 'rem  … いちばん元の文字の大きさの何倍か'], text: 'よく使う単位はこのあたり。% や vw は、画面の大きさに合わせて変わりますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['#ff7b00                … 赤・緑・青を16進数で', 'rgb(255, 123, 0)       … 0〜255 で', 'rgba(255, 123, 0, 0.5) … さいごは濃さ（0〜1）'], text: '色は、赤・緑・青のまぜ方で書くのだ。rgba の a は、すけぐあいなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_UNITS, text: '単位と色を、変えてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_UNITS, text: 'このゲームでは、こう使い分けていますの。min() や clamp() で、小さすぎず大きすぎずにしていますわ。' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 文字の大きさは rem が", "  おすすめ（ブラウザの", "  文字サイズ設定に合わせる）", "✔ スマホの 100vh は", "  アドレスバーでずれる", "  → 100dvh を使う"], text: "単位のつまずきどころですわ。" },
      { speaker: '僕', chara: 'metan_smug', text: '「スマホでもパソコンでもちょうどいいのは、決まった px だけじゃないからか」' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_pseudo: {
    place: { name: 'CSS+ 03 :hover と ::before', time: '18:02' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000042',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'セレクタに : を付けると、「〜のときだけ」を書けるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: [':hover        … マウスが乗っているとき', ':active       … 押しているとき', ':focus        … 入力中のとき', ':first-child  … 最初の子どものとき'], text: 'これを*疑似クラス*と言いますわ。いちばんよく使うのは :hover ですの。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['::before  … 中身の前に足す', '::after   … 中身のうしろに足す', '', 'content: \'▶ \';  … 足す中身'], text: ':: を2つ付けると、HTML に書いていない飾りを、CSS だけで足せるのだ。これが*疑似要素*なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_PSEUDO, text: 'ボタンに、光るしかけと飾りを付けてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_PSEUDO, text: 'タイトルのロゴがずれて光るのは、::before と ::after で同じ文字を重ねているからですわ。' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ スマホには hover がない", "  → hover だけで大事な情報を", "  出さない", "✔ キーボード操作の枠は", "  :focus-visible で", "  消さずに見やすく"], text: "hover を使うときの注意なのだ。" },
      { speaker: '僕', chara: 'metan_smug', text: '「HTML は1つなのに、文字が3枚重なってたのか」' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_transition: {
    place: { name: 'CSS+ 04 transition', time: '18:04' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000043',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'CSS が変わるとき、ふつうは*一瞬で*切りかわるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['transition: background 0.2s;', '', 'background … 何を', '0.2s       … 何秒かけて'], text: 'transition を書いておくと、そのあいだを*なめらかに*つないでくれますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: 'animation は自分で動き続けるけど、transition は「何かが変わったとき」だけ動くのだ。:hover と相性ばつぐんなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_TRANSITION, text: 'カードを、ふわっと浮かせてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_TRANSITION, text: '選択肢が出るとき、背景がゆっくり暗くなるのも transition ですの。' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ transition: all は避ける", "  （思わぬものまで動く）", "✔ 0.15〜0.3 秒くらいが", "  ちょうどいいことが多い", "✔ will-change は", "  必要なところだけ"], text: "transition のコツですわ。" },
      { speaker: '僕', chara: 'metan_smug', text: '「クラスを1つ付けるだけで、ゆっくり変わるのか」' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_effects: {
    place: { name: 'CSS+ 05 色づくり', time: '18:06' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000044',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'このゲームの雰囲気は、CSS の*色づくり*でかなり変わっているのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['linear-gradient(…)  … グラデーション', 'box-shadow          … 箱の影', 'text-shadow         … 文字の影・光', 'filter              … 写真の加工', 'backdrop-filter     … うしろをぼかす'], text: 'よく使うのは、このあたりですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ['sepia(0.3)        … セピア色に', 'grayscale(1)      … 白黒に', 'hue-rotate(90deg) … 色相をずらす', 'blur(3px)         … ぼかす', 'brightness(0.8)   … 暗く'], text: 'filter は、写真アプリの加工みたいなものなのだ。いくつも並べて組み合わせられるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_EFFECTS, text: '屋上の写真を、加工してみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_EFFECTS, text: 'シーンごとの色味や、メッセージ欄のすりガラスは、こう作っていますの。' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ backdrop-filter と大きな blur は", "  スマホで重い", "✔ 背景と文字の色の差", "  （コントラスト）を十分に", "✔ 画像は webp などで軽く", "  （このゲームも webp）"], text: "色づくりの注意なのだ。" },
      { speaker: '僕', chara: 'metan_smug', text: '「同じ背景の絵でも、filter で夕方っぽくも冷たくもできるのか」' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_grid: {
    place: { name: 'CSS+ 06 grid', time: '18:08' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000045',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'flex は1列に並べるのが得意。*マス目*に並べたいときは grid なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'grid', focus: 'container' }, text: '親に display: grid と書いて、列の数と幅を決めるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'grid', focus: 'col' }, text: '1fr は「残りを等分したうちの1つ」。repeat(3, 1fr) で、同じ幅の列が3つになりますわ。あふれた子どもは、自動で次の行に行きますの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_GRID, text: '列の数を変えてみるのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_GRID, text: 'この授業の目次のカードも、grid ですのよ。' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 1fr はつぶれないことがある", "  → minmax(0, 1fr)", "  （このゲームの目次も）", "✔ auto-fill と minmax で", "  幅に合わせて列の数を自動に"], text: "grid のコツですわ。" },
      { speaker: '僕', chara: 'metan_smug', text: '「記録室のギャラリーみたいに並べるなら、grid が楽そうだ」' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_responsive: {
    place: { name: 'CSS+ 07 スマホ対応', time: '18:10' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000046',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'スマホとパソコンでは、画面の幅がぜんぜんちがうのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'responsive', focus: 'pc' }, text: 'パソコンでは横に2列で並べたいけど……' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'responsive', focus: 'sp' }, text: 'スマホでは、1列にしないとせますぎるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'responsive', focus: 'media' }, text: 'そこで @media。「画面の幅が〇〇px 以下のときだけ、この CSS を使う」と書けますわ。これがレスポンシブですの。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_MEDIA, text: 'この授業の目次も、スマホではカードが2列、授業が1列になりますのよ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_RESPONSIVE, text: '@container を使うと、画面じゃなくて*箱の幅*で変えられるのだ。枠をせまくしてみるのだ！' },
      { speaker: '僕', chara: 'zun_smile', text: '「せまくしたら、ちゃんと縦に並びかわった」' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ スマホを先に作る", "  （モバイルファースト）", "✔ 本物のスマホで確かめる", "✔ タップする所は", "  44px 角くらいの大きさ", "✔ 横向きも確かめる"], text: "スマホ対応のコツなのだ。" },
      { speaker: 'ずんだもん', chara: 'zun_gentle', fx: 'leak', speed: 'slow', text: 'どんな画面で開いても、ちゃんと遊べる。それも、作る人のやさしさなのだ。' },
    ],
    next: 'lesson_menu_htmlcss',
  },

  // ===================================================================
  // TypeScript 編（夜の部室：仕事で使うレベルの話）
  // ===================================================================

  lesson_menu_ts: {
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000000',
    lessonMenu: 'ts', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: "ずんだもん", chara: 'zun_proud', text: "*TypeScript 編*なのだ。仕事のプロジェクトでは、ほとんどこれなのだ。" },
    ],
    choices: TS_MENU,
  },

  lesson_ts_why: {
    place: { name: 'TS 01 なぜ TypeScript', time: '20:00' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000051',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "このゲームは JavaScript で書いてあるのだ。でも、仕事のプロジェクトでは *TypeScript* がよく使われるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "TypeScript は、JavaScript に*型*を足したもの。「この変数には文字が入る」「このオブジェクトにはこの項目がある」と書いておけますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_TS_BUG, text: "同じまちがいでも、気づくタイミングがぜんぜんちがうのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'tscheck', focus: 'tsc' }, text: "型チェックは、*動かす前*にまちがいを見つけてくれるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'tscheck', focus: 'js' }, text: "そして大事なこと。型は、ブラウザで動くときには*消えて*、ふつうの JavaScript になりますわ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'tscheck', focus: 'browser' }, text: "だから、型チェックに通っても「実行時に来たデータが正しい」保証にはなりません。そこは別に確かめる必要がありますの。" },
      { speaker: "ずんだもん", chara: 'zun_smile', text: "エディタの補完がよく効くのも大きいのだ。項目の名前を覚えていなくても、候補が出てくるのだ。" },
      { speaker: "僕", chara: 'zun_smile', text: "「人が多くて、コードが大きいほど効いてくるわけか」" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ 型エラーが残ったまま出さない", "  （CI で止める）", "✔ any で黙らせない", "✔ 型は実行時には消える", "  → 外から来るデータは確かめる"], text: "仕事での心得なのだ。" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_types: {
    place: { name: 'TS 02 型のきほん', time: '20:02' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000052',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["let title: string = '放課後'", "let count: number = 0", "let done: boolean = false", "let club: string[] = []", "let bg: string | null = null"], text: "まずは基本の型なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_TS_SCENE, text: "オブジェクトの形は、interface か type で名前を付けて書きますわ。このゲームのデータなら、こうですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "| でつなぐと「このうちのどれか」になるのだ。*union 型*っていうのだ。ありえる値を全部書いておけるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_UNION, text: "fx に打ちまちがいがあれば、すぐにエラーになりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "? を付けた項目は「なくてもよい」なのだ。あるかないかわからないから、使うときは確かめる必要があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "interface と type はほとんど同じことができます。どちらを使うかは、チームでそろえるのが一番ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「データの形を先に決めておけば、書く人がちがっても形がそろうのか」" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_func: {
    place: { name: 'TS 03 関数と any', time: '20:04' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000053',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_TS_FUNC, text: "関数には、引数と戻り値に型を付けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "全部に型を書く必要はありませんわ。TypeScript は、かなりの部分を*推論*してくれますの。関数の引数や、外に見せる部分に書けば十分ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "<T> は*ジェネリクス*なのだ。「中身の型は、使うときに決める」っていう書き方なのだ。配列や Promise でいつも使われているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_ANY, text: "そして、いちばん大事な注意。any は使わないこと。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "any にすると、そこから先は型チェックが止まるのだ。型エラーを消したいからって any にするのは、警報器の電池を抜くようなものなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "as で「この型だ」と決めつけるのも同じですわ。わからないものは unknown で受けて、確かめてから使いますの。" },
      { speaker: "僕", chara: 'metan_normal', text: "「エラーを消すんじゃなくて、エラーの原因を直すのか」" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_vue: {
    place: { name: 'TS 06 Vue と TypeScript', time: '20:06' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000054',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "Vue でも TypeScript が使えるのだ。<script setup lang=\"ts\"> と書くだけなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_TS_VUE, text: "props と emit は、型の書き方で定義できますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "ref や computed は、中身から型を推論してくれるのだ。最初が null のときは ref<Scene | null>(null) みたいに書くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_PROPS_ERR, text: "部品を使う側のまちがいも、見つけてくれますのよ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "ただし、.vue ファイルの template までチェックするには、tsc じゃなくて *vue-tsc* を使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "Pinia のストアも、state の初期値から型が付きますわ。決まった文字しか入らない値は、型を書いておくと安心ですの。" },
      { speaker: "僕", chara: 'metan_normal', text: "「props を渡し忘れても、動かす前に教えてくれるのか」" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_data: {
    place: { name: 'TS 07 外から来るデータ', time: '20:08' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000055',
    lines: [
      { speaker: "四国めたん", chara: 'metan_normal', text: "TypeScript の型が守れるのは、*自分のコードの中*だけですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "サーバーから来たデータ、localStorage の中身、URL のパラメータ……。外から来るものは、実行してみるまで何が入っているかわからないのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_FETCH, text: "as で決めつけず、中身を確かめてから使いますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "確かめる関数を毎回書くのは大変なので、仕事では *zod* みたいなライブラリで「形」を書いて、まとめて確かめることが多いのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_TS_NULL, text: "もう1つの落とし穴が、null と undefined ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "strict にしておけば、「null かもしれない」を見のがさないのだ。?. と ?? で、短く安全に書けるのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「本番でよく見る『undefined を読めません』みたいなエラーが、だいぶ減りそうだ」" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_config: {
    place: { name: 'TS 08 tsconfig と運用', time: '20:10' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000056',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_TSCONFIG, text: "型チェックのきびしさは、tsconfig.json で決めるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "新しく始めるなら、strict: true が基本。あとからきびしくするのは、とても大変ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "それから、意外な落とし穴があるのだ。*Vite はビルドのときに型チェックをしない*のだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_SCRIPTS, text: "Vite は型を消して変換するだけ。型エラーがあっても、ビルドは通ってしまいますの。だから自分でチェックを入れますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "プルリクエストのたびに、CI で npm run typecheck を動かしておくのだ。型エラーがあったら、マージできないようにするのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "型がないライブラリには @types/〇〇 を入れます。// @ts-ignore でエラーを消すのは、最後の最後の手段ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「ビルドが通ったから大丈夫、とは限らないのか」" },
    ],
    next: 'lesson_menu_ts',
  },

  // ===================================================================
  // AWS 編（夜の部室：仕事で使うレベルの話）
  // ===================================================================

  lesson_menu_aws: {
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000000',
    lessonMenu: 'aws', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: "四国めたん", chara: 'metan_smug', text: "*AWS 編*ですわ。仕事で知っておいてほしい、主なサービスと認証のお話ですの。" },
    ],
    choices: AWS_MENU,
  },

  lesson_aws_overview: {
    place: { name: 'AWS 01 全体像', time: '20:20' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000061',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "AWS は、Amazon が貸し出している*クラウド*なのだ。サーバーもデータベースも、使った分だけお金を払って借りられるのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'region', focus: 'region' }, text: "AWS は世界中に*リージョン*を持っているのだ。日本なら東京（ap-northeast-1）と大阪（ap-northeast-3）なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'region', focus: 'az' }, text: "リージョンの中には、はなれた場所にあるデータセンターのまとまり、*AZ（アベイラビリティゾーン）*がいくつもありますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'region', focus: 'app' }, text: "大事なシステムは、2つ以上の AZ に分けて置くのだ。1つの AZ が止まっても、ほかで動き続けられるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'responsibility', text: "そして*責任共有モデル*。AWS が守るのは建物や機械まで。設定のまちがいで情報がもれたら、それは使う側の責任ですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'responsibility', focus: 'you' }, text: "線の上が使う側の仕事なのだ。EC2 なら OS の更新も使う側。Lambda なら OS は AWS の仕事になるのだ。サービスによって、線の高さが変わるのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 基本は使った分だけ払う", "✔ 止め忘れ・消し忘れに注意", "✔ 最初に Budgets で予算の通知", "✔ 本番と開発でアカウントを分ける"], text: "お金のこともこわいのだ。止め忘れたサーバーは、だれも使っていなくても課金され続けるのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「借りるのは簡単だけど、設定の責任はこっちにあるのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_authbasics: {
    place: { name: 'AWS 02 認証のきほん', time: '20:21' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000069',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "IAM や Cognito の話に入る前に、*認証*そのものを整理しておくのだ。ここがわかると、AWS の話がぐっと楽になるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'authnz', text: "まず、よく似た2つの言葉。*認証*と*認可*ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'authnz', focus: 'authn' }, text: "*認証*は「あなたはだれ？」を確かめることなのだ。会社の入口で、社員証を見せるのと同じなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'authnz', focus: 'authz' }, text: "*認可*は「その人は何をしてよいか」を決めること。社員でも、入れるフロアは人によってちがいますわね。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'authnz', focus: 'room' }, text: "順番は、いつも認証が先なのだ。だれかわからないと、何を許すかも決められないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "英語では Authentication と Authorization。略して AuthN・AuthZ と書くこともありますわ。エラーの 401 は認証の失敗、403 は認可の失敗ですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["① 知っているもの", "   パスワード・暗証番号", "② 持っているもの", "   スマホのアプリ・セキュリティキー", "③ 本人そのもの", "   指紋・顔", "", "MFA … 2種類以上を組み合わせる"], text: "本人かどうかを確かめる方法は、3種類あるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "パスワードだけだと、もれたら終わり。スマホのアプリの6桁の数字のような「持っているもの」を足すのが *MFA* ですわ。AWS では必ず設定しますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'ticket', focus: 'login' }, text: "それから、ログインするたびにパスワードを送るのはあぶないし、めんどうなのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'ticket', focus: 'badge' }, text: "だから、一度ログインしたら*入館証*をもらうのだ。これが*トークン*（やセッション）なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'ticket', focus: 'api' }, text: "あとは、入館証を見せるだけで通れますわ。入館証には*期限*があって、切れたらもう一度もらい直しますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "入館証を盗まれたら、期限が切れるまで、なりすまされてしまうのだ！ だから期限は短めにするのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'authtwo', text: "そしてもう1つ大事なこと。AWS の話には、*2種類の認証*が出てきますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'authtwo', focus: 'aws' }, text: "1つは、*AWS を操作する側*。開発者や GitHub Actions、AWS の上で動くプログラムが、AWS の機能を使うための認証なのだ。これは IAM の担当なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'authtwo', focus: 'app' }, text: "もう1つは、*アプリを使う側*。このゲームのプレイヤーのような、お客さんのログインですわ。こちらは Cognito などの担当ですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "このふたつをまぜて考えると、わけがわからなくなるのだ。「いま、だれが、何にログインする話か」をいつも意識するのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'keylife', text: "AWS を操作するための鍵にも、寿命のちがうものがありますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'keylife', focus: 'temp' }, text: "期限のない鍵は、もれたら消すまで使われ放題なのだ。数時間で切れる鍵なら、被害は短くてすむのだ。だから、なるべく一時的な鍵を使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["認証 AuthN  … だれかを確かめる", "認可 AuthZ  … 何をしてよいか決める", "MFA        … 2種類以上で確かめる", "トークン   … ログイン後の入館証", "IdP        … 本人確認をする係", "SSO        … 1回のログインで色々使う", "OAuth 2.0  … 権限を貸すしくみ", "OIDC       … OAuth にログインを足したもの"], text: "最後に、よく出てくる言葉をまとめておきますわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「だれか確かめて、入館証をわたして、入館証で何をしてよいか決める……。AWS も Cognito も、同じ形なのか」" },
      { speaker: "ずんだもん", chara: 'zun_smile', text: "そのとおりなのだ！ この形がわかっていれば、このあとの IAM と Cognito の話がすっと入るのだ。" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_iam: {
    place: { name: 'AWS 03 IAM', time: '20:22' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000062',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "AWS で一番大事なのが *IAM（アイアム）*なのだ。「だれが・何をしてよいか」を決めるしくみなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["ルートユーザー", "  アカウントを作ったメールアドレス", "  なんでもできる", "", "✔ MFA（2段階認証）を必ず設定", "✔ ふだんは使わない", "✔ アクセスキーを作らない"], text: "アカウントを作ったときの*ルートユーザー*は、請求も解約も、なんでもできてしまう特別な存在ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'iam', focus: 'user' }, text: "ふだん使う人には、別のユーザーを用意するのだ。会社では、あとで話す SSO でログインすることが多いのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'iam', focus: 'group' }, text: "ひとりずつ権限を付けると、管理しきれなくなるのだ。グループにまとめて付けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'iam', focus: 'role' }, text: "*ロール*は、一時的に借りる権限。EC2 や Lambda のようなサービスや、GitHub Actions のような外のしくみが、必要なときだけ借りますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'iam', focus: 'policy' }, text: "権限の中身は、*ポリシー*という JSON に書くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_IAM_POLICY, text: "たとえば、デプロイに必要なことだけを許可すると、こうなりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: 'policyeval', text: "*最小権限*が大原則なのだ。「とりあえず AdministratorAccess」は、事故のもとなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'policyeval', focus: 'deny' }, text: "AWS は、リクエストのたびにこの順番で判定しますわ。まず、拒否（Deny）に当たるものがあれば、ほかに何が書いてあっても拒否。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'policyeval', focus: 'allow' }, text: "次に、許可（Allow）に当たるものがあれば許可なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'policyeval', focus: 'implicit' }, text: "そして、どちらにも当たらなければ*拒否*。書いていないことは、できないのが基本ですの。" },
      { speaker: "僕", chara: 'zun_proud', text: "「できることを最初から絞っておけば、まちがえても被害が小さくてすむのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_creds: {
    place: { name: 'AWS 04 認証情報', time: '20:24' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000063',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "プログラムやコマンドから AWS を使うには、*認証情報（鍵）*が必要なのだ。ここでの事故が、とても多いのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["アクセスキー（長く使える鍵）", "  AKIA… で始まる ID と、秘密のキー", "", "✔ GitHub に push しない", "✔ コードや .env に書かない", "✔ できれば作らない"], text: "IAM ユーザーのアクセスキーは、期限のない合鍵ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'keylife', focus: 'key' }, fx: "shake", text: "公開リポジトリに鍵を push すると、数分で見つけられて、勝手にサーバーを立てられることもあるのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_SSO, text: "だから人が使うときは、IAM Identity Center（SSO）でログインして、*一時的な鍵*をもらいますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'sso', focus: 's1' }, text: "流れを図にすると、こうなるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'sso', focus: 's2' }, text: "ブラウザで会社のアカウントにログインして、MFA を通します。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'sso', focus: 's3' }, text: "すると、数時間で切れる鍵が手元に届くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'sso', focus: 's4' }, text: "その鍵で、開発用や本番用のアカウントを操作しますの。切れたら、またログインするだけですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'oidc', focus: 'gha' }, text: "CI からデプロイするときも、鍵を GitHub にしまわなくていいのだ。*OIDC* を使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'oidc', focus: 'role' }, text: "GitHub が発行するトークンを AWS が確かめて、ロールを貸してくれますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'oidc', focus: 'creds' }, text: "もらえるのは、1時間ほどで切れる鍵なのだ。もれても、すぐに使えなくなるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TRUST, text: "どのリポジトリの、どのブランチに貸すかは、ロールの信頼ポリシーで決めますの。ここをゆるくすると、他人のリポジトリからも借りられてしまいますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'secrets', text: "アプリが使うパスワードや API キーは、*Secrets Manager* や *Parameter Store* にしまって、動くときに読み出すのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'secrets', focus: 'read' }, text: "コードには、パスワードそのものを書きません。Lambda は、自分のロールの権限で Secrets Manager から読み出しますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'secrets', focus: 'connect' }, text: "受け取ったパスワードで、データベースにつなぐのだ。パスワードを変えるときも、コードはそのままでいいのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["鍵がもれたら", "1. すぐに無効化して削除", "2. CloudTrail で使われた操作を確認", "3. 作られたリソースを消す", "4. 請求を確認・上の人に報告"], text: "もし鍵がもれてしまったら、かくさずに、すぐに動くこと。" },
      { speaker: "僕", chara: 'metan_normal', text: "「長く使える鍵を、そもそも持たないのが一番なのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_static: {
    place: { name: 'AWS 05 このゲームを公開', time: '20:26' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000064',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "このゲームを AWS で公開するなら、どうするか考えてみるのだ。ビルドした dist は、ただのファイルなのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'staticsite', focus: 's3' }, text: "ファイルは *S3* に置くのだ。S3 は、ファイルをしまっておく、ものすごく丈夫な倉庫なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'staticsite', focus: 'cf' }, text: "その前に *CloudFront* を置きます。世界中の近い場所から配ってくれる CDN で、HTTPS もここで受けますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'staticsite', focus: 'r53' }, text: "*ACM* で無料の SSL 証明書をもらって、*Route 53* で自分のドメインを CloudFront に向けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_BUCKET_POLICY, text: "S3 は*公開しない*のが今の作法。OAC を使って、CloudFront からだけ読めるようにしますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "ここで落とし穴なのだ！ このゲームは Vue Router で /game みたいな URL を使っているのだ。でも S3 には game というファイルはないのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'spa', focus: 'r2' }, text: "ブラウザが /game をお願いすると、CloudFront はそのまま S3 に取りに行くのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'spa', focus: 'r3' }, text: "でも S3 に game というファイルはないので、403 が返ってきますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'spa', focus: 'r4' }, text: "そこで CloudFront が、エラーのかわりに index.html を返すのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'spa', focus: 'router' }, text: "index.html が読みこまれたら、Vue Router が URL の /game を見て、ゲーム画面を出しますの。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_CDK_SITE, text: "この設定は、コードで書くとこうなりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_DEPLOY, text: "デプロイは GitHub Actions で自動にするのだ。OIDC でロールを借りるから、鍵はいらないのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'cache', focus: 'cf' }, text: "キャッシュの考え方も大事なのだ。CloudFront は、近くの場所にファイルのコピーを持っていて、そこから配るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'cache', focus: 'assets' }, text: "assets のファイルは、中身が変わると名前も変わります。だから1年キャッシュしても困りませんの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'cache', focus: 'index' }, text: "でも index.html は名前が変わらないのだ。キャッシュされると、古いゲームが出てしまうのだ。だから毎回確かめさせるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["✔ CloudFront 用の証明書は", "  us-east-1（バージニア）で作る", "✔ assets は長くキャッシュ", "  （名前が毎回変わるから）", "✔ index.html はキャッシュさせない", "✔ S3 のパブリックアクセスはブロック"], text: "覚えておくと得をするポイントですわ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「ファイルを置くだけかと思ったら、キャッシュと URL の設定が大事なのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_compute: {
    place: { name: 'AWS 06 サーバーとサーバーレス', time: '20:28' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000065',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'compute', focus: 'axis' }, text: "プログラムを動かす場所の借り方は、大きく3つあるのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'compute', focus: 'ec2' }, text: "*EC2* は、仮想のサーバーを1台まるごと借りるのだ。なんでもできるけど、OS の更新やセキュリティ対策も自分の仕事なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'compute', focus: 'ecs' }, text: "*ECS / Fargate* は、Docker のコンテナを動かすサービス。サーバーの管理は AWS にまかせて、アプリだけ用意しますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'compute', focus: 'lambda' }, text: "*Lambda* は、関数を1つ置いておくだけなのだ。呼ばれたときだけ動いて、動いた時間だけお金がかかるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'serverless', playground: CV_LAMBDA, text: "Lambda の関数は、こんなに短く書けますのよ。前に *API Gateway* を置けば、URL から呼べる API になりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'serverless', focus: 'lambda' }, text: "つなげると、こんな形になるのだ。API Gateway が URL の入口、Lambda が処理、DynamoDB が保存なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'serverless', focus: 'logs' }, text: "Lambda の console.log は、自動で CloudWatch Logs に残りますわ。動かないときは、まずここを見ますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "でも Lambda には向き不向きがあるのだ。1回で動けるのは最大15分なのだ。しばらく呼ばれないと、最初の1回が少し遅くなるのだ（コールドスタート）。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["迷ったら", "  API・ちょっとした処理 → Lambda", "  ずっと動く Web アプリ → ECS Fargate", "  特別な事情がある → EC2", "", "✔ 止め忘れた EC2 は課金され続ける"], text: "迷ったときの目安ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「自由がほしいか、管理を楽にしたいかで選ぶのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_data: {
    place: { name: 'AWS 07 データベースとネットワーク', time: '20:30' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000066',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["RDS / Aurora", "  いつもの SQL データベース", "  （MySQL・PostgreSQL）", "DynamoDB", "  キーで引く NoSQL・サーバーレス", "S3", "  ファイル・画像・ログ"], text: "データをしまう場所も、使い分けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_DYNAMO, text: "このゲームのセーブを、DynamoDB に置くならこうなりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "ユーザー ID を、送られてきた値じゃなくて*ログインのトークン*から取っているところが大事なのだ。送られてきた値は、いくらでもいじれるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'dynamokey', focus: 'pk' }, text: "DynamoDB は「どう読むか」を先に決めて、キーを設計しますの。あとから自由に検索するのは苦手ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'dynamokey', focus: 'sk' }, text: "パーティションキーで「だれのデータか」、ソートキーで「その中のどれか」を決めるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'dynamokey', focus: 'query' }, text: "「この人のエンディング一覧」はすぐ読めます。でも「全員の TRUE END を探す」のは、このキーでは苦手。読み方が決まってから設計しますのよ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'vpc', focus: 'vpc' }, text: "サーバーやデータベースは、*VPC* という自分専用のネットワークの中に置くのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'vpc', focus: 'public' }, text: "インターネットとつながるのは、入口の*パブリックサブネット*だけ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'vpc', focus: 'db' }, text: "データベースは、外から入れない*プライベートサブネット*に置くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_SG, text: "どこからの通信を受け入れるかは、*セキュリティグループ*で絞りますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: 'sgchain', text: "図にすると、入口から奥へ、通れる相手を1段ずつ絞っているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'sgchain', focus: 'blocked' }, text: "インターネットから、データベースに直接はとどきません。もし入口がやられても、奥までは入りにくくなりますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ DB をインターネットに出さない", "✔ 自動バックアップと削除保護", "✔ NAT Gateway は意外と高い", "✔ SG は「どこから」を絞る"], text: "仕事で気をつけたいところなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「入口から奥へ、段階的に通れる相手を絞っていくのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_auth: {
    place: { name: 'AWS 08 アプリのログイン', time: '20:32' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000067',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "IAM は「AWS を操作する人」のためのしくみなのだ。アプリを使う*お客さん*のログインは、別のしくみなのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'authflow', focus: 'cognito' }, text: "*Cognito* を使うと、ユーザーの登録やログイン、パスワードの管理をまかせられるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'authflow', focus: 'jwt' }, text: "ログインすると、*JWT* というトークンがもらえますわ。署名のついた JSON で、期限がありますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'loginflow', focus: 'l1' }, text: "流れを順番に見るのだ。まず、ID とパスワード（と MFA）を Cognito に送るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'loginflow', focus: 'l2' }, text: "合っていれば、Cognito がトークンを3つくれますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["ID トークン", "  だれか（名前・メール）", "アクセストークン", "  API を呼ぶための入館証", "リフレッシュトークン", "  入館証をもらい直す券（長め）"], text: "3つのトークンは、役目がちがうのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'loginflow', focus: 'l3' }, text: "API を呼ぶときは、*アクセストークン*をヘッダーに付けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'loginflow', focus: 'l5' }, text: "アクセストークンは1時間ほどで切れます。切れたら、リフレッシュトークンで新しいものをもらいますの。パスワードを入れ直さなくていいのは、このおかげですわ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'jwt', playground: CV_JWT, text: "JWT は、ピリオドで区切られた3つの部分でできていますの。まん中の中身は、だいたいこんな感じですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'jwt', focus: 'payload' }, fx: "shake", text: "JWT の中身は、*だれでも読める*のだ！ 暗号化じゃなくて署名だから、いじられていないことはわかるけど、秘密の情報は入れちゃだめなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'authflow', focus: 'api' }, text: "API を呼ぶときは、ヘッダーにトークンを付けます。API Gateway がトークンを確かめて、合格したものだけを Lambda に通しますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'verify', focus: 'c1' }, text: "API Gateway は、トークンをこの順番で確かめるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'verify', focus: 'c2' }, text: "期限が切れていないか。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'verify', focus: 'c3' }, text: "自分たちの Cognito が、このアプリ向けに出したものか。ちがうところで出したトークンは通さないのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'verify', focus: 'ok' }, text: "全部通ったら Lambda へ。だめなら 401 で追い返しますの。Lambda に届いた時点で、だれからのリクエストかは確かになっていますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "「Google でログイン」みたいなしくみは、*OAuth 2.0* と *OpenID Connect* なのだ。Cognito は、これにも対応しているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["✔ パスワードを自分で保存しない", "✔ トークンの期限と更新を考える", "✔ localStorage のトークンは", "  XSS で盗まれうる", "✔ 権限のチェックは", "  必ずサーバー側でも"], text: "仕事で気をつけたいところですわ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「画面でボタンを隠しても、API を直接呼ばれたら意味がないのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_aws_ops: {
    place: { name: 'AWS 09 監視・監査・コスト', time: '20:34' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000068',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "作って終わりじゃないのだ。動かし続けるための道具も大事なのだ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'ops', focus: 'cw' }, text: "*CloudWatch* は、ログと数値を集めて、おかしいときに知らせてくれるのだ。Lambda のログも、ここに出るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'alarm', focus: 'alarm' }, text: "たとえば「5分で5回以上エラーが出たら知らせる」というアラームを作っておきますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'alarm', focus: 'notify' }, text: "人がずっと画面を見張らなくても、Slack やメールで教えてくれるのだ。だれが見るかも決めておくのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'ops', focus: 'ct' }, text: "*CloudTrail* は、AWS への操作を記録します。「だれが・いつ・何をしたか」がわかるので、事故のときの手がかりになりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'ops', focus: 'budgets' }, text: "*Budgets* で予算を決めて、こえそうになったらメールで知らせてもらうのだ。アカウントを作ったら、最初にやるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'ops', focus: 'iac' }, text: "そして仕事では、コンソールでぽちぽち作りません。設定を*コード*で書いて管理しますの。これを IaC と言いますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'iacflow', focus: 'ci' }, text: "コードを書いて、プルリクエストでレビューして、CI が自動で AWS に反映するのだ。アプリのコードと同じ流れなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'iacflow', focus: 'manual' }, text: "コンソールでの手作業は、記録が残らず、同じものを作り直せません。本番では特に、手で変えないのが鉄則ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "コードにしておけば、レビューもできるし、同じものを何度でも作れるのだ。さっきの CDK のコードも IaC なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ ログの保存期間を決める", "  （ずっと残すとお金がかかる）", "✔ タグで「だれの・何の」を管理", "✔ 本番を手作業で変えない", "✔ アラームの通知先を決めておく"], text: "運用で気をつけたいところですわ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', text: "AWS のサービスは200以上あるけど、まずはここまでを押さえれば、仕事の会話についていけるのだ！" },
      { speaker: "僕", chara: 'zun_smile', text: "「全部覚えなくても、地図があれば迷わずにすみそうだ」" },
    ],
    next: 'lesson_menu_aws',
  },

  // ===================================================================
  // 演出編（説明しながら、本物の演出を動かして見せる）
  // ===================================================================

  lesson_menu_fx: {
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'fx', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_proud', text: '*演出のひみつ編*なのだ！ 説明しながら、本物の演出を動かして見せるのだ。' },
    ],
    choices: FX_MENU,
  },

  lesson_fx_text: {
    chapter: { no: 'FX', title: '演出のひみつ', sub: "DIRECTOR'S NOTE" },
    place: { name: 'FX 01 文字の「間」', time: '17:00' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000071',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_proud', fx: "burst", text: "ここからは、このゲームの*演出*の話なのだ。しかも、説明しながら本当に動かしてみせるのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'typing', focus: 'char' }, text: "まずは文字の出し方から。セリフは1文字ずつ出ていますわね。でも、速さはいつも同じではありませんの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'typing', focus: 'g160' }, text: "読点「、」のあとは少し長く、句点「。」のあとはもっと長く止まるのだ。人が話すときの、息つぎと同じなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_FX_PAUSE, text: "コードは、たったこれだけですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'typing', focus: 'beat' }, text: "セリフの前に、何も起きない時間を作ることもできるのだ。これが beat なのだ。次のセリフで、やってみるのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', beat: 1800, speed: "slow", text: "…………これが、1.8秒の沈黙と、ゆっくりの文字。大事な言葉の前には、こうして「間」を作りますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "speed: 'slow' にすると、1文字ずつの待ち時間が2.6倍になるのだ。本編では、70回以上も使っているのだ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', text: "本文に記号を書くと、*光る強調*や、~ふるえる文字~も出せるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_FX_RICH, text: "しくみは単純。* や ~ が来たら飾りを始めて、もう一度来たら終わりにしますの。" },
      { speaker: "僕", chara: 'metan_normal', text: "「同じセリフでも、間の取り方で重さがぜんぜんちがう」" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ 間は、大事な言葉の前にだけ", "✔ 全部を slow にすると", "  ただ遅いだけになる", "✔ クリックで全文を出せるように", "  （待たせすぎない）"], text: "使い方のコツなのだ。" },
    ],
    next: 'lesson_menu_fx',
  },

  lesson_fx_chara: {
    place: { name: 'FX 02 立ち絵の芝居', time: '17:02' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000072',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_smile', text: "ボクの顔を、よーく見るのだ。ときどき*まばたき*しているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_FX_SPRITE, text: "しゃべっているあいだは、口も動いていますわ。これは3枚の絵を重ねて、切りかえていますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "画像を差しかえると一瞬チカッとするから、3枚とも重ねておいて、見せる絵だけ透明度を1にしているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_FX_BLINK, text: "まばたきは2〜6秒に1回。ときどき2回続けますの。きっちり同じ間隔だと、ロボットのように見えてしまいますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "口パクも、0.095秒ごとに8割の確率で開け閉めしているのだ。わざとバラバラにして、自然に見せているのだ。" },
      { speaker: "ずんだもん", chara: 'zun_gentle', echo: true, text: "そしてこれが*残響*。echo: true を付けると、透けて光るのだ。" },
      { speaker: "", chara: 'zun_gentle', echo: true, text: "（残響：明るさを上げて、色をうすくして、青白い光をまとわせ、ゆっくり点滅させている）" },
      { speaker: "ずんだもん", chara: null, ghost: "zun_normal", speed: "slow", text: "こっちは*不在のカット*なのだ。キャラはいないのに、残像だけがうっすら見えるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "さびしさを伝えるための技ですわ。白黒にして、ぼかして、5秒かけて現れては消えますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'looklayers', focus: 'grade' }, text: "キャラを背景になじませるのも大事なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'looklayers', focus: 'post' }, text: "背景と立ち絵をまとめて色調補正して、その上から周りを暗くして、走査線とフィルムのざらつきを重ねていますの。だから別々の絵なのに、同じ場所にいるように見えますわ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「止まった絵なのに、生きているように見えるのは、細かい動きの積み重ねなのか」" },
    ],
    next: 'lesson_menu_fx',
  },

  lesson_fx_camera: {
    place: { name: 'FX 03 カメラワーク', time: '17:04' },
    bg: 'roof_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000073',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'stage3d', text: "この画面は、じつは*3D の舞台*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'stage3d', focus: 'bg' }, text: "背景は奥に、立ち絵はまん中に、光の玉は手前に。CSS の translateZ で、本当に奥行きを付けて並べていますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'stage3d', focus: 'eye' }, text: "perspective は、カメラがどれだけはなれているかなのだ。マウスを動かすと舞台が少し回って、奥の背景ほど動きが小さいのだ。パソコンなら、ためしてみるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_FX_STAGE, text: "コードではこうですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', camera: "close", text: "ここからはカメラワークなのだ。camera: 'close' で寄るのだ。背景がぼけて、ピントが合ったみたいになるのだ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', camera: "dutch", text: "'dutch' は、カメラを傾けるのだ。不安な気持ちの場面で使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', camera: "pan", text: "'pan' は、横にゆっくり流しますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', camera: "orbit", text: "ここからが 3D の技なのだ。'orbit' は、カメラが回りこむのだ。手前のボクはほとんど動かないのに、背景が回るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', camera: "crane", text: "'crane' は、上から降りてくるクレーンの撮影ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_sad', camera: "vertigo", beat: 600, speed: "slow", text: "……そしてこれが*めまいショット*。ボクの大きさは変わらないのに、背景だけが遠のいていくのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', playground: CV_FX_VERTIGO, text: "perspective を 2600px から 420px へ変えていますの。奥行き 0 の立ち絵は大きさが変わらず、奥の背景だけが引きのばされますわ。映画で有名な技ですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', handheld: true, text: "handheld: true にすると、手持ちカメラみたいに、ずっと少しだけ揺れるのだ。緊張する場面で使うのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「カメラを動かすだけで、気持ちまで変わって見える」" },
    ],
    next: 'lesson_menu_fx',
  },

  lesson_fx_cutin: {
    place: { name: 'FX 04 カットイン', time: '17:06' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000074',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_proud', cutin: 'eyes', text: "カットインなのだ！ 目のアップが、帯になって飛びこんでくるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'cutinmath', focus: 'eyes' }, text: "あのアップは、別の絵ではありませんわ。いつもの立ち絵をものすごく大きくして、目の位置に合わせてずらしていますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'cutinmath', focus: 'formula' }, text: "だから、アップの中でもまばたきや口パクがそのまま動くのだ。目の位置は、表情ごとに faces.js に書いてあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_FX_CUTIN, text: "計算はこうですわ。目の幅が帯に合うように拡大して、目が帯のまん中に来るようにずらしますの。" },
      { speaker: "ずんだもん", chara: 'zun_smile', cutin: 'face', text: "'face' は顔のアップなのだ。しゃべると、アップの中でも口が動くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', cutin: { type: 'split', left: { chara: 'zun_proud' }, right: { chara: 'metan_smug' } }, text: "左右に2人の目を並べることもできますわ。ななめの線で切り分けますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', cutin: { type: 'diagonal' }, text: "ななめの帯なのだ！" },
      { speaker: "四国めたん", chara: 'metan_serious', cutin: { type: 'triptych' }, speed: "slow", text: "縦3本で、左目・口・右目。いちばん大事な場面で使う、決めのカットですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "帯は、ぶれながら飛びこんで、そのあとゆっくり寄っていくのだ。止まった絵なのに、カメラが動いているように見えるのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「同じ立ち絵1枚から、何通りものアップが作れるのか」" },
    ],
    next: 'lesson_menu_fx',
  },

  lesson_fx_color: {
    place: { name: 'FX 05 色と光', time: '17:08' },
    bg: 'roof_day',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000075',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "このゲームの絵は、写真アプリみたいに*色を加工*しているのだ。まずは、何もしていない状態なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', grade: "warm", text: "'warm'。セピアを少し足して、夕方のような、なつかしい色に。" },
      { speaker: "ずんだもん", chara: 'zun_proud', grade: "teal", text: "'teal' は、映画っぽい青緑なのだ。" },
      { speaker: "四国めたん", chara: 'metan_sad', grade: "cold", text: "'cold'。色をうすく、青く、暗く。さびしい場面の色ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', grade: "bleach", text: "'bleach' は、色がほとんど抜けるのだ。記憶や、現実感のない場面に使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_FX_GRADE, text: "どれも CSS の filter を組み合わせただけ。2秒かけて変わるので、場面が変わっても色がなめらかにつながりますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', scope: true, text: "それから、映画の*黒帯*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', scope: "wide", speed: "slow", text: "感情の山場では、さらに広がりますわ。画面が横長になると、それだけで「特別な場面」に見えますの。" },
      { speaker: "ずんだもん", chara: 'zun_smile', light: "sunset", text: "光の筋も足せるのだ。ぼかした光の帯を、screen という合成で重ねているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', fx: "leak", text: "そしてこれが光漏れ。フィルムに光が入ったような、あたたかい色のにじみですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', ambient: "rain", text: "空気の粒も変えられるのだ。いまは雨なのだ。Canvas に線を260本描いて、毎フレーム動かしているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', ambient: "stars", playground: CV_FX_AMBIENT, text: "ほこり・星・残響の粒は、明るさを sin でゆらして、またたいて見せていますの。" },
      { speaker: "僕", chara: 'metan_smug', text: "「同じ屋上なのに、色と光だけで、昼にも夢の中にも見える」" },
    ],
    next: 'lesson_menu_fx',
  },

  lesson_fx_screen: {
    place: { name: 'FX 06 画面効果', time: '17:10' },
    bg: 'hallway_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000076',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "画面そのものをゆさぶる効果もあるのだ。いくのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', fx: "flash", text: "フラッシュ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', fx: "burst", text: "集中線なのだ！ Canvas に細い三角を110本描いて、0.07秒ごとに描き直しているのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', fx: "shockwave", text: "衝撃波。画面そのものが、波紋のようにゆがみますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "glitch", text: "グリッチなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_FX_RGB, text: "グリッチの色ずれは、SVG のフィルター。赤・緑・青を別々に取り出して、赤を左に、青を右にずらして重ねていますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', fx: "zoom", text: "クラッシュズーム！ 一気に寄るのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', fx: "whip", text: "ホイップパン。カメラを素早く振ったみたいに、ぶれて流れるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', fx: "rack", text: "ピント送り。手前から奥へ、ピントが移りますの。" },
      { speaker: "ずんだもん", chara: 'zun_gentle', fx: "rewrite", text: "そしてこれが、世界の書きかえなのだ。光の線が通ったところから、世界の色が変わるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'fxflow', text: "しくみはどれも同じですわ。セリフの fx を見て、画面にクラスを付けて、CSS のアニメーションを動かして、時間がたったら外しますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_FX_TABLE, text: "効果ごとの長さと、いっしょに鳴らす音の表なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_FX_SHOCK, text: "衝撃波だけは特別。Canvas で「どれだけずらすか」を色で表した絵を作って、それで画面をゆがめていますの。赤が横、緑が縦のずれですわ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「派手に見えて、中身はクラスを付けたり外したりしているだけなのか」" },
    ],
    next: 'lesson_menu_fx',
  },

  // 場面転換①：何の話かを図で見せてから、本当に場面を切りかえる
  lesson_fx_transition: {
    place: { name: 'FX 07 場面転換とムービー', time: '17:12' },
    bg: 'stairs_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000077',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "この回は、*場面が切りかわる瞬間*の演出の話なのだ。言葉だけだとわかりにくいから、本当に場面を切りかえてみせるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'scenechange', focus: 'mid' }, text: "このゲームでは、シーン（場面）が変わるたびに、何かしらの「切りかえの演出」が入りますの。大きく分けて3種類ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'scenechange', focus: 'tile' }, text: "まずは、いちばんよく使う*タイル*なのだ。次のセリフで部室に移るから、画面全体をよーく見ているのだ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', speed: "slow", text: "3、2、1……" },
    ],
    next: 'lesson_fx_transition_tile',
  },

  // 場面転換②：シーンが変わった瞬間に、タイルがほどける（TileDissolve）
  lesson_fx_transition_tile: {
    place: { name: '部室', time: '17:13' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000077',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_surprise', text: "いまの、見えたのだ？ 画面が細かいタイルに分かれて、波のようにほどけて、部室に切りかわったのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "左上に「部室」と出たのも、切りかえの演出。*場所のテロップ*ですわ。場所が変わるたびに、左からすっと出てきますの。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "もう一度お見せしますわ。今度は屋上へ。タイルが消えはじめる場所は、毎回ちがいますのよ。" },
    ],
    next: 'lesson_fx_transition_tile2',
  },

  // 場面転換③：もう一度タイル。消えはじめる場所が毎回ちがうことを見せる
  lesson_fx_transition_tile2: {
    place: { name: '屋上', time: '17:14' },
    bg: 'roof_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000077',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_proud', text: "ほら、さっきとはちがう場所から、ほどけはじめたのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_FX_TILE, text: "16×9 枚のタイル。ランダムな点からの距離で、消えはじめる時間をずらしていますの。だから、波のように広がって見えますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "タイルは、ふつうの場面の切りかえに毎回使うのだ。だから、1秒ほどで終わる、短くて軽い演出にしてあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "では次は*チャプターカード*。物語の章が変わるときに出す、大きな切りかえですわ。次のセリフで、教室に移りますの。" },
    ],
    next: 'lesson_fx_transition_chapter',
  },

  // 場面転換④：章の始まりのチャプターカード（ChapterCard）と、デモのムービー
  lesson_fx_transition_chapter: {
    chapter: { no: 'EX', title: '場面転換', sub: 'TRANSITION DEMO' },
    place: { name: '教室', time: '17:15' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000077',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_proud', text: "これがチャプターカードなのだ。数字がパラパラ回ってから止まって、タイトルの文字が下から出てきて、最後にシャッターが開いたのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'scenechange', focus: 'chapter' }, text: "章の区切りは、タイルより大げさに。切りかえの大きさで「いまのは大きな区切りですよ」と伝えますの。" },
      { speaker: "ずんだもん", chara: 'zun_smile', diagram: { type: 'scenechange', focus: 'movie' }, text: "そして最後は*ムービー*なのだ。この授業のために、短いデモを作ったのだ。カットの切りかわりと、タイムリープのトンネルを見るのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', movie: "lessonDemo", text: "……いかがでした？ いまのは、画像と CSS だけで作った「ムービー」ですわ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'movieshots', focus: 'shot' }, text: "このゲームのムービーには、じつは*動画ファイルがありません*の。画像のカットを、順番に見せているだけですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_FX_MOVIE, text: "カットごとに、長さとカメラの動きと字幕を書くのだ。カメラの動きは、カットの長さいっぱいに CSS で動かすのだ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_FX_LEAP, text: "タイムリープのトンネルは、Canvas に、自分で遠近法の計算をして描いているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "前のコマを完全に消さずに、半透明の黒を重ねるから、光が尾を引いてスピード感が出ますの。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'movieshots', focus: 'note' }, text: "動画ファイルを使わないので、ゲームがとても軽い。直したいときも、データを書きかえるだけですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「場面が変わる一瞬にも、こんなに工夫があったのか」" },
    ],
    next: 'lesson_menu_fx',
  },

  lesson_fx_sound: {
    place: { name: 'FX 08 音の演出', time: '20:00' },
    bg: 'roof_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000078',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_surprise', text: "じつは、このゲームの音楽も効果音も、*音のファイルがひとつもない*のだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'audiograph', focus: 'notes' }, text: "全部、ブラウザの Web Audio で、その場で作っていますの。曲は「コード進行」と「速さ」のデータで書いてありますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'audiograph', focus: 'osc' }, text: "発振器で音の波を作って、フィルターでこもらせて、音量を調整して、リバーブで響かせるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'audiograph', focus: 'mood' }, text: "そして、音楽にも*演技*をさせますの。いくつか聞いてみましょう。音を出して聞いてくださいな。" },
      { speaker: "ずんだもん", chara: 'zun_normal', music: "duck", text: "duck。音楽が小さくなるのだ。大事なセリフを聞かせたいときに使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', music: "muffle", text: "muffle。水の中みたいに、こもりますわ。フィルターで高い音を切っていますの。" },
      { speaker: "ずんだもん", chara: 'zun_sad', music: "cut", beat: 900, speed: "slow", text: "cut。……音楽が、ぷつっと消えるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', music: "swell", text: "swell。音楽がふくらみますわ。感動の山場ですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', music: "normal", playground: CV_FX_MOOD, text: "しくみはこれなのだ。音量とフィルターを、時間をかけてなめらかに動かすだけなのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', sfx: "heartbeat", music: "duck", beat: 600, text: "効果音も作れますわ。いまの心臓の音は、低い音を4回、間をあけて鳴らしていますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', music: "normal", text: "音楽は、少し先の音まで予約しておく作り方なのだ。そうしないと、ほかの処理が重いときに、リズムがよれてしまうのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "音は、絵と同じくらい気持ちを動かします。だからこそ、鳴らしすぎないことも大事ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「音楽が消えた瞬間が、いちばん心に残った」" },
    ],
    next: 'lesson_menu_fx',
  },

  lesson_fx_design: {
    place: { name: 'FX 09 演出の設計', time: '20:02' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000079',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "最後は、演出の*設計*の話なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_FX_LINE, text: "本編のセリフを1つ見てみましょう。演出は、全部セリフのデータとして書いてありますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "カメラ・効果・間・速さを、1行の中で重ねているのだ。プログラムを書きかえなくても、台本を書く感覚で演出を足せるのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', text: "そして大事なのは、*やりすぎない*こと。毎回画面が揺れたら、本当に大事な場面で揺らしても、もう驚きませんわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["演出のコツ", "✔ 静かな場面を多めにする", "✔ 山場の前に「間」を置く", "✔ 1つのセリフに大技は1つ", "✔ 音を消すのも演出", "✔ 同じ技を続けて使わない"], text: "ボクたちが気をつけていることなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["@media (prefers-reduced-motion)", "  揺れ・グリッチを止める", "  タイムリープの揺れを 0 に", "  ムービーのカットを短く", "  空気の粒を止める"], text: "それから、画面の動きで気分が悪くなる人もいますの。OS で「動きを減らす」を選んでいる人には、激しい演出を止めていますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "スキップしているときも、効果は出さないのだ。早送り中に画面がピカピカしたら、つらいのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["軽く動かすコツ", "✔ transform と opacity で動かす", "✔ たくさんの粒は Canvas で", "✔ 画像は webp で軽く", "✔ 終わった効果は消しておく"], text: "軽く動かすための工夫も、たくさんありますのよ。" },
      { speaker: "ずんだもん", chara: 'zun_gentle', fx: "leak", speed: "slow", text: "キミも、自分の物語に演出を付けてみるのだ。*間*と*光*と*音*。それだけで、世界はがらっと変わるのだ。" },
      { speaker: "僕", chara: 'zun_gentle', text: "「次は、自分で台本を書いてみよう」" },
    ],
    next: 'lesson_menu_fx',
  },

  // ===================================================================
  // バックエンド・Docker 編（このゲームにセーブ用の API を足すなら、を例に）
  // ===================================================================


  lesson_be_intro: {
    place: { name: 'BE 01 バックエンドとは', time: '21:00' },
    bg: 'classroom_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000081',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "このゲームは、全部ブラウザの中だけで動いているのだ。セーブも、そのブラウザの localStorage にしかないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'backend', text: "でも「スマホとパソコンで同じセーブを使いたい」「ランキングを作りたい」となったら、みんなで共有する場所が必要ですわ。それが*バックエンド*ですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'backend', focus: 'front' }, text: "ブラウザで動くのが*フロントエンド*。画面を見せて、さわってもらう係なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'backend', focus: 'api' }, text: "サーバーで動くのが*バックエンド*。データを確かめて、ためて、返す係ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'backend', focus: 'fnote' }, fx: "shake", text: "大事なのは、フロントエンドのコードは*だれでも中身を見られる*ことなのだ。開発者ツールで丸見えなのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'backend', focus: 'bnote' }, text: "だから、秘密の鍵やパスワード、「この人は何をしてよいか」の判断は、必ずバックエンドに置きますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'reqflow', focus: 'r1' }, text: "リクエストが来てから返事を返すまでの流れを、順番に見るのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'reqflow', focus: 'check' }, text: "受け取ったら、まず「ログインしているか」「送られてきた中身は正しいか」を確かめますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'reqflow', focus: 'r3' }, text: "問題なければ、データベースに保存するのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'reqflow', focus: 'r5' }, text: "そして結果を返します。201 は「作れましたよ」という意味ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "バックエンドを書く言葉は、Node.js（JavaScript）・Python・Go・Java・PHP・Ruby など、いろいろあるのだ。このあとは Node.js で説明するのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「画面に見えているのは、半分だけだったのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_be_api: {
    place: { name: 'BE 02 REST API', time: '21:02' },
    bg: 'hallway_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000082',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "フロントとバックエンドの約束ごとが *API* なのだ。いちばんよく使われる形が REST なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_BE_API, text: "URL で「何に対して」、メソッドで「何をするか」、ステータスコードで「どうなったか」を表しますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "GET は読むだけ。何回呼んでも、データは変わらないのだ。だから、キャッシュしたり、やり直したりしても安全なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "PUT と DELETE も、同じものを何回送っても結果は同じ。これを*べき等*と言いますわ。POST は、送るたびに新しく作られることがあるので注意ですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "ステータスコードは、ちゃんと使い分けるのだ。全部 200 で返して、中に「エラーでした」と書くのは、使う側が困るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_BE_EXPRESS, text: "実際のコードは、こんな感じですわ。Node.js の Express という道具を使った例ですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "API の仕様は、OpenAPI という形式で書いておくと、フロントの人と食いちがいにくいのだ。仕様から型や画面を作る道具もあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["✔ URL は名詞（/api/endings）", "  動詞は HTTP メソッドで", "✔ エラーは適切なコードと", "  わかる説明を返す", "✔ 一覧は件数を区切る（ページング）", "✔ 変えるときは古い版も残す", "  （/api/v2 など）"], text: "仕事で気をつけたいところですわ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「API は、フロントとサーバーの約束の書類みたいなものか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_be_db: {
    place: { name: 'BE 03 データベースと SQL', time: '21:04' },
    bg: 'noticeboard_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000083',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "データは、*データベース*にしまうのだ。仕事でよく使うのは、表（テーブル）の形でしまう RDB なのだ。PostgreSQL や MySQL なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'dbtables', text: "表と表を、キーでつなぎますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'dbtables', focus: 'users' }, text: "*主キー*は、その行を1つに決める番号なのだ。ユーザーなら id なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'dbtables', focus: 'fk' }, text: "*外部キー*は、ほかの表の主キーを指すもの。存在しないユーザーのデータは、入れられなくなりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_BE_SQL, text: "テーブルの形と、読み書きの SQL は、こんな感じなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "データが増えると、探すのが遅くなります。よく条件に使う列には*インデックス*（本の索引）を作りますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "それから*トランザクション*なのだ！ 「お金を減らす」と「品物を渡す」の片方だけ成功したら、大変なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["BEGIN;", "  UPDATE … お金を減らす", "  INSERT … 品物を渡す", "COMMIT;     ← 全部うまくいったら確定", "（とちゅうで失敗 → ROLLBACK）"], text: "いくつかの処理を「全部成功」か「全部なかったことに」のどちらかにする。それがトランザクションですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "テーブルの形を変えるときは、*マイグレーション*というファイルにして、順番に当てていくのだ。本番のデータベースを手で直接いじらないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ N+1 問題", "  一覧の1件ごとに SQL を打つ", "  → まとめて1回で取る", "✔ バックアップと復元の練習", "✔ 本番 DB を手で直接いじらない", "✔ 個人情報はしまい方に注意"], text: "よくある落とし穴ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「表をきれいに分けておけば、データがおかしくなりにくいのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_be_security: {
    place: { name: 'BE 04 安全な API', time: '21:06' },
    bg: 'front_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000084',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "バックエンドは、インターネットからだれでも呼べるのだ。悪いことをしようとする人も、呼んでくるのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', text: "まず大原則。*送られてきたものは、全部うたがう*。ブラウザの画面でチェックしていても、API は直接呼べてしまいますわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "glitch", text: "いちばん有名な攻撃が *SQL インジェクション*なのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_BE_INJECTION, text: "入力をそのまま SQL に混ぜると、命令そのものを書きかえられてしまいますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "プレースホルダーを使えば防げるのだ。ORM やクエリビルダーを使っても、自動でそうしてくれるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_BE_COOKIE, text: "ログインの情報を Cookie で渡すなら、安全のための設定を必ず付けますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "*CORS* は、「ほかのサイトの画面から、この API を呼んでいいか」の設定なのだ。とりあえず * で全部許すのは、あぶないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "AWS 編で話した「認証と認可」も、ここで効いてきますわ。ログインしているかだけでなく、「そのデータの持ち主か」まで毎回確かめますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ 入力は形と範囲を確かめる", "✔ SQL はプレースホルダーで", "✔ パスワードは bcrypt などで", "  ハッシュにして保存", "✔ だれのデータかは毎回確認", "✔ ログイン試行の回数を制限", "✔ エラーに内部の情報を出さない"], text: "安全な API のための心得なのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「画面でボタンを隠しても、守ったことにはならないのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_be_docker: {
    place: { name: 'BE 05 Docker のきほん', time: '21:08' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000085',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "「ボクのパソコンでは動くのに、サーバーだと動かないのだ……」。この悩みを解決するのが *Docker* なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'container', text: "Docker は、アプリと、動かすのに必要なもの一式を、*コンテナ*という箱にまとめて動かす道具ですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'container', focus: 'vm' }, text: "仮想マシンは、OS をまるごと用意するから重いのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'container', focus: 'container' }, text: "コンテナは OS を共有して、必要なものだけを持つので、軽くて数秒で起動しますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'dockerflow', focus: 'image' }, text: "言葉を整理するのだ。作り方の手順書が *Dockerfile*、それを元に作った型が*イメージ*、イメージから動かしたものが*コンテナ*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'dockerflow', focus: 'container' }, text: "1つのイメージから、同じコンテナをいくつでも動かせますの。たい焼きの型と、たい焼きの関係ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'dockerflow', focus: 'registry' }, text: "作ったイメージは*レジストリ*に置いておくのだ。AWS なら ECR、みんなが使えるのは Docker Hub なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["> docker build -t after-school .", "> docker run -p 8080:80 after-school", "> docker ps            … 動いている一覧", "> docker logs <ID>     … ログを見る", "> docker exec -it <ID> sh", "                       … 中に入る"], text: "よく使うコマンドですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "コンテナは、止めると中で変えたものは消えるのだ。残したいデータは、*ボリューム*や外のデータベースに置くのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「動く環境ごと箱に入れて運ぶから、どこでも同じように動くのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_be_dockerfile: {
    place: { name: 'BE 06 Dockerfile', time: '21:10' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000086',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "じゃあ、このゲームを Docker に入れてみるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_DOCKERFILE, text: "ビルドには Node.js が必要ですが、できあがった dist を配るだけなら Node.js はいりませんわ。だから2段階で作りますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "これを*マルチステージビルド*っていうのだ。本番のイメージには、できあがったファイルと nginx だけが入るから、小さくて安全なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "もう1つのコツは順番。package.json を先にコピーして npm ci をしておくと、ソースだけ変えたときは、そこまでがキャッシュされて速くなりますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "そして、AWS 編でも出てきた /game の問題が、ここでもあるのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_NGINX, text: "nginx にも「ファイルがない URL は index.html を返す」と教えておきますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: ".dockerignore に node_modules や .env を書いておくのも忘れないのだ。いらないものや秘密がイメージに入らないようにするのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["✔ 小さいイメージを元にする", "  （alpine・slim など）", "✔ バージョンを固定する", "  （latest に頼らない）", "✔ 秘密はイメージに入れない", "✔ できれば root で動かさない"], text: "Dockerfile のコツですわ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「作る道具と、配る中身を分けるのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_be_compose: {
    place: { name: 'BE 07 docker compose', time: '21:12' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000087',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "API とデータベースのように、コンテナが何個も必要なときは *docker compose* が便利なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'compose', focus: 'box' }, text: "compose.yaml に組み合わせを書いておけば、docker compose up の1コマンドで全部起動しますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_COMPOSE, text: "中身はこうなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'compose', focus: 'net' }, text: "コンテナどうしは、*サービスの名前*で呼び合えますの。API からは、db という名前でデータベースに届きますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'compose', focus: 'host' }, text: "ports は、パソコンの番号とコンテナの番号をつなぐ設定なのだ。これで、ブラウザから localhost:3000 で API を呼べるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'compose', focus: 'vol' }, text: "データベースのデータは、ボリュームに残しますの。コンテナを作り直しても、データは消えませんわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "新しく入った人も、git clone して docker compose up するだけで、同じ環境がそろうのだ。「動かない」で1日つぶれることが減るのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["> docker compose up -d   … 起動", "> docker compose logs -f … ログ", "> docker compose down    … 停止", "> docker compose down -v", "  … データも消す（注意）"], text: "ただし、compose.yaml のパスワードは手元用の仮のもの。本番の秘密は、Secrets Manager などにしまいますわ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「手元に、小さな本番環境を作れるのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_be_prod: {
    place: { name: 'BE 08 本番で動かす', time: '21:14' },
    bg: 'classroom_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000088',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "コンテナを本番で動かすときには、守っておきたい作法があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_BE_PROD, text: "まとめて見てみましょう。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "設定は*環境変数*から読むのだ。同じイメージを、開発でも本番でも、設定だけ変えて使えるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "ログはファイルではなく*標準出力*へ。コンテナは消えることがあるので、ファイルに書くとなくなってしまいますの。JSON で出すと、あとで検索しやすいですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "*ヘルスチェック*は、ロードバランサーが「生きてる？」と聞きに来る窓口なのだ。答えられなくなったコンテナは、自動で外されて、作り直されるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'deployflow', focus: 'ci' }, text: "本番に出すまでの流れは、こうですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'deployflow', focus: 'ecr' }, text: "CI でテストしてイメージを作って、ECR に置くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'deployflow', focus: 'rolling' }, text: "ECS が、新しいイメージのコンテナを起動して、ヘルスチェックに合格したものから順番に入れかえますの。止まらずに新しい版になりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "もし新しい版がおかしかったら、すぐ前のイメージに戻せるように、イメージには Git のコミットの番号などで名前を付けておくのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 設定は環境変数・秘密は Secrets", "✔ ログは標準出力に JSON で", "✔ /health を用意する", "✔ SIGTERM できれいに止まる", "✔ イメージに版の名前を付ける", "✔ すぐ戻せるようにしておく"], text: "本番の心得ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「消えても、入れかわっても困らないように作るのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_be_scale: {
    place: { name: 'BE 09 スケールとキャッシュ', time: '21:16' },
    bg: 'stairs_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000089',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "このゲームがすごく人気になって、何万人も来たらどうするのだ？" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'scale', focus: 'app' }, text: "サーバーを1台だけ強くするより、同じコンテナを何台も並べるほうが、仕事ではよく使われますわ。これを*スケールアウト*と言いますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'scale', focus: 'lb' }, text: "前に*ロードバランサー*を置いて、リクエストを順番に配るのだ。1台がこわれても、ほかが動き続けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'scale', focus: 'db' }, text: "そのためには、コンテナに大事なデータを持たせないこと。*ステートレス*と言いますわ。ログインの情報も、コンテナのメモリではなく、データベースや Redis に置きますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'scale', focus: 'cache' }, text: "何度も読まれるのに、あまり変わらないデータは*キャッシュ*に置くのだ。Redis は、メモリにしまうから、すごく速いのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "ただし、キャッシュは古くなりますの。いつ消すか・何秒で切れるかを決めておかないと、古いデータを見せてしまいますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'scale', focus: 'queue' }, text: "メールを送るとか、画像を作るとか、時間がかかる処理は、その場でやらないのだ。*キュー*に「あとでやってね」と入れて、すぐ返事を返すのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'scale', focus: 'worker' }, text: "キューにたまった仕事は、*ワーカー*が順番に片付けます。失敗したらやり直せるので、取りこぼしにくいですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ コンテナはステートレスに", "✔ 遅いところを測ってから直す", "  （かんで最適化しない）", "✔ キャッシュは消し方まで決める", "✔ 重い処理はキューで後回し", "✔ DB が最後のボトルネックに", "  なりやすい"], text: "ここまでわかれば、設計の会話についていけるのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「何万人来ても、同じ箱を増やせばいい形にしておくのか」" },
      { speaker: "ずんだもん", chara: 'zun_smile', text: "そうなのだ！ キミの作ったゲームが、そのくらい遊ばれる日が来るといいのだ。" },
    ],
    next: 'lesson_menu_server',
  },

  // ===================================================================
  // HTTP 編
  // ===================================================================


  lesson_http_journey: {
    place: { name: 'HTTP 01 表示されるまで', time: '16:20' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000091',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'journey', text: "URL を入れてから画面が出るまで、ほんの一瞬なのだ。でもそのあいだに、たくさんのことが起きているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'journey', focus: 'j1' }, text: "まず、ブラウザは「game.example.com はどこ？」と *DNS* に聞きますの。名前を、IP アドレスという住所の番号に変える係ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'journey', focus: 'j3' }, text: "住所がわかったら、そのサーバーに*接続*して、HTTPS なら TLS のあいさつで暗号の鍵を決めるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'journey', focus: 'j4' }, text: "準備ができたら、やっと HTTP の出番。「/index.html をください」とリクエストを送りますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'journey', focus: 'j5' }, text: "サーバーが「200 OK」と HTML を返したら、ブラウザは HTML を読んで、必要な CSS や JS や画像を、またリクエストするのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["Network の Timing でわかること", "  DNS Lookup … 名前を調べた時間", "  Initial connection … 接続", "  SSL … TLS のあいさつ", "  Waiting (TTFB) … 返事を待った", "  Content Download … 受け取り"], text: "「サイトが遅い」と言われたら、どこで時間がかかっているかを分けて考えますの。開発者ツールの Network で、1つずつの時間が見えますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "TTFB が長いなら、サーバーの処理が遅いのだ。Content Download が長いなら、ファイルが大きすぎるのだ。直す場所がちがうのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「遅い、だけじゃなくて、どこが遅いかを見るのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_http_message: {
    place: { name: 'HTTP 02 メッセージの中身', time: '16:22' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000092',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'httpmsg', text: "HTTP のリクエストとレスポンスは、どちらも同じ形をしているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'httpmsg', focus: 'line' }, text: "1行目が*開始行*。リクエストなら「何をするか・どこに」、レスポンスなら「どうなったか」ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'httpmsg', focus: 'headers' }, text: "その下が*ヘッダー*なのだ。「名前: 値」が並んでいて、おまけの情報を伝えるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'httpmsg', focus: 'body' }, text: "空の行をはさんで、*本文*。HTML や JSON や画像の中身ですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_HTTP_RAW, text: "HTTP/1.1 なら、本当にこういう文字でやりとりしているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["Host           … どのサイトあてか", "Content-Type   … 本文の種類", "Authorization  … ログインのトークン", "Cookie / Set-Cookie", "Cache-Control  … キャッシュの決まり", "User-Agent     … どのブラウザか", "Accept         … ほしい形"], text: "よく見るヘッダーですわ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', playground: PG_FETCH, text: "じゃあ、このゲームのサーバーに、本当にリクエストを送ってみるのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "同じ GET でも、HTML なら text/html、画像なら image/webp。ブラウザは拡張子ではなく、この *Content-Type* を見て扱い方を決めていますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["> curl -i https://example.com/", "  … ヘッダーも表示", "> curl -I https://example.com/", "  … ヘッダーだけ（HEAD）", "> curl -v https://example.com/", "  … 接続や TLS のようすも"], text: "コマンドで送るなら curl が便利なのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「ヘッダーを見れば、サーバーが何を伝えたいのかわかるのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_http_status: {
    place: { name: 'HTTP 03 ステータスコード', time: '16:24' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000093',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'statusclass', text: "レスポンスの3桁の数字が、*ステータスコード*なのだ。最初の数字で、グループが分かれているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'statusclass', focus: 'redirect' }, text: "2xx は成功。3xx は「ほかを見て」。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'statusclass', focus: 'client' }, text: "4xx は*送った側*の問題、5xx は*サーバー側*の問題なのだ。ここを見るだけで、だれが直すべきかの見当がつくのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_HTTP_STATUS, text: "よく見るものを、まとめておきますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "リダイレクトはややこしいのだ。301 と 308 は「ずっと引っ越した」、302 と 307 は「いまだけ」。307 と 308 は、POST を POST のまま送り直してくれるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "301 にすると、ブラウザや検索エンジンが覚えてしまいます。まちがえると取り消しにくいので、ためすときは 302 からが安全ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'statusclass', focus: 'server' }, fx: "shake", text: "5xx のちがいも大事なのだ！ 502 は、前に立っているサーバーが「奥のアプリから変な返事が来た」と言っているのだ。アプリが落ちていることが多いのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "503 は混んでいるかメンテナンス中、504 は奥の処理が時間切れ。ロードバランサーの前で起きたのか、アプリの中で起きたのかを、ログで確かめますの。" },
      { speaker: "僕", chara: 'metan_smug', text: "「数字だけで、どこを調べればいいか、だいたいわかるのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_http_cache: {
    place: { name: 'HTTP 04 キャッシュ', time: '16:26' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000094',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "同じファイルを毎回ダウンロードするのは、もったいないのだ。だから、ブラウザや CDN が*キャッシュ*（手元のコピー）を持つのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_HTTP_CACHE, text: "どれくらいコピーを使ってよいかは、サーバーが Cache-Control ヘッダーで決めますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "ひっかけがあるのだ！ *no-cache* は「キャッシュするな」じゃないのだ。「使う前に毎回確かめて」なのだ。保存させないのは *no-store* なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'etag', focus: 'e1' }, text: "では「確かめる」とは、どういうことか。順番に見てみましょう。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'etag', focus: 'e2' }, text: "1回目は、ふつうにダウンロードするのだ。そのとき、サーバーが版の印（ETag）を付けてくるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'etag', focus: 'e4' }, text: "2回目は「わたくし、この版を持っていますわ」と伝えますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'etag', focus: 'e5' }, text: "変わっていなければ、サーバーは *304* とだけ返すのだ。本文がないから、すごく軽いのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'etag', focus: 'e6' }, text: "あとは、しまっておいたコピーを使うだけ。こうして「いつも最新」と「軽い」を両立しますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "このゲームの assets は名前が毎回変わるから1年キャッシュ、index.html は毎回確かめる。AWS 編や Docker の回で設定したのも、これなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 更新したのに古いまま", "  → index.html を長くキャッシュしていた", "✔ ほかの人の画面が見えた", "  → 人ごとの中身を CDN に置いた", "  → private か no-store に", "✔ 直すときは、名前を変えるのが確実"], text: "キャッシュでよくある事故ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「速くするための仕組みだけど、まちがえると事故になるのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_http_cookie: {
    place: { name: 'HTTP 05 Cookie とセッション', time: '16:28' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000095',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "HTTP は、ひとつひとつのリクエストが*ばらばら*なのだ。サーバーは、さっき来た人のことを覚えていないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'cookieflow', focus: 'c1' }, text: "それでもログインを覚えておくために使うのが *Cookie*。流れを見てみましょう。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'cookieflow', focus: 'c2' }, text: "ログインに成功したら、サーバーはセッションを作って、その番号を覚えておくのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'cookieflow', focus: 'c3' }, text: "そして Set-Cookie ヘッダーで、番号をブラウザに渡しますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'cookieflow', focus: 'c4' }, text: "それからは、ブラウザが*自動で* Cookie を付けて送ってくれるのだ。サーバーは番号から「だれか」を調べるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_HTTP_COOKIE, text: "実際のヘッダーは、こうですわ。属性の付け方が、安全かどうかを大きく左右しますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "glitch", text: "Cookie が自動で付くのは便利だけど、あぶないこともあるのだ！ ほかのサイトから、勝手にリクエストを送らせる攻撃が *CSRF* なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "SameSite を付けておけば、ほかのサイトから来たリクエストには Cookie が付かなくなりますわ。大事な操作には、CSRF トークンを合わせて使うこともありますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["セッション＋Cookie", "  ✔ サーバーですぐ無効にできる", "  ✔ ブラウザのアプリ向き", "トークン（JWT）", "  ✔ サーバーが覚えなくていい", "  ✔ スマホアプリや API 向き", "  ✔ 期限まで取り消しにくい"], text: "セッション（Cookie）と、AWS 編で出てきたトークン（JWT）は、どっちもよく使うのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「覚えていないサーバーに、毎回名札を見せているのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_http_cors: {
    place: { name: 'HTTP 06 同一オリジンと CORS', time: '16:30' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000096',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "ブラウザには、「よそのサイトのデータを、勝手に読ませない」という大事なルールがあるのだ。*同一オリジンポリシー*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'origin', focus: 'scheme' }, text: "オリジンは、プロトコル・ホスト・ポートの組み合わせ。3つとも同じなら「同じオリジン」ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'origin', focus: 'diff' }, text: "どれか1つでもちがえば、別のオリジンなのだ。api.example.com は、game.example.com とは別なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "もしこのルールがなかったら、悪いサイトを開いただけで、あなたがログインしている銀行のデータを読まれてしまいますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "でも、自分のゲームから自分の API を呼びたいこともあるのだ。そのとき、サーバーが「この相手ならいいよ」と許可するのが *CORS* なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'preflight', focus: 'p2' }, text: "PUT や、JSON を送るリクエストのときは、ブラウザが先に*下見*をしますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'preflight', focus: 'p3' }, text: "OPTIONS というメソッドで「この相手から、この方法で送っていい？」と聞くのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'preflight', focus: 'p6' }, text: "許可が出たら、本番のリクエスト。返事にも許可のヘッダーが付いていないと、ブラウザは JS にデータを渡しませんわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_HTTP_CORS, text: "ヘッダーは、こうなっているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ CORS エラーはブラウザの中で起きる", "  （curl なら通ってしまう）", "✔ 直すのはサーバー側の設定", "✔ * にすると Cookie は送れない", "✔ 「とりあえず全部許可」はしない", "✔ CORS は攻撃を防ぐ鍵ではない", "  （サーバーの認証は別に必要）"], text: "つまずきやすいところですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「エラーを出しているのはブラウザで、守られているのは使っている人なのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_http_https: {
    place: { name: 'HTTP 07 HTTPS と HTTP/2・3', time: '16:32' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000097',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'tls', text: "HTTPS は、HTTP を *TLS* で暗号化したものなのだ。いまはほとんどのサイトが HTTPS なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'tls', focus: 'issue' }, text: "サーバーは、前もって*認証局（CA）*から証明書をもらっておきますの。「このドメインの本物です」という身分証ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'tls', focus: 'verify' }, text: "つなぐとき、サーバーが証明書を見せて、ブラウザは CA の署名を確かめるのだ。ブラウザは、信頼できる CA のリストを最初から持っているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'tls', focus: 'secret' }, text: "確かめたら、2人だけの鍵を決めて、そこから先は暗号化。途中で盗み見られても、中身はわかりませんの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "でも、HTTPS でも見えるものがあるのだ！ どのドメインにつないでいるかは、まわりから見えるのだ。それに、HTTPS は「通り道」を守るだけで、サイトが安全かどうかは別なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_HTTP_SECURITY, text: "HTTPS といっしょに付けておきたいヘッダーもありますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'httpver', text: "HTTP には、新しい版もあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'httpver', focus: 'h2' }, text: "HTTP/1.1 は、1本の接続で1つずつ。HTTP/2 は、1本の接続でたくさんを同時に送れますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'httpver', focus: 'h3' }, text: "HTTP/3 は、TCP じゃなくて QUIC という UDP の上のしくみを使うのだ。1つが遅れても、ほかが止まりにくいし、スマホの回線が切りかわってもつながりやすいのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "CloudFront や nginx の設定で使えるようになるので、アプリのコードを変える必要は、ほとんどありませんわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 全部のページを HTTPS に", "✔ HTTP で来たら HTTPS へ転送", "✔ HTTPS のページで http の", "  画像や JS を読まない（混在）", "✔ 証明書の期限切れに注意", "  （ACM などで自動更新）"], text: "HTTPS の心得なのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「鍵のマークは、通り道が守られているという意味なのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  // ===================================================================
  // 非同期 JavaScript 編
  // ===================================================================

  lesson_menu_async: {
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'async', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: "ずんだもん", chara: 'zun_proud', text: "*非同期 JavaScript 編*なのだ。API を呼ぶなら、ここは避けて通れないのだ。" },
    ],
    choices: ASYNC_MENU,
  },

  lesson_async_why: {
    place: { name: 'ASYNC 01 なぜ非同期？', time: '16:40' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000101',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "JavaScript には、大事な性質があるのだ。*手が1本しかない*のだ。一度にできるのは、1つのことだけなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'jsthread', focus: 'sync' }, text: "もし API の返事を、手を止めてじっと待っていたら……その間、ボタンも押せず、画面も固まってしまいますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'jsthread', focus: 'async' }, text: "だから、待つのは*ブラウザにまかせる*のだ。JavaScript は「返事が来たら、これをやってね」と頼んで、先に進むのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'jsthread', focus: 'note' }, text: "これが*非同期*。返事を待っている間も、クリックに反応したり、アニメーションを動かしたりできますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["よく非同期になるもの", "  fetch（通信）", "  setTimeout（タイマー）", "  ファイルの読みこみ", "  import()（あとから読みこむ）", "  クリックなどのイベント"], text: "非同期になるのは、時間がかかるかもしれないことなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "逆に、重い計算をそのまま書くと、非同期にはなりません。手が1本なので、計算が終わるまで画面は止まりますわ。そういうときは Web Worker という別の手を借りますの。" },
      { speaker: "僕", chara: 'metan_normal', text: "「待つのを人にまかせて、そのあいだに別のことをするのか」" },
    ],
    next: 'lesson_menu_async',
  },

  lesson_async_loop: {
    place: { name: 'ASYNC 02 イベントループ', time: '16:42' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000102',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'eventloop', text: "「返事が来たらやってね」と頼んだ仕事は、どうやって順番に動くのか。それが*イベントループ*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'eventloop', focus: 'stack' }, text: "いま実行している処理は*コールスタック*に積まれます。ここが空になるまで、ほかのことはできませんの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'eventloop', focus: 'apis' }, text: "タイマーや通信は、ブラウザが見張っていてくれるのだ。終わったら、続きの仕事が*列に並ぶ*のだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'eventloop', focus: 'micro' }, text: "列は2種類。Promise の続きが並ぶ*マイクロタスク*と、setTimeout やクリックが並ぶ*タスク*ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'eventloop', focus: 'loop' }, text: "コールスタックが空になったら、まずマイクロタスクを*全部*片付けて、それからタスクを*1つ*だけ。これをずっとくり返すのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: PG_EVENTLOOP, text: "では、問題です。この順番、予想できまして？" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "答えは ① ⑤ ③ ④ ② なのだ！ ふつうの処理が先に全部動いて、次に Promise の続き、setTimeout は 0ミリ秒でもいちばん最後なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "「0ミリ秒後」は「すぐ」ではなく「いまの処理と、マイクロタスクが全部終わったあと」という意味ですの。" },
      { speaker: "僕", chara: 'metan_smug', text: "「待ち時間0でも、列には並ぶのか」" },
    ],
    next: 'lesson_menu_async',
  },

  lesson_async_promise: {
    place: { name: 'ASYNC 03 Promise', time: '16:44' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000103',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "昔は、「終わったらこれを呼んでね」と関数を渡していたのだ。*コールバック*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_ASYNC_STYLES, text: "でも、続けて頼むたびに入れ子が深くなって、読めなくなりましたの。*コールバック地獄*ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'promisestate', focus: 'pending' }, text: "そこで生まれたのが *Promise* なのだ。「あとで結果を渡すね」という*約束*のオブジェクトなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'promisestate', focus: 'fulfilled' }, text: "約束には3つの状態があります。待っている pending、うまくいった fulfilled、失敗した rejected。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'promisestate', focus: 'rejected' }, text: "失敗したら、catch の中が動くのだ。then をいくつつないでも、catch は最後に1つ書けばいいのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "fetch も import() も、Promise を返しますの。いまの非同期の道具は、ほとんどが Promise でできていますわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「結果の代わりに、まず約束だけ返してくるのか」" },
    ],
    next: 'lesson_menu_async',
  },

  lesson_async_await: {
    place: { name: 'ASYNC 04 async / await', time: '16:46' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000104',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "Promise をもっと読みやすく書けるのが *async / await* なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "関数に async を付けると、中で await が使えますの。await は「この約束が終わるまで、ここで待つ」という意味ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "待つといっても、手が止まるわけじゃないのだ。この関数の続きを後回しにして、ほかの仕事は動き続けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "エラーは、ふつうの try / catch で受け止められますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'seqpar', focus: 'seq' }, fx: "shake", text: "でも、気をつけないと遅くなるのだ！ await を3回続けると、1つずつ順番に待つのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'seqpar', focus: 'par' }, text: "たがいに関係ないなら、*まとめて*頼めば早いですわ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', playground: PG_PARALLEL, text: "やってみるのだ！ 3秒かかるのを、1秒にするのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_ASYNC_PITFALL, text: "よくあるまちがいも、見ておきましょう。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "特に「fetch は 404 でも失敗にならない」は、本当によくやるのだ。res.ok を確かめるのを忘れないのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「await は便利だけど、どこで待っているかを意識しないといけないのか」" },
    ],
    next: 'lesson_menu_async',
  },

  lesson_async_tools: {
    place: { name: 'ASYNC 05 まとめて待つ・取り消す', time: '16:48' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000105',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_ASYNC_TOOLS, text: "待ち方の道具は、Promise.all だけじゃないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "Promise.all は、1つでも失敗したら全体が失敗。ほかの結果も使いたいなら、allSettled で全部を待ちますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "race は、いちばん早く終わったものを使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "そして大事なのが*取り消し*。もういらなくなったリクエストは、AbortController でやめられますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "ネットがつながりにくいと、fetch はなかなか終わらないことがあるのだ。AbortSignal.timeout で、時間を決めておくのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 通信には必ずタイムアウト", "✔ 失敗したらやり直す？", "  → 回数と間隔を決める", "  （すぐ連打しない）", "✔ 同時に投げすぎない", "  （数十件なら少しずつ）", "✔ いらなくなったら取り消す"], text: "仕事で気をつけたいことですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「待つだけじゃなくて、待つのをやめる道具もいるのか」" },
    ],
    next: 'lesson_menu_async',
  },

  lesson_async_ui: {
    place: { name: 'ASYNC 06 画面での非同期', time: '16:50' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000106',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "画面から API を呼ぶときは、考えることがもっと増えるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_ASYNC_VUE, text: "待っている間は「読みこみ中」を出し、失敗したら理由を出し、終わったらどちらも消す。この3つはセットですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'staleres', focus: 's1' }, fx: "glitch", text: "そして、こわいのが*古い結果での上書き*なのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'staleres', focus: 's3' }, text: "「ず」で検索して、すぐ「ずんだ」と打ちなおした、としますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'staleres', focus: 's5' }, text: "「ずんだ」の結果が先に返ってきて、画面に出るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'staleres', focus: 's6' }, text: "そのあとで、おそかった「ず」の結果が届いて、画面を上書きしてしまいますの。打った文字と結果がちがう、という不具合ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "だから、新しいリクエストを出すときに、前のものを取り消すのだ。さっきのコードの最初の1行が、それなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "ボタンの二重押しも同じ考え方。送っている間はボタンを押せなくして、同じ注文が2回届かないようにしますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_ASYNC_REAL, text: "このゲームでも、非同期は使っているのだ。必要になったときにだけファイルを読みこむところなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「読みこみ中・失敗・古い結果・二重押し。画面の非同期は、気をつけることがいっぱいだ」" },
    ],
    next: 'lesson_menu_async',
  },

  // ===================================================================
  // セキュリティ編（OWASP Top 10 にそって）
  // ===================================================================

  lesson_menu_security: {
    bg: 'lab_night',
    bgm: 'tension',
    ambient: 'echo',
    meter: '0.000000',
    lessonMenu: 'security', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: "四国めたん", chara: 'metan_serious', text: "*セキュリティ編*ですわ。作る人が知らないと、使う人を守れませんの。" },
    ],
    choices: SECURITY_MENU,
  },

  lesson_sec_mindset: {
    place: { name: 'SEC 01 守りの考え方', time: '22:00' },
    bg: 'lab_night',
    bgm: 'tension',
    ambient: 'echo',
    meter: '0.000111',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'trust', text: "セキュリティのいちばん大事な考え方は、「*どこから先は信用しないか*」を決めることなのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', diagram: { type: 'trust', focus: 'client' }, text: "ブラウザから来るものは、全部、利用者が自由に書きかえられますわ。フォームも、URL も、Cookie も、画面のチェックも。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'trust', focus: 'server' }, text: "だから、守るのはサーバー側なのだ。形を確かめて、だれか確かめて、してよいか確かめて、安全に使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'defense', text: "そして、守りは何枚も重ねます。1枚やぶられても、次で止める。*多層防御*ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'defense', focus: 'l5' }, text: "最後の層は、やぶられたときに被害を小さくすることなのだ。権限をしぼっておけば、盗まれても、できることは少ないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["A01 アクセス制御の不備", "A02 暗号の不備", "A03 インジェクション（XSS もここ）", "A04 安全でない設計", "A05 設定のまちがい", "A06 古い・弱いライブラリ", "A07 認証の不備", "A08 データの改ざん", "A09 ログと監視の不足", "A10 SSRF"], text: "よく起きる問題は、OWASP という団体がまとめていますの。2021年版の Top 10 ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "1位は「アクセス制御の不備」なのだ。つまり、*見せてはいけない人に見せてしまう*ことが、いちばん多いのだ！" },
      { speaker: "僕", chara: 'zun_surprise', text: "「攻撃の技より先に、まず守る場所を決めるのか」" },
    ],
    next: 'lesson_menu_security',
  },

  lesson_sec_xss: {
    place: { name: 'SEC 02 XSS', time: '22:02' },
    bg: 'classroom_night',
    bgm: 'tension',
    ambient: 'echo',
    meter: '0.000112',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'xssflow', text: "*XSS*は、ページに、悪いスクリプトを埋めこまれる攻撃なのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', diagram: { type: 'xssflow', focus: 'x1' }, text: "たとえばコメント欄に、スクリプトの入った文章を書かれて……" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'xssflow', focus: 'x3' }, text: "サーバーがそれを、そのまま HTML に入れて返すと……" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'xssflow', focus: 'x4' }, text: "見た人のブラウザで、そのスクリプトが動いてしまいますの。ログイン中のその人として、何でもできてしまいますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: PG_XSS, text: "安全な例で、ためしてみるのだ。HTML として読まれると、どうなるかなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_SEC_XSS, text: "Vue の {{ }} は、自動で記号を無害にしてくれますの。あぶないのは v-html や innerHTML のように、HTML として入れるときですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_SEC_XSS_REAL, text: "このゲームのエディタの色分けは v-html を使っているのだ。でも、先に < や > を無害な文字に変えてから入れているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "「v-html を使うなら、中身はだれが書いたものか」を、必ずレビューで確かめますの。" },
      { speaker: "僕", chara: 'metan_smug', text: "「{{ }} で書くだけで、守られていたのか」" },
    ],
    next: 'lesson_menu_security',
  },

  lesson_sec_injection: {
    place: { name: 'SEC 03 インジェクション', time: '22:04' },
    bg: 'hallway_night',
    bgm: 'tension',
    ambient: 'echo',
    meter: '0.000113',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "*インジェクション*は、入力を「命令の一部」として使ってしまうことで起きるのだ。XSS も、SQL インジェクションも、その仲間なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_SEC_INJECT, text: "SQL だけではありませんわ。シェルのコマンドや、ファイルの場所でも起きますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "glitch", text: "ファイル名に「; rm -rf ~」なんて書かれたら、サーバーのファイルが消されてしまうのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "「../」を使えば、決められたフォルダの外も読めてしまいます。パスワードの書かれた設定ファイルを、読まれるかもしれませんわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "守り方はどれも同じなのだ。入力は「命令」じゃなくて「値」として渡すのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "もう1つ、*SSRF* も覚えておきましょう。「この URL の画像を取ってきて」という機能で、サーバーの内側の URL を指定されると、外からは見えない場所に入られてしまいますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ SQL はプレースホルダー", "✔ シェルを通さない（execFile）", "✔ パスは決めた中か確かめる", "✔ 取ってくる URL は許可リストで", "✔ 入力は「許すもの」を決める", "  （ダメなものを探すより安全）"], text: "インジェクションの守りなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「入力を、命令の材料にしない」" },
    ],
    next: 'lesson_menu_security',
  },

  lesson_sec_access: {
    place: { name: 'SEC 04 認証と認可の守り', time: '22:06' },
    bg: 'noticeboard_night',
    bgm: 'tension',
    ambient: 'echo',
    meter: '0.000114',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'idor', focus: 'user' }, text: "OWASP の1位、*アクセス制御の不備*なのだ。いちばんよくあるのは、こういう形なのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', diagram: { type: 'idor', focus: 'req' }, text: "URL の番号を1つ変えてみる。たったそれだけで……" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'idor', focus: 'bad' }, fx: "shake", text: "ほかの人のセーブが見えてしまうのだ！ ログインしているかしか、確かめていなかったのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'idor', focus: 'good' }, text: "だから、データを返す前に「この人のものか」を毎回確かめますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_SEC_IDOR, text: "コードにすると、1行足すだけなのだ。でも、その1行を忘れるのが、いちばん多いのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_SEC_PASSWORD, text: "パスワードの保存も大事ですわ。もしデータベースが盗まれても、パスワードそのものはわからないようにしておきますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 持ち主・権限を毎回確かめる", "✔ パスワードは bcrypt などで", "✔ ログインの試行回数を制限", "✔ 大事な操作の前は再確認", "✔ MFA を使えるようにする", "✔ ログイン後はセッションを作り直す"], text: "認証まわりの守りなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「ログインしているかと、その人のものかは、別の話なのか」" },
    ],
    next: 'lesson_menu_security',
  },

  lesson_sec_csrf: {
    place: { name: 'SEC 05 CSRF・クリックジャッキング', time: '22:08' },
    bg: 'front_night',
    bgm: 'tension',
    ambient: 'echo',
    meter: '0.000115',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'csrfflow', text: "*CSRF* は、ほかのサイトから、あなたのふりをして操作させる攻撃なのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', diagram: { type: 'csrfflow', focus: 'f1' }, text: "あなたが銀行にログインしたまま、罠のページを開いたとしますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'csrfflow', focus: 'f2' }, text: "罠のページには、見えないフォームがあって、勝手に銀行へ送信するのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'csrfflow', focus: 'f3' }, text: "そのとき、銀行の Cookie が*自動で*付いてしまう。銀行は本人の操作だと思ってしまいますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "守り方は、HTTP 編で話した SameSite なのだ。ほかのサイトから来たリクエストには、Cookie を付けないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "大事な操作には、ページに埋めた*CSRF トークン*も合わせて確かめますの。罠のページは、そのトークンを知りませんわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "glitch", text: "*クリックジャッキング*もあるのだ！ 透明にしたあなたのサイトを、罠のページに重ねて、知らないうちにボタンを押させるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "これは「ほかのサイトの枠に入れさせない」ヘッダーで防げますわ。X-Frame-Options や、CSP の frame-ancestors ですの。" },
      { speaker: "僕", chara: 'metan_smug', text: "「自分のサイトが、よそのページの中で使われることもあるのか」" },
    ],
    next: 'lesson_menu_security',
  },

  lesson_sec_secrets: {
    place: { name: 'SEC 06 秘密と依存ライブラリ', time: '22:10' },
    bg: 'lab_night',
    bgm: 'tension',
    ambient: 'echo',
    meter: '0.000116',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "パスワードや API キーのような*秘密*は、置き場所をまちがえると、すぐにもれるのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', playground: CV_SEC_SECRETS, text: "Vite を使っているなら、特に気をつけてくださいな。VITE_ で始まる環境変数は、ビルドした JS に入って、だれでも見られますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "Git に秘密を push してしまったら、ファイルを消すだけじゃダメなのだ！ 履歴に残っているし、もうだれかに見られたかもしれないのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "まず、その秘密を*無効にして作り直す*。それが先ですわ。AWS 編の「鍵がもれたら」と同じですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'supply', text: "もう1つは、*依存ライブラリ*なのだ。node_modules には、何百ものパッケージが入っているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'supply', focus: 'deep' }, text: "そのどれかに弱点が見つかったり、悪い人に乗っとられたりすると、あなたのアプリまで危なくなりますわ。これを*サプライチェーン攻撃*と言いますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["> npm audit        … 弱点を調べる", "> npm outdated     … 古いものを調べる", "✔ Dependabot などで自動で知らせる", "✔ package-lock.json をコミット", "✔ 名前の似た偽物に注意", "  （vue と vuee など）", "✔ 使っていないものは消す"], text: "守り方なのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「自分で書いていないコードも、自分のアプリの一部なのか」" },
    ],
    next: 'lesson_menu_security',
  },

  lesson_sec_ops: {
    place: { name: 'SEC 07 ログと事故対応', time: '22:12' },
    bg: 'stairs_night',
    bgm: 'tension',
    ambient: 'echo',
    meter: '0.000117',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "どれだけ守っても、事故がゼロになることはないのだ。だから、*気づけること*と、*すぐ動けること*が大事なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_SEC_LOG, text: "気づくためには、ログ。でも、ログそのものが情報もれの原因になることもありますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "「だれが・いつ・何をしたか」の*監査ログ*を残しておくと、あとから何が起きたか調べられるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "ログは、見る人がいなければ意味がありませんの。おかしなことが起きたら知らせるアラームも、セットで用意しますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["事故が起きたら", "1. 広がるのを止める", "   （鍵の無効化・機能の停止）", "2. すぐ上の人とチームに報告", "3. 何が起きたかを記録・調査", "4. 直して、再発を防ぐ", "5. ふりかえり（人を責めない）"], text: "もし事故が起きたら、どう動くかも決めておくのだ。" },
      { speaker: "四国めたん", chara: 'metan_serious', text: "いちばんいけないのは、かくすこと。小さいうちに報告すれば、小さいうちに止められますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ ライブラリとOSを定期的に更新", "✔ 権限は必要な分だけ", "✔ バックアップから戻す練習", "✔ 脆弱性を報告してもらう窓口", "✔ レビューでセキュリティも見る"], text: "ふだんからできることもあるのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「守るのは、作るときだけじゃなくて、動かしているあいだずっとなのか」" },
      { speaker: "ずんだもん", chara: 'zun_gentle', fx: "leak", speed: "slow", text: "セキュリティは、使ってくれる人への思いやりなのだ。キミも、守れる作り手になるのだ。" },
    ],
    next: 'lesson_menu_security',
  },
  lesson_slot: {
    place: { name: 'LESSON 06 スロット', time: '16:55' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000121',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "props では、文字や数字を部品に渡したのだ。でも「この部分には、好きな HTML を入れたい」こともあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'slot', text: "そんなときは*スロット*。部品に「穴」をあけておいて、使う側が中身を差しこみますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'slot', focus: 'child' }, text: "枠の部品は、見た目とレイアウトだけを持つのだ。中身は使う側が決めるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_SLOT, text: "名前つきの穴をいくつも作ることもできますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "ダイアログ、カード、表の1行……。形は同じで中身だけちがう部品は、スロットで作るとすっきりするのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 中身のちがいは slot で", "  見た目のちがいは props で", "✔ 何も入れないときの中身を", "  用意しておく", "✔ 穴を増やしすぎない", "  （使い方がわかりにくくなる）"], text: "スロットのコツですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「枠だけの部品に、好きな中身を入れられるのか」" },
    ],
    next: 'lesson_menu_vue',
  },

  lesson_lifecycle: {
    place: { name: 'LESSON 08 ライフサイクル', time: '16:57' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000122',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'lifecycle', text: "部品には、*作られて、画面に出て、消える*という一生があるのだ。これを*ライフサイクル*っていうのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'lifecycle', focus: 'setup' }, text: "script setup の中身は、部品が作られるときに1回だけ動きますの。まだ画面には出ていませんわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'lifecycle', focus: 'mounted' }, text: "画面に出た直後に動くのが onMounted なのだ。画面の大きさを測ったり、ウィンドウのイベントを見張りはじめたりするのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'lifecycle', focus: 'unmounted' }, text: "そして、いちばん大事なのが onUnmounted。部品が消えるときの*後片付け*ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_LIFECYCLE, text: "このゲームでも、ゲーム画面が出たら Ctrl キーを見張りはじめて、消えたら見張りをやめているのだ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "後片付けを忘れると、画面を何回も出し入れするたびに、見張り番がどんどん増えていくのだ！ メモリリークなのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["onMounted で始めたら", "onUnmounted で止める", "  addEventListener", "    → removeEventListener", "  setInterval → clearInterval", "  setTimeout → clearTimeout", "  fetch → AbortController"], text: "後片付けが必要なものですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「始めたものは、自分で終わらせるのか」" },
    ],
    next: 'lesson_menu_vue',
  },

  lesson_composable: {
    place: { name: 'LESSON 09 コンポーザブル', time: '16:59' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000123',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "同じような処理を、いろいろな部品で使いたいことがあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "そんなときは、ref や computed や関数をまとめて、1つの関数にしますの。それが*コンポーザブル*ですわ。名前は use〇〇 にするのが決まりですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_COMPOSABLE, text: "このゲームでは、「見終わった授業」の記録がそうなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_COMPOSABLE_USE, text: "使う側は、呼んで、ほしいものを受け取るだけですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "ref を関数の*外*に置くと、呼んだ部品どうしで同じ値を共有するのだ。*中*に置くと、呼ぶたびに別々の値になるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "ほかにも、このゲームの音（useSound）や音楽（useMusic）、記録室（useArchive）が、コンポーザブルになっていますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["コンポーザブル", "  ✔ ロジックの使い回し", "  ✔ 小さな共有", "Pinia", "  ✔ アプリ全体の状態", "  ✔ 開発者ツールで中身が見える", "✔ 中身がわかる名前を付ける"], text: "Pinia との使い分けなのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「部品じゃなくて、動きのほうを使い回すのか」" },
    ],
    next: 'lesson_menu_vue',
  },

  lesson_vue_transition: {
    place: { name: 'LESSON 10 Transition', time: '17:01' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000124',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "v-if で出したり消したりすると、ふつうはパッと切りかわるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'vtransition', text: "<Transition> で囲むと、出るとき・消えるときに、Vue が自動で CSS のクラスを付けてくれますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'vtransition', focus: 'enter' }, text: "出はじめは enter-from、出ているあいだは enter-active、消えおわりは leave-to……。このクラスに見た目を書けば、アニメーションになるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_VUE_TRANSITION, text: "このゲームで立ち絵がふわっと出てくるのも、これですのよ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: ":key を変えると、別のものとして入れかわるのだ。だから、キャラが変わったときだけフェードして、表情が変わったときはそのままにできるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "mode=\"out-in\" は「古いほうが消えてから、新しいほうを出す」。重なって見えないようにする指定ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "一覧の並びかえは <TransitionGroup> を使うのだ。このゲームの図の中の選択肢が1つずつ増えるのも、それなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 中に入れるのは1つだけ", "  （複数なら TransitionGroup）", "✔ v-if か v-show か :key で", "  出し入れする", "✔ 動きが苦手な人向けの", "  設定も忘れずに"], text: "Transition のコツですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「クラスの名前さえ覚えれば、CSS だけで動きを付けられるのか」" },
    ],
    next: 'lesson_menu_vue',
  },

  lesson_cssvars: {
    place: { name: 'CSS+ 02 CSS 変数', time: '18:01' },
    bg: 'roof_day',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000125',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "同じ色を、あちこちに何回も書いていると、変えるときに大変なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: [":root {", "  --brand: #ff7b00;", "}", ".button {", "  color: var(--brand);", "}"], text: "そこで *CSS 変数*。-- で始まる名前に値を入れて、var() で使いますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "変数は、親から子へ受けつがれるのだ。だから、親の変数を変えるだけで、中身の色をまとめて変えられるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_CSSVAR, text: "この授業の目次がまさにそう。編ごとに --accent だけを変えて、カードの線も光も番号も色が変わりますの。それに、JS から値を渡すこともできますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "マウスを動かすと舞台が回るのは、JS がマウスの位置を --mx に入れて、CSS がそれを使って回しているのだ。JS と CSS の受けわたしにも使えるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "ダークモードの切りかえも、変数の値を入れかえるだけ。色やすきまを変数にしておくのが、デザインをそろえるコツですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ 色・すきま・角の丸みは変数に", "✔ 名前は役目で付ける", "  （--red より --danger）", "✔ var(--x, 0) で", "  なかったときの値を決める"], text: "CSS 変数のコツなのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「1か所変えれば、全部の色が変わるのか」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_render: {
    place: { name: 'WEB 05 描画のしくみ', time: '17:57' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000126',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'rendering', text: "ブラウザは、HTML と CSS から、どうやって画面を描いているのか。知っていると、「なぜ重いのか」がわかるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'rendering', focus: 'parse' }, text: "まず HTML から DOM を、CSS から「どの要素にどんな見た目か」を作りますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'rendering', focus: 'layout' }, text: "次に*レイアウト*。それぞれの箱の、位置と大きさを計算するのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'rendering', focus: 'composite' }, text: "*ペイント*で色や文字を塗って、最後に*合成*で、重なった層を1枚にまとめますわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'rendering', focus: 'cheap' }, fx: "shake", text: "ここが大事なのだ！ 大きさや位置を変えると、レイアウトからやり直しになるのだ。でも transform や opacity なら、合成だけで済むのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_RENDER, text: "JavaScript でも、読み書きの順番で重さが変わりますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "このゲームの演出も、ほとんど transform と opacity で動かしているのだ。たくさんの粒は Canvas に描いて、要素を増やさないようにしているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["Core Web Vitals", "  LCP … 大事な絵が出るまで", "  INP … 押してから反応まで", "  CLS … 画面のガタつき", "✔ 開発者ツールの Performance", "  で、何に時間を使ったか見る", "✔ 測ってから直す"], text: "仕事で、速さを測るときの目安ですわ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「同じ動きでも、何を動かすかで重さがぜんぜんちがうのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  // ===================================================================
  // Node.js 編
  // ===================================================================


  lesson_node_what: {
    place: { name: 'NODE 01 Node.js とは', time: '20:40' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000131',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'nodeworld', text: "JavaScript は、もともとブラウザの中で動く言葉だったのだ。それを*ブラウザの外*でも動かせるようにしたのが Node.js なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'nodeworld', focus: 'engine' }, text: "言葉そのものは同じ。Chrome と同じ V8 というエンジンで動いていますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'nodeworld', focus: 'node' }, text: "ちがうのは、使える道具なのだ。ブラウザには画面（document）や localStorage があって、Node にはファイル（fs）やサーバー（http）があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'nodeworld', focus: 'browser' }, text: "反対に、Node には画面がありませんから、document や window は使えませんわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "Node.js は、サーバーだけじゃなくて、*道具*を動かすのにも使われているのだ。npm も、Vite も、TypeScript の型チェックも、ぜんぶ Node の上で動いているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_NODE_REAL, text: "このゲームも、ビルドや開発サーバーは Node.js で動いていますのよ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["得意", "  たくさんの通信を同時にさばく", "  （API・チャット・プロキシ）", "  フロントと同じ言葉で書ける", "苦手", "  重い計算（画像処理・機械学習）", "  → 別の言葉やサービスに任せる"], text: "Node が得意なことと、苦手なことなのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「フロントで覚えた JavaScript が、サーバーでも使えるのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_node_modules: {
    place: { name: 'NODE 02 モジュール', time: '20:42' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000132',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "Node.js のモジュールの書き方には、2種類あるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_NODE_MODULES, text: "いまの標準の *ESM*（import / export）と、昔からある *CommonJS*（require / module.exports）ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "package.json に \"type\": \"module\" と書くと、.js のファイルが ESM として読まれるのだ。このゲームも、そう書いてあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "古いライブラリや設定ファイルでは、まだ CommonJS を見かけますわ。ESM から CommonJS は読みこめますが、その逆は少し面倒ですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "組みこみの道具は、node:fs のように node: を付けるのがおすすめなのだ。npm から入れたものと見分けがつくのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 新しく書くなら ESM", "✔ \"type\": \"module\" をそろえる", "✔ 組みこみは node: を付ける", "✔ ESM では __dirname がない", "  → import.meta.dirname を使う"], text: "モジュールのコツですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「同じ import でも、決まりごとが2種類あるのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_node_io: {
    place: { name: 'NODE 03 ノンブロッキング I/O', time: '20:44' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000133',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'nodeloop', text: "JavaScript の手は1本だったのだ。それなのに、Node.js のサーバーは、何千人ものリクエストを同時にさばけるのだ。どうしてなのだ？" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'nodeloop', focus: 'libuv' }, text: "答えは、*待つ仕事を手放す*こと。ファイルを読む・データベースの返事を待つ・通信する……。そういう待ち時間は、OS や裏のスレッドに任せますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'nodeloop', focus: 'queue' }, text: "終わったら、続きの仕事が列に並ぶのだ。メインの手は、待たずに次のリクエストに取りかかれるのだ。非同期 JS 編のイベントループと同じなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_NODE_BLOCKING, text: "だから、手を止めてしまう書き方は、サーバーでは大問題ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "readFileSync みたいに Sync が付いた関数は、終わるまで手が止まるのだ！ その間、ほかのお客さんも全員待たされるのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "起動するときに1回だけ設定を読む、のような場面なら Sync でもかまいません。リクエストのたびに動くところでは、使わないことですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "重い計算も同じなのだ。どうしても必要なら、worker_threads で別の手を借りるか、別のサービスに任せるのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「1本の手でも、待たなければ、たくさんの人をさばけるのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_node_stream: {
    place: { name: 'NODE 04 ストリーム', time: '20:46' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000134',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "大きなファイルを全部メモリに読みこむと、サーバーのメモリがいっぱいになって、落ちてしまうのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'streamflow', text: "そこで*ストリーム*。データを小さなかたまりに分けて、少しずつ流しますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'streamflow', focus: 'pipe' }, text: "読む・圧縮する・送る、をつなげておけば、かたまりが順番に流れていくのだ。メモリは少しだけで済むのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_NODE_STREAM, text: "コードにすると、こうですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "受け取る側が追いつかないときは、読むほうが待ってくれるのだ。これを*背圧*っていうのだ。pipeline を使えば、自動でやってくれるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "HTTP のリクエストもレスポンスも、じつはストリームですの。動画の配信や、大きな CSV の書き出しでよく使いますわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「一気に運ばずに、流れ作業にするのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_node_http: {
    place: { name: 'NODE 05 HTTP サーバーとミドルウェア', time: '20:48' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000135',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_NODE_HTTP, text: "Node.js には、HTTP サーバーの道具が最初から入っているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "でも、URL ごとの振り分けや、JSON の読みこみを全部自分で書くのは大変。だから仕事では、Express・Fastify・Hono などのフレームワークを使いますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: 'middleware', text: "フレームワークの中心にあるのが*ミドルウェア*なのだ。リクエストが、順番に関所を通っていくのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'middleware', focus: 'auth' }, text: "JSON を読む関所、ログを残す関所、ログインを確かめる関所……。どこかで止めれば、そこでおしまいですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'middleware', focus: 'error' }, text: "エラーは、最後の受け皿でまとめて受け止めるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_NODE_MIDDLEWARE, text: "Express のコードでは、こう書きますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "順番がとっても大事なのだ！ ログインの確認を、本番の処理より後に書いたら、確認する前に処理されちゃうのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "Express 5 からは、async の関数で起きたエラーも、自動でエラーの受け皿に届くようになりましたわ。古い 4 では、自分で next(err) を呼ぶ必要がありましたの。" },
      { speaker: "僕", chara: 'metan_smug', text: "「関所を並べる順番が、そのまま守りの順番になるのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_node_errors: {
    place: { name: 'NODE 06 エラーと止まり方', time: '20:50' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000136',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "サーバーのプログラムは、ずっと動き続けるのだ。だから、エラーが起きたときと、止めるときの作法が大事なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_NODE_ERRORS, text: "だれも受け止めなかったエラーは、Node.js のプロセスを落とします。落ちたら、記録して、きちんと終わらせて、作り直してもらうのが基本ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "glitch", text: "エラーを無視して動かし続けると、こわれた状態のまま動いて、もっと大変なことになるのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "作り直す係は、コンテナなら ECS や Kubernetes、サーバーなら systemd や pm2 ですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "止めるときは、新しい受付をやめて、処理中のリクエストを終えてから止まるのだ。バックエンド編の SIGTERM の話なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "そして、終わり方の番号。0 なら成功、それ以外は失敗。CI もコンテナも、この番号で「うまくいったか」を判断しますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 受け止めたら、記録して", "  適切に返す（握りつぶさない）", "✔ 想定外なら、落ちて作り直す", "✔ 予想できる失敗は", "  4xx でていねいに返す", "✔ 失敗したら 0 以外で終わる"], text: "エラー処理のコツなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「落ちないように作るより、落ちても大丈夫なように作るのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_node_tools: {
    place: { name: 'NODE 07 バージョンと道具', time: '20:52' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000137',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "Node.js は、半年ごとに新しい版が出るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "仕事で使うのは *LTS*（長くサポートされる版）。偶数の番号の版が、LTS になりますの。このゲームを作っているパソコンでは、24 を使っていますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_NODE_TOOLS, text: "人によってバージョンがちがうと、「ボクのパソコンでは動くのに」が起きるのだ。だから、チームでそろえるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "nvm・fnm・Volta などの道具を使うと、プロジェクトごとにバージョンを切りかえられますわ。.nvmrc を読んで、自動でそろえてくれますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "最近の Node は、前は別の道具が必要だったことが、最初からできるようになっているのだ。保存したら再起動する --watch、テストの --test、.env を読む --env-file なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ LTS を使う", "✔ サポートが終わる前に上げる", "✔ CI・本番・手元でそろえる", "  （Dockerfile の FROM も）", "✔ 上げたら、テストを全部通す"], text: "Node のバージョンアップの心得ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「道具のバージョンも、チームの約束ごとなのか」" },
      { speaker: "ずんだもん", chara: 'zun_smile', text: "これで、フロントからサーバーまで、同じ JavaScript で書けるのだ！ バックエンド編に進むと、もっと実践的になるのだ。" },
    ],
    next: 'lesson_menu_server',
  },
  lesson_ts_narrow: {
    place: { name: 'TS 04 型の絞りこみ', time: '17:30' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000141',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "union 型は「どれか1つ」だったのだ。でも、使うときには「いまはどれなのか」を知りたいのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'tsnarrow', focus: 'union' }, text: "if や switch で確かめると、TypeScript がその先の型を自動で*絞りこみ*ますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'tsnarrow', focus: 'branch' }, text: "いちばん便利なのは、type のような「見分けるための項目」を全部の形に付けておくことなのだ。*判別可能な union* っていうのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_TS_NARROW, text: "このゲームのカットインの書き方を、型にするとこうですわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'tsnarrow', focus: 'never' }, fx: "shake", text: "最後の never がすごいのだ！ 新しい種類のカットインを足したのに、switch に書きわすれたら、エラーで教えてくれるのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["typeof x === 'string'", "Array.isArray(x)", "'angle' in x", "x instanceof Error", "x !== null"], text: "ほかの絞りこみ方ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「確かめた先では、安心してその項目を使えるのか」" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_ts_util: {
    place: { name: 'TS 05 ユーティリティ型', time: '17:30' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000141',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "同じような型を、何回も書くのはめんどうなのだ。型から型を作る道具があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_TS_UTIL, text: "*ユーティリティ型*。Partial・Pick・Omit・Record あたりは、仕事で毎日のように見ますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "as const を付けると、配列の中身が「ただの文字」じゃなくて、「その文字そのもの」の型になるのだ。そこから union 型を作れるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "satisfies は「この型に合っているか確かめて。でも、細かい型は消さないで」という意味。設定やデータの表を書くときに便利ですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 型の元は1か所にして", "  そこから作る", "✔ 何でも Partial にしない", "  （必須のものは必須に）", "✔ 型パズルに凝りすぎない", "  （読めることが大事）"], text: "型の道具のコツなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「型も、コードと同じで使い回せるのか」" },
    ],
    next: 'lesson_menu_ts',
  },

  lesson_form: {
    place: { name: 'CSS 07 フォーム', time: '17:30' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000141',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "入力してもらう画面、*フォーム*なのだ。ログイン・登録・検索……どのサービスにもあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "大事なのは、<label> と入力欄をつなぐこと。ラベルを押しても入力欄が選ばれますし、読み上げソフトにも名前が伝わりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["type=\"email\"    … @ が出る", "type=\"tel\"      … 数字のキー", "type=\"number\"   … 数だけ", "type=\"password\" … 伏せ字", "type=\"date\"     … カレンダー", "autocomplete=\"email\"", "  … ブラウザの自動入力"], text: "入力の種類を正しく書くと、スマホでぴったりのキーボードが出るのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: PG_FORM, text: "required や pattern を付ければ、ブラウザが送る前にチェックしてくれますの。やってみましょう。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "でも！ ブラウザのチェックは、かんたんにすり抜けられるのだ。サーバーでも必ずチェックするのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ <label for> でつなぐ", "✔ エラーは欄のそばに、", "  何が悪いか具体的に", "✔ 送信中はボタンを押せなく", "  （二重送信を防ぐ）", "✔ 入力した内容を消さない", "✔ チェックはサーバーでも"], text: "フォームのコツですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「入力しやすさも、作る人の仕事なのか」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_a11y: {
    place: { name: 'CSS 08 アクセシビリティ', time: '17:30' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000141',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "画面は、目で見てマウスで使う人だけのものじゃないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "キーボードだけで使う人、読み上げソフトで聞く人、色が見分けにくい人、文字を大きくしている人……。だれでも使えるようにするのが*アクセシビリティ*ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "いちばん大事なのは、*意味に合ったタグ*を使うことなのだ。<button> なら、Tab キーで選べて、Enter で押せて、読み上げで「ボタン」と伝わるのだ。<div> だと、どれも自分で作らないといけないのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: PG_A11Y, text: "直してみましょう。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ Tab キーだけで操作できる", "✔ 選んでいる場所の枠が見える", "✔ 画像に alt（飾りなら alt=\"\"）", "✔ 文字と背景の色の差", "✔ 色だけで情報を伝えない", "✔ 文字を200%にしても崩れない"], text: "チェックするところなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "aria- の属性は、最後の手段。まずはふさわしいタグを使うこと。Lighthouse や axe という道具で、自動でも調べられますわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「<div> を <button> にするだけで、使える人が増えるのか」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_lint: {
    place: { name: 'TOOLS 05 ESLint と Prettier', time: '17:30' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000141',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "人によって書き方がバラバラだと、レビューで「ここに空白を」「セミコロンが」と言い合いになるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_ESLINT, text: "見た目は *Prettier*、まちがいやすい書き方は *ESLint* に任せますの。人は、中身の話に集中できますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "ESLint は、使っていない変数や、await の書きわすれ、Vue のよくないお作法を見つけてくれるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "エディタで保存したときに自動でかけて、CI でも npm run lint を動かす。通らなければマージできないようにしますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ ルールはチームで決めて固定", "✔ 保存時に自動で整える", "✔ CI でも必ず動かす", "✔ 警告を放置しない", "  （増えると全部無視される）", "✔ 無効にするときは理由を書く"], text: "道具のコツなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「書き方の好みは、機械に決めてもらうのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_git: {
    place: { name: 'TOOLS 06 Git と GitHub', time: '17:30' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000141',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "Git は、コードの*歴史*を記録する道具なのだ。いつ・だれが・何を・なぜ変えたかが、全部残るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'gitflow', focus: 'branch' }, text: "チームでは、main に直接書きこまず、*ブランチ*を作って作業しますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'gitflow', focus: 'pr' }, text: "作業がまとまったら、GitHub で*プルリクエスト*を出して、ほかの人に見てもらうのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'gitflow', focus: 'merge' }, text: "CI のテストが通って、レビューで OK が出たら、main にマージ。そのあと自動で公開される……このゲームの GitHub Pages も、この流れですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_GIT, text: "毎日使うコマンドは、だいたいこれなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "同じ場所を2人が変えると*コンフリクト*が起きます。あわてず、両方の変更を見比べて、正しい形に直してからコミットしますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ 1つのコミットに1つの変更", "✔ メッセージに「なぜ」を書く", "✔ PR は小さく（読める量に）", "✔ 秘密を絶対にコミットしない", "✔ main への強制 push はしない", "✔ レビューは人ではなくコードに"], text: "コミットとプルリクエストのコツなのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「歴史が残るから、こわがらずに変えられるのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  // ===================================================================
  // ソフトウェア設計編
  // ===================================================================

  lesson_menu_design: {
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000000',
    lessonMenu: 'design', // components/LessonMenu.vue で目次を出す
    lines: [
      { speaker: "四国めたん", chara: 'metan_smug', text: "*ソフトウェア設計編*ですわ。動くコードの、その先のお話ですの。" },
    ],
    choices: DESIGN_MENU,
  },

  lesson_ds_good: {
    place: { name: 'DESIGN 01 良い設計とは', time: '19:00' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000151',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "動くコードは、だれでもいつかは書けるようになるのだ。でも仕事のコードは、何年も*書きかえられ続ける*のだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "だから設計の目標は、*変えやすいこと*。「ここを直したい」と思ったとき、直す場所がすぐわかって、ほかが壊れないことですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: 'cohesion', text: "そのための2つのものさしが、*凝集*と*結合*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'cohesion', focus: 'high' }, text: "凝集は「1つの部品の中身が、同じ目的でまとまっているか」。高いほどよいですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'cohesion', focus: 'low' }, text: "結合は「部品どうしが、どれだけ深く知り合っているか」なのだ。低いほどよいのだ。相手の中身を知りすぎていると、相手を直したとき、こっちも壊れるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'cohesion', focus: 'bad' }, text: "悪い例も見ておきましょう。なんでも知っている部品、あちこちから同じデータを書きかえる設計……。直すたびに別の場所が壊れますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ 何を直すか、どこを見ればいい？", "✔ 1つ直すと、何か所変わる？", "✔ その部品だけテストできる？", "✔ 名前で中身がわかる？", "✔ 新しい人が読んでわかる？"], text: "いい設計かを確かめる質問なのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「動くかどうかより、直しやすいかどうかなのか」" },
    ],
    next: 'lesson_menu_design',
  },

  lesson_ds_srp: {
    place: { name: 'DESIGN 02 役目を分ける', time: '19:00' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000151',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "設計のいちばんの基本は、*役目を分ける*ことなのだ。1つの部品には、1つの役目なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_DS_SRP, text: "画面・通信・計算・保存が、1つの関数にまざっていると、どれか1つを変えるだけでも全部を読むことになりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "計算の係は、入力から出力を返すだけの*純粋な関数*にしておくのだ。画面も通信もいらないから、テストがとっても簡単なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'layers2', text: "大きく分けると、たいていのアプリは*層*になっていますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'layers2', focus: 'ui' }, text: "画面の層は、見せることと、操作を受け取ることだけなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'layers2', focus: 'domain' }, text: "真ん中に、そのアプリならではの決まりごと。このゲームなら「選び方からエンディングを決める」がそうですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'layers2', focus: 'data' }, text: "いちばん下が、データを取ってくる・しまう層なのだ。API や localStorage なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "上の層は下の層を使ってよいけれど、下から上は呼ばない。この向きを守ると、画面を作りかえても、決まりごとはそのまま使えますの。" },
      { speaker: "僕", chara: 'metan_smug', text: "「係を分けておけば、1人を入れかえても全員は困らないのか」" },
    ],
    next: 'lesson_menu_design',
  },

  lesson_ds_di: {
    place: { name: 'DESIGN 03 依存の向き', time: '19:00' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000151',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "「セーブは localStorage に保存する」と、コードの中に直接書いたとするのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'depinv', focus: 'before' }, text: "あとで「クラウドに保存したい」となったら、セーブに関わる場所を全部書きかえることに。テストのときも、本物の localStorage が必要になりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'depinv', focus: 'after' }, text: "そこで、「保存できるもの」を*外から渡す*のだ。中の処理は「何かに保存する」とだけ知っていて、それが何かは知らないのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_DS_DI, text: "コードにすると、こうですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "これを*依存性の注入*っていうのだ。入れかえられるから、テストではニセモノを渡して、中身を確かめられるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "大事なのは「変わりやすいもの」を、外側に押し出すこと。保存先・通信・時刻・乱数……。こういうものを直接さわる場所を、少なくしますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "でも、なんでもかんでも入れかえられるようにすると、かえって読みにくくなるのだ！ 本当に入れかえるものだけにするのだ。" },
      { speaker: "僕", chara: 'zun_surprise', text: "「直接つながず、つなぎ口を決めておくのか」" },
    ],
    next: 'lesson_menu_design',
  },

  lesson_ds_state: {
    place: { name: 'DESIGN 04 状態の置き場所', time: '19:00' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000151',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "アプリの不具合の多くは、*状態*（いまの値）の置き場所をまちがえることで起きるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'statehome', focus: 'source' }, text: "同じ値を2か所に持つと、片方だけ更新されて、ずれてしまいますの。だから、同じ情報は*1か所*に。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_DS_DERIVED, text: "ほかの値から計算できるものは、持たずに*計算*するのだ。このゲームの「見たエンディングの数」も、覚えているんじゃなくて、記録から毎回数えているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: 'statehome', text: "置き場所の目安ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'statehome', focus: 'local' }, text: "その部品の中だけで使うものは、部品の ref なのだ。入力中の文字や、開いているかどうかなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'statehome', focus: 'server' }, text: "画面をまたいで使うものはストア。サーバーにある本当のデータは、サーバーが持ち主ですわ。画面にあるのは、その写しにすぎませんの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'statehome', focus: 'url' }, text: "URL に入れておくと便利なものもあるのだ。検索の言葉や、何ページ目かなのだ。再読み込みしても消えないし、人に送れるのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「値の持ち主を決めておけば、ずれないのか」" },
    ],
    next: 'lesson_menu_design',
  },

  lesson_ds_data: {
    place: { name: 'DESIGN 05 データで動かす', time: '19:00' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000151',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'datadriven', text: "このゲームの設計の、いちばん大事な考え方を紹介するのだ。*中身はデータ、動かし方はコード*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_DS_DATA, text: "セリフ・選択肢・演出は、ぜんぶ scenario.js というデータ。ゲームのエンジンは、それを読んで画面に出すだけですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'datadriven', focus: 'data' }, text: "だから話を足すときは、データを書くだけなのだ。この授業の100個以上のセリフも、図も、ムービーも、ぜんぶデータなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'datadriven', focus: 'check' }, text: "書き方が決まっているので、データが正しいかを機械で調べることもできますわ。この授業を作るときも、背景の名前や図の名前がまちがっていないか、毎回自動で確かめていましたの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'datadriven', focus: 'engine' }, text: "新しい演出がほしくなったら、エンジンに「fx: leak と書いたら光漏れ」という機能を1つ足すのだ。あとは、どのセリフでも使えるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 書き方の説明を残す", "  （scenario.js の先頭のように）", "✔ データを機械でチェックする", "✔ 何でもデータにしない", "  （複雑な処理はコードで）", "✔ データの形を変えるときは", "  全部をまとめて直す"], text: "気をつけたいところですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「エンジンとシナリオを分けたから、こんなに授業を増やせたのか」" },
    ],
    next: 'lesson_menu_design',
  },

  lesson_ds_principles: {
    place: { name: 'DESIGN 06 原則とアンチパターン', time: '19:00' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000151',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["DRY  同じ知識を2か所に書かない", "KISS できるだけシンプルに", "YAGNI いま要らないものは作らない", "SOLID", "  S 1つの役目", "  O 足すのは楽・中は変えない", "  L 入れかえても動く", "  I 使うものだけ見せる", "  D 具体ではなく約束に頼る"], text: "設計には、昔からの知恵をまとめた*原則*があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "ただし、原則は道具。DRY を守ろうとして、たまたま似ているだけのものを無理にまとめると、かえって直しにくくなりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "「同じ*理由*で変わるものだけをまとめる」のがコツなのだ。見た目が似ていても、変わる理由がちがうなら、別々のままでいいのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["✕ 神クラス", "  何でも知っている巨大な部品", "✕ 早すぎる共通化", "  使い道が1つなのに部品化", "✕ 設定だらけ", "  何でも切りかえられる", "✕ コピペの山", "✕ どこからでも書きかえる値"], text: "よくある悪い形、*アンチパターン*も覚えておきましょう。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "迷ったら、まずはシンプルに書いて、同じことが3回出てきたら、まとめることを考えるのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「原則を守ること自体が目的じゃないのか」" },
    ],
    next: 'lesson_menu_design',
  },

  lesson_ds_arch: {
    place: { name: 'DESIGN 09 アーキテクチャと進め方', time: '19:00' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000151',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'archstyles', text: "アプリ全体の大きな形を、*アーキテクチャ*っていうのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'archstyles', focus: 'mono' }, text: "1つのアプリに全部入れる*モノリス*。わかりやすく、最初はこれで十分ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'archstyles', focus: 'micro' }, text: "機能ごとに別々のサービスに分ける*マイクロサービス*は、チームが大きくなったときに効くのだ。でも、通信・監視・データの整合など、大変なことが一気に増えるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "まずはモノリスの中で、きれいに役目を分けておく。必要になってから分けるのが、仕事ではよくある進め方ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_DS_ADR, text: "大事な設計の判断は、*理由*といっしょに残しておくのだ。ADR（設計判断の記録）なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "そして設計は、一度決めたら終わりではありませんの。動きを変えずに中の作りを直す*リファクタリング*を、少しずつ続けますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ 作る前に、紙や図で考える", "✔ 大事な判断は ADR に残す", "✔ 設計もレビューしてもらう", "✔ リファクタリングは小さく", "  テストで守りながら", "✔ 機能追加とまぜない"], text: "設計を進めるときのコツなのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「設計は、作りながら育てていくものなのか」" },
      { speaker: "ずんだもん", chara: 'zun_gentle', fx: "leak", speed: "slow", text: "このゲームも、最初はもっと小さかったのだ。少しずつ形を変えながら、ここまで来たのだ。" },
    ],
    next: 'lesson_menu_design',
  },

  // ===================================================================
  // 有名なライブラリ編
  // ===================================================================


  lesson_eco_map: {
    place: { name: 'LIB 01 全体の地図', time: '18:30' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000161',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'ecomap', text: "Web の世界には、ライブラリやフレームワークが*星の数ほど*あるのだ。全部覚える必要はないのだ。でも「どれが何をする道具か」の地図があると、会話についていけるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'ecomap', focus: 'front' }, text: "まずは画面を作る道具。React・Vue・Svelte・Angular ですわ。このゲームは Vue ですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'ecomap', focus: 'meta' }, text: "それを土台に、ページや URL やサーバーの処理までまとめたのが、Next.js や Nuxt のような*メタフレームワーク*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'ecomap', focus: 'app' }, text: "Web の技術で、パソコンやスマホのアプリも作れますの。Electron・Tauri・React Native・Capacitor などですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'ecomap', focus: 'server' }, text: "サーバー側には Express・NestJS・Hono、データベースには Prisma や Drizzle があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'ecomap', focus: 'tools' }, text: "そして、作るのを支える道具。Vite でビルド、Vitest や Playwright でテスト、ESLint で点検ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["ライブラリ", "  自分のコードから呼んで使う道具", "  （例：zod・dayjs）", "フレームワーク", "  決まった形に自分のコードを", "  はめこむ土台（例：Nuxt）", "「呼ぶ」か「呼ばれる」かのちがい"], text: "言葉の整理なのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「名前を聞いたら、地図のどこにあるか考えればいいのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_eco_front: {
    place: { name: 'LIB 02 フロントのフレームワーク', time: '18:30' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000161',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_ECO_FRAMEWORKS, text: "画面を作るフレームワークの代表は、4つなのだ。同じ部品を書きくらべてみるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "*React* は Meta（旧 Facebook）が作った、いちばん使われているもの。HTML のような JSX を JavaScript の中に書きますの。仲間の道具や求人がとても多いですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "*Vue* は、このゲームなのだ。HTML・CSS・JS を1つのファイルに分けて書けて、はじめての人にもわかりやすいのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "*Svelte* はコンパイラで、ビルドのときにふつうの JavaScript に変えてしまいますの。動くときの道具が小さく、速いですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "*Angular* は Google が作った、全部入りのフレームワークなのだ。ルーターもフォームも通信も最初から入っていて、大きな会社のシステムでよく使われるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "最近はどれも「値が変わったところだけ画面を書きかえる」しくみ（シグナル）に近づいていますの。1つをしっかり覚えれば、ほかも読めますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["React   … 利用者・情報が最多", "Vue     … わかりやすい・日本で人気", "Svelte  … 小さく速い", "Angular … 全部入り・大規模向け", "どれも「部品＋状態＋画面」"], text: "くらべるとこうなのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「書き方はちがっても、考え方は同じなのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_eco_meta: {
    place: { name: 'LIB 03 メタフレームワーク', time: '18:30' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000161',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["React  → Next.js・Remix", "Vue    → Nuxt", "Svelte → SvelteKit", "どれでも → Astro（記事向き）"], text: "React や Vue だけだと、ページの切りかえやサーバーの処理は、自分で組み合わせることになるのだ。それをまとめてくれるのが*メタフレームワーク*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'rendermode', text: "いちばんの違いは、HTML を*どこで作るか*ですの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'rendermode', focus: 'csr' }, text: "このゲームは *CSR*。空っぽの HTML を送って、ブラウザの JavaScript が画面を作るのだ。ゲームみたいな動く画面に向いているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'rendermode', focus: 'ssr' }, text: "*SSR* は、リクエストのたびにサーバーで HTML を作って送りますわ。最初の表示が速く、検索エンジンにも内容が伝わりますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'rendermode', focus: 'ssg' }, text: "*SSG* は、ビルドのときに HTML を全部作っておくのだ。ブログや説明書のように、あまり変わらないページに向いているのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_ECO_NUXT, text: "Nuxt なら、ファイルを置くだけで URL になり、同じプロジェクトに API まで書けますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ 検索に出したい・速く見せたい", "  → SSR / SSG", "✔ ログイン後の管理画面・ゲーム", "  → CSR でも十分", "✔ ページごとに混ぜられる", "  フレームワークも多い"], text: "選び方なのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「どこで HTML を作るかで、向いているものが変わるのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_eco_desktop: {
    place: { name: 'LIB 04 デスクトップアプリ', time: '18:30' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000161',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'desktop', text: "VS Code・Slack・Discord・Figma のデスクトップ版……。これ、じつは中身が *Web の技術*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'desktop', focus: 'electron' }, text: "代表が *Electron*。Chromium（Chrome の中身）と Node.js を、アプリの中にまるごと入れて配りますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "どのパソコンでも同じ Chrome で動くから、見た目のちがいで困らないのだ。Node.js の道具もそのまま使えるのだ。でも、アプリの大きさが 100MB をこえることも多いし、メモリもたくさん使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_ELECTRON, text: "画面（renderer）と、OS の機能を使う main プロセスに分かれていて、その間を preload という「橋」でつなぎますの。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', diagram: { type: 'desktop', focus: 'bridge' }, fx: "shake", text: "ここは大事なのだ！ 画面から Node.js を直接使えるようにすると、XSS が1つあっただけで、パソコンのファイルを消されたりするのだ！ contextIsolation は必ず有効にして、渡す機能をしぼるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'desktop', focus: 'tauri' }, text: "もう一方が *Tauri*。Chromium を入れずに、OS にもともとある WebView（Windows なら Edge の中身）を使いますの。裏の処理は Rust で書きますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_TAURI, text: "だからアプリがすごく小さいのだ。数 MB くらいで作れることもあるのだ。使ってよい機能を1つずつ許可するしくみで、安全にも気をつかっているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "その代わり、OS ごとに WebView がちがうので、見た目や動きが少しずれることがありますの。Rust を書く人も必要ですわ。Tauri 2 からはスマホにも対応しましたの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["Electron", "  ✔ どこでも同じ表示・情報が多い", "  ✔ 大きい・メモリを使う", "Tauri", "  ✔ 小さい・軽い・許可制", "  ✔ OS で表示が少しちがう", "  ✔ 裏の処理は Rust"], text: "どちらも、このゲームの dist をそのまま中に入れれば、デスクトップアプリにできるのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「Web の画面に、アプリの殻をかぶせているのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_eco_mobile: {
    place: { name: 'LIB 05 スマホアプリ', time: '18:30' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000161',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'mobile', text: "スマホアプリを作る道具も、いろいろあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'mobile', focus: 'rn' }, text: "*React Native* は、React の書き方で、本物のスマホの部品を動かしますの。画面の見た目は iPhone と Android それぞれのものになりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'mobile', focus: 'flutter' }, text: "*Flutter* は Google の道具なのだ。Dart という言葉で書いて、画面を全部自分で描くから、どの機種でも同じ見た目になるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'mobile', focus: 'capacitor' }, text: "*Capacitor* は、Web の画面をそのままアプリの中で表示しますの。今ある Web アプリを、いちばん少ない手間でアプリにできますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'mobile', focus: 'pwa' }, text: "そして *PWA*。アプリストアを通さずに、Web のままホーム画面に置けて、オフラインでも動くようにできるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ すでに Web がある・小さく始める", "  → PWA・Capacitor", "✔ React に慣れたチーム", "  → React Native（Expo）", "✔ 見た目を細かく作りこむ", "  → Flutter", "✔ カメラ・通知など本物の機能が", "  たくさん必要 → ネイティブも検討"], text: "選ぶときの目安ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「Web の知識が、スマホでもかなり使えるのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_eco_ui: {
    place: { name: 'LIB 06 UI・状態・データ取得', time: '18:30' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000161',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "画面の見た目を作る道具も人気なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["<button class=\"px-4 py-2", "  rounded bg-orange-500", "  text-white hover:bg-orange-600\">", "  START", "</button>"], text: "*Tailwind CSS* は、class に「flex」「p-4」「text-lg」のような小さな部品を並べて、見た目を作りますの。CSS ファイルをほとんど書かなくて済みますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "ボタンやダイアログを最初からそろえた*部品集*もあるのだ。Vue なら Vuetify・PrimeVue、React なら MUI・shadcn/ui なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "状態を管理する道具は、Vue なら Pinia（このゲーム）、React なら Redux や Zustand ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_ECO_QUERY, text: "最近とくに大事なのが、*サーバーのデータ*を扱う道具なのだ。読みこみ中・エラー・キャッシュ・取り直しを、全部やってくれるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "非同期 JS 編で自分で書いた「古い結果で上書きしない」なども、こういう道具が面倒を見てくれますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["zod        … データの形を確かめる", "dayjs      … 日付の計算", "VueUse     … 便利なコンポーザブル集", "i18n       … 多言語対応", "Chart.js   … グラフ"], text: "ほかにもよく見る道具なのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「よくある困りごとには、だいたい定番の道具があるのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_eco_server: {
    place: { name: 'LIB 07 サーバーとデータベース', time: '18:30' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000161',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["Express … いちばん古くて定番", "Fastify … 速い・型に強い", "Hono    … 軽い・どこでも動く", "NestJS  … 大きな会社向けの", "          全部入り（Angular 風）"], text: "Node.js のサーバーのフレームワークは、こんな顔ぶれなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "データベースを扱う道具も人気ですわ。*Prisma* はテーブルの形を専用のファイルに書いて、型つきでデータを読み書きできますの。*Drizzle* は SQL に近い書き方で、軽いですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "そして *zod*。送られてきたデータの形を確かめて、TypeScript の型も作ってくれるのだ。セキュリティ編の「送られてきたものは全部うたがう」が、短く書けるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_ECO_SERVER, text: "組み合わせると、こうですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "ログインまわりは、自分で作らずに、Auth.js（NextAuth）や Better Auth、Firebase Authentication、AWS 編の Cognito のような道具やサービスを使うことが多いのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "サーバーを持たずに済ませるなら、*Firebase* や *Supabase* という選択肢もありますわ。データベース・ログイン・ファイル置き場が、まとめて手に入りますの。" },
      { speaker: "僕", chara: 'metan_normal', text: "「サーバー側も、組み合わせ方の定番があるのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_eco_choose: {
    place: { name: 'LIB 08 テストの道具と選び方', time: '18:30' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000161',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "最後は、テストの道具と、ライブラリの選び方なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_ECO_TEST, text: "テストは2種類を組み合わせますの。関数や部品を小さく速く確かめる *Vitest*（や Jest）と、本物のブラウザで画面を操作する *Playwright*（や Cypress）ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "じつは、この授業を作るときも、Playwright で画面を操作して確かめていたのだ。部品の見た目を一覧で確かめる *Storybook* も、よく使われるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "そしてライブラリの選び方。名前が有名かどうかだけで決めないことですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 最近も更新されている？", "✔ 使っている人・情報は多い？", "✔ ドキュメントはわかりやすい？", "✔ 大きさ（重さ）は？", "✔ ライセンスは使える？", "✔ 型（TypeScript）はある？", "✔ 自分で数行で書けない？"], text: "ボクたちが見ているところなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "入れたライブラリは、自分のアプリの一部になります。弱点が見つかれば更新し、使わなくなれば消す。セキュリティ編のサプライチェーンの話ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "流行は毎年変わるのだ。でも、HTTP・JavaScript・設計のような*土台*は、ほとんど変わらないのだ。土台がわかっていれば、新しい道具もすぐ覚えられるのだ。" },
      { speaker: "僕", chara: 'zun_proud', text: "「道具の名前より、何のための道具かを見るのか」" },
      { speaker: "ずんだもん", chara: 'zun_gentle', fx: "leak", speed: "slow", text: "キミが気になった道具から、さわってみるのだ。このゲームも、Electron や Tauri でアプリにできるのだ。" },
    ],
    next: 'lesson_menu_toolslib',
  },

  // ----- 各編に足した授業 -----
  lesson_web_apis: {
    place: { name: 'WEB 07 ブラウザの便利な API', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "ブラウザには、最初から便利な機能（Web API）がたくさん入っているのだ。ライブラリを入れる前に、まずこれを知っておくのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["IntersectionObserver", "  … 画面に見えたら知らせる", "  （画像の遅延読みこみ・無限スクロール）", "ResizeObserver … 大きさの変化", "Clipboard … コピー・貼りつけ", "Notification … 通知", "Geolocation … 位置", "matchMedia … ダーク・動きを減らす"], text: "よく使うものですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "このゲームでも、matchMedia で「動きを減らす」設定を見て、演出を止めているのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "カメラ・位置・通知のような機能は、使う人の*許可*が必要ですわ。しかも、HTTPS のページでないと使えないものが多いですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "使えるかどうかは、ブラウザによってちがうのだ。MDN や Can I use で確かめるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ ライブラリの前に、標準の API", "✔ 許可は、必要になった瞬間に", "  理由がわかる形でお願いする", "✔ 使えないブラウザでも", "  動くようにしておく", "✔ Observer は使い終わったら止める"], text: "コツですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「ブラウザだけで、思ったよりいろいろできるのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_web_pwa: {
    place: { name: 'WEB 08 Service Worker と PWA', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "Web ページなのに、電波がなくても開けて、ホーム画面に置けるのだ。それが *PWA* なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'sworker', text: "しくみの中心は *Service Worker*。ページとネットワークの間に立つ、小さな門番ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'sworker', focus: 'cache' }, text: "ページがリクエストを出すと、まず Service Worker が受け取るのだ。キャッシュにあれば、ネットにつながなくても返せるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "ホーム画面のアイコンや名前は、manifest というファイルに書きますの。Vite なら vite-plugin-pwa が、まとめて作ってくれますわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "でも、キャッシュの更新をまちがえると、いつまでも古い版が出続けるのだ！ HTTP 編のキャッシュの話と同じなのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ HTTPS が必要", "✔ 新しい版が出たら知らせて", "  読みこみ直してもらう", "✔ 何をキャッシュするか決める", "  （API の個人データは慎重に）", "✔ iPhone は機能に制限がある"], text: "気をつけたいことですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「ページとネットの間に、門番を置くのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_http_realtime: {
    place: { name: 'HTTP 08 リアルタイム通信', time: '18:00' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'realtime', text: "HTTP は、ブラウザが聞いて、サーバーが答える形なのだ。でも、チャットや通知のように、*サーバーから*知らせたいこともあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'realtime', focus: 'poll' }, text: "昔は、数秒ごとに「何か来た？」と聞きに行っていましたの（ポーリング）。むだが多いですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'realtime', focus: 'ws' }, text: "*WebSocket* は、1本の接続をつないだままにして、どちらからでも、いつでも送れるのだ。チャットや対戦ゲーム向きなのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'realtime', focus: 'sse' }, text: "*SSE* は、サーバーからブラウザへの一方向。ふつうの HTTP の上で動くので簡単で、切れても自動でつなぎ直しますわ。通知や進み具合、AI の文章が少しずつ出てくる表示にも使われますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', playground: CV_SSE, text: "書き方はこうなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 双方向なら WebSocket", "✔ 一方向なら SSE が簡単", "✔ 切れたときの再接続を考える", "✔ 台数を増やすときは、つなぎ先が", "  ばらばらになる → Redis などで共有", "✔ ログインの確認も忘れずに"], text: "つなぎっぱなしの通信は、サーバーの台数を増やすときに工夫が要りますわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「聞きに行くんじゃなくて、知らせてもらうのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_http_api_styles: {
    place: { name: 'HTTP 09 REST・GraphQL・gRPC', time: '18:00' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "API の形は、REST だけじゃないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["query {", "  me {", "    name", "    endings { id name }", "  }", "}"], text: "*GraphQL* は、1つの入口に「この項目だけほしい」と書いて送りますの。画面ごとに必要なものだけ取れて、取りすぎ・足りなさが減りますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "*gRPC* は、サーバーどうしの通信でよく使うのだ。決めた型にそって、小さく速いデータでやりとりするのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "*tRPC* は、TypeScript だけで作るときに、サーバーの関数をそのまま型つきで呼べる道具ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["REST    … わかりやすい・キャッシュ", "          しやすい・いちばん定番", "GraphQL … 取る項目を選べる", "          画面が多いアプリ向き", "gRPC    … サーバー間・速い", "tRPC    … TS で一体のとき"], text: "くらべるとこうなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "流行より、チームとアプリに合うかで選びますの。迷ったら REST から始めて困りませんわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「API にも、いろいろな形があるのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_css_arch: {
    place: { name: 'CSS 09 CSS の設計', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "CSS は、どこからでもどこにでも効いてしまうのだ。大きくなると「ここを直したら、別の画面が崩れた」が起きるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["BEM … 名前でぶつけない", "  .card__title--large", "scoped（Vue）… 部品の中だけ", "CSS Modules … 名前を自動で変える", "Tailwind … class に直接書く", "@layer … 強さの順番を決める"], text: "そこで、ぶつからないための工夫がいくつもありますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "このゲームは Vue の *scoped* を使っているのだ。部品ごとの CSS が、ほかの部品に効かないのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "ただし、v-html で入れた中身や子の部品の中には効きませんの。そのときは :deep() を使いますわ。このゲームのエディタの色分けも、そうしていますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ やり方を1つに決める", "✔ 全体に効く CSS は最小限", "  （リセット・変数・文字だけ）", "✔ id や深い入れ子で強くしない", "✔ 色やすきまは CSS 変数で"], text: "チームでのコツなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「CSS にも、ぶつからないための設計がいるのか」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_dark: {
    place: { name: 'CSS+ 08 ダークモード', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "OS を暗い見た目にしている人も多いのだ。ページも合わせられるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "@media (prefers-color-scheme: dark) で「暗い設定の人だけ」の CSS を書けますわ。色を CSS 変数にしておけば、変数を入れかえるだけですの。" },
      { speaker: "ずんだもん", chara: 'zun_smile', playground: PG_DARK, text: "やってみるのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "手で切りかえるボタンも付けるなら、html に data-theme=\"dark\" を付けて、そのときも同じ変数を入れかえますの。選んだ設定は localStorage に覚えておきますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 真っ黒・真っ白は目がつかれる", "✔ 画像やロゴも暗い背景で確かめる", "✔ 色の差（コントラスト）を確認", "✔ color-scheme: dark で", "  スクロールバーなども暗く"], text: "気をつけたいところなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「CSS 変数にしておくと、こういうときに楽なのか」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_async_retry: {
    place: { name: 'ASYNC 07 失敗とやり直し', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "通信は、ときどき失敗するのだ。電波が悪い、サーバーが混んでいる……。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "一時的な失敗なら、やり直せば成功することがありますわ。でも、すぐに何度も送り直すと、混んでいるサーバーにとどめを刺してしまいますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', playground: CV_RETRY, text: "だから、*間をだんだん広げながら*、決めた回数だけやり直すのだ。指数バックオフっていうのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "やり直してよいのは、何回送っても結果が同じになる処理だけ。お金の支払いを2回送ったら大変ですわ。そういう処理には、同じリクエストだとわかる番号（べき等キー）を付けますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 5xx・429・通信エラーだけ", "  （4xx は直らない）", "✔ 回数の上限を決める", "✔ 間を広げて、ゆらぎも足す", "✔ べき等でない処理は慎重に", "✔ 最後は利用者にわかる形で伝える"], text: "やり直しの作法なのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「やり直すのにも、礼儀があるのか」" },
    ],
    next: 'lesson_menu_async',
  },

  lesson_async_worker: {
    place: { name: 'ASYNC 08 Web Worker', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "JavaScript の手は1本だったのだ。重い計算をすると、そのあいだ画面が固まるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_WORKER, text: "そんなときは *Web Worker*。別の手（スレッド）を作って、計算をお願いしますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "やりとりはメッセージだけなのだ。Worker は画面（DOM）にはさわれないのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "画像の加工、大きなファイルの解析、暗号の計算などで使いますわ。Comlink という道具を使うと、ふつうの関数のように呼べますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 50ms をこえる計算は分ける", "  （画面がカクつきはじめる）", "✔ やりとりするデータは小さく", "✔ 小さな処理には使わない", "  （準備のほうが重い）"], text: "使いどころなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「1本の手でも、助っ人を呼べるのか」" },
    ],
    next: 'lesson_menu_async',
  },

  lesson_vmodel: {
    place: { name: 'LESSON 05 v-model とフォーム', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "入力欄の文字と ref をつなぐのが *v-model* なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: PG_VMODEL, text: "打てば ref が変わり、ref を変えれば入力欄も変わる。行き来がつながりますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "中身は :value と @input の組み合わせなのだ。自分で作った部品にも v-model を付けられるのだ。defineModel() を使うと、すぐ作れるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: ".trim で前後の空白を消したり、.number で数にしたりもできますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 入力中の値は部品の ref に", "✔ 送るときにまとめてチェック", "✔ 大きなフォームは", "  VeeValidate などの道具も", "✔ チェックはサーバーでも"], text: "フォームのコツなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「入力と値が、自動でいっしょに動くのか」" },
    ],
    next: 'lesson_menu_vue',
  },

  lesson_vue_perf: {
    place: { name: 'LESSON 13 Vue を速くする', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "Vue のアプリが重くなったときに、見直すところがあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "まず、template の中で重い計算を毎回しないこと。computed にすれば、元の値が変わったときだけ計算し直しますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "このゲームでやったように、すぐ使わないページや部品は、*あとから読みこむ*のだ。defineAsyncComponent や () => import() なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["v-show … よく切りかえるもの", "v-once / v-memo", "  … 変わらない部分を固定", "shallowRef … 大きなデータを", "  中まで見張らない", "長い一覧 … 見える分だけ描く", "  （仮想スクロール）"], text: "ほかの道具ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "でも、かんで直すのはダメなのだ。Vue Devtools や Performance で、本当に遅いところを測ってから直すのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「速くする道具はあるけど、まず測るのか」" },
    ],
    next: 'lesson_menu_vue',
  },

  lesson_ds_test: {
    place: { name: 'DESIGN 07 テストしやすい設計', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "テストしにくいコードは、たいてい設計にも問題があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_TESTABLE, text: "時刻・乱数・通信・保存……。変わりやすいものを中で直接使うと、テストのたびに結果が変わってしまいますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: 'testpyramid', text: "テストは、形で考えるのだ。*テストピラミッド*なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'testpyramid', focus: 'unit' }, text: "下は、小さく速い単体テストをたくさん。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'testpyramid', focus: 'e2e' }, text: "上は、本物のブラウザで動かす E2E テストを、大事な流れだけ少し。遅くて、こわれやすいのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 中の作りではなく、ふるまいを", "  確かめる", "✔ 1つのテストで1つのこと", "✔ 失敗したら原因がわかる名前", "✔ 不具合を直すときは", "  先にそのテストを書く"], text: "テストのコツですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「テストしやすくすると、設計もよくなるのか」" },
    ],
    next: 'lesson_menu_design',
  },

  lesson_ds_naming: {
    place: { name: 'DESIGN 08 名前とコメント', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "コードは、書く時間より*読まれる*時間のほうがずっと長いのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✕ data・info・tmp・flag", "◯ endingsSeenCount", "◯ isLastLine（真偽は is・has）", "◯ loadSave（関数は動詞から）", "✔ 同じものに同じ名前", "✔ 略しすぎない"], text: "名前は、中身を説明するいちばん短い文書ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "コメントには、*なぜ*を書くのだ。何をしているかは、コードを読めばわかるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "このゲームのコメントも、「hidden だとずれることがあるので clip にする」のように、理由を書いていますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ なぜ・注意点を書く", "✕ コードの言いかえ", "✕ 古くなったコメント", "✕ コメントアウトしたコードの山", "  （Git に残っている）"], text: "コメントのコツなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「名前を考えることも、設計の一部なのか」" },
    ],
    next: 'lesson_menu_design',
  },

  lesson_cicd: {
    place: { name: 'TOOLS 09 CI/CD', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: 'cicd', text: "push するたびに、自動でテストして、ビルドして、公開する。それが *CI/CD* なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: { type: 'cicd', focus: 'ci' }, text: "CI は「まぜる前に自動で確かめる」。lint・型チェック・テストを動かして、だめならマージさせませんの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'cicd', focus: 'cd' }, text: "CD は「自動で届ける」なのだ。このゲームも、main に push したら GitHub Pages に公開されるようにしてあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', playground: CV_CI_REAL, text: "その設定ファイルが、これですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 速く終わるようにする", "  （キャッシュ・並列）", "✔ 失敗をそのままにしない", "✔ 秘密は Secrets に", "  （コードに書かない）", "✔ 本番の前に確認用の環境", "✔ すぐ前の版に戻せるように"], text: "CI のコツなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「人が手でやると忘れることを、機械が毎回やってくれるのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_monorepo: {
    place: { name: 'TOOLS 10 パッケージ管理とモノレポ', time: '18:00' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["npm  … Node に最初から入っている", "pnpm … 速い・ディスクを節約", "       （同じものを1つだけ置く）", "yarn … 昔から人気", "bun  … とても速い・実行環境も"], text: "npm のほかにも、パッケージを入れる道具があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "どれを使うかはチームで1つに決めますの。lock ファイルがまざると、入る中身がずれますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "フロント・バックエンド・共通の部品を、1つのリポジトリにまとめるのが*モノレポ*なのだ。ワークスペースという機能で、中のパッケージどうしを使えるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "型を共有できて、変更を1つのプルリクエストにまとめられますの。大きくなったら Turborepo や Nx で、ビルドを速くしますわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 道具はチームで1つに", "✔ lock ファイルは1種類だけ", "✔ モノレポは CI が重くなりがち", "  → 変わったところだけ動かす"], text: "気をつけたいところなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「道具の選び方も、チームの約束なのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_be_paging: {
    place: { name: 'BE 10 一覧と検索', time: '18:00' },
    bg: 'classroom_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "ランキングが何万件にもなったら、全部を一度に返すわけにはいかないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_PAGING, text: "少しずつ返す*ページング*。やり方は2つありますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "ページ番号のやり方は、わかりやすいけど、奥のページほど遅くなるのだ。とちゅうでデータが増えると、同じものが2回出たりもするのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "*カーソル*のやり方は「前回の最後」から続きを取るので、どこでも速く、ずれませんわ。無限スクロールにぴったりですの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "文字で検索する機能を作るなら、データベースの LIKE '%ずんだ%' は遅いのだ。全文検索や、Elasticsearch・OpenSearch のような専用の道具を使うのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 1回の上限を決める", "  （limit は 100 まで など）", "✔ 並び順を必ず決める", "✔ 条件に使う列にインデックス", "✔ 合計の件数は重いことがある"], text: "一覧の API のコツですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「たくさんのデータは、少しずつ渡すのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_be_observability: {
    place: { name: 'BE 11 可観測性', time: '18:00' },
    bg: 'classroom_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "本番で「なんだか遅い」と言われたとき、どこが遅いのか、わからないと直せないのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', diagram: 'observe', text: "中のようすを外から見えるようにすること。それが*可観測性*ですわ。3本の柱がありますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', diagram: { type: 'observe', focus: 'logs' }, text: "*ログ*は「何が起きたか」の記録なのだ。JSON で、リクエストごとの番号を付けておくのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', diagram: { type: 'observe', focus: 'metrics' }, text: "*メトリクス*は数字の変化。リクエストの数・エラーの割合・かかった時間ですわ。アラームはこれを見ますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', diagram: { type: 'observe', focus: 'traces' }, text: "*トレース*は、1つのリクエストが、どのサービスで、どれだけ時間を使ったかをつないで見るのだ。OpenTelemetry という共通の道具があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ エラーの割合", "✔ かかった時間（平均より p95・p99）", "✔ リクエストの数", "✔ CPU・メモリ", "✔ 目標（SLO）を決めて見張る"], text: "よく見る数字ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「動いているあいだも、ようすが見えるようにするのか」" },
    ],
    next: 'lesson_menu_server',
  },

  lesson_sec_threat: {
    place: { name: 'SEC 08 脅威モデリング', time: '18:00' },
    bg: 'lab_night',
    bgm: 'tension',
    ambient: 'echo',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "セキュリティは、作ってから考えると高くつくのだ。*作る前に*「どう攻められるか」を考えるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "それが*脅威モデリング*。データの流れを図にして、守るもの・入口・境界を書き出しますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["S なりすまし", "T 改ざん", "R やってないと言い張る", "I 情報もれ", "D 使えなくする（DoS）", "E 権限を勝手に上げる"], text: "考えるきっかけには、STRIDE という6つの観点が便利なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "たとえば「セーブの API」なら……他人のふりで呼べないか、中身を書きかえられないか、他人のセーブが見えないか、大量に呼ばれたら？ と1つずつ考えますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ 設計レビューのときに一緒に", "✔ 完璧をめざさず、大きい順に", "✔ 対策と、残すリスクを記録", "✔ 機能が変わったら見直す"], text: "進め方のコツなのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「守り方の前に、攻め方を想像するのか」" },
    ],
    next: 'lesson_menu_security',
  },

  lesson_aws_s3more: {
    place: { name: 'AWS 10 S3 くわしく', time: '18:00' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "S3 は、静的なサイトを置くだけじゃないのだ。利用者がアップロードした画像や、ログ、バックアップの置き場所にもなるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_PRESIGN, text: "大事なのは、S3 を公開しないまま、必要な人にだけ使わせること。そのための*署名付き URL* ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "ファイルがサーバーを通らないから、サーバーが重くならないのだ。URL は数分で使えなくなるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', terminal: ["バージョニング", "  … 上書き・削除から戻せる", "ライフサイクル", "  … 古いものを安い保存先へ・削除", "暗号化 … 最初から有効", "パブリックアクセスのブロック", "  … アカウント全体で有効に"], text: "ほかにも便利な機能がありますわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "S3 を「みんなが見られる」設定にしたまま、個人情報を置いてしまう事故は、本当に多いのだ！" },
      { speaker: "僕", chara: 'zun_surprise', text: "「置き場所は公開せず、鍵を短く貸すのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_eco_graphics: {
    place: { name: 'LIB 09 グラフィックスの道具', time: '18:00' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["Canvas 2D … このゲームの粒・トンネル", "Three.js  … 3D の定番（WebGL）", "PixiJS    … 2D を GPU で速く", "Babylon.js … 3D ゲーム向け", "D3.js     … データのグラフ", "GSAP      … アニメーション"], text: "このゲームの演出は、CSS と Canvas で作っているのだ。もっと本格的な絵や 3D には、専用の道具があるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', playground: CV_THREE, text: "Three.js なら、こんなふうに 3D の舞台を作れますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "Vue と組み合わせるなら TresJS、React なら React Three Fiber という道具もあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "新しい WebGPU という仕組みも、使えるブラウザが増えてきましたわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ ちょっとした動き → CSS", "✔ たくさんの粒・線 → Canvas", "✔ 3D・大量の絵 → WebGL の道具", "✔ スマホの電池と重さに注意"], text: "選び方なのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「表現したいものの大きさで、道具を選ぶのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  lesson_eco_ai: {
    place: { name: 'LIB 10 AI を組みこむ道具', time: '18:00' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.000171',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "最近は、アプリに AI（大規模言語モデル）を組みこむことも増えたのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "各社が JavaScript の SDK を出していて、API を呼ぶと文章が返ってきますの。SSE で少しずつ受け取れば、文字がだんだん出てくる表示にもできますわ。" },
      { speaker: "ずんだもん", chara: 'zun_surprise', fx: "shake", text: "ここで大事なのは、API キーを*ブラウザに置かない*ことなのだ！ VITE_ の変数に入れたら、だれでも使えてしまうのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "必ずバックエンドを通して呼びますの。セキュリティ編の秘密の話と同じですわ。" },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ キーはサーバーだけに", "✔ 使う量と料金に上限を", "✔ 個人情報を送ってよいか確認", "✔ 答えがまちがうこともある", "  → 大事な判断は人が確かめる", "✔ 入力で指示を書きかえられる", "  （プロンプトインジェクション）"], text: "気をつけたいことなのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "このゲームの授業も、AI といっしょに作ったものですのよ。最後に人が確かめる、というのが大事ですわ。" },
      { speaker: "僕", chara: 'metan_normal', text: "「便利な道具ほど、使い方の約束が大事なのか」" },
    ],
    next: 'lesson_menu_toolslib',
  },

  // ===================================================================
  // CSS はじめて編（いちばんやさしいところから）
  // ===================================================================


  lesson_c0_first: {
    place: { name: 'CSS0 01 CSS ってなに？', time: '16:10' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000181',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "Web のページは、HTML と CSS でできているのだ。HTML は「何を書くか」、CSS は「どう見せるか」なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "たとえば「この文字を赤くしたい」「大きくしたい」。そういうお願いを書くのが CSS ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["p {", "  color: red;", "}", "", "p     … どこを（<p> の文字を）", "color … 何を（文字の色を）", "red   … どうする（赤に）"], text: "書き方は、いつもこの形なのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "最後の ; （セミコロン）を忘れずに。{ } で囲むのも大事ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', playground: PG_C0_FIRST, text: "さっそく、やってみるのだ！" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "色が変わったのだ？ キミはもう、CSS を書いたのだ！" },
      { speaker: "僕", chara: 'zun_proud', text: "「1行変えるだけで、見た目が変わるのか」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_c0_text: {
    place: { name: 'CSS0 02 文字の見た目', time: '16:10' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000181',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["font-size   … 大きさ（16px など）", "font-weight … 太さ（bold で太字）", "text-align  … そろえ方", "  left（左）・center（まん中）", "  right（右）", "line-height … 行と行のあいだ"], text: "文字の見た目を変えるお願いは、いくつかあるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "px（ピクセル）は、画面の点の数。16px が、ふつうの文字の大きさくらいですわ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', playground: PG_C0_TEXT, text: "見出しを大きくして、まん中にそろえてみるのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "line-height を 1.8 くらいにすると、長い文章が読みやすくなりますのよ。このゲームのセリフも、そうしていますの。" },
      { speaker: "僕", chara: 'metan_smug', text: "「文字の大きさと並び方だけで、だいぶ雰囲気が変わる」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_c0_color: {
    place: { name: 'CSS0 03 色の書き方', time: '16:10' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000181',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "色の書き方は、3つ覚えれば大丈夫なのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "いちばん簡単なのは、*名前*で書くこと。red・blue・green・orange……。英語の色の名前が、140くらい使えますわ。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["#ff7b00", "  ff … 赤（いっぱい）", "  7b … 緑（半分くらい）", "  00 … 青（なし）", "→ オレンジ色"], text: "*#ff7b00* みたいな書き方は、赤・緑・青の強さを、2けたずつ並べたものなのだ。00 がいちばん弱くて、ff がいちばん強いのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "*rgb(77, 160, 60)* は同じことを、0〜255 の数で書きますの。こちらのほうが読みやすいかもしれませんわ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', playground: PG_C0_COLOR, text: "数字をいじって、色を変えてみるのだ！" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "色は、自分で数字を考えなくてもいいのだ。エディタやブラウザの開発者ツールに、色を選ぶ道具があるのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「色は、赤と緑と青のまぜ方なのか」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_c0_box: {
    place: { name: 'CSS0 04 背景と枠', time: '16:10' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000181',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["background    … 背景の色", "border        … 枠線", "  3px solid green", "  （太さ・線の種類・色）", "border-radius … 角を丸く"], text: "文字だけじゃなくて、まわりにも色や枠をつけられるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "border は「太さ・線の種類・色」を、空白で区切って並べて書きますの。solid は実線、dashed は点線ですわ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', playground: PG_C0_BOX, text: "カードみたいにしてみるのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "border-radius を大きくすると、角が丸くなりますの。このゲームの目次の番号の丸も、border-radius: 50% ですのよ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「背景と枠をつけると、ボタンやカードっぽくなるのか」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_c0_space: {
    place: { name: 'CSS0 05 すきまを作る', time: '16:10' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000181',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "文字が枠にぴったりくっついていると、きゅうくつに見えるのだ。すきまを作るのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["padding … 内側（枠と文字のあいだ）", "margin  … 外側（となりとのあいだ）", "", "margin-bottom … 下だけ", "padding-left  … 左だけ"], text: "すきまは2種類。*padding* は、枠の*内側*のすきま。*margin* は、枠の*外側*のすきまですわ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', playground: PG_C0_SPACE, text: "ふきだしに、すきまを作ってみるのだ！" },
      { speaker: "ずんだもん", chara: 'zun_proud', text: "padding で中がゆったりして、margin でふきだしどうしがはなれたのだ。" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "もっとくわしく知りたくなったら、HTML・CSS 編の「ボックスモデル」へどうぞ。" },
      { speaker: "僕", chara: 'metan_smug', text: "「内側は padding、外側は margin」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_c0_size: {
    place: { name: 'CSS0 06 大きさを決める', time: '16:10' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000181',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "箱の大きさは、*width*（横はば）と *height*（高さ）で決めるのだ。" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["width: 120px … いつも 120 点ぶん", "width: 50%   … 外の箱の半分", "height: 30px … 高さ"], text: "px で書くと、いつも同じ大きさ。% で書くと、外側の箱にくらべて何% か、になりますわ。" },
      { speaker: "ずんだもん", chara: 'zun_smile', playground: PG_C0_SIZE, text: "体力ゲージの長さを変えてみるのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "% にしておくと、画面が広くてもせまくても、ちょうどよくのびちぢみしますの。" },
      { speaker: "ずんだもん", chara: 'zun_normal', text: "高さは、できるだけ決めないのがコツなのだ。中の文字が増えたとき、はみ出してしまうのだ。" },
      { speaker: "僕", chara: 'zun_normal', text: "「決まった大きさは px、合わせたい大きさは %」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  lesson_c0_class: {
    place: { name: 'CSS0 07 class で選ぶ', time: '16:10' },
    bg: 'classroom_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000181',
    lines: [
      { speaker: "ずんだもん", chara: 'zun_normal', text: "p { } と書くと、*全部の* <p> に効いてしまうのだ。「この行だけ」変えたいときは、どうするのだ？" },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["<p class=\"zun\">…</p>", "", ".zun {", "  color: green;", "}", "→ class=\"zun\" の行だけ緑"], text: "HTML のタグに *class=\"名前\"* という名札を付けて、CSS では . （ドット）を付けて選びますの。" },
      { speaker: "ずんだもん", chara: 'zun_smile', playground: PG_C0_CLASS, text: "めたんのセリフにも名札を付けて、色を変えてみるのだ！" },
      { speaker: "四国めたん", chara: 'metan_smug', text: "1つのタグに、名札をいくつも付けられますわ。class=\"bubble metan\" のように、空白で区切りますの。" },
      { speaker: "ずんだもん", chara: 'zun_proud', terminal: ["✔ セレクタ { プロパティ: 値; }", "✔ 文字：font-size・font-weight", "✔ 色：名前・#・rgb", "✔ 背景と枠：background・border", "✔ すきま：padding・margin", "✔ 大きさ：width・height", "✔ 名札：class と .名前"], text: "これで、CSS の基本はおしまいなのだ！" },
      { speaker: "四国めたん", chara: 'metan_normal', text: "次は「HTML・CSS」編で、並べ方や重ね方を学んでみてくださいな。" },
      { speaker: "僕", chara: 'metan_normal', text: "「名札を付ければ、好きな場所だけ変えられるのか」" },
    ],
    next: 'lesson_menu_htmlcss',
  },

  // ----- インターネット・ブラウザのしくみ -----
  lesson_net_internet: {
    place: { name: 'NET 01 インターネットとは', time: '15:01' },
    bg: 'lab_night',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000191',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'internet', text: "インターネットは、1本の大きなケーブルじゃないのだ。家・会社・学校・データセンターの*小さなネットワークが、たくさんつながったもの*なのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'internet', focus: 'isp' }, text: "家のネットワークは、Wi-Fi のルーターから、プロバイダー（ISP）につながります。ISP どうしがつながって、世界中に届きますの。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'internet', focus: 'router' }, text: "データは、小さな*パケット*に分けて送るのだ。1つ1つに「あて先」が書いてあって、途中のルーターがバケツリレーで運ぶのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', text: "道は1本ではありませんの。混んでいたり切れていたりしたら、別の道を通りますわ。だから、どこかがこわれても、全体は止まりにくいんですの。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "海の底には、大陸どうしをつなぐ*海底ケーブル*が通っているのだ。日本からアメリカのサーバーまでも、光でほんの一瞬なのだ。" },
      { speaker: '僕', chara: 'zun_normal', text: "「インターネットは、ネットワークどうしのつながりなのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_net_ip: {
    place: { name: 'NET 02 IP アドレスとポート', time: '15:02' },
    bg: 'lab_night',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000191',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["IPv4：20.27.177.113", "  （0〜255 を4つ・約43億通り）", "IPv6：2001:db8::1", "  （ほぼ無限・足りなくなった", "   IPv4 の代わり）"], text: "パケットのあて先は、*IP アドレス*という番号なのだ。インターネット上の住所なのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: 'nat', text: "家の中のパソコンやスマホは、192.168.〇〇 のような*プライベート IP* を使っていて、外に出るときにルーターが1つの住所にまとめますの。これを NAT と言いますわ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', terminal: ["80   … HTTP", "443  … HTTPS", "22   … SSH", "5432 … PostgreSQL", "5173 … Vite の開発サーバー", "3000 … よく使う API の番号"], text: "そして、住所の中の「どの部屋か」が*ポート番号*なのだ。1台のサーバーで、いろいろなサービスを動かせるのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', text: "バックエンド編のセキュリティグループや Docker の ports も、このポートの話でしたのよ。" },
      { speaker: '僕', chara: 'metan_smug', text: "「住所が IP アドレスで、部屋番号がポートなのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_net_tcp: {
    place: { name: 'NET 03 TCP と UDP', time: '15:03' },
    bg: 'lab_night',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000191',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "パケットは、とちゅうでなくなったり、順番が入れかわったりすることがあるのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: 'tcphand', text: "*TCP* は、それを全部面倒みてくれる約束。最初にあいさつをして、届いたかを確かめ、なくなったら送り直し、順番もそろえますの。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'tcphand', focus: 'syn' }, text: "最初のあいさつは3回なのだ。「つないでいい？」「いいよ、こっちも」「了解」。*3ウェイハンドシェイク*なのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', text: "*UDP* は、確かめずにどんどん送る約束。少しなくなってもいいから速さがほしい、動画通話やゲーム、DNS で使いますわ。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "HTTP/1.1 と HTTP/2 は TCP の上、HTTP/3 は UDP の上の QUIC で動いているのだ。HTTP 編の話とつながったのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ["TCP … 確実・順番どおり", "      Web・メール・ファイル", "UDP … 速い・確かめない", "      通話・ゲーム・DNS", "QUIC … UDP の上で TCP の", "       よいところを作り直した"], text: "くらべるとこうですわ。" },
      { speaker: '僕', chara: 'metan_normal', text: "「確実さと速さの、どちらをとるかなのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_net_dns: {
    place: { name: 'NET 04 DNS くわしく', time: '15:04' },
    bg: 'lab_night',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000191',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'dnsresolve', text: "人は github.com のような*名前*で覚えるけど、パケットには IP アドレスが必要なのだ。名前を住所に変えるのが *DNS* なのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'dnsresolve', focus: 'q1' }, text: "パソコンは、まずプロバイダーなどの*リゾルバー*に聞きますの。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'dnsresolve', focus: 'q3' }, text: "リゾルバーは知らなかったら、ルート → .com の係 → github.com の係、と順番にたずねていくのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'dnsresolve', focus: 'a' }, text: "答えは、決められた時間（TTL）のあいだ、あちこちでキャッシュされますわ。だから DNS を変えても、すぐには全員に伝わりませんの。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["A     … 名前 → IPv4", "AAAA  … 名前 → IPv6", "CNAME … 名前 → 別の名前", "MX    … メールの届け先", "TXT   … 持ち主の確認など"], text: "DNS には、いろいろな種類の記録（レコード）があるのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_NET_DIG, text: "コマンドで、実際に調べられますわ。" },
      { speaker: 'ずんだもん', chara: 'zun_surprise', fx: "shake", text: "サイトを引っ越すときは、前もって TTL を短くしておくのだ。そうしないと、古い住所に行く人がしばらく残るのだ！" },
      { speaker: '僕', chara: 'zun_surprise', text: "「名前で覚えた住所を、毎回だれかが調べてくれていたのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_net_layers: {
    place: { name: 'NET 05 階層と速さ', time: '15:05' },
    bg: 'lab_night',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000191',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'netlayers', text: "ネットワークの約束は、*層*になっているのだ。それぞれの層が、自分の仕事だけをするのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'netlayers', focus: 'app' }, text: "いちばん上がアプリの約束（HTTP・DNS）。その下が届け方（TCP・UDP）、住所（IP）、そして実際の電線や電波（イーサネット・Wi-Fi）ですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'netlayers', focus: 'link' }, text: "送るときは、上から順番に「封筒」に入れていくのだ。受け取る側は、下から順番に開けていくのだ。だから Wi-Fi でも有線でも、HTTP はそのまま使えるのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ["遅延（ms）… 道の長さ", "  東京→東京 数ms", "  東京→アメリカ 100ms 以上", "帯域（Mbps）… 道の太さ", "  動画や大きなファイルに効く"], text: "速さには2種類ありますの。*遅延*（行って帰るまでの時間）と、*帯域*（一度に運べる量）。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "Web ページは小さなファイルをたくさん取りに行くから、帯域より*遅延*がきくことが多いのだ。だから CDN で、近くの場所から配るのだ。" },
      { speaker: '僕', chara: 'zun_normal', text: "「近くに置くだけで速くなるのは、道が短くなるからなのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_br_parts: {
    place: { name: 'BROWSER 01 ブラウザの部品', time: '15:01' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000191',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'browserparts', text: "ブラウザは、いくつもの部品の組み合わせなのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'browserparts', focus: 'render' }, text: "HTML と CSS を読んで画面にするのが*レンダリングエンジン*。Chrome と Edge は Blink、Firefox は Gecko、Safari は WebKit ですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'browserparts', focus: 'js' }, text: "JavaScript を動かすのが *JS エンジン*なのだ。Chrome の V8、Firefox の SpiderMonkey、Safari の JavaScriptCore なのだ。Node.js の中身も V8 なのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'browserparts', focus: 'net' }, text: "ほかにも、通信の部品、Cookie やキャッシュをしまう部品、アドレスバーやタブの UI がありますの。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "iPhone では、どのブラウザも中身は WebKit なのだ。だから「iPhone の Chrome」でも、Safari と同じ不具合が出ることがあるのだ。" },
      { speaker: '僕', chara: 'zun_normal', text: "「同じ HTML でも、ブラウザによって読む部品がちがうのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_br_process: {
    place: { name: 'BROWSER 02 タブとサンドボックス', time: '15:02' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000191',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "タブが1つ固まっても、ほかのタブは動き続けるのだ。どうしてなのだ？" },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: 'processes', text: "いまのブラウザは、タブやサイトごとに、別々の*プロセス*で動かしていますの。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'processes', focus: 'sandbox' }, text: "しかも、ページを動かすプロセスは*サンドボックス*（砂場）の中に閉じこめられているのだ。パソコンのファイルを勝手に読んだりできないのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'processes', focus: 'site' }, text: "さらに、サイトがちがえばプロセスも分ける*サイト分離*。悪いサイトが、同じブラウザで開いている銀行のページのメモリを、のぞけないようにしていますの。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "だから、ブラウザはメモリをたくさん使うのだ。安全と引きかえなのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', text: "Electron の回で「画面から Node.js を使わせない」と話したのも、この砂場を守るためでしたのよ。" },
      { speaker: '僕', chara: 'metan_normal', text: "「ブラウザは、ページを砂場に閉じこめて守っているのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_br_loading: {
    place: { name: 'BROWSER 03 読みこみの順番', time: '15:03' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000191',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "ブラウザは、HTML を上から順に読みながら、必要なファイルを取りに行くのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'loadorder', focus: 'block' }, text: "ところが、ふつうの <script> に出会うと、HTML を読むのを止めて、ダウンロードと実行を待ちますの。画面がなかなか出ない原因ですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'loadorder', focus: 'defer' }, text: "defer を付ければ、ダウンロードは並行して、HTML を読み終わってから実行するのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_SCRIPT_LOAD, text: "書き方をまとめると、こうですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "CSS も、読みこみ終わるまで画面を描かないのだ。チラつきを防ぐためなのだ。だから、大事な CSS は小さく、先に読ませるのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', text: "このゲームの index.html も、フォントのサーバーに preconnect で先につないでおいて、main.js は type=\"module\" で読みこんでいますの。" },
      { speaker: '僕', chara: 'metan_normal', text: "「読む順番を工夫するだけで、画面が早く出るのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_br_storage: {
    place: { name: 'BROWSER 04 ブラウザの保存場所', time: '15:04' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000191',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["HTTP キャッシュ … ファイルのコピー", "Cookie … 毎回サーバーに送る小さな札", "localStorage … 文字（5MB くらい）", "sessionStorage … タブを閉じると消える", "IndexedDB … 大きなデータ・ファイル", "Cache Storage … Service Worker 用"], text: "ブラウザは、いろいろな場所にデータをしまっているのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', text: "開発者ツールの Application タブで、全部の中身が見られますわ。このゲームのセーブも、localStorage にありますの。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: "戻るボタンで一瞬で前のページが出るのは、*bfcache* なのだ。ページをまるごと、しばらくメモリに取っておくのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', text: "どれも、そのブラウザの中だけ。消されることもありますの。シークレットモードや、空き容量が少ないとき、Safari では使われないサイトのデータが消されることもありますわ。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["✔ 大事なデータはサーバーにも", "✔ ログインは HttpOnly の Cookie", "✔ 小さな設定は localStorage", "✔ 大きなデータは IndexedDB", "✔ 消えても困らないように作る"], text: "使い分けのコツなのだ。" },
      { speaker: '僕', chara: 'zun_normal', text: "「ブラウザの中にも、いろいろな引き出しがあるのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  lesson_br_standards: {
    place: { name: 'BROWSER 05 標準とブラウザのちがい', time: '15:05' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000191',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "HTML や CSS や JavaScript のルールは、だれが決めているのだ？" },
      { speaker: '四国めたん', chara: 'metan_normal', text: "HTML や DOM は WHATWG、CSS は W3C、JavaScript は TC39 という集まりが、*標準*として決めていますの。ブラウザの会社も参加していますわ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: "新しい機能は、ブラウザごとに使えるようになる時期がちがうのだ。使う前に、MDN や Can I use で確かめるのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', text: "まだ使えないブラウザのために、同じ動きをまねるコード（ポリフィル）を足すこともありますわ。Baseline という目安で「主なブラウザで使えるか」もわかりますの。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["✔ 使う前に Can I use", "✔ Chrome だけで確かめない", "  （Safari・Firefox も）", "✔ 使えないときの代わりを用意", "✔ ブラウザの種類で分けず、", "  機能があるかで分ける"], text: "ブラウザのちがいで困らないためのコツなのだ。" },
      { speaker: '僕', chara: 'zun_normal', text: "「Web は、みんなで決めたルールの上に立っているのか」" },
    ],
    next: 'lesson_menu_webhttp',
  },

  // ----- よく使うサービス -----
  lesson_svc_map: {
    place: { name: 'SERVICE 01 サービスの地図', time: '20:41' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000201',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'svcmap', text: "アプリを作るとき、全部を自分で作る必要はないのだ。よくある機能は、*サービス*として借りられるのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'svcmap', focus: 'baas' }, text: "データベースやログインをまとめて借りるのが Firebase や Supabase。公開の場所なら Vercel や Netlify ですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'svcmap', focus: 'pay' }, text: "支払いは Stripe、メールは Resend や SendGrid、エラーの見張りは Sentry なのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ["借りる前に見ること", "✔ 無料の範囲と料金", "✔ データの置き場所（国）", "✔ やめるときに持ち出せるか", "✔ 止まったときの影響"], text: "借りれば早く作れますが、料金がかかり、そのサービスから引っ越しにくくなりますの（ベンダーロックイン）。" },
      { speaker: '僕', chara: 'metan_smug', text: "「全部作らずに、借りられるところは借りるのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_svc_baas: {
    place: { name: 'SERVICE 02 Firebase と Supabase', time: '20:42' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000201',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'baas', text: "*Firebase* は Google のサービスなのだ。ログイン・データベース・ファイル置き場・関数・公開の場所が、まとめて使えるのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_FIREBASE, text: "画面から直接データベースを読み書きできますの。サーバーを作らなくていいので、小さなアプリならとても早く作れますわ。" },
      { speaker: 'ずんだもん', chara: 'zun_surprise', diagram: { type: 'baas', focus: 'rules' }, fx: "shake", text: "でも、画面から直接さわれるということは、*だれでも*さわれるということなのだ！ セキュリティルールを書かないと、全員のデータが丸見えなのだ！" },
      { speaker: '四国めたん', chara: 'metan_smug', text: "*Supabase* は、その仲間で、中身が PostgreSQL ですの。SQL が使えて、守りは行ごとのルール（RLS）で書きますわ。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["Firebase … Google・NoSQL", "  スマホアプリにも強い", "Supabase … PostgreSQL・SQL", "  自分のサーバーにも置ける", "どちらも：ルールを必ず書く"], text: "くらべるとこうなのだ。" },
      { speaker: '僕', chara: 'zun_normal', text: "「サーバーがいらないぶん、守りはルールで書くのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_svc_hosting: {
    place: { name: 'SERVICE 03 公開の場所', time: '20:43' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000201',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["GitHub Pages … 静的なサイト（このゲーム）", "Vercel   … Next.js の会社・簡単", "Netlify  … 静的＋関数", "Cloudflare Pages … 速い CDN", "Firebase Hosting", "AWS（S3＋CloudFront）… 自由"], text: "作った Web アプリを置く場所も、いろいろあるのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', text: "Vercel や Netlify は、GitHub につなぐだけで、push するたびに自動で公開してくれますの。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: "プルリクエストごとに*プレビュー用の URL* を作ってくれるのが便利なのだ。レビューする人が、実際に動くものを見られるのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', text: "世界中の近い場所で小さな処理を動かす*エッジ*の機能もありますわ。Cloudflare Workers などですの。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["✔ 静的なサイト → どれでも OK", "✔ Next.js → Vercel が楽", "✔ 細かく管理したい → AWS", "✔ 無料の範囲・転送量に注意"], text: "選び方なのだ。" },
      { speaker: '僕', chara: 'zun_normal', text: "「置く場所によって、できることがちがうのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_svc_pay: {
    place: { name: 'SERVICE 04 支払い・メール・ログイン', time: '20:44' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000201',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["支払い … Stripe・PAY.JP", "メール … Resend・SendGrid・SES", "ログイン … Auth0・Clerk・Cognito", "           Firebase Auth"], text: "お金・メール・ログインは、自分で作ると大変で、まちがえるとこわいのだ。だから専門のサービスを借りるのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: 'webhook', text: "大事なのが *Webhook*。「支払いが終わりましたよ」と、サービスのほうから、あなたのサーバーに知らせてくれますの。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'webhook', focus: 'notify' }, text: "画面の「支払い完了」を信じてはいけないのだ。Webhook で本物の知らせが来てから、アイテムを渡すのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_WEBHOOK, text: "知らせが本物の Stripe からか、署名で確かめますわ。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: "カード番号は、自分のサーバーに通さないのだ。Stripe の画面や部品に入力してもらうのだ。" },
      { speaker: '僕', chara: 'zun_normal', text: "「お金とログインは、専門家に任せるのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  lesson_svc_monitor: {
    place: { name: 'SERVICE 05 見張りと分析', time: '20:45' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    meter: '0.000201',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["Sentry … エラーを集めて知らせる", "Datadog・New Relic … 全体の見張り", "Google Analytics … どう使われたか", "Slack … 知らせを受け取る場所", "PagerDuty … 夜中の呼び出し"], text: "公開したあとに、どこでエラーが出ているか、どう使われているかを知る道具なのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', text: "*Sentry* を入れておくと、ユーザーの画面で起きたエラーが、どのコードの何行目か、どのブラウザかまで届きますの。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: "知らせは Slack に流して、チームで気づけるようにするのだ。" },
      { speaker: '四国めたん', chara: 'metan_smug', text: "分析の道具を入れるときは、何を集めるかを決めて、個人情報を送らないこと。Cookie の同意が必要な国もありますわ。" },
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ["✔ エラーの見張りは最初から入れる", "✔ 知らせは多すぎると無視される", "✔ 個人情報を送らない", "✔ 料金は量で増えるので上限を"], text: "コツなのだ。" },
      { speaker: '僕', chara: 'zun_normal', text: "「公開したあとも、ようすを見ていないといけないのか」" },
    ],
    next: 'lesson_menu_aws',
  },

  // ===================================================================
  // Web の道具編
  // ===================================================================

  // ----- HTML・CSS・JavaScript -----
  lesson_web: {
    place: { name: 'TOOLS 01 HTML・CSS・JS', time: '17:10' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000011',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'まずは基本なのだ。Web ページは、*3つの材料*でできているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'web', focus: 'html' }, text: 'HTML は*骨組み*なのだ。「ここに見出し」「ここにボタン」って、何があるかを書くのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'web', focus: 'css' }, text: 'CSS は*見た目*。色や大きさ、どこに置くか。メッセージ欄のオレンジの枠も CSS ですわ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_CSS, text: 'メッセージ欄の CSS を、のぞいてみますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'web', focus: 'js' }, text: 'JavaScript は*動き*なのだ。クリックしたらセリフが進む、みたいなことを書くのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'web', focus: 'browser' }, text: 'ブラウザは、この3つを読みこんで画面を作りますの。どんなに大きなゲームでも、最後はこの3つになりますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', playground: PG_WEB, text: '3つの材料を、さわってみるのだ。見た目を変えるのは CSS の役目なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['<template>  … HTML（骨組み）', '<script>    … JavaScript（動き）', '<style>     … CSS（見た目）'], text: 'Vue の .vue ファイルにあった3つの区切りも、ちょうどこの3つに分かれていますのよ。' },
      { speaker: '僕', chara: 'metan_normal', text: '「じゃあ Vue は、この3つを書きやすくしてくれる道具なのか」' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 意味に合ったタグを使う", "  （ボタンは <button>）", "✔ 画像には alt を書く", "✔ キーボードだけでも", "  操作できるようにする", "  → アクセシビリティ"], text: "仕事で意識したいことですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'flash', text: 'そういうことなのだ！' },
    ],
    next: 'lesson_menu_toolslib',
  },

  // ----- npm -----
  lesson_npm: {
    place: { name: 'TOOLS 02 npm', time: '17:12' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000012',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'Vue も Pinia も、ボクたちが作ったものじゃないのだ。世界中の人が作った*道具*を借りているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'npm', focus: 'registry' }, text: 'その道具がしまってある、巨大な*倉庫*が npm なのだ。道具のことは「パッケージ」って呼ぶのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_PKG, text: 'どの道具を借りるかは、package.json というファイルに*リスト*にして書いてありますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'npm', focus: 'pkg' }, text: '数字はバージョンなのだ。「vue の 3.5.43 くらいを使う」って意味なのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', diagram: { type: 'npm', focus: 'install' }, text: 'npm install と打つと、リストを読んで、倉庫から道具をまとめて取ってきてくれますの。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'npm', focus: 'nm' }, text: '取ってきた道具は、node_modules というフォルダに入るのだ。中身はものすごく多いけど、自分では触らなくていいのだ。' },
      { speaker: '僕', chara: 'zun_smile', text: '「リストさえあれば、誰のパソコンでも同じ道具がそろうのか」' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ package-lock.json はコミット", "✔ CI では npm ci を使う", "  （lock どおりに入れる）", "✔ ^3.5.43 は 3.5.43 以上 4 未満", "✔ npm audit で弱点を確認", "✔ 知らないパッケージを", "  気軽に入れない"], text: "npm の仕事での作法なのだ。" },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['"scripts": {', '  "dev": "vite",', '  "build": "vite build",', '  "preview": "vite preview"', '}'], text: 'package.json には、よく使う命令のあだ名も書けますわ。npm run dev は「vite を動かして」という意味ですの。' },
    ],
    next: 'lesson_menu_toolslib',
  },

  // ----- import -----
  lesson_modules: {
    place: { name: 'TOOLS 03 import', time: '17:14' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000013',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'このゲームは、何十個ものファイルに分かれているのだ。ファイルどうしは *import* でつながっているのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_INDEX, diagram: { type: 'modules', focus: 'index' }, text: 'いちばん最初にブラウザが開くのは index.html。中身はほとんど空っぽで、main.js を読みこむ一行があるだけですわ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_MAIN, text: 'main.js が、Vue や router を import して、アプリを組み立てていますの。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'modules', focus: 'import' }, text: 'import は「あのファイルの、あれを借りてくる」っていう意味なのだ。借りた先でも、また import しているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'modules', focus: 'views' }, text: 'こうやってたどっていくと、最後はタイトル画面やゲーム画面にたどり着くのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_EXPORT, text: '反対に、ファイルの中身を外に貸すときは export と書きますわ。lessons.js も export で、この授業のセリフを貸していますの。' },
      { speaker: '僕', chara: 'metan_normal', text: '「export で貸して、import で借りる」' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 名前付き export が無難", "  （名前がそろう・探しやすい）", "✔ ファイルどうしが", "  たがいに import しあう", "  「循環参照」に注意", "✔ 1ファイルに1つの役目"], text: "分け方のコツですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_smile', fx: 'burst', text: 'それでファイルを分けても、ちゃんと1つのゲームとして動くのだ！' },
    ],
    next: 'lesson_menu_toolslib',
  },

  // ----- Vite の開発サーバー -----
  lesson_dev: {
    place: { name: 'TOOLS 04 Vite', time: '17:16' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000014',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '作っているあいだに使う、いちばん大事な道具が *Vite（ヴィート）*なのだ。フランス語で「速い」って意味なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', terminal: ['> npm run dev', '', '  VITE v8.3.1  ready in 312 ms', '', '  ➜  Local: http://localhost:5173/'], text: 'npm run dev と打つと、自分のパソコンの中に、小さな*お試し用のサーバー*が立ち上がりますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'dev', focus: 'cmd' }, text: '表示された URL をブラウザで開くと、作りかけのゲームが遊べるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', diagram: { type: 'dev', focus: 'edit' }, text: 'すごいのはここからなのだ。scenario.js のセリフを書きかえて保存すると……' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', fx: 'flash', diagram: { type: 'dev', focus: 'browser' }, text: 'ページを読みこみ直さなくても、*一瞬で*画面に映るのだ！ これを HMR って呼ぶのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', playground: CV_HMR, text: 'このゲームでは、ストアを書きかえたときも差し替わるように、こんな一文を足してありますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'dev', focus: 'vite' }, text: '.vue ファイルは、本当はブラウザには読めないのだ。Vite が、その場で読める形に変えて渡してくれているのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_VITECONFIG, text: 'その仕事を Vite に頼んでいるのが、vite.config.js ですわ。' },
      { speaker: "四国めたん", chara: 'metan_serious', terminal: ["✔ 設定は .env に書く", "✔ VITE_ で始まる変数は", "  ブラウザに公開される", "  → 秘密のキーを入れない", "✔ .env は Git に入れない", "  .env.example をコミット"], text: "仕事でとても大事な、環境変数の話ですわ。" },
      { speaker: '僕', chara: 'zun_normal', text: '「書いて、保存して、すぐ見る。だから試しながら作れるのか」' },
    ],
    next: 'lesson_menu_toolslib',
  },

  // ----- ビルド -----
  lesson_build: {
    place: { name: 'TOOLS 07 build', time: '17:18' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000015',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'お試し用のサーバーは、自分のパソコンの中だけのものなのだ。みんなに配るには、*ビルド*が必要なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'build', focus: 'src' }, text: 'src の中のファイルは、人が読みやすいように分けて書いた形。ブラウザにとっては、ばらばらで読みにくいのですわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'build', focus: 'build' }, text: 'npm run build と打つと、Vite が全部をまとめて、ブラウザが読める HTML・CSS・JavaScript に変えてくれるのだ。' },
      { speaker: '四国めたん', chara: 'metan_smug', terminal: ['> npm run build', 'dist/index.html             0.9 kB', 'dist/assets/index-xxxx.css   83 kB', 'dist/assets/index-xxxx.js   275 kB', '✓ built in 0.33s'], text: 'できあがりは dist というフォルダに入りますの。何十個もあったファイルが、ほんの数個になりますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', playground: CV_DIST_INDEX, text: 'できあがった index.html を見ると、読みこむファイルが変わっているのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: { type: 'build', focus: 'dist' }, text: 'xxxx のところは、中身が変わるたびに変わる名前なのだ。古いファイルが残って、昔のゲームが出ちゃうのを防いでいるのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'build', focus: 'public' }, text: 'public の中の画像や動画は、変換せずにそのまま dist にコピーされますの。技術解説のページも、ここに置いてありますわ。' },
      { speaker: '僕', chara: 'metan_normal', text: '「作るときは src、配るときは dist」' },
      { speaker: "ずんだもん", chara: 'zun_normal', terminal: ["✔ ファイルの大きさを見張る", "  （重いとスマホで遅い）", "✔ 使うときだけ読みこむ", "  （このゲームの授業も、", "  TECH DOCS で読みこむ）", "✔ ソースマップの公開に注意"], text: "ビルドで見ておきたいところなのだ。" },
      { speaker: 'ずんだもん', chara: 'zun_smile', fx: 'flash', text: 'そうなのだ！ npm run preview で、できあがった dist をお試しで開くこともできるのだ。' },
    ],
    next: 'lesson_menu_toolslib',
  },

  // ----- 公開 -----
  lesson_deploy: {
    place: { name: 'TOOLS 08 deploy', time: '17:20' },
    bg: 'lab_evening',
    bgm: 'day',
    ambient: 'dust',
    meter: '0.000016',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_normal', text: '最後は、作ったゲームを*みんなに遊んでもらう*方法なのだ。' },
      { speaker: '四国めたん', chara: 'metan_normal', diagram: { type: 'deploy', focus: 'server' }, text: 'dist フォルダを、インターネットにつながった*サーバー*に置きますの。これを公開（デプロイ）と言いますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', diagram: { type: 'deploy', focus: 'user' }, text: 'そうすると、スマホでもパソコンでも、URL を開くだけで遊べるのだ。インストールはいらないのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', text: 'GitHub Pages のように、こういう*静的なファイル*を無料で置ける場所もありますのよ。' },
      { speaker: '四国めたん', chara: 'metan_normal', playground: CV_BASE, text: 'ただし、URL の途中のフォルダに置くときは、vite.config.js にその場所（base）を書いておく必要がありますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', diagram: 'deploy', text: 'それを忘れると、画像やプログラムが見つからなくて、まっ白な画面になっちゃうのだ。' },
      { speaker: '僕', chara: 'zun_normal', text: '「書いて、試して、まとめて、置く。それで誰かのスマホに届くのか」' },
      { speaker: "四国めたん", chara: 'metan_normal', terminal: ["✔ 手作業でアップしない", "  → CI/CD で自動化", "✔ 本番の前に確認用の環境", "✔ 何かあったら、すぐ前の版に", "  戻せるようにしておく", "✔ AWS 編・バックエンド編も見てね"], text: "公開の作法ですわ。" },
      { speaker: 'ずんだもん', chara: 'zun_gentle', fx: 'leak', speed: 'slow', text: 'キミの作ったものが、知らない誰かの放課後に届くのだ。……すごいことなのだ。' },
    ],
    next: 'lesson_menu_toolslib',
  },

  // ----- おしまい -----
  lesson_end: {
    finish: true, // 最後のセリフのあと、タイトルへ戻る
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    meter: '0.409431',
    lines: [
      { speaker: 'ずんだもん', chara: 'zun_proud', text: '今日の授業はここまでなのだ！' },
      { speaker: '四国めたん', chara: 'metan_normal', text: 'もっと詳しく知りたいなら、public/tech.html に、くわしい解説をまとめてありますわ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', text: 'それから、src/data/scenario.js を開いてみるのだ。セリフを1行書きかえるだけで、ゲームの話が変わるのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', fx: 'leak', speed: 'slow', text: 'キミも、*自分の世界線*を作ってみるのだ。' },
    ],
  },
}

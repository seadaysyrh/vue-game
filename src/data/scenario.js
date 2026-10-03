// ===== シナリオデータ =====
// ゲームの「中身」はここだけに書く。コードを触らずに話を増やせるようにするため。
//
// シーンの書き方：
//   bg      : 背景画像の名前（public/images/bg/〇〇.webp）
//   meter   : 画面右上の〈観測計〉に表示する数字。変わるとパラパラ回転する
//   glitch  : true なら、このシーンに入るとき画面がノイズで乱れる
//   movie   : このシーンに入るとき再生するムービー（data/movies.js）
//   lines   : セリフの配列
//             speaker（名前）、chara（立ち絵 public/images/chara/〇〇.png）、text（本文）
//             echo: true を付けると、立ち絵が透けて光る「残響」になる
//             still: 'promise' のように書くと、スチル（1枚絵 public/images/still/）を表示する
//             fx: 'shake' / 'flash' / 'glitch' で、そのセリフのときに画面効果を出す
//             speaker が 'SYSTEM' のときは、機械のログ風の見た目になる
//   choices : 最後のセリフのあとに出す選択肢。何番目を選んだかで、エンディングが決まる
//             secret: true の選択肢は、8つのエンディングをすべて見たあとにだけ現れる
//   next    : 選択肢がないとき、次に進むシーンの ID
//   end     : true ならこのシーンのあとエンディングへ
//   title / summary : 選択肢のあるシーンに付ける。世界線の分岐図（RouteView）で表示する
//   place   : 場所と時刻のテロップ { name, time }
//   bgm     : BGM の名前（composables/useMusic.js）  'evening' | 'night' | 'echo' | 'tension'
//   ambient : 空気感の粒子（components/AmbientLayer.vue） 'dust' | 'stars' | 'echo' | 'rain'
//   choiceStyle : 'message' なら選択肢をスマホの送信画面で出す
//   weather : 'rain' なら雨の音が鳴る（雨粒の見た目は ambient: 'rain'）
//   chapter : 章の始まりに出すチャプターカード { no, title, sub }
//   handheld: true なら手持ちカメラのように揺れ続ける / light: 光の筋 'sunset' | 'moon'
//   セリフの scan: { name, rows: [[項目, 値, ゲージ0〜1], …], alert } … キャラの顔に照準が付き、解析データが出る
//   セリフの terminal: ['> コマンド', 'ログ', …] … 空中にホログラムの端末が浮かび、ログが打ちこまれる
//   fx: 'rewrite' … 光の線が走り、通りすぎたところから世界が書き換わる
//   セリフの camera: 'close'（寄る） | 'push'（じわじわ寄る） | 'dutch'（傾ける） | 'pan'（横に流す）
//                   3D：'orbit'（回りこむ） | 'crane'（上から降りてくる） | 'vertigo'（背景だけが遠のく、めまいショット）
//   セリフの fx: 'burst'（集中線） | 'shockwave'（衝撃波） | 'meter'（観測計の大写し） | 'shake' | 'flash' | 'glitch'
//   セリフの cinema: true … 画面中央に大きく出す字幕
//   セリフの fx には、さらに 'whip'（ホイップパン） | 'zoom'（クラッシュズーム） | 'leak'（光漏れ） | 'rack'（ピント送り）
//   セリフの cutin: 'eyes'（目のアップ） | 'face'（顔のアップ） | { type: 'split', left: {chara, echo}, right: {chara, echo} }
//                  { type: 'diagonal', angle }（斜めの帯） | { type: 'vertical', side, focus }（縦の帯で片目）
//                  { type: 'triptych' }（縦3本：左目・口・右目） | { type: 'slash', left, right }（斜め2本で2人の目）
//   セリフの phone: スマホの画面（components/effects/PhoneScreen.vue）。本文の {choice0} は1回目に選んだ文章になる
//   grade : 色調補正 'warm' | 'teal' | 'cold' | 'bleach'    scope: true … 映画の黒帯
//           （grade・light・handheld・ambient・scope は、セリフに書いても効く。そのセリフだけ上書きされる）
// ----- 演出の台本（セリフごと） -----
//   beat  : セリフが始まる前の「間」（ミリ秒）。沈黙が、次の言葉を重くする
//   speed : 'slow'（かみしめるように） | 'fast'
//   music : 音楽の演技 'cut'（ぷつっと消える） | 'muffle'（こもる） | 'duck'（小さく） | 'swell'（ふくらむ） | 'normal'
//   sfx   : 効果音 'heartbeat'（心臓の音） | 'tinnitus'（耳鳴り）
//   ghost : 誰もいない場所に、そのキャラの残像だけを出す（不在のカット）
//   scope : 'wide' … 黒帯がさらに広がる（感情の山場）
//   movie : そのセリフに来たとき1回だけ流すムービー（走馬灯など）
//   investigate : 調査パート。文字を出し終わると、背景の気になる場所をクリックして調べる画面になる
//                 { need: 見つける手がかりの数, hotspots: [{ id, x, y, w, h（背景の絵の中の%）, label, text, clue }] }
//   timer : シーンに付けると、選択肢が制限時間つきになる { seconds, default（時間切れで選ばれる番号） }
//   replay: true … エンディングを1つでも見たあと（2周目以降）だけ出るセリフ
//   本文の {runs} は「この屋上に来るのは何回目か」（見たエンディングの数 + 1）になる
//   phone の vanish: true … 届いた通知が、少しあとで跡形もなく消える
//   bgm   : セリフに付けると、そこから曲が変わる（シーンが変わるまで続く）
//   kinetic: true … cinema の決めゼリフモード（巨大な文字が跳ねて、後ろで光が回る）
//   when  : 条件。選び方（path）に合うときだけ、そのセリフを出す
//           '0' … 1回目の選択で0番 ／ '?1' … 2回目の選択で1番（?はどちらでも）／ '10' … 1回目が1番・2回目が0番
//   本文の *ことば* は光る強調、~ことば~ はふるえる文字（utils/richText.js）

const FIRST_METER = '0.409431' // 元の世界の観測値
const SHIFTED_METER = '1.130205' // 変わってしまった世界の観測値

export const scenes = {
  // ===================================================================
  // 第1章：ふたりの研究会（日常と伏線）
  // ===================================================================
  lunch: {
    chapter: { no: '01', title: 'ふたりの研究会', sub: 'OBSERVED 0.409431' },
    place: { name: '屋上', time: '12:35' },
    bg: 'roof_day',
    bgm: 'day',
    ambient: 'dust',
    meter: FIRST_METER,
    lines: [
      { speaker: '', chara: null, camera: 'drift', beat: 700, text: '昼休みの屋上。フェンスの向こうで、雲がゆっくり流れていく。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', fx: 'burst', text: 'あったのだ！ 購買の、*最後のずんだ餅*なのだ！' },
      { speaker: '', chara: 'zun_smile', text: '息を切らして駆けてきたのは、同じクラスのずんだもん。僕たち「時間工学研究会」の部長だ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: '半分こしてあげるのだ。部員への福利厚生なのだ。' },
      { speaker: '僕', chara: 'zun_proud', text: '「部員、僕しかいないけどな」' },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'そこなのだ。……これ、見てほしいのだ。' },
      { speaker: '', chara: 'zun_normal', text: '差し出された紙には、生徒会の印が押してあった。' },
      { speaker: '', chara: null, fx: 'zoom', cinema: true, text: '『部員二名以下の部は、今週金曜をもって*廃部*とする』' },
      { speaker: 'ずんだもん', chara: 'zun_sad', text: '金曜までに、すごい成果を見せないといけないのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'burst', camera: 'push', text: 'だから今日、完成させるのだ。ボクの最高傑作——過去改変装置*〈リライター〉*を！' },
      { speaker: '僕', chara: 'zun_proud', text: '「過去を変える装置で部活を救うって、話が大きすぎないか」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', text: '大きいほうがワクワクするのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', cutin: { type: 'vertical', side: 'left', focus: 'eye-left' }, beat: 1000, speed: 'slow', music: 'duck', text: '……ねえ。もしボクがいなくなっても、キミはひとりで研究会を続けてくれるのだ？' },
      { speaker: '僕', chara: 'zun_gentle', text: '「縁起でもないこと言うなよ」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', music: 'normal', text: 'えへへ。冗談なのだ。放課後、部室で待ってるのだ！' },
      { speaker: '', chara: 'metan_normal', fx: 'glitch', beat: 600, text: '——屋上の扉の陰に、白いドレスの少女が立っていた。' },
      { speaker: '', chara: null, ghost: 'metan_normal', speed: 'slow', text: 'まばたきすると、もう誰もいなかった。' },
    ],
    next: 'start',
  },

  start: {
    title: '放課後の部室',
    summary: '過去改変装置〈リライター〉が完成。最初のメッセージを、昨日の自分に送る。',
    place: { name: '物理準備室', time: '16:48' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    light: 'sunset',
    grade: 'warm',
    meter: FIRST_METER,
    choiceStyle: 'message',
    lines: [
      { speaker: '', chara: null, camera: 'drift', beat: 700, text: '放課後の物理準備室。ここは僕とずんだもん、二人だけの「時間工学研究会」だ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'burst', camera: 'push', text: '待ってたのだ！ ついに完成したのだ、過去改変装置*〈リライター〉*！' },
      { speaker: '', chara: 'zun_proud', text: '古いスマホに、手巻きのコイルと真空管。……枝豆の鞘がテープで貼ってあるのは、たぶん飾りだ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', terminal: ['> rewriter --boot', 'COIL ......... 98.1 kHz  OK', 'VACUUM TUBE .. WARM      OK', 'TARGET ....... T-24:00:00', 'PAYLOAD ...... 36 bytes MAX', '> READY'], text: 'このスマホから*「昨日の自分」*に、一言だけメッセージを送れる……はずなのだ。' },
      { speaker: '僕', chara: 'zun_normal', text: '「昨日の自分に何を送れば、廃部を止められるんだ？」' },
      { speaker: 'ずんだもん', chara: 'zun_proud', scan: { name: 'ZUNDAMON', rows: [['ROLE', '発明担当（自称天才）'], ['WORLD LINE', '0.409431'], ['EXISTENCE', '100.0%', 1]] }, text: 'それを考えるのがキミの仕事なのだ。ボクは天才だから、作る担当なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', cutin: 'eyes', fx: 'zoom', text: 'な、なんなのだその顔！ ボクの発明を疑ってるのだ!?' },
      { speaker: '', chara: 'zun_normal', camera: 'pan', text: '壁の〈観測計〉は *0.409431*。ずんだもんいわく「この世界の座標」らしい。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'ただし注意なのだ。過去が変わると、今の世界も変わってしまうかもしれないのだ。' },
      { speaker: '僕', chara: 'zun_normal', text: '「変わるって、どのくらい？」' },
      { speaker: 'ずんだもん', chara: 'zun_proud', text: 'さあ？ やってみないとわからないのが、実験なのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_smile', still: 'promise', fx: 'leak', text: '最初のメッセージは、キミに決めさせてあげるのだ。' },
    ],
    choices: [
      { text: '『明日の小テストの答えは全部B』', next: 'shift' },
      { text: '『ずんだもんに、ありがとうって言え』', next: 'shift' },
    ],
  },

  shift: {
    place: { name: '物理準備室', time: '19:02' },
    bg: 'lab_night',
    bgm: 'night',
    ambient: 'stars',
    handheld: true,
    grade: 'cold',
    meter: SHIFTED_METER,
    movie: 'shift',
    lines: [
      { speaker: 'SYSTEM', chara: null, text: '> SEND ………… OK' },
      { speaker: '', chara: null, fx: 'rewrite', text: '視界が、壊れたテレビみたいにブレた。' },
      {
        speaker: '',
        chara: null,
        phone: {
          mode: 'lock',
          time: '19:02',
          date: '10月1日 木曜日',
          notices: [
            { app: 'REWRITER', title: '送信完了 → 昨日 16:52', body: '{choice0}' },
            { app: 'SYSTEM', title: '観測値が更新されました', body: '0.409431 → 1.130205' },
          ],
        },
        text: 'ポケットのスマホが、震えた。',
      },
      { speaker: '', chara: null, fx: 'meter', text: '気がつくと、窓の外は真っ暗になっていた。観測計の数字が、*変わっている*。' },
      {
        speaker: '',
        chara: null,
        phone: { mode: 'thread', contact: '昨日の自分', bubbles: [{ from: 'me', text: '{choice0}', time: '昨日 16:52 既読' }] },
        text: '送り先は「昨日の自分」。メッセージには、*既読*が付いていた。',
      },
      { speaker: '', chara: null, when: '0', speed: 'slow', text: '……「全部B」。昨日の僕は、こんなふざけたメッセージを信じたんだろうか。' },
      { speaker: '', chara: null, when: '1', speed: 'slow', text: '……「ありがとう」。昨日の僕は、それを誰に言ったんだろう。' },
      { speaker: '', chara: null, ghost: 'zun_normal', beat: 900, speed: 'slow', music: 'duck', text: '「ずんだもん……？」 返事はない。装置も、どこにもない。' },
      { speaker: '', chara: null, camera: 'drift', text: '棚を見る。枝豆のキーホルダーも、作りかけの基板も。ずんだもんの物が、ひとつもない。' },
      {
        speaker: '',
        chara: null,
        text: '……本当に、何も残っていないのか？ 部室を調べよう。',
        investigate: {
          need: 3,
          hotspots: [
            { id: 'shelf', x: 13, y: 40, w: 22, h: 24, label: '棚', clue: true, text: '棚の端に、丸く日焼けしていない跡がある。……枝豆のキーホルダーを、いつもかけていた場所だ。' },
            { id: 'board', x: 1, y: 20, w: 17, h: 18, label: 'ホワイトボード', clue: true, text: '消したはずの文字が、うっすら残っている。「部長 ず」——そこで途切れていた。' },
            { id: 'window', x: 45, y: 25, w: 25, h: 30, label: '窓', clue: true, text: '窓ガラスに、内側から小さな指の跡。僕よりずっと背の低い誰かが、外を眺めていたみたいに。' },
            { id: 'chairs', x: 38, y: 58, w: 32, h: 17, label: '椅子', clue: true, text: '椅子が二脚。……部員一名の部室に、どうして二脚あるんだろう。' },
            { id: 'locker', x: 78, y: 25, w: 9, h: 40, label: 'ロッカー', clue: false, text: 'ロッカーには、僕の白衣が一着だけ。……いや、ハンガーがもう一本ある。小さいサイズの。' },
          ],
        },
      },
      { speaker: '', chara: null, ghost: 'zun_normal', sfx: 'heartbeat', music: 'cut', beat: 1000, text: '——ギッ。誰もいないはずの、二脚目の椅子がきしんだ。' },
      { speaker: '', chara: null, music: 'swell', speed: 'slow', text: '気のせいなんかじゃない。あいつは、確かにここにいた。' },
    ],
    next: 'noticeboard',
  },

  // ===================================================================
  // 第2章：消えた名前
  // ===================================================================
  noticeboard: {
    chapter: { no: '02', title: '消えた名前', sub: 'OBSERVED 1.130205' },
    place: { name: '廊下 掲示板', time: '19:06' },
    bg: 'noticeboard_night',
    bgm: 'night',
    ambient: 'stars',
    handheld: true,
    grade: 'cold',
    meter: SHIFTED_METER,
    lines: [
      { speaker: '', chara: null, camera: 'drift', text: '廊下の掲示板に、部活動の一覧が貼ってある。' },
      { speaker: '', chara: null, speed: 'slow', beat: 800, text: '時間工学研究会。部長——*僕*。部員、一名。' },
      { speaker: '', chara: null, fx: 'shake', text: '『今週金曜をもって廃部』の赤いハンコだけが、そのまま押されていた。' },
      { speaker: '', chara: null, text: 'この世界でも、研究会は消えかけている。ただ、そこにずんだもんがいないだけで。' },
      { speaker: '', chara: null, sfx: 'heartbeat', text: 'スマホの連絡先を開く。「ず」の欄は、空っぽだった。' },
      {
        speaker: '',
        chara: null,
        when: '0',
        phone: { mode: 'lock', time: '19:07', date: '10月1日 木曜日', notices: [{ app: 'クラスのグループ', title: '2年B組', body: '明日の小テスト、答え全部Bってマジ？ 誰が言い出したんだよw' }] },
        text: 'クラスのグループに、妙な噂が流れていた。……出どころは、たぶん昨日の僕だ。',
      },
      {
        speaker: '',
        chara: null,
        when: '1',
        phone: { mode: 'thread', contact: '（宛先なし）', bubbles: [{ from: 'me', text: 'ありがとう', time: '昨日 16:55 送信できませんでした' }] },
        text: '送信履歴に、宛先のない「ありがとう」が一通だけ残っていた。',
      },
      { speaker: '', chara: null, music: 'duck', text: '窓の外で、ぽつり、と音がした。……雨だ。' },
    ],
    next: 'classroom',
  },

  classroom: {
    place: { name: '2年B組 教室', time: '19:10' },
    bg: 'classroom_night',
    bgm: 'night',
    ambient: 'rain',
    weather: 'rain',
    handheld: true,
    light: 'moon',
    grade: 'cold',
    meter: SHIFTED_METER,
    lines: [
      { speaker: '', chara: null, camera: 'drift', text: '誰もいない夜の教室。雨が窓を叩いている。僕は名簿を開いた。' },
      { speaker: '', chara: null, sfx: 'heartbeat', speed: 'slow', text: 'ページをめくる。あ行、か行、さ行……た行。' },
      { speaker: '', chara: null, fx: 'shockwave', music: 'cut', sfx: 'tinnitus', beat: 1100, text: '……ない。*「ずんだもん」の名前が、どこにもない。*' },
      { speaker: '', chara: null, ghost: 'zun_smile', speed: 'slow', text: '窓際の、いちばん後ろの席。あいつがいつも座っていた机には、知らない誰かの教科書が入っていた。' },
      { speaker: '', chara: null, when: '0', fx: 'zoom', text: '机の中に、まだ返ってきていないはずの小テストがあった。答えは——全部、Bで埋めてある。' },
      { speaker: '', chara: null, when: '1', sfx: 'heartbeat', speed: 'slow', text: '窓際の机に、消しゴムで消した跡がある。かすかに読めた。「ありがとう、なのだ」。' },
      { speaker: '', chara: null, cinema: true, scope: 'wide', speed: 'slow', beat: 800, text: 'この世界では、あいつは最初から~存在しない~——？' },
      {
        speaker: '',
        chara: null,
        music: 'cut',
        beat: 1200,
        phone: {
          mode: 'lock',
          time: '19:12',
          date: '10月1日 木曜日',
          vanish: true,
          notices: [{ app: 'メッセージ', title: 'ずんだもん', body: 'まだ、ここにいるのだ' }],
        },
        text: 'ポケットのスマホが震えた。差出人は——連絡先にいないはずの名前。',
      },
      { speaker: '', chara: null, speed: 'slow', text: '次の瞬間、通知は跡形もなく消えた。……屋上だ。なぜか、そう思った。' },
    ],
    next: 'roof',
  },

  // ===================================================================
  // 第3章：残響
  // ===================================================================
  roof: {
    title: '夜の屋上',
    summary: 'ずんだもんが存在しない世界。屋上には、前の世界の「残響」だけが残っていた。',
    timer: { seconds: 10, default: 1 }, // 迷っているうちに時間が過ぎると「……どうすればいいんだ」になる
    chapter: { no: '03', title: '残響', sub: 'ECHO DETECTED' },
    place: { name: '屋上', time: '19:24' },
    bg: 'roof_night',
    bgm: 'echo',
    ambient: 'rain',
    weather: 'rain',
    grade: 'teal',
    meter: SHIFTED_METER,
    lines: [
      { speaker: '', chara: null, camera: 'pull-back', beat: 600, text: '雨の屋上。昼休みにずんだ餅を分けたフェンスのそばに、淡く光る人影があった。' },
      { speaker: '？？？', chara: 'zun_sad', echo: true, camera: 'vertigo', fx: 'rack', beat: 1600, speed: 'slow', text: '……やっぱり。キミには、見えるのだ？' },
      { speaker: '', chara: null, still: 'rain', fx: 'leak', speed: 'slow', text: '雨粒が、ずんだもんの体をすり抜けて落ちていく。濡れているのは、僕だけだった。' },
      { speaker: '？？？', chara: 'zun_cry', echo: true, cutin: 'eyes', speed: 'slow', music: 'duck', text: 'この世界で、ボクは*生まれなかったこと*になってるのだ。今のボクは、前の世界の「残響」なのだ。' },
      { speaker: '', chara: 'zun_cry', echo: true, speed: 'slow', text: '——名前が、出てこない。目の前にいるのに。一緒にずんだ餅を食べた、あいつの名前が。' },
      { speaker: '僕', chara: 'zun_cry', echo: true, cutin: { type: 'vertical', side: 'right', focus: 'eye-left' }, beat: 1400, speed: 'slow', sfx: 'heartbeat', text: '「…………ずんだもん」' },
      { speaker: '', chara: 'zun_cry', echo: true, fx: 'glitch', text: '名前を呼んだ瞬間、ノイズの向こうで、ずんだもんの輪郭がはっきりした。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, still: 'echo', fx: 'leak', music: 'swell', scope: 'wide', beat: 900, text: 'でも、キミが覚えててくれるから……まだ、ここにいられるみたいなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', echo: true, when: '0', music: 'normal', text: 'それにしても、最初のメッセージが「テストの答え」なんて……ほんと、キミらしいのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, when: '1', music: 'normal', text: 'あの「ありがとう」……ボク宛てだったのだ？ ……ちょっと、うれしかったのだ。' },
      { speaker: '僕', chara: 'zun_gentle', echo: true, text: '「……触れないのか？」' },
      { speaker: 'ずんだもん', chara: 'zun_sad', echo: true, scan: { name: 'ZUNDAMON', alert: true, rows: [['STATE', 'ECHO / 未観測'], ['WORLD LINE', '1.130205（不在）'], ['EXISTENCE', '12.4% ▼', 0.124]] }, text: '手を伸ばしても、すり抜けちゃうのだ。雨も冷たくないし、お腹もすかないのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', echo: true, text: '……昼休みのずんだ餅、半分こしておいてよかったのだ。' },
      { speaker: '僕', chara: 'zun_smile', echo: true, text: '「半分しかくれなかったけどな」' },
      { speaker: 'ずんだもん', chara: 'zun_proud', echo: true, fx: 'burst', text: '半分*「も」*あげたのだ！ 感謝するのだ！' },
      { speaker: '', chara: 'zun_proud', echo: true, speed: 'slow', text: '笑った。この世界でたぶん僕だけが、ずんだもんと笑える。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, beat: 1000, speed: 'slow', text: '……ねえ。キミは、どうしたいのだ？' },
    ],
    choices: [
      { text: '「絶対に、元の世界に戻す」', next: 'ramen' },
      { text: '「……どうすればいいんだ」', next: 'storm' },
    ],
  },

  // 雨上がりの屋上で、カップラーメン（食べられないずんだもんと）
  ramen: {
    place: { name: '屋上', time: '19:31' },
    bg: 'roof_night',
    bgm: 'evening',
    ambient: 'stars',
    light: 'moon',
    grade: 'teal',
    meter: SHIFTED_METER,
    lines: [
      { speaker: '', chara: null, camera: 'crane', beat: 800, text: '雨が上がった。雲の切れ間から、星がのぞいている。' },
      { speaker: '', chara: null, text: '宿直室のポットでお湯をもらって、自販機のカップラーメンを二つ買ってきた。' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', echo: true, fx: 'zoom', text: 'ふ、二つも買ったのだ!? ボク、食べられないのだ。' },
      { speaker: '僕', chara: 'zun_surprise', echo: true, text: '「知ってる。でも、ひとりで食べるのもな」' },
      { speaker: '', chara: null, still: 'ramen', fx: 'leak', beat: 1200, speed: 'slow', text: '三分。湯気が、雨上がりの夜の空気に、白くのぼっていく。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', echo: true, text: 'いいにおいなのだ……。においだけで、おなかいっぱいなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', echo: true, fx: 'burst', text: 'ふーふーしてあげるのだ！ ……あ。息も、出ないのだ。' },
      { speaker: '', chara: 'zun_proud', echo: true, speed: 'slow', text: '二人で笑った。のびかけた麺は、思っていたよりずっとうまかった。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, cutin: 'face', beat: 1000, speed: 'slow', music: 'swell', text: '……こういうの、ずっと続けばいいのに、なのだ。' },
      { speaker: '僕', chara: 'zun_gentle', echo: true, music: 'normal', text: '「続けるさ。戻ったら、今度は本物を一緒に食べよう」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', echo: true, text: '約束なのだ。……ボク、*塩味*がいいのだ。' },
    ],
    next: 'observer',
  },

  // 迷った夜の嵐（「……どうすればいいんだ」と答えたとき）
  storm: {
    place: { name: '屋上', time: '19:31' },
    bg: 'roof_night',
    bgm: 'night',
    ambient: 'rain',
    weather: 'rain',
    handheld: true,
    grade: 'cold',
    meter: SHIFTED_METER,
    lines: [
      { speaker: '', chara: null, fx: 'shake', sfx: 'thunder', beat: 600, text: '雨が、急に強くなった。遠くで雷が鳴る。' },
      { speaker: '僕', chara: null, camera: 'drift', text: '「どうすればいいんだよ……！ 名簿にも、連絡先にも、どこにもいないんだぞ」' },
      { speaker: 'ずんだもん', chara: 'zun_sad', echo: true, beat: 1000, speed: 'slow', text: '……ごめんなのだ。ボクが、変な装置なんか作ったから。' },
      { speaker: '', chara: 'zun_sad', echo: true, fx: 'glitch', text: 'ずんだもんの輪郭が、ノイズみたいに一瞬ぶれた。' },
      { speaker: 'ずんだもん', chara: 'zun_cry', echo: true, cutin: { type: 'diagonal', angle: -16 }, speed: 'slow', music: 'duck', text: 'キミが迷うと……ボク、ちょっとずつ*薄くなる*みたいなのだ。' },
      { speaker: '', chara: null, music: 'cut', sfx: 'heartbeat', beat: 900, text: '息が止まった。僕の迷いが、そのままずんだもんを消していく。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, cutin: 'face', beat: 1200, speed: 'slow', music: 'swell', text: 'ボクのために無理しなくていいのだ。……でも、もし決めてくれるなら、うれしいのだ。' },
      { speaker: '', chara: null, still: 'rain', fx: 'leak', speed: 'slow', text: '雨の中で、ずんだもんは笑っていた。濡れることもできない体で。' },
      { speaker: '', chara: null, music: 'normal', speed: 'slow', text: '塔屋の陰で、雨が弱まるのを待った。言葉は、もう出てこなかった。' },
    ],
    next: 'observer',
  },

  observer: {
    bg: 'roof_night',
    bgm: 'tension',
    ambient: 'stars',
    light: 'moon',
    handheld: true,
    grade: 'teal',
    scope: true,
    meter: SHIFTED_METER,
    lines: [
      { speaker: '???', chara: null, when: '?0', fx: 'glitch', music: 'cut', beat: 1300, text: '……麺、のびてしまいますわよ。' },
      { speaker: '???', chara: null, when: '?1', fx: 'glitch', music: 'cut', beat: 1300, text: '……ずぶ濡れですわね。傘くらい、差したらいかが？' },
      { speaker: '???', chara: null, text: '戻したいのなら、方法はありますわ。' },
      { speaker: '', chara: 'metan_normal', fx: 'whip', camera: 'tilt-up', music: 'normal', text: 'いつの間にか、白いドレスの少女が立っていた。——昼休み、屋上の扉の陰にいた少女だ。' },
      { speaker: '四国めたん', chara: 'metan_smug', still: 'observer', text: 'わたくしは四国めたん。世界の揺らぎを記録する*〈観測者〉*……とでも名乗っておきましょうか。' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', echo: true, cutin: 'eyes', text: 'ボ、ボクのことが見えるのだ!?' },
      { speaker: '四国めたん', chara: 'metan_smug', scan: { name: 'SHIKOKU METAN', alert: true, rows: [['CLASS', 'OBSERVER'], ['WORLD LINE', '—— UNBOUND'], ['RECORDS', 'No.001 〜 No.110'], ['THREAT', 'UNKNOWN', 0.5]] }, text: '観測者ですもの。消えかけた世界線からこぼれ落ちた欠片を拾うのが、わたくしの仕事ですわ。' },
      { speaker: '四国めたん', chara: 'metan_serious', replay: true, cutin: { type: 'vertical', side: 'center', focus: 'eye-right' }, music: 'cut', beat: 1200, speed: 'slow', text: '……それにしても。あなたがこの屋上に来るのは、これで*{runs}回目*ですわね。' },
      { speaker: '僕', chara: 'metan_serious', replay: true, sfx: 'heartbeat', text: '「……何の話だ」' },
      { speaker: '四国めたん', chara: 'metan_smug', replay: true, music: 'normal', text: '覚えていないでしょうね。いいえ、こちらの話ですわ。' },
      { speaker: '四国めたん', chara: 'metan_serious', camera: 'dutch', cutin: { type: 'diagonal', angle: 12 }, fx: 'zoom', text: '最初のメッセージを、もう一通で*打ち消しなさい*。ただし——' },
      { speaker: '四国めたん', chara: 'metan_normal', text: '元の世界を覚えているのは、あなた一人。あなたにしか、世界は戻せない。' },
      { speaker: '四国めたん', chara: 'metan_sad', camera: 'orbit', text: '世界を越えた記憶は、戻った先では~たいてい消えてしまう~の。' },
      { speaker: '僕', chara: 'metan_sad', text: '「たいてい？ 消えないこともあるのか」' },
      { speaker: '四国めたん', chara: 'metan_sad', beat: 900, speed: 'slow', text: '……さあ。わたくしは、一度も見たことがありませんわ。' },
      {
        speaker: 'ずんだもん',
        chara: 'zun_sad',
        echo: true,
        cutin: { type: 'split', left: { chara: 'zun_sad', echo: true }, right: { chara: 'metan_sad' } },
        beat: 1200,
        speed: 'slow',
        music: 'muffle',
        sfx: 'heartbeat',
        text: '……キミが、ボクのことを忘れちゃうってことなのだ？',
      },
      { speaker: '四国めたん', chara: 'metan_normal', music: 'normal', text: '決めるのは、あなたたち。……せめて、後悔のない一通を。' },
      { speaker: '', chara: null, ghost: 'metan_normal', speed: 'slow', text: '風が吹いた。少女の姿は、もうどこにもなかった。' },
    ],
    next: 'stairs',
  },

  stairs: {
    place: { name: '階段', time: '19:43' },
    bg: 'stairs_night',
    bgm: 'echo',
    ambient: 'echo',
    grade: 'teal',
    meter: SHIFTED_METER,
    lines: [
      { speaker: '', chara: null, camera: 'drift', beat: 600, text: '部室へ向かう階段。足音は、ひとりぶんしか響かない。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', echo: true, when: '?0', text: 'ねえ。もし元の世界に戻れたら、なにがしたいのだ？' },
      { speaker: 'ずんだもん', chara: 'zun_sad', echo: true, when: '?1', text: '……さっきは、困らせてごめんなのだ。' },
      { speaker: '僕', chara: 'zun_sad', echo: true, when: '?1', text: '「謝るのは僕のほうだ。迷ってる場合じゃなかった」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', echo: true, when: '?1', text: 'えへへ。……じゃあ、元の世界に戻れたら、なにがしたいのだ？' },
      { speaker: '僕', chara: 'zun_normal', echo: true, text: '「とりあえず、廃部をどうにかしないとな」' },
      { speaker: 'ずんだもん', chara: 'zun_proud', echo: true, fx: 'burst', text: 'そうなのだ！ 文化祭でリライターを発表して、新入部員をがっぽり集めるのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_smile', echo: true, text: 'それから、帰りにずんだ餅を食べるのだ。今度は、*まるごと一個ずつ*なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', echo: true, when: '?0', text: 'あと、夜の屋上でカップラーメンなのだ。塩味なのだ。約束、忘れちゃだめなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', echo: true, when: '?1', text: 'あと……雨の日に、ひとつの傘に入ってみたいのだ。さっきは、入れなかったから。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', echo: true, when: '0', text: '……それと、小テストはちゃんと自分で勉強するのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, when: '1', text: '……それと。「ありがとう」って、今度は直接言ってほしいのだ。そのほうが、もっとうれしいのだ。' },
      { speaker: '', chara: 'zun_smile', echo: true, speed: 'slow', text: '並んで階段を降りる。触れられない手が、すぐ隣にある。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, cutin: 'face', beat: 1200, speed: 'slow', music: 'swell', text: 'もしキミがボクを忘れても……研究会は、続けてほしいのだ。ボクたちの、場所だから。' },
      { speaker: '僕', chara: 'zun_gentle', echo: true, music: 'normal', text: '「忘れないよ」' },
      { speaker: 'ずんだもん', chara: 'zun_sad', echo: true, beat: 900, speed: 'slow', text: '……うん。そうだといいのだ。' },
    ],
    next: 'lastLab',
  },

  // ===================================================================
  // 第4章：最後の1通
  // ===================================================================
  lastLab: {
    title: '最後の1通',
    summary: '観測者・四国めたんの忠告のあと、部室に残ったスマホ。送れるのはあと1通だけ。',
    chapter: { no: '04', title: '最後の1通', sub: 'REMAINING 1' },
    place: { name: '物理準備室', time: '19:51' },
    bg: 'lab_night',
    bgm: 'echo',
    ambient: 'echo',
    handheld: true,
    grade: 'cold',
    meter: SHIFTED_METER,
    choiceStyle: 'message',
    lines: [
      { speaker: '', chara: null, text: '部室に戻ると、机の上に古いスマホが一台だけ残っていた。' },
      {
        speaker: '',
        chara: null,
        phone: {
          mode: 'thread',
          contact: 'ずんだもん',
          erase: true,
          bubbles: [
            { from: 'them', text: '明日の部活、絶対来るのだ！ すごいもの見せるのだ', time: '昨日 21:14' },
            { from: 'me', text: 'はいはい' },
            { from: 'them', text: '返事が雑なのだ！！' },
            { from: 'them', text: '……でも、来てくれたらうれしいのだ' },
          ],
        },
        music: 'duck',
        text: '画面には、ずんだもんとのトーク履歴が残っていた。——それが、目の前で*消えていく*。',
      },
      { speaker: '', chara: null, when: '?0', movie: 'memories', bgm: 'theme', music: 'normal', speed: 'slow', text: '——思い出すのは、夕焼けの部室のことばかりだった。' },
      { speaker: '', chara: null, when: '?1', movie: 'memoriesRain', bgm: 'theme', music: 'normal', speed: 'slow', text: '——思い出すのは、夕焼けの部室のことばかりだった。' },
      { speaker: '', chara: null, speed: 'slow', text: '金曜の廃部も、明日の小テストも、どうでもよかった。ただ、あの放課後に帰りたかった。' },
      {
        speaker: '',
        chara: null,
        music: 'cut',
        beat: 1000,
        phone: {
          mode: 'lock',
          time: '19:52',
          date: '10月1日 木曜日',
          notices: [{ app: 'REWRITER', title: '受信 ← 明日の自分（明日 16:52）', body: '■■■■を、ぜったいに■■■な' }],
        },
        text: '受信。差出人は——*明日の自分*。送られてくるはずのない時刻から。',
      },
      { speaker: '', chara: null, speed: 'slow', music: 'normal', text: '文字はノイズで潰れて、ほとんど読めなかった。' },
      { speaker: 'SYSTEM', chara: null, terminal: ['> rewriter --status', 'WORLD LINE ... 1.130205', 'DIVERGENCE ... +0.720774', 'ECHO SIGNAL .. 12% ▼ WARN', 'INCOMING ..... 1 (T+24:00 ERR)', 'REMAINING .... 1', '> AWAITING INPUT'], text: '> 残り送信回数：1' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, cutin: 'face', beat: 1400, speed: 'slow', music: 'swell', text: '最後のメッセージも……キミが決めるのだ。' },
    ],
    choices: [
      { text: '『さっきのメッセージは無視しろ』', next: 'final' },
      { text: '『緑の髪のあいつを、絶対に忘れるな』', next: 'final' },
      { text: '『観測者・四国めたんのことも、忘れるな』', next: 'final', secret: true },
    ],
  },

  final: {
    bg: 'lab_night',
    bgm: 'theme',
    ambient: 'echo',
    grade: 'bleach',
    scope: true,
    meter: '?.??????',
    lines: [
      { speaker: 'SYSTEM', chara: null, fx: 'meter', text: '> SEND ………… OK' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, when: '??0', cutin: 'face', beat: 1200, speed: 'slow', text: 'これで、キミは元の毎日に戻れるのだ。ボクのことは……忘れても、いいのだ。' },
      { speaker: '僕', chara: 'zun_gentle', echo: true, when: '??0', text: '「……ごめん」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', echo: true, when: '??0', speed: 'slow', text: '謝らないでほしいのだ。キミが選んだ世界なら、きっと大丈夫なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_cry', echo: true, when: '??1', cutin: { type: 'triptych' }, beat: 1200, speed: 'slow', music: 'swell', text: '……「忘れるな」って、送ってくれたのだ。' },
      { speaker: '僕', chara: 'zun_cry', echo: true, when: '??1', text: '「当たり前だろ。部員なんだから」' },
      { speaker: '', chara: 'zun_gentle', echo: true, when: '1?1', fx: 'leak', sfx: 'heartbeat', beat: 1400, speed: 'slow', text: 'ずんだもんの指先が、僕の手に重なった。——すり抜けなかった。ほんの一瞬だけ、*温かかった*。' },
      { speaker: '', chara: 'zun_gentle', echo: true, when: '0?1', speed: 'slow', text: 'ずんだもんの指先が、僕の手をすり抜けた。それでも、温かい気がした。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', echo: true, when: '??2', speed: 'slow', text: 'めたんのことまで……キミは、ほんとに欲ばりなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', echo: true, still: 'farewell', cinema: true, fx: 'leak', beat: 1800, speed: 'slow', music: 'muffle', scope: 'wide', text: 'またね、なのだ。' },
      { speaker: '四国めたん', chara: null, when: '??2', cinema: true, beat: 1500, speed: 'slow', text: '……どうして、わたくしの名前まで。' },
      { speaker: '', chara: null, fx: 'flash', cinema: true, music: 'cut', sfx: 'tinnitus', scope: 'wide', text: '~世界が、裏返る——~' },
    ],
    end: true,
  },

  // ===================================================================
  // エピローグ：巻き戻しのあと、エンディングごとの「その後」を会話で描く
  //   epilogue: true … 最後のセリフのあと、エンディング画面（動画）へ進む
  // ===================================================================

  // END 01 既視感（テストの答え → 絶対に戻す → 無視しろ）
  ep_deja: {
    chapter: { no: 'EP', title: '既視感', sub: 'EPILOGUE' },
    place: { name: '物理準備室', time: '16:48' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    light: 'sunset',
    grade: 'warm',
    meter: FIRST_METER,
    epilogue: true,
    lines: [
      { speaker: '', chara: null, camera: 'drift', fx: 'rewrite', beat: 800, text: 'まぶしい。夕焼けの物理準備室。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'burst', camera: 'push', text: '待ってたのだ！ ついに完成したのだ、過去改変装置*〈リライター〉*！' },
      { speaker: '', chara: 'zun_proud', beat: 900, speed: 'slow', music: 'muffle', text: '……その言葉を、どこかで聞いた気がした。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', music: 'normal', text: 'どうしたのだ？ ぼーっとして。' },
      { speaker: '僕', chara: 'zun_normal', text: '「いや……前にも、まったく同じことがあった気がして」' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', cutin: { type: 'diagonal', angle: -14 }, fx: 'zoom', text: 'デジャヴってやつなのだ!? それはきっと、世界線が揺らいでる証拠なのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_smile', text: 'ますます実験が楽しみになってきたのだ！ さあ、最初のメッセージを決めるのだ！' },
      { speaker: '', chara: 'zun_smile', text: '差し出されたスマホには、空っぽの送信欄。' },
      { speaker: '', chara: null, still: 'end_deja', cinema: true, speed: 'slow', scope: 'wide', fx: 'leak', text: 'たぶん僕らは、何度でもここから始めるのだろう。' },
    ],
  },

  // END 02 全部Bの世界線（テストの答え → 絶対に戻す → 忘れるな）
  ep_allB: {
    chapter: { no: 'EP', title: '全部Bの世界線', sub: 'EPILOGUE' },
    place: { name: '2年B組 教室', time: '翌日 15:40' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    light: 'sunset',
    grade: 'warm',
    meter: '0.409502',
    epilogue: true,
    lines: [
      { speaker: '', chara: null, camera: 'drift', text: '翌日。返ってきた小テストを、僕は無言で見つめていた。' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', text: 'ど、どうだったのだ？' },
      { speaker: '', chara: 'zun_surprise', beat: 900, fx: 'zoom', text: '全問、B。……全問、*バツ*。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'burst', text: '0点なのだ！ 歴史に残る0点なのだ！' },
      { speaker: '僕', chara: 'zun_proud', text: '「誰のせいだと思ってるんだ」' },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'キミが自分で送ったメッセージなのだ。ボクは悪くないのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', cutin: 'face', beat: 1200, speed: 'slow', music: 'swell', text: '……でも。ちゃんと、ボクのこと覚えててくれたのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', music: 'normal', text: '0点と引きかえに世界を救ったんだから、安いものなのだ！' },
      { speaker: '', chara: null, still: 'end_allB', cinema: true, fx: 'leak', text: '世界を救った代償は、テスト一枚ぶん。悪くない取引だ。' },
    ],
  },

  // END 03 観測終了（テストの答え → どうすれば → 無視しろ）
  ep_lost: {
    chapter: { no: 'EP', title: '観測終了', sub: 'EPILOGUE' },
    place: { name: '屋上', time: '20:13' },
    bg: 'roof_night',
    bgm: 'echo',
    ambient: 'echo',
    light: 'moon',
    grade: 'teal',
    meter: SHIFTED_METER,
    epilogue: true,
    lines: [
      { speaker: '', chara: null, camera: 'pull-back', beat: 900, text: '屋上。風の音だけが聞こえる。' },
      { speaker: 'ずんだもん', chara: 'zun_sad', echo: true, beat: 1500, speed: 'slow', text: '……世界、変わらなかったのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_cry', echo: true, cutin: { type: 'triptych' }, speed: 'slow', music: 'duck', text: 'ボクのせいなのだ。あんな装置、作らなければよかったのだ。' },
      { speaker: '僕', chara: 'zun_cry', echo: true, text: '「そんなことない。もう一度、方法を探せば——」' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, music: 'muffle', text: 'ううん。……見て。もう、手が透けてるのだ。' },
      { speaker: '', chara: 'zun_gentle', echo: true, fx: 'leak', sfx: 'heartbeat', speed: 'slow', text: '指先から、光の粒になってほどけていく。' },
      { speaker: 'ずんだもん', chara: null, still: 'end_lost', cinema: true, beat: 1600, speed: 'slow', scope: 'wide', text: 'キミと作った放課後、楽しかったのだ。' },
      { speaker: '', chara: null, ghost: 'zun_gentle', music: 'cut', sfx: 'tinnitus', beat: 1200, text: '——気がつくと、屋上には僕ひとりだった。' },
      { speaker: '', chara: null, cinema: true, speed: 'slow', text: '観測は、そこで終わった。' },
      {
        speaker: '',
        chara: null,
        music: 'cut',
        beat: 1500,
        phone: {
          mode: 'lock',
          time: '20:31',
          date: '10月1日 木曜日',
          vanish: true,
          notices: [{ app: 'メッセージ', title: 'ずんだもん', body: 'まだ、ここにいるのだ' }],
        },
        text: '帰り道。ポケットのスマホが、一度だけ震えた。',
      },
    ],
  },

  // END 04 夜だけの部員（テストの答え → どうすれば → 忘れるな）
  ep_night: {
    chapter: { no: 'EP', title: '夜だけの部員', sub: 'EPILOGUE' },
    place: { name: '屋上', time: '一か月後 21:00' },
    bg: 'roof_night',
    bgm: 'echo',
    ambient: 'stars',
    light: 'moon',
    grade: 'teal',
    meter: SHIFTED_METER,
    epilogue: true,
    lines: [
      { speaker: '', chara: null, camera: 'drift', beat: 700, text: 'あれから一か月。世界は、戻らなかった。' },
      { speaker: '', chara: null, text: 'それでも僕は、毎晩この屋上に来ている。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', echo: true, fx: 'burst', text: '今日も来てくれたのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_proud', echo: true, text: '今日はなんの話をするのだ？ ボクは、宇宙の果ての話がいいのだ！' },
      { speaker: '僕', chara: 'zun_proud', echo: true, text: '「昨日もその話だっただろ」' },
      { speaker: 'ずんだもん', chara: 'zun_normal', echo: true, text: '何回聞いても面白いのだ。キミの話は。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', echo: true, text: '今日は雨なのだ。……傘、さしてほしいのだ。ボク、濡れないけど。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, cutin: 'face', beat: 1200, speed: 'slow', music: 'swell', text: 'キミが覚えててくれる限り、ボクはここにいられるのだ。……だから、明日も来てほしいのだ。' },
      { speaker: '僕', chara: 'zun_gentle', echo: true, music: 'normal', text: '「当たり前だろ。部員なんだから」' },
      { speaker: '', chara: null, still: 'end_night', cinema: true, fx: 'leak', text: '時間工学研究会、部員二名。活動は、夜だけ。' },
    ],
  },

  // END 05 片側だけの記憶（ありがとう → 絶対に戻す → 無視しろ）
  ep_alone: {
    chapter: { no: 'EP', title: '片側だけの記憶', sub: 'EPILOGUE' },
    place: { name: '屋上', time: '翌日 17:20' },
    bg: 'roof_evening',
    bgm: 'evening',
    ambient: 'dust',
    light: 'sunset',
    grade: 'warm',
    meter: FIRST_METER,
    epilogue: true,
    lines: [
      { speaker: '', chara: null, camera: 'drift', text: '放課後。なぜか足が、屋上に向いた。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'あ、来たのだ。' },
      { speaker: '', chara: 'zun_normal', text: '緑の髪の子。たしか同じ研究会の……ずんだもん、だったか。' },
      { speaker: 'ずんだもん', chara: 'zun_sad', beat: 1000, speed: 'slow', text: '……やっぱり、覚えてないのだ？ 昨日のこと。' },
      { speaker: '僕', chara: 'zun_sad', text: '「昨日？ 何かあったっけ」' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', cutin: 'face', speed: 'slow', music: 'duck', text: 'ううん。なんでもないのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', music: 'normal', text: 'ねえ、キミ。「ありがとう」って、言ってみてほしいのだ。' },
      { speaker: '僕', chara: 'zun_smile', text: '「……ありがとう？ なんで？」' },
      { speaker: 'ずんだもん', chara: null, still: 'end_alone', fx: 'leak', beat: 1200, speed: 'slow', music: 'swell', text: 'えへへ。……それが聞けたから、もう十分なのだ。' },
      { speaker: '', chara: null, cinema: true, scope: 'wide', text: 'ずんだもんだけが知っている昨日を、僕は知らない。' },
    ],
  },

  // TRUE END おかえりなのだ（ありがとう → 絶対に戻す → 忘れるな）
  ep_true: {
    chapter: { no: 'EP', title: 'おかえりなのだ', sub: 'TRUE EPILOGUE' },
    place: { name: '物理準備室', time: '16:48' },
    bg: 'lab_evening',
    bgm: 'theme',
    ambient: 'dust',
    light: 'sunset',
    grade: 'warm',
    meter: FIRST_METER,
    epilogue: true,
    lines: [
      { speaker: '', chara: null, camera: 'drift', fx: 'rewrite', beat: 900, text: 'まぶしい。夕焼けの物理準備室。' },
      { speaker: '', chara: null, fx: 'meter', text: '観測計は、*0.409431*。' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', fx: 'zoom', text: 'わっ!? キ、キミ……なんで泣いてるのだ？' },
      { speaker: '僕', chara: 'zun_surprise', movie: 'reunion', beat: 1200, speed: 'slow', text: '「……ただいま」' },
      { speaker: 'ずんだもん', chara: 'zun_normal', scan: { name: 'ZUNDAMON', rows: [['STATE', 'OBSERVED'], ['WORLD LINE', '0.409431'], ['EXISTENCE', '100.0% ▲', 1]] }, beat: 800, text: '……？ 変なの。でも——' },
      { speaker: 'ずんだもん', chara: null, still: 'end_true', cinema: true, kinetic: true, fx: 'leak', music: 'swell', text: 'おかえりなのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_proud', music: 'normal', text: 'そういえば、昨日の自分から変なメッセージが届いてたのだ。「ずんだもんに、ありがとうって言え」って。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', cutin: 'face', beat: 1000, speed: 'slow', text: '……だから、ボクから先に言っておくのだ。ありがとう、なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', music: 'normal', text: 'それと……なぜか今夜、屋上でカップラーメンが食べたい気分なのだ。*塩味*のやつなのだ！' },
      { speaker: '', chara: null, cinema: true, scope: 'wide', speed: 'slow', text: '世界はひとつだけ。そしてこの放課後は、ちゃんと続いていく。' },
    ],
  },

  // END 07 観測記録（ありがとう → どうすれば → 無視しろ）
  ep_record: {
    chapter: { no: 'EP', title: '観測記録', sub: 'EPILOGUE' },
    place: { name: '2年B組 教室', time: '観測後' },
    bg: 'classroom_night',
    bgm: 'night',
    ambient: 'stars',
    light: 'moon',
    grade: 'cold',
    meter: '0.409857',
    epilogue: true,
    lines: [
      { speaker: '', chara: null, camera: 'drift', beat: 800, text: '誰もいない夜の教室。白いドレスの少女が、ノートにペンを走らせている。' },
      { speaker: '四国めたん', chara: 'metan_normal', text: '観測記録、No.110。対象は二名。' },
      { speaker: '四国めたん', chara: 'metan_serious', text: '最初のメッセージは「ありがとう」。……ずいぶん、素直な子でしたわね。' },
      { speaker: '四国めたん', chara: 'metan_sad', cutin: { type: 'vertical', side: 'right', focus: 'eye-left' }, beat: 1000, speed: 'slow', music: 'duck', text: '世界線は閉じ、記憶は残らなかった。あの二人の夜は、わたくしの記録の中にしかない。' },
      { speaker: '四国めたん', chara: 'metan_smug', music: 'normal', text: 'でも——観測者として、ひとつだけ予言しておきますわ。' },
      { speaker: '四国めたん', chara: null, still: 'end_record', fx: 'leak', music: 'swell', speed: 'slow', text: 'あの二人なら、この世界線でも、きっとまた出会う。' },
      { speaker: '', chara: null, cinema: true, text: 'ノートを閉じる音が、静かな教室に響いた。' },
    ],
  },

  // END 08 はじめまして（ありがとう → どうすれば → 忘れるな）
  ep_shifted: {
    chapter: { no: 'EP', title: 'はじめまして', sub: 'EPILOGUE' },
    place: { name: '2年B組 教室', time: '翌日 16:10' },
    bg: 'classroom_evening',
    bgm: 'evening',
    ambient: 'dust',
    light: 'sunset',
    grade: 'warm',
    meter: '0.409857',
    epilogue: true,
    lines: [
      { speaker: '', chara: null, camera: 'drift', fx: 'rewrite', text: '翌日。クラスに、見覚えのある緑の髪の転校生がいた。' },
      { speaker: 'ずんだもん', chara: 'zun_other', text: 'はじめまして。転校してきた、ずんだもんです。' },
      { speaker: '', chara: 'zun_other', fx: 'glitch', beat: 700, text: '語尾に「のだ」が、*ない*。' },
      { speaker: '僕', chara: 'zun_other', text: '「……前に、どこかで会ったこと、ない？」' },
      { speaker: 'ずんだもん', chara: 'zun_other', cutin: 'face', beat: 1200, speed: 'slow', music: 'duck', text: '……ふしぎですね。わたしも、そんな気がしていました。' },
      { speaker: 'ずんだもん', chara: 'zun_other', music: 'normal', text: 'あの、よかったら部活を案内してもらえませんか？ 物理準備室って、どこですか？' },
      { speaker: '僕', chara: 'zun_other', music: 'swell', text: '「ああ。……ちょうど、部員を探してたんだ」' },
      { speaker: 'ずんだもん', chara: null, still: 'end_shifted', fx: 'leak', speed: 'slow', text: 'ふふ。なんだか、すごく懐かしい気がします。' },
      { speaker: 'ずんだもん', chara: 'zun_other', beat: 1500, speed: 'slow', music: 'cut', text: '……また会えたのだ。' },
      { speaker: '僕', chara: 'zun_other', sfx: 'heartbeat', text: '「——え？」' },
      { speaker: 'ずんだもん', chara: 'zun_other', music: 'normal', text: '？ わたし、何か言いましたか？' },
      { speaker: '', chara: null, cinema: true, scope: 'wide', text: '少しずれた世界で、もう一度、「はじめまして」から。' },
    ],
  },

  // SECRET END 観測の向こう側（最後に「四国めたんのことも、忘れるな」）
  ep_beyond: {
    chapter: { no: 'EP', title: '観測の向こう側', sub: 'SECRET EPILOGUE' },
    place: { name: '物理準備室', time: '16:48' },
    bg: 'lab_evening',
    bgm: 'theme',
    ambient: 'dust',
    light: 'sunset',
    grade: 'warm',
    meter: FIRST_METER,
    epilogue: true,
    lines: [
      { speaker: '', chara: null, camera: 'drift', fx: 'rewrite', beat: 900, text: 'まぶしい。夕焼けの物理準備室。観測計は、*0.409431*。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'burst', text: 'おかえりなのだ！ ……って、なんでボク、こんなこと言ってるのだ？' },
      { speaker: '', chara: null, sfx: 'heartbeat', text: 'コン、コン。ドアをノックする音。' },
      { speaker: '', chara: 'metan_normal', camera: 'tilt-up', text: '白いドレスの少女が、一枚の紙を持って立っていた。' },
      { speaker: '四国めたん', chara: 'metan_smug', text: '失礼いたしますわ。……*入部届*を、出しに来ましたの。' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', cutin: 'eyes', fx: 'zoom', text: 'にゅ、入部なのだ!? 部員三名なのだ！ 廃部回避なのだ！' },
      { speaker: '四国めたん', chara: 'metan_sad', beat: 1000, speed: 'slow', music: 'duck', text: 'わたくし、ずっと観測するだけでしたの。誰にも覚えてもらえない、世界からこぼれ落ちた欠片として。' },
      { speaker: '四国めたん', chara: 'metan_normal', cutin: 'face', speed: 'slow', music: 'swell', text: 'でもあなたは、最後の一通に、わたくしの名前を書いた。……おかげで、世界に居場所ができてしまいましたわ。' },
      { speaker: '僕', chara: null, cinema: true, kinetic: true, music: 'swell', text: '「ようこそ、時間工学研究会へ」' },
      { speaker: 'ずんだもん', chara: 'zun_smile', fx: 'burst', text: '今夜は屋上で、三人でカップラーメンなのだ！ ボクは塩味なのだ！' },
      { speaker: '四国めたん', chara: 'metan_smug', cutin: { type: 'slash', left: { chara: 'zun_smile' }, right: { chara: 'metan_smug' } }, text: 'わたくしは、しょうゆ味がよろしくてよ。' },
      { speaker: '', chara: null, still: 'end_beyond', cinema: true, scope: 'wide', speed: 'slow', fx: 'leak', text: '観測者のいない世界で、三人の放課後が始まる。' },
    ],
  },
}

// ===== エンディング =====
// エンディングの流れ：巻き戻し → エピローグ（ep_<id> のシーン。会話）→ エンディング画面
// エンディング画面では、10秒の動画 public/videos/ending_<id>.mp4 を流してから、本文とスタッフロールを出す
// （動画は、素材を合成したレイヤー画像から Python で1コマずつ作ったもの）
//   still … 動画の最初に出す止め絵・分岐図のサムネイル（public/images/still/end_<id>.webp）
// 3回の選び方で、8通りのエンディングに分かれる。
// キーは「選んだ選択肢の番号」を3つ並べた文字列（ストアの path と同じ形）
//   1文字目：最初のメッセージ   0 = テストの答え   1 = ありがとう
//   2文字目：屋上での返事       0 = 絶対に戻す     1 = どうすれば
//   3文字目：最後のメッセージ   0 = 無視しろ       1 = 忘れるな
export const endingByPath = {
  '000': 'deja',
  '001': 'allB',
  '010': 'lost',
  '011': 'night',
  '100': 'alone',
  '101': 'true',
  '110': 'record',
  '111': 'shifted',
  // 隠しエンディング：最後に3つ目のメッセージを選んだとき（最初の2回の選び方は問わない）
  '002': 'beyond',
  '012': 'beyond',
  '102': 'beyond',
  '112': 'beyond',
}

// ストアと分岐図の両方から使うので、関数にしてここに置いておく
export function getEndingType(path) {
  return endingByPath[path] ?? 'lost'
}

export const endings = {
  beyond: {
    still: 'end_beyond',
    letter: { from: 'ずんだもん と 四国めたん', lines: ['キミへ。', '部員が三人になったのだ！ 廃部回避なのだ！', '（わたくしからも、ひとこと。）', '（観測者は、もうやめにしますわ。）', '今夜は屋上で、三人でカップラーメンなのだ。', 'これからの放課後も、ずっとよろしくなのだ。'] }, // エンディング動画のあとの手紙
    hint: '8つの結末を、すべて観測したあとで。最後の一通に、もうひとりの名前を。',
    secret: true, // 隠しエンディング（記録室では、まだ見ていないときは存在ごと伏せる）
    bgm: 'theme',
    ambient: 'dust',
    label: 'SECRET END',
    name: '観測の向こう側',
    bg: 'lab_evening',
    chara: 'zun_smile',
    meter: FIRST_METER,
    text: '世界は戻り、観測者はいなくなった。かわりに研究会には、三人目の部員ができた。夕焼けの物理準備室に、にぎやかな声が三つ。',
  },
  deja: {
    still: 'end_deja',
    letter: { from: 'ずんだもん', lines: ['キミへ。', 'なんだか、この手紙を書くのは', 'はじめてじゃない気がするのだ。', '何回やり直しても、', 'ボクはきっと、キミと研究会をやるのだ。', 'だから、また明日なのだ。'] }, // エンディング動画のあとの手紙
    hint: '最初はふざけて、屋上では迷わず、最後は全部なかったことに。', // 記録室で、まだ見ていないときに出すヒント
    bgm: 'evening',
    ambient: 'dust',
    label: 'END 01',
    name: '既視感',
    bg: 'lab_evening',
    chara: 'zun_proud',
    meter: FIRST_METER,
    text: '何もかもが元どおりになった。誰も、何も覚えていない。「待ってたのだ！ ついに完成したのだ、過去改変装置〈リライター〉！」——このセリフ、前にも聞いた気がする。',
  },
  allB: {
    still: 'end_allB',
    letter: { from: 'ずんだもん', lines: ['キミへ。', '0点、おつかれさまなのだ。', 'でもキミは、ボクのことを', 'ちゃんと覚えててくれたのだ。', 'それって、満点より', 'ずっとすごいことなのだ。'] }, // エンディング動画のあとの手紙
    hint: '最初はふざけて、屋上では迷わず、最後にずんだもんを覚えておこうとした。', // 記録室で、まだ見ていないときに出すヒント
    bgm: 'evening',
    ambient: 'dust',
    label: 'END 02',
    name: '全部Bの世界線',
    bg: 'classroom_evening',
    chara: 'zun_proud',
    meter: '0.409502',
    text: 'ずんだもんは戻ってきた。記憶もちゃんとある。ただ、最初のメッセージだけは打ち消せなかった。返ってきた小テストは全問B。「0点なのだ！ 世界を救った代償なのだ！」',
  },
  lost: {
    still: 'end_lost',
    letter: { from: 'ずんだもん', lines: ['キミへ。', 'この手紙は、たぶん届かないのだ。', 'それでも書くのだ。', '雨の屋上で、迷ってくれてありがとう。', '迷うくらい、大事にしてくれたってことなのだ。', 'さよならは、言わないのだ。'] }, // エンディング動画のあとの手紙
    hint: '最初はふざけて、屋上で答えに迷い、最後は全部なかったことに。', // 記録室で、まだ見ていないときに出すヒント
    bgm: 'echo',
    ambient: 'echo',
    label: 'END 03',
    name: '観測終了',
    bg: 'roof_night',
    chara: 'zun_gentle',
    echo: true,
    meter: SHIFTED_METER,
    text: '世界は動かなかった。屋上の残響は、少しずつ薄くなっていく。「大丈夫なのだ。キミが覚えててくれたら、それで」 ——その声も、やがて夜に溶けた。',
  },
  night: {
    still: 'end_night',
    letter: { from: 'ずんだもん', lines: ['キミへ。', '今日も来てくれて、ありがとうなのだ。', '触れないし、濡れないし、食べられないけど、', 'キミが覚えててくれる限り、', 'ボクは毎晩、ここにいるのだ。', '……明日は、傘を持ってくるのだ。'] }, // エンディング動画のあとの手紙
    hint: '最初はふざけて、屋上で答えに迷い、最後にずんだもんを覚えておこうとした。', // 記録室で、まだ見ていないときに出すヒント
    bgm: 'echo',
    ambient: 'echo',
    label: 'END 04',
    name: '夜だけの部員',
    bg: 'roof_night',
    chara: 'zun_smile',
    echo: true,
    meter: SHIFTED_METER,
    text: '世界は戻らなかった。けれど僕は、あいつのことを一日も忘れなかった。今夜も屋上へ行く。淡く光るずんだもんが、手を振って待っている。「今日も来てくれたのだ！」',
  },
  alone: {
    still: 'end_alone',
    letter: { from: 'ずんだもん', lines: ['キミへ。', 'キミは昨日のこと、覚えてないのだ。', 'でもボクは、ぜんぶ覚えてるのだ。', '夜の屋上のカップラーメン、', 'においだけで、おなかいっぱいだったのだ。', 'だから、ボクはもう十分なのだ。'] }, // エンディング動画のあとの手紙
    hint: '最初は素直に、屋上では迷わず、最後は全部なかったことに。', // 記録室で、まだ見ていないときに出すヒント
    bgm: 'evening',
    ambient: 'dust',
    label: 'END 05',
    name: '片側だけの記憶',
    bg: 'roof_evening',
    chara: 'zun_gentle',
    meter: FIRST_METER,
    text: '世界は元に戻った。ただし、僕の記憶ごと。夕焼けの屋上で、ずんだもんだけが少しさみしそうに笑う。「キミが忘れても、ボクが覚えてるから平気なのだ。……たぶん」',
  },
  true: {
    still: 'end_true',
    letter: { from: 'ずんだもん', lines: ['キミへ。', 'おかえりなのだ。', '約束、ちゃんと覚えてるのだ？', '今夜は屋上で、本物のカップラーメンなのだ。', 'ボクは塩味。キミは……なんでもいいのだ。', 'これからも、ずっと部員なのだ。'] }, // エンディング動画のあとの手紙
    hint: '最初は素直に、屋上では迷わず、最後にずんだもんを覚えておこうとした。', // 記録室で、まだ見ていないときに出すヒント
    bgm: 'theme',
    ambient: 'dust',
    label: 'TRUE END',
    name: 'おかえりなのだ',
    bg: 'lab_evening',
    chara: 'zun_smile',
    meter: FIRST_METER,
    text: '夕焼けの部室。観測計は 0.409431。振り向くと、ずんだもんが胸を張っていた。「おかえりなのだ！ ……ちゃんと、ボクのこと覚えてるのだ？」',
  },
  record: {
    still: 'end_record',
    letter: { from: '四国めたん', lines: ['名前も知らない、あなたへ。', '観測記録 No.110 は、ここで閉じます。', 'あなたたちの夜は、わたくしだけが覚えている。', 'それは少しさびしくて、', '少しだけ、誇らしいことですわ。', 'いつか、別の世界線で。'] }, // エンディング動画のあとの手紙
    hint: '最初は素直に、屋上で答えに迷い、最後は全部なかったことに。', // 記録室で、まだ見ていないときに出すヒント
    bgm: 'night',
    ambient: 'stars',
    label: 'END 07',
    name: '観測記録',
    bg: 'classroom_night',
    chara: 'metan_sad',
    meter: '0.409857',
    text: '世界は少しずれた形で閉じ、誰も何も覚えていない。夜の教室で、観測者だけがノートに書き留める。「あの二人なら、この世界線でも、きっとまた出会いますわ」',
  },
  shifted: {
    still: 'end_shifted',
    letter: { from: 'ずんだもん', lines: ['はじめましての、あなたへ。', '変ですね。はじめて会ったのに、', '雨の日に、ひとつの傘に入りたいって、', 'ずっと思っていた気がするんです。', '……今度、試してみてもいいですか？'] }, // エンディング動画のあとの手紙
    hint: '最初は素直に、屋上で答えに迷い、最後にずんだもんを覚えておこうとした。', // 記録室で、まだ見ていないときに出すヒント
    bgm: 'evening',
    ambient: 'dust',
    label: 'END 08',
    name: 'はじめまして',
    bg: 'classroom_evening',
    chara: 'zun_other',
    meter: '0.409857',
    text: '世界は戻った。けれど、ほんの少しだけずれていた。「はじめまして、ですよね？ ……なぜでしょう、すごく懐かしい気がします」——この世界のずんだもんは、語尾に「のだ」を付けなかった。',
  },
}

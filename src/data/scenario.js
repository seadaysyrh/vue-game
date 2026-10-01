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
//   next    : 選択肢がないとき、次に進むシーンの ID
//   end     : true ならこのシーンのあとエンディングへ
//   title / summary : 選択肢のあるシーンに付ける。世界線の分岐図（RouteView）で表示する
//   place   : 場所と時刻のテロップ { name, time }
//   bgm     : BGM の名前（composables/useMusic.js）  'evening' | 'night' | 'echo' | 'tension'
//   ambient : 空気感の粒子（components/AmbientLayer.vue） 'dust' | 'stars' | 'echo'
//   choiceStyle : 'message' なら選択肢をスマホの送信画面で出す
//   chapter : 章の始まりに出すチャプターカード { no, title, sub }
//   handheld: true なら手持ちカメラのように揺れ続ける / light: 光の筋 'sunset' | 'moon'
//   セリフの camera: 'close'（寄る） | 'push'（じわじわ寄る） | 'dutch'（傾ける） | 'pan'（横に流す）
//   セリフの fx: 'burst'（集中線） | 'shockwave'（衝撃波） | 'meter'（観測計の大写し） | 'shake' | 'flash' | 'glitch'
//   セリフの cinema: true … 画面中央に大きく出す字幕
//   セリフの fx には、さらに 'whip'（ホイップパン） | 'zoom'（クラッシュズーム） | 'leak'（光漏れ） | 'rack'（ピント送り）
//   セリフの cutin: 'eyes'（目のアップ） | 'face'（顔のアップ） | { type: 'split', left: {chara, echo}, right: {chara, echo} }
//   セリフの phone: スマホの画面（components/effects/PhoneScreen.vue）。本文の {choice0} は1回目に選んだ文章になる
//   grade : 色調補正 'warm' | 'teal' | 'cold' | 'bleach'    scope: true … 映画の黒帯
// ----- 演出の台本（セリフごと） -----
//   beat  : セリフが始まる前の「間」（ミリ秒）。沈黙が、次の言葉を重くする
//   speed : 'slow'（かみしめるように） | 'fast'
//   music : 音楽の演技 'cut'（ぷつっと消える） | 'muffle'（こもる） | 'duck'（小さく） | 'swell'（ふくらむ） | 'normal'
//   sfx   : 効果音 'heartbeat'（心臓の音） | 'tinnitus'（耳鳴り）
//   ghost : 誰もいない場所に、そのキャラの残像だけを出す（不在のカット）
//   scope : 'wide' … 黒帯がさらに広がる（感情の山場）
//   movie : そのセリフに来たとき1回だけ流すムービー（走馬灯など）
//   本文の *ことば* は光る強調、~ことば~ はふるえる文字（utils/richText.js）

const FIRST_METER = '0.409431' // 元の世界の観測値
const SHIFTED_METER = '1.130205' // 変わってしまった世界の観測値

export const scenes = {
  start: {
    title: '放課後の部室',
    summary: '過去改変装置〈リライター〉が完成。最初のメッセージを、昨日の自分に送る。',
    chapter: { no: '01', title: 'リライター', sub: 'OBSERVED 0.409431' },
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
      { speaker: 'ずんだもん', chara: 'zun_normal', text: 'このスマホから*「昨日の自分」*に、一言だけメッセージを送れる……はずなのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', cutin: 'eyes', fx: 'zoom', text: 'な、なんなのだその顔！ ボクの発明を疑ってるのだ!?' },
      { speaker: '', chara: 'zun_normal', camera: 'pan', text: '壁の〈観測計〉は *0.409431*。ずんだもんいわく「この世界の座標」らしい。' },
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
      { speaker: '', chara: null, text: '視界が、壊れたテレビみたいにブレた。' },
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
      { speaker: '', chara: null, ghost: 'zun_normal', beat: 900, speed: 'slow', music: 'duck', text: '「ずんだもん……？」 返事はない。装置も、どこにもない。' },
    ],
    next: 'classroom',
  },

  classroom: {
    chapter: { no: '02', title: '消えた名前', sub: 'OBSERVED 1.130205' },
    place: { name: '2年B組 教室', time: '19:10' },
    bg: 'classroom_night',
    bgm: 'night',
    ambient: 'stars',
    handheld: true,
    light: 'moon',
    grade: 'cold',
    meter: SHIFTED_METER,
    lines: [
      { speaker: '', chara: null, camera: 'drift', text: '誰もいない夜の教室。僕は名簿を開いた。' },
      { speaker: '', chara: null, sfx: 'heartbeat', speed: 'slow', text: 'ページをめくる。あ行、か行、さ行……た行。' },
      { speaker: '', chara: null, fx: 'shockwave', music: 'cut', sfx: 'tinnitus', beat: 1100, text: '……ない。*「ずんだもん」の名前が、どこにもない。*' },
      { speaker: '', chara: null, cinema: true, scope: 'wide', speed: 'slow', beat: 800, text: 'この世界では、あいつは最初から~存在しない~——？' },
    ],
    next: 'roof',
  },

  roof: {
    title: '夜の屋上',
    summary: 'ずんだもんが存在しない世界。屋上には、前の世界の「残響」だけが残っていた。',
    chapter: { no: '03', title: '残響', sub: 'ECHO DETECTED' },
    place: { name: '屋上', time: '19:24' },
    bg: 'roof_night',
    bgm: 'echo',
    ambient: 'echo',
    light: 'moon',
    grade: 'teal',
    meter: SHIFTED_METER,
    lines: [
      { speaker: '', chara: null, camera: 'pull-back', beat: 600, text: '屋上。フェンスのそばに、淡く光る人影があった。' },
      { speaker: 'ずんだもん', chara: 'zun_sad', echo: true, camera: 'push', fx: 'rack', beat: 1600, speed: 'slow', text: '……やっぱり。キミには、見えるのだ？' },
      { speaker: 'ずんだもん', chara: 'zun_cry', echo: true, cutin: 'eyes', speed: 'slow', music: 'duck', text: 'この世界で、ボクは*生まれなかったこと*になってるのだ。今のボクは、前の世界の「残響」なのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, still: 'echo', fx: 'leak', music: 'swell', scope: 'wide', beat: 900, text: 'でも、キミが覚えててくれるから……まだ、ここにいられるみたいなのだ。' },
    ],
    choices: [
      { text: '「絶対に、元の世界に戻す」', next: 'observer' },
      { text: '「……どうすればいいんだ」', next: 'observer' },
    ],
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
      { speaker: '???', chara: null, fx: 'glitch', music: 'cut', beat: 1300, text: '戻したいのなら、方法はありますわ。' },
      { speaker: '', chara: 'metan_normal', fx: 'whip', camera: 'tilt-up', music: 'normal', text: 'いつの間にか、白いドレスの少女が立っていた。' },
      { speaker: '四国めたん', chara: 'metan_smug', still: 'observer', text: 'わたくしは四国めたん。世界の揺らぎを記録する*〈観測者〉*……とでも名乗っておきましょうか。' },
      { speaker: '四国めたん', chara: 'metan_serious', camera: 'dutch', cutin: 'eyes', fx: 'zoom', text: '最初のメッセージを、もう一通で*打ち消しなさい*。ただし——' },
      { speaker: '四国めたん', chara: 'metan_sad', camera: 'push', text: '世界を越えた記憶は、戻った先では~たいてい消えてしまう~の。' },
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
    ],
    next: 'lastLab',
  },

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
      { speaker: '', chara: null, movie: 'memories', music: 'normal', speed: 'slow', text: '——思い出すのは、夕焼けの部室のことばかりだった。' },
      { speaker: 'SYSTEM', chara: null, text: '> 残り送信回数：1' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, cutin: 'face', beat: 1400, speed: 'slow', music: 'swell', text: '最後のメッセージも……キミが決めるのだ。' },
    ],
    choices: [
      { text: '『さっきのメッセージは無視しろ』', next: 'final' },
      { text: '『緑の髪のあいつを、絶対に忘れるな』', next: 'final' },
    ],
  },

  final: {
    bg: 'lab_night',
    bgm: 'echo',
    ambient: 'echo',
    grade: 'bleach',
    scope: true,
    meter: '?.??????',
    lines: [
      { speaker: 'SYSTEM', chara: null, fx: 'meter', text: '> SEND ………… OK' },
      { speaker: 'ずんだもん', chara: 'zun_smile', echo: true, still: 'farewell', cinema: true, fx: 'leak', beat: 1800, speed: 'slow', music: 'muffle', scope: 'wide', text: 'またね、なのだ。' },
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
      { speaker: '', chara: null, camera: 'drift', beat: 800, text: 'まぶしい。夕焼けの物理準備室。' },
      { speaker: 'ずんだもん', chara: 'zun_proud', fx: 'burst', camera: 'push', text: '待ってたのだ！ ついに完成したのだ、過去改変装置*〈リライター〉*！' },
      { speaker: '', chara: 'zun_proud', beat: 900, speed: 'slow', music: 'muffle', text: '……その言葉を、どこかで聞いた気がした。' },
      { speaker: 'ずんだもん', chara: 'zun_normal', music: 'normal', text: 'どうしたのだ？ ぼーっとして。' },
      { speaker: '僕', chara: 'zun_normal', text: '「いや……前にも、まったく同じことがあった気がして」' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', cutin: 'eyes', fx: 'zoom', text: 'デジャヴってやつなのだ!? それはきっと、世界線が揺らいでる証拠なのだ！' },
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
      { speaker: 'ずんだもん', chara: 'zun_cry', echo: true, cutin: 'eyes', speed: 'slow', music: 'duck', text: 'ボクのせいなのだ。あんな装置、作らなければよかったのだ。' },
      { speaker: '僕', chara: 'zun_cry', echo: true, text: '「そんなことない。もう一度、方法を探せば——」' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', echo: true, music: 'muffle', text: 'ううん。……見て。もう、手が透けてるのだ。' },
      { speaker: '', chara: 'zun_gentle', echo: true, fx: 'leak', sfx: 'heartbeat', speed: 'slow', text: '指先から、光の粒になってほどけていく。' },
      { speaker: 'ずんだもん', chara: null, still: 'end_lost', cinema: true, beat: 1600, speed: 'slow', scope: 'wide', text: 'キミと作った放課後、楽しかったのだ。' },
      { speaker: '', chara: null, ghost: 'zun_gentle', music: 'cut', sfx: 'tinnitus', beat: 1200, text: '——気がつくと、屋上には僕ひとりだった。' },
      { speaker: '', chara: null, cinema: true, speed: 'slow', text: '観測は、そこで終わった。' },
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
      { speaker: '', chara: 'zun_normal', text: '緑の髪の女の子。たしか同じ研究会の……ずんだもん、だったか。' },
      { speaker: 'ずんだもん', chara: 'zun_sad', beat: 1000, speed: 'slow', text: '……やっぱり、覚えてないのだ？ 昨日のこと。' },
      { speaker: '僕', chara: 'zun_sad', text: '「昨日？ 何かあったっけ」' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', cutin: 'face', speed: 'slow', music: 'duck', text: 'ううん。なんでもないのだ。' },
      { speaker: 'ずんだもん', chara: 'zun_smile', music: 'normal', text: 'ねえ、キミ。「ありがとう」って、言ってみてほしいのだ。' },
      { speaker: '僕', chara: 'zun_smile', text: '「……ありがとう？ なんで？」' },
      { speaker: 'ずんだもん', chara: null, still: 'end_alone', fx: 'leak', beat: 1200, speed: 'slow', music: 'swell', text: 'えへへ。……それが聞けたから、もう十分なのだ。' },
      { speaker: '', chara: null, cinema: true, scope: 'wide', text: '彼女だけが知っている昨日を、僕は知らない。' },
    ],
  },

  // TRUE END おかえりなのだ（ありがとう → 絶対に戻す → 忘れるな）
  ep_true: {
    chapter: { no: 'EP', title: 'おかえりなのだ', sub: 'TRUE EPILOGUE' },
    place: { name: '物理準備室', time: '16:48' },
    bg: 'lab_evening',
    bgm: 'evening',
    ambient: 'dust',
    light: 'sunset',
    grade: 'warm',
    meter: FIRST_METER,
    epilogue: true,
    lines: [
      { speaker: '', chara: null, camera: 'drift', beat: 900, text: 'まぶしい。夕焼けの物理準備室。' },
      { speaker: '', chara: null, fx: 'meter', text: '観測計は、*0.409431*。' },
      { speaker: 'ずんだもん', chara: 'zun_surprise', fx: 'zoom', text: 'わっ!? キ、キミ……なんで泣いてるのだ？' },
      { speaker: '僕', chara: 'zun_surprise', beat: 1200, speed: 'slow', text: '「……ただいま」' },
      { speaker: 'ずんだもん', chara: 'zun_normal', beat: 800, text: '……？ 変なの。でも——' },
      { speaker: 'ずんだもん', chara: null, still: 'end_true', fx: 'leak', music: 'swell', text: 'おかえりなのだ！' },
      { speaker: 'ずんだもん', chara: 'zun_proud', music: 'normal', text: 'そういえば、昨日の自分から変なメッセージが届いてたのだ。「ずんだもんに、ありがとうって言え」って。' },
      { speaker: 'ずんだもん', chara: 'zun_gentle', cutin: 'face', beat: 1000, speed: 'slow', text: '……だから、ボクから先に言っておくのだ。ありがとう、なのだ。' },
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
      { speaker: '四国めたん', chara: 'metan_sad', cutin: 'eyes', beat: 1000, speed: 'slow', music: 'duck', text: '世界線は閉じ、記憶は残らなかった。あの二人の夜は、わたくしの記録の中にしかない。' },
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
      { speaker: '', chara: null, camera: 'drift', text: '翌日。クラスに、見覚えのある緑の髪の転校生がいた。' },
      { speaker: 'ずんだもん', chara: 'zun_other', text: 'はじめまして。転校してきた、ずんだもんです。' },
      { speaker: '', chara: 'zun_other', fx: 'glitch', beat: 700, text: '語尾に「のだ」が、*ない*。' },
      { speaker: '僕', chara: 'zun_other', text: '「……前に、どこかで会ったこと、ない？」' },
      { speaker: 'ずんだもん', chara: 'zun_other', cutin: 'face', beat: 1200, speed: 'slow', music: 'duck', text: '……ふしぎですね。わたしも、そんな気がしていました。' },
      { speaker: 'ずんだもん', chara: 'zun_other', music: 'normal', text: 'あの、よかったら部活を案内してもらえませんか？ 物理準備室って、どこですか？' },
      { speaker: '僕', chara: 'zun_other', music: 'swell', text: '「ああ。……ちょうど、部員を探してたんだ」' },
      { speaker: 'ずんだもん', chara: null, still: 'end_shifted', fx: 'leak', speed: 'slow', text: 'ふふ。なんだか、すごく懐かしい気がします。' },
      { speaker: '', chara: null, cinema: true, scope: 'wide', text: '少しずれた世界で、もう一度、「はじめまして」から。' },
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
}

// ストアと分岐図の両方から使うので、関数にしてここに置いておく
export function getEndingType(path) {
  return endingByPath[path] ?? 'lost'
}

export const endings = {
  deja: {
    still: 'end_deja',
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
    bgm: 'evening',
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

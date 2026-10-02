// ===== ムービー（映像演出）のデータ =====
// 動画ファイルではなく、「カット（shot）」を順番に見せて映像にする。
// 1カットの書き方：
//   bg / still : 表示する画像（背景 public/images/bg/〇〇.webp か、スチル public/images/still/〇〇.webp）
//   chara / echo : 背景の上に立たせるキャラ（立ち絵の名前）と、残響にするか
//   duration   : 表示する時間（ミリ秒）
//   motion     : カメラの動き  'pan-right' | 'pan-left' | 'pan-up' | 'zoom-in' | 'zoom-out' | 'shake'
//   effect     : 特殊効果      'digits'（数字の雨） | 'glitch' | 'flash'（白く光る） | 'white' | 'title' | 'rewind'（巻き戻し） | 'memory'（色あせた思い出）
//                 タイムリープ用：'suck'（渦を巻いて吸いこまれる） | 'leap'（時間のトンネルを飛ぶ） | 'arrive'（着地の衝撃）
//   flyby      : 'leap' のとき、トンネルの横を通りすぎる景色（bg か still の名前）
//   reverse    : 'leap' のとき true なら、すべてが奥へ吸いこまれていく（巻き戻し）
//   label      : 'leap' のとき、時計の上に出す文字
//   caption    : 字幕
//   sound      : 効果音の名前（composables/useSound.js）

export const movies = {
  // タイトルの START を押したときのオープニング
  opening: [
    { bg: 'front_evening', duration: 3600, motion: 'pan-right', caption: 'その放課後、世界は一度だけ書き換わった。', sound: 'whoosh' },
    { bg: 'hallway_evening', duration: 3000, motion: 'zoom-in', caption: '誰もいない廊下の先に、僕たちの部室がある。' },
    { bg: 'stairs_evening', duration: 2800, motion: 'pan-up', caption: '時間工学研究会。部員、二名。' },
    { bg: 'lab_evening', duration: 3000, motion: 'zoom-in', caption: '過去へメッセージを送る装置〈リライター〉。' },
    { still: 'echo', duration: 500, motion: 'shake', effect: 'glitch', sound: 'glitch' }, // 一瞬だけ未来のカット
    { effect: 'digits', duration: 1600 },
    { effect: 'title', duration: 3000, caption: '放課後リライト', sound: 'impact' },
  ],

  // 最初のメッセージを送った直後（shift シーンに入るとき）
  shift: [
    { effect: 'digits', duration: 1700, caption: '> SEND', sound: 'send' },
    { bg: 'lab_evening', duration: 1600, effect: 'suck', sound: 'suck' },
    { effect: 'leap', duration: 2800, flyby: ['hallway_evening', 'roof_day', 'classroom_evening', 'front_evening', 'stairs_evening'], label: 'WORLD LINE SHIFT', sound: 'warp' },
    { effect: 'flash', duration: 500, sound: 'land' },
    { bg: 'lab_night', duration: 2600, effect: 'arrive', caption: '観測値 0.409431 → 1.130205' },
  ],

  // 走馬灯：最後の選択の前に、ふたりの放課後が色あせたフィルムのように流れる
  memories: [
    { bg: 'roof_day', chara: 'zun_proud', duration: 3000, motion: 'zoom-in', effect: 'memory', caption: '「半分こしてあげるのだ。部員への福利厚生なのだ」' },
    { bg: 'lab_evening', chara: 'zun_proud', duration: 3200, motion: 'zoom-in', effect: 'memory', caption: '「待ってたのだ！ ついに完成したのだ！」' },
    { bg: 'lab_evening', chara: 'zun_surprise', duration: 2400, motion: 'pan-left', effect: 'memory', caption: '「ボクの発明を疑ってるのだ!?」' },
    { still: 'promise', duration: 3400, motion: 'zoom-in', effect: 'memory', caption: '「キミに決めさせてあげるのだ」' },
    { bg: 'classroom_evening', duration: 2400, motion: 'pan-right', effect: 'memory', caption: '——いつもの、なんでもない放課後。' },
    { still: 'ramen', duration: 3000, motion: 'zoom-in', effect: 'memory', caption: '「約束なのだ。……ボク、塩味がいいのだ」' },
    { still: 'echo', duration: 3200, motion: 'zoom-out', effect: 'memory', caption: '「キミが覚えててくれるから……」' },
    { effect: 'white', duration: 1400 },
  ],

  // 走馬灯（嵐のルート）：カップラーメンの代わりに、雨の中で笑う彼女
  memoriesRain: [
    { bg: 'roof_day', chara: 'zun_proud', duration: 3000, motion: 'zoom-in', effect: 'memory', caption: '「半分こしてあげるのだ。部員への福利厚生なのだ」' },
    { bg: 'lab_evening', chara: 'zun_proud', duration: 3200, motion: 'zoom-in', effect: 'memory', caption: '「待ってたのだ！ ついに完成したのだ！」' },
    { bg: 'lab_evening', chara: 'zun_surprise', duration: 2400, motion: 'pan-left', effect: 'memory', caption: '「ボクの発明を疑ってるのだ!?」' },
    { still: 'promise', duration: 3400, motion: 'zoom-in', effect: 'memory', caption: '「キミに決めさせてあげるのだ」' },
    { bg: 'classroom_evening', duration: 2400, motion: 'pan-right', effect: 'memory', caption: '——いつもの、なんでもない放課後。' },
    { still: 'rain', duration: 3000, motion: 'zoom-in', effect: 'memory', caption: '「もし決めてくれるなら、うれしいのだ」' },
    { still: 'echo', duration: 3200, motion: 'zoom-out', effect: 'memory', caption: '「キミが覚えててくれるから……」' },
    { effect: 'white', duration: 1400 },
  ],

  // 再会の走馬灯（TRUE で「ただいま」と言う瞬間）：これまでの絵が光とともに駆け抜ける
  reunion: [
    { still: 'promise', duration: 450, motion: 'zoom-in', sound: 'whoosh' },
    { still: 'ramen', duration: 450, motion: 'zoom-in' },
    { still: 'echo', duration: 450, motion: 'zoom-in' },
    { still: 'observer', duration: 450, motion: 'zoom-in' },
    { still: 'farewell', duration: 600, motion: 'zoom-in' },
    { effect: 'flash', duration: 500, sound: 'impact' },
    { effect: 'white', duration: 900 },
  ],

  // 最後のメッセージのあと、エンディングの前
  rewind: [
    { effect: 'digits', duration: 1500, caption: '> SEND', sound: 'send' },
    { still: 'farewell', duration: 1100, motion: 'zoom-out', effect: 'rewind', sound: 'rewind' },
    { still: 'farewell', duration: 1500, effect: 'suck', sound: 'suck' },
    { effect: 'leap', duration: 3400, reverse: true, flyby: ['roof_night', 'ramen', 'classroom_night', 'promise', 'lab_night', 'lab_evening'], label: 'REWIND', sound: 'warp' },
    { effect: 'flash', duration: 700, sound: 'land' },
    { effect: 'white', duration: 1400, caption: '——観測、再開。' },
  ],
}

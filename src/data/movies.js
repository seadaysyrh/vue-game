// ===== ムービー（映像演出）のデータ =====
// 動画ファイルではなく、「カット（shot）」を順番に見せて映像にする。
// 1カットの書き方：
//   bg / still : 表示する画像（背景 public/images/bg/〇〇.webp か、スチル public/images/still/〇〇.webp）
//   duration   : 表示する時間（ミリ秒）
//   motion     : カメラの動き  'pan-right' | 'pan-left' | 'pan-up' | 'zoom-in' | 'zoom-out' | 'shake'
//   effect     : 特殊効果      'digits'（数字の雨） | 'glitch' | 'flash'（白く光る） | 'white' | 'title' | 'rewind'（巻き戻し）
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
    { bg: 'lab_evening', duration: 450, motion: 'shake', effect: 'glitch', sound: 'glitch' },
    { bg: 'front_night', duration: 380, motion: 'shake', effect: 'glitch' },
    { bg: 'hallway_night', duration: 380, motion: 'shake', effect: 'glitch' },
    { effect: 'flash', duration: 600, sound: 'impact' },
    { bg: 'lab_night', duration: 2600, motion: 'zoom-out', caption: '観測値 0.409431 → 1.130205' },
  ],

  // 最後のメッセージのあと、エンディングの前
  rewind: [
    { still: 'farewell', duration: 1600, motion: 'zoom-out', effect: 'rewind', sound: 'rewind' },
    { bg: 'roof_night', duration: 480, effect: 'rewind' },
    { bg: 'classroom_night', duration: 440, effect: 'rewind' },
    { bg: 'lab_night', duration: 400, effect: 'rewind' },
    { bg: 'lab_evening', duration: 440, effect: 'rewind' },
    { effect: 'flash', duration: 700, sound: 'impact' },
    { effect: 'white', duration: 1400, caption: '——観測、再開。' },
  ],
}

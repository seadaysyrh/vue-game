// ===== 立ち絵の「目の位置」 =====
// 目のアップ（カットイン）で、どこを拡大するかに使う。
// 値は立ち絵の画像の中での割合（x: 左端 0 〜 右端 1、y: 上端 0 〜 下端 1）。
// 表情によって画像の切り抜き範囲が少し違うので、表情ごとに持っている
//   aspect : 画像の 横 ÷ 縦
//   eyeSpan: 両目の幅が、画像の横幅のどれくらいか
//   mouthY : 目から口までの距離（画像の高さに対する割合）。口のアップに使う
const ZUN = { aspect: 0.503, eyeSpan: 0.3, mouthY: 0.045 }
const ZUN_TALL = { aspect: 0.483, eyeSpan: 0.29, mouthY: 0.045 } // 枝豆が立っていて、画像が縦に長い表情
const ZUN_WIDE = { aspect: 0.531, eyeSpan: 0.29, mouthY: 0.046 } // 枝豆がしおれて、画像が横に広い表情
const METAN = { aspect: 0.485, eyeSpan: 0.3, mouthY: 0.078 }

export const FACES = {
  zun_normal: { ...ZUN, x: 0.318, y: 0.185 },
  zun_smile: { ...ZUN, x: 0.318, y: 0.185 },
  zun_proud: { ...ZUN, x: 0.318, y: 0.185 },
  zun_gentle: { ...ZUN, x: 0.318, y: 0.185 },
  zun_surprise: { ...ZUN_TALL, x: 0.318, y: 0.24 },
  zun_other: { ...ZUN_TALL, x: 0.331, y: 0.24 },
  zun_sad: { ...ZUN_WIDE, x: 0.338, y: 0.164 },
  zun_cry: { ...ZUN_WIDE, x: 0.338, y: 0.178 }, // 閉じた目は、開いた目より少し下に描かれている
  metan_normal: { ...METAN, x: 0.476, y: 0.155 },
  metan_smug: { ...METAN, x: 0.476, y: 0.155 },
  metan_serious: { ...METAN, x: 0.476, y: 0.155 },
  metan_sad: { ...METAN, x: 0.476, y: 0.155 },
}

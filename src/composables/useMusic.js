// ===== BGM（自動演奏） =====
// 音声ファイルは使わず、コード進行のデータから、その場で楽器の音を作って演奏する。
// しくみ：少し先（0.25秒先まで）の音符を予約しておく「先読みスケジューラ」。
//         setInterval で 50ms ごとに「次に鳴らす音」を予約していく。
import { getAudio } from './audioCore'

// ----- 音名 → 周波数（'A4' = 440Hz） -----
const SEMITONE = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }
function freq(note) {
  const [, name, accidental, octave] = note.match(/^([A-G])(#|b)?(\d)$/)
  const n = SEMITONE[name] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0) + (Number(octave) - 4) * 12
  return 440 * Math.pow(2, n / 12)
}

// ----- 曲のデータ -----
// chords の各コードは [ベース音, 上に重ねる音...]。1小節に1コード、4小節でループする
const TRACKS = {
  // メインテーマ：物語の山場でだけ流れる、旋律のある曲
  //   コードは「王道進行」（Fmaj7 → G → Em7 → Am7）。切ないのに前を向ける響き
  //   melody は1小節ごとに8つ（8分音符）。'-' は前の音をのばす（＝何も鳴らさない）
  theme: {
    bpm: 76,
    chords: [
      ['F2', 'A3', 'C4', 'E4'],
      ['G2', 'B3', 'D4', 'G4'],
      ['E2', 'G3', 'B3', 'D4'],
      ['A2', 'C4', 'E4', 'G4'],
    ],
    pad: { type: 'sine', vol: 0.03, cutoff: 2400 },
    arp: { pattern: [1, 2, 3, 2, 1, 2, 3, 2], octave: 0, vol: 0.022 },
    melody: [
      ['E5', '-', 'G5', '-', 'A5', '-', 'G5', '-'],
      ['F5', '-', '-', 'E5', 'D5', '-', 'G4', '-'],
      ['E5', '-', '-', 'D5', 'C5', '-', 'B4', '-'],
      ['C5', '-', '-', '-', 'A4', '-', '-', '-'],
      ['E5', '-', 'G5', '-', 'C6', '-', 'B5', 'A5'],
      ['G5', '-', '-', 'F5', 'E5', '-', 'D5', '-'],
      ['E5', '-', 'D5', '-', 'C5', '-', 'B4', '-'],
      ['C5', '-', '-', '-', '-', '-', '-', '-'],
    ],
  },
  // 昼休み：明るく軽やかな日常
  day: {
    bpm: 96,
    chords: [
      ['C3', 'E4', 'G4', 'C5'],
      ['G2', 'D4', 'G4', 'B4'],
      ['A2', 'C4', 'E4', 'A4'],
      ['F2', 'A3', 'C4', 'F4'],
    ],
    pad: { type: 'triangle', vol: 0.025, cutoff: 2600 },
    arp: { pattern: [1, 3, 2, 3, 1, 3, 2, 3], octave: 1, vol: 0.05 },
    bell: { chance: 0.1, vol: 0.03 },
  },
  // 夕方の部室：あたたかいパッドと、ころころ鳴るアルペジオ
  evening: {
    bpm: 72,
    chords: [
      ['C3', 'E4', 'G4', 'B4', 'D5'],
      ['A2', 'C4', 'E4', 'G4', 'B4'],
      ['F2', 'A3', 'C4', 'E4', 'G4'],
      ['G2', 'B3', 'D4', 'F4', 'A4'],
    ],
    pad: { type: 'triangle', vol: 0.035, cutoff: 1800 },
    arp: { pattern: [1, 2, 3, 4, 2, 3, 4, 1], octave: 1, vol: 0.045 },
    bell: { chance: 0.15, vol: 0.03 },
  },
  // 夜の校舎：低くうなるパッドと、まばらな鐘
  night: {
    bpm: 56,
    chords: [
      ['D2', 'A3', 'D4', 'F4'],
      ['Bb1', 'F3', 'Bb3', 'D4'],
      ['C2', 'G3', 'C4', 'E4'],
      ['A1', 'E3', 'A3', 'C#4'],
    ],
    pad: { type: 'sawtooth', vol: 0.022, cutoff: 650 },
    bell: { chance: 0.3, vol: 0.045 },
    wind: true,
  },
  // 残響：透明な高音のきらめき
  echo: {
    bpm: 66,
    chords: [
      ['E2', 'B3', 'D4', 'F#4', 'G4'],
      ['C2', 'G3', 'B3', 'D4', 'E4'],
      ['G2', 'D4', 'F#4', 'A4', 'B4'],
      ['D2', 'A3', 'C#4', 'E4', 'F#4'],
    ],
    pad: { type: 'sine', vol: 0.045, cutoff: 3000 },
    arp: { pattern: [4, 1, 3, 2, 4, 3, 1, 2], octave: 2, vol: 0.025 },
    bell: { chance: 0.25, vol: 0.035 },
  },
  // 緊張：刻むベースとチクタク鳴るリズム
  tension: {
    bpm: 104,
    chords: [
      ['A1', 'E3', 'A3', 'C4'],
      ['F1', 'C3', 'F3', 'A3'],
      ['D2', 'A3', 'D4', 'F4'],
      ['E2', 'B3', 'E4', 'G#4'],
    ],
    pad: { type: 'sawtooth', vol: 0.018, cutoff: 900 },
    pulse: true,
  },
}

// ----- 楽器 -----
// パッド：ゆっくり立ち上がって、ゆっくり消える和音
function pad(c, out, f, time, dur, { type, vol, cutoff }) {
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = cutoff
  const gain = c.createGain()
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(vol, time + 0.9)
  gain.gain.setValueAtTime(vol, time + dur)
  gain.gain.linearRampToValueAtTime(0, time + dur + 1.4)
  filter.connect(gain).connect(out)
  for (const detune of [-7, 7]) {
    // 少しだけずらした2つの音を重ねると、厚みのある音になる
    const osc = c.createOscillator()
    osc.type = type
    osc.frequency.value = f
    osc.detune.value = detune
    osc.connect(filter)
    osc.start(time)
    osc.stop(time + dur + 1.5)
  }
}

// プラック：ポロンとはじく音
function pluck(c, out, f, time, vol) {
  const osc = c.createOscillator()
  osc.type = 'triangle'
  osc.frequency.value = f
  const gain = c.createGain()
  gain.gain.setValueAtTime(vol, time)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.7)
  osc.connect(gain).connect(out)
  osc.start(time)
  osc.stop(time + 0.75)
}

// ベル：キーンと長く響く音（倍音をずらして金属っぽくする）
function bell(c, out, f, time, vol) {
  for (const [ratio, v] of [[1, 1], [2.76, 0.4], [5.4, 0.15]]) {
    const osc = c.createOscillator()
    osc.frequency.value = f * ratio
    const gain = c.createGain()
    gain.gain.setValueAtTime(vol * v, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 3)
    osc.connect(gain).connect(out)
    osc.start(time)
    osc.stop(time + 3)
  }
}

// ベース：低い音
function bass(c, out, f, time, dur, vol) {
  const osc = c.createOscillator()
  osc.frequency.value = f
  const gain = c.createGain()
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(vol, time + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur)
  osc.connect(gain).connect(out)
  osc.start(time)
  osc.stop(time + dur)
}

// ピアノ：ポーンと鳴って、ゆっくり減っていく（倍音を少し重ねて、やわらかい鍵盤の音に）
function piano(c, out, f, time, vol) {
  for (const [ratio, type, v] of [[1, 'triangle', 1], [2, 'sine', 0.35], [3, 'sine', 0.12]]) {
    const osc = c.createOscillator()
    osc.type = type
    osc.frequency.value = f * ratio
    const gain = c.createGain()
    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(vol * v, time + 0.01)
    gain.gain.exponentialRampToValueAtTime(vol * v * 0.35, time + 0.4)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.6)
    osc.connect(gain).connect(out)
    osc.start(time)
    osc.stop(time + 2.7)
  }
}

// ノイズ：風の音・リズムのチッという音
function noiseBurst(c, out, time, dur, vol, cutoff, type = 'lowpass') {
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = type
  filter.frequency.value = cutoff
  const gain = c.createGain()
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(vol, time + dur * 0.4)
  gain.gain.linearRampToValueAtTime(0, time + dur)
  src.connect(filter).connect(gain).connect(out)
  src.start(time)
}

// ----- 音楽の出口：ここで「こもらせる」「小さくする」などの演技をする -----
//   曲 → ローパスフィルター（高い音を削ると、水の中のようにこもった音になる） → 音量 → スピーカー
let chain = null
function getChain(c, master) {
  if (chain) return chain
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 20000
  const gain = c.createGain()
  filter.connect(gain).connect(master)
  chain = { input: filter, filter, gain }
  return chain
}

// ----- 響き（リバーブとディレイ） -----
let effects = null
function getEffects(c, master) {
  if (effects) return effects
  master = getChain(c, master).input // 響きも、音楽の出口を通す
  // リバーブ：だんだん小さくなるノイズを「響き方の型」にして、音を響かせる
  const reverb = c.createConvolver()
  const len = c.sampleRate * 3
  const ir = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
  }
  reverb.buffer = ir
  const reverbGain = c.createGain()
  reverbGain.gain.value = 0.5
  reverb.connect(reverbGain).connect(master)

  // ディレイ：やまびこ。出した音を少し遅れて、小さく繰り返す
  const delay = c.createDelay(2)
  delay.delayTime.value = 0.42
  const feedback = c.createGain()
  feedback.gain.value = 0.35
  delay.connect(feedback).connect(delay)
  delay.connect(reverb)

  effects = { reverb, delay }
  return effects
}

// ----- 演奏の管理 -----
let current = null // { name, bus, timer }
const MUSIC_VOLUME = 0.5

function startTrack(name, c, master) {
  const track = TRACKS[name]
  const fx = getEffects(c, master)
  const bus = c.createGain() // この曲の音量つまみ（フェードイン・アウトに使う）
  bus.gain.setValueAtTime(0, c.currentTime)
  bus.gain.linearRampToValueAtTime(MUSIC_VOLUME, c.currentTime + 2.5)
  bus.connect(getChain(c, master).input)
  bus.connect(fx.reverb)

  const sendDelay = c.createGain() // アルペジオとベルだけ、やまびこを付ける
  sendDelay.gain.value = 0.5
  sendDelay.connect(fx.delay)

  const eighth = 60 / track.bpm / 2 // 8分音符の長さ（秒）
  let step = 0
  let nextTime = c.currentTime + 0.1

  function scheduleStep(time) {
    const bar = Math.floor(step / 8)
    const inBar = step % 8
    const chord = track.chords[bar % track.chords.length]
    const barLength = eighth * 8

    if (inBar === 0) {
      chord.slice(1).forEach((n) => pad(c, bus, freq(n), time, barLength, track.pad))
      if (!track.pulse) bass(c, bus, freq(chord[0]), time, barLength * 1.1, 0.09)
      if (track.wind) noiseBurst(c, bus, time, barLength * 1.5, 0.05, 500)
    }
    if (track.arp) {
      const n = chord[track.arp.pattern[inBar] % chord.length]
      const f = freq(n) * Math.pow(2, track.arp.octave)
      pluck(c, bus, f, time, track.arp.vol)
      pluck(c, sendDelay, f, time, track.arp.vol)
    }
    if (track.bell && inBar % 2 === 0 && Math.random() < track.bell.chance) {
      const n = chord[1 + Math.floor(Math.random() * (chord.length - 1))]
      bell(c, sendDelay, freq(n) * 4, time, track.bell.vol)
      bell(c, bus, freq(n) * 4, time, track.bell.vol * 0.6)
    }
    if (track.melody) {
      // 旋律は、コード（4小節）より長い8小節でひとまわりする
      const note = track.melody[bar % track.melody.length][inBar]
      if (note !== '-') {
        piano(c, bus, freq(note), time, 0.09)
        piano(c, sendDelay, freq(note), time, 0.03)
      }
    }
    if (track.pulse) {
      bass(c, bus, freq(chord[0]) * (inBar % 4 === 3 ? 2 : 1), time, eighth * 0.9, 0.07)
      noiseBurst(c, bus, time, 0.04, inBar % 2 === 0 ? 0.05 : 0.025, 7000, 'highpass')
    }
  }

  const timer = setInterval(() => {
    while (nextTime < c.currentTime + 0.25) {
      scheduleStep(nextTime)
      nextTime += eighth
      step++
    }
  }, 50)

  return { name, bus, timer }
}

function fadeOutAndStop(track, c) {
  track.bus.gain.cancelScheduledValues(c.currentTime)
  track.bus.gain.setValueAtTime(track.bus.gain.value, c.currentTime)
  track.bus.gain.linearRampToValueAtTime(0, c.currentTime + 2)
  setTimeout(() => {
    clearInterval(track.timer)
    track.bus.disconnect()
  }, 2200)
}

export function useMusic() {
  // name の曲に切り替える（同じ曲なら何もしない）。null なら止める
  function playMusic(name) {
    if (current?.name === name) return
    const audio = getAudio()
    if (!audio) return
    if (current) fadeOutAndStop(current, audio.ctx)
    current = name && TRACKS[name] ? startTrack(name, audio.ctx, audio.master) : null
  }

  // 音楽の「演技」：セリフに合わせて、音の聞こえ方を変える
  //   'normal' … ふつう        'duck'   … 小さく（セリフや効果音を聞かせたいとき）
  //   'muffle' … こもる（夢の中・意識が遠のく感じ）   'cut' … ぷつっと消える（衝撃の瞬間）
  //   'swell'  … ふくらむ（感情の山場）
  function setMood(mood) {
    const audio = getAudio()
    if (!audio) return
    const { ctx } = audio
    const { filter, gain } = getChain(ctx, audio.master)
    const now = ctx.currentTime
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
  }

  return { playMusic, stopMusic: () => playMusic(null), setMood }
}

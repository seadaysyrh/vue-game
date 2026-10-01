// ===== 効果音（コンポーザブル） =====
// 「コンポーザブル」= 複数のコンポーネントで使い回す機能を、use〇〇 という関数にまとめたもの。
// 音声ファイルは使わず、ブラウザの Web Audio API でその場で音を作っている。
import { muted, getAudio, toggleMute } from './audioCore'

// 効果音用の音量つまみ（BGM とは別に音量を決められる）
let sfxBus = null

function getContext() {
  const audio = getAudio()
  if (!audio) return null
  if (!sfxBus) {
    sfxBus = audio.ctx.createGain()
    sfxBus.gain.value = 0.6
    sfxBus.connect(audio.master)
  }
  return audio.ctx
}

// ----- 音のもと -----
// tone：ピーッという音（freq から to へ音の高さが変わる）
function tone(c, { freq, to = freq, dur, type = 'sine', vol = 0.1, delay = 0 }) {
  const t = c.currentTime + delay
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  osc.frequency.exponentialRampToValueAtTime(to, t + dur)
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(sfxBus)
  osc.start(t)
  osc.stop(t + dur)
}

// noise：ザーッという音（ランダムな波を、フィルターで削って音色を作る）
function noise(c, { dur, vol = 0.2, freq = 1000, delay = 0 }) {
  const t = c.currentTime + delay
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = freq
  const gain = c.createGain()
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(filter).connect(gain).connect(sfxBus)
  src.start(t)
}

// ----- 効果音の一覧 -----
const sounds = {
  tick: (c) => tone(c, { freq: 1900, dur: 0.02, type: 'square', vol: 0.02 }),
  select: (c) => {
    tone(c, { freq: 880, dur: 0.08, type: 'triangle', vol: 0.12 })
    tone(c, { freq: 1320, dur: 0.14, type: 'triangle', vol: 0.1, delay: 0.07 })
  },
  send: (c) => {
    ;[0, 0.09, 0.18].forEach((delay, i) => tone(c, { freq: 1200 + i * 400, dur: 0.07, type: 'square', vol: 0.05, delay }))
    tone(c, { freq: 300, to: 2400, dur: 1.2, type: 'sawtooth', vol: 0.04, delay: 0.3 })
  },
  glitch: (c) => {
    noise(c, { dur: 0.35, vol: 0.25, freq: 1800 })
    tone(c, { freq: 140, to: 40, dur: 0.3, type: 'sawtooth', vol: 0.08 })
  },
  shake: (c) => tone(c, { freq: 80, to: 35, dur: 0.5, vol: 0.4 }),
  flash: (c) => {
    tone(c, { freq: 60, to: 30, dur: 0.9, vol: 0.35 })
    noise(c, { dur: 0.7, vol: 0.12, freq: 6000 })
  },
  impact: (c) => {
    tone(c, { freq: 55, to: 28, dur: 1.4, vol: 0.45 })
    noise(c, { dur: 0.9, vol: 0.15, freq: 4000 })
    tone(c, { freq: 1760, dur: 1.2, type: 'sine', vol: 0.03, delay: 0.05 })
  },
  rewind: (c) => {
    tone(c, { freq: 1600, to: 180, dur: 2.2, type: 'sawtooth', vol: 0.04 })
    noise(c, { dur: 2.2, vol: 0.08, freq: 2500 })
  },
  whoosh: (c) => noise(c, { dur: 1.6, vol: 0.1, freq: 600 }),
  // 心臓の音：ドクン、ドクン
  heartbeat: (c) => {
    ;[0, 0.22, 0.9, 1.12].forEach((delay, i) => tone(c, { freq: i % 2 ? 50 : 60, to: 35, dur: 0.18, vol: i % 2 ? 0.35 : 0.5, delay }))
  },
  // 耳鳴り：キーンと高い音が、ゆっくり消える（衝撃で頭が真っ白になる感じ）
  tinnitus: (c) => {
    tone(c, { freq: 5200, to: 5000, dur: 3.5, type: 'sine', vol: 0.025 })
    tone(c, { freq: 40, to: 30, dur: 1.2, vol: 0.4 })
  },
  // スマホのバイブ：低いブーッを短く2回
  buzz: (c) => {
    ;[0, 0.35].forEach((delay) => tone(c, { freq: 150, to: 140, dur: 0.25, type: 'square', vol: 0.05, delay }))
  },
  // 通知音：ポロン
  notify: (c) => {
    tone(c, { freq: 1568, dur: 0.18, type: 'sine', vol: 0.08 })
    tone(c, { freq: 2093, dur: 0.3, type: 'sine', vol: 0.07, delay: 0.09 })
  },
  // 吹き出しが出る音：ポッ
  pop: (c) => tone(c, { freq: 600, to: 1200, dur: 0.08, type: 'sine', vol: 0.08 }),
  // ホイップ（カメラを素早く振る）：シュッ
  whip: (c) => noise(c, { dur: 0.35, vol: 0.18, freq: 2500 }),
}

export function useSound() {
  function play(name) {
    if (muted.value) return
    const c = getContext()
    if (c && sounds[name]) sounds[name](c)
  }

  return { play, muted, toggleMute }
}

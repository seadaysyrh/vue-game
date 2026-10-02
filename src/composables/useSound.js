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

// drone：だんだん大きくなって、最後にスッと消える音（freq から to へ高さが変わる）
function drone(c, { freq, to = freq, dur, type = 'sine', vol = 0.1, attack = dur * 0.8, delay = 0 }) {
  const t = c.currentTime + delay
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  osc.frequency.exponentialRampToValueAtTime(to, t + dur)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(vol, t + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(sfxBus)
  osc.start(t)
  osc.stop(t + dur)
}

// sweep：ザーッという音の「高さ」を動かしながら、だんだん大きくする（風が吸いこまれていく音）
function sweep(c, { dur, from, to, vol = 0.15, attack = dur * 0.85, delay = 0 }) {
  const t = c.currentTime + delay
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 4
  filter.frequency.setValueAtTime(from, t)
  filter.frequency.exponentialRampToValueAtTime(to, t + dur)
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(vol, t + attack)
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
  // ターゲットロック：ピピッと鳴って、データが流れこむ
  lock: (c) => {
    ;[0, 0.12].forEach((delay) => tone(c, { freq: 1760, dur: 0.06, type: 'square', vol: 0.04, delay }))
    tone(c, { freq: 2637, dur: 0.25, type: 'sine', vol: 0.05, delay: 0.3 })
    for (let i = 0; i < 10; i++) tone(c, { freq: 1200 + Math.random() * 1800, dur: 0.025, type: 'square', vol: 0.02, delay: 0.75 + i * 0.06 })
  },
  // 警告つきのロック：低い警報が2回
  alarm: (c) => {
    ;[0, 0.35].forEach((delay) => {
      tone(c, { freq: 440, to: 330, dur: 0.28, type: 'sawtooth', vol: 0.05, delay })
      tone(c, { freq: 880, to: 660, dur: 0.28, type: 'square', vol: 0.02, delay })
    })
    for (let i = 0; i < 10; i++) tone(c, { freq: 900 + Math.random() * 1500, dur: 0.025, type: 'square', vol: 0.02, delay: 0.8 + i * 0.06 })
  },
  // 世界の書き換え：高い音がスーッと下りながら、データの音がこまかく鳴る
  rewrite: (c) => {
    sweep(c, { dur: 1.8, from: 5000, to: 400, vol: 0.12, attack: 0.3 })
    drone(c, { freq: 1200, to: 300, dur: 1.8, type: 'triangle', vol: 0.03, attack: 0.2 })
    for (let i = 0; i < 24; i++) tone(c, { freq: 1500 + Math.random() * 2500, dur: 0.02, type: 'square', vol: 0.015, delay: i * 0.07 })
  },
  // タイムリープ①：息を吸いこむように、音が高く・大きくなっていく
  suck: (c) => {
    sweep(c, { dur: 1.6, from: 300, to: 4500, vol: 0.25 })
    drone(c, { freq: 160, to: 40, dur: 1.6, type: 'sawtooth', vol: 0.05 })
  },
  // タイムリープ②：低いうなりと、時計の針の音がどんどん速くなる
  warp: (c) => {
    drone(c, { freq: 42, to: 110, dur: 3.2, type: 'sawtooth', vol: 0.09, attack: 2.4 })
    drone(c, { freq: 330, to: 2600, dur: 3.2, type: 'sine', vol: 0.025, attack: 2.8 })
    sweep(c, { dur: 3.2, from: 200, to: 6000, vol: 0.16, attack: 2.8 })
    for (let i = 0; i < 40; i++) {
      const delay = 3 * (1 - (1 - i / 40) ** 2) // 間かくがだんだん短くなる = 針が速くなる
      tone(c, { freq: i % 2 ? 2400 : 1800, dur: 0.02, type: 'square', vol: 0.025, delay })
    }
  },
  // タイムリープ③：着地のドン！と、キーンという耳鳴り
  land: (c) => {
    tone(c, { freq: 70, to: 25, dur: 1.6, vol: 0.55 })
    noise(c, { dur: 1.1, vol: 0.2, freq: 3000 })
    tone(c, { freq: 4800, to: 4600, dur: 2.2, type: 'sine', vol: 0.02, delay: 0.1 })
  },
  // 心臓の音：ドクン、ドクン
  heartbeat: (c) => {
    ;[0, 0.22, 0.9, 1.12].forEach((delay, i) => tone(c, { freq: i % 2 ? 50 : 60, to: 35, dur: 0.18, vol: i % 2 ? 0.35 : 0.5, delay }))
  },
  // 耳鳴り：キーンと高い音が、ゆっくり消える（衝撃で頭が真っ白になる感じ）
  tinnitus: (c) => {
    tone(c, { freq: 5200, to: 5000, dur: 3.5, type: 'sine', vol: 0.025 })
    tone(c, { freq: 40, to: 30, dur: 1.2, vol: 0.4 })
  },
  // 雷：遠くでゴロゴロ…と長く低く鳴る
  thunder: (c) => {
    noise(c, { dur: 3.2, vol: 0.3, freq: 120 })
    tone(c, { freq: 45, to: 28, dur: 2.5, vol: 0.35 })
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

// ----- 環境音：雨（ずっと鳴らし続ける音） -----
// ザーッという音を2秒ぶん作ってループ再生し、フィルターで「雨っぽく」削る
let rain = null
function startRain() {
  if (rain || muted.value) return
  const c = getContext()
  if (!c) return
  const buffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  src.loop = true
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1800
  const gain = c.createGain()
  gain.gain.setValueAtTime(0, c.currentTime)
  gain.gain.linearRampToValueAtTime(0.12, c.currentTime + 2.5) // ゆっくり降り出す
  src.connect(filter).connect(gain).connect(sfxBus)
  src.start()
  rain = { src, gain, c }
}
function stopRain() {
  if (!rain) return
  const { src, gain, c } = rain
  gain.gain.cancelScheduledValues(c.currentTime)
  gain.gain.setValueAtTime(gain.gain.value, c.currentTime)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 2.5) // ゆっくり止む
  src.stop(c.currentTime + 2.6)
  rain = null
}

export function useSound() {
  function play(name) {
    if (muted.value) return
    const c = getContext()
    if (c && sounds[name]) sounds[name](c)
  }

  // 天気：'rain' なら雨の音を鳴らし、それ以外なら止める
  function setWeather(weather) {
    if (weather === 'rain') startRain()
    else stopRain()
  }

  return { play, muted, toggleMute, setWeather }
}

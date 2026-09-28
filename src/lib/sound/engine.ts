'use client';

/**
 * Звуковой движок сайта: весь звук синтезируется через Web Audio API — ни одного
 * аудиофайла не грузится. Ничего не звучит, пока человек сам не включит звук
 * (кнопка ♫ в углу) — до этого момента AudioContext даже не создаётся.
 *
 *   sound.enable() / disable()   — переключатель (см. SoundToggle)
 *   sound.hover() / click()      — тихие UI-щелчки
 *   sound.open() / close()       — открытие/закрытие карточки проекта
 *   sound.whoosh()               — переход между секциями / вход элементов
 *   sound.tick()                 — трещotka свободного хода (колесо Cadence)
 *
 * Громкость каждого события небольшая и отличается на ±30-40%, чтобы звук не
 * повторялся механически. Эмбиент — тихий спокойный lo-fi house-луп (мягкий кик
 * в половинном темпе, редкий хай-хэт, тёплые плывущие аккорды пэда) — целиком
 * синтезирован, без единого сэмпла, и звучит фоном, не отвлекая.
 */

type Ready = { ctx: AudioContext; master: GainNode; amb: GainNode };

let ready: Ready | null = null;
let enabled = false;
let ambientStarted = false;
let ambientStop: (() => void) | null = null;
const listeners = new Set<(on: boolean) => void>();

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function ensure(): Ready | null {
  if (ready) return ready;
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  const amb = ctx.createGain();
  amb.gain.value = 0;
  amb.connect(master);
  ready = { ctx, master, amb };
  return ready;
}

/** Короткий тональный «щелчок»: затухающая синусоида/треугольник. */
function ping(freq: number, duration: number, gain: number, type: OscillatorType = 'sine', detune = 0) {
  const r = ready;
  if (!r || !enabled) return;
  const { ctx, master } = r;
  const t0 = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  osc.detune.value = detune;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Мягкий шумовой «клик» — для тактильных, не-музыкальных событий (тик колеса). */
function click(duration: number, gain: number, hp = 800) {
  const r = ready;
  if (!r || !enabled) return;
  const { ctx, master } = r;
  const t0 = ctx.currentTime;
  const n = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filt = ctx.createBiquadFilter();
  filt.type = 'highpass';
  filt.frequency.value = hp;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  src.connect(filt).connect(g).connect(master);
  src.start(t0);
}

const BPM = 92;
const BEAT = 60 / BPM;
const EIGHTH = BEAT / 2;

// Am7 → Fmaj7 → Cmaj7 → G6, каждый аккорд держится 4 такта — медленно и спокойно.
// Четыре голоса пэда не перезапускаются между аккордами, а плавно съезжают к новым нотам (портаменто),
// поэтому смена аккорда не воспринимается как отдельный «удар», а просто как медленный дрейф.
const CHORDS: readonly (readonly [number, number, number, number])[] = [
  [110, 130.81, 164.81, 196],
  [87.31, 110, 130.81, 164.81],
  [130.81, 164.81, 196, 246.94],
  [98, 123.47, 146.83, 164.81],
];

/** Мягкий синтезированный кик: короткое падение частоты + амплитудная огибающая. */
function kick(ctx: AudioContext, out: AudioNode, t: number, gain: number) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(148, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.11);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + 0.24);
}

/** Едва слышный закрытый хай-хэт: короткий отфильтрованный шум. */
function hat(ctx: AudioContext, out: AudioNode, t: number, gain: number) {
  const n = Math.floor(ctx.sampleRate * 0.05);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filt = ctx.createBiquadFilter();
  filt.type = 'highpass';
  filt.frequency.value = 7200;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  src.connect(filt).connect(g).connect(out);
  src.start(t);
}

function startAmbient() {
  const r = ready;
  if (!r || ambientStarted) return;
  ambientStarted = true;
  const { ctx, amb } = r;

  // ── тёплый пэд: 4 голоса через общий lowpass, очень тихо, долгая атака ──
  const filt = ctx.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.value = 900;
  filt.Q.value = 0.3;
  const padOut = ctx.createGain();
  padOut.gain.value = 0.055;
  filt.connect(padOut).connect(amb);

  const voices = CHORDS[0]!.map((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 ? 'triangle' : 'sine';
    osc.frequency.value = freq;
    osc.detune.value = (i - 1.5) * 4;
    const g = ctx.createGain();
    g.gain.value = 0;
    osc.connect(g).connect(filt);
    osc.start();
    // очень медленный "вдох" громкости каждого голоса — пэд слегка дышит, а не стоит статично
    g.gain.linearRampToValueAtTime(0.001, ctx.currentTime);
    g.gain.linearRampToValueAtTime(1, ctx.currentTime + rand(2.5, 4));
    return { osc, g };
  });

  // ── лупер: классический lookahead-scheduler, чтобы ритм не плыл от лагов вкладки ──
  let running = true;
  let nextTime = ctx.currentTime + 0.1;
  let step = 0; // восьмые доли, 8 на такт
  let bar = 0;
  let chordIdx = 0;

  const scheduleStep = (t: number) => {
    const beatOfBar = step % 8;

    // кик в половинном темпе — на первую и третью долю такта, мягкий «пульс», а не диско
    if (beatOfBar === 0 || beatOfBar === 4) kick(ctx, amb, t, rand(0.05, 0.07));

    // хай-хэт только на слабых восьмых, не всегда — чтобы не звучать механически
    if (beatOfBar % 2 === 1 && Math.random() < 0.65) hat(ctx, amb, t, rand(0.006, 0.012));

    if (beatOfBar === 0) {
      bar += 1;
      if (bar % 4 === 0) {
        chordIdx = (chordIdx + 1) % CHORDS.length;
        const chord = CHORDS[chordIdx]!;
        voices.forEach((v, i) => {
          v.osc.frequency.cancelScheduledValues(t);
          v.osc.frequency.setValueAtTime(v.osc.frequency.value, t);
          v.osc.frequency.linearRampToValueAtTime(chord[i]!, t + BEAT * 3.2);
        });
      }
    }
    step += 1;
  };

  const lookahead = 0.1;
  const timer = window.setInterval(() => {
    if (!running) return;
    while (nextTime < ctx.currentTime + lookahead) {
      scheduleStep(nextTime);
      nextTime += EIGHTH;
    }
  }, 25);

  ambientStop = () => {
    running = false;
    window.clearInterval(timer);
    voices.forEach((v) => v.osc.stop());
    ambientStarted = false;
    ambientStop = null;
  };
}

export const sound = {
  isEnabled: () => enabled,
  onChange: (fn: (on: boolean) => void) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },

  /** Вызывать только из явного жеста пользователя (клик по ♫) — так требует WebAudio. */
  enable() {
    const r = ensure();
    if (!r) return;
    enabled = true;
    void r.ctx.resume();
    const t0 = r.ctx.currentTime;
    r.master.gain.cancelScheduledValues(t0);
    r.master.gain.setValueAtTime(r.master.gain.value, t0);
    r.master.gain.linearRampToValueAtTime(0.5, t0 + 0.4);
    r.amb.gain.cancelScheduledValues(t0);
    r.amb.gain.setValueAtTime(r.amb.gain.value, t0);
    r.amb.gain.linearRampToValueAtTime(1, t0 + 1.2);
    startAmbient();
    ping(660, 0.5, 0.05, 'sine');
    listeners.forEach((fn) => fn(true));
  },

  disable() {
    enabled = false;
    const r = ready;
    if (r) {
      const t0 = r.ctx.currentTime;
      r.master.gain.cancelScheduledValues(t0);
      r.master.gain.setValueAtTime(r.master.gain.value, t0);
      r.master.gain.linearRampToValueAtTime(0, t0 + 0.3);
    }
    listeners.forEach((fn) => fn(false));
  },

  hover() {
    ping(rand(760, 820), 0.09, 0.02, 'sine');
  },
  click() {
    ping(rand(300, 340), 0.12, 0.05, 'triangle');
  },
  open() {
    ping(392, 0.16, 0.045, 'sine');
    ping(587.3, 0.22, 0.035, 'sine', 4);
  },
  close() {
    ping(440, 0.16, 0.04, 'sine');
    ping(293.7, 0.2, 0.03, 'sine', -4);
  },
  whoosh() {
    click(0.5, 0.05, 300);
  },
  tick() {
    click(0.04, 0.03, 2200);
  },
};

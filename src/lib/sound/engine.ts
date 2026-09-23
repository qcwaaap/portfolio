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
 * повторялся механически. Эмбиент — два очень тихих детуненных тона плюс
 * редкие «капли» — заводится через несколько секунд после включения.
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

function startAmbient() {
  const r = ready;
  if (!r || ambientStarted) return;
  ambientStarted = true;
  const { ctx, amb } = r;

  const drone = (freq: number, detune: number, gain: number) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const g = ctx.createGain();
    g.gain.value = gain;
    osc.connect(g).connect(amb);
    osc.start();
    return { osc, g };
  };
  const a = drone(96, -6, 0.5);
  const b = drone(144.5, 5, 0.32);

  // очень медленное «дыхание» громкости, чтобы дрон не звучал статично
  let raf = 0;
  let t = 0;
  const breathe = () => {
    t += 1 / 60;
    a.g.gain.value = 0.4 + Math.sin(t * 0.11) * 0.12;
    b.g.gain.value = 0.24 + Math.sin(t * 0.08 + 1.4) * 0.1;
    raf = requestAnimationFrame(breathe);
  };
  breathe();

  // редкие тихие «капли» лоу-фай мелодии
  let dropTimer = window.setTimeout(function drop() {
    if (enabled) {
      const scale = [261.6, 293.7, 329.6, 392, 440, 523.3];
      ping(scale[Math.floor(Math.random() * scale.length)]!, rand(1.4, 2.2), rand(0.02, 0.035), 'sine');
    }
    dropTimer = window.setTimeout(drop, rand(3800, 7200));
  }, rand(2000, 4000));

  ambientStop = () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(dropTimer);
    a.osc.stop();
    b.osc.stop();
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

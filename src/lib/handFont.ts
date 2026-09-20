import { rng, scribbleCurve, scribbleLine, type Pt } from './sketch';

/**
 * Свой «маркерный» шрифт из штрихов. Каждая буква — набор штрихов в единичном квадрате (0..1).
 * 2 точки → прямая линия, 3+ точек → плавная кривая. Из них собирается слово,
 * каждый штрих дрожит и рисуется дважды (жирный + тонкий «призрак»), как маркером по бумаге.
 */

type Stroke = readonly Pt[];
type Glyph = { w: number; strokes: readonly Stroke[] };

const arc = (cx: number, cy: number, rx: number, ry: number, from: number, to: number, n: number): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((from + ((to - from) * i) / n) * Math.PI) / 180;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Pt;
  });

const GLYPHS: Record<string, Glyph> = {
  M: { w: 1.15, strokes: [[[0, 1], [0.06, 0]], [[0.06, 0], [0.5, 0.62]], [[0.5, 0.62], [0.94, 0]], [[0.94, 0], [1, 1]]] },
  A: { w: 1.05, strokes: [[[0, 1], [0.5, 0]], [[0.5, 0], [1, 1]], [[0.2, 0.68], [0.8, 0.66]]] },
  R: {
    w: 1,
    strokes: [
      [[0.05, 1], [0.07, 0]],
      [[0.07, 0], [0.6, -0.01], [0.9, 0.16], [0.8, 0.4], [0.5, 0.5], [0.07, 0.52]],
      [[0.42, 0.52], [0.95, 1]],
    ],
  },
  I: { w: 0.5, strokes: [[[0.5, 0], [0.5, 1]], [[0.1, 0], [0.9, 0]], [[0.1, 1], [0.9, 1]]] },
  N: { w: 1, strokes: [[[0.05, 1], [0.05, 0]], [[0.05, 0], [0.95, 1]], [[0.95, 1], [0.95, 0]]] },
  E: { w: 0.9, strokes: [[[0.1, 0], [0.08, 1]], [[0.1, 0], [0.92, 0.02]], [[0.1, 0.5], [0.75, 0.5]], [[0.08, 1], [0.92, 0.98]]] },
  D: { w: 1, strokes: [[[0.08, 0], [0.08, 1]], [[0.08, 0], [0.7, 0.05], [1, 0.5], [0.72, 0.95], [0.08, 1]]] },
  B: {
    w: 1,
    strokes: [
      [[0.08, 0], [0.08, 1]],
      [[0.08, 0], [0.68, 0.02], [0.85, 0.24], [0.62, 0.48], [0.08, 0.5]],
      [[0.08, 0.5], [0.78, 0.52], [0.98, 0.74], [0.72, 0.98], [0.08, 1]],
    ],
  },
  L: { w: 0.9, strokes: [[[0.08, 0], [0.08, 1]], [[0.08, 1], [0.9, 1]]] },
  O: { w: 1, strokes: [arc(0.5, 0.5, 0.5, 0.5, -100, 262, 12)] },
  V: { w: 1.05, strokes: [[[0, 0], [0.5, 1]], [[0.5, 1], [1, 0]]] },
};

export type WordStroke = { d: string; width: number; opacity: number; letter: number };

type Drip = { letter: number; u: number; len: number };

type WordOpts = {
  x: number;
  y: number;
  /** высота букв */
  h: number;
  /** ширина базовой буквы */
  unit: number;
  gap: number;
  seed: number;
  /** толщина маркера */
  weight: number;
  /** дрожание линий */
  jitter: number;
  /** «пробег» штриха за концы */
  overshoot: number;
  drips?: readonly Drip[];
};

export function layoutWord(word: string, o: WordOpts) {
  const strokes: WordStroke[] = [];
  const letterX: number[] = [];
  const letterW: number[] = [];
  let cx = o.x;
  let sd = o.seed;

  [...word].forEach((ch, li) => {
    const g = GLYPHS[ch];
    if (!g) return;
    const w = g.w * o.unit;
    letterX[li] = cx;
    letterW[li] = w;

    g.strokes.forEach((st) => {
      sd += 1;
      const pts = st.map(([u, v]) => [cx + u * w, o.y + v * o.h] as Pt);
      const draw = (shift: Pt, seed: number, jit: number, over: number) => {
        const p = pts.map((q) => [q[0] + shift[0], q[1] + shift[1]] as Pt);
        return p.length === 2 ? scribbleLine(p[0]!, p[1]!, seed, { wobble: jit, overshoot: over }) : scribbleCurve(p, seed, jit);
      };
      // основной штрих
      strokes.push({ d: draw([0, 0], sd, o.jitter, o.overshoot), width: o.weight, opacity: 1, letter: li });
      // тонкий «призрак» рядом: как будто обвели ещё раз
      strokes.push({
        d: draw([o.weight * 0.16, o.weight * 0.12], sd + 500, o.jitter * 1.5, o.overshoot * 1.3),
        width: o.weight * 0.34,
        opacity: 0.55,
        letter: li,
      });
    });
    cx += w + o.gap;
  });

  // потёки маркера под буквами
  const rand = rng(o.seed + 900);
  (o.drips ?? []).forEach((dr) => {
    const x = (letterX[dr.letter] ?? 0) + dr.u * (letterW[dr.letter] ?? 0);
    const y0 = o.y + o.h;
    strokes.push({
      d: scribbleLine([x, y0 - 4], [x + (rand() - 0.5) * 3, y0 + dr.len], o.seed + 700 + dr.letter, { wobble: 0.8 }),
      width: o.weight * 0.3,
      opacity: 0.9,
      letter: dr.letter,
    });
  });

  return { strokes, width: cx - o.gap - o.x };
}

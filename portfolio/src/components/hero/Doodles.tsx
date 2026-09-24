import { n3, scribbleArrow, scribbleCircle, scribbleEllipse, scribbleLine, type Pt } from '@/lib/sketch';
import styles from './Hero.module.css';

const draw = (at: number, dur: number) => ({ 'data-draw': '', 'data-at': n3(at), 'data-dur': n3(dur), pathLength: 1 }) as const;

/** Розовая петля вокруг стека + стрелка, ведущая в неё (как в референсе). */
export function PinkLoop() {
  const arrow = scribbleArrow([2, 104], [34, 66], [62, 82], 41, 12);
  return (
    <svg className={styles.loopSvg} viewBox="0 0 340 160" aria-hidden>
      <path d={arrow.shaft} className={styles.pink} strokeWidth={2.2} {...draw(2.9, 0.5)} />
      <path d={arrow.head} className={styles.pink} strokeWidth={2.2} {...draw(3.3, 0.2)} />
      <path d={scribbleEllipse(198, 80, 140, 58, 7, { rotate: -5 })} className={styles.pink} strokeWidth={3.6} {...draw(3.1, 1)} />
      <path d={scribbleEllipse(198, 82, 136, 54, 19, { rotate: -4, sweep: 1.04 })} className={styles.pink} strokeWidth={1.6} strokeOpacity={0.6} {...draw(3.2, 1)} />
      <g data-fade="" data-at="3.4" data-dur="0.5">
        <text x={92} y={70}>react</text>
        <circle cx={168} cy={62} r={2.4} className={styles.fillInk} />
        <text x={182} y={70}>typescript</text>
        <text x={108} y={112}>python</text>
        <text x={224} y={112}>go</text>
      </g>
    </svg>
  );
}

/** «currently somewhere on the internet» + глобус и стрелка. */
export function InternetNote() {
  const globe = { cx: 118, cy: 62, r: 16 };
  const arrowA = scribbleArrow([104, 44], [92, 34], [80, 38], 52, 7);
  const line = scribbleLine([108, 50], [86, 40], 53, { wobble: 0.6 });
  return (
    <svg className={styles.noteSvg} viewBox="0 0 160 84" aria-hidden>
      <g data-fade="" data-at="3.2" data-dur="0.5">
        <text x={4} y={16} transform="rotate(-8 4 16)">currently somewhere</text>
        <text x={26} y={34} transform="rotate(-8 26 34)">on the internet</text>
      </g>
      <g data-fade="" data-at="3.5" data-dur="0.4">
        <path d={scribbleCircle(globe.cx, globe.cy, globe.r, 61, { sweep: 1.06, jitter: 0.02 })} strokeWidth={1.8} />
        <path d={scribbleEllipse(globe.cx, globe.cy, 7, globe.r, 62, { jitter: 0.02, drift: 0 })} strokeWidth={1.3} />
        <path d={scribbleLine([globe.cx - 15, globe.cy], [globe.cx + 15, globe.cy], 63, { wobble: 0.5 })} strokeWidth={1.3} />
        <path d={line} strokeWidth={1.6} />
        <path d={arrowA.head} strokeWidth={1.6} />
      </g>
    </svg>
  );
}

/** Зелёный стикер «scroll down» со стрелкой вниз. */
export function ScrollSticker() {
  const shaft = scribbleLine([28, 6], [30, 50], 71, { wobble: 1.2, overshoot: 2 });
  const head: Pt[] = [
    [16, 38],
    [30, 54],
    [44, 36],
  ];
  return (
    <a href="#work" className={styles.stickerLink} aria-label="Scroll down">
      <span className={styles.stickerText}>
        scroll
        <br />
        down
      </span>
      <svg viewBox="0 0 60 60" className={styles.stickerArrow} aria-hidden>
        <path d={shaft} strokeWidth={3.4} />
        <path d={`M${head.map((p) => p.join(' ')).join('L')}`} strokeWidth={3.4} />
      </svg>
    </a>
  );
}

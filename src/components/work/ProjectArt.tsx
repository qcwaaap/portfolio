import { scribbleArrow, scribbleEllipse, scribbleLine, scribblePoly, type Pt } from '@/lib/sketch';
import type { ProjectId } from '@/content/projects';
import styles from './ProjectArt.module.css';

/** Прямоугольник, обведённый от руки */
const sketchRect = (x: number, y: number, w: number, h: number, seed: number) =>
  scribblePoly(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
      [x - 1, y - 1],
    ] as Pt[],
    seed,
    0.9,
  );

function CadenceArt() {
  return (
    <div className={`${styles.art} ${styles.cadence}`}>
      <div className={styles.cadPanel} aria-hidden>
        <div className={styles.cadBar} />
        <div className={styles.cadLine} />
        <div className={styles.cadLine} />
        <div className={styles.cadLine} />
        <div className={styles.cadLine} />
      </div>
      <svg className={styles.cadArrow} viewBox="0 0 100 70" aria-hidden>
        <path d="M4 12L46 34L38 14L84 52" />
        <path d="M66 50L86 54L80 32" />
      </svg>
    </div>
  );
}

function CardizelArt() {
  return (
    <div className={`${styles.art} ${styles.cardizel}`}>
      <div className={styles.room} />
      <div className={styles.door} />
      <div className={styles.wordmark}>cardizel</div>
      <div className={styles.cardBars} aria-hidden>
        <i />
        <i />
      </div>
    </div>
  );
}

function TodoArt() {
  const boxes = ['FastAPI', 'DI', 'Service', 'UnitOfWork', 'SQLAlchemy'];
  const x = 30;
  const w = 96;
  const h = 22;
  const gap = 12;
  const y0 = 16;
  const arrows = boxes.slice(0, -1).map((_, i) => {
    const y = y0 + i * (h + gap) + h;
    const a = scribbleArrow([x + w / 2, y + 1], [x + w / 2 + 1, y + gap / 2], [x + w / 2, y + gap - 1], 300 + i, 4);
    return a;
  });
  const dbY = y0 + 4 * (h + gap);
  const link = scribbleArrow([x + w + 2, dbY + h / 2], [x + w + 14, dbY + h / 2 - 3], [x + w + 26, dbY + h / 2], 320, 5);
  return (
    <div className={`${styles.art} ${styles.todo}`}>
      <svg className={styles.todoSvg} viewBox="0 0 200 200" aria-hidden>
        {boxes.map((b, i) => {
          const y = y0 + i * (h + gap);
          return (
            <g key={b}>
              <path d={sketchRect(x, y, w, h, 200 + i)} />
              <text x={x + w / 2} y={y + h / 2 + 3}>
                {b}
              </text>
            </g>
          );
        })}
        {arrows.map((a, i) => (
          <g key={i}>
            <path d={a.shaft} />
            <path d={a.head} />
          </g>
        ))}
        <path d={link.shaft} />
        <path d={link.head} />
        {/* база данных */}
        <path d={scribbleEllipse(160, dbY + 6, 15, 6, 330, { jitter: 0.03, drift: 0 })} />
        <path d={scribbleLine([145, dbY + 6], [145, dbY + 26], 331, { wobble: 0.5 })} />
        <path d={scribbleLine([175, dbY + 6], [175, dbY + 26], 332, { wobble: 0.5 })} />
        <path d={`M145 ${dbY + 26}Q160 ${dbY + 34} 175 ${dbY + 26}`} />
      </svg>
    </div>
  );
}

function TamagochiArt() {
  return (
    <div className={`${styles.art} ${styles.tama}`}>
      <svg className={styles.tamaSvg} viewBox="0 0 200 200" aria-hidden>
        {/* грибочки-декорации */}
        <ellipse cx="34" cy="146" rx="16" ry="12" fill="#8d6fd6" />
        <rect x="30" y="146" width="8" height="26" fill="#a98be2" />
        <ellipse cx="170" cy="152" rx="20" ry="14" fill="#7d63cc" />
        <rect x="165" y="152" width="9" height="26" fill="#9a80dc" />
        <ellipse cx="100" cy="182" rx="94" ry="18" fill="#a483dc" opacity="0.65" />
        {/* существо */}
        <path d="M66 62L56 30L82 50Z" fill="#b98f62" />
        <path d="M134 62L144 30L118 50Z" fill="#b98f62" />
        <ellipse cx="100" cy="118" rx="42" ry="40" fill="#f6f0e6" />
        <ellipse cx="100" cy="88" rx="46" ry="38" fill="#faf5ec" />
        <ellipse cx="80" cy="90" rx="10" ry="12" fill="#2a2032" />
        <ellipse cx="120" cy="90" rx="10" ry="12" fill="#2a2032" />
        <circle cx="83" cy="86" r="3.4" fill="#fff" />
        <circle cx="123" cy="86" r="3.4" fill="#fff" />
        <ellipse cx="66" cy="106" rx="7" ry="4.5" fill="#f6a3bd" opacity="0.8" />
        <ellipse cx="134" cy="106" rx="7" ry="4.5" fill="#f6a3bd" opacity="0.8" />
        <path d="M94 104Q100 110 106 104" fill="none" stroke="#2a2032" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="78" cy="156" rx="12" ry="7" fill="#efe6d6" />
        <ellipse cx="122" cy="156" rx="12" ry="7" fill="#efe6d6" />
      </svg>
    </div>
  );
}

/** «Скриншоты-заглушки» проектов, пока нет настоящих картинок. */
export function ProjectArt({ id }: { id: ProjectId }) {
  switch (id) {
    case 'cadence':
      return <CadenceArt />;
    case 'cardizel':
      return <CardizelArt />;
    case 'todo':
      return <TodoArt />;
    case 'tamagochi':
      return <TamagochiArt />;
  }
}

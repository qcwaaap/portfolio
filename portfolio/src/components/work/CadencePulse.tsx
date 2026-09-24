import { scribbleCurve, type Pt } from '@/lib/sketch';
import styles from './Work.module.css';

const WAVE = (() => {
  const pts: Pt[] = [];
  for (let i = 0; i <= 16; i++) {
    const amp = i % 4 === 2 ? 11 : i % 2 ? 3 : 6;
    pts.push([i * 6, 14 + (i % 2 ? -amp : amp)]);
  }
  return scribbleCurve(pts, 87, 0.8);
})();

/** «87 RPM» и пульс-волна под карточкой Cadence (полная интерактивность — в следующем блоке). */
export function CadencePulse() {
  return (
    <div className={styles.pulse} aria-hidden>
      <span className={styles.rpm}>87 RPM</span>
      <svg viewBox="0 0 96 28" className={styles.wave}>
        <path d={WAVE} />
      </svg>
    </div>
  );
}

import { tornTopClips } from '@/lib/sketch';
import styles from './TornEdge.module.css';

/** Рваный верхний край секции: другой лист бумаги, наложенный на предыдущий. */
export function TornEdge({ seed = 3, tone = 'var(--paper-2)' }: { seed?: number; tone?: string }) {
  const clip = tornTopClips(seed);
  return (
    <div className={styles.edge} aria-hidden>
      <div className={styles.fringe} style={{ clipPath: clip.fringe }} />
      <div className={styles.paper} style={{ clipPath: clip.paper, background: tone }} />
    </div>
  );
}

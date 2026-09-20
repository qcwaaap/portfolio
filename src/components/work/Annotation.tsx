import { n3, scribbleArrow } from '@/lib/sketch';
import styles from './Work.module.css';

type Dir = 'left' | 'right' | 'up';

/** Рукописная пометка со стрелкой. Стрелка рисуется при появлении карточки (data-annot). */
export function Annotation({ text, dir, seed }: { text: string; dir: Dir; seed: number }) {
  const a =
    dir === 'right'
      ? scribbleArrow([2, 16], [22, 3], [46, 10], seed, 8)
      : dir === 'left'
        ? scribbleArrow([46, 16], [26, 3], [4, 10], seed, 8)
        : scribbleArrow([6, 24], [22, 20], [30, 2], seed, 8);
  const arrow = (
    <svg className={styles.annotArrow} viewBox="0 0 50 28" aria-hidden data-annot="">
      <path d={a.shaft} pathLength={1} data-len={n3(1)} />
      <path d={a.head} pathLength={1} />
    </svg>
  );
  return (
    <p className={`${styles.annot} ${dir === 'left' ? styles.annotLeft : ''}`}>
      {dir === 'left' && arrow}
      <span>{text}</span>
      {dir !== 'left' && arrow}
    </p>
  );
}

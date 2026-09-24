import type { CSSProperties, ReactNode } from 'react';
import styles from './Photo.module.css';

export type PhotoTone = 'mountains' | 'flowers' | 'dogs' | 'landscape' | 'portrait' | 'cat' | 'window' | 'lake';
type Tape = 'tl' | 'tr' | 'bl' | 'br' | 'top';

type PhotoProps = {
  src?: string | null;
  alt: string;
  /** подпись на заглушке */
  label: string;
  tone: PhotoTone;
  /** соотношение сторон, например '5 / 4' */
  ratio?: string;
  frame?: 'plain' | 'polaroid';
  tapes?: readonly Tape[];
  /** текст на кастомном курсоре */
  cursor?: string | null;
  /** свой контент вместо картинки/заглушки (например, нарисованный скриншот проекта) */
  children?: ReactNode;
  /** false — без подъёма и зума при наведении (для увеличенного вида) */
  interactive?: boolean;
  /** с какой стороны подпись заглушки (чтобы не прятать её под стикерами) */
  labelSide?: 'left' | 'right';
};

/** Фотография, приклеенная скотчем. Без `src` показывает заглушку в тонах будущего снимка. */
export function Photo({ src, alt, label, tone, ratio = '5 / 4', frame = 'plain', tapes = ['tl', 'br'], cursor = 'VIEW', labelSide = 'right', children, interactive = true }: PhotoProps) {
  return (
    <figure
      className={`${styles.photo} ${frame === 'polaroid' ? styles.polaroid : ''} ${interactive ? '' : styles.static}`}
      style={{ '--ratio': ratio } as CSSProperties}
      data-cursor={cursor ?? undefined}
    >
      <div className={styles.img}>
        {children ? (
          <div className={styles.art}>{children}</div>
        ) : src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} draggable={false} decoding="async" />
        ) : (
          <div className={styles.placeholder} data-tone={tone} role="img" aria-label={alt}>
            <span className={`${styles.label} ${labelSide === 'left' ? styles.labelLeft : ''}`}>{label}</span>
          </div>
        )}
        <i className={styles.grain} aria-hidden />
      </div>
      {tapes.map((t) => (
        <span key={t} className={`${styles.tape} ${styles[t]}`} aria-hidden />
      ))}
    </figure>
  );
}

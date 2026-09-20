import type { ReactNode } from 'react';
import styles from './Item.module.css';

export type Enter = 'left' | 'right' | 'top' | 'bottom' | 'pop';

type ItemProps = {
  /** класс с позицией (left / top / width) — задаётся в CSS секции */
  className: string;
  /** «глубина»: чем больше, тем сильнее объект реагирует на мышь и скролл */
  depth?: number;
  /** наклон в градусах */
  rotate?: number;
  /** откуда влетает при появлении (если не указано — анимируется отдельно) */
  enter?: Enter;
  z?: number;
  children: ReactNode;
};

/**
 * Предмет на «столе». Три вложенных слоя, чтобы трансформации не конфликтовали:
 *   pos    — позиция + параллакс от скролла (GSAP, ось Y)
 *   mouse  — параллакс от курсора (GSAP quickTo, x/y)
 *   rot    — наклон (CSS) + анимация появления (GSAP)
 */
export function Item({ className, depth = 0.5, rotate = 0, enter, z, children }: ItemProps) {
  return (
    <div className={`${styles.pos} ${className}`} data-scroll={depth} style={z ? { zIndex: z } : undefined}>
      <div className={styles.mouse} data-depth={depth}>
        <div className={styles.rot} style={{ transform: `rotate(${rotate}deg)` }} data-enter={enter}>
          {children}
        </div>
      </div>
    </div>
  );
}

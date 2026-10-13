import type { CSSProperties } from 'react';
import { SKILLS } from '@/content/skills';
import { useT } from '@/i18n/LocaleProvider';
import styles from './About.module.css';

const ROT = [-3, 2, -1.5, 3.5, -2.5, 1.5];
const STYLES = ['paper', 'tape', 'sticker'] as const;

/** Навыки — не список, а наклеенные бумажки, ленты и стикеры. */
export function Skills() {
  const t = useT();
  return (
    <div className={styles.skillsGrid}>
      {SKILLS.map((g, gi) => (
        <section key={g.id} className={`${styles.group} ${styles[`group_${g.id}`]}`} data-skill-group="" style={{ '--tone': g.tone } as CSSProperties}>
          <h3 className={styles.hl} data-hl="">
            {t.about.skillTitles[g.id] ?? g.title}
          </h3>
          <ul className={styles.chips}>
            {g.items.map((s, i) => {
              const kind = STYLES[(i + gi) % 3]!;
              return (
                <li key={s} data-chip="">
                  <span className={`${styles.chip} ${styles[kind]}`} style={{ '--r': `${ROT[(i * 2 + gi) % ROT.length]}deg` } as CSSProperties}>
                    {s}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

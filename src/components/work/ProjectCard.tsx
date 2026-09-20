import { Photo } from '@/components/collage/Photo';
import type { Project } from '@/content/projects';
import { Annotation } from './Annotation';
import { CadencePulse } from './CadencePulse';
import { ProjectArt } from './ProjectArt';
import styles from './Work.module.css';

type Props = {
  project: Project;
  hidden: boolean;
  onOpen: (id: Project['id']) => void;
  /** порядковый номер для разных «характеров» лент и стрелок */
  seed: number;
};

/** Один проект на «столе»: фотография с лентой-названием, под ней подпись и пометка от руки. */
export function ProjectCard({ project: p, hidden, onOpen, seed }: Props) {
  const open = () => onOpen(p.id);
  return (
    <article
      className={`${styles.card} ${styles[`card_${p.id}`]}`}
      data-lift=""
      data-cursor="OPEN"
      role="button"
      tabIndex={0}
      aria-label={`Open project ${p.title}`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className={styles.parallax} data-parallax={0.4 + (seed % 3) * 0.3}>
        <div className={styles.enter} data-enter-card="">
          <div
            className={styles.visual}
            data-project-visual={p.id}
            data-tilt={p.tilt}
            data-hidden={hidden ? '' : undefined}
            style={{ transform: `rotate(${p.tilt}deg)` }}
          >
            <Photo
              alt={p.title}
              label={p.title}
              tone="mountains"
              src={p.image}
              ratio={p.ratio}
              frame={p.id === 'tamagochi' ? 'polaroid' : 'plain'}
              tapes={p.id === 'todo' ? ['top'] : ['tr', 'bl']}
              cursor={null}
            >
              {!p.image && <ProjectArt id={p.id} />}
            </Photo>
            <span className={styles.tapeLabel}>{p.title}</span>
          </div>

          <div className={styles.info}>
            {p.id === 'cadence' && <CadencePulse />}
            <h3 className={styles.name}>{p.title}</h3>
            <p className={styles.short}>{p.short}</p>
            <ul className={styles.tags}>
              {p.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <Annotation text={p.annotation.text} dir={p.annotation.dir} seed={seed * 13 + 5} />
          </div>
        </div>
      </div>
    </article>
  );
}

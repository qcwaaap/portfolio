/**
 * Проекты. Тексты в `long` — рабочие черновики: замени на свои формулировки.
 * `image: null` → рисуется «скриншот-заглушка» (components/work/ProjectArt.tsx).
 * Чтобы поставить настоящий скриншот: положи файл в public/images/ и впиши путь в `image`.
 */
export type ProjectId = 'cadence' | 'cardizel' | 'todo' | 'tamagochi';

export type Project = {
  id: ProjectId;
  index: string;
  title: string;
  /** одна-две строки под карточкой */
  short: string;
  /** описание в раскрытом виде */
  long: string;
  tags: string[];
  /** рукописная пометка со стрелкой */
  annotation: { text: string; dir: 'left' | 'right' | 'up' };
  /** соотношение сторон карточки */
  ratio: string;
  /** наклон карточки, градусы */
  tilt: number;
  image: string | null;
  links: { label: string; href: string }[];
};

export const PROJECTS: readonly Project[] = [
  {
    id: 'cadence',
    index: '01',
    title: 'CADENCE',
    short: 'A tool for selecting music based on cycling cadence.',
    long: 'A tool that picks music to match your cycling cadence: the rhythm of your pedalling sets the tempo, and the app finds tracks that fit it through the Spotify API, using algorithms to match and sequence them. Written in Go. Hardware sensors are the next step.',
    tags: ['Go', 'Spotify API', 'Algorithms', 'Cycling'],
    annotation: { text: '+ future hardware', dir: 'right' },
    ratio: '4 / 3',
    tilt: -3,
    image: null,
    links: [],
  },
  {
    id: 'cardizel',
    index: '02',
    title: 'CARDIZEL',
    short: 'Commercial website for a furniture brand. Full frontend + backend.',
    long: 'A commercial website for a furniture brand: a React frontend with its own backend and REST API. The backend was adapted to PHP because of hosting constraints.',
    tags: ['React', 'Node.js', 'PHP', 'REST API'],
    annotation: { text: 'client project', dir: 'left' },
    ratio: '4 / 3',
    tilt: 2,
    image: null,
    links: [],
  },
  {
    id: 'todo',
    index: '03',
    title: 'TODO',
    short: 'Production practice app with clean architecture and async.',
    long: 'A practice app for working with clean architecture and async Python: FastAPI routes call services, services work through a UnitOfWork on top of SQLAlchemy, and dependencies are wired with dependency injection.',
    tags: ['Python', 'FastAPI', 'SQLAlchemy', 'Dependency Injection', 'UnitOfWork'],
    annotation: { text: 'architecture', dir: 'right' },
    ratio: '1 / 1',
    tilt: -1.5,
    image: null,
    links: [],
  },
  {
    id: 'tamagochi',
    index: '04',
    title: 'TAMAGOCHI',
    short: '3D pet project with Three.js and React.',
    long: 'A 3D pet project: a little tamagochi creature living in a Three.js scene, rendered through React.',
    tags: ['React', 'Three.js', 'JavaScript', '3D'],
    annotation: { text: '3D / interactive', dir: 'right' },
    ratio: '1 / 1',
    tilt: 3,
    image: null,
    links: [],
  },
];

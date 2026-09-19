import { n3, scribbleStar } from '@/lib/sketch';

type StarProps = {
  className?: string;
  color?: string;
  seed?: number;
  /** когда (в долях прогресса) звезда проявляется */
  at?: number;
  dur?: number;
};

/** Звезда-каракуля, как в референсе. Проявляется по прогрессу загрузки. */
export function StarDoodle({ className, color = 'var(--ink)', seed = 1, at = 0.04, dur = 0.05 }: StarProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden
      data-fade=""
      data-at={n3(at)}
      data-dur={n3(dur)}
      style={{ overflow: 'visible' }}
    >
      <path
        d={scribbleStar(24, 25, 18, seed)}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

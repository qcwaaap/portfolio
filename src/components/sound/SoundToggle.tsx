'use client';

import { useEffect, useState } from 'react';
import { sound } from '@/lib/sound/engine';
import styles from './SoundToggle.module.css';

/**
 * Единственная точка входа в звук: пока человек не нажал сюда, AudioContext не создаётся
 * и ничего не звучит — этого требует и спецификация, и сами браузеры (autoplay policy).
 */
export function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => sound.onChange(setOn), []);

  return (
    <button
      type="button"
      className={`${styles.btn} ${on ? styles.on : ''}`}
      onClick={() => (on ? sound.disable() : sound.enable())}
      aria-pressed={on}
      aria-label={on ? 'Turn ambient sound off' : 'Turn ambient sound on'}
    >
      <span className={styles.note} aria-hidden>
        ♫
      </span>
      {on ? 'ON' : 'OFF'}
    </button>
  );
}

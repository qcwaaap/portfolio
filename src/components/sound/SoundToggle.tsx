'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/i18n/LocaleProvider';
import { sound } from '@/lib/sound/engine';
import styles from './SoundToggle.module.css';

/**
 * Единственная точка входа в звук: пока человек не нажал сюда, AudioContext не создаётся
 * и ничего не звучит — этого требует и спецификация, и сами браузеры (autoplay policy).
 */
export function SoundToggle() {
  const t = useT();
  const [on, setOn] = useState(false);

  useEffect(() => sound.onChange(setOn), []);

  return (
    <button
      type="button"
      className={`${styles.btn} ${on ? styles.on : ''}`}
      onClick={() => (on ? sound.disable() : sound.enable())}
      aria-pressed={on}
      aria-label={on ? t.controls.soundOff : t.controls.soundOn}
    >
      <span className={styles.note} aria-hidden>
        ♫
      </span>
      {on ? t.controls.on : t.controls.off}
    </button>
  );
}

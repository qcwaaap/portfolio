'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Photo } from '@/components/collage/Photo';
import { TornEdge } from '@/components/collage/TornEdge';
import { usePhoto } from '@/i18n/hooks';
import { useT } from '@/i18n/LocaleProvider';
import styles from './Booth.module.css';

// камера, MediaPipe и вся логика будки грузятся только когда человек вошёл внутрь
const loadModal = () => import('./BoothModal').then((m) => m.BoothModal);
const BoothModal = dynamic(loadModal, { ssr: false });

/** Тизер на странице: полоска кадров и кнопка «зайти в будку». */
export function Booth() {
  const t = useT();
  const photo = usePhoto();
  const [open, setOpen] = useState(false);

  return (
    <section id="booth" className={styles.booth} aria-label={t.booth.aria}>
      <TornEdge seed={12} tone="var(--paper)" />

      <div className={styles.strip} aria-hidden>
        {(['cat', 'flowers', 'lake', 'landscape'] as const).map((k) => (
          <div key={k} className={styles.cell}>
            <Photo {...photo(k)} tone={k} ratio="4 / 3" interactive={false} tapes={[]} cursor={null} />
          </div>
        ))}
        <span className={styles.stripTape} />
      </div>

      <div className={styles.copy}>
        <p className={styles.kicker}>{t.booth.kicker}</p>
        <h2 className={styles.heading}>
          <span>{t.booth.title[0]}</span>
          <span>{t.booth.title[1]}</span>
        </h2>
        <p className={styles.blurb}>{t.booth.blurb}</p>
        <button type="button" className={styles.enter} data-cursor="OPEN" onPointerEnter={() => void loadModal()} onFocus={() => void loadModal()} onClick={() => setOpen(true)}>
          {t.booth.enter}
        </button>
      </div>

      {open && <BoothModal onClose={() => setOpen(false)} />}
    </section>
  );
}

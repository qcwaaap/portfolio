'use client';

import { useState } from 'react';
import { PRELOAD } from '@/content/photos';
import { Cursor } from './cursor/Cursor';
import { RoamingDog } from './dog/RoamingDog';
import { SoundToggle } from './sound/SoundToggle';
import { useUiSounds } from './sound/useUiSounds';
import { About } from './about/About';
import { Contact } from './contact/Contact';
import { Hero } from './hero/Hero';
import { Work } from './work/Work';
import { Loader } from './loader/Loader';
import { SmoothScroll } from './smooth/SmoothScroll';

/**
 * Корень интерактивной части: связывает лоадер → hero.
 *   revealed — лоадер начал уходить: hero играет входную анимацию
 *   ready    — лоадер ушёл: включаем плавный скролл
 */
export function Experience() {
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);
  useUiSounds();

  return (
    <>
      <Loader assets={PRELOAD} onExitStart={() => setRevealed(true)} onComplete={() => setReady(true)} />
      <SmoothScroll enabled={ready} />
      <Cursor />
      <RoamingDog enabled={ready} />
      <SoundToggle />
      <main>
        <Hero revealed={revealed} />
        <Work />
        <About />
        <Contact />
      </main>
    </>
  );
}

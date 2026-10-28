'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { PRELOAD } from '@/content/photos';
import { Cursor } from './cursor/Cursor';
import { LanguageSwitch } from './i18n/LanguageSwitch';
import { ThemeToggle } from './theme/ThemeToggle';
import { SoundToggle } from './sound/SoundToggle';
import { useUiSounds } from './sound/useUiSounds';
import { About } from './about/About';
import { Booth } from './booth/Booth';
import { Contact } from './contact/Contact';
import { Hero } from './hero/Hero';
import { Work } from './work/Work';
import { Loader } from './loader/Loader';
import { SmoothScroll } from './smooth/SmoothScroll';

// собака нужна не сразу (первый выход через ~10 с) — не тянем её в первый бандл
const RoamingDog = dynamic(() => import('./dog/RoamingDog').then((m) => m.RoamingDog), { ssr: false });

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
      <ThemeToggle />
      <LanguageSwitch />
      <SoundToggle />
      <main>
        <Hero revealed={revealed} />
        <Work />
        <About />
        <Booth />
        <Contact />
      </main>
    </>
  );
}

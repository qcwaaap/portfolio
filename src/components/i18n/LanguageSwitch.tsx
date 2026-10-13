'use client';

import { LOCALES, LOCALE_LABELS } from '@/i18n/config';
import { useLocale } from '@/i18n/LocaleProvider';
import styles from './LanguageSwitch.module.css';

export function LanguageSwitch() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div className={styles.group} role="group" aria-label={t.controls.language}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={`${styles.btn} ${l === locale ? styles.active : ''}`}
          onClick={() => setLocale(l)}
          aria-pressed={l === locale}
          lang={LOCALE_LABELS[l].htmlLang}
          aria-label={LOCALE_LABELS[l].name}
          title={LOCALE_LABELS[l].name}
        >
          {LOCALE_LABELS[l].short}
        </button>
      ))}
    </div>
  );
}

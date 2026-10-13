'use client';

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

const KEY = 'theme';

/** Текущая тема: ручной выбор (data-theme выставляет inline-скрипт в layout) или системная. */
function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle() {
  // null до гидрации: иконка не мигает не той темой
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(current());
    // пока человек не выбрал сам — следуем за системной темой
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!document.documentElement.dataset.theme) setTheme(current());
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next: Theme = (theme ?? current()) === 'dark' ? 'light' : 'dark';
    const html = document.documentElement;
    html.classList.add('theme-fade');
    html.dataset.theme = next;
    window.setTimeout(() => html.classList.remove('theme-fade'), 400);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    setTheme(next);
  };

  const dark = theme === 'dark';

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
     
    >
      <span className={styles.icon} aria-hidden>
        {dark ? '☾' : '☀'}
      </span>
    </button>
  );
}

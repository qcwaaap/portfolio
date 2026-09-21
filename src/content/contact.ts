/**
 * Контакты. `href: null` — ссылка ещё не добавлена: в dev-режиме такая строка видна
 * пунктиром (чтобы не забыть), в production не показывается.
 * Впиши свои ссылки: 'https://t.me/username', 'mailto:you@example.com', 'https://linkedin.com/in/...'.
 */
export type Contact = { id: string; label: string; href: string | null };

export const CONTACTS: readonly Contact[] = [
  { id: 'github', label: 'github', href: 'https://github.com/qcwaaap' },
  { id: 'telegram', label: 'telegram', href: null },
  { id: 'email', label: 'email', href: null },
  { id: 'linkedin', label: 'linkedin', href: null },
];

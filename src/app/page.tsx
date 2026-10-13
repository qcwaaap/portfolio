import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/i18n/config';

/** Запасной вариант: обычно `/` перенаправляет proxy.ts с учётом языка браузера. */
export default function Root() {
  redirect(`/${DEFAULT_LOCALE}`);
}

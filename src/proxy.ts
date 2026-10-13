import { NextResponse, type NextRequest } from 'next/server';
import { LOCALE_COOKIE, isLocale, negotiateLocale } from '@/i18n/config';

/** `/` → `/en` или `/zh`: сначала сохранённый выбор, потом язык браузера. */
export function proxy(req: NextRequest) {
  const saved = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : negotiateLocale(req.headers.get('accept-language'));
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/'] };

/** Адрес сайта для canonical, sitemap и OG. В production задай NEXT_PUBLIC_SITE_URL (например https://maria.dev). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

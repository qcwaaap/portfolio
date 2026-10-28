import { notFound } from 'next/navigation';
import { Experience } from '@/components/Experience';
import { isLocale } from '@/i18n/config';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Experience />;
}

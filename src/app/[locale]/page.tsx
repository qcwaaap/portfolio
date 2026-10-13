import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Experience } from '@/components/Experience';
import { LOCALE_LABELS, isLocale } from '@/i18n/config';
import { DICTIONARIES } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = DICTIONARIES[locale].meta;
  return { title, description, openGraph: { title, description, locale: LOCALE_LABELS[locale].htmlLang.replace('-Hans', '_CN') } };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Experience />;
}

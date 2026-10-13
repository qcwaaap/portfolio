import type { Locale } from '../config';
import { en, type Dictionary } from './en';
import { zh } from './zh';

export type { Dictionary };
export const DICTIONARIES: Record<Locale, Dictionary> = { en, zh };

import type { Locale } from 'date-fns';
interface GetCreatedAtProps {
    createdAt: number;
    locale?: Locale;
    stringSet?: Record<string, string>;
}
export default function ({ createdAt, locale, stringSet, }: GetCreatedAtProps): string;
export {};

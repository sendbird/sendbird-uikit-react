import type { Locale } from 'date-fns';
import format from 'date-fns/format';
import formatRelative from 'date-fns/formatRelative';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';

// getCreatedAt
export default function (createdAt: number, locale: Locale): string {
  const thirdParam = locale ? { locale } : null;
  if (!createdAt) {
    return '';
  }
  if (isToday(createdAt)) {
    return format(createdAt, 'p', thirdParam);
  }
  if (isYesterday(createdAt)) {
    return formatRelative(createdAt, new Date(), thirdParam);
  }
  return format(createdAt, 'MMM dd', thirdParam);
}

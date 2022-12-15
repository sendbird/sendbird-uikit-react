import type { Locale } from 'date-fns';
import format from 'date-fns/format';
import formatRelative from 'date-fns/formatRelative';
import isToday from 'date-fns/isToday';
import isThisYear from 'date-fns/isThisYear';
import isYesterday from 'date-fns/isYesterday';

// getCreatedAt
export default function (createdAt: number, locale: Locale): string {
  const optionalParam = locale ? { locale } : null;
  if (!createdAt) {
    return '';
  }
  if (isToday(createdAt)) {
    return format(createdAt, 'p', optionalParam);
  }
  if (isYesterday(createdAt)) {
    return formatRelative(createdAt, new Date(), optionalParam);
  }
  if (isThisYear(createdAt)) {
    return format(createdAt, 'MMM dd', optionalParam);
  }
  return format(createdAt, 'yyyy/MM/dd', optionalParam);
}

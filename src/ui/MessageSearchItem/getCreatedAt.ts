import type { Locale } from 'date-fns';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isThisYear from 'date-fns/isThisYear';
import isYesterday from 'date-fns/isYesterday';

interface GetCreatedAtProps {
  createdAt: number;
  locale?: Locale;
  stringSet?: Record<string, string>;
}

// getCreatedAt
export default function ({
  createdAt,
  locale,
  stringSet,
}: GetCreatedAtProps): string {
  const optionalParam = locale ? { locale } : null;
  if (!createdAt) {
    return '';
  }
  if (isToday(createdAt)) {
    return format(createdAt, 'p', optionalParam);
  }
  if (isYesterday(createdAt)) {
    return stringSet?.MESSAGE_STATUS__YESTERDAY || 'Yesterday';
  }
  if (isThisYear(createdAt)) {
    return format(createdAt, 'MMM d', optionalParam);
  }
  return format(createdAt, 'yyyy/M/d', optionalParam);
}

import type { Locale } from 'date-fns';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isThisYear from 'date-fns/isThisYear';
import isYesterday from 'date-fns/isYesterday';

interface GetCreatedAtProps {
  createdAt: number;
  locale?: Locale;
  stringSet: Record<string, string>;
}

// getCreatedAt
export default function ({
  createdAt,
  locale,
  stringSet,
}: GetCreatedAtProps): string {
  const optionalParam = { locale };
  if (!createdAt) {
    return '';
  }
  if (isToday(createdAt)) {
    return format(createdAt, stringSet.DATE_FORMAT__LAST_MESSAGE_CREATED_AT__TODAY, optionalParam);
  }
  if (isYesterday(createdAt)) {
    return stringSet.MESSAGE_STATUS__YESTERDAY;
  }
  if (isThisYear(createdAt)) {
    return format(createdAt, stringSet.DATE_FORMAT__LAST_MESSAGE_CREATED_AT__THIS_YEAR, optionalParam);
  }
  return format(createdAt, stringSet.DATE_FORMAT__LAST_MESSAGE_CREATED_AT__PREVIOUS_YEAR, optionalParam);
}

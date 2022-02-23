import format from 'date-fns/format';
import formatRelative from 'date-fns/formatRelative';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';

// getCreatedAt
export default (createdAt: number, locale: Locale): string => {
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
  return format(createdAt, 'MMM dd', optionalParam);
};

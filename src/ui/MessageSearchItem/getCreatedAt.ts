import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';

// getCreatedAt
export default (createdAt: number): string => {
  if (!createdAt) {
    return '';
  }
  if (isToday(createdAt)) {
    return format(createdAt, 'p');
  }
  if (isYesterday(createdAt)) {
    return 'Yesterday';
  }
  return format(createdAt, 'MMM dd');
};

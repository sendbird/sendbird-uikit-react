const isEmpty = <T>(val: T | undefined | null): val is undefined | null => (val === null || val === undefined);

// Some Ids return string and number inconsistently
// only use to compare IDs
export default function compareIds(a?: number | string, b?: number | string) {
  if (isEmpty(a) || isEmpty(b)) {
    return false;
  }
  const aString = a.toString();
  const bString = b.toString();
  return aString === bString;
}

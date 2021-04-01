const isEmpty = (val) => (val === null || val === undefined);

// Some Ids return string and number inconsistently
// only use to comapre IDs
export default function (a, b) {
  if (isEmpty(a) || isEmpty(b)) {
    return false;
  }
  const aString = a.toString();
  const bString = b.toString();
  return aString === bString;
}

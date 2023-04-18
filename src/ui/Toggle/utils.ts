export function filterNumber(str: string = ''): Array<number> {
  if (typeof str === 'number') {
    return [str];
  } else if (typeof str !== 'string') {
    return [];
  }
  const regex = /(-?\d+)(\.\d+)?/g;
  const numbers = str.match(regex) || [];
  return numbers.map(parseFloat);
}

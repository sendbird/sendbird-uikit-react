export function filterNumber(str: string): Array<number> {
  const regex = /(-?\d+)(\.\d+)?/g;
  const numbers = str.match(regex) || [];
  return numbers.map(parseFloat);
}

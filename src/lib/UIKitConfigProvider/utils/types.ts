// @link https://gist.github.com/navix/6c25c15e0a2d3cd0e5bce999e0086fc9
/* eslint-disable @typescript-eslint/ban-types */
export type DeepPartial<T> = T extends Function
  ? T
  : (T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T);

export function isSameType<T, U>(a: T, b: U): boolean {
  // we do this cause typeof can't differenciate object/ array/ null
  return Object.prototype.toString.call(a) === Object.prototype.toString.call(b);
}

// @link https://gist.github.com/navix/6c25c15e0a2d3cd0e5bce999e0086fc9
/* eslint-disable @typescript-eslint/ban-types */
export type DeepPartial<T> = T extends Function
  ? T
  : (T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T);

/**
 * To make any type of value case insensitive
 * e.g. 'THREAD' || 'thread' <- both should be valid type
 */
export type CaseInsensitive<T extends string> = T extends keyof any ? Uppercase<T> : T;
type Uppercase<T extends string> = T extends string ? UppercaseValue<T> : never;
type UppercaseValue<T extends string> = T extends `${infer U}` ? Uppercase<U> : T;

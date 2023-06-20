export type PartialDeep<T> = T extends object
  ? T extends (...args: any[]) => any
    ? T
    : {
        [P in keyof T]?: PartialDeep<T[P]>;
      }
  : T;

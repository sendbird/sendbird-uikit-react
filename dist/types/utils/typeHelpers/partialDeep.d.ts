/**
 * PartialDeep enables partial deep cloning of objects or nested objects.
 * It recursively makes the properties of the given type optional,
 * allowing partial modification at any level of nesting.
 *
 * Use case:
 * When working with complex data structures, selectively modify properties of an object
 * while maintaining the original structure and values.
 *
 * Brought the simplified idea from https://github.com/sindresorhus/type-fest/blob/main/source/partial-deep.d.ts
 * */
export type PartialDeep<T> = T extends object ? T extends Set<unknown> ? T : T extends (...args: any[]) => any ? T : {
    [P in keyof T]?: PartialDeep<T[P]>;
} : T;

type CamelCase<T> = T extends object
  ? {
      [K in keyof T as Uncapitalize<CamelCaseKey<K & string>>]: CamelCase<T[K]>;
    }
  : T;

type CamelCaseKey<K extends string> = K extends `${infer A}_${infer B}`
  ? `${Lowercase<A>}${Capitalize<CamelCaseKey<B & string>>}`
  : K;

export function snakeToCamel<T>(obj: T): CamelCase<T> {
  if (typeof obj !== 'object' || obj === null) {
    return obj as CamelCase<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => snakeToCamel(item)) as CamelCase<T>;
  }

  const result = {} as CamelCase<T>;
  Object.keys(obj).forEach((key) => {
    const camelKey = key.replace(/_\w/g, (m) => m[1].toUpperCase());
    result[camelKey] = snakeToCamel(obj[key]);
  });

  return result;
}

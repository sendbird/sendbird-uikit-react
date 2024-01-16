export function omitObjectProperties<O extends Record<string, any>>(obj: O, properties: string[]) {
  properties.forEach((propertyName) => {
    if (Object.hasOwn(obj, propertyName)) delete obj[propertyName];
  });
  return obj;
}

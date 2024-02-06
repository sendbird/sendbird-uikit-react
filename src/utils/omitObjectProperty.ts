export function omitObjectProperties<O extends Record<string, any>>(obj: O, properties: string[]): O {
  const newObj = { ...obj };
  properties.forEach((propertyName) => {
    if (Object.hasOwn(newObj, propertyName)) delete newObj[propertyName];
  });
  return newObj;
}

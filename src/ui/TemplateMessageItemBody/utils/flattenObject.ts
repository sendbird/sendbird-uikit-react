const flattenObjectHelper = (
  currentObject: Record<string, any>,
  flattenObject: Record<string, any>,
  parentKeyPath = '',
): void => {
  for (const [key, value] of Object.entries(currentObject)) {
    const currentKeyPath = parentKeyPath ? `${parentKeyPath}.${key}` : key;
    if (value && typeof value === 'object') {
      flattenObjectHelper(value, flattenObject, currentKeyPath);
    } else {
      flattenObject[currentKeyPath] = value;
    }
  }
};

/**
 * Returns flattened object.
 * ex.
 * given { key-1: { key-1.1: 'value-1.1' }, key-2: 'value-2' }
 * returns { key-1.key-1.1: 'value-1.1', key-2: 'value-2' }
 */
export default function flattenObject(object: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  flattenObjectHelper(object, result);
  return result;
}

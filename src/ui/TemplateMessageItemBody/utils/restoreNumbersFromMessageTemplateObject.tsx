const NumberValueKeys = [
  'version',
  'size',
  'top',
  'left',
  'right',
  'bottom',
  'maxTextLines',
  'value',
  'pixelWidth',
  'pixelHeight',
  'radius',
];

export default function restoreNumbersFromMessageTemplateObject(value: unknown, key?: string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => restoreNumbersFromMessageTemplateObject(item));
  }
  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = restoreNumbersFromMessageTemplateObject(value[key], key);
      return acc;
    }, {});
  }
  if (key != null && NumberValueKeys.includes(key)) {
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? value : numberValue;
  }
  return value;
}

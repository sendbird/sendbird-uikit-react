import flattenObject from './flattenObject';
import { convertArgbToRgba } from './selectColorVariablesByTheme';

const COLOR_KEYS = [
  'color',
  'tintColor',
  'backgroundColor',
  'borderColor',
];

type SourceData = Record<string, unknown>;
type MappedData = Record<string, unknown> | Array<unknown>;

interface MappingParams<T> {
  template: T;
  source: SourceData;
}

export default function mapData<T extends Record<string, unknown> | Array<unknown> | string>({
  template,
  source,
}: MappingParams<T>): T {
  if (!['object', 'string'].includes(typeof template) || !template) return template;

  const regex = /\{([^}]+)\}/g;
  const flattenedSource = flattenObject(source);

  function replaceVariablePlaceholder(value: unknown) {
    return typeof value === 'string'
      ? value.replace(regex, (_, placeholder) => {
        const value = flattenedSource[placeholder];
        return value || `{${placeholder}}`;
      })
      : mapData({ template: value as any, source });
  }

  if (typeof template === 'string') {
    return replaceVariablePlaceholder(template) as T;
  }

  if (Array.isArray(template)) {
    return template.map(replaceVariablePlaceholder) as T;
  }

  const result: MappedData = {};
  for (const key in template) {
    if (Object.prototype.hasOwnProperty.call(template, key)) {
      const value = template[key];
      let replacedVal = replaceVariablePlaceholder(value);
      if (typeof replacedVal === 'string' && COLOR_KEYS.includes(key)) {
        replacedVal = convertArgbToRgba(replacedVal);
      }
      result[key] = replacedVal;
    }
  }

  return result as T;
}

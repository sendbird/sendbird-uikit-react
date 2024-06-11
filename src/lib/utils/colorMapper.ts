export type ColorSet = Record<string, string>;

/**
 * Mapping object to convert numeric keys to descriptive text
 * [(legacy) numeric key]: [(new) descriptive text]
 */
const colorMapping: Record<string, string> = {
  // Primary / Secondary / Error / Information
  100: 'extra-light',
  200: 'light',
  300: 'main',
  400: 'dark',
  500: 'extra-dark',
  // Overlay
  'overlay-01': 'overlay-dark',
  'overlay-02': 'overlay-light',
  // OnLight
  'onlight-01': 'onlight-text-high-emphasis',
  'onlight-02': 'onlight-text-mid-emphasis',
  'onlight-03': 'onlight-text-low-emphasis',
  'onlight-04': 'onlight-text-disabled',
  // OnDark
  'ondark-01': 'ondark-text-high-emphasis',
  'ondark-02': 'ondark-text-mid-emphasis',
  'ondark-03': 'ondark-text-low-emphasis',
  'ondark-04': 'ondark-text-disabled',
};

/**
 * Order of mappings to ensure longer keys are matched first
 * e.g. In --sendbird-dark-background-extra-dark, 'extra-dark' should be matched instead of 'dark'
 */
const colorMappingOrder = Object
  .values(colorMapping)
  .sort((a, b) => b.length - a.length);

/**
 * Convert colorMapping to a Map for quick lookup in mapColorKeys
 */
const colorMappingMap = new Map<string, string>(
  Object.entries(colorMapping).map(([key, value]) => [value, key]),
);

export const mapColorKeys = (colorSet: ColorSet): ColorSet => {
  const mappedColors: ColorSet = {};

  Object.entries(colorSet).forEach(([key, value]) => {
    let descriptiveKey = key;

    for (const mappingValue of colorMappingOrder) {
      // Prepare a regex to match the mapping value at the end of the key
      // e.g., '-extra-dark$'
      const regex = new RegExp(`-${mappingValue}$`);
      if (regex.test(key)) {
        // Find the corresponding numeric key for the mapping value using Map
        const numericKey = colorMappingMap.get(mappingValue);
        if (numericKey) {
          // Replace the descriptive text with the numeric key
          descriptiveKey = key.replace(regex, `-${numericKey}`);
          break;
        }
      }
    }
    mappedColors[descriptiveKey] = value;
  });

  return mappedColors;
};

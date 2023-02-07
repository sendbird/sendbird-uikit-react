export const Colors = {
  DEFAULT: 'DEFAULT',
  PRIMARY: 'PRIMARY',
  PRIMARY_2: 'PRIMARY_2',
  SECONDARY: 'SECONDARY',
  CONTENT: 'CONTENT',
  CONTENT_INVERSE: 'CONTENT_INVERSE',
  WHITE: 'WHITE',
  GRAY: 'GRAY',
  SENT: 'SENT',
  READ: 'READ',
  ON_BACKGROUND_1: 'ON_BACKGROUND_1',
  ON_BACKGROUND_2: 'ON_BACKGROUND_2',
  ON_BACKGROUND_3: 'ON_BACKGROUND_3',
  BACKGROUND_3: 'BACKGROUND_3',
  ERROR: 'ERROR',
} as const;
export type Colors = typeof Colors[keyof typeof Colors];

export default { Colors };

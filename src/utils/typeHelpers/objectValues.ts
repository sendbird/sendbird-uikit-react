// https://www.youtube.com/watch?v=jjMbPt_H3RQ&t=325s

/**
 * Converts an object to an enum
 * @param obj
 * @returns {ObjectValues<typeof obj>}
 *
 * const LOG_LEVEL = {
 *  INFO: 'INFO',
 *  WARN: 'WARN',
 *  ERROR: 'ERROR',
 * } as const;
 * type logLevel = ObjectValues<typeof LOG_LEVEL>;
 * both of the below options are valid
 * const logLevel: logLevel = LOG_LEVEL.INFO;
 * const logLevel: logLevel = 'INFO';
**/
export type ObjectValues<T> = T[keyof T];

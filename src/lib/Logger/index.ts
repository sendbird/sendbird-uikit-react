// Logger, pretty much explains it
// in SendbirdProvider

import { ObjectValues } from '../../utils/typeHelpers/objectValues';
import { noop } from '../../utils/utils';

// const [logger, setLogger] = useState(LoggerFactory(logLevel));
export const LOG_LEVELS = {
  DEBUG: 'debug',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
  ALL: 'all',
} as const;
export type LogLevel = ObjectValues<typeof LOG_LEVELS>;

const colorLog = (level: LogLevel): string => {
  switch (level) {
    case LOG_LEVELS.WARNING:
      return ('color: Orange');
    case LOG_LEVELS.ERROR:
      return ('color: Red');
    default:
      return ('color: Gray');
  }
};

interface PrintLogProps {
  level: LogLevel;
  title?: string;
  description?: string;
  payload?: unknown[];
}
export const printLog = ({
  level,
  title,
  description = '',
  payload = [],
}: PrintLogProps): void => {
  // eslint-disable-next-line no-console
  console.log(
    `%c SendbirdUIKit | ${level} | ${new Date().toISOString()} | ${title} ${description && '|'}`, colorLog(level), description, ...payload,
  );
};

export interface LoggerInterface {
  info(title?: string, ...payload: unknown[]): void;
  error(title?: string, ...payload: unknown[]): void;
  warning(title?: string, ...payload: unknown[]): void;
}

export const getDefaultLogger = (): LoggerInterface => ({
  info: noop,
  error: noop,
  warning: noop,
});

export const LoggerFactory = (
  lvl: LogLevel,
  customInterface?: () => void,
): LoggerInterface => {
  const logInterface = customInterface || printLog;
  const lvlArray: Array<LogLevel> = Array.isArray(lvl) ? lvl : [lvl];

  const applyLog = (lgLvl: LogLevel) => (title?: string, description?: string, ...payload: unknown[]) => logInterface({
    level: lgLvl,
    title,
    description,
    payload,
  });

  return lvlArray.reduce((accumulator, currentLvl) => {
    if (currentLvl === LOG_LEVELS.DEBUG || currentLvl === LOG_LEVELS.ALL) {
      return ({
        ...accumulator,
        info: applyLog(LOG_LEVELS.INFO),
        error: applyLog(LOG_LEVELS.ERROR),
        warning: applyLog(LOG_LEVELS.WARNING),
      });
    }

    if (currentLvl === LOG_LEVELS.INFO) {
      return ({
        ...accumulator,
        info: applyLog(LOG_LEVELS.INFO),
      });
    }

    if (currentLvl === LOG_LEVELS.ERROR) {
      return ({
        ...accumulator,
        error: applyLog(LOG_LEVELS.ERROR),
      });
    }

    if (currentLvl === LOG_LEVELS.WARNING) {
      return ({
        ...accumulator,
        warning: applyLog(LOG_LEVELS.WARNING),
      });
    }

    return { ...accumulator };
  }, getDefaultLogger());
};

// TODO: Make this to hook, useLogger

// Logger, pretty much explains it
// in SendbirdProvider

import { ObjectValues } from '../../utils/typeHelpers/objectValues';

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
  title: string;
  description?: string;
}
export const printLog = ({
  level,
  title,
  description = '',
}: PrintLogProps): void => {
  // eslint-disable-next-line no-console
  console.log(
    `%c SendbirdUIKit | ${level} | ${new Date().toISOString()} | ${title} ${description && '|'}`, colorLog(level),
    description,
  );
};

type LoggerLogType = (title?: string, description?: string) => void;
interface LoggerInterface {
  info: LoggerLogType;
  error: LoggerLogType;
  warning: LoggerLogType;
}

const noop = () => { /* noop */ };
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

  const applyLog = (lgLvl: LogLevel) => (title?: string, description?: string) => logInterface({
    level: lgLvl,
    title,
    description,
  });

  const logger = lvlArray.reduce((accumulator, currentLvl) => {
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
  return logger;
};

// TODO: Make this to hook, useLogger

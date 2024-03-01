import { ObjectValues } from '../../utils/typeHelpers/objectValues';
export declare const LOG_LEVELS: {
    readonly DEBUG: "debug";
    readonly WARNING: "warning";
    readonly ERROR: "error";
    readonly INFO: "info";
    readonly ALL: "all";
};
export type LogLevel = ObjectValues<typeof LOG_LEVELS>;
interface PrintLogProps {
    level: LogLevel;
    title: string;
    description?: string;
    payload?: unknown[];
}
export declare const printLog: ({ level, title, description, payload, }: PrintLogProps) => void;
export interface LoggerInterface {
    info(title?: string, ...payload: unknown[]): void;
    error(title?: string, ...payload: unknown[]): void;
    warning(title?: string, ...payload: unknown[]): void;
}
export declare const getDefaultLogger: () => LoggerInterface;
export declare const LoggerFactory: (lvl: LogLevel, customInterface?: () => void) => LoggerInterface;
export {};

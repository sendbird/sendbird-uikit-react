import { Dispatch } from 'react';
import { LoggerInterface } from './Logger';
export type CustomUseReducerDispatcher = Dispatch<{
    type: string;
    payload: any;
}>;
export type Logger = LoggerInterface;

import { Dispatch } from 'react';

export type CustomUseReducerDispatcher = Dispatch<{
  type: string;
  payload: any;
}>;

export type Logger = {
  info(message: string, payload?: Record<string, unknown>): void;
  error(message: string, payload?: Record<string, unknown>): void;
  warning(message: string, payload?: Record<string, unknown>): void;
};

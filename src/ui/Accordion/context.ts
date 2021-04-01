import React from 'react';

import { noop } from '../../utils/utils';

interface ContextValue {
  setOpened(accordion: string): void;
  opened: string;
}

const Context = React.createContext<ContextValue>({
  opened: '', // mock default value
  setOpened: noop,
});

export const Consumer = Context.Consumer;
export const Provider = Context.Provider;

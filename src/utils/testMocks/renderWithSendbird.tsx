import React, { ReactElement, ReactNode } from 'react';
import { render, renderHook } from '@testing-library/react';
import SendbirdProvider, { SendbirdProviderProps } from '../../lib/Sendbird';

const DEFAULT_PROPS = {
  appId: 'test-app-id',
  userId: 'test-user-id',
};

type Overrides = Partial<SendbirdProviderProps>;

function makeWrapper(overrides: Overrides) {
  return function SendbirdWrapper({ children }: { children?: ReactNode }) {
    const props = { ...DEFAULT_PROPS, ...overrides } as SendbirdProviderProps;
    return <SendbirdProvider {...props}>{children}</SendbirdProvider>;
  };
}

export function renderWithSendbird(ui: ReactElement, overrides: Overrides = {}) {
  return render(ui, { wrapper: makeWrapper(overrides) });
}

export function renderHookWithSendbird<T>(callback: () => T, overrides: Overrides = {}) {
  return renderHook(callback, { wrapper: makeWrapper(overrides) });
}

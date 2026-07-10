import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import SendbirdProvider from '../index';
import { useLocalization } from '../../LocalizationContext';
import getStringSet from '../../../ui/Label/stringSet';

vi.mock('@sendbird/chat', async () => (
  await import('../../../utils/testMocks/sendbirdChat')
).createSendbirdChatMock());

const en = getStringSet('en') as unknown as Record<string, string>;
const nonEmptyKeys = Object.keys(en).filter((k) => typeof en[k] === 'string' && en[k].length > 0);
const OVERRIDE_KEY = nonEmptyKeys[0];
const DEFAULT_KEY = nonEmptyKeys[1];

const LocalizationProbe = () => {
  const { stringSet } = useLocalization();
  return (
    <>
      <div data-testid="override">{(stringSet as unknown as Record<string, string>)[OVERRIDE_KEY]}</div>
      <div data-testid="default">{(stringSet as unknown as Record<string, string>)[DEFAULT_KEY]}</div>
    </>
  );
};

describe('SendbirdProvider — theme & stringSet propagation (integration)', () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.error = vi.fn((...args) => {
      if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
      originalConsoleError(...args);
    });
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('applies the theme class to <body> and toggles it when the theme prop changes', async () => {
    let view!: ReturnType<typeof render>;
    await act(async () => {
      view = render(
        <SendbirdProvider appId="test-app-id" userId="test-user-id" theme="dark">
          <div />
        </SendbirdProvider>,
      );
    });

    expect(document.body.classList.contains('sendbird-theme--dark')).toBe(true);
    expect(document.body.classList.contains('sendbird-theme--light')).toBe(false);

    await act(async () => {
      view.rerender(
        <SendbirdProvider appId="test-app-id" userId="test-user-id" theme="light">
          <div />
        </SendbirdProvider>,
      );
    });

    expect(document.body.classList.contains('sendbird-theme--light')).toBe(true);
    expect(document.body.classList.contains('sendbird-theme--dark')).toBe(false);
  });

  it('merges a custom stringSet over the English defaults (does not replace)', async () => {
    const customValue = 'CUSTOM_STRING_VALUE';
    await act(async () => {
      render(
        <SendbirdProvider
          appId="test-app-id"
          userId="test-user-id"
          stringSet={{ [OVERRIDE_KEY]: customValue } as any}
        >
          <LocalizationProbe />
        </SendbirdProvider>,
      );
    });

    // overridden key uses the customer's value
    expect(screen.getByTestId('override')).toHaveTextContent(customValue);
    // an un-overridden key still resolves to the English default (proves merge, not replace)
    expect(screen.getByTestId('default')).toHaveTextContent(en[DEFAULT_KEY]);
  });

  it('propagates a custom dateLocale to the localization context', async () => {
    const customDateLocale = { code: 'xx-custom' } as any;
    let received: unknown;
    const DateLocaleProbe = () => {
      received = useLocalization().dateLocale;
      return null;
    };
    await act(async () => {
      render(
        <SendbirdProvider appId="test-app-id" userId="test-user-id" dateLocale={customDateLocale}>
          <DateLocaleProbe />
        </SendbirdProvider>,
      );
    });

    // the customer's date-fns locale must reach useLocalization().dateLocale unchanged
    expect(received).toBe(customDateLocale);
  });
});

import React, { act } from 'react';
import type { SendbirdProviderProps } from '../index';
import { UserProfileProvider, useUserProfileContext } from '../../UserProfileContext';
import { renderWithSendbird } from '../../../utils/testMocks/renderWithSendbird';

// The user-profile customization props travel SendbirdProvider -> config -> UserProfileProvider
// -> UserProfileContext before any consumer (the @mention popup, UserProfile) can use them.
// Mount the REAL chain with only the '@sendbird/chat' boundary mocked, so a layer that drops
// or substitutes a customer value is caught here rather than at a consumer with an injected context.
vi.mock('@sendbird/chat', async () => (
  await import('../../../utils/testMocks/sendbirdChat')
).createSendbirdChatMock());

let captured: ReturnType<typeof useUserProfileContext>;

const Consumer = () => {
  captured = useUserProfileContext();
  return null;
};

const mountProvider = async (props: Partial<SendbirdProviderProps>) => {
  await act(async () => {
    renderWithSendbird(
      <UserProfileProvider>
        <Consumer />
      </UserProfileProvider>,
      props,
    );
  });
};

describe('SendbirdProvider — user profile customization reaches the context (integration)', () => {
  const originalConsoleError = globalThis.console.error.bind(globalThis.console);

  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
      originalConsoleError(...args);
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    captured = undefined as never;
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

  it('delivers renderUserProfile to the context as the very same function', async () => {
    const renderUserProfile = vi.fn(() => <div />);
    await mountProvider({ renderUserProfile });

    expect(captured.renderUserProfile).toBe(renderUserProfile);
  });

  it('delivers onBeforeStartDirectMessage and onStartDirectMessage to the context', async () => {
    const onBeforeStartDirectMessage = vi.fn((params) => params);
    const onStartDirectMessage = vi.fn();
    await mountProvider({ onBeforeStartDirectMessage, onStartDirectMessage });

    expect(captured.onBeforeStartDirectMessage).toBe(onBeforeStartDirectMessage);
    expect(captured.onStartDirectMessage).toBe(onStartDirectMessage);
    expect(captured.onUserProfileMessage).toBe(onStartDirectMessage);
  });

  it('leaves the customization hooks undefined when the app provides none', async () => {
    await mountProvider({});

    expect(captured.renderUserProfile).toBeUndefined();
    expect(captured.onBeforeStartDirectMessage).toBeUndefined();
    expect(captured.onStartDirectMessage).toBeUndefined();
  });
});

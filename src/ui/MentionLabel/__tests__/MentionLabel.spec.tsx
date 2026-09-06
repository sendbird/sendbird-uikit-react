import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import MentionLabel from '../index';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import { UserProfileContext } from '../../../lib/UserProfileContext';

const mockState = {
  config: { userId: 'me', logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() } },
  stores: { sdkStore: { sdk: {} as any } },
};

vi.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
}));

vi.mock('react-dom', async () => ({
  ...(await vi.importActual<typeof import('react-dom')>('react-dom')),
  createPortal: (node: React.ReactNode) => node,
}));

const stringSet = {
  USER_PROFILE__MESSAGE: 'Message',
  USER_PROFILE__USER_ID: 'User ID',
  NO_NAME: '(No name)',
};

const sdkReturningUsers = (members: unknown[]) => ({
  createApplicationUserListQuery: () => ({ next: () => Promise.resolve(members) }),
});

const renderMention = (contextValue: Record<string, unknown> = {}) => render(
  <LocalizationContext.Provider value={{ stringSet } as any}>
    <UserProfileContext.Provider
      value={{ isOpenChannel: false, disableUserProfile: false, ...contextValue } as any}
    >
      <MentionLabel
        mentionTemplate="@"
        mentionedUserId="other-user"
        mentionedUserNickname="Other"
        isByMe={false}
      />
    </UserProfileContext.Provider>
  </LocalizationContext.Provider>,
);

describe('MentionLabel - renderUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.stores.sdkStore.sdk = {};
    const portalRoot = document.createElement('div');
    portalRoot.id = 'sendbird-dropdown-portal';
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    document.getElementById('sendbird-dropdown-portal')?.remove();
  });

  it('renders renderUserProfile with the fetched user when a custom renderer is provided', async () => {
    mockState.stores.sdkStore.sdk = sdkReturningUsers([{ userId: 'other-user', nickname: 'Other' }]);
    const renderUserProfile = vi.fn(() => <div data-testid="custom-profile">CUSTOM PROFILE</div>);

    renderMention({ renderUserProfile });
    fireEvent.click(screen.getByText('@Other'));

    expect(await screen.findByTestId('custom-profile')).toBeInTheDocument();
    expect(renderUserProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ userId: 'other-user' }),
        currentUserId: 'me',
        close: expect.any(Function),
      }),
    );
  });

  it('falls back to the default popup when the mentioned user cannot be resolved', async () => {
    mockState.stores.sdkStore.sdk = sdkReturningUsers([]);
    const renderUserProfile = vi.fn(() => <div data-testid="custom-profile">CUSTOM PROFILE</div>);

    renderMention({ renderUserProfile });
    fireEvent.click(screen.getByText('@Other'));

    expect(await screen.findByText('Message')).toBeInTheDocument();
    expect(screen.queryByTestId('custom-profile')).not.toBeInTheDocument();
    expect(renderUserProfile).not.toHaveBeenCalled();
  });

  it('renders the default UserProfile popup when no custom renderer is provided (backward compatibility)', () => {
    renderMention({});
    fireEvent.click(screen.getByText('@Other'));

    expect(screen.queryByTestId('custom-profile')).not.toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });
});

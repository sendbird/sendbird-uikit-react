import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import MentionLabel from '../index';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import { UserProfileContext } from '../../../lib/UserProfileContext';

// No `createApplicationUserListQuery` => clicking the mention opens the popup immediately.
const mockState = {
  config: { userId: 'me', logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() } },
  stores: { sdkStore: { sdk: {} } },
};

vi.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
}));

// Render dropdown/menu content inline instead of through a portal.
vi.mock('react-dom', async () => ({
  ...(await vi.importActual<typeof import('react-dom')>('react-dom')),
  createPortal: (node: React.ReactNode) => node,
}));

const stringSet = {
  USER_PROFILE__MESSAGE: 'Message',
  USER_PROFILE__USER_ID: 'User ID',
  NO_NAME: '(No name)',
};

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
    // MenuItems renders its dropdown into this portal root; without it, it renders nothing.
    const portalRoot = document.createElement('div');
    portalRoot.id = 'sendbird-dropdown-portal';
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    document.getElementById('sendbird-dropdown-portal')?.remove();
  });

  it('renders renderUserProfile output when a custom renderer is provided', () => {
    const renderUserProfile = vi.fn(() => <div data-testid="custom-profile">CUSTOM PROFILE</div>);

    renderMention({ renderUserProfile });

    // Open the popup by clicking the mention.
    fireEvent.click(screen.getByText('@Other'));

    expect(screen.getByTestId('custom-profile')).toBeInTheDocument();
    expect(renderUserProfile).toHaveBeenCalledWith(
      expect.objectContaining({ currentUserId: 'me', close: expect.any(Function) }),
    );
  });

  it('renders the default UserProfile popup when no custom renderer is provided (backward compatibility)', () => {
    renderMention({});

    fireEvent.click(screen.getByText('@Other'));

    // The default popup (with its Message button) is shown, not a custom node.
    expect(screen.queryByTestId('custom-profile')).not.toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });
});

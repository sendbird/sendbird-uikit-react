import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InviteUsers from '../index';
import { ApplicationUserListQuery } from '@sendbird/chat';
import { CHANNEL_TYPE } from '../../../types';
import * as useCreateChannelModule from '../../../context/useCreateChannel';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import type { Mock } from 'vitest';

const mockState = {
  stores: {
    sdkStore: {
      sdk: {
        currentUser: {
          userId: 'test-user-id',
        },
      },
      initialized: true,
    },
  },
  config: { logger: console },
};
vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', async () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
  useSendbird: vi.fn(() => ({ state: mockState })),
}));
vi.mock('../../../context/useCreateChannel');

// Mock createPortal function to render content directly without portal
vi.mock('react-dom', async () => ({
  ...await vi.importActual('react-dom'),
  createPortal: (node) => node,
}));

const mockStringSet = {
  MODAL__CREATE_CHANNEL__TITLE: 'CREATE_CHANNEL',
  MODAL__INVITE_MEMBER__SELECTED: 'USERS_SELECTED',
  BUTTON__CREATE: 'CREATE',
};

const mockLocalizationContext = {
  stringSet: mockStringSet,
};

const defaultMockState = {
  sdk: undefined,
  createChannel: undefined,
  userListQuery: undefined,
  onCreateChannelClick: undefined,
  onChannelCreated: undefined,
  onBeforeCreateChannel: undefined,
  step: 0,
  type: CHANNEL_TYPE.GROUP,
  onCreateChannel: undefined,
  overrideInviteUser: undefined,
};

const defaultMockActions = {
  setStep: vi.fn(),
  setType: vi.fn(),
};

const defaultMockInvitUserState = {
  user: { userId: 'test-user-id' },
};

describe('InviteUsers', () => {
  const mockUseCreateChannel = useCreateChannelModule.default as Mock;

  const renderComponent = (mockState = {}, mockActions = {}, mockInviteUsersState = {}) => {
    mockUseCreateChannel.mockReturnValue({
      state: { ...defaultMockState, ...mockState },
      actions: { ...defaultMockActions, ...mockActions },
    });

    const inviteUserProps = { ...defaultMockInvitUserState, ...mockInviteUsersState };

    return render(
      <LocalizationContext.Provider value={mockLocalizationContext as any}>
        <InviteUsers {...(inviteUserProps as unknown as import('../index').InviteUsersProps)}/>
      </LocalizationContext.Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should enable the modal submit button when there is only the logged-in user is in the user list', async () => {
    const userListQuery = vi.fn(
      () => ({
        hasNext: false,
        next: vi.fn().mockResolvedValue([{ userId: 'user1' }]),
      } as unknown as ApplicationUserListQuery),
    );

    renderComponent({}, {}, { userListQuery });

    expect(await screen.findByText('CREATE')).toBeEnabled();
  });

  // TODO: add this case too
  // it('should disable the modal submit button when there are users on the list but none are checked', () => {
  // })
});

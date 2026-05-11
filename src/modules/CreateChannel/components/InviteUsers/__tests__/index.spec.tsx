import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InviteUsers from '../index';
import { ApplicationUserListQuery } from '@sendbird/chat';
import { CHANNEL_TYPE } from '../../../types';
import * as useCreateChannelModule from '../../../context/useCreateChannel';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';

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
  config: {
    logger: console,
    userId: 'test-user-id',
  },
};
jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState })),
  useSendbird: jest.fn(() => ({ state: mockState })),
}));
jest.mock('../../../context/useCreateChannel');

// Mock createPortal function to render content directly without portal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
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
  setStep: jest.fn(),
  setType: jest.fn(),
};

const defaultMockInvitUserState = {
  user: { userId: 'test-user-id' },
};

describe('InviteUsers', () => {
  const mockUseCreateChannel = useCreateChannelModule.default as jest.Mock;

  const renderComponent = (mockState = {}, mockActions = {}, mockInviteUsersState = {}) => {
    mockUseCreateChannel.mockReturnValue({
      state: { ...defaultMockState, ...mockState },
      actions: { ...defaultMockActions, ...mockActions },
    });

    const inviteUserProps = { ...defaultMockInvitUserState, ...mockInviteUsersState };

    return render(
      <LocalizationContext.Provider value={mockLocalizationContext as any}>
        <InviteUsers {...inviteUserProps}/>
      </LocalizationContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should enable the modal submit button when there is only the logged-in user is in the user list', async () => {
    const userListQuery = jest.fn(
      () => ({
        hasNext: false,
        next: jest.fn().mockResolvedValue([{ userId: 'test-user-id' }]),
      } as unknown as ApplicationUserListQuery),
    );

    renderComponent({}, {}, { userListQuery });

    expect(await screen.findByRole('button', { name: 'CREATE' })).toBeEnabled();
  });

  it('disables the modal submit button until a selectable user is checked', async () => {
    const userListQuery = jest.fn(
      () => ({
        hasNext: false,
        next: jest.fn().mockResolvedValue([{ userId: 'other-user' }]),
      } as unknown as ApplicationUserListQuery),
    );

    renderComponent({}, {}, { userListQuery });

    const submitButton = await screen.findByRole('button', { name: 'CREATE' });
    await waitFor(() => expect(submitButton).toBeDisabled());

    fireEvent.click(await screen.findByRole('checkbox'));

    expect(submitButton).toBeEnabled();
  });

  it('creates a non-distinct group channel by default', async () => {
    const createChannel = jest.fn().mockResolvedValue({ url: 'channel-url' });
    const onChannelCreated = jest.fn();
    const onCancel = jest.fn();
    const userListQuery = jest.fn(
      () => ({
        hasNext: false,
        next: jest.fn().mockResolvedValue([{ userId: 'test-user-id' }]),
      } as unknown as ApplicationUserListQuery),
    );

    renderComponent({ onChannelCreated }, { createChannel }, { onCancel, userListQuery });

    fireEvent.click(await screen.findByText('CREATE'));

    await waitFor(() => expect(createChannel).toHaveBeenCalledWith({
      invitedUserIds: ['test-user-id'],
      isDistinct: false,
      operatorUserIds: ['test-user-id'],
    }));
    await waitFor(() => expect(onChannelCreated).toHaveBeenCalledWith({ url: 'channel-url' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('lets callers override the create button action', async () => {
    const createChannel = jest.fn();
    const onCreateChannelClick = jest.fn();
    const onCancel = jest.fn();
    const userListQuery = jest.fn(
      () => ({
        hasNext: false,
        next: jest.fn().mockResolvedValue([{ userId: 'test-user-id' }]),
      } as unknown as ApplicationUserListQuery),
    );

    renderComponent({ onCreateChannelClick }, { createChannel }, { onCancel, userListQuery });

    fireEvent.click(await screen.findByText('CREATE'));

    expect(onCreateChannelClick).toHaveBeenCalledWith({
      users: ['test-user-id'],
      onClose: onCancel,
      channelType: CHANNEL_TYPE.GROUP,
    });
    expect(createChannel).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('catches rejected user list queries without crashing', async () => {
    const query = {
      hasNext: false,
      isLoading: false,
      next: jest.fn().mockRejectedValue(new Error('query failed')),
    };
    const userListQuery = jest.fn(() => query as unknown as ApplicationUserListQuery);

    renderComponent({}, {}, { userListQuery });

    await waitFor(() => {
      expect(query.next).toHaveBeenCalled();
    });
    expect(screen.getByText('CREATE')).toBeInTheDocument();
  });

  // TODO: add this case too
  // it('should disable the modal submit button when there are users on the list but none are checked', () => {
  // })
});

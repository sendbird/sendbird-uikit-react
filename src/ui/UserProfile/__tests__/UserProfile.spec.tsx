import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import type { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';

import UserProfile from '../index';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import { UserProfileContext } from '../../../lib/UserProfileContext';

const { mockCreateChannel } = vi.hoisted(() => ({ mockCreateChannel: vi.fn() }));

const mockState = {
  config: {
    userId: 'me',
    logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() },
  },
};

vi.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
}));

vi.mock('../../../lib/selectors', () => ({
  getCreateGroupChannel: () => mockCreateChannel,
}));

const stringSet = {
  USER_PROFILE__MESSAGE: 'Message',
  USER_PROFILE__USER_ID: 'User ID',
  NO_NAME: '(No name)',
};

const renderUserProfile = (contextValue: Record<string, unknown>, onSuccess: () => void = vi.fn()) => render(
  <LocalizationContext.Provider value={{ stringSet } as any}>
    <UserProfileContext.Provider
      value={{
        isOpenChannel: false,
        disableUserProfile: false,
        ...contextValue,
      } as any}
    >
      <UserProfile
        user={{ userId: 'other-user', nickname: 'Other' } as any}
        currentUserId="me"
        onSuccess={onSuccess}
      />
    </UserProfileContext.Provider>
  </LocalizationContext.Provider>,
);

describe('UserProfile - onBeforeCreateChannel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateChannel.mockResolvedValue({ url: 'created-channel' } as GroupChannel);
  });

  it('applies onBeforeCreateChannel to modify params before the channel is created', async () => {
    const onBeforeCreateChannel = vi.fn((params: GroupChannelCreateParams) => ({
      ...params,
      isDistinct: true,
      data: 'custom-metadata',
    }));
    const onStartDirectMessage = vi.fn();

    renderUserProfile({ onBeforeCreateChannel, onStartDirectMessage });

    fireEvent.click(screen.getByText('Message'));

    await waitFor(() => expect(mockCreateChannel).toHaveBeenCalledTimes(1));

    // The callback receives the default params and the target user(s).
    expect(onBeforeCreateChannel).toHaveBeenCalledWith(
      expect.objectContaining({
        isDistinct: false,
        invitedUserIds: ['other-user'],
        operatorUserIds: ['me'],
      }),
      [expect.objectContaining({ userId: 'other-user' })],
    );
    // createChannel must receive the PROCESSED params, not the defaults.
    expect(mockCreateChannel).toHaveBeenCalledWith(
      expect.objectContaining({ isDistinct: true, data: 'custom-metadata', invitedUserIds: ['other-user'] }),
    );
    // The after-hook still fires with the created channel.
    await waitFor(() => expect(onStartDirectMessage).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'created-channel' }),
    ));
  });

  it('supports an async onBeforeCreateChannel', async () => {
    const onBeforeCreateChannel = vi.fn(async (params: GroupChannelCreateParams) => ({ ...params, isDistinct: true }));

    renderUserProfile({ onBeforeCreateChannel });

    fireEvent.click(screen.getByText('Message'));

    await waitFor(() => expect(mockCreateChannel).toHaveBeenCalledWith(
      expect.objectContaining({ isDistinct: true }),
    ));
  });

  it('falls back to default params (isDistinct:false) when onBeforeCreateChannel is not provided (backward compatibility)', async () => {
    const onStartDirectMessage = vi.fn();

    renderUserProfile({ onStartDirectMessage });

    fireEvent.click(screen.getByText('Message'));

    expect(mockCreateChannel).toHaveBeenCalledTimes(1);
    expect(mockCreateChannel).toHaveBeenCalledWith(
      expect.objectContaining({
        isDistinct: false,
        invitedUserIds: ['other-user'],
        operatorUserIds: ['me'],
      }),
    );

    await waitFor(() => expect(onStartDirectMessage).toHaveBeenCalled());
  });

  it('logs and creates no channel when a synchronous onBeforeCreateChannel throws', async () => {
    const onBeforeCreateChannel = vi.fn(() => { throw new Error('boom'); });
    const onStartDirectMessage = vi.fn();

    renderUserProfile({ onBeforeCreateChannel, onStartDirectMessage });

    fireEvent.click(screen.getByText('Message'));

    await waitFor(() => expect(mockState.config.logger.error).toHaveBeenCalled());
    expect(mockCreateChannel).not.toHaveBeenCalled();
    expect(onStartDirectMessage).not.toHaveBeenCalled();
  });

  it('logs and creates no channel when an async onBeforeCreateChannel rejects', async () => {
    const onBeforeCreateChannel = vi.fn(async () => { throw new Error('boom'); });
    const onStartDirectMessage = vi.fn();

    renderUserProfile({ onBeforeCreateChannel, onStartDirectMessage });

    fireEvent.click(screen.getByText('Message'));

    await waitFor(() => expect(mockState.config.logger.error).toHaveBeenCalled());
    expect(mockCreateChannel).not.toHaveBeenCalled();
    expect(onStartDirectMessage).not.toHaveBeenCalled();
  });

  it('closes the popup immediately (synchronously) even when onBeforeCreateChannel is set', () => {
    const onBeforeCreateChannel = vi.fn((params: GroupChannelCreateParams) => params);
    const onSuccess = vi.fn();

    renderUserProfile({ onBeforeCreateChannel }, onSuccess);

    fireEvent.click(screen.getByText('Message'));

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

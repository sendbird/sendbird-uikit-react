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

describe('UserProfile - onBeforeStartDirectMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateChannel.mockResolvedValue({ url: 'created-channel' } as GroupChannel);
  });

  it('applies onBeforeStartDirectMessage to modify params before the channel is created', async () => {
    const onBeforeStartDirectMessage = vi.fn((params: GroupChannelCreateParams) => ({
      ...params,
      isDistinct: true,
      data: 'custom-metadata',
    }));
    const onStartDirectMessage = vi.fn();

    renderUserProfile({ onBeforeStartDirectMessage, onStartDirectMessage });

    fireEvent.click(screen.getByText('Message'));

    await waitFor(() => expect(mockCreateChannel).toHaveBeenCalledTimes(1));

    // The callback receives the default params and the target user(s).
    expect(onBeforeStartDirectMessage).toHaveBeenCalledWith(
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

  it('falls back to default params (isDistinct:false) when onBeforeStartDirectMessage is not provided (backward compatibility)', async () => {
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

  it('logs onBeforeStartDirectMessage failure distinctly and creates no channel (sync throw)', async () => {
    const onBeforeStartDirectMessage = vi.fn(() => { throw new Error('boom'); });
    const onStartDirectMessage = vi.fn();

    renderUserProfile({ onBeforeStartDirectMessage, onStartDirectMessage });

    fireEvent.click(screen.getByText('Message'));

    await waitFor(() => expect(mockState.config.logger.error).toHaveBeenCalledWith(
      'UserProfile: onBeforeStartDirectMessage failed', expect.any(Error),
    ));
    expect(mockCreateChannel).not.toHaveBeenCalled();
    expect(onStartDirectMessage).not.toHaveBeenCalled();
  });

  it('logs channel-create failure distinctly when createChannel rejects', async () => {
    mockCreateChannel.mockRejectedValueOnce(new Error('network'));
    const onBeforeStartDirectMessage = vi.fn((params: GroupChannelCreateParams) => params);
    const onStartDirectMessage = vi.fn();

    renderUserProfile({ onBeforeStartDirectMessage, onStartDirectMessage });

    fireEvent.click(screen.getByText('Message'));

    await waitFor(() => expect(mockState.config.logger.error).toHaveBeenCalledWith(
      'UserProfile: channel create failed', expect.any(Error),
    ));
    expect(onStartDirectMessage).not.toHaveBeenCalled();
  });

  it('closes the popup immediately (synchronously) even when onBeforeStartDirectMessage is set', () => {
    const onBeforeStartDirectMessage = vi.fn((params: GroupChannelCreateParams) => params);
    const onSuccess = vi.fn();

    renderUserProfile({ onBeforeStartDirectMessage }, onSuccess);

    fireEvent.click(screen.getByText('Message'));

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

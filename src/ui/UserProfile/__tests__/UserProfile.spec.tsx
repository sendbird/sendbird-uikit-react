import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import { UserProfileContext } from '../../../lib/UserProfileContext';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { getCreateGroupChannel } from '../../../lib/selectors';
import UserProfile from '..';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../lib/selectors', () => ({
  ...jest.requireActual('../../../lib/selectors'),
  getCreateGroupChannel: jest.fn(),
}));

const stringSet = {
  NO_NAME: 'No name',
  USER_PROFILE__MESSAGE: 'Message',
  USER_PROFILE__USER_ID: 'User ID',
};

describe('UserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        config: {
          userId: 'me',
          logger: {
            info: jest.fn(),
          },
        },
      },
    });
  });

  it('creates a direct message channel for another user', async () => {
    const groupChannel = { url: 'new-channel' };
    const createChannel = jest.fn().mockResolvedValue(groupChannel);
    const onStartDirectMessage = jest.fn();
    const onSuccess = jest.fn();
    (getCreateGroupChannel as jest.Mock).mockReturnValue(createChannel);

    render(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <UserProfileContext.Provider value={{ isOpenChannel: false, disableUserProfile: false, onStartDirectMessage }}>
          <UserProfile
            user={{ userId: 'alice', nickname: 'Alice', profileUrl: 'alice.png' } as any}
            onSuccess={onSuccess}
          />
        </UserProfileContext.Provider>
      </LocalizationContext.Provider>,
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Message'));

    expect(onSuccess).toHaveBeenCalled();
    expect(createChannel).toHaveBeenCalledWith({
      isDistinct: false,
      invitedUserIds: ['alice'],
      operatorUserIds: ['me'],
    });
    await waitFor(() => {
      expect(onStartDirectMessage).toHaveBeenCalledWith(groupChannel);
    });
  });

  it('hides messaging for the current user and unnamed users use fallback text', () => {
    (getCreateGroupChannel as jest.Mock).mockReturnValue(jest.fn());

    render(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <UserProfileContext.Provider value={{ isOpenChannel: false, disableUserProfile: false }}>
          <UserProfile
            user={{ userId: 'me', nickname: '' } as any}
            disableMessaging={false}
          />
        </UserProfileContext.Provider>
      </LocalizationContext.Provider>,
    );

    expect(screen.getByText('No name')).toBeInTheDocument();
    expect(screen.queryByText('Message')).toBeNull();
  });
});

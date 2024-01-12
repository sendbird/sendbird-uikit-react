import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom/matchers';
import InviteUsers from '../index';
import { ApplicationUserListQuery } from '@sendbird/chat';
import { SendbirdSdkContext } from '../../../../../lib/SendbirdSdkContext';
import { SendBirdState } from '../../../../../lib/types';

jest.mock('../../../context/CreateChannelProvider', () => ({
  useCreateChannelContext: jest.fn(() => ({
    onBeforeCreateChannel: jest.fn(),
    onCreateChannel: jest.fn(),
    overrideInviteUser: jest.fn(),
    createChannel: jest.fn().mockResolvedValue({}),
    type: 'group',
  })),
}));

// Mock createPortal function to render content directly without portal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('InviteUsers', () => {
  it('should enable the modal submit button when there is only the logged-in user is in the user list', async () => {
    const userListQuery = jest.fn(
      () => ({
        hasNext: false,
        next: jest.fn().mockResolvedValue([{ userId: 'user1' }]),
      } as unknown as ApplicationUserListQuery),
    );

    render(
      <SendbirdSdkContext.Provider value={{} as SendBirdState}>
        <InviteUsers userListQuery={userListQuery} />
      </SendbirdSdkContext.Provider>,
    );

    expect(await screen.findByText('Create')).toBeEnabled();
  });

  // TODO: add this case too
  // it('should disable the modal submit button when there are users on the list but none are checked', () => {
  // })
});

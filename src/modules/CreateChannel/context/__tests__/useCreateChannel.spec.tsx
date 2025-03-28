import React from 'react';

import { CHANNEL_TYPE } from '../../types';
import { CreateChannelProvider } from '../CreateChannelProvider';
import { renderHook } from '@testing-library/react';
import useCreateChannel from '../useCreateChannel';

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: {
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
    },
  })),
}));

const initialState = {
  sdk: undefined,
  userListQuery: undefined,
  onCreateChannelClick: undefined,
  onChannelCreated: expect.any(Function),
  onBeforeCreateChannel: undefined,
  pageStep: 0,
  type: CHANNEL_TYPE.GROUP,
  onCreateChannel: undefined,
  overrideInviteUser: undefined,
};

const wrapper = ({ children }) => (
  <CreateChannelProvider onChannelCreated={() => jest.fn()}>
    {children}
  </CreateChannelProvider>
);

describe('useCreateChannel', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if used outside of GroupChannelListProvider', () => {
    expect(() => {
      renderHook(() => useCreateChannel());
    }).toThrow(new Error('useCreateChannel must be used within a CreateChannelProvider'));
  });

  it('provide the correct initial state', () => {
    const { result } = renderHook(() => useCreateChannel(), { wrapper });

    expect(result.current.state).toEqual(expect.objectContaining(initialState));
  });

});

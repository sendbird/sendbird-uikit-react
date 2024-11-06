import React from 'react';

import { CHANNEL_TYPE } from '../../types';
import { CreateChannelProvider, useCreateChannelContext } from '../CreateChannelProvider';
import { renderHook } from '@testing-library/react';
import useCreateChannel from '../useCreateChannel';

jest.mock('../../../../hooks/useSendbirdStateContext', () => ({
  __esModule: true,
  default: jest.fn(() => ({
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
  })),
}));

jest.mock('../CreateChannelProvider', () => ({
  ...jest.requireActual('../CreateChannelProvider'),
  useCreateChannelContext: jest.fn(),
}));

const initialState = {
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

const mockStore = {
  getState: jest.fn(() => initialState),
  setState: jest.fn(),
  subscribe: jest.fn(() => jest.fn()),
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
    (useCreateChannelContext as jest.Mock).mockReturnValue(null);

    expect(() => {
      renderHook(() => useCreateChannel(), { wrapper });
    }).toThrow(new Error('useCreateChannel must be used within a CreateChannelProvider'));
  });

  it('provide the correct initial state', () => {
    (useCreateChannelContext as jest.Mock).mockReturnValue(mockStore);
    const { result } = renderHook(() => useCreateChannel(), { wrapper });

    expect(result.current.state).toEqual(expect.objectContaining(initialState));
  });

});

import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { CreateChannelProvider } from '../CreateChannelProvider';
import { CHANNEL_TYPE } from '../../types';
import useCreateChannel from '../useCreateChannel';
import { renderHook } from '@testing-library/react-hooks';

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

describe('CreateChannelProvider', () => {
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

  it('provide the correct initial state', () => {
    const wrapper = ({ children }) => (
      <CreateChannelProvider onChannelCreated={jest.fn()}>
        {children}
      </CreateChannelProvider>
    );

    const { result } = renderHook(() => useCreateChannel(), { wrapper });

    expect(result.current.state).toEqual(initialState);
  });

  it('provides correct actions through useCreateChannel hook', () => {
    const wrapper = ({ children }) => (
      <CreateChannelProvider onChannelCreated={jest.fn()}>
        {children}
      </CreateChannelProvider>
    );

    const { result } = renderHook(() => useCreateChannel(), { wrapper });

    expect(result.current.actions).toHaveProperty('setStep');
    expect(result.current.actions).toHaveProperty('setType');
  });

  it('update state correctly when setStep is called', async () => {
    const wrapper = ({ children }) => (
      <CreateChannelProvider onChannelCreated={jest.fn()}>
        {children}
      </CreateChannelProvider>
    );

    const { result } = renderHook(() => useCreateChannel(), { wrapper });
    await act(async () => {
      result.current.actions.setPageStep(1);
      await waitFor(() => {
        const updatedState = result.current.state;
        expect(updatedState.pageStep).toEqual(1);
      });
    });
  });

  it('update state correctly when setType is called', async () => {
    const wrapper = ({ children }) => (
      <CreateChannelProvider onChannelCreated={jest.fn()}>
        {children}
      </CreateChannelProvider>
    );

    const { result } = renderHook(() => useCreateChannel(), { wrapper });

    await act(async () => {
      result.current.actions.setType(CHANNEL_TYPE.BROADCAST);
      await waitFor(() => {
        const updatedState = result.current.state;
        expect(updatedState.type).toEqual(CHANNEL_TYPE.BROADCAST);
      });
    });
  });

});

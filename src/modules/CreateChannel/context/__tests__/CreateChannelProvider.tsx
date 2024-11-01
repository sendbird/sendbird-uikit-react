import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { CreateChannelProvider, useCreateChannelContext, UserListQuery } from '../CreateChannelProvider';
import { CHANNEL_TYPE } from '../../types';
import { useCreateChannel } from '../useCreateChannel';
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
    createChannel: undefined,
    userListQuery: undefined,
    onCreateChannelClick: undefined,
    onChannelCreated: () => {},
    onBeforeCreateChannel: undefined,
    step: 0,
    type: CHANNEL_TYPE.GROUP,
    onCreateChannel: undefined,
    overrideInviteUser: undefined,
  };

  it('provide the correct initial state', () => {
    const wrapper = ({ children }) => (
      <CreateChannelProvider onChannelCreated={() => jest.fn()}>
        {children}
      </CreateChannelProvider>
    );

    const { result } = renderHook(() => useCreateChannelContext(), { wrapper });

    expect(result.current.getState()).toMatchObject(initialState);
  });

  it('update state correctly', async () => {
    const wrapper = ({ children }) => (
      <CreateChannelProvider onChannelCreated={() => jest.fn()}>
        {children}
      </CreateChannelProvider>
    );

    const { result } = renderHook(() => useCreateChannelContext(), { wrapper });
    expect(result.current.getState().userListQuery).toEqual(undefined);

    const userListQuery = { hasNext: true, next: () => jest.fn(), isLoading: false } as unknown as UserListQuery;

    await act(async () => {
      result.current.setState({ userListQuery: () => userListQuery });
      await waitFor(() => {
        const newState = result.current.getState();
        expect(newState.userListQuery()).toEqual(userListQuery);
      });
    });
  });

  it('provides correct actions through useCreateChannel hook', () => {
    const wrapper = ({ children }) => (
      <CreateChannelProvider onChannelCreated={() => jest.fn()}>
        {children}
      </CreateChannelProvider>
    );

    const { result } = renderHook(() => useCreateChannel(), { wrapper });

    expect(result.current.actions).toHaveProperty('setStep');
    expect(result.current.actions).toHaveProperty('setType');
  });

  it('update state correctly when setStep is called', async () => {
    const wrapper = ({ children }) => (
      <CreateChannelProvider onChannelCreated={() => jest.fn()}>
        {children}
      </CreateChannelProvider>
    );

    const { result } = renderHook(() => useCreateChannel(), { wrapper });
    await act(async () => {
      result.current.actions.setStep(1);
      await waitFor(() => {
        const updatedState = result.current.state;
        expect(updatedState.step).toEqual(1);
      });
    });
  });

  it('update state correctly when setType is called', async () => {
    const wrapper = ({ children }) => (
      <CreateChannelProvider onChannelCreated={() => jest.fn()}>
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

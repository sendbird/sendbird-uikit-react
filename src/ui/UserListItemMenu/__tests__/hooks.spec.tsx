import { act, renderHook } from '@testing-library/react';
import { Role } from '@sendbird/chat';

import { useToggleBan, useToggleMute, useToggleOperator } from '../hooks';

const user = {
  userId: 'user-1',
  role: Role.OPERATOR,
  isMuted: true,
};

const createChannel = (overrides = {}) => ({
  url: 'channel-url',
  addOperators: jest.fn().mockResolvedValue(undefined),
  removeOperators: jest.fn().mockResolvedValue(undefined),
  muteUser: jest.fn().mockResolvedValue(undefined),
  unmuteUser: jest.fn().mockResolvedValue(undefined),
  banUser: jest.fn().mockResolvedValue(undefined),
  unbanUser: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('UserListItemMenu hooks', () => {
  it('initializes operator and mute state from the member when explicit values are not provided', () => {
    const channel = createChannel();

    const operatorHook = renderHook(() => useToggleOperator({
      channel,
      user,
    } as any));
    const muteHook = renderHook(() => useToggleMute({
      channel,
      user,
    } as any));

    expect(operatorHook.result.current.isOperator).toBe(true);
    expect(muteHook.result.current.isMuted).toBe(true);
  });

  it('adds and removes operators while notifying consumers', async () => {
    const addChannel = createChannel();
    const addCallback = jest.fn();
    const addHook = renderHook(() => useToggleOperator({
      channel: addChannel,
      user,
      isOperator: false,
      onToggleOperatorState: addCallback,
    } as any));

    await act(async () => {
      await addHook.result.current.toggleOperator();
    });

    expect(addChannel.addOperators).toHaveBeenCalledWith(['user-1']);
    expect(addHook.result.current.isOperator).toBe(true);
    expect(addCallback).toHaveBeenCalledWith({ user, newStatus: true });

    const removeChannel = createChannel();
    const removeCallback = jest.fn();
    const removeHook = renderHook(() => useToggleOperator({
      channel: removeChannel,
      user,
      isOperator: true,
      onToggleOperatorState: removeCallback,
    } as any));

    await act(async () => {
      await removeHook.result.current.toggleOperator();
    });

    expect(removeChannel.removeOperators).toHaveBeenCalledWith(['user-1']);
    expect(removeHook.result.current.isOperator).toBe(false);
    expect(removeCallback).toHaveBeenCalledWith({ user, newStatus: false });
  });

  it('mutes and unmutes users while notifying consumers', async () => {
    const muteChannel = createChannel();
    const muteCallback = jest.fn();
    const muteHook = renderHook(() => useToggleMute({
      channel: muteChannel,
      user,
      isMuted: false,
      onToggleMuteState: muteCallback,
    } as any));

    await act(async () => {
      await muteHook.result.current.toggleMute();
    });

    expect(muteChannel.muteUser).toHaveBeenCalledWith(user);
    expect(muteHook.result.current.isMuted).toBe(true);
    expect(muteCallback).toHaveBeenCalledWith({ user, newStatus: true });

    const unmuteChannel = createChannel();
    const unmuteCallback = jest.fn();
    const unmuteHook = renderHook(() => useToggleMute({
      channel: unmuteChannel,
      user,
      isMuted: true,
      onToggleMuteState: unmuteCallback,
    } as any));

    await act(async () => {
      await unmuteHook.result.current.toggleMute();
    });

    expect(unmuteChannel.unmuteUser).toHaveBeenCalledWith(user);
    expect(unmuteHook.result.current.isMuted).toBe(false);
    expect(unmuteCallback).toHaveBeenCalledWith({ user, newStatus: false });
  });

  it('bans and unbans users while notifying consumers', async () => {
    const banChannel = createChannel();
    const banCallback = jest.fn();
    const banHook = renderHook(() => useToggleBan({
      channel: banChannel,
      user,
      isBanned: false,
      onToggleBanState: banCallback,
    } as any));

    await act(async () => {
      await banHook.result.current.toggleBan();
    });

    expect(banChannel.banUser).toHaveBeenCalledWith(user);
    expect(banHook.result.current.isBanned).toBe(true);
    expect(banCallback).toHaveBeenCalledWith({ user, newStatus: true });

    const unbanChannel = createChannel();
    const unbanCallback = jest.fn();
    const unbanHook = renderHook(() => useToggleBan({
      channel: unbanChannel,
      user,
      isBanned: true,
      onToggleBanState: unbanCallback,
    } as any));

    await act(async () => {
      await unbanHook.result.current.toggleBan();
    });

    expect(unbanChannel.unbanUser).toHaveBeenCalledWith(user);
    expect(unbanHook.result.current.isBanned).toBe(false);
    expect(unbanCallback).toHaveBeenCalledWith({ user, newStatus: false });
  });

  it('reports action failures without changing the previous state', async () => {
    const error = new Error('failed');
    const channel = createChannel({ addOperators: jest.fn().mockRejectedValue(error) });
    const callback = jest.fn();
    const { result } = renderHook(() => useToggleOperator({
      channel,
      user,
      isOperator: false,
      onToggleOperatorState: callback,
    } as any));

    await act(async () => {
      await result.current.toggleOperator();
    });

    expect(result.current.isOperator).toBe(false);
    expect(callback).toHaveBeenCalledWith({ user, newStatus: false, error });
  });

  it('rejects overlapping toggle actions while one is processing', async () => {
    let resolveAction: () => void = () => undefined;
    const pendingAction = new Promise<void>((resolve) => {
      resolveAction = resolve;
    });
    const channel = createChannel({ addOperators: jest.fn(() => pendingAction) });
    const callback = jest.fn();
    const { result } = renderHook(() => useToggleOperator({
      channel,
      user,
      isOperator: false,
      onToggleOperatorState: callback,
    } as any));

    let firstToggle: Promise<void> = Promise.resolve();
    await act(async () => {
      firstToggle = result.current.toggleOperator();
      await result.current.toggleOperator();
    });

    expect(callback).toHaveBeenCalledWith({
      user,
      newStatus: false,
      error: expect.objectContaining({ message: 'Processing in progress' }),
    });

    await act(async () => {
      resolveAction();
      await firstToggle;
    });

    expect(result.current.isOperator).toBe(true);
  });
});

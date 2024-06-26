import { useState, useRef, useCallback, MutableRefObject } from 'react';
import type { BaseChannel, User } from '@sendbird/chat';
import { Role } from '@sendbird/chat';
import type { Member } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';

import type { UserListItemMenuContextValues } from './context';

// Utility function to handle processing state and promise execution
const processToggleAction = async (
  isProcessing: MutableRefObject<boolean>,
  action: () => Promise<void>,
): Promise<void> => {
  if (isProcessing.current) {
    return Promise.reject(new Error('Processing in progress'));
  }
  isProcessing.current = true;
  try {
    await action();
  } finally {
    isProcessing.current = false;
  }
};

const getInitialIsOperator = (channel: BaseChannel | undefined, user: User | Member): boolean => {
  if (!channel) return false;
  if (channel instanceof OpenChannel) {
    return channel.isOperator(user);
  }
  return (user as Member)?.role === Role.OPERATOR;
};

const getInitialIsMuted = (channel: BaseChannel | undefined, user: User | Member): boolean => {
  return channel ? (user as Member)?.isMuted : false;
};

export const useToggleOperator = ({
  channel,
  user,
  onToggleOperatorState,
  isOperator: _isOperator,
}: UserListItemMenuContextValues & { isOperator?: boolean }) => {
  const [isOperator, setIsOperator] = useState(_isOperator ?? getInitialIsOperator(channel, user));
  const isProcessing = useRef(false);

  const toggleOperator = useCallback(
    () => {
      // If channel is undefined, resolve immediately
      if (!channel) return Promise.resolve();

      return processToggleAction(isProcessing, async () => {
        const togglePromise = isOperator
          ? channel.removeOperators([user.userId])
          : channel.addOperators([user.userId]);

        await togglePromise;
        const newStatus = !isOperator;
        setIsOperator(newStatus);
        onToggleOperatorState?.({ user, newStatus });
      });
    },
    [isOperator, channel, user, onToggleOperatorState],
  );

  return {
    isOperator,
    toggleOperator,
  };
};

export const useToggleMute = ({
  channel,
  user,
  onToggleMuteState,
  isMuted: _isMuted,
}: UserListItemMenuContextValues & { isMuted?: boolean }) => {
  const [isMuted, setIsMuted] = useState(_isMuted ?? getInitialIsMuted(channel, user));
  const isProcessing = useRef(false);

  const toggleMute = useCallback(
    () => {
      // If channel is undefined, resolve immediately
      if (!channel) return Promise.resolve();

      return processToggleAction(isProcessing, async () => {
        const togglePromise = isMuted
          ? channel.unmuteUser(user)
          : channel.muteUser(user);

        await togglePromise;
        const newStatus = !isMuted;
        setIsMuted(newStatus);
        onToggleMuteState?.({ user, newStatus });
      });
    },
    [isMuted, channel, user, onToggleMuteState],
  );

  return {
    isMuted,
    toggleMute,
  };
};

export const useToggleBan = ({
  channel,
  user,
  onToggleBanState,
  isBanned: _isBanned,
}: UserListItemMenuContextValues & { isBanned?: boolean }) => {
  const [isBanned, setIsBanned] = useState(_isBanned ?? false); // Initially starting with false
  const isProcessing = useRef(false);

  const toggleBan = useCallback(
    () => {
      // If channel is undefined, resolve immediately
      if (!channel) return Promise.resolve();

      return processToggleAction(isProcessing, async () => {
        const togglePromise = isBanned
          ? (channel as BaseChannel).unbanUser(user)
          : (channel as BaseChannel).banUser(user, -1, '');

        await togglePromise;
        const newStatus = !isBanned;
        setIsBanned(newStatus);
        onToggleBanState?.({ user, newStatus });
      });
    },
    [isBanned, channel, user, onToggleBanState],
  );

  return {
    isBanned,
    toggleBan,
  };
};

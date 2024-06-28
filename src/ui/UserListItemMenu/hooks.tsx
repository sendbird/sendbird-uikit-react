import { useState, useRef, useCallback, MutableRefObject } from 'react';
import type { User } from '@sendbird/chat';
import { Role } from '@sendbird/chat';
import type { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';

import type { UserListItemMenuContextValues } from './context';

// Utility function to handle processing state and promise execution
const processToggleAction = async (
  isProcessing: MutableRefObject<boolean>,
  action: () => Promise<void>,
  errorHandler?: (error: Error) => void,
): Promise<void> => {
  if (isProcessing.current) {
    const error = new Error('Processing in progress');
    errorHandler(error);
    return Promise.reject(error);
  }
  isProcessing.current = true;
  try {
    await action();
  } catch (error) {
    errorHandler?.(error);
    throw error;
  } finally {
    isProcessing.current = false;
  }
};

const getInitialIsOperator = (channel: GroupChannel | undefined, user: User): boolean => {
  if (!channel) return false;
  if (channel instanceof OpenChannel) {
    return channel.isOperator(user);
  }
  return (user as Member)?.role === Role.OPERATOR;
};

const getInitialIsMuted = (channel: GroupChannel | undefined, user: User): boolean => {
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

      return processToggleAction(
        isProcessing,
        async () => {
          const togglePromise = isOperator
            ? channel.removeOperators([user.userId])
            : channel.addOperators([user.userId]);

          await togglePromise;
          const newStatus = !isOperator;
          setIsOperator(newStatus);
          onToggleOperatorState?.({ user, newStatus });
        },
        (error) => {
          onToggleOperatorState?.({ user, newStatus: isOperator, error });
        },
      );
    },
    [isOperator, channel.url, user.userId, onToggleOperatorState],
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

      return processToggleAction(
        isProcessing,
        async () => {
          const togglePromise = isMuted
            ? channel.unmuteUser(user)
            : channel.muteUser(user);

          await togglePromise;
          const newStatus = !isMuted;
          setIsMuted(newStatus);
          onToggleMuteState?.({ user, newStatus });
        },
        (error) => {
          onToggleMuteState?.({ user, newStatus: isMuted, error });
        },
      );
    },
    [isMuted, channel.url, user.userId, onToggleMuteState],
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

      return processToggleAction(
        isProcessing,
        async () => {
          const togglePromise = isBanned
            ? channel.unbanUser(user)
            : channel.banUser(user, -1, '');

          await togglePromise;
          const newStatus = !isBanned;
          setIsBanned(newStatus);
          onToggleBanState?.({ user, newStatus });
        },
        (error) => {
          onToggleBanState?.({ user, newStatus: isBanned, error });
        },
      );
    },
    [isBanned, channel.url, user.userId, onToggleBanState],
  );

  return {
    isBanned,
    toggleBan,
  };
};

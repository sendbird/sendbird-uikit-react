import React, { useEffect, useRef } from 'react';
import { User } from '@sendbird/chat';
import type {
  GroupChannel,
  GroupChannelCreateParams,
} from '@sendbird/chat/groupChannel';

import { CHANNEL_TYPE } from '../types';
import { SendbirdChatType } from '../../../lib/Sendbird/types';
import { createStore } from '../../../utils/storeManager';
import { useStore } from '../../../hooks/useStore';
import useCreateChannel from './useCreateChannel';
import { useSendbird } from '../../../lib/Sendbird/context/hooks/useSendbird';

const CreateChannelContext = React.createContext<ReturnType<typeof createStore<CreateChannelState>> | null>(null);

const initialState = {
  sdk: undefined,
  userListQuery: undefined,
  onCreateChannelClick: undefined,
  onChannelCreated: undefined,
  onBeforeCreateChannel: undefined,
  pageStep: 0,
  type: CHANNEL_TYPE.GROUP,
  onCreateChannel: undefined,
  overrideInviteUser: undefined,
};

export interface UserListQuery {
  hasNext?: boolean;
  next(): Promise<Array<User>>;
  get isLoading(): boolean;
}

type OverrideInviteUserType = {
  users: Array<string>;
  onClose: () => void;
  channelType: CHANNEL_TYPE;
};

export interface CreateChannelProviderProps {
  children?: React.ReactElement;
  userListQuery?(): UserListQuery;

  /**
   * Overrides the action of the channel creation button.
   * */
  onCreateChannelClick?(params: OverrideInviteUserType): void;

  /**
   * Called when the channel is created. (Should not have onCreateChannelClick for this to invoke.)
   * */
  onChannelCreated(channel: GroupChannel): void;
  /**
   * Called just before the channel is created. (Should not have onCreateChannelClick for this to invoke.)
   * */
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;

  /**
   * @deprecated
   * Use the onChannelCreated instead
   */
  onCreateChannel?(channel: GroupChannel): void;
  /**
   * @deprecated
   * Use the onCreateChannelClick instead
   */
  overrideInviteUser?(params: OverrideInviteUserType): void;
}

export interface CreateChannelState {
  sdk: SendbirdChatType;
  userListQuery?(): UserListQuery;

  /**
   * Overrides the action of the channel creation button.
   * */
  onCreateChannelClick?(params: OverrideInviteUserType): void;

  /**
   * Called when the channel is created. (Should not have onCreateChannelClick for this to invoke.)
   * */
  onChannelCreated?(channel: GroupChannel): void;
  /**
   * Called just before the channel is created. (Should not have onCreateChannelClick for this to invoke.)
   * */
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;

  pageStep: number,
  type: CHANNEL_TYPE,
  /**
   * @deprecated
   * Use the onChannelCreated instead
   */
  onCreateChannel?(channel: GroupChannel): void;
  /**
   * @deprecated
   * Use the onCreateChannelClick instead
   */
  overrideInviteUser?(params: OverrideInviteUserType): void;
}

const CreateChannelManager: React.FC<CreateChannelProviderProps> = (props: CreateChannelProviderProps) => {
  const {
    onCreateChannelClick,
    onBeforeCreateChannel,
    onChannelCreated,
    userListQuery,
    onCreateChannel,
    overrideInviteUser,
  } = props;

  const { updateState } = useCreateChannelStore();
  const { state: { config } } = useSendbird();
  const _userListQuery = userListQuery ?? config?.userListQuery;

  useEffect(() => {
    updateState({
      onCreateChannelClick,
      onBeforeCreateChannel,
      onChannelCreated,
      userListQuery: _userListQuery,
      onCreateChannel,
      overrideInviteUser,
    });
  }, [
    onCreateChannelClick,
    onBeforeCreateChannel,
    onChannelCreated,
    userListQuery,
    onCreateChannel,
    overrideInviteUser,
    _userListQuery,
  ]);

  return null;
};
const CreateChannelProvider: React.FC<CreateChannelProviderProps> = (props: CreateChannelProviderProps) => {
  const { children } = props;

  return (
    <InternalCreateChannelProvider>
      <CreateChannelManager {...props} />
      {children}
    </InternalCreateChannelProvider>
  );
};

const createCreateChannelStore = () => createStore(initialState);
const InternalCreateChannelProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const storeRef = useRef(createCreateChannelStore());

  return (
    <CreateChannelContext.Provider value={storeRef.current}>
      {children}
    </CreateChannelContext.Provider>
  );
};

const useCreateChannelStore = () => {
  return useStore(CreateChannelContext, state => state, initialState);
};

const useCreateChannelContext = () => {
  const { state, actions } = useCreateChannel();
  return { ...state, ...actions };
};

export {
  CreateChannelProvider,
  CreateChannelContext,
  useCreateChannelContext,
};

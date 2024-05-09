import React, { useState } from 'react';
import { User } from '@sendbird/chat';
import type {
  GroupChannel,
  GroupChannelCreateParams,
} from '@sendbird/chat/groupChannel';

import { getCreateGroupChannel } from '../../../lib/selectors';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { CHANNEL_TYPE } from '../types';
import { SendbirdChatType } from '../../../lib/types';

const CreateChannelContext = React.createContext<CreateChannelContextInterface | null>(null);

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

type CreateChannel = (channelParams: GroupChannelCreateParams) => Promise<GroupChannel>;

export interface CreateChannelContextInterface {
  sdk: SendbirdChatType;
  createChannel: CreateChannel;
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

  step: number,
  setStep: React.Dispatch<React.SetStateAction<number>>,
  type: CHANNEL_TYPE,
  setType: React.Dispatch<React.SetStateAction<CHANNEL_TYPE>>,
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

const CreateChannelProvider: React.FC<CreateChannelProviderProps> = (props: CreateChannelProviderProps) => {
  const {
    children,
    onCreateChannelClick,
    onBeforeCreateChannel,
    onChannelCreated,
    userListQuery,
    onCreateChannel,
    overrideInviteUser,
  } = props;

  const store = useSendbirdStateContext();
  const _userListQuery = userListQuery ?? store?.config?.userListQuery;

  const [step, setStep] = useState(0);
  const [type, setType] = useState(CHANNEL_TYPE.GROUP);

  return (
    <CreateChannelContext.Provider value={{
      sdk: store.stores.sdkStore.sdk,
      createChannel: getCreateGroupChannel(store),
      onCreateChannelClick,
      onBeforeCreateChannel,
      onChannelCreated,
      userListQuery: _userListQuery,
      step,
      setStep,
      type,
      setType,
      onCreateChannel,
      overrideInviteUser,
    }}>
      {children}
    </CreateChannelContext.Provider>
  );
};

const useCreateChannelContext = () => {
  const context = React.useContext(CreateChannelContext);
  if (!context) throw new Error('CreateChannelContext not found. Use within the CreateChannel module.');
  return context;
};

export {
  CreateChannelProvider,
  useCreateChannelContext,
};

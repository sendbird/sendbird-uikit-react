import React, { useState } from 'react';
import { User } from '@sendbird/chat';
import type {
  GroupChannel,
  GroupChannelCreateParams,
  SendbirdGroupChat,
} from '@sendbird/chat/groupChannel';

import { getCreateGroupChannel } from '../../../lib/selectors';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { CHANNEL_TYPE } from '../types';

const CreateChannelContext = React.createContext(undefined);

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
  sdk: SendbirdGroupChat;
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

const useCreateChannelContext = (): CreateChannelContextInterface => (
  React.useContext(CreateChannelContext)
);

export {
  CreateChannelProvider,
  useCreateChannelContext,
};

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
}

type OverrideInviteUserType = {
  users: Array<string>;
  onClose: () => void;
  channelType: CHANNEL_TYPE;
};

export interface CreateChannelProviderProps {
  children?: React.ReactElement;
  onCreateChannel(channel: GroupChannel): void;
  overrideInviteUser?(params: OverrideInviteUserType): void;
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  userListQuery?(): UserListQuery;
  excludeSelf?: boolean;
}

type CreateChannel = (channelParams: GroupChannelCreateParams) => Promise<GroupChannel>;

export interface CreateChannelContextInterface {
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  createChannel: CreateChannel;
  sdk: SendbirdGroupChat;
  userListQuery?(): UserListQuery;
  overrideInviteUser?(params: OverrideInviteUserType): void;
  onCreateChannel?(channel: GroupChannel): void;
  step: number,
  setStep: React.Dispatch<React.SetStateAction<number>>,
  type: CHANNEL_TYPE,
  setType: React.Dispatch<React.SetStateAction<CHANNEL_TYPE>>,
  excludeSelf?: boolean
}

const CreateChannelProvider: React.FC<CreateChannelProviderProps> = (props: CreateChannelProviderProps) => {
  const {
    children,
    onCreateChannel,
    onBeforeCreateChannel,
    overrideInviteUser,
    userListQuery,
    excludeSelf
  } = props;

  const store = useSendbirdStateContext();
  const userListQuery_ = store?.config?.userListQuery;
  const createChannel: (channelParams: GroupChannelCreateParams)
    => Promise<GroupChannel> = getCreateGroupChannel(store);

  const [step, setStep] = useState(0);
  const [type, setType] = useState(CHANNEL_TYPE.GROUP);

  return (
    <CreateChannelContext.Provider value={{
      onBeforeCreateChannel,
      createChannel,
      onCreateChannel,
      overrideInviteUser,
      userListQuery: userListQuery || userListQuery_,
      step,
      setStep,
      type,
      setType,
      excludeSelf
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

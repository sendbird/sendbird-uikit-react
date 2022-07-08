import React, { useState } from 'react';
import type {
  GroupChannel,
  GroupChannelCreateParams,
  SendbirdGroupChat,
} from '@sendbird/chat/groupChannel';

import { getCreateGroupChannel } from '../../../lib/selectors';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { CHANNEL_TYPE } from '../types';

const CreateChannelContext = React.createContext(undefined);

interface UserListQuery {
  hasNext?: boolean;
  next(callback: unknown): void;
}

export interface CreateChannelProviderProps {
  children?: React.ReactNode;
  onCreateChannel(channel: GroupChannel): void;
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  userListQuery?(): UserListQuery;
}

type CreateChannel = (channelParams: GroupChannelCreateParams) => Promise<GroupChannel>;

export interface CreateChannelContextInterface {
  onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
  createChannel: CreateChannel;
  sdk: SendbirdGroupChat;
  userListQuery?(): UserListQuery;
  onCreateChannel?(channel: GroupChannel): void;
  step: number,
  setStep: React.Dispatch<React.SetStateAction<number>>,
  type: CHANNEL_TYPE,
  setType: React.Dispatch<React.SetStateAction<CHANNEL_TYPE>>,
}

const CreateChannelProvider: React.FC<CreateChannelProviderProps> = (props: CreateChannelProviderProps) => {
  const {
    children,
    onCreateChannel,
    onBeforeCreateChannel,
    userListQuery,
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
      userListQuery: userListQuery || userListQuery_,
      step,
      setStep,
      type,
      setType,
    }}>
      {children}
    </CreateChannelContext.Provider>
  );
}

const useCreateChannelContext = (): CreateChannelContextInterface => (
  React.useContext(CreateChannelContext)
);

export {
  CreateChannelProvider,
  useCreateChannelContext,
};

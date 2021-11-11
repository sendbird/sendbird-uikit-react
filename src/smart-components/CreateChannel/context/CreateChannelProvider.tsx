import React, { useState } from 'react';
import Sendbird from 'sendbird';

import { getCreateChannel } from '../../../lib/selectors';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { CHANNEL_TYPE } from '../types';

const CreateChannelContext = React.createContext(undefined);

interface UserListQuery {
  hasNext?: boolean;
  next(callback: unknown): void;
}

export interface CreateChannelProviderProps {
  children?: React.ReactNode;
  onCreateChannel(channel: Sendbird.GroupChannel): void;
  onBeforeCreateChannel?(users: Array<string>): Sendbird.GroupChannelParams;
  userListQuery?(): UserListQuery;
}

type CreateChannel = (channelParams: Sendbird.GroupChannelParams) => Promise<Sendbird.GroupChannel>;

export interface CreateChannelContextInterface {
  onBeforeCreateChannel?(users: Array<string>): Sendbird.GroupChannelParams;
  createChannel: CreateChannel;
  sdk: Sendbird.SendBirdInstance;
  userListQuery?(): UserListQuery;
  onCreateChannel?(channel: Sendbird.GroupChannel): void;
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
  const createChannel: (channelParams: Sendbird.GroupChannelParams)
    => Promise<Sendbird.GroupChannel> = getCreateChannel(store);

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

export { CreateChannelProvider, useCreateChannelContext };

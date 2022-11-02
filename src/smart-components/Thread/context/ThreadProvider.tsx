import React, { useEffect, useReducer } from 'react';
import { CustomUseReducerDispatcher } from '../../../lib/SendbirdState';
import { ThreadContextInitialState } from './dux/initialState';

import threadReducer from './dux/reducer';
import useGetChannel from './hooks/useGetChannel';
import threadInitialState from './dux/initialState';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { FileMessage, MessageRetrievalParams, UserMessage } from '@sendbird/chat/message';
import useGetParentMessage from './hooks/useGetParentMessage';

export type ThreadContextProps = {
  children?: React.ReactElement;
  channelUrl?: string;
  message?: UserMessage | FileMessage;
}

export interface ThreadProviderInterface {// extends ThreadContextProps

}
const ThreadContext = React.createContext<ThreadProviderInterface | null>(null);

const ThreadProvider: React.FC<ThreadContextProps> = (props: ThreadContextProps) => {
  const {
    children,
    channelUrl,
    message,
  } = props;

  // Context from SendbirdProvider
  const globalStore = useSendbirdStateContext();
  const { stores, config } = globalStore;
  // // stores
  const { sdkStore } = stores;
  const { sdk } = sdkStore;
  const sdkInit = sdkStore?.initialized;
  // // config
  const { logger } = config;

  // dux of Thread
  const [threadStore, threadDispatcher] = useReducer(
    threadReducer,
    threadInitialState,
  ) as [ThreadContextInitialState, CustomUseReducerDispatcher];
  const {
    currentChannel,
    parentMessage,
    threadListState,
    parentMessageInfoState,
    hasMorePrev,
    hasMoreNext,
    emojiContainer,
  }: ThreadContextInitialState = threadStore;

  /**
   * # Basic Business Logic
   * ### Functions
   * 0. get channel <channelUrl>
   * 1. get parent meessage <channel, messageId>
   * 2. fetch messages with the parent message <channel, messageId>
   *  2-1. from bottom OR top ?
   * 3. send message <channel, messageId>
   *  3-1. send user message <+text>
   *  3-2. mention <+mentionedUsers, mentionTemplate>
   *  3-3. send file message <+file>
   *  3-4. quote message X
   * 4. message <-messageList>
   *  4-1. edit message <-message>
   *  4-2. delete message <-messageId>
   *  4-3. copy message <-message>
   *  4-4. react to message <-message>
   *  4-5. resend failed message
   * ### Store
   * 1. channel <F0>
   * 2. parent message <F1>
   * 3. message list <F2, F3, F4>
   * 4. mentioned users?
   * 
   * # Customization Logic
   * 
   * ## UI - Placholder
   * ### Functions
   * 1. render empty
   * 2. render loading
   * 3. render error
   * ### Context
   * 1. status (getting parent message)
   * 2. status (getting message list)
   *
   * ## UI - Header
   * ### Functions
   * 1. render header
   * ### context
   * 1. parent messsage
   * 
   * ## UI - ParentMessage
   * ### Functions
   * 1. render parent message info
   * ### Context
   * 1. parent message
   * 
   * ## UI - MessageItem
   * ### Functions
   * 1. render message item
   * ### Context
   * 1. each message
   * 
   * ## UI - MessageInput
   * ### Functions
   * 1. render message input
   * ### Context
   * 1. channel
   * 2. parent message
   */

  // Initialization
  useGetChannel({
    channelUrl,
    sdkInit,
  }, {
    sdk,
    logger,
    threadDispatcher,
  });
  useGetParentMessage({
    channelUrl,
    sdkInit,
    parentMessageId: message?.parentMessageId,
  }, {
    sdk,
    logger,
    threadDispatcher,
  });

  return (
    <ThreadContext.Provider
      value={{

      }}
    >
      {/* UserProfileProvider */}
      {children}
    </ThreadContext.Provider>
  );
};

export default ThreadProvider;

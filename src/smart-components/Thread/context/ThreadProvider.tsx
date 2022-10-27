import React from 'react';

export type ThreadContextProps = {
  children?: React.ReactElement;
  channelUrl?: string;
  parentMessageId?: string | number;
}

export interface ThreadProviderInterface {// extends ThreadContextProps

}
const ThreadContext = React.createContext<ThreadProviderInterface | null>(null);

const ThreadProvider: React.FC<ThreadContextProps> = (props: ThreadContextProps) => {
  const {
    children,
    channelUrl,
    parentMessageId,
  } = props;
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

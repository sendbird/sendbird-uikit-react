import React from 'react';
import type { MessageListViewBasicProps } from './MessageListView';
import MessageListView from './MessageListView';
import { MessageList as LegacyMessageList } from '../../../Channel/components/MessageList';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';

export type MessageListProps = MessageListViewBasicProps;

export const MessageList = (props: MessageListProps) => {
  const hasLegacyChannelContext = Object.hasOwn(props, 'currentGroupChannel');

  if (hasLegacyChannelContext) {
    return (
      /**
       * Because the MessageListView and LegacyMessageList components,
       * they have totally different interface and behavior
       */
      <LegacyMessageList />
    );
  } else {
    const context = useGroupChannelContext();
    return (
      <MessageListView
        {...props}
        {...context}
        unreadMessageCount={context.newMessages.length}
      />
    );
  }
};

export default MessageList;

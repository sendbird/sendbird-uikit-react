import React from 'react';

import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { GroupChannelUIBasicProps, GroupChannelUIView } from './GroupChannelUIView';

import GroupChannelHeader from '../GroupChannelHeader';
import MessageList from '../MessageList';
import MessageInputWrapper from '../MessageInputWrapper';

export interface GroupChannelUIProps extends GroupChannelUIBasicProps {}

export const GroupChannelUI = (props: GroupChannelUIProps) => {
  const context = useGroupChannelContext();
  const { currentChannel, channelUrl, loading } = context;

  // Inject components to presentation layer
  const {
    renderChannelHeader = (props) => <GroupChannelHeader {...props} />,
    renderMessageList = (props) => <MessageList {...props} className="sendbird-conversation__message-list" />,
    renderMessageInput = () => <MessageInputWrapper {...props} />,
  } = props;

  return (
    <GroupChannelUIView
      {...props}
      {...context}
      loading={loading}
      isInvalid={channelUrl && !currentChannel}
      channelUrl={channelUrl}
      renderChannelHeader={renderChannelHeader}
      renderMessageList={renderMessageList}
      renderMessageInput={renderMessageInput}
    />
  );
};

export default GroupChannelUI;

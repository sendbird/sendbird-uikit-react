import React from 'react';

import { useChannelContext } from '../../context/ChannelProvider';
import { GroupChannelUIBasicProps, GroupChannelUIView } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';

import ChannelHeader from '../ChannelHeader';
import MessageList from '../MessageList';
import MessageInputWrapper from '../MessageInputWrapper';

export interface ChannelUIProps extends GroupChannelUIBasicProps {
  isLoading?: boolean;
}

const ChannelUI = (props: ChannelUIProps) => {
  const context = useChannelContext();
  const { channelUrl, isInvalid, loading } = context;

  // Inject components to presentation layer
  const {
    renderChannelHeader = (p) => <ChannelHeader {...p} />,
    renderMessageList = (p) => <MessageList {...p} className="sendbird-conversation__message-list" />,
    renderMessageInput = () => <MessageInputWrapper {...props} />,
  } = props;

  return (
    <GroupChannelUIView
      {...props}
      {...context}
      loading={props?.isLoading ?? loading}
      isInvalid={isInvalid}
      channelUrl={channelUrl}
      renderChannelHeader={renderChannelHeader}
      renderMessageList={renderMessageList}
      renderMessageInput={renderMessageInput}
    />
  );
};

export default ChannelUI;

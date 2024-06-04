import React from 'react';
import { SendbirdError, SendbirdErrorCode } from '@sendbird/chat';

import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { GroupChannelUIBasicProps, GroupChannelUIView } from './GroupChannelUIView';

import GroupChannelHeader, { GroupChannelHeaderProps } from '../GroupChannelHeader';
import MessageList, { GroupChannelMessageListProps } from '../MessageList';
import MessageInputWrapper from '../MessageInputWrapper';
import { deleteNullish } from '../../../../utils/utils';

export interface GroupChannelUIProps extends GroupChannelUIBasicProps {
  onChannelFetchFailed?: (error: SendbirdError) => void;
}

export const GroupChannelUI = (props: GroupChannelUIProps) => {
  const context = useGroupChannelContext();
  const { channelUrl, fetchChannelError } = context;

  // Inject components to presentation layer
  const {
    renderChannelHeader = (props: GroupChannelHeaderProps) => <GroupChannelHeader {...props} />,
    renderMessageList = (props: GroupChannelMessageListProps) => <MessageList {...props} className="sendbird-conversation__message-list" />,
    renderMessageInput = () => <MessageInputWrapper {...props} />,
  } = deleteNullish(props);

  React.useEffect(() => {
    if (fetchChannelError && fetchChannelError.code === SendbirdErrorCode.NOT_FOUND_IN_DATABASE) {
      props.onChannelFetchFailed?.(fetchChannelError);
    }
  }, [fetchChannelError]);

  return (
    <GroupChannelUIView
      {...props}
      {...context}
      isInvalid={fetchChannelError !== null}
      channelUrl={channelUrl}
      renderChannelHeader={renderChannelHeader}
      renderMessageList={renderMessageList}
      renderMessageInput={renderMessageInput}
    />
  );
};

export default GroupChannelUI;

import React from 'react';

import { useChannelContext } from '../../context/ChannelProvider';
import { GroupChannelUIBasicProps, GroupChannelUIView } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';

import ChannelHeader from '../ChannelHeader';
import MessageList from '../MessageList';
import MessageInputWrapper from '../MessageInputWrapper';
import { deleteNullish } from '../../../../utils/utils';
import { GroupChannelHeaderProps } from '../../../GroupChannel/components/GroupChannelHeader';
import { GroupChannelMessageListProps } from '../../../GroupChannel/components/MessageList';

export interface ChannelUIProps extends GroupChannelUIBasicProps {
  isLoading?: boolean;
  /**
   * Customizes all child components of the message component.
   * */
  renderMessage?: GroupChannelUIBasicProps['renderMessage'];
}

/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
const ChannelUI = (props: ChannelUIProps) => {
  const context = useChannelContext();
  const { channelUrl, isInvalid } = context;

  // Inject components to presentation layer
  const {
    renderChannelHeader = (p: GroupChannelHeaderProps) => <ChannelHeader {...p} />,
    renderMessageList = (p: GroupChannelMessageListProps) => <MessageList {...p} className="sendbird-conversation__message-list" />,
    renderMessageInput = () => <MessageInputWrapper {...props} />,
  } = deleteNullish(props);

  return (
    <GroupChannelUIView
      {...props}
      {...context}
      isLoading={props?.isLoading}
      isInvalid={isInvalid}
      channelUrl={channelUrl}
      renderChannelHeader={renderChannelHeader}
      renderMessageList={renderMessageList}
      renderMessageInput={renderMessageInput}
    />
  );
};

export default ChannelUI;

import './index.scss';
import React from 'react';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

import TypingIndicator from '../TypingIndicator';
import { TypingIndicatorType } from '../../../../types';
import ConnectionStatus from '../../../../ui/ConnectionStatus';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';

import type { ClientUserMessage, EveryMessage, RenderCustomSeparatorProps, RenderMessageParamsType } from '../../../../types';
import type { GroupChannelHeaderProps } from '../GroupChannelHeader';
import type { GroupChannelMessageListProps } from '../MessageList';
import type { MessageContentProps } from '../../../../ui/MessageContent';
import { SuggestedRepliesProps } from '../SuggestedReplies';
import { deleteNullish } from '../../../../utils/utils';

export interface GroupChannelUIBasicProps {
  // Components
  /**
   * A function that customizes the rendering of a loading placeholder component.
   */
  renderPlaceholderLoader?: () => React.ReactElement;
  /**
   * A function that customizes the rendering of a invalid placeholder component.
   */
  renderPlaceholderInvalid?: () => React.ReactElement;
  /**
   * A function that customizes the rendering of an empty placeholder component when there are no messages in the channel.
   */
  renderPlaceholderEmpty?: () => React.ReactElement;
  /**
   * A function that customizes the rendering of a header component.
   */
  renderChannelHeader?: (props: GroupChannelHeaderProps) => React.ReactElement;
  /**
   * A function that customizes the rendering of a message list component.
   */
  renderMessageList?: (props: GroupChannelMessageListProps) => React.ReactElement;
  /**
   * A function that customizes the rendering of a message input component.
   */
  renderMessageInput?: () => React.ReactElement;

  // Sub components
  //  MessageList
  /**
   * A function that customizes the rendering of each message component in the message list component.
   */
  renderMessage?: (props: RenderMessageParamsType) => React.ReactElement;
  /**
   * A function that customizes the rendering of the content portion of each message component.
   */
  renderMessageContent?: (props: MessageContentProps) => React.ReactElement;
  /**
   * A function that customizes the rendering of the suggested replies of each message component.
   */
  renderSuggestedReplies?: (props: SuggestedRepliesProps) => React.ReactElement;
  /**
   * A function that customizes the rendering of a separator component between messages.
   */
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
  /**
   * A function that customizes the rendering of a frozen notification component when the channel is frozen.
   */
  renderFrozenNotification?: () => React.ReactElement;

  // MessageInput
  /**
   * A function that customizes the rendering of the file upload icon in the message input component.
   */
  renderFileUploadIcon?: () => React.ReactElement;
  /**
   * A function that customizes the rendering of the voice message icon in the message input component.
   */
  renderVoiceMessageIcon?: () => React.ReactElement;
  /**
   * A function that customizes the rendering of the send message icon in the message input component.
   */
  renderSendMessageIcon?: () => React.ReactElement;
  /**
   * A function that customizes the rendering of the typing indicator component.
   */
  renderTypingIndicator?: () => React.ReactElement;

  renderRemoveMessageModal?: (props: { message: EveryMessage; onCancel: () => void; onSubmit: () => void }) => React.ReactElement;

  renderEditInput?: ({ onCancelEdit, message }: { onCancelEdit: VoidFunction; message: ClientUserMessage }) => React.ReactElement;

  renderScrollToBottom?: (props: {
    onScrollToBottom: () => void;
    onScrollToUnread: () => void;
    unreadCount: number;
    lastReadAt: Date;
    shouldDisplayScrollToBottom: boolean;
    shouldDisplayUnreadNotifications: boolean;
  }) => React.ReactElement;
}

export interface GroupChannelUIViewProps extends GroupChannelUIBasicProps {
  isLoading?: boolean;
  isInvalid: boolean;
  channelUrl: string;
  renderChannelHeader: GroupChannelUIBasicProps['renderChannelHeader'];
  renderMessageList: GroupChannelUIBasicProps['renderMessageList'];
  renderMessageInput: GroupChannelUIBasicProps['renderMessageInput'];
}

export const GroupChannelUIView = (props: GroupChannelUIViewProps) => {
  const { isLoading, isInvalid, channelUrl } = props;
  const {
    renderChannelHeader,
    renderMessageList,
    renderMessageInput,
    renderTypingIndicator,
    renderPlaceholderLoader,
    renderPlaceholderInvalid,
  } = deleteNullish(props);

  const { stores, config } = useSendbirdStateContext();
  const sdkError = stores?.sdkStore?.error;
  const { logger, isOnline } = config;

  // Note: This is not a loading status of the message list.
  //  It is just for custom props from the Channel module and is not used in the GroupChannel module. (We should remove this in v4)
  if (isLoading) {
    return <div className="sendbird-conversation">{renderPlaceholderLoader?.() || <PlaceHolder type={PlaceHolderTypes.LOADING} />}</div>;
  }

  if (!channelUrl) {
    return (
      <div className="sendbird-conversation">{renderPlaceholderInvalid?.() || <PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} />}</div>
    );
  }

  if (isInvalid) {
    return <div className="sendbird-conversation">{renderPlaceholderInvalid?.() || <PlaceHolder type={PlaceHolderTypes.WRONG} />}</div>;
  }

  if (sdkError) {
    return (
      <div className="sendbird-conversation">
        {renderPlaceholderInvalid?.() || (
          <PlaceHolder
            type={PlaceHolderTypes.WRONG}
            retryToConnect={() => {
              logger.info('Channel: reconnecting');
              // reconnect();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="sendbird-conversation">
      {renderChannelHeader?.({ className: 'sendbird-conversation__channel-header' })}
      {renderMessageList?.(props)}
      <div className="sendbird-conversation__footer">
        {renderMessageInput?.()}
        <div className="sendbird-conversation__footer__typing-indicator">
          {renderTypingIndicator?.() ||
            (config?.groupChannel?.enableTypingIndicator && config?.groupChannel?.typingIndicatorTypes?.has(TypingIndicatorType.Text) && (
              <TypingIndicator channelUrl={channelUrl} />
            ))}
          {!isOnline && <ConnectionStatus />}
        </div>
      </div>
    </div>
  );
};

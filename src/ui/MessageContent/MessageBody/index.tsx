import React, { ReactElement } from 'react';
import '../index.scss';
import {
  CoreMessageType,
  getUIKitMessageType, getUIKitMessageTypes, isMultipleFilesMessage,
  isOGMessage, isSendableMessage,
  isTextMessage, isThumbnailMessage, isVoiceMessage,
} from '../../../utils';
import { FileMessage, MultipleFilesMessage, UserMessage } from '@sendbird/chat/message';
import OGMessageItemBody from '../../OGMessageItemBody';
import TextMessageItemBody from '../../TextMessageItemBody';
import FileMessageItemBody from '../../FileMessageItemBody';
import MultipleFilesMessageItemBody from '../../MultipleFilesMessageItemBody';
import VoiceMessageItemBody from '../../VoiceMessageItemBody';
import ThumbnailMessageItemBody from '../../ThumbnailMessageItemBody';
import UnknownMessageItemBody from '../../UnknownMessageItemBody';
import { useThreadMessageKindKeySelector } from '../../../modules/Channel/context/hooks/useThreadMessageKindKeySelector';
import { useStatefulFileInfoList } from '../../../modules/Channel/context/hooks/useStatefulFileInfoList';
import { SendBirdStateConfig } from '../../../lib/types';
import { Nullable } from '../../../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { match } from 'ts-pattern';

const MESSAGE_ITEM_BODY_CLASSNAME = 'sendbird-message-content__middle__message-item-body';

export interface MessageBodyProps {
  channel: Nullable<GroupChannel>;
  message: CoreMessageType;
  showFileViewer?: (bool: boolean) => void;
  onMessageHeightChange?: () => void;

  mouseHover: boolean;
  isMobile: boolean;
  config: SendBirdStateConfig;
  isReactionEnabledInChannel: boolean;
  isByMe: boolean;
}

export default function MessageBody(props: MessageBodyProps): ReactElement {
  const {
    message,
    channel,
    showFileViewer,
    onMessageHeightChange,

    mouseHover,
    isMobile,
    config,
    isReactionEnabledInChannel,
    isByMe,
  } = props;

  const threadMessageKindKey = useThreadMessageKindKeySelector({
    isMobile,
  });
  const statefulFileInfoList = useStatefulFileInfoList(message); // For MultipleFilesMessage.

  const messageTypes = getUIKitMessageTypes();
  const isOgMessageEnabledInGroupChannel = channel?.isGroupChannel() && config.groupChannel.enableOgtag;

  return match(message)
    .when((message) => isOgMessageEnabledInGroupChannel
    && isSendableMessage(message)
    && isOGMessage(message), () => (
    <OGMessageItemBody
      className={MESSAGE_ITEM_BODY_CLASSNAME}
      message={message as UserMessage}
      isByMe={isByMe}
      mouseHover={mouseHover}
      isMentionEnabled={config?.isMentionEnabled || false}
      isReactionEnabled={isReactionEnabledInChannel}
      onMessageHeightChange={onMessageHeightChange}
    />
    ))
    .when(isTextMessage, () => (
    <TextMessageItemBody
      className={MESSAGE_ITEM_BODY_CLASSNAME}
      message={message as UserMessage}
      isByMe={isByMe}
      mouseHover={mouseHover}
      isMentionEnabled={config?.isMentionEnabled || false}
      isReactionEnabled={isReactionEnabledInChannel}
    />
    ))
    .when((message) => getUIKitMessageType(message) === messageTypes.FILE, () => (
    <FileMessageItemBody
      className={MESSAGE_ITEM_BODY_CLASSNAME}
      message={message as FileMessage}
      isByMe={isByMe}
      mouseHover={mouseHover}
      isReactionEnabled={isReactionEnabledInChannel}
    />
    ))
    .when(isMultipleFilesMessage, () => (
    <MultipleFilesMessageItemBody
      className={MESSAGE_ITEM_BODY_CLASSNAME}
      message={message as MultipleFilesMessage}
      isByMe={isByMe}
      mouseHover={mouseHover}
      isReactionEnabled={isReactionEnabledInChannel}
      threadMessageKindKey={threadMessageKindKey}
      statefulFileInfoList={statefulFileInfoList}
    />
    ))
    .when(isVoiceMessage, () => (
    <VoiceMessageItemBody
      className={MESSAGE_ITEM_BODY_CLASSNAME}
      message={message as FileMessage}
      channelUrl={channel?.url ?? ''}
      isByMe={isByMe}
      isReactionEnabled={isReactionEnabledInChannel}
    />
    ))
    .when(isThumbnailMessage, () => (
    <ThumbnailMessageItemBody
      className={MESSAGE_ITEM_BODY_CLASSNAME}
      message={message as FileMessage}
      isByMe={isByMe}
      mouseHover={mouseHover}
      isReactionEnabled={isReactionEnabledInChannel}
      showFileViewer={showFileViewer}
      style={isMobile ? { width: '100%' } : {}}
    />
    ))
    .otherwise((message) => (
      <UnknownMessageItemBody
        className={MESSAGE_ITEM_BODY_CLASSNAME}
        message={message}
        isByMe={isByMe}
        mouseHover={mouseHover}
        isReactionEnabled={isReactionEnabledInChannel}
      />
    ));
}

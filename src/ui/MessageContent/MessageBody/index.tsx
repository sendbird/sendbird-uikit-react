import React, { ReactElement } from 'react';
import '../index.scss';
import {
  CoreMessageType,
  getUIKitMessageType, getUIKitMessageTypes, isTemplateMessage, isMultipleFilesMessage,
  isOGMessage, isSendableMessage,
  isTextMessage, isThumbnailMessage, isVoiceMessage,
} from '../../../utils';
import { BaseMessage, FileMessage, MultipleFilesMessage, UserMessage } from '@sendbird/chat/message';
import OGMessageItemBody from '../../OGMessageItemBody';
import TextMessageItemBody from '../../TextMessageItemBody';
import FileMessageItemBody from '../../FileMessageItemBody';
import MultipleFilesMessageItemBody from '../../MultipleFilesMessageItemBody';
import VoiceMessageItemBody from '../../VoiceMessageItemBody';
import ThumbnailMessageItemBody from '../../ThumbnailMessageItemBody';
import UnknownMessageItemBody from '../../UnknownMessageItemBody';
import { useThreadMessageKindKeySelector } from '../../../modules/Channel/context/hooks/useThreadMessageKindKeySelector';
import { useFileInfoListWithUploaded } from '../../../modules/Channel/context/hooks/useFileInfoListWithUploaded';
import { SendBirdStateConfig } from '../../../lib/types';
import { Nullable, SendbirdTheme } from '../../../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { match } from 'ts-pattern';
import TemplateMessageItemBody from '../../TemplateMessageItemBody';
import type { OnBeforeDownloadFileMessageType } from '../../../modules/GroupChannel/context/GroupChannelProvider';

const MESSAGE_ITEM_BODY_CLASSNAME = 'sendbird-message-content__middle__message-item-body';
export type RenderedTemplateBodyType = 'failed' | 'composite' | 'simple';

export interface MessageBodyProps {
  channel: Nullable<GroupChannel>;
  message: CoreMessageType;
  showFileViewer?: (bool: boolean) => void;
  onTemplateMessageRenderedCallback?: (renderedTemplateBodyType: RenderedTemplateBodyType) => void;
  onMessageHeightChange?: () => void;
  onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;

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
    onTemplateMessageRenderedCallback,
    onBeforeDownloadFileMessage,

    mouseHover,
    isMobile,
    config,
    isReactionEnabledInChannel,
    isByMe,
  } = props;

  const threadMessageKindKey = useThreadMessageKindKeySelector({
    isMobile,
  });
  const statefulFileInfoList = useFileInfoListWithUploaded(message); // For MultipleFilesMessage.

  const messageTypes = getUIKitMessageTypes();
  const isOgMessageEnabledInGroupChannel = channel?.isGroupChannel() && config.groupChannel.enableOgtag;

  return match(message)
    .when(isTemplateMessage, () => (
      <TemplateMessageItemBody
        className={MESSAGE_ITEM_BODY_CLASSNAME}
        message={message as BaseMessage}
        isByMe={isByMe}
        theme={config?.theme as SendbirdTheme}
        onTemplateMessageRenderedCallback={onTemplateMessageRenderedCallback}
      />
    ))
    .when((message) => isOgMessageEnabledInGroupChannel
      && isSendableMessage(message)
      && isOGMessage(message), () => (
      <OGMessageItemBody
        className={MESSAGE_ITEM_BODY_CLASSNAME}
        message={message as UserMessage}
        isByMe={isByMe}
        mouseHover={mouseHover}
        isMentionEnabled={config.groupChannel.enableMention ?? false}
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
        isMentionEnabled={config.groupChannel.enableMention ?? false}
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
        onBeforeDownloadFileMessage={onBeforeDownloadFileMessage}
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
        onBeforeDownloadFileMessage={onBeforeDownloadFileMessage}
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

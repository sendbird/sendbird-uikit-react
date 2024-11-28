import React from 'react';
import '../index.scss';
import {
  CoreMessageType,
  getUIKitMessageType, getUIKitMessageTypes, isTemplateMessage, isMultipleFilesMessage,
  isOGMessage, isSendableMessage,
  isTextMessage, isThumbnailMessage, isVoiceMessage, isFormMessage, isValidTemplateMessageType,
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
import type { SendbirdStateConfig } from '../../../lib/Sendbird/types';
import { Nullable, SendbirdTheme } from '../../../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { match } from 'ts-pattern';
import TemplateMessageItemBody from '../../TemplateMessageItemBody';
import type { OnBeforeDownloadFileMessageType } from '../../../modules/GroupChannel/context/GroupChannelProvider';
import FormMessageItemBody from '../../FormMessageItemBody';
import { MESSAGE_TEMPLATE_KEY } from '../../../utils/consts';

export type CustomSubcomponentsProps = Record<
  'ThumbnailMessageItemBody' | 'MultipleFilesMessageItemBody',
  Record<string, any>
>;

const MESSAGE_ITEM_BODY_CLASSNAME = 'sendbird-message-content__middle__message-item-body';

export interface MessageBodyProps {
  className?: string;
  channel: Nullable<GroupChannel>;
  message: CoreMessageType;
  showFileViewer?: (bool: boolean) => void;
  onMessageHeightChange?: () => void;
  onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;

  mouseHover: boolean;
  isMobile: boolean;
  config: SendbirdStateConfig;
  isReactionEnabledInChannel: boolean;
  isByMe: boolean;
}

export const MessageBody = (props: MessageBodyProps) => {
  const {
    className = MESSAGE_ITEM_BODY_CLASSNAME,
    message,
    channel,
    showFileViewer,
    onMessageHeightChange,
    onBeforeDownloadFileMessage,

    mouseHover,
    isMobile,
    config,
    isReactionEnabledInChannel,
    isByMe,
  } = props;
  // Private props for internal customization.
  const customSubcomponentsProps: CustomSubcomponentsProps = props['customSubcomponentsProps'] ?? {};

  const threadMessageKindKey = useThreadMessageKindKeySelector({
    isMobile,
  });
  const statefulFileInfoList = useFileInfoListWithUploaded(message); // For MultipleFilesMessage.

  const messageTypes = getUIKitMessageTypes();
  const isOgMessageEnabledInGroupChannel = channel?.isGroupChannel() && config.groupChannel.enableOgtag;
  const isFormMessageEnabledInGroupChannel = channel?.isGroupChannel() && config.groupChannel.enableFormTypeMessage;

  const renderUnknownMessageItemBody = () => <UnknownMessageItemBody
    className={className}
    message={message}
    isByMe={isByMe}
    mouseHover={mouseHover}
    isReactionEnabled={isReactionEnabledInChannel}
  />;

  return match(message)
    .when((message) => isFormMessageEnabledInGroupChannel && isFormMessage(message),
      () => (
        <FormMessageItemBody
          isByMe={isByMe}
          message={message}
          form={message.messageForm}
          logger={config.logger}
        />
      ))
    .when(isTemplateMessage, () => {
      const templatePayload = message.extendedMessagePayload[MESSAGE_TEMPLATE_KEY];
      if (!isValidTemplateMessageType(templatePayload)) {
        config.logger?.error?.(
          'TemplateMessageItemBody: invalid type value in message.extendedMessagePayload.message_template.',
          templatePayload,
        );
        return renderUnknownMessageItemBody();
      }
      return <TemplateMessageItemBody
        className={className}
        message={message as BaseMessage}
        isByMe={isByMe}
        theme={config?.theme as SendbirdTheme}
      />;
    })
    .when((message) => isOgMessageEnabledInGroupChannel
      && isSendableMessage(message)
      && isOGMessage(message), () => (
        <OGMessageItemBody
          className={className}
          message={message as UserMessage}
          isByMe={isByMe}
          mouseHover={mouseHover}
          isMentionEnabled={config.groupChannel.enableMention ?? false}
          isReactionEnabled={isReactionEnabledInChannel}
          onMessageHeightChange={onMessageHeightChange}
          isMarkdownEnabled={config.groupChannel.enableMarkdownForUserMessage}
        />
    ))
    .when(isTextMessage, () => (
      <TextMessageItemBody
        className={className}
        message={message as UserMessage}
        isByMe={isByMe}
        mouseHover={mouseHover}
        isMentionEnabled={config.groupChannel.enableMention ?? false}
        isReactionEnabled={isReactionEnabledInChannel}
        isMarkdownEnabled={config.groupChannel.enableMarkdownForUserMessage}
      />
    ))
    .when((message) => getUIKitMessageType(message) === messageTypes.FILE, () => (
      <FileMessageItemBody
        className={className}
        message={message as FileMessage}
        isByMe={isByMe}
        mouseHover={mouseHover}
        isReactionEnabled={isReactionEnabledInChannel}
        onBeforeDownloadFileMessage={onBeforeDownloadFileMessage}
      />
    ))
    .when(isMultipleFilesMessage, () => (
      <MultipleFilesMessageItemBody
        className={className}
        message={message as MultipleFilesMessage}
        isByMe={isByMe}
        mouseHover={mouseHover}
        isReactionEnabled={isReactionEnabledInChannel}
        threadMessageKindKey={threadMessageKindKey}
        statefulFileInfoList={statefulFileInfoList}
        onBeforeDownloadFileMessage={onBeforeDownloadFileMessage}
        {...customSubcomponentsProps['MultipleFilesMessageItemBody'] ?? {}}
      />
    ))
    .when(isVoiceMessage, () => (
      <VoiceMessageItemBody
        className={className}
        message={message as FileMessage}
        channelUrl={channel?.url ?? ''}
        isByMe={isByMe}
        isReactionEnabled={isReactionEnabledInChannel}
      />
    ))
    .when(isThumbnailMessage, () => (
      <ThumbnailMessageItemBody
        className={className}
        message={message as FileMessage}
        isByMe={isByMe}
        mouseHover={mouseHover}
        isReactionEnabled={isReactionEnabledInChannel}
        showFileViewer={showFileViewer}
        style={isMobile ? { width: '100%' } : {}}
        {...customSubcomponentsProps['ThumbnailMessageItemBody'] ?? {}}
      />
    ))
    .otherwise(() => {
      return renderUnknownMessageItemBody();
    });
};

export default MessageBody;

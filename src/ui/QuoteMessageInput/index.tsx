import './index.scss';

import React, { ReactElement, useContext } from 'react';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';
import {
  getClassName,
  getUIKitMessageType,
  isFileMessage,
  isGifMessage,
  isImageMessage,
  isUserMessage,
  isVideoMessage,
  isVoiceMessage, SendableMessageType,
  UIKitMessageTypes,
} from '../../utils';

import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { LocalizationContext } from '../../lib/LocalizationContext';

import QuoteMessageThumbnail from './QuoteMessageThumbnail';

interface Props {
  className?: string | Array<string>;
  replyingMessage: SendableMessageType;
  onClose?: (message: SendableMessageType) => void;
}

export default function QuoteMessageInput({
  className,
  replyingMessage,
  onClose,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const fileMessage = replyingMessage as FileMessage;
  const sender = (replyingMessage as SendableMessageType)?.sender;
  const displayFileIcon = isFileMessage(replyingMessage) && !isVoiceMessage(replyingMessage as FileMessage);

  return (
    <div className={getClassName(['sendbird-quote_message_input', className])}>
      {
        displayFileIcon && (
          <QuoteMessageThumbnail message={fileMessage} />
        )
      }
      <div
        className="sendbird-quote_message_input__body"
        style={{
          width: `calc(100% - ${displayFileIcon ? '164px' : '120px'})`,
          left: displayFileIcon ? '92px' : '40px',
        }}
      >
        <Label
          className="sendbird-quote_message_input__body__sender-name"
          type={LabelTypography.CAPTION_1}
          color={LabelColors.ONBACKGROUND_1}
        >
          {`${stringSet.QUOTE_MESSAGE_INPUT__REPLY_TO} ${(sender && sender.nickname) ? sender.nickname : stringSet.NO_NAME}`}
        </Label>
        <Label
          className="sendbird-quote_message_input__body__message-content"
          type={LabelTypography.BODY_2}
          color={LabelColors.ONBACKGROUND_3}
        >
          {isImageMessage(fileMessage) && !isGifMessage(fileMessage) && stringSet.QUOTE_MESSAGE_INPUT__FILE_TYPE_IMAGE}
          {isVideoMessage(fileMessage) && stringSet.QUOTE_MESSAGE_INPUT__FILE_TYPE__VIDEO}
          {isGifMessage(fileMessage) && stringSet.QUOTE_MESSAGE_INPUT__FILE_TYPE_GIF}
          {isUserMessage(replyingMessage as UserMessage) && (replyingMessage as UserMessage).message}
          {getUIKitMessageType(replyingMessage) === UIKitMessageTypes.FILE && fileMessage.name}
          {isVoiceMessage(replyingMessage as FileMessage) && stringSet.VOICE_MESSAGE}
        </Label>
      </div>
      <Icon
        className="sendbird-quote_message_input__close-button"
        type={IconTypes.CLOSE}
        fillColor={IconColors.ON_BACKGROUND_2}
        width="24px"
        height="24px"
        onClick={() => onClose(replyingMessage)}
      />
    </div>
  );
}

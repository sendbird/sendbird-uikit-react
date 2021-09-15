import React, { ReactElement, useContext } from 'react';
import { FileMessage, UserMessage } from 'sendbird';
import {
  CoreMessageType,
  getClassName,
  isFileMessage,
  isGifMessage,
  isImageMessage,
  isThumbnailMessage,
  isUserMessage,
  isVideoMessage,
} from '../../utils';

import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { LocalizationContext } from '../../lib/LocalizationContext';

import ReplyingMessageThumbnail from './ReplyingMessageThumbnail';
import './index.scss';

interface Props {
  className: string | Array<string>;
  replyingMessage: CoreMessageType;
  onClose?: (message: CoreMessageType) => void;
}

export default function ReplyingMessageAttachment({
  className,
  replyingMessage,
  onClose,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const fileMessage = replyingMessage as FileMessage;
  const sender = (replyingMessage as UserMessage | FileMessage)?.sender;

  return (
    <div className={getClassName(['sendbird-replying_message_attachment', className])}>
      <ReplyingMessageThumbnail message={fileMessage} />
      <div className="sendbird-replying_message_attachment__body">
        <Label
          className="sendbird-replying_message_attachment__body__sender-name"
          type={LabelTypography.CAPTION_1}
          color={LabelColors.ONBACKGROUND_1}
        >
          {`${stringSet.REPLYING_ATTACHMENT__REPLY_TO} ${(sender && sender.nickname) ? sender.nickname : stringSet.NO_NAME}`}
        </Label>
        <Label
          className="sendbird-replying_message_attachment__body__message-content"
          type={LabelTypography.BODY_2}
          color={LabelColors.ONBACKGROUND_3}
        >
          {isImageMessage(fileMessage) && !isGifMessage(fileMessage) && stringSet.REPLYING_ATTACHMENT__FILE_TYPE__IMAGE}
          {isVideoMessage(fileMessage) && stringSet.REPLYING_ATTACHMENT__FILE_TYPE__VIDEO}
          {isGifMessage(fileMessage) && stringSet.REPLYING_ATTACHMENT__FILE_TYPE__GIF}
          {isUserMessage(replyingMessage as UserMessage) && (replyingMessage as UserMessage).message}
          {(isFileMessage(fileMessage) && !isThumbnailMessage(fileMessage)) && fileMessage.name}
        </Label>
      </div>
      <Icon
        className="sendbird-replying_message_attachment__close-button"
        type={IconTypes.CLOSE}
        fillColor={IconColors.ON_BACKGROUND_2}
        width="24px"
        height="24px"
        onClick={() => onClose(replyingMessage)}
      />
    </div>
  );
}

import React, { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import Icon, { IconTypes, IconColors } from '../Icon';
import ImageRenderer from '../ImageRenderer';
import {
  isAudioMessage,
  isFileMessage, isImageFileInfo,
  isImageMessage,
  isMultipleFilesMessage,
  isThumbnailMessage,
  isVideoMessage,
  isVoiceMessage,
} from '../../utils';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { getMessageFirstFileType, getMessageFirstFileUrl, getMessageFirstFileThumbnailUrl } from '../QuoteMessage/utils';
import { match } from 'ts-pattern';

interface Props {
  message: FileMessage | MultipleFilesMessage;
}

const componentClassname = 'sendbird-quote_message_input__avatar';

export default function QuoteMessageThumbnail({ message }: Props): ReactElement {
  if (!isFileMessage(message) && !isMultipleFilesMessage(message) || isVoiceMessage(message as FileMessage)) {
    return null;
  }
  const thumbnailUrl: string = match(message)
    .when(isFileMessage, () => {
      return getMessageFirstFileThumbnailUrl(message)
        || (
          (
            isImageMessage(message as FileMessage)
            || isVideoMessage(message as FileMessage)
          )
          && getMessageFirstFileUrl(message)
        );
    })
    .when(isMultipleFilesMessage, () => {
      const castedMessage: MultipleFilesMessage = message as MultipleFilesMessage;
      return getMessageFirstFileThumbnailUrl(castedMessage)
        || (
          castedMessage.fileInfoList.length > 0
          && isImageFileInfo((message as MultipleFilesMessage).fileInfoList[0])
          && getMessageFirstFileUrl(message)
        );
    })
    .otherwise(() => {
      return getMessageFirstFileThumbnailUrl(message);
    });
  if (!isVideoMessage(message) && (isThumbnailMessage(message) || isMultipleFilesMessage(message)) && thumbnailUrl) {
    return (
      <ImageRenderer
        className={componentClassname}
        url={thumbnailUrl}
        alt={getMessageFirstFileType(message)}
        width="44px"
        height="44px"
        fixedSize
      />
    );
  } else if (isVideoMessage(message as FileMessage) && thumbnailUrl) {
    return (
      <div className={componentClassname}>
        <video
          style={{
            width: '44px',
            height: '44px',
          }}
          src={thumbnailUrl}
        />
      </div>
    );
  } else if (isAudioMessage(message as FileMessage)) {
    return (
      <div className={componentClassname}>
        <Icon
          type={IconTypes.FILE_AUDIO}
          fillColor={IconColors.ON_BACKGROUND_2}
          width="24px"
          height="24px"
        />
      </div>
    );
  } else {
    return (
      <div className={componentClassname}>
        <Icon
          type={IconTypes.FILE_DOCUMENT}
          fillColor={IconColors.ON_BACKGROUND_2}
          width="24px"
          height="24px"
        />
      </div>
    );
  }
}

import React, { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import Icon, { IconTypes, IconColors } from '../Icon';
import ImageRenderer from '../ImageRenderer';
import {
  isAudioMessage,
  isFileMessage,
  isImageFileInfo,
  isImageMessage,
  isMultipleFilesMessage,
  isThumbnailMessage,
  isVideoMessage,
  isVoiceMessage,
} from '../../utils';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { getMessageFirstFileType, getMessageFirstFileUrl, getMessageFirstFileThumbnailUrl } from '../QuoteMessage/utils';

interface Props {
  message: FileMessage | MultipleFilesMessage;
}

const componentClassname = 'sendbird-quote_message_input__avatar';

export default function QuoteMessageThumbnail({ message }: Props): ReactElement {
  if (!isFileMessage(message) && !isMultipleFilesMessage(message) || isVoiceMessage(message as FileMessage)) {
    return <></>;
  }
  let thumbnailUrl = getMessageFirstFileThumbnailUrl(message);
  if (!thumbnailUrl) {
    if (isImageMessage(message) || isVideoMessage(message)) {
      thumbnailUrl = getMessageFirstFileUrl(message);
    } else if (isMultipleFilesMessage(message) && isImageFileInfo(message.fileInfoList?.[0])) {
      thumbnailUrl = message.fileInfoList[0].url;
    }
  }

  if (isVideoMessage(message) && thumbnailUrl) {
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
  } else if ((isThumbnailMessage(message) || isMultipleFilesMessage(message)) && thumbnailUrl) {
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
  } else if (isAudioMessage(message)) {
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

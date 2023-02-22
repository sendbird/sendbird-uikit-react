import React, { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import Icon, { IconTypes, IconColors } from '../Icon';
import ImageRenderer from '../ImageRenderer';
import { isAudioMessage, isFileMessage, isImageMessage, isThumbnailMessage, isVoiceMessage } from '../../utils';

interface Props {
  message: FileMessage;
}

const componentClassname = 'sendbird-quote_message_input__avatar';

export default function QuoteMessageThumbnail({ message }: Props): ReactElement {
  if (!isFileMessage(message) || isVoiceMessage(message)) {
    return null;
  }

  const thumbnailUrl: string = (message.thumbnails && message.thumbnails.length > 0 && message.thumbnails[0].url)
    || (isImageMessage(message) && message.url);
  if (isThumbnailMessage(message) && thumbnailUrl) {
    return (
      <ImageRenderer
        className={componentClassname}
        url={thumbnailUrl}
        alt={message.type}
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

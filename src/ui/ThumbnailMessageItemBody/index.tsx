import './index.scss';
import React, { ReactElement, useState } from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import Icon, { IconTypes, IconColors } from '../Icon';
import ImageRenderer from '../ImageRenderer';
import { getClassName, isGifMessage, isSentMessage, isVideoMessage } from '../../utils';

interface Props {
  className?: string | Array<string>;
  message: FileMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isReactionEnabled?: boolean;
  showFileViewer?: (bool: boolean) => void;
}

export default function ThumbnailMessageItemBody({
  className,
  message,
  isByMe = false,
  mouseHover = false,
  isReactionEnabled = false,
  showFileViewer,
}: Props): ReactElement {
  const { thumbnails = [] } = message;
  const thumbnailUrl: string = thumbnails.length > 0 ? thumbnails[0]?.url : '';
  const [imageRendered, setImageRendered] = useState(false);
  return (
    <div
      className={getClassName([
        className,
        'sendbird-thumbnail-message-item-body',
        isByMe ? 'outgoing' : 'incoming',
        mouseHover ? 'mouse-hover' : '',
        (isReactionEnabled && message?.reactions?.length > 0) ? 'reactions' : '',
      ])}
      onClick={() => {
        if (isSentMessage(message)) {
          showFileViewer(true);
        }
      }}
    >
      <ImageRenderer
        className="sendbird-thumbnail-message-item-body__thumbnail"
        url={thumbnailUrl || message?.url}
        alt={message?.type}
        width="360px"
        height="270px"
        onLoad={() => { setImageRendered(true) }}
        placeHolder={(style) => (
          <div
            className="sendbird-thumbnail-message-item-body__placeholder"
            style={style}
          >
            <div className="sendbird-thumbnail-message-item-body__placeholder__icon">
              <Icon
                type={isVideoMessage(message) ? IconTypes.PLAY : IconTypes.PHOTO}
                fillColor={IconColors.ON_BACKGROUND_2}
                width="34px"
                height="34px"
              />
            </div>
          </div>
        )}
      />
      {
        (isVideoMessage(message) && !thumbnailUrl) && !imageRendered && (
          <video className="sendbird-thumbnail-message-item-body__video">
            <source src={message?.url} type={message?.type} />
          </video>
        )
      }
      <div className="sendbird-thumbnail-message-item-body__image-cover" />
      {
        (isVideoMessage(message) || isGifMessage(message)) && (
          <div className="sendbird-thumbnail-message-item-body__icon-wrapper">
            <div className="sendbird-thumbnail-message-item-body__icon-wrapper__icon">
              <Icon
                type={isVideoMessage(message) ? IconTypes.PLAY : IconTypes.GIF}
                fillColor={IconColors.GRAY}
                width="34px"
                height="34px"
              />
            </div>
          </div>
        )
      }
    </div>
  );
}

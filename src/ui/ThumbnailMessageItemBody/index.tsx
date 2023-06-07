import './index.scss';
import React, { ReactElement, useState } from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import Icon, { IconTypes, IconColors } from '../Icon';
import ImageRenderer from '../ImageRenderer';
import { getClassName, isGifMessage, isSentMessage, isVideoMessage } from '../../utils';
import { noop } from '../../utils/utils';
import useLongPress from '../../hooks/useLongPress';

interface Props {
  className?: string | Array<string>;
  message: FileMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isReactionEnabled?: boolean;
  showFileViewer?: (bool: boolean) => void;
  style?: Record<string, any>;
}

export default function ThumbnailMessageItemBody({
  className = '',
  message,
  isByMe = false,
  mouseHover = false,
  isReactionEnabled = false,
  showFileViewer = noop,
  style = {},
}: Props): ReactElement {
  const { thumbnails = [] } = message;
  const thumbnailUrl: string = thumbnails.length > 0 ? thumbnails[0]?.url : '';
  const [imageRendered, setImageRendered] = useState(false);

  const onClickHandler = useLongPress({
    onLongPress: noop,
    onClick: () => {
      if (isSentMessage(message)) {
        showFileViewer?.(true);
      }
    },
  });

  return (
    <div
      className={getClassName([
        className,
        'sendbird-thumbnail-message-item-body',
        isByMe ? 'outgoing' : 'incoming',
        mouseHover ? 'mouse-hover' : '',
        (isReactionEnabled && (message.reactions?.length ?? 0) > 0) ? 'reactions' : '',
      ])}
      {...onClickHandler}
    >
      <ImageRenderer
        className="sendbird-thumbnail-message-item-body__thumbnail"
        url={thumbnailUrl || message?.url}
        alt={message?.type}
        width={style?.width || '360px'}
        height={style?.height || '270px'}
        onLoad={() => { setImageRendered(true); }}
        placeHolder={(style_: Record<string, any>) => (
          <div
            className="sendbird-thumbnail-message-item-body__placeholder"
            style={style_}
          />
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

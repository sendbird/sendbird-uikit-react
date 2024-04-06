import './index.scss';
import React, { ReactElement, useState } from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import Icon, { IconTypes, IconColors } from '../Icon';
import ImageRenderer from '../ImageRenderer';
import { getClassName, isGifMessage, isSentMessage, isVideoMessage } from '../../utils';
import { noop } from '../../utils/utils';
import useLongPress from '../../hooks/useLongPress';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { getMessageFirstFileType, getMessageFirstFileUrl, getMessageFirstFileThumbnailUrl } from '../QuoteMessage/utils';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

interface Props {
  className?: string | Array<string>;
  message: FileMessage | MultipleFilesMessage;
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
  const thumbnailUrl: string = getMessageFirstFileThumbnailUrl(message);
  const [imageRendered, setImageRendered] = useState(false);

  const onClickHandler = useLongPress({
    onLongPress: noop,
    onClick: () => {
      if (isSentMessage(message)) {
        showFileViewer?.(true);
      }
    },
  });

  const globalStore = useSendbirdStateContext();
  const { eventHandlers } = globalStore;

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
        url={thumbnailUrl || getMessageFirstFileUrl(message)}
        alt={getMessageFirstFileType(message)}
        width={style?.width || '360px'}
        height={style?.height || '270px'}
        onLoad={() => { setImageRendered(true); }}
        onError={() => { 
          eventHandlers?.request?.onFailed?.(new Error(`Image load failed - ${thumbnailUrl || getMessageFirstFileUrl(message)}`));
        }}
        placeHolder={({ style }) => (
          <div
            className="sendbird-thumbnail-message-item-body__placeholder"
            style={style}
          />
        )}
      />
      {
        (isVideoMessage(message) && !thumbnailUrl) && !imageRendered && (
          <video className="sendbird-thumbnail-message-item-body__video">
            <source src={getMessageFirstFileUrl(message)} type={getMessageFirstFileType(message)} />
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
                fillColor={IconColors.THUMBNAIL_ICON}
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

import './index.scss';
import React, { ReactElement, useContext, useState } from 'react';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';

import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import ImageRenderer from '../ImageRenderer';
import { LocalizationContext } from '../../lib/LocalizationContext';
import {
  getClassName,
  getUIKitFileType,
  getUIKitFileTypes,
  isFileMessage,
  isGif,
  isSupportedFileView,
  isThumbnailMessage,
  isUserMessage,
  isVideo,
  truncateString,
} from '../../utils';
interface Props {
  className?: string | Array<string>;
  message?: UserMessage | FileMessage;
  userId?: string;
  isByMe?: boolean;
  isUnavailable?: boolean;
  onClick?: () => void;
}

export default function QuoteMessage({
  message,
  userId = '',
  isByMe = false,
  className,
  isUnavailable = false,
  onClick,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);

  const { parentMessage } = message;
  const parentMessageSender = (parentMessage as UserMessage | FileMessage)?.sender;
  const parentMessageSenderNickname = (userId === parentMessageSender?.userId) ? stringSet.QUOTED_MESSAGE__CURRENT_USER : parentMessageSender?.nickname;
  const parentMessageUrl = (parentMessage as FileMessage)?.url || '';
  const parentMessageType = (parentMessage as FileMessage)?.type;
  const currentMessageSenderNickname = (userId === message?.sender?.userId) ? stringSet.QUOTED_MESSAGE__CURRENT_USER : message?.sender?.nickname;

  const [isThumbnailLoaded, setThumbnailLoaded] = useState(false);
  const uikitFileTypes = getUIKitFileTypes();
  const splitFileName = (parentMessage as FileMessage)?.name ? (parentMessage as FileMessage).name.split('/') : parentMessageUrl.split('/');

  return (
    <div
      className={getClassName([className, 'sendbird-quote-message', isByMe ? 'outgoing' : 'incoming', isUnavailable ? 'unavailable' : ''])}
      key={parentMessage?.messageId}
      onClick={() => {
        if (!isUnavailable && onClick) {
          onClick();
        }
      }}
      onTouchEnd={() => {
        if (!isUnavailable && onClick) {
          onClick();
        }
      }}
    >
      <div className="sendbird-quote-message__replied-to">
        <Icon
          className="sendbird-quote-message__replied-to__icon"
          type={IconTypes.REPLY}
          fillColor={IconColors.ON_BACKGROUND_3}
          width="12px"
          height="12px"
        />
        <Label
          className="sendbird-quote-message__replied-to__text"
          type={LabelTypography.CAPTION_2}
          color={LabelColors.ONBACKGROUND_3}
        >
          <span className="sendbird-quote-message__replied-to__text__nickname">{currentMessageSenderNickname}</span>
          <span className="sendbird-quote-message__replied-to__text__text">{stringSet.QUOTED_MESSAGE__REPLIED_TO}</span>
          <span className="sendbird-quote-message__replied-to__text__nickname">{parentMessageSenderNickname}</span>
        </Label>
      </div>
      <div className="sendbird-quote-message__replied-message">
        {isUnavailable && (
          <div className="sendbird-quote-message__replied-message__text-message">
            <Label
              className="sendbird-quote-message__replied-message__text-message__word"
              type={LabelTypography.BODY_2}
              color={LabelColors.ONBACKGROUND_1}
            >
              {stringSet.QUOTED_MESSAGE__UNAVAILABLE}
            </Label>
          </div>
        )}
        {/* text message */}
        {((isUserMessage(parentMessage as UserMessage) && (parentMessage as UserMessage)?.message?.length > 0) && !isUnavailable) && (
          <div className="sendbird-quote-message__replied-message__text-message">
            <Label
              className="sendbird-quote-message__replied-message__text-message__word"
              type={LabelTypography.BODY_2}
              color={LabelColors.ONBACKGROUND_1}
            >
              {(parentMessage as UserMessage)?.message}
            </Label>
          </div>
        )}
        {/* thumbnail message */}
        {(isThumbnailMessage(parentMessage as FileMessage) && parentMessageUrl && !isUnavailable) && (
          <div className="sendbird-quote-message__replied-message__thumbnail-message">
            <ImageRenderer
              className="sendbird-quote-message__replied-message__thumbnail-message__image"
              url={parentMessageUrl}
              alt={parentMessageType}
              width="144px"
              height="108px"
              onLoad={() => setThumbnailLoaded(true)}
              defaultComponent={(
                <div className="sendbird-quote-message__replied-message__thumbnail-message__placeholder">
                  <div className="sendbird-quote-message__replied-message__thumbnail-message__placeholder__icon">
                    <Icon
                      type={isVideo(parentMessageType) ? IconTypes.PLAY : IconTypes.PHOTO}
                      fillColor={IconColors.ON_BACKGROUND_2}
                      width="22px"
                      height="22px"
                    />
                  </div>
                </div>
              )}
            />
            {(isVideo(parentMessageType) && !((parentMessage as FileMessage)?.thumbnails?.length > 0)) && (
              <>
                <video className="sendbird-quote-message__replied-message__thumbnail-message__video">
                  <source src={parentMessageUrl} type={parentMessageType} />
                </video>
                <div className="sendbird-quote-message__replied-message__thumbnail-message__cover">
                  <div className="sendbird-quote-message__replied-message__thumbnail-message__cover__icon">
                    <Icon
                      type={IconTypes.PLAY}
                      fillColor={IconColors.GRAY}
                      width="14px"
                      height="14px"
                    />
                  </div>
                </div>
              </>
            )}
            {(isThumbnailLoaded && isGif(parentMessageType)) && (
              <div className="sendbird-quote-message__replied-message__thumbnail-message__cover">
                <div className="sendbird-quote-message__replied-message__thumbnail-message__cover__icon">
                  <Icon
                    type={IconTypes.GIF}
                    fillColor={IconColors.GRAY}
                    width="14px"
                    height="14px"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {/* file message */}
        {(isFileMessage(parentMessage as FileMessage) && !isSupportedFileView((parentMessage as FileMessage).type) && parentMessageUrl && !isUnavailable) && (
          <div className="sendbird-quote-message__replied-message__file-message">
            <Icon
              className="sendbird-quote-message__replied-message__file-message__type-icon"
              type={{
                [uikitFileTypes.IMAGE]: IconTypes.PHOTO,
                [uikitFileTypes.VIDEO]: IconTypes.PLAY,
                [uikitFileTypes.AUDIO]: IconTypes.FILE_AUDIO,
                [uikitFileTypes.GIF]: IconTypes.GIF,
                [uikitFileTypes.OTHERS]: IconTypes.FILE_DOCUMENT,
              }[getUIKitFileType(parentMessageType)]}
              fillColor={IconColors.ON_BACKGROUND_3}
              width="16px"
              height="16px"
            />
            <Label
              className="sendbird-quote-message__replied-message__file-message__file-name"
              type={LabelTypography.BODY_2}
              color={LabelColors.ONBACKGROUND_3}
            >
              {truncateString(splitFileName[splitFileName.length - 1])}
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}

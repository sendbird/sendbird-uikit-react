import React, { ReactElement, useContext } from 'react';
// import { FileMessage, User, UserMessage } from 'sendbird';
import { FileMessage, UserMessage } from '../../sendbird.min.js';
import './index.scss';

import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import ImageRenderer from '../ImageRenderer';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { getClassName, getUIKitFileType, getUIKitFileTypes, isFileMessage, isSupportedFileView, isThumbnailMessage, isUserMessage, isVideo, truncateString } from '../../utils';
interface Props {
  message?: UserMessage | FileMessage;
  isByMe?: boolean;
  className?: string | Array<string>;
}

export default function QuoteMessage({
  message,
  isByMe = false,
  className,
}: Props): ReactElement {
  const { parentMessage } = message;
  const parentMessageSender = parentMessage?.sender;
  const parentMessageSenderNickname = parentMessageSender?.nickname;
  const parentMessageUrl = parentMessage?.url || '';
  const parentMessageType = parentMessage?.messageType;
  const currentMessageSenderNickname = message?.sender?.nickname;

  const { stringSet } = useContext(LocalizationContext);
  const uikitFileTypes = getUIKitFileTypes();
  const splitUrl = parentMessageUrl.split('/');

  return (
    <div className={getClassName([className, 'sendbird-quote-message', isByMe ? 'outgoing' : 'incoming'])}>
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
          {`${currentMessageSenderNickname} ${stringSet.REPLIED_TO} ${parentMessageSenderNickname}`}
        </Label>
      </div>
      <div className="sendbird-quote-message__replied-message">
        {/* text message */}
        {(isUserMessage(parentMessage) && parentMessage?.message?.length > 0) && (
          <div className="sendbird-quote-message__replied-message__text-message">
            <Label
              className="sendbird-quote-message__replied-message__text-message__word"
              type={LabelTypography.BODY_2}
              color={LabelColors.ONBACKGROUND_3}
            >
              {parentMessage?.message}
            </Label>
          </div>
        )}
        {/* thumbnail message */}
        {(isThumbnailMessage(parentMessage) && parentMessageUrl) && (
          <div className="sendbird-quote-message__replied-message__thumbnail-message">
            <ImageRenderer
              className="sendbird-quote-message__replied-message__thumbnail-message__image"
              url={parentMessageUrl}
              alt={parentMessageType}
              width="144px"
              height="108px"
              placeHolder={(style) => {
                <div className="sendbird-quote-message__replied-message__thumbnail-message__placeholder" style={style}>
                  <div className="sendbird-quote-message__replied-message__thumbnail-message__placeholder__icon">
                    <Icon
                      type={isVideo(parentMessageType) ? IconTypes.PLAY : IconTypes.PHOTO}
                      fillColor={IconColors.ON_BACKGROUND_2}
                      width="14px"
                      height="14px"
                    />
                  </div>
                </div>
              }}
            />
            <div className="sendbird-quote-message__replied-message__thumbnail-message__cover">
              <div className="sendbird-quote-message__replied-message__thumbnail-message__cover__icon">
                <Icon
                  type={isVideo(parentMessageType) ? IconTypes.PLAY : IconTypes.PHOTO}
                  fillColor={IconColors.ON_BACKGROUND_2}
                  width="14px"
                  height="14px"
                />
              </div>
            </div>
          </div>
        )}
        {/* file message */}
        {(isFileMessage(parentMessage) && !isSupportedFileView(parentMessage.type) && parentMessageUrl) && (
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
              {truncateString(splitUrl[splitUrl.length - 1])}
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}

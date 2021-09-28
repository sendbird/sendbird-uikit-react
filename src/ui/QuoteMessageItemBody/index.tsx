import React, { ReactElement, useContext } from 'react';
// import { FileMessage, User, UserMessage } from 'sendbird';
import { FileMessage, User, UserMessage } from '../../sendbird.min.js';
import './index.scss';

import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import ImageRenderer from '../ImageRenderer';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { getClassName, getUIKitFileType, getUIKitFileTypes, isSupportedFileView, isVideo, truncateString } from '../../utils';
interface Props {
  message?: UserMessage | FileMessage;
  parentMessageType?: string; // mime type
  parentMessageText?: string;
  parentMessageUrl?: string;
  parentMessageSender: User;
  isByMe?: boolean;
  className?: string | Array<string>;
}

export default function QuoteMessageItemBody({
  message,
  parentMessageType,
  parentMessageText,
  parentMessageUrl,
  parentMessageSender,
  isByMe = false,
  className,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const parentMessageSenderNickname = parentMessageSender?.nickname;
  const currentMessageSenderNickname = message?.sender?.nickname;
  const uikitFileTypes = getUIKitFileTypes();
  const splitUrl = parentMessageUrl.split('/');

  return (
    <div className={getClassName([className, 'sendbird-quote-message-item-body', isByMe ? 'outgoing' : 'incoming'])}>
      <div className="sendbird-quote-message-item-body__replied-to">
        <Icon
          className="sendbird-quote-message-item-body__replied-to__icon"
          type={IconTypes.REPLY}
          fillColor={IconColors.ON_BACKGROUND_3}
          width="12px"
          height="12px"
        />
        <Label
          className="sendbird-quote-message-item-body__replied-to__text"
          type={LabelTypography.CAPTION_2}
          color={LabelColors.ONBACKGROUND_3}
        >
          {`${currentMessageSenderNickname} ${stringSet.REPLIED_TO} ${parentMessageSenderNickname}`}
        </Label>
      </div>
      <div className="sendbird-quote-message-item-body__replied-message">
        {/* text message */}
        {(!parentMessageType && parentMessageText?.length > 0) && (
          <div className="sendbird-quote-message-item-body__replied-message__text-message">
            <Label
              className="sendbird-quote-message-item-body__replied-message__text-message__word"
              type={LabelTypography.BODY_2}
              color={LabelColors.ONBACKGROUND_3}
            >
              {parentMessageText}
            </Label>
          </div>
        )}
        {/* thumbnail message */}
        {(parentMessageType && isSupportedFileView(parentMessageType) && parentMessageUrl) && (
          <div className="sendbird-quote-message-item-body__replied-message__thumbnail-message">
            <ImageRenderer
              className="sendbird-quote-message-item-body__replied-message__thumbnail-message__image"
              url={parentMessageUrl}
              alt={parentMessageType}
              width="144px"
              height="108px"
              placeHolder={(style) => {
                <div className="sendbird-quote-message-item-body__replied-message__thumbnail-message__placeholder" style={style}>
                  <div className="sendbird-quote-message-item-body__replied-message__thumbnail-message__placeholder__icon">
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
            <div className="sendbird-quote-message-item-body__replied-message__thumbnail-message__cover">
              <div className="sendbird-quote-message-item-body__replied-message__thumbnail-message__cover__icon">
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
        {((parentMessageType && !isSupportedFileView(parentMessageType) && parentMessageUrl) && (
          <div className="sendbird-quote-message-item-body__replied-message__file-message">
            <Icon
              className="sendbird-quote-message-item-body__replied-message__file-message__type-icon"
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
              className="sendbird-quote-message-item-body__replied-message__file-message__file-name"
              type={LabelTypography.BODY_2}
              color={LabelColors.ONBACKGROUND_3}
            >
              {truncateString(splitUrl[splitUrl.length - 1])}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

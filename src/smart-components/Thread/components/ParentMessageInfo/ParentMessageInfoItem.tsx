import React, { ReactElement, useState } from 'react';
import { FileMessage, UserMessage } from '@sendbird/chat/message';

import './ParentMessageInfoItem.scss';

import { useLocalization } from '../../../../lib/LocalizationContext';
import {
  getUIKitFileType,
  getUIKitMessageType,
  getUIKitMessageTypes,
  isEditedMessage,
  isFileMessage,
  isGifMessage,
  isOGMessage,
  isSentMessage,
  isThumbnailMessage,
  isUserMessage,
  isVideoMessage,
  truncateString
} from '../../../../utils';
import uuidv4 from '../../../../utils/uuid';

import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Word from '../../../../ui/Word';
import ImageRenderer from '../../../../ui/ImageRenderer';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import TextButton from '../../../../ui/TextButton';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import EmojiReactions from '../../../../ui/EmojiReactions';
import { useThreadContext } from '../../context/ThreadProvider';

interface ParentMessageInfoItemProps {
  className?: string;
  message: UserMessage | FileMessage;
  showFileViewer?: (bool: boolean) => void;
}

export default function ParentMessageInfoItem({
  className,
  message,
  showFileViewer,
}: ParentMessageInfoItemProps): ReactElement {
  const { stores, config } = useSendbirdStateContext();
  const {
    replyType,
    isMentionEnabled,
    isReactionEnabled,
  } = config;
  const currentUserId = stores?.userStore?.user?.userId;
  const { stringSet } = useLocalization();
  const {
    currentChannel,
    emojiContainer,
    nicknamesMap,
    toggleReaction,
  } = useThreadContext();

  const isMentionedMessage = isMentionEnabled
    && message?.mentionedMessageTemplate?.length > 0
    && message?.mentionedUsers?.length > 0;

  // Emoji reactions
  const isReactionActivated = isReactionEnabled
    && replyType === 'THREAD'
    && !currentChannel?.isSuper
    && !currentChannel?.isBroadcast
    && message?.reactions?.length > 0;

  // OG message
  const openUrl = () => {
    if (isOGMessage(message) && message?.ogMetaData?.url) {
      window.open(message.ogMetaData.url);
    }
  };

  // Thumbnail mesage
  const [isImageRendered, setImageRendered] = useState(false);
  const thumbnailUrl: string = (message as FileMessage)?.thumbnails?.length > 0
    ? (message as FileMessage)?.thumbnails[0]?.url : '';

  return (
    <div className={`sendbird-parent-message-info-item ${className}`}>
      {isUserMessage(message) && (
        <Label
          className="sendbird-parent-message-info-item__text-message"
          type={LabelTypography.BODY_1}
          color={LabelColors.ONBACKGROUND_1}
        >
          {isMentionedMessage
            ? (
              message.mentionedMessageTemplate.split(' ').map((word: string) => (
                <Word
                  key={uuidv4()}
                  word={word}
                  message={message as UserMessage}
                />
              ))
            )
            : (
              (message as UserMessage)?.message.split(' ').map((word: string) => (
                <Word
                  key={uuidv4()}
                  word={word}
                  message={message as UserMessage}
                />
              ))
            )}
          {isEditedMessage(message) && (
            <Label
              className="sendbird-parent-message-info-item__text-message edited"
              type={LabelTypography.BODY_1}
              color={LabelColors.ONBACKGROUND_2}
            >
              {` ${stringSet.MESSAGE_EDITED} `}
            </Label>
          )}
        </Label>
      )}
      {isOGMessage(message) && (
        <div
          className="sendbird-parent-message-info-item__og-field"
          onClick={openUrl}
        >
          <ImageRenderer
            className="sendbird-parent-message-info-item__og-field__thumbnail"
            url={message?.ogMetaData?.defaultImage?.url || ''}
            alt={message?.ogMetaData?.defaultImage?.alt || ''}
            width="200px"
            height="148px"
            defaultComponent={() => (
              <div className="sendbird-parent-message-info-item__og-field__thumbnail__placeholder">
                <Icon
                  className="sendbird-parent-message-info-item__og-field__thumbnail__placeholder__icon"
                  type={IconTypes.THUMBNAIL_NONE}
                  fillColor={IconColors.ON_BACKGROUND_2}
                  width="56px"
                  height="56px"
                />
              </div>
            )}
          />
          <div className="sendbird-parent-message-info-item__og-field__content">
            {message?.ogMetaData?.title && (
              <Label
                className="sendbird-parent-message-info-item__og-field__content__title"
                type={LabelTypography.SUBTITLE_2}
                color={LabelColors.ONBACKGROUND_1}
              >
                {message.ogMetaData.title}
              </Label>
            )}
            {message?.ogMetaData?.description && (
              <Label
                className="sendbird-parent-message-info-item__og-field__content__description"
                type={LabelTypography.BODY_2}
                color={LabelColors.ONBACKGROUND_1}
              >
                {message.ogMetaData.description}
              </Label>
            )}
            {message?.ogMetaData?.url && (
              <Label
                className="sendbird-parent-message-info-item__og-field__content__url"
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_2}
              >
                {message.ogMetaData.url}
              </Label>
            )}
          </div>
        </div>
      )}
      {isFileMessage(message) && !isThumbnailMessage(message) && (
        <div className="sendbird-parent-message-info-item__file-message">
          <div className="sendbird-parent-message-info-item__file-message__file-icon">
            <Icon
              className="sendbird-parent-message-info-item__file-message__file-icon__icon"
              type={{
                IMAGE: IconTypes.PHOTO,
                VIDEO: IconTypes.PLAY,
                AUDIO: IconTypes.FILE_AUDIO,
                GIF: IconTypes.GIF,
                OTHERS: IconTypes.FILE_DOCUMENT,
              }[getUIKitFileType((message as FileMessage)?.type)]}
              fillColor={IconColors.PRIMARY}
              width="24px"
              height="24px"
            />
          </div>
          <TextButton
            className="sendbird-parent-message-info-item__file-message__file-name"
            onClick={() => { window.open((message as FileMessage)?.url) }}
            color={LabelColors.ONBACKGROUND_1}
          >
            <Label
              className="sendbird-parent-message-info-item__file-message__file-name__text"
              type={LabelTypography.BODY_1}
              color={LabelColors.ONBACKGROUND_1}
            >
              {truncateString((message as FileMessage)?.name || (message as FileMessage)?.url, 30)}
            </Label>
          </TextButton>
        </div>
      )}
      {isThumbnailMessage(message) && (
        <div
          className="sendbird-parent-message-info-item__thumbnail-message"
          onClick={() => {
            if (isSentMessage(message)) {
              showFileViewer(true);
            }
          }}
        >
          <ImageRenderer
            className="sendbird-parent-message-info-item__thumbnail-message__thumbnail"
            url={thumbnailUrl || (message as FileMessage)?.url || (message as FileMessage)?.plainUrl}
            alt={(message as FileMessage)?.type}
            width="200px"
            height="148px"
            onLoad={() => { setImageRendered(true) }}
            placeHolder={(style_: Record<string, any>) => (
              <div
                className="sendbird-parent-message-info-item__thumbnail-message__placeholder"
                style={style_}
              >
                <div className="sendbird-parent-message-info-item__thumbnail-message__placeholder__icon">
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
          {(isVideoMessage(message) && !thumbnailUrl) && !isImageRendered && (
            <video className="sendbird-parent-message-info-item__thumbnail-message__video">
              <source src={(message as FileMessage)?.url || (message as FileMessage)?.plainUrl} type={(message as FileMessage)?.type} />
            </video>
          )}
          <div className="sendbird-parent-message-info-item__thumbnail-message__image-cover" />
          {(isVideoMessage(message) || isGifMessage(message)) && (
            <div className="sendbird-parent-message-info-item__thumbnail-message__icon-wrapper">
              <div className="sendbird-parent-message-info-item__thumbnail-message__icon-wrapper__icon">
                <Icon
                  type={isVideoMessage(message) ? IconTypes.PLAY : IconTypes.GIF}
                  fillColor={IconColors.GRAY}
                  width="34px"
                  height="34px"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {getUIKitMessageType(message) === getUIKitMessageTypes?.()?.UNKNOWN && (
        <div className="sendbird-parent-message-info-item__unknown-message">
          <Label
            className="sendbird-parent-message-info-item__unknown-message__header"
            type={LabelTypography.BODY_1}
            color={LabelColors.ONBACKGROUND_1}
          >
            {stringSet.UNKNOWN__UNKNOWN_MESSAGE_TYPE}
          </Label>
          <Label
            className="sendbird-parent-message-info-item__unknown-message__description"
            type={LabelTypography.BODY_1}
            color={LabelColors.ONBACKGROUND_2}
          >
            {stringSet.UNKNOWN__CANNOT_READ_MESSAGE}
          </Label>
        </div>
      )}

      {/* reactions */}
      {isReactionActivated && (
        <div className="sendbird-parent-message-info__reactions">
          <EmojiReactions
            userId={currentUserId}
            message={message}
            isByMe={false}
            emojiContainer={emojiContainer}
            memberNicknamesMap={nicknamesMap}
            toggleReaction={toggleReaction}
          />
        </div>
      )}
    </div>
  );
}

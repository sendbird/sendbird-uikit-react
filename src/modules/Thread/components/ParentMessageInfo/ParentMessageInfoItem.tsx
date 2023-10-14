import React, { ReactElement, useMemo, useState } from 'react';
import { FileMessage, MultipleFilesMessage, UserMessage } from '@sendbird/chat/message';

import './ParentMessageInfoItem.scss';

import { useLocalization } from '../../../../lib/LocalizationContext';
import {
  getUIKitFileType,
  getUIKitMessageType,
  getUIKitMessageTypes,
  isEditedMessage,
  isVoiceMessage,
  isGifMessage,
  // isOGMessage,
  isSentMessage,
  isThumbnailMessage,
  isUserMessage,
  isVideoMessage,
  truncateString,
  SendableMessageType,
  isMultipleFilesMessage,
} from '../../../../utils';

import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import ImageRenderer from '../../../../ui/ImageRenderer';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import TextButton from '../../../../ui/TextButton';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import EmojiReactions from '../../../../ui/EmojiReactions';
import { useThreadContext } from '../../context/ThreadProvider';
import VoiceMessageItemBody from '../../../../ui/VoiceMessageItemBody';
import TextFragment from '../../../Message/components/TextFragment';
import { tokenizeMessage } from '../../../Message/utils/tokens/tokenize';
import MultipleFilesMessageItemBody, { ThreadMessageKind } from '../../../../ui/MultipleFilesMessageItemBody';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import { useThreadMessageKindKeySelector } from '../../../Channel/context/hooks/useThreadMessageKindKeySelector';
import { useStatefulFileInfoList } from '../../../Channel/context/hooks/useStatefulFileInfoList';

export interface ParentMessageInfoItemProps {
  className?: string;
  message: SendableMessageType;
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
  const { isMobile } = useMediaQueryContext();
  const threadMessageKindKey = useThreadMessageKindKeySelector({
    threadMessageKind: ThreadMessageKind.PARENT,
    isMobile,
  });
  // For MultipleFilesMessage only.
  const statefulFileInfoList = useStatefulFileInfoList(message);
  const isMentionedMessage = isMentionEnabled
    && message?.mentionedMessageTemplate?.length > 0
    && message?.mentionedUsers?.length > 0;

  // Emoji reactions
  const isReactionActivated = isReactionEnabled
    && replyType === 'THREAD'
    && !currentChannel?.isSuper
    && !currentChannel?.isBroadcast
    && message?.reactions?.length > 0;

  const tokens = useMemo(() => {
    if (isMentionedMessage) {
      return tokenizeMessage({
        mentionedUsers: message?.mentionedUsers,
        messageText: message?.mentionedMessageTemplate,
      });
    }
    return tokenizeMessage({
      messageText: (message as UserMessage)?.message,
    });
  }, [message?.updatedAt]);

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
          <TextFragment tokens={tokens} />
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
      {/* Will enable ogMessage after Server support - getMessage including og_tag */}
      {/* {isOGMessage(message) && (
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
      )} */}
      {
        (getUIKitMessageType((message as FileMessage)) === getUIKitMessageTypes().FILE) && (
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
              onClick={() => { window.open((message as FileMessage)?.url); }}
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
        )
      }
      {
        isMultipleFilesMessage(message) && (
          <MultipleFilesMessageItemBody
            className="sendbird-parent-message-info-item__multiple-files-message-wrapper"
            message={message as MultipleFilesMessage}
            isByMe={false}
            isReactionEnabled={isReactionEnabled}
            threadMessageKindKey={threadMessageKindKey}
            statefulFileInfoList={statefulFileInfoList}
          />
        )
      }
      {
        isVoiceMessage(message as FileMessage) && (
          <div className="sendbird-parent-message-info-item__voice-message">
            <VoiceMessageItemBody
              className="sendbird-parent-message-info-item__voice-message__item"
              message={message as FileMessage}
              channelUrl={currentChannel?.url}
              isByMe={false}
              isReactionEnabled={isReactionEnabled}
            />
          </div>
        )
      }
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
            onLoad={() => { setImageRendered(true); }}
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
                  fillColor={IconColors.ON_BACKGROUND_2}
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
            channel={currentChannel}
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

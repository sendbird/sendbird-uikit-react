import './index.scss';
import React, { ReactElement, useContext, useEffect, useMemo, useRef } from 'react';
import type { OGImage, OGMetaData, UserMessage } from '@sendbird/chat/message';

import ImageRenderer from '../ImageRenderer';
import Icon, { IconTypes } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { getClassName, isEditedMessage } from '../../utils';
import { LocalizationContext } from '../../lib/LocalizationContext';
import TextFragment from '../../modules/Message/components/TextFragment';
import { tokenizeMessage } from '../../modules/Message/utils/tokens/tokenize';
import { OG_MESSAGE_BODY_CLASSNAME } from './consts';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import { classnames, openURL } from '../../utils/utils';

interface Props {
  className?: string | Array<string>;
  message: UserMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isMentionEnabled?: boolean;
  isReactionEnabled?: boolean;
  onMessageHeightChange?: () => void;
}

export default function OGMessageItemBody({
  className,
  message,
  isByMe = false,
  mouseHover = false,
  isMentionEnabled = false,
  isReactionEnabled = false,
  onMessageHeightChange = () => {
    /* noop */
  },
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);

  const isMessageMentioned = isMentionEnabled && message?.mentionedMessageTemplate?.length > 0 && message?.mentionedUsers && message?.mentionedUsers?.length > 0;
  const tokens = useMemo(() => {
    if (isMessageMentioned) {
      return tokenizeMessage({
        mentionedUsers: message?.mentionedUsers ?? undefined,
        messageText: message?.mentionedMessageTemplate,
      });
    }
    return tokenizeMessage({
      messageText: message?.message,
    });
  }, [message?.updatedAt, message?.message]);

  const openOpenGraphURL = () => openURL(message?.ogMetaData?.url);

  return (
    <div
      className={getClassName([
        className ?? '',
        'sendbird-og-message-item-body',
        isByMe ? 'outgoing' : 'incoming',
        mouseHover ? 'mouse-hover' : '',
        isReactionEnabled && message?.reactions?.length > 0 ? 'reactions' : '',
      ])}
    >
      <Label type={LabelTypography.BODY_1} color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}>
        <div className={OG_MESSAGE_BODY_CLASSNAME}>
          <TextFragment tokens={tokens} />
          {isEditedMessage(message) && (
            <Label
              className="sendbird-og-message-item-body__text-bubble__message"
              type={LabelTypography.BODY_1}
              color={isByMe ? LabelColors.ONCONTENT_2 : LabelColors.ONBACKGROUND_2}
            >
              {` ${stringSet.MESSAGE_EDITED} `}
            </Label>
          )}
        </div>
      </Label>
      {message.ogMetaData?.defaultImage && (
        <OGImageSection
          onClick={openOpenGraphURL}
          ogImage={message.ogMetaData.defaultImage}
          onMessageHeightChange={onMessageHeightChange}
        />
      )}
      {message.ogMetaData && (
        <OGDescriptionSection onClick={openOpenGraphURL} ogMetaData={message.ogMetaData} onMessageHeightChange={onMessageHeightChange} />
      )}
      <div className="sendbird-og-message-item-body__cover" />
    </div>
  );
}

const OGImageSection = (props: { onClick: () => void; ogImage: OGImage; onMessageHeightChange: () => void }) => {
  const { onClick, ogImage, onMessageHeightChange } = props;

  const imageRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMediaQueryContext();

  return (
    <div
      ref={imageRef}
      className={classnames(
        'sendbird-og-message-item-body__og-thumbnail',
        ogImage.url && 'sendbird-og-message-item-body__og-thumbnail__empty',
      )}
      onClick={() => onClick()}
    >
      <ImageRenderer
        className="sendbird-og-message-item-body__og-thumbnail__image"
        url={ogImage.url || ''}
        alt={ogImage.alt || ''}
        width="100%"
        height={isMobile ? '136px' : '240px'}
        onLoad={onMessageHeightChange}
        onError={() => {
          try {
            imageRef?.current?.classList?.add('sendbird-og-message-item-body__og-thumbnail__empty');
          } catch (error) {
            // do nothing
          }
        }}
        defaultComponent={
          <div className="sendbird-og-message-item-body__og-thumbnail__place-holder">
            <Icon
              className="sendbird-og-message-item-body__og-thumbnail__place-holder__icon"
              type={IconTypes.THUMBNAIL_NONE}
              width="56px"
              height="56px"
            />
          </div>
        }
      />
    </div>
  );
};

const OGDescriptionSection = (props: { onClick: () => void; ogMetaData: OGMetaData; onMessageHeightChange: () => void }) => {
  const { onClick, ogMetaData, onMessageHeightChange } = props;

  useEffect(() => {
    onMessageHeightChange();
  }, [ogMetaData.title, ogMetaData.description, ogMetaData.url]);

  return (
    <div className="sendbird-og-message-item-body__description" onClick={() => onClick()}>
      {ogMetaData.title && (
        <Label
          className="sendbird-og-message-item-body__description__title"
          type={LabelTypography.SUBTITLE_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {ogMetaData.title}
        </Label>
      )}
      {ogMetaData.description && (
        <Label
          className="sendbird-og-message-item-body__description__description"
          type={LabelTypography.BODY_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {ogMetaData.description}
        </Label>
      )}
      {ogMetaData.url && (
        <Label
          className="sendbird-og-message-item-body__description__url"
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_2}
        >
          {ogMetaData.url}
        </Label>
      )}
    </div>
  );
};

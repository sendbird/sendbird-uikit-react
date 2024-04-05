import './index.scss';
import React, {
  ReactElement,
  useContext,
  useMemo,
  useRef,
} from 'react';
import type { UserMessage } from '@sendbird/chat/message';

import ImageRenderer from '../ImageRenderer';
import Icon, { IconTypes } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { getClassName, isEditedMessage } from '../../utils';
import { LocalizationContext } from '../../lib/LocalizationContext';
import TextFragment from '../../modules/Message/components/TextFragment';
import { tokenizeMessage } from '../../modules/Message/utils/tokens/tokenize';
import { OG_MESSAGE_BODY_CLASSNAME } from './consts';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';

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
  onMessageHeightChange = () => { /* noop */ },
}: Props): ReactElement {
  const imageRef = useRef<HTMLDivElement>(null);
  const { stringSet } = useContext(LocalizationContext);
  const { isMobile } = useMediaQueryContext();

  const openOGUrl = (): void => {
    let url = message?.ogMetaData?.url;
    if (url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url);
    }
  };
  const isMessageMentioned = isMentionEnabled && message?.mentionedMessageTemplate?.length > 0 && message?.mentionedUsers?.length > 0;
  const tokens = useMemo(() => {
    if (isMessageMentioned) {
      return tokenizeMessage({
        mentionedUsers: message?.mentionedUsers,
        messageText: message?.mentionedMessageTemplate,
      });
    }
    return tokenizeMessage({
      messageText: message?.message,
    });
  }, [message?.updatedAt, message?.message]);
  return (
    <div className={getClassName([
      className,
      'sendbird-og-message-item-body',
      isByMe ? 'outgoing' : 'incoming',
      mouseHover ? 'mouse-hover' : '',
      (isReactionEnabled && message?.reactions?.length > 0) ? 'reactions' : '',
    ])}>
      <Label
        type={LabelTypography.BODY_1}
        color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
      >
        <div className={OG_MESSAGE_BODY_CLASSNAME}>
          <TextFragment tokens={tokens} />
          {
            isEditedMessage(message) && (
              <Label
                className="sendbird-og-message-item-body__text-bubble__message"
                type={LabelTypography.BODY_1}
                color={isByMe ? LabelColors.ONCONTENT_2 : LabelColors.ONBACKGROUND_2}
              >
                {` ${stringSet.MESSAGE_EDITED} `}
              </Label>
            )
          }
        </div>
      </Label>
      <div
        ref={imageRef}
        className={`sendbird-og-message-item-body__og-thumbnail
          ${message?.ogMetaData?.defaultImage?.url ? '' : 'sendbird-og-message-item-body__og-thumbnail__empty'}
        `}
        onClick={openOGUrl}
      >
        <ImageRenderer
          className="sendbird-og-message-item-body__og-thumbnail__image"
          url={message?.ogMetaData?.defaultImage?.url || ''}
          alt={message?.ogMetaData?.defaultImage?.alt}
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
          defaultComponent={(
            <div className="sendbird-og-message-item-body__og-thumbnail__place-holder">
              <Icon
                className="sendbird-og-message-item-body__og-thumbnail__place-holder__icon"
                type={IconTypes.THUMBNAIL_NONE}
                width="56px"
                height="56px"
              />
            </div>
          )}
        />
      </div>
      <div
        className="sendbird-og-message-item-body__description"
        onClick={openOGUrl}
      >
        {message?.ogMetaData?.title && (
          <Label
            className="sendbird-og-message-item-body__description__title"
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_1}
          >
            {message.ogMetaData.title}
          </Label>
        )}
        {message?.ogMetaData?.description && (
          <Label
            className="sendbird-og-message-item-body__description__description"
            type={LabelTypography.BODY_2}
            color={LabelColors.ONBACKGROUND_1}
          >
            {message.ogMetaData.description}
          </Label>
        )}
        {message?.ogMetaData?.url && (
          <Label
            className="sendbird-og-message-item-body__description__url"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {message.ogMetaData.url}
          </Label>
        )}
      </div>
      <div className="sendbird-og-message-item-body__cover" />
    </div>
  );
}

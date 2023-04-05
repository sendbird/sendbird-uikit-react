import './index.scss';
import React, {
  ReactElement,
  useContext,
  useMemo,
  useRef,
} from 'react';
import type { UserMessage } from '@sendbird/chat/message';

import Word from '../Word';
import ImageRenderer from '../ImageRenderer';
import Icon, { IconTypes } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import uuidv4 from '../../utils/uuid';
import { getClassName, isEditedMessage } from '../../utils';
import { LocalizationContext } from '../../lib/LocalizationContext';
import TextFragment from '../../smart-components/Message/components/TextFragment';
import { tokenizeMessage } from '../../smart-components/Message/utils/tokens/tokenize';

interface Props {
  className?: string | Array<string>;
  message: UserMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isMentionEnabled?: boolean;
  isReactionEnabled?: boolean;
}

export default function OGMessageItemBody({
  className,
  message,
  isByMe = false,
  mouseHover = false,
  isMentionEnabled = false,
  isReactionEnabled = false,
}: Props): ReactElement {
  const imageRef = useRef<HTMLDivElement>(null);
  const { stringSet } = useContext(LocalizationContext);
  const openOGUrl = (): void => {
    if (message?.ogMetaData?.url) window.open(message?.ogMetaData?.url);
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
  }, [message?.updatedAt]);
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
        <div className="sendbird-og-message-item-body__text-bubble">
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
          onError={() => {
            try {
              imageRef?.current?.classList?.add('sendbird-og-message-item-body__og-thumbnail__empty');
            } catch (error) {
              // do nothing
            }
          }}
          className="sendbird-og-message-item-body__og-thumbnail__image"
          url={message?.ogMetaData?.defaultImage?.url || ''}
          alt={message?.ogMetaData?.defaultImage?.alt}
          // TODO: Change fixing width and height lengths
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

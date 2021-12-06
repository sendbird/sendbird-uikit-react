import React, { ReactElement, useContext } from 'react';
import { UserMessage } from 'sendbird';
import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';
import LinkLabel from '../LinkLabel';
import Icon, { IconTypes } from '../Icon';
import ImageRenderer from '../ImageRenderer';
import {
  getClassName,
  isEditedMessage,
  isUrl,
} from '../../utils';
import uuidv4 from '../../utils/uuid';
import { LocalizationContext } from '../../lib/LocalizationContext';

interface Props {
  className?: string | Array<string>;
  message: UserMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
}

export default function OGMessageItemBody({
  className,
  message,
  isByMe = false,
  mouseHover = false,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const openOGUrl = (): void => {
    if (message?.ogMetaData?.url) window.open(message?.ogMetaData?.url);
  };

  return (
    <div className={getClassName([
      className,
      'sendbird-og-message-item-body',
      isByMe ? 'outgoing' : 'incoming',
      mouseHover ? 'mouse-hover' : '',
      message?.reactions?.length > 0 ? 'reactions' : '',
    ])}>
      <Label
        key={uuidv4()}
        type={LabelTypography.BODY_1}
        color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
      >
        <p className="sendbird-og-message-item-body__text-bubble">
          {
            message?.message.split(' ').map((word: string) => (
              isUrl(word)
                ? (
                  <LinkLabel
                    className="sendbird-og-message-item-body__text-bubble__message"
                    key={uuidv4()}
                    src={word}
                    type={LabelTypography.BODY_1}
                    color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
                  >
                    {word}
                  </LinkLabel>
                )
                : (`${word} `)
            ))
          }
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
        </p>
      </Label>
      <div
        className="sendbird-og-message-item-body__og-thumbnail"
        onClick={openOGUrl}
      >
        <ImageRenderer
          className="sendbird-og-message-item-body__og-thumbnail__image"
          url={message?.ogMetaData?.defaultImage?.url || ''}
          alt={message?.ogMetaData?.defaultImage?.alt}
          // TODO: Change fixing width and height lengths
          width="320px"
          height="180px"
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

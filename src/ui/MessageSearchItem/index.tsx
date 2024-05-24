import React from 'react';
import './index.scss';
import getCreatedAt from './getCreatedAt';

import Avatar from '../Avatar';
import Label, { LabelTypography, LabelColors } from '../Label';
import { useLocalization } from '../../lib/LocalizationContext';
import { UserMessage } from '@sendbird/chat/message';

interface Props {
  className?: string | Array<string>;
  message: UserMessage;
  selected?: boolean;
  onClick?: (message: UserMessage) => void;
}

export default function MessageSearchItem({
  className,
  message,
  selected,
  onClick,
}: Props): JSX.Element {
  const { createdAt } = message;
  const messageText = message.message;
  // @ts-ignore
  const sender = message.sender || message._sender;
  const { profileUrl, nickname } = sender;
  const { stringSet, dateLocale } = useLocalization();

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-message-search-item',
        selected ? 'sendbird-message-search-item--selected' : '',
      ].join(' ')}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(message);
      }}
    >
      <div className="sendbird-message-search-item__left">
        <Avatar
          className="sendbird-message-search-item__left__sender-avatar"
          src={profileUrl}
          alt="profile image"
          width="56px"
          height="56px"
        />
      </div>
      <div className="sendbird-message-search-item__right">
        <Label
          className="sendbird-message-search-item__right__sender-name"
          type={LabelTypography.SUBTITLE_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {nickname || stringSet.NO_NAME}
        </Label>
        <Label
          className="sendbird-message-search-item__right__message-text"
          type={LabelTypography.BODY_2}
          color={LabelColors.ONBACKGROUND_3}
        >
          {messageText}
        </Label>
        <Label
          className="sendbird-message-search-item__right__message-created-at"
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_2}
        >
          {getCreatedAt({ createdAt, locale: dateLocale, stringSet })}
        </Label>
      </div>
      <div className="sendbird-message-search-item__right-footer" />
    </div>
  );
}

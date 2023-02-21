import './index.scss';
import React, { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import Avatar from '../Avatar';
import Icon, { IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { useLocalization } from '../../lib/LocalizationContext';
import { getCreatedAt, getIconOfFileType } from './utils';
import { isVoiceMessage } from '../../utils';

interface Props {
  className?: string | Array<string>;
  message: FileMessage;
  selected?: boolean;
  onClick?: (message: FileMessage) => void;
}

export default function MessageSearchFileItem(props: Props): ReactElement {
  const {
    className,
    message,
    selected,
    onClick,
  } = props;
  const { createdAt, url, name } = message;
  // @ts-ignore
  const sender = message.sender || message._sender;
  const { profileUrl, nickname } = sender;
  const { stringSet, dateLocale } = useLocalization();
  const isVoiceMsg = isVoiceMessage(message);
  const prettyFilename = isVoiceMsg ? stringSet.VOICE_MESSAGE : (name || url);

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-message-search-file-item',
        selected ? 'sendbird-message-search-file-item--selected' : '',
      ].join(' ')}
      onClick={(e) => {
        e.stopPropagation();
        onClick(message);
      }}
    >
      <div className="sendbird-message-search-file-item__left">
        <Avatar
          className="sendbird-message-search-file-item__left__sender-avatar"
          src={profileUrl}
          alt="profile image"
          width="56px"
          height="56px"
        />
      </div>
      <div className="sendbird-message-search-file-item__right">
        <Label
          className="sendbird-message-search-file-item__right__sender-name"
          type={LabelTypography.SUBTITLE_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {nickname || stringSet.NO_NAME}
        </Label>
        <div className="sendbird-message-search-file-item__right__content">
          <div className={`sendbird-message-search-file-item__right__content__type-icon${isVoiceMsg ? ' --voice-message-border-radius' : ''}`}>
            <Icon
              type={getIconOfFileType(message)}
              fillColor={IconColors.PRIMARY}
              width="18px"
              height="18px"
            />
          </div>
          <Label
            className="sendbird-message-search-file-item__right__content__url"
            type={LabelTypography.BODY_2}
            color={LabelColors.ONBACKGROUND_1}
          >
            {prettyFilename}
          </Label>
        </div>
      </div>
      <Label
        className="sendbird-message-search-file-item__message-created-at"
        type={LabelTypography.CAPTION_3}
        color={LabelColors.ONBACKGROUND_2}
      >
        {getCreatedAt({ createdAt, locale: dateLocale, stringSet })}
      </Label>
      <div className="sendbird-message-search-file-item__right-footer" />
    </div>
  );
}

import React, { ReactElement, useContext } from 'react';
import './index.scss';

import Avatar from '../Avatar';
import Icon, { IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { getCreatedAt, getIconOfFileType, truncate } from './utils';

interface Props {
  className?: string | Array<string>;
  message: SendbirdUIKit.ClientFileMessage;
  selected?: boolean;
  onClick?: (message: SendbirdUIKit.ClientFileMessage) => void;
}

export default function MessageSearchFileItem(props: Props): ReactElement {
  const {
    className,
    message,
    selected,
    onClick,
  } = props;
  const { createdAt, url, name } = message;
  const fileMessageUrl = url;
  const sender = message.sender || message._sender;
  const { profileUrl, nickname } = sender;
  const { stringSet } = useContext(LocalizationContext);

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
          <div className="sendbird-message-search-file-item__right__content__type-icon">
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
            {truncate(name || fileMessageUrl, 28)}
          </Label>
        </div>
      </div>
      <Label
        className="sendbird-message-search-file-item__message-created-at"
        type={LabelTypography.CAPTION_3}
        color={LabelColors.ONBACKGROUND_2}
      >
        {getCreatedAt(createdAt)}
      </Label>
      <div className="sendbird-message-search-file-item__right-footer" />
    </div>
  );
}

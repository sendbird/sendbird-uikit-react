import React, { useContext } from 'react';
import './index.scss';

import Avatar from '../Avatar';
import Icon, { IconColors, IconTypes } from '../Icon';
import IconButton from '../IconButton';
import Label, { LabelTypography, LabelColors } from '../Label';
import { LocalizationContext } from '../../lib/LocalizationContext';

interface Props {
  coverImage?: string;
  title?: string;
  subTitle?: string;
  amIOperator?: boolean;
  onActionClick?(): void;
}

export default function OpenchannelConversationHeader({
  coverImage,
  title,
  subTitle,
  amIOperator,
  onActionClick,
}: Props): JSX.Element {
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div className="sendbird-openchannel-conversation-header">
      <div className="sendbird-openchannel-conversation-header__left">
        {
          coverImage ? (
            <Avatar
              className="sendbird-openchannel-conversation-header__left__cover-image"
              src={coverImage}
              alt="channel cover image"
              width="32px"
              height="32px"
            />
          ) : (
            <div
              className="sendbird-openchannel-conversation-header__left__cover-image--icon"
              style={{ width: 32, height: 32 }}
            >
              <Icon
                type={IconTypes.CHANNELS}
                fillColor={IconColors.CONTENT}
                width="18px"
                height="18px"
              />
            </div>
          )
        }
        <Label
          className="sendbird-openchannel-conversation-header__left__title"
          type={LabelTypography.H_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {title || stringSet.NO_TITLE}
        </Label>
        <Label
          className="sendbird-openchannel-conversation-header__left__sub-title"
          type={LabelTypography.BODY_2}
          color={LabelColors.ONBACKGROUND_2}
        >
          {subTitle || stringSet.NO_TITLE}
        </Label>
      </div>
      <div className="sendbird-openchannel-conversation-header__right">
        <IconButton
          className="sendbird-openchannel-conversation-header__right__trigger"
          width="32px"
          height="32px"
          onClick={onActionClick}
        >
          <Icon
            type={(
              amIOperator
              ? IconTypes.INFO
              : IconTypes.MEMBERS
            )}
            fillColor={IconColors.PRIMARY}
            width="24px"
            height="24px"
          />
        </IconButton>
      </div>
    </div>
  );
}

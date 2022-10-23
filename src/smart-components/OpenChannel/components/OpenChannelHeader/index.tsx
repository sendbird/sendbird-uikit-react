import './open-channel-header.scss';
import React, { useContext } from 'react';

import Avatar from '../../../../ui/Avatar';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import IconButton from '../../../../ui/IconButton';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useOpenChannelContext } from '../../context/OpenChannelProvider';

import { kFormatter } from '../../context/utils';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';

export default function OpenchannelConversationHeader(): JSX.Element {
  const { stringSet } = useContext(LocalizationContext);
  const {
    currentOpenChannel,
    onChatHeaderActionClick,
    amIOperator,
    onBackClick,
  } = useOpenChannelContext();
  const title = currentOpenChannel?.name;
  const subTitle = `${kFormatter(currentOpenChannel?.participantCount)} ${stringSet.OPEN_CHANNEL_CONVERSATION__TITLE_PARTICIPANTS}`;
  const coverImage = currentOpenChannel?.coverUrl;
  const { isMobile } = useMediaQueryContext();

  return (
    <div className="sendbird-openchannel-conversation-header">
      <div className="sendbird-openchannel-conversation-header__left">
        {
          isMobile && (
            <Icon
              className="sendbird-chat-header__icon_back"
              onClick={onBackClick}
              fillColor={IconColors.PRIMARY}
              width="24px"
              height="24px"
              type={IconTypes.ARROW_LEFT}
            />
          )
        }
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
          onClick={onChatHeaderActionClick}
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

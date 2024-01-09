import './index.scss';
import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import IconButton from '../../../../ui/IconButton';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import ChannelAvatar from '../../../../ui/ChannelAvatar';
import { getChannelTitle } from './utils';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';

export interface GroupChannelHeaderProps {
  className?: string;
  currentChannel: GroupChannel;
  showSearchIcon?: boolean;
  onBackClick?: () => void;
  onSearchClick?: () => void;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
}

export const GroupChannelHeader = ({
  className,
  currentChannel,
  showSearchIcon,
  onBackClick,
  onSearchClick,
  onChatHeaderActionClick,
}: GroupChannelHeaderProps) => {
  const { config } = useSendbirdStateContext();
  const { userId, theme } = config;
  const { isMobile } = useMediaQueryContext();

  const { stringSet } = useLocalization();

  const isMuted = currentChannel?.myMutedState === 'muted';
  const subTitle = (currentChannel?.members
    && currentChannel?.members?.length !== 2);

  return (
    <div className={`sendbird-chat-header ${className}`}>
      <div className="sendbird-chat-header__left">
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
        <ChannelAvatar
          theme={theme}
          channel={currentChannel}
          userId={userId}
          height={32}
          width={32}
        />
        <Label
          className="sendbird-chat-header__left__title"
          type={LabelTypography.H_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {getChannelTitle(currentChannel, userId, stringSet)}
        </Label>
        <Label
          className="sendbird-chat-header__left__subtitle"
          type={LabelTypography.BODY_1}
          color={LabelColors.ONBACKGROUND_2}
        >
          {subTitle}
        </Label>
      </div>
      <div className="sendbird-chat-header__right">
        {
          ((typeof isMuted === 'string' && isMuted === 'true') || (typeof isMuted === 'boolean' && isMuted))
          && (
            <Icon
              className="sendbird-chat-header__right__mute"
              type={IconTypes.NOTIFICATIONS_OFF_FILLED}
              fillColor={IconColors.ON_BACKGROUND_2}
              width="24px"
              height="24px"
            />
          )
        }
        {
          (showSearchIcon && !currentChannel?.isEphemeral) && (
            <IconButton
              className="sendbird-chat-header__right__search"
              width="32px"
              height="32px"
              onClick={onSearchClick}
            >
              <Icon
                type={IconTypes.SEARCH}
                fillColor={IconColors.PRIMARY}
                width="24px"
                height="24px"
              />
            </IconButton>
          )
        }
        <IconButton
          className="sendbird-chat-header__right__info"
          width="32px"
          height="32px"
          onClick={onChatHeaderActionClick}
        >
          <Icon
            type={IconTypes.INFO}
            fillColor={IconColors.PRIMARY}
            width="24px"
            height="24px"
          />
        </IconButton>
      </div>
    </div>
  );
};

export default GroupChannelHeader;

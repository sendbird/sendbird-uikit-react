import './index.scss';
import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import IconButton from '../../../../ui/IconButton';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import ChannelAvatar from '../../../../ui/ChannelAvatar';
import { getChannelTitle } from './utils';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import Header, { type HeaderCustomProps } from '../../../../ui/Header';

export interface GroupChannelHeaderViewProps extends HeaderCustomProps {
  className?: string;
  currentChannel: GroupChannel;
  showSearchIcon?: boolean;
  onBackClick?: () => void;
  onSearchClick?: () => void;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
}

export const GroupChannelHeaderView = ({
  className,
  currentChannel,
  showSearchIcon,
  onBackClick,
  onSearchClick,
  onChatHeaderActionClick,
  // Header custom props
  renderLeft,
  renderMiddle,
  renderRight,
}: GroupChannelHeaderViewProps) => {
  const { config } = useSendbirdStateContext();
  const { userId, theme } = config;
  const { isMobile } = useMediaQueryContext();

  const { stringSet } = useLocalization();

  const isMuted = currentChannel?.myMutedState === 'muted';
  const channelTitle = getChannelTitle(currentChannel, userId, stringSet);

  return (
    <Header
      className={`sendbird-chat-header ${className}`}
      title={channelTitle}
      renderLeft={renderLeft ?? (() => (
        <>
          {isMobile && (
            <Icon
              className="sendbird-chat-header__icon_back"
              onClick={onBackClick}
              fillColor={IconColors.PRIMARY}
              width="24px"
              height="24px"
              type={IconTypes.ARROW_LEFT}
            />
          )}
          <ChannelAvatar
            theme={theme}
            channel={currentChannel}
            userId={userId}
            height={32}
            width={32}
          />
        </>
      ))}
      renderMiddle={renderMiddle}
      renderRight={renderRight ?? (() => (
        <>
          {isMuted && (
            <Icon
              className="sendbird-chat-header__right__mute"
              type={IconTypes.NOTIFICATIONS_OFF_FILLED}
              fillColor={IconColors.ON_BACKGROUND_2}
              width="24px"
              height="24px"
            />
          )}
          {(showSearchIcon && !currentChannel?.isEphemeral) && (
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
          )}
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
        </>
      ))}
    />
  );
};

export default GroupChannelHeaderView;

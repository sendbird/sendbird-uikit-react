import './index.scss';
import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import { IconColors, IconTypes } from '../../../../ui/Icon';
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
      renderLeft={renderLeft ?? (() => (
        <>
          {isMobile && (
            <Header.Icon
              className="sendbird-chat-header__icon_back"
              onClick={onBackClick}
              type={IconTypes.ARROW_LEFT}
              color={IconColors.PRIMARY}
              width="24px"
              height="24px"
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
      renderMiddle={renderMiddle ?? (() => (
        <Header.Title title={channelTitle} />
      ))}
      renderRight={renderRight ?? (() => (
        <>
          {isMuted && (
            <Header.Icon
              className="sendbird-chat-header__right__mute"
              type={IconTypes.NOTIFICATIONS_OFF_FILLED}
              color={IconColors.ON_BACKGROUND_2}
              width="24px"
              height="24px"
            />
          )}
          {(showSearchIcon && !currentChannel?.isEphemeral) && (
            <Header.IconButton
              className="sendbird-chat-header__right__search"
              onClick={onSearchClick}
              type={IconTypes.SEARCH}
              color={IconColors.PRIMARY}
              renderIcon={(props) => <Header.Icon {...props} width="24px" height="24px" />}
            />
          )}
          <Header.IconButton
            className="sendbird-chat-header__right__info"
            onClick={onChatHeaderActionClick}
            type={IconTypes.INFO}
            color={IconColors.PRIMARY}
            renderIcon={(props) => <Header.Icon {...props} width="24px" height="24px" />}
          />
        </>
      ))}
    />
  );
};

export default GroupChannelHeaderView;

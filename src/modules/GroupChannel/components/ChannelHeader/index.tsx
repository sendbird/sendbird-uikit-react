import './index.scss';
import React, { useContext } from 'react';

import * as utils from './utils';

import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import IconButton from '../../../../ui/IconButton';
import ChannelAvatar from '../../../../ui/ChannelAvatar/index';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import { noop } from '../../../../utils/utils';

interface ChannelHeaderProps {
  className?: string;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({
  className = '',
}) => {
  const globalStore = useSendbirdStateContext();
  const userId = globalStore?.config?.userId;
  const theme = globalStore?.config?.theme;

  const channelStore = useGroupChannelContext();
  const { isMobile } = useMediaQueryContext();
  const {
    currentChannel,
    showSearchIcon,
    onSearchClick,
    onChatHeaderActionClick,
    onBackClick = noop,
  } = channelStore;
  const subTitle = (currentChannel?.members
    && currentChannel?.members?.length !== 2);
  const isMuted = currentChannel?.myMutedState === 'muted';

  const { stringSet } = useContext(LocalizationContext);
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
          {utils.getChannelTitle(currentChannel, userId, stringSet)}
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

export default ChannelHeader;

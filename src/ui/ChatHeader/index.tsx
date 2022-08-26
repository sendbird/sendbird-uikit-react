// will be deprecated
import React, { ReactElement, useContext, useEffect } from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import './index.scss';
import * as utils from './utils';

import { LocalizationContext } from '../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../Label';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import ChannelAvatar from '../ChannelAvatar/index';

export interface ChatHeaderProps {
  currentGroupChannel?: GroupChannel;
  currentUser?: User;
  title?: string;
  subTitle?: string;
  isMuted?: boolean;
  theme?: string;
  showSearchIcon?: boolean;
  onSearchClick?: () => void;
  onActionClick?: () => void;
}

export default function ChatHeader({
  currentGroupChannel,
  currentUser,
  title = '',
  subTitle = '',
  isMuted = false,
  theme = 'light',
  showSearchIcon = false,
  onSearchClick = () => {/* noop */},
  onActionClick = () => {/* noop */},
}: ChatHeaderProps): ReactElement {
  const userId = currentUser?.userId;
  const { stringSet } = useContext(LocalizationContext);
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('SendbirdUIKit: ChatHeader will be deprecated in the next minor version. Recommend to use "@sendbird/uikit-react/Channtl/components/ChannelHeader" instead.');
  }, []);
  return (
    <div className="sendbird-chat-header">
      <div className="sendbird-chat-header__left">
        <ChannelAvatar
          theme={theme}
          channel={currentGroupChannel}
          userId={userId}
          height={32}
          width={32}
        />
        <Label
          className="sendbird-chat-header__left__title"
          type={LabelTypography.H_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {title || utils.getChannelTitle(currentGroupChannel, userId, stringSet)}
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
                width="24px"
                height="24px"
              />
            )
        }
        {
          showSearchIcon && (
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
          onClick={onActionClick}
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
}

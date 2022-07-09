// delete
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import * as utils from './utils';

import { LocalizationContext } from '../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../Label';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import ChannelAvatar from '../ChannelAvatar/index';

const noop = () => { };
export default function ChatHeader(props) {
  const {
    currentGroupChannel,
    currentUser,
    title,
    subTitle,
    isMuted,
    theme,
    showSearchIcon,
    onSearchClick,
    onActionClick,
  } = props;
  const { userId } = currentUser;
  const { stringSet } = useContext(LocalizationContext);
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

ChatHeader.propTypes = {
  /**Type: GroupChannel */
  currentGroupChannel: PropTypes.shape({
    members: PropTypes.arrayOf(PropTypes.shape({})),
    coverUrl: PropTypes.string,
  }),
  /** Type: User */
  currentUser: PropTypes.shape({
    userId: PropTypes.string,
  }),
  title: PropTypes.string,
  subTitle: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isMuted: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  theme: PropTypes.string,
  showSearchIcon: PropTypes.bool,
  onSearchClick: PropTypes.func,
  /** For clicking the info button */
  onActionClick: PropTypes.func,
};

ChatHeader.defaultProps = {
  currentGroupChannel: {},
  currentUser: {},
  title: '',
  subTitle: '',
  isMuted: false,
  theme: 'light',
  showSearchIcon: false,
  onSearchClick: noop,
  onActionClick: noop,
};

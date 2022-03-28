import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

import ChannelAvatar from '../ChannelAvatar/index';
import Badge from '../Badge';
import Icon, { IconColors, IconTypes } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { useLocalization } from '../../lib/LocalizationContext';

import * as utils from './utils';

// Legacy
export default function ChannelPreview({
  channel,
  currentUser,
  isActive,
  ChannelAction,
  theme,
  onClick,
  tabIndex,
}) {
  const {
    userId,
  } = currentUser;
  const { isBroadcast, isFrozen } = channel;
  const { dateLocale, stringSet } = useLocalization();
  return (
    <div
      className={[
        'sendbird-channel-preview',
        isActive ? 'sendbird-channel-preview--active' : '',
      ].join(' ')}
      role="link"
      onClick={onClick}
      onKeyPress={onClick}
      tabIndex={tabIndex}
    >
      <div
        className="sendbird-channel-preview__avatar"
      >
        <ChannelAvatar
          channel={channel}
          userId={userId}
          theme={theme}
        />
      </div>
      <div className="sendbird-channel-preview__content">
        <div className="sendbird-channel-preview__content__upper">
          <div className="sendbird-channel-preview__content__upper__header">
            {
              isBroadcast
              && (
                <div className="sendbird-channel-preview__content__upper__header__broadcast-icon">
                  <Icon
                    type={IconTypes.BROADCAST}
                    fillColor={IconColors.SECONDARY}
                    height="16px"
                    width="16px"
                  />
                </div>
              )
            }
            <Label
              className="sendbird-channel-preview__content__upper__header__channel-name"
              type={LabelTypography.SUBTITLE_2}
              color={LabelColors.ONBACKGROUND_1}
            >
              {utils.getChannelTitle(channel, userId, stringSet)}
            </Label>
            <Label
              className="sendbird-channel-preview__content__upper__header__total-members"
              type={LabelTypography.CAPTION_2}
              color={LabelColors.ONBACKGROUND_2}
            >
              {utils.getTotalMembers(channel)}
            </Label>
            {
              isFrozen
              && (
                <div title="Frozen" className="sendbird-channel-preview__content__upper__header__frozen-icon">
                  <Icon
                    type={IconTypes.FREEZE}
                    fillColor={IconColors.PRIMARY}
                    height={12}
                    width={12}
                  />
                </div>
              )
            }
          </div>
          <Label
            className="sendbird-channel-preview__content__upper__last-message-at"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {utils.getLastMessageCreatedAt(channel, dateLocale)}
          </Label>
        </div>
        <div className="sendbird-channel-preview__content__lower">
          <Label
            className="sendbird-channel-preview__content__lower__last-message"
            type={LabelTypography.BODY_2}
            color={LabelColors.ONBACKGROUND_3}
          >
            {utils.getLastMessage(channel)}
          </Label>
          <div className="sendbird-channel-preview__content__lower__unread-message-count">
            {
              utils.getChannelUnreadMessageCount(channel) // return number
                ? <Badge count={utils.getChannelUnreadMessageCount(channel)} />
                : null
            }
          </div>
        </div>
      </div>
      <div
        className="sendbird-channel-preview__action"
      >
        {ChannelAction}
      </div>
    </div>
  );
}

ChannelPreview.propTypes = {
  channel: PropTypes.shape({
    members: PropTypes.arrayOf(PropTypes.shape({})),
    coverUrl: PropTypes.string,
    isBroadcast: PropTypes.bool,
    isFrozen: PropTypes.bool,
  }),
  currentUser: PropTypes.shape({
    userId: PropTypes.string,
  }),
  isActive: PropTypes.bool,
  ChannelAction: PropTypes.element.isRequired,
  theme: PropTypes.string,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
};

ChannelPreview.defaultProps = {
  channel: {},
  currentUser: {},
  isActive: false,
  theme: 'light',
  onClick: () => { },
  tabIndex: 0,
};

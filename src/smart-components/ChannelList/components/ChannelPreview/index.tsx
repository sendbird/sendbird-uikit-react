import React, { useContext } from 'react';
import SendBird from 'sendbird';

import './channel-preview.scss';

import ChannelAvatar from '../../../../ui/ChannelAvatar';
import Badge from '../../../../ui/Badge';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';

import * as utils from './utils';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';

interface ChannelPreviewInterface {
  channel: SendBird.GroupChannel;
  isActive?: boolean;
  onClick: () => void;
  renderChannelAction: (props: { channel: SendBird.GroupChannel }) => React.ReactNode;
  tabIndex: number;
}

const ChannelPreview: React.FC<ChannelPreviewInterface> = ({
  channel,
  isActive = false,
  renderChannelAction,
  onClick,
  tabIndex,
}: ChannelPreviewInterface) => {
  const sbState = useSendbirdStateContext();
  const { dateLocale, stringSet } = useLocalization();
  const userId = sbState?.stores?.userStore?.user?.userId;
  const theme = sbState?.config?.theme;
  const { isBroadcast, isFrozen } = channel;
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
        { renderChannelAction({ channel }) }
      </div>
    </div>
  );
}

export default ChannelPreview;

import './channel-settings-ui.scss';

import React, { useContext, useState } from 'react';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import IconButton from '../../../../ui/IconButton';
import ChannelProfile from '../ChannelProfile';
import ModerationPanel from '../ModerationPanel';
import LeaveChannelModal from '../LeaveChannel';
import UserPanel from '../UserPanel';

export interface ChannelSettingsUIProps {
  renderPlaceholderError?: () => React.ReactNode;
  renderChannelProfile?: () => React.ReactNode;
  renderModerationPanel?: () => React.ReactNode;
  renderLeaveChannel?: () => React.ReactNode;
}

const ChannelSettingsUI: React.FC<ChannelSettingsUIProps> = (props: ChannelSettingsUIProps) => {
  const { stringSet } = useContext(LocalizationContext);

  const state = useSendbirdStateContext();
  const channelSettingStore = useChannelSettingsContext();

  const [showLeaveChannelModal, setShowLeaveChannelModal] = useState(false);

  const isOnline = state?.config?.isOnline;
  const logger = state?.config?.logger;

  const {
    channel,
    invalidChannel,
    onCloseClick,
  } = channelSettingStore;

  const {
    renderPlaceholderError,
    renderChannelProfile,
    renderModerationPanel,
    renderLeaveChannel,
  } = props;

  if (!channel || invalidChannel) {
    return (
      <div>
        <div className="sendbird-channel-settings__header">
          <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.CHANNEL_SETTING__HEADER__TITLE}
          </Label>
          <Icon
            className="sendbird-channel-settings__close-icon"
            type={IconTypes.CLOSE}
            height="24px"
            width="24px"
            onClick={() => {
              logger.info('ChannelSettings: Click close');
              onCloseClick?.();
            }}
          />
        </div>
        <div>
          {
            renderPlaceholderError
              ? renderPlaceholderError()
              : (
                <PlaceHolder type={PlaceHolderTypes.WRONG} />
              )
          }
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sendbird-channel-settings__header">
        <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>
          {stringSet.CHANNEL_SETTING__HEADER__TITLE}
        </Label>
        <div className="sendbird-channel-settings__header-icon">
          <IconButton
            width="32px"
            height="32px"
            onClick={() => {
              logger.info('ChannelSettings: Click close');
              onCloseClick?.();
            }}
          >
            <Icon
              className="sendbird-channel-settings__close-icon"
              type={IconTypes.CLOSE}
              height="22px"
              width="22px"
            />
          </IconButton>
        </div>
      </div>
      <div className="sendbird-channel-settings__scroll-area">
        {
          renderChannelProfile?.() || (
            <ChannelProfile />
          )
        }
        {
          renderModerationPanel?.() || (
            channel?.myRole === 'operator'
              ? (<ModerationPanel />)
              : (<UserPanel />)
          )
        }
        {
          renderLeaveChannel?.() || (
            <div
              className={[
                'sendbird-channel-settings__panel-item',
                'sendbird-channel-settings__leave-channel',
                !isOnline ? 'sendbird-channel-settings__panel-item__disabled' : '',
              ].join(' ')}
              role="button"
              onKeyDown={() => {
                if (!isOnline) { return; }
                setShowLeaveChannelModal(true);
              }}
              onClick={() => {
                if (!isOnline) { return; }
                setShowLeaveChannelModal(true);
              }}
              tabIndex={0}
            >
              <Icon
                className={[
                  'sendbird-channel-settings__panel-icon-left',
                  'sendbird-channel-settings__panel-icon__leave',
                ].join(' ')}
                type={IconTypes.LEAVE}
                fillColor={IconColors.ERROR}
                height="24px"
                width="24px"
              />
              <Label
                type={LabelTypography.SUBTITLE_1}
                color={LabelColors.ONBACKGROUND_1}
              >
                {stringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE}
              </Label>
            </div>
          )
        }
        {
          showLeaveChannelModal && (
            <LeaveChannelModal
              onCancel={() => {
                setShowLeaveChannelModal(false);
              }}
              onSubmit={() => {
                setShowLeaveChannelModal(false);
                onCloseClick?.();
              }}
            />
          )
        }
      </div>
    </>
  );
}

export default ChannelSettingsUI;

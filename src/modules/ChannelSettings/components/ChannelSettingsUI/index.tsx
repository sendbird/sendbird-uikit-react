import './channel-settings-ui.scss';

import React, { useContext, useState } from 'react';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';

import { ChannelSettingsHeader, ChannelSettingsHeaderProps } from './ChannelSettingsHeader';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ChannelProfile from '../ChannelProfile';
import ModerationPanel from '../ModerationPanel';
import LeaveChannelModal from '../LeaveChannel';
import UserPanel from '../UserPanel';
import { deleteNullish } from '../../../../utils/utils';

export interface ChannelSettingsUIProps {
  renderHeader?: (props: ChannelSettingsHeaderProps) => React.ReactElement;
  renderChannelProfile?: () => React.ReactElement;
  renderModerationPanel?: () => React.ReactElement;
  renderLeaveChannel?: () => React.ReactElement;
  renderPlaceholderError?: () => React.ReactElement;
  renderPlaceholderLoading?: () => React.ReactElement;
}

const ChannelSettingsUI = (props: ChannelSettingsUIProps) => {
  const {
    renderHeader = (p) => <ChannelSettingsHeader {...p} />,
    renderLeaveChannel,
    renderChannelProfile,
    renderModerationPanel,
    renderPlaceholderError,
    renderPlaceholderLoading,
  } = deleteNullish(props);

  const state = useSendbirdStateContext();
  const { channel, invalidChannel, onCloseClick, loading } = useChannelSettingsContext() ?? {};
  const [showLeaveChannelModal, setShowLeaveChannelModal] = useState(false);

  const isOnline = state?.config?.isOnline;
  const { stringSet } = useContext(LocalizationContext);

  if (loading) {
    if (renderPlaceholderLoading) return renderPlaceholderLoading();
    return <PlaceHolder type={PlaceHolderTypes.LOADING} />;
  }

  const headerProps: ChannelSettingsHeaderProps = { onCloseClick };

  if (invalidChannel || !channel) {
    return (
      <div>
        {renderHeader(headerProps)}
        <div>{renderPlaceholderError ? renderPlaceholderError() : <PlaceHolder type={PlaceHolderTypes.WRONG} />}</div>
      </div>
    );
  }

  return (
    <>
      {renderHeader(headerProps)}
      <div className="sendbird-channel-settings__scroll-area">
        {renderChannelProfile?.() || <ChannelProfile />}
        {renderModerationPanel?.() || (channel?.myRole === 'operator' ? <ModerationPanel /> : <UserPanel />)}
        {renderLeaveChannel?.() || (
          <div
            className={[
              'sendbird-channel-settings__panel-item',
              'sendbird-channel-settings__leave-channel',
              !isOnline ? 'sendbird-channel-settings__panel-item__disabled' : '',
            ].join(' ')}
            role="button"
            onKeyDown={() => {
              if (!isOnline) {
                return;
              }
              setShowLeaveChannelModal(true);
            }}
            onClick={() => {
              if (!isOnline) {
                return;
              }
              setShowLeaveChannelModal(true);
            }}
            tabIndex={0}
          >
            <Icon
              className={['sendbird-channel-settings__panel-icon-left', 'sendbird-channel-settings__panel-icon__leave'].join(' ')}
              type={IconTypes.LEAVE}
              fillColor={IconColors.ERROR}
              height="24px"
              width="24px"
            />
            <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
              {stringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE}
            </Label>
          </div>
        )}
        {showLeaveChannelModal && (
          <LeaveChannelModal
            onCancel={() => {
              setShowLeaveChannelModal(false);
            }}
            onSubmit={() => {
              setShowLeaveChannelModal(false);
              onCloseClick?.();
            }}
          />
        )}
      </div>
    </>
  );
};

export default ChannelSettingsUI;

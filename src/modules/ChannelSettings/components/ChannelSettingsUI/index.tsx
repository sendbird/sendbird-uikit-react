import './channel-settings-ui.scss';

import React, { ReactNode, useState } from 'react';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import useChannelSettings from '../../context/useChannelSettings';
import { useLocalization } from '../../../../lib/LocalizationContext';
import useMenuItems from './hooks/useMenuItems';

import { deleteNullish, classnames } from '../../../../utils/utils';
import { ChannelSettingsHeader, ChannelSettingsHeaderProps } from './ChannelSettingsHeader';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import { UserListItemProps } from '../../../../ui/UserListItem';

import ChannelProfile from '../ChannelProfile';
import LeaveChannelModal from '../LeaveChannel';
import MenuItem from './MenuItem';
import MenuListByRole from './MenuListByRole';

interface ModerationPanelProps {
  menuItems: ReturnType<typeof useMenuItems>;
}
export interface ChannelSettingsUIProps {
  renderHeader?: (props: ChannelSettingsHeaderProps) => React.ReactElement;
  renderChannelProfile?: () => React.ReactElement;
  renderModerationPanel?: (props: ModerationPanelProps) => React.ReactElement;
  renderLeaveChannel?: () => React.ReactElement;
  renderPlaceholderError?: () => React.ReactElement;
  renderPlaceholderLoading?: () => React.ReactElement;
  /**
   * @deprecated This prop is deprecated and will be removed in the next major update.
   * Please use the `renderUserListItem` prop of the `ChannelSettingsProvider` instead.
   */
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
}

const ChannelSettingsUI = (props: ChannelSettingsUIProps) => {
  const {
    renderHeader = (props: ChannelSettingsHeaderProps) => <ChannelSettingsHeader {...props} />,
    renderLeaveChannel,
    renderChannelProfile,
    renderModerationPanel = (props: ModerationPanelProps) => <MenuListByRole {...props} />,
    renderPlaceholderError,
    renderPlaceholderLoading,
  } = deleteNullish(props);
  const {
    config: { isOnline },
  } = useSendbirdStateContext();
  const {
    state: {
      channel,
      invalidChannel,
      onCloseClick,
      loading,
    },
  } = useChannelSettings();
  const { stringSet } = useLocalization();
  const menuItems = useMenuItems();

  const [showLeaveChannelModal, setShowLeaveChannelModal] = useState(false);

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
    <div className="sendbird-channel-settings">
      {renderHeader(headerProps)}
      <div className="sendbird-channel-settings__scroll-area">
        {renderChannelProfile?.() || <ChannelProfile />}
        {renderModerationPanel?.({ menuItems })}
        {renderLeaveChannel?.() || (
          <MenuItem
            className={classnames(!isOnline ? 'sendbird-channel-settings__panel-item__disabled' : '', 'sendbird-channel-settings__panel-item__leave-channel')}
            onKeyDown={() => {
              if (!isOnline) return;
              setShowLeaveChannelModal(true);
            }}
            onClick={() => {
              if (!isOnline) return;
              setShowLeaveChannelModal(true);
            }}
            renderLeft={() => (
              <Icon
                className={['sendbird-channel-settings__panel-icon-left', 'sendbird-channel-settings__panel-icon__leave'].join(' ')}
                type={IconTypes.LEAVE}
                fillColor={IconColors.ERROR}
                height="24px"
                width="24px"
              />
            )}
            renderMiddle={() => (
              <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
                {stringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE}
              </Label>
            )}
          />
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
    </div>
  );
};

export default ChannelSettingsUI;
/** NOTE: For exportation */
export { OperatorList } from '../ModerationPanel/OperatorList';
export { MemberList } from '../ModerationPanel/MemberList';
export { MutedMemberList } from '../ModerationPanel/MutedMemberList';
export { BannedUserList } from '../ModerationPanel/BannedUserList';

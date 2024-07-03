import './channel-settings-ui.scss';

import React, { ReactNode, useContext, useState } from 'react';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';

import { ChannelSettingsHeader, ChannelSettingsHeaderProps } from './ChannelSettingsHeader';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ChannelProfile from '../ChannelProfile';
import LeaveChannelModal from '../LeaveChannel';
import { deleteNullish } from '../../../../utils/utils';
import MenuItem from './MenuItem';
import MenuListByRole from './MenuListByRole';
import useMenuItems from './hooks/useMenuItems';
import { UserListItemProps } from '../../../../ui/UserListItem';

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
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
}

const ChannelSettingsUI = (props: ChannelSettingsUIProps) => {
  const menuItems = useMenuItems({ renderUserListItem: props?.renderUserListItem });
  const {
    renderHeader = (props: ChannelSettingsHeaderProps) => <ChannelSettingsHeader {...props} />,
    renderLeaveChannel,
    renderChannelProfile,
    renderModerationPanel = (props: ModerationPanelProps) => <MenuListByRole {...props} />,
    renderPlaceholderError,
    renderPlaceholderLoading,
  } = deleteNullish(props);

  const state = useSendbirdStateContext();
  const { channel, invalidChannel, onCloseClick, loading } = useChannelSettingsContext();
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
        {renderModerationPanel?.({ menuItems })}
        {renderLeaveChannel?.() || (
          <MenuItem
            className={!isOnline ? 'sendbird-channel-settings__panel-item__disabled' : ''}
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
    </>
  );
};

export default ChannelSettingsUI;
export { OperatorList } from '../ModerationPanel/OperatorList';
export { OperatorsModal } from '../ModerationPanel/OperatorsModal';
export { MemberList } from '../ModerationPanel/MemberList';
export { MembersModal } from '../ModerationPanel/MembersModal';
export { MutedMemberList } from '../ModerationPanel/MutedMemberList';
export { MutedMembersModal } from '../ModerationPanel/MutedMembersModal';
export { BannedUserList } from '../ModerationPanel/BannedUserList';
export { BannedUsersModal } from '../ModerationPanel/BannedUsersModal';

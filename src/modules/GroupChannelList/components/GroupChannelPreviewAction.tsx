import React, { useState, useRef, useContext } from 'react';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import ContextMenu, { MenuItem, MenuItems } from '../../../ui/ContextMenu';
import IconButton from '../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';
import LeaveChannelModal from './LeaveGroupChannel';
import { GroupChannel } from '@sendbird/chat/groupChannel';

type ChannelPreviewActionProps = {
  channel?: GroupChannel;
  disabled: boolean;
  onLeaveChannel(): void;
};

export default function GroupChannelPreviewAction({ channel, disabled = false, onLeaveChannel }: ChannelPreviewActionProps) {
  const parentRef = useRef(null);
  const parentContainerRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div
      ref={parentContainerRef}
      tabIndex={0}
      role="button"
      style={{ display: 'inline-block' }}
      onKeyDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <ContextMenu
        menuTrigger={(toggleDropdown) => (
          <IconButton ref={parentRef} onClick={toggleDropdown} height="32px" width="32px">
            <Icon type={IconTypes.MORE} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
          </IconButton>
        )}
        menuItems={(closeDropdown) => (
          <MenuItems parentRef={parentRef} parentContainRef={parentContainerRef} closeDropdown={closeDropdown}>
            <MenuItem
              onClick={() => {
                if (disabled) {
                  return;
                }
                setShowModal(true);
                closeDropdown();
              }}
              dataSbId="channel_list_item_context_menu_leave_channel"
            >
              {stringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE}
            </MenuItem>
          </MenuItems>
        )}
      />
      {showModal && (
        <LeaveChannelModal
          channel={channel}
          onSubmit={() => {
            setShowModal(false);
            onLeaveChannel();
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

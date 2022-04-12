import React, {
  useState,
  useRef,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import ContextMenu, { MenuItem, MenuItems } from '../../../ui/ContextMenu';
import IconButton from '../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';
import LeaveChannelModal from './LeaveChannel';

export default function ChannelPreviewAction({ disabled, onLeaveChannel }) {
  const parentRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div
      role="button"
      style={{ display: 'inline-block' }}
      onKeyDown={(e) => { e.stopPropagation(); }}
      tabIndex={0}
      onClick={(e) => { e.stopPropagation(); }}
    >
      <ContextMenu
        menuTrigger={(toggleDropdown) => (
          <IconButton
            ref={parentRef}
            onClick={toggleDropdown}
            height="32px"
            width="32px"
          >
            <Icon
              type={IconTypes.MORE}
              fillColor={IconColors.PRIMARY}
              width="24px"
              height="24px"
            />
          </IconButton>
        )}
        menuItems={(closeDropdown) => (
          <MenuItems
            parentRef={parentRef}
            parentContainRef={parentRef}
            closeDropdown={closeDropdown}
          >
            <MenuItem
              onClick={() => {
                if (disabled) { return; }
                setShowModal(true);
                closeDropdown();
              }}
            >
              {stringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE}
            </MenuItem>
          </MenuItems>
        )}
      />
      {
        showModal && (
          <LeaveChannelModal
            onSubmit={() => {
              setShowModal(false);
              onLeaveChannel();
            }}
            onCancel={() => setShowModal(false)}
          />
        )
      }
    </div>
  );
}

ChannelPreviewAction.propTypes = {
  disabled: PropTypes.bool,
  onLeaveChannel: PropTypes.func.isRequired,
};

ChannelPreviewAction.defaultProps = {
  disabled: false,
};

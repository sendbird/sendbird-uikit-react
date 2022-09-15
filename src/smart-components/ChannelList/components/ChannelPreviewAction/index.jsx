import React, {
  useState,
  useRef,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import LeaveChannelModal from '../LeaveChannel';

export default function ChannelPreviewAction({ disabled, onLeaveChannel, setSupposedHover }) {
  const parentRef = useRef(null);
  const parentContainRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div
      className="sendbird-channel-preview-action"
      role="button"
      onKeyDown={(e) => { e.stopPropagation(); }}
      tabIndex={0}
      onClick={(e) => { e.stopPropagation(); }}
      ref={parentContainRef}
    >
      <ContextMenu
        menuTrigger={(toggleDropdown) => (
          <IconButton
            ref={parentRef}
            height="32px"
            width="32px"
            onClick={() => {
              toggleDropdown();
              setSupposedHover(true);
            }}
            onBlur={() => {
              setSupposedHover(false);
            }}
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
            parentContainRef={parentContainRef}
            closeDropdown={() => {
              closeDropdown();
              setSupposedHover(false);
            }}
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
  setSupposedHover: PropTypes.func,
};

ChannelPreviewAction.defaultProps = {
  disabled: false,
  setSupposedHover: () => { },
};

import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';
import
  Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';
import { UserListItem } from '../ParticipantUI/ParticipantItem';
import MutedParticipantsModal from './MutedParticipantsModal';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

export const MutedParticipantList = (): ReactElement => {
  const [mutedUsers, setMutedUsers] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { channel } = useOpenChannelSettingsContext();
  const state = useSendbirdStateContext();
  const currentUser = state?.config?.userId;
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    if (!channel) {
      setMutedUsers([]);
      return;
    }
    const mutedUserListQuery = channel?.createMutedUserListQuery({
      limit: 10,
    });
    mutedUserListQuery.next().then((members) => {
      setMutedUsers(members);
      setHasNext(mutedUserListQuery.hasNext);
    });
  }, [channel]);

  const refreshList = useCallback(() => {
    if (!channel) {
      setMutedUsers([]);
      return;
    }

    const mutedUserListQuery = channel?.createMutedUserListQuery({
      limit: 10,
    });
    mutedUserListQuery.next().then((members) => {
      setMutedUsers(members);
      setHasNext(mutedUserListQuery.hasNext);
    });
  }, [channel]);
  return (
    <>
      {
        mutedUsers.map((mutedUser) => (
          <UserListItem
            key={mutedUser.userId}
            user={mutedUser}
            currentUser={currentUser}
            action={({ actionRef }) => {
              return (
                <ContextMenu
                  menuTrigger={(toggleDropdown) => (
                    <IconButton
                      className="sendbird-user-message__more__menu"
                      width="32px"
                      height="32px"
                      onClick={toggleDropdown}
                    >
                      <Icon
                        width="24px"
                        height="24px"
                        type={IconTypes.MORE}
                        fillColor={IconColors.CONTENT_INVERSE}
                      />
                    </IconButton>
                  )}
                  menuItems={(closeDropdown) => (
                    <MenuItems
                      closeDropdown={closeDropdown}
                      openLeft
                      parentRef={actionRef}
                    >
                      <MenuItem
                        onClick={() => {
                          channel?.unmuteUser(mutedUser).then(() => {
                            refreshList();
                            closeDropdown();
                          })
                        }}
                      >
                        {stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNMUTE}
                      </MenuItem>
                    </MenuItems>
                  )}
                />
              );
            }
            }
          />
        ))
      }
      {
        mutedUsers && mutedUsers.length === 0 && (
          <Label
            className="sendbird-channel-settings__empty-list"
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_3}
          >
            {stringSet.OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__NO_ONE}
          </Label>
        )
      }
      {
        hasNext && (
          <div
            className="sendbird-channel-settings-accordion__footer"
          >
            <Button
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => {
                setShowModal(true);
              }}
            >
              {stringSet.OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__TITLE_ALL}
            </Button>
          </div>
        )
      }
      {
        showModal && (
          <MutedParticipantsModal
            onCancel={() => {
              setShowModal(false);
              refreshList();
            }}
          />
        )
      }
    </>
  );
}

export default MutedParticipantList;

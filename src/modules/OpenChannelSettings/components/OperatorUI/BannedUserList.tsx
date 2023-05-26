import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import BannedUsersModal from './BannedUsersModal';
import { UserListItem } from '../ParticipantUI/ParticipantItem';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

export const BannedUserList = (): ReactElement => {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { channel } = useOpenChannelSettingsContext();
  const state = useSendbirdStateContext();
  const { stringSet } = useContext(LocalizationContext);
  const currentUserId = state?.config?.userId;

  useEffect(() => {
    if (!channel) {
      setBannedUsers([]);
      return;
    }
    const bannedUserListQuery = channel?.createBannedUserListQuery();
    bannedUserListQuery.next().then((users) => {
      setBannedUsers(users);
      setHasNext(bannedUserListQuery.hasNext);
    });
  }, [channel]);

  const refreshList = useCallback(() => {
    if (!channel) {
      setBannedUsers([]);
      return;
    }
    const bannedUserListQuery = channel?.createBannedUserListQuery();
    bannedUserListQuery.next().then((users) => {
      setBannedUsers(users);
      setHasNext(bannedUserListQuery.hasNext);
    });
  }, [channel]);
  return (
    <>
      {
        bannedUsers.map((bannedUser) => (
          <UserListItem
            key={bannedUser.userId}
            user={bannedUser}
            isOperator={channel?.isOperator(bannedUser.userId)}
            action={({ actionRef }) => (
              bannedUser?.userId !== currentUserId
                ? (
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
                        parentRef={actionRef}
                        closeDropdown={closeDropdown}
                        openLeft
                      >
                        <MenuItem
                          onClick={() => {
                            channel?.unbanUser(bannedUser).then(() => {
                              closeDropdown();
                              refreshList();
                            });
                          }}
                          dataSbId="unban"
                        >
                          {stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNBAN}
                        </MenuItem>
                      </MenuItems>
                    )}
                  />
                ) : null
            )}
          />
        ))
      }
      {
        bannedUsers && bannedUsers.length === 0 && (
          <Label
            className="sendbird-channel-settings__empty-list"
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_3}
          >
            {stringSet.OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__NO_ONE}
          </Label>
        )
      }
      {
        hasNext && (
          <div className="sendbird-channel-settings-banned-user-list__footer" >
            <Button
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => {
                setShowModal(true);
              }}
            >
              {stringSet.OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__TITLE_ALL}
            </Button>
          </div>
        )
      }
      {
        showModal && (
          <BannedUsersModal
            onCancel={() => {
              setShowModal(false);
              refreshList();
            }}
          />
        )
      }
    </>
  );
};

export default BannedUserList;

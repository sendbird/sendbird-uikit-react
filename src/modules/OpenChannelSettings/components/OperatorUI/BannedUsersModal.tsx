import React, {
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BannedUserListQuery, RestrictedUser } from '@sendbird/chat';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import { noop } from '../../../../utils/utils';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

interface Props {
  onCancel(): void;
}

export default function BannedUsersModal({
  onCancel,
}: Props): ReactElement {
  const [bannedUsers, setBannedUsers] = useState<RestrictedUser[]>([]);
  const [userListQuery, setUserListQuery] = useState<BannedUserListQuery | null>(null);
  const { channel } = useOpenChannelSettingsContext();
  const { state } = useSendbird();
  const { stringSet } = useContext(LocalizationContext);
  const currentUserId = state?.config?.userId;

  useEffect(() => {
    const bannedUserListQuery = channel?.createBannedUserListQuery();
    bannedUserListQuery?.next().then((users) => {
      setBannedUsers(users);
    });
    setUserListQuery(bannedUserListQuery ?? null);
  }, []);
  return (
    <div>
      <Modal
        hideFooter
        isFullScreenOnMobile
        onCancel={() => onCancel()}
        onSubmit={noop}
        titleText={stringSet.OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__TITLE}
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const hasNext = userListQuery?.hasNext;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              userListQuery.next().then((o) => {
                setBannedUsers([
                  ...bannedUsers,
                  ...o,
                ]);
              });
            }
          }}
        >
          {
            bannedUsers.map((bannedUser) => (
              <UserListItem
                user={bannedUser}
                key={bannedUser.userId}
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
                                  setBannedUsers(bannedUsers.filter((u) => {
                                    return (u.userId !== bannedUser.userId);
                                  }));
                                });
                              }}
                              testID="open_channel_setting_banned_user_context_menu_unban"
                            >
                              {stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNBAN}
                            </MenuItem>
                          </MenuItems>
                        )}
                      />
                    ) : <></>
                )
                }
              />
            ))
          }
        </div>
      </Modal>
    </div>
  );
}

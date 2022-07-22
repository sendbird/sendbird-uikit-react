import React, {
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import { noop } from '../../../../utils/utils';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

interface Props {
  onCancel(): void;
}

export default function BannedUsersModal({
  onCancel,
}: Props): ReactElement {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [userListQuery, setUserListQuery] = useState(null);
  const { channel } = useOpenChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    const bannedUserListQuery = channel?.createBannedUserListQuery();
    bannedUserListQuery.next().then((users) => {
      setBannedUsers(users);
    });
    setUserListQuery(bannedUserListQuery);
  }, []);
  return (
    <div>
      <Modal
        hideFooter
        onCancel={() => onCancel()}
        onSubmit={noop}
        titleText="Muted members"
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const { hasNext } = userListQuery;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              userListQuery.next().then((o) => {
                setBannedUsers([
                  ...bannedUsers,
                  ...o,
                ])
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
                            })
                          }}
                        >
                          {stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNBAN}
                        </MenuItem>
                      </MenuItems>
                    )}
                  />
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

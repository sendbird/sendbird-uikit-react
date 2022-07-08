import React, {
  ReactElement,
  useEffect,
  useState,
} from 'react';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import { noop } from '../../../../utils/utils';
import { useChannelSettings } from '../../context/ChannelSettingsProvider';

interface Props {
  onCancel(): void;
}

export default function BannedUsersModal({
  onCancel,
}: Props): ReactElement {
  const [members, setMembers] = useState([]);
  const [memberQuery, setMemberQuery] = useState(null);
  const { channel } = useChannelSettings();

  useEffect(() => {
    const bannedUserListQuery = channel?.createBannedUserListQuery();
    bannedUserListQuery.next().then((users) => {
      setMembers(users);
    });
    setMemberQuery(bannedUserListQuery);
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
            const { hasNext } = memberQuery;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              memberQuery.next().then((o) => {
                setMembers([
                  ...members,
                  ...o,
                ])
              });
            }
          }}
        >
          { members.map((member) => (
            <UserListItem
              user={member}
              key={member.userId}
              action={({ parentRef, actionRef }) => (
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
                      parentContainRef={parentRef}
                      parentRef={actionRef} // for catching location(x, y) of MenuItems
                      closeDropdown={closeDropdown}
                      openLeft
                    >
                      <MenuItem
                        onClick={() => {
                          channel?.unbanUser(member).then(() => {
                            closeDropdown();
                            setMembers(members.filter(m => {
                              return (m.userId !== member.userId);
                            }));
                          })
                        }}
                      >
                        Unban
                      </MenuItem>
                    </MenuItems>
                  )}
                />
              )
              }
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

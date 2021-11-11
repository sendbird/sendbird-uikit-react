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
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

interface Props {
  onCancel(): void;
}

export default function MutedMembersModal({
  onCancel,
}: Props): ReactElement {
  const [members, setMembers] = useState([]);
  const [memberQuery, setMemberQuery] = useState(null);

  const { channel } = useChannelSettings();
  const state = useSendbirdStateContext();
  const currentUser = state?.config?.userId;

  useEffect(() => {
    const memberUserListQuery = channel.createMemberListQuery();
    memberUserListQuery.limit = 10;
    memberUserListQuery.mutedMemberFilter = 'muted';
    memberUserListQuery.next((members, error) => {
      if (error) {
        return;
      }
      setMembers(members);
    });
    setMemberQuery(memberUserListQuery);
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
              memberQuery.next((o, error) => {
                if (error) {
                  return;
                }
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
              currentUser={currentUser}
              user={member}
              key={member.userId}
              action={({ actionRef, parentRef }) => (
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
                          channel.unmuteUser(member, () => {
                            closeDropdown();
                            setMembers(members.filter(m => {
                              return (m.userId !== member.userId);
                            }));
                          })
                        }}
                      >
                        Unmute
                      </MenuItem>
                    </MenuItems>
                  )}
                />
              )}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

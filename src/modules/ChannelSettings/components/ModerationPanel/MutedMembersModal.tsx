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
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { Member, MemberListQuery } from '@sendbird/chat/groupChannel';

interface Props {
  onCancel(): void;
}

export default function MutedMembersModal({
  onCancel,
}: Props): ReactElement {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberQuery, setMemberQuery] = useState<MemberListQuery | null>(null);
  
  const channel = useChannelSettingsContext()?.channel;
  const state = useSendbirdStateContext();
  const currentUser = state?.config?.userId;
  const { stringSet } = useLocalization();

  useEffect(() => {
    const memberUserListQuery = channel?.createMemberListQuery({
      limit: 10,
      // @ts-ignore
      mutedMemberFilter: 'muted',
    });
    memberUserListQuery?.next().then((members) => {
      setMembers(members);
    });
    setMemberQuery(memberUserListQuery ?? null);
  }, []);
  return (
    <div>
      <Modal
        isFullScreenOnMobile
        hideFooter
        onCancel={() => onCancel()}
        onSubmit={noop}
        titleText={stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE}
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const hasNext = memberQuery?.hasNext;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              memberQuery.next().then((o) => {
                setMembers([
                  ...members,
                  ...o,
                ]);
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
                          channel?.unmuteUser(member).then(() => {
                            closeDropdown();
                            setMembers(members.filter(m => {
                              return (m.userId !== member.userId);
                            }));
                          });
                        }}
                        dataSbId="channel_setting_muted_member_context_menu_unmute"
                      >
                        {stringSet.CHANNEL_SETTING__MODERATION__UNMUTE}
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

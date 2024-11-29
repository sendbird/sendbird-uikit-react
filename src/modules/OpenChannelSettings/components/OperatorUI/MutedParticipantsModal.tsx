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
import { MutedUserListQuery, User } from '@sendbird/chat';
import { useSendbird } from '../../../../lib/Sendbird/context/hooks/useSendbird';

interface Props {
  onCancel(): void;
}

export default function MutedParticipantsModal({
  onCancel,
}: Props): ReactElement {
  const [mutedUsers, setMutedUsers] = useState<User[]>([]);
  const [userListQuery, setUserListQuery] = useState<MutedUserListQuery | null>(null);

  const { channel } = useOpenChannelSettingsContext();
  const { state } = useSendbird();
  const currentUserId = state?.config?.userId;
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    const mutedUserListQuery = channel?.createMutedUserListQuery({
      limit: 10,
    });
    mutedUserListQuery?.next().then((users) => {
      setMutedUsers(users);
    });
    if (mutedUserListQuery) { setUserListQuery(mutedUserListQuery); }
  }, []);
  return (
    <div>
      <Modal
        isFullScreenOnMobile
        hideFooter
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
                setMutedUsers([
                  ...mutedUsers,
                  ...o,
                ]);
              });
            }
          }}
        >
          {
            mutedUsers.map((mutedUser) => (
              <UserListItem
                currentUser={currentUserId}
                user={mutedUser}
                key={mutedUser.userId}
                action={({ actionRef }) => (
                  mutedUser?.userId !== currentUserId
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
                                channel?.unmuteUser(mutedUser).then(() => {
                                  closeDropdown();
                                  setMutedUsers(mutedUsers.filter((u) => {
                                    return (u.userId !== mutedUser.userId);
                                  }));
                                });
                              }}
                              testID="open_channel_setting_muted_member_context_menu_unmute"
                            >
                              {stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNMUTE}
                            </MenuItem>
                          </MenuItems>
                        )}
                      />
                    ) : <></>
                )}
              />
            ))}
        </div>
      </Modal>
    </div>
  );
}

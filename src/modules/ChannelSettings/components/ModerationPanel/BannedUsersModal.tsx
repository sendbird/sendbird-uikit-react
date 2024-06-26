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
import { useLocalization } from '../../../../lib/LocalizationContext';
import { BannedUserListQuery, RestrictedUser } from '@sendbird/chat';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

interface Props {
  onCancel(): void;
}

export default function BannedUsersModal({
  onCancel,
}: Props): ReactElement {
  const [members, setMembers] = useState<RestrictedUser[]>([]);
  const [memberQuery, setMemberQuery] = useState<BannedUserListQuery | null>(null);
  const { channel } = useChannelSettingsContext();
  const { stringSet } = useLocalization();

  useEffect(() => {
    const bannedUserListQuery = channel?.createBannedUserListQuery();
    if (bannedUserListQuery) {
      bannedUserListQuery.next().then((users) => {
        setMembers(users);
      });
      setMemberQuery(bannedUserListQuery);
    }
  }, []);
  return (
    <div>
      <Modal
        isFullScreenOnMobile
        hideFooter
        onCancel={() => onCancel()}
        onSubmit={noop}
        titleText={stringSet.CHANNEL_SETTING__BANNED_MEMBERS__TITLE}
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={useOnScrollPositionChangeDetector({
            onReachedBottom: async () => {
              if (!memberQuery) return;
              const { hasNext } = memberQuery;
              if (hasNext) {
                memberQuery.next().then((o) => {
                  setMembers([
                    ...members,
                    ...o,
                  ]);
                });
              }
            },
          })}
        >
          {members.map((member) => (
            <UserListItem
              user={member}
              key={member.userId}
              channel={channel}
              renderListItemMenu={(props) => (
                <UserListItemMenu
                  {...props}
                  onToggleBanState={() => {
                    setMembers(members.filter(m => {
                      return (m.userId !== member.userId);
                    }));
                  }}
                  renderMenuItems={({ items }) => <items.BanToggleMenuItem />}
                />
              )}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

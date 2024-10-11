import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { BannedUserListQuery, BannedUserListQueryParams, RestrictedUser } from '@sendbird/chat';

import useChannelSettings from '../../context/useChannelSettings';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';
import { noop } from '../../../../utils/utils';

import Modal from '../../../../ui/Modal';
import UserListItem, { UserListItemProps } from '../../../../ui/UserListItem';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

export interface BannedUsersModalProps {
  onCancel(): void;
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
  bannedUserListQueryParams?: BannedUserListQueryParams;
}

export function BannedUsersModal({
  onCancel,
  renderUserListItem = (props) => <UserListItem {...props} />,
  bannedUserListQueryParams = {},
}: BannedUsersModalProps): ReactElement {
  const [members, setMembers] = useState<RestrictedUser[]>([]);
  const [memberQuery, setMemberQuery] = useState<BannedUserListQuery | null>(null);
  const { state: { channel } } = useChannelSettings();
  const { stringSet } = useLocalization();

  useEffect(() => {
    const bannedUserListQuery = channel?.createBannedUserListQuery({ limit: 20, ...bannedUserListQueryParams });
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
            renderUserListItem({
              user: member,
              channel,
              renderListItemMenu: (props) => (
                <UserListItemMenu
                  {...props}
                  isBanned
                  onToggleBanState={() => {
                    setMembers(members.filter(m => {
                      return (m.userId !== member.userId);
                    }));
                  }}
                  renderMenuItems={({ items }) => <items.BanToggleMenuItem />}
                />
              ),
            })
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default BannedUsersModal;

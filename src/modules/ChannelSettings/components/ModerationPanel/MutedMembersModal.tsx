import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import Modal from '../../../../ui/Modal';
import UserListItem, { UserListItemProps } from '../../../../ui/UserListItem';
import { noop } from '../../../../utils/utils';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { Member, MemberListQuery } from '@sendbird/chat/groupChannel';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

export interface MutedMembersModalProps {
  onCancel(): void;
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
}

export function MutedMembersModal({
  onCancel,
  renderUserListItem = (props) => <UserListItem {...props} />,
}: MutedMembersModalProps): ReactElement {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberQuery, setMemberQuery] = useState<MemberListQuery | null>(null);

  const { channel } = useChannelSettingsContext();
  const { stringSet } = useLocalization();

  useEffect(() => {
    const memberUserListQuery = channel?.createMemberListQuery({
      limit: 20,
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
          onScroll={useOnScrollPositionChangeDetector({
            onReachedBottom: async () => {
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
            <React.Fragment key={member.userId}>
              {
                renderUserListItem({
                  user: member,
                  channel,
                  renderListItemMenu: (props) => (
                    <UserListItemMenu
                      {...props}
                      onToggleMuteState={() => {
                        setMembers(members.filter(m => {
                          return (m.userId !== member.userId);
                        }));
                      }}
                      renderMenuItems={({ items }) => (<items.MuteToggleMenuItem />)}
                    />
                  ),
                })
              }
            </React.Fragment>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default MutedMembersModal;

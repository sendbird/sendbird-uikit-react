import React, {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Role } from '@sendbird/chat';
import type { Member, MemberListQuery, MemberListQueryParams } from '@sendbird/chat/groupChannel';

import Modal from '../../../../ui/Modal';
import UserListItem, { type UserListItemProps } from '../../../../ui/UserListItem';
import { noop } from '../../../../utils/utils';

import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

export interface MembersModalProps {
  onCancel(): void;
  renderUserListItem?: (props: UserListItemProps & { index: number }) => ReactNode;
  memberListQueryParams?: MemberListQueryParams;
}

export function MembersModal({
  onCancel,
  renderUserListItem = (props) => <UserListItem {...props} />,
  memberListQueryParams = {},
}: MembersModalProps): ReactElement {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberQuery, setMemberQuery] = useState<MemberListQuery | null>(null);

  const { channel } = useChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    const memberListQuery = channel?.createMemberListQuery({
      limit: 20,
      ...memberListQueryParams,
    });
    memberListQuery?.next().then((members) => {
      setMembers(members);
    });
    setMemberQuery(memberListQuery ?? null);
  }, []);
  return (
    <div>
      <Modal
        isFullScreenOnMobile
        hideFooter
        onCancel={() => onCancel()}
        onSubmit={noop}
        titleText={stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS}
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={useOnScrollPositionChangeDetector({
            onReachedBottom: async () => {
              if (memberQuery && memberQuery.hasNext) {
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
          {members.map((member: Member, index) => (
            <React.Fragment key={member.userId}>
              {
                renderUserListItem({
                  index,
                  user: member,
                  channel,
                  renderListItemMenu: (props) => (
                    <UserListItemMenu
                      {...props}
                      onToggleOperatorState={({ newStatus: isOperator }) => {
                        const newMembers = [...members];
                        for (const newMember of newMembers) {
                          if (newMember.userId === member.userId) {
                            newMember.role = isOperator ? Role.OPERATOR : Role.NONE;
                            break;
                          }
                        }
                        setMembers(newMembers);
                      }}
                      onToggleMuteState={({ newStatus: isMuted }) => {
                        const newMembers = [...members];
                        for (const newMember of newMembers) {
                          if (newMember.userId === member.userId) {
                            newMember.isMuted = isMuted;
                            break;
                          }
                        }
                        setMembers(newMembers);
                      }}
                      onToggleBanState={() => {
                        setMembers(members.filter(({ userId }) => {
                          return userId !== member.userId;
                        }));
                      }}
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

export default MembersModal;

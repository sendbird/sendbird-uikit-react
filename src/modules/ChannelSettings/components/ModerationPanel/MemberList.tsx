import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
  ReactNode,
} from 'react';
import type { Member, MemberListQueryParams } from '@sendbird/chat/groupChannel';
import { Role } from '@sendbird/chat';

import { LocalizationContext } from '../../../../lib/LocalizationContext';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

import UserListItem, { UserListItemProps } from '../../../../ui/UserListItem';
import MembersModal from './MembersModal';
import { InviteUsersModal } from './InviteUsersModal';
import useChannelSettings from '../../context/useChannelSettings';

interface MemberListProps {
  renderUserListItem?: (props: UserListItemProps & { index: number }) => ReactNode;
  memberListQueryParams?: MemberListQueryParams;
}
export const MemberList = ({
  renderUserListItem = (props) => <UserListItem {...props} />,
  memberListQueryParams = {},
}: MemberListProps): ReactElement => {
  const [members, setMembers] = useState<Array<Member>>([]);
  const [hasNext, setHasNext] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showInviteUsers, setShowInviteUsers] = useState(false);
  const { state: { channel, forceUpdateUI } } = useChannelSettings();
  const { stringSet } = useContext(LocalizationContext);

  const isOperator = channel.myRole === Role.OPERATOR;
  const refreshList = useCallback(() => {
    if (!channel) {
      setMembers([]);
      return;
    }
    const memberUserListQuery = channel?.createMemberListQuery({ limit: 10, ...memberListQueryParams });
    memberUserListQuery.next().then((members) => {
      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel?.url, channel?.createMemberListQuery]);
  useEffect(refreshList, [channel?.url]);

  return (
    <div className="sendbird-channel-settings-member-list">
      {
        members.map((member, index) => (
          <React.Fragment key={member.userId}>
            {
              renderUserListItem({
                // NOTE: This `index` is used to display the current user's user item at the top when customizing externally.
                index,
                user: member,
                channel,
                size: 'small',
                avatarSize: '24px',
                renderListItemMenu: isOperator
                  ? (props) => (
                    <UserListItemMenu {...props}
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
                  )
                  : () => <></>,
              })
            }
          </React.Fragment>
        ))
      }
      <div className="sendbird-channel-settings-accordion__footer">
        {
          hasNext && (
            <Button
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => setShowAllMembers(true)}
            >
              {stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS}
            </Button>
          )
        }
        <Button
          type={ButtonTypes.SECONDARY}
          size={ButtonSizes.SMALL}
          onClick={() => setShowInviteUsers(true)}
        >
          {stringSet.CHANNEL_SETTING__MEMBERS__INVITE_MEMBER}
        </Button>
      </div>
      {
        showAllMembers && (
          <MembersModal
            onCancel={() => {
              setShowAllMembers(false);
              refreshList();
              forceUpdateUI();
            }}
            renderUserListItem={renderUserListItem}
            memberListQueryParams={memberListQueryParams}
          />
        )
      }
      {
        showInviteUsers && (
          <InviteUsersModal
            onCancel={() => setShowInviteUsers(false)}
            onSubmit={() => {
              setShowInviteUsers(false);
              refreshList();
              forceUpdateUI();
            }}
            renderUserListItem={renderUserListItem}
          />
        )
      }
    </div>
  );
};

export default MemberList;

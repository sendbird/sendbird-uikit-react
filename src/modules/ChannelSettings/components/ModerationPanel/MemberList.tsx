import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
  ReactNode,
} from 'react';
import type { Member } from '@sendbird/chat/groupChannel';
import { Role } from '@sendbird/chat';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

import UserListItem, { UserListItemProps } from '../../../../ui/UserListItem';
import MembersModal from './MembersModal';
import { InviteUsersModal } from './InviteUsersModal';

interface MemberListProps {
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
}
export const MemberList = ({
  renderUserListItem = (props) => <UserListItem {...props} />,
}: MemberListProps): ReactElement => {
  const [members, setMembers] = useState<Array<Member>>([]);
  const [hasNext, setHasNext] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showInviteUsers, setShowInviteUsers] = useState(false);
  const {
    channel,
    forceUpdateUI,
  } = useChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);

  const refreshList = useCallback(() => {
    if (!channel) {
      setMembers([]);
      return;
    }
    const memberUserListQuery = channel?.createMemberListQuery({ limit: 10 });
    memberUserListQuery.next().then((members) => {
      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel?.url, channel?.createMemberListQuery]);
  useEffect(refreshList, [channel?.url]);

  return (
    <div className="sendbird-channel-settings-member-list">
      {
        members.map((member) => (
          renderUserListItem({
            key: member.userId,
            user: member,
            channel,
            size: 'small',
            avatarSize: '24px',
            renderListItemMenu: (props) => (
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
            ),
          })
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

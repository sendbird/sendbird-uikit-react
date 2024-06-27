import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import type { Member } from '@sendbird/chat/groupChannel';
import { Role } from '@sendbird/chat';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';
import uuidv4 from '../../../../utils/uuid';

import UserListItem from '../UserListItem';
import MembersModal from './MembersModal';
import InviteUsers from './InviteUsersModal';

export const MemberList = (): ReactElement => {
  const [members, setMembers] = useState<Array<Member>>([]);
  const [hasNext, setHasNext] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showInviteUsers, setShowInviteUsers] = useState(false);
  const {
    channel,
    setChannelUpdateId,
  } = useChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    if (!channel) {
      setMembers([]);
      return;
    }

    const memberUserListQuery = channel?.createMemberListQuery({ limit: 10 });
    memberUserListQuery.next().then((members) => {
      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);

  const refreshList = useCallback(() => {
    if (!channel) {
      setMembers([]);
      return;
    }
    const memberUserListQuery = channel?.createMemberListQuery({ limit: 10 });
    memberUserListQuery.next().then((members) => {
      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
      setChannelUpdateId?.(uuidv4());
    });
  }, [channel]);

  return (
    <div className="sendbird-channel-settings-member-list">
      {
        members.map((member) => (
          <UserListItem
            key={member.userId}
            user={member}
            channel={channel}
            renderListItemMenu={(props) => (
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
            )}
          />
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
            }}
          />
        )
      }
      {
        showInviteUsers && (
          <InviteUsers
            onSubmit={() => {
              setShowInviteUsers(false);
              refreshList();
            }}
            onCancel={() => setShowInviteUsers(false)}
          />
        )
      }
    </div>
  );
};

export default MemberList;

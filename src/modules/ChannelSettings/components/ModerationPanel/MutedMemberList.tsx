import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import type { Member, MemberListQueryParams } from '@sendbird/chat/groupChannel';

import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { useLocalization } from '../../../../lib/LocalizationContext';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';
import UserListItem, { UserListItemProps } from '../../../../ui/UserListItem';
import MutedMembersModal from './MutedMembersModal';

interface MutedMemberListProps {
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
  memberListQueryParams?: MemberListQueryParams;
}
export const MutedMemberList = ({
  renderUserListItem = (props) => <UserListItem {...props} />,
  memberListQueryParams = {},
}: MutedMemberListProps): ReactElement => {
  const [members, setMembers] = useState<Member[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { stringSet } = useLocalization();

  const { channel } = useChannelSettingsContext();

  const refreshList = useCallback(() => {
    if (!channel) {
      setMembers([]);
      return;
    }
    const memberUserListQuery = channel?.createMemberListQuery({
      limit: 10,
      ...memberListQueryParams,
      // @ts-ignore
      mutedMemberFilter: 'muted',
    });
    memberUserListQuery.next().then((members) => {
      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel?.url, channel?.createMemberListQuery]);
  useEffect(refreshList, [channel?.url]);

  return (
    <>
      {
        members.map((member) => (
          <React.Fragment key={member.userId}>
            {
              renderUserListItem({
                user: member,
                channel,
                size: 'small',
                avatarSize: '24px',
                renderListItemMenu: (props) => (
                  <UserListItemMenu {...props}
                    onToggleMuteState={() => {
                      // Limitation to server-side table update delay.
                      setTimeout(() => {
                        refreshList();
                      }, 500);
                    }}
                    renderMenuItems={({ items }) => (<items.MuteToggleMenuItem />)}
                  />
                ),
              })
            }
          </React.Fragment>
        ))
      }
      {
        members && members.length === 0 && (
          <Label
            className="sendbird-channel-settings__empty-list"
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_3}
          >
            {stringSet.CHANNEL_SETTING__NO_UNMUTED}
          </Label>
        )
      }
      {
        hasNext && (
          <div className="sendbird-channel-settings-accordion__footer">
            <Button
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => {
                setShowModal(true);
              }}
            >
              {stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE_ALL}
            </Button>
          </div>
        )
      }
      {
        showModal && (
          <MutedMembersModal
            onCancel={() => {
              setShowModal(false);
              refreshList();
            }}
            renderUserListItem={renderUserListItem}
            memberListQueryParams={memberListQueryParams}
          />
        )
      }
    </>
  );
};

export default MutedMemberList;

import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
  ReactNode,
} from 'react';
import type { RestrictedUser } from '@sendbird/chat';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import
Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';

import UserListItem, { UserListItemProps } from '../../../../ui/UserListItem';
import BannedUsersModal from './BannedUsersModal';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

interface BannedUserListProps {
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
}

export const BannedUserList = ({
  renderUserListItem = (props) => <UserListItem {...props} />,
}: BannedUserListProps): ReactElement => {
  const [members, setMembers] = useState<RestrictedUser[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { stringSet } = useContext(LocalizationContext);
  const { channel } = useChannelSettingsContext();

  const refreshList = useCallback(() => {
    if (!channel) {
      setMembers([]);
      return;
    }
    const bannedUserListQuery = channel?.createBannedUserListQuery({ limit: 10 });
    bannedUserListQuery.next().then((users) => {
      setMembers(users);
      setHasNext(bannedUserListQuery.hasNext);
    });
  }, [channel?.url, channel?.createBannedUserListQuery]);
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
                  <UserListItemMenu
                    {...props}
                    isBanned
                    onToggleBanState={() => refreshList()}
                    renderMenuItems={({ items }) => (<items.BanToggleMenuItem />)}
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
            {stringSet.CHANNEL_SETTING__MODERATION__EMPTY_BAN}
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
              {stringSet.CHANNEL_SETTING__MODERATION__ALL_BAN}
            </Button>
          </div>
        )
      }
      {
        showModal && (
          <BannedUsersModal
            onCancel={() => {
              setShowModal(false);
              refreshList();
            }}
            renderUserListItem={renderUserListItem}
          />
        )
      }
    </>
  );
};

/** @deprecated Use the BannedUserList instead */
export const BannedMemberList = BannedUserList; // For legacy
export default BannedUserList;

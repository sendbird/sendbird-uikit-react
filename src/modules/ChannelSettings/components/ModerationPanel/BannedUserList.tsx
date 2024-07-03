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

import UserListItem, { UserListItemProps } from '../UserListItem';
import BannedUsersModal, { type BannedUsersModalProps } from './BannedUsersModal';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

interface BannedUserListProps {
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
  renderBannedUsersModal?: (props: BannedUsersModalProps) => ReactNode;
}

export const BannedMemberList = ({
  renderUserListItem = (props) => <UserListItem {...props} />,
  renderBannedUsersModal = (props) => <BannedUsersModal {...props} />,
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
          renderUserListItem({
            key: member.userId,
            user: member,
            channel,
            renderListItemMenu: (props) => (
              <UserListItemMenu
                {...props}
                isBanned
                onToggleBanState={() => refreshList()}
                renderMenuItems={({ items }) => (<items.BanToggleMenuItem />)}
              />
            ),
          })
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
          renderBannedUsersModal({
            onCancel: () => {
              setShowModal(false);
              refreshList();
            },
          })
        )
      }
    </>
  );
};

export default BannedMemberList;

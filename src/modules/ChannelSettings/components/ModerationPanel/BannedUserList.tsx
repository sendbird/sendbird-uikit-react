import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import { BannedUserListQueryParams, RestrictedUser } from '@sendbird/chat';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import
Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';

import UserListItem from '../UserListItem';
import BannedUsersModal from './BannedUsersModal';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

export const BannedMemberList = (): ReactElement => {
  const [members, setMembers] = useState<RestrictedUser[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { stringSet } = useContext(LocalizationContext);
  const { channel } = useChannelSettingsContext();

  const bannedUserListQueryParams: BannedUserListQueryParams = { limit: 10 };
  useEffect(() => {
    if (!channel) {
      setMembers([]);
      return;
    }
    const bannedUserListQuery = channel?.createBannedUserListQuery(bannedUserListQueryParams);
    bannedUserListQuery.next().then((users) => {
      setMembers(users);
      setHasNext(bannedUserListQuery.hasNext);
    });
  }, [channel]);

  const refreshList = useCallback(() => {
    if (!channel) {
      setMembers([]);
      return;
    }
    const bannedUserListQuery = channel?.createBannedUserListQuery(bannedUserListQueryParams);
    bannedUserListQuery.next().then((users) => {
      setMembers(users);
      setHasNext(bannedUserListQuery.hasNext);
    });
  }, [channel]);

  return (
    <>
      {
        members.map((member) => (
          <UserListItem
            key={member.userId}
            user={member}
            channel={channel}
            renderListItemMenu={(props) => (
              <UserListItemMenu
                {...props}
                isBanned
                onToggleBanState={() => refreshList()}
                renderMenuItems={({ items }) => (<items.BanToggleMenuItem />)}
              />
            )}
          />
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
          <div
            className="sendbird-channel-settings-accordion__footer"
          >
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
          />
        )
      }
    </>
  );
};

export default BannedMemberList;

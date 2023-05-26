import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import { BannedUserListQueryParams } from '@sendbird/chat';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import
Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import UserListItem from '../UserListItem';
import BannedUsersModal from './BannedUsersModal';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

export const BannedMemberList = (): ReactElement => {
  const [members, setMembers] = useState([]);
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
            action={({ actionRef, parentRef }) => {
              return (
                <ContextMenu
                  menuTrigger={(toggleDropdown) => (
                    <IconButton
                      className="sendbird-user-message__more__menu"
                      width="32px"
                      height="32px"
                      onClick={toggleDropdown}
                    >
                      <Icon
                        width="24px"
                        height="24px"
                        type={IconTypes.MORE}
                        fillColor={IconColors.CONTENT_INVERSE}
                      />
                    </IconButton>
                  )}
                  menuItems={(closeDropdown) => (
                    <MenuItems
                      parentContainRef={parentRef}
                      parentRef={actionRef} // for catching location(x, y) of MenuItems
                      closeDropdown={closeDropdown}
                      openLeft
                    >
                      <MenuItem
                        onClick={() => {
                          channel?.unbanUser(member).then(() => {
                            closeDropdown();
                            refreshList();
                          });
                        }}
                        dataId="unban"
                      >
                        {stringSet.CHANNEL_SETTING__MODERATION__UNBAN}
                      </MenuItem>
                    </MenuItems>
                  )}
                />
              );
            }}
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

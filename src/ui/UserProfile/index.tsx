import './index.scss';
import React, { ReactElement, useContext } from 'react';
import type { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import type { User } from '@sendbird/chat';

import { LocalizationContext } from '../../lib/LocalizationContext';
import { UserProfileContext } from '../../lib/UserProfileContext';
import { getCreateGroupChannel } from '../../lib/selectors';
import Avatar from '../Avatar/index';
import Label, { LabelColors, LabelTypography } from '../Label';
import Button, { ButtonTypes } from '../Button';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

interface Logger {
  info?(message: string, channel: GroupChannel): void;
}

interface Props {
  user: User;
  currentUserId?: string;
  logger?: Logger;
  disableMessaging?: boolean;
  createChannel?(params: GroupChannelCreateParams): Promise<GroupChannel>;
  onSuccess?: () => void;
}

function UserProfile({
  user,
  currentUserId,
  disableMessaging = false,
  onSuccess,
}: Props): ReactElement {
  const store = useSendbirdStateContext();
  const createChannel = getCreateGroupChannel(store);
  const logger = store?.config?.logger;
  const { stringSet } = useContext(LocalizationContext);
  const currentUserId_ = currentUserId || store?.config?.userId;
  // @ts-ignore
  const { onUserProfileMessage } = useContext(UserProfileContext);
  return (
    <div className="sendbird__user-profile">
      <section className="sendbird__user-profile-avatar">
        <Avatar
          height="80px"
          width="80px"
          src={user?.profileUrl}
        />
      </section>
      <section className="sendbird__user-profile-name">
        <Label
          type={LabelTypography.H_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {user?.nickname || stringSet.NO_NAME}
        </Label>
      </section>
      {
        (user?.userId !== currentUserId_) && !disableMessaging && (
          <section className="sendbird__user-profile-message">
            <Button
              type={ButtonTypes.SECONDARY}
              onClick={() => {
                // Create 1:1 channel
                const params: GroupChannelCreateParams = {
                  isDistinct: false,
                  invitedUserIds: [user?.userId],
                  operatorUserIds: [currentUserId_],
                };
                onSuccess();
                createChannel(params)
                  .then((groupChannel) => {
                    logger.info('UserProfile, channel create', groupChannel);
                    if (typeof onUserProfileMessage === 'function') {
                      onUserProfileMessage?.(groupChannel);
                    }
                  });
              }}
            >
              {stringSet.USER_PROFILE__MESSAGE}
            </Button>
          </section>
        )
      }
      <div className="sendbird__user-profile-separator" />
      <section className="sendbird__user-profile-userId">
        <Label
          className="sendbird__user-profile-userId--label"
          type={LabelTypography.CAPTION_2}
          color={LabelColors.ONBACKGROUND_2}
        >
          {stringSet.USER_PROFILE__USER_ID}
        </Label>
        <Label
          className="sendbird__user-profile-userId--value"
          type={LabelTypography.BODY_1}
          color={LabelColors.ONBACKGROUND_1}
        >
          {user?.userId}
        </Label>
      </section>
    </div>
  );
}

export default UserProfile;

import './index.scss';
import React, { ReactElement, useContext } from 'react';
import type { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import type { User } from '@sendbird/chat';

import { LocalizationContext } from '../../lib/LocalizationContext';
import { useUserProfileContext } from '../../lib/UserProfileContext';
import { getCreateGroupChannel } from '../../lib/selectors';
import Avatar from '../Avatar/index';
import Label, { LabelColors, LabelTypography } from '../Label';
import Button, { ButtonTypes } from '../Button';
import useSendbird from '../../lib/Sendbird/context/hooks/useSendbird';

interface Logger {
  info?(message: string, channel: GroupChannel): void;
}

interface Props {
  user?: User | null;
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
  const { state } = useSendbird();
  const createChannel = getCreateGroupChannel(state);
  const logger = state?.config?.logger;
  const { stringSet } = useContext(LocalizationContext);
  const currentUserId_ = currentUserId || state?.config?.userId;
  const { onStartDirectMessage, onBeforeCreateChannel } = useUserProfileContext();
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
                  invitedUserIds: user?.userId ? [user?.userId] : [],
                  operatorUserIds: [currentUserId_],
                };
                onSuccess?.();
                const startDirectMessage = (groupChannel: GroupChannel) => {
                  logger.info('UserProfile: channel create', groupChannel);
                  onStartDirectMessage?.(groupChannel);
                };
                if (onBeforeCreateChannel) {
                  Promise.resolve()
                    .then(() => onBeforeCreateChannel(params, user ? [user] : []))
                    .then((processedParams) => createChannel(processedParams))
                    .then(startDirectMessage)
                    .catch((error) => logger.error('UserProfile: channel create failed', error));
                } else {
                  createChannel(params).then(startDirectMessage);
                }
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

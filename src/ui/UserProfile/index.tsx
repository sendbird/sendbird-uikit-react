import './index.scss';
import React, { ReactElement, useContext } from 'react';
import type { GroupChannel, GroupChannelCreateParams, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import type { User } from '@sendbird/chat';

import { LocalizationContext } from '../../lib/LocalizationContext';
import withSendbirdContext from '../../lib/SendbirdSdkContext';
import { getSdk, createGroupChannel } from '../../lib/selectors';
import Avatar from '../Avatar/index';
import Label, { LabelColors, LabelTypography } from '../Label';
import Button, { ButtonTypes } from '../Button';

interface Logger {
  info?(message: string, channel: GroupChannel): void;
}

interface Props {
  user: User;
  currentUserId?: string;
  sdk?: SendbirdGroupChat;
  logger?: Logger;
  disableMessaging?: boolean;
  createChannel?(params: GroupChannelCreateParams): Promise<GroupChannel>;
  onSuccess?(): void;
}

function UserProfile({
  user,
  currentUserId,
  sdk,
  logger,
  disableMessaging = false,
  createChannel,
  onSuccess,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
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
        (user?.userId !== currentUserId) && !disableMessaging && (
          <section className="sendbird__user-profile-message">
            <Button
              type={ButtonTypes.SECONDARY}
              onClick={() => {
                const params: GroupChannelCreateParams = {
                  isDistinct: true,
                  invitedUserIds: [user?.userId],
                };
                onSuccess();
                createChannel(params)
                  .then((groupChannel) => {
                    logger.info('UserProfile, channel create', groupChannel);
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

const mapStoreToProps = (store) => ({
  sdk: getSdk(store),
  createChannel: createGroupChannel(store),
  logger: store.config.logger,
  pubsub: store.config.pubSub,
});

const ConnectedUserProfile = withSendbirdContext(UserProfile, mapStoreToProps);

export default ConnectedUserProfile;

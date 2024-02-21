import React, { useEffect, useState } from 'react';
import { GroupChannel, GroupChannelUpdateParams } from '@sendbird/chat/groupChannel';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { RenderUserProfileProps } from '../../../types';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import uuidv4 from '../../../utils/uuid';
import { useAsyncRequest } from '../../../hooks/useAsyncRequest';

interface ApplicationUserListQuery {
  limit?: number;
  userIdsFilter?: Array<string>;
  metaDataKeyFilter?: string;
  metaDataValuesFilter?: Array<string>;
}

interface ChannelSettingsQueries {
  applicationUserListQuery?: ApplicationUserListQuery;
}

type OverrideInviteUserType = {
  users: Array<string>;
  onClose: () => void;
  channel: GroupChannel;
};

export type ChannelSettingsContextProps = {
  children?: React.ReactElement;
  channelUrl: string;
  className?: string;
  onCloseClick?(): void;
  onLeaveChannel?(): void;
  overrideInviteUser?(params: OverrideInviteUserType): void;
  onChannelModified?(channel: GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): GroupChannelUpdateParams;
  queries?: ChannelSettingsQueries;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  disableUserProfile?: boolean;
};

interface ChannelSettingsProviderInterface {
  channelUrl: string;
  onCloseClick?(): void;
  onLeaveChannel?(): void;
  overrideInviteUser?(params: OverrideInviteUserType): void;
  onChannelModified?(channel: GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): GroupChannelUpdateParams;
  queries?: ChannelSettingsQueries;
  setChannelUpdateId(uniqId: string): void;
  forceUpdateUI(): void;
  channel: GroupChannel | null;
  loading: boolean;
  invalidChannel: boolean;
}

const ChannelSettingsContext = React.createContext<ChannelSettingsProviderInterface | null>(null);

const ChannelSettingsProvider = ({
  children,
  className,
  channelUrl,
  onCloseClick,
  onLeaveChannel,
  onChannelModified,
  overrideInviteUser,
  onBeforeUpdateChannel,
  queries,
  renderUserProfile,
  disableUserProfile,
}: ChannelSettingsContextProps) => {
  const { config, stores } = useSendbirdStateContext();
  const { sdkStore } = stores;
  const { logger, onUserProfileMessage } = config;

  // hack to keep track of channel updates by triggering useEffect
  const [channelUpdateId, setChannelUpdateId] = useState(() => uuidv4());
  const forceUpdateUI = () => setChannelUpdateId(uuidv4());

  const {
    response = null,
    loading,
    error,
    refresh,
  } = useAsyncRequest(
    async () => {
      logger.info('ChannelSettings: fetching channel');

      let errorMessage: string | undefined;

      if (!channelUrl) {
        errorMessage = 'channel url is required';
      } else if (!sdkStore.initialized || !sdkStore.sdk) {
        errorMessage = 'SDK is not initialized';
      } else if (!sdkStore.sdk.groupChannel) {
        errorMessage = 'GroupChannelModule is not specified in the SDK';
      }

      if (errorMessage) {
        logger.warning(`ChannelSettings: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      return sdkStore.sdk.groupChannel.getChannel(channelUrl);
    },
    { resetResponseOnRefresh: true },
  );

  useEffect(() => {
    refresh();
  }, [channelUrl, channelUpdateId]);

  return (
    <ChannelSettingsContext.Provider
      value={{
        channelUrl,
        onCloseClick,
        onLeaveChannel,
        onChannelModified,
        onBeforeUpdateChannel,
        queries,
        overrideInviteUser,
        setChannelUpdateId,
        forceUpdateUI,
        channel: response,
        loading,
        invalidChannel: Boolean(error),
      }}
    >
      <UserProfileProvider
        renderUserProfile={renderUserProfile}
        disableUserProfile={disableUserProfile ?? config?.disableUserProfile}
        onUserProfileMessage={onUserProfileMessage}
      >
        <div className={`sendbird-channel-settings ${className}`}>{children}</div>
      </UserProfileProvider>
    </ChannelSettingsContext.Provider>
  );
};

const useChannelSettingsContext = () => React.useContext(ChannelSettingsContext);
export { ChannelSettingsProvider, useChannelSettingsContext };

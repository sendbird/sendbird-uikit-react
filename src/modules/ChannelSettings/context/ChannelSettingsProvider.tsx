import React, { ReactNode, useEffect, useState } from 'react';
import { GroupChannel, GroupChannelHandler, GroupChannelUpdateParams } from '@sendbird/chat/groupChannel';

import type { UserListItemProps } from '../../../ui/UserListItem';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { UserProfileProvider, UserProfileProviderProps } from '../../../lib/UserProfileContext';
import uuidv4 from '../../../utils/uuid';
import { useAsyncRequest } from '../../../hooks/useAsyncRequest';
import compareIds from '../../../utils/compareIds';

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

interface CommonChannelSettingsProps {
  channelUrl: string;
  onCloseClick?(): void;
  onLeaveChannel?(): void;
  onChannelModified?(channel: GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File | null, data: string | undefined): GroupChannelUpdateParams;
  overrideInviteUser?(params: OverrideInviteUserType): void;
  queries?: ChannelSettingsQueries;
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
}
export interface ChannelSettingsContextProps extends
  CommonChannelSettingsProps,
  Pick<UserProfileProviderProps, 'renderUserProfile' | 'disableUserProfile'> {
  children?: React.ReactElement;
  className?: string;
}

interface ChannelSettingsProviderInterface extends CommonChannelSettingsProps {
  setChannelUpdateId(uniqId: string): void;
  forceUpdateUI(): void;
  channel: GroupChannel | null;
  loading: boolean;
  invalidChannel: boolean;
}

const ChannelSettingsContext = React.createContext<ChannelSettingsProviderInterface | null>(null);

const ChannelSettingsProvider = (props: ChannelSettingsContextProps) => {
  const {
    children,
    className,
    channelUrl,
    onCloseClick,
    onLeaveChannel,
    onChannelModified,
    overrideInviteUser,
    onBeforeUpdateChannel,
    queries,
    renderUserListItem,
  } = props;
  const { config, stores } = useSendbirdStateContext();
  const { sdkStore } = stores;
  const { logger } = config;
  const [channelHandlerId, setChannelHandlerId] = useState<string>();

  // hack to keep track of channel updates by triggering useEffect
  const [channelUpdateId, setChannelUpdateId] = useState(() => uuidv4());
  const forceUpdateUI = () => setChannelUpdateId(uuidv4());

  const {
    response: channel = null,
    loading,
    error,
    refresh,
  } = useAsyncRequest(
    async () => {
      logger.info('ChannelSettings: fetching channel');

      if (!channelUrl) {
        logger.warning('ChannelSettings: channel url is required');
        return;
      } else if (!sdkStore.initialized || !sdkStore.sdk) {
        logger.warning('ChannelSettings: SDK is not initialized');
        return;
      } else if (!sdkStore.sdk.groupChannel) {
        logger.warning('ChannelSettings: GroupChannelModule is not specified in the SDK');
        return;
      }

      try {
        if (channelHandlerId) {
          if (sdkStore.sdk?.groupChannel?.removeGroupChannelHandler) {
            logger.info('ChannelSettings: Removing message reciver handler', channelHandlerId);
            sdkStore.sdk.groupChannel.removeGroupChannelHandler(channelHandlerId);
          } else if (sdkStore.sdk?.groupChannel) {
            logger.error('ChannelSettings: Not found the removeGroupChannelHandler');
          }

          setChannelHandlerId(undefined);
        }

        // FIXME :: refactor below code by new state management protocol
        const channel = await sdkStore.sdk.groupChannel.getChannel(channelUrl);
        const channelHandler: GroupChannelHandler = {
          onUserLeft: (channel, user) => {
            if (compareIds(channel?.url, channelUrl)) {
              logger.info('ChannelSettings: onUserLeft', { channel, user });
              refresh();
            }
          },
          onUserBanned: (channel, user) => {
            if (compareIds(channel?.url, channelUrl) && channel.isGroupChannel()) {
              logger.info('ChannelSettings: onUserBanned', { channel, user });
              refresh();
            }
          },
        };

        const newChannelHandlerId = uuidv4();
        sdkStore.sdk.groupChannel?.addGroupChannelHandler(newChannelHandlerId, new GroupChannelHandler(channelHandler));
        setChannelHandlerId(newChannelHandlerId);

        return channel;
      } catch (error) {
        logger.error('ChannelSettings: fetching channel error:', error);
        throw error;
      }
    },
    {
      resetResponseOnRefresh: true,
      persistLoadingIfNoResponse: true,
      deps: [sdkStore.initialized, sdkStore.sdk.groupChannel],
    },
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
        channel,
        loading,
        invalidChannel: Boolean(error),
        renderUserListItem,
      }}
    >
      <UserProfileProvider {...props}>
        <div className={`sendbird-channel-settings ${className}`}>{children}</div>
      </UserProfileProvider>
    </ChannelSettingsContext.Provider>
  );
};

const useChannelSettingsContext = () => {
  const context = React.useContext(ChannelSettingsContext);
  if (!context) throw new Error('ChannelSettingsContext not found. Use within the ChannelSettings module');

  return context;
};
export { ChannelSettingsProvider, useChannelSettingsContext };

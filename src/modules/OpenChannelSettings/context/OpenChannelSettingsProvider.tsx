import React, {
  useEffect,
  useState,
} from 'react';
import { OpenChannel, OpenChannelHandler, OpenChannelUpdateParams } from '@sendbird/chat/openChannel';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import { RenderUserProfileProps } from '../../../types';
import uuidv4 from '../../../utils/uuid';

export interface OpenChannelSettingsContextProps {
  channelUrl: string;
  children?: React.ReactElement;
  onCloseClick?(): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): OpenChannelUpdateParams;
  onChannelModified?(channel: OpenChannel): void;
  onDeleteChannel?(channel: OpenChannel): void;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
}

interface OpenChannelSettingsContextType {
  channelUrl: string;
  channel?: OpenChannel;
  isChannelInitialized: boolean;
  setChannel?: React.Dispatch<React.SetStateAction<OpenChannel>>;
  onCloseClick?(): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): OpenChannelUpdateParams;
  onChannelModified?(channel: OpenChannel): void;
  onDeleteChannel?(channel: OpenChannel): void;
}

const OpenChannelSettingsContext = React.createContext<OpenChannelSettingsContextType | null>(undefined);

const OpenChannelSettingsProvider: React.FC<OpenChannelSettingsContextProps> = (props: OpenChannelSettingsContextProps) => {
  const {
    children,
    channelUrl,
    onCloseClick,
    onChannelModified,
    onBeforeUpdateChannel,
    onDeleteChannel,
  } = props;

  // fetch store from <SendbirdProvider />
  const globalStore = useSendbirdStateContext();
  const sdk = globalStore?.stores?.sdkStore?.sdk;
  const isSDKInitialized = globalStore?.stores?.sdkStore?.initialized;

  const logger = globalStore?.config?.logger;
  const currentUserId = sdk?.currentUser?.userId;

  const [currentChannel, setChannel] = useState<OpenChannel | null>(null);
  const [isChannelInitialized, setChannelInitialized] = useState(false);
  useEffect(() => {
    if (!channelUrl || !sdk.openChannel) {
      setChannel(null);
      return;
    }

    sdk.openChannel.getChannel(channelUrl)
      .then((channel) => {
        logger.info('open channel setting: fetched', channel);
        // TODO: Add pending status
        channel.enter()
          .then(() => {
            setChannel(channel);
            logger.info('OpenChannelSettings | Succeeded to enter channel', channel?.url);
            setChannelInitialized(true);
          })
          .catch((error) => {
            setChannel(null);
            logger.warning('OpenChannelSettings | Failed to enter channel', error);
          });
      })
      .catch((error) => {
        logger.error('open channel setting: error fetching', error);
        setChannel(null);
      });
    return () => {
      if (currentChannel && currentChannel.exit) {
        currentChannel.exit()
          .then(() => {
            logger.info('OpenChannelSettings | Succeeded to exit channel', currentChannel?.url);
          })
          .catch((error) => {
            logger.warning('OpenChannelSettings | Failed to exit channel', error);
          });
      }
    };
  }, [channelUrl, isSDKInitialized]);

  useEffect(() => {
    const channelHandlerId = uuidv4();
    if (currentChannel !== null && sdk?.openChannel?.addOpenChannelHandler) {
      const channelHandlerParams = new OpenChannelHandler({
        onOperatorUpdated(channel) {
          if (channel?.url === currentChannel?.url) {
            setChannel(channel as OpenChannel);
          }
        },
        onUserMuted(channel, user) {
          if (channel?.url === currentChannel?.url && user?.userId === currentUserId) {
            setChannel(channel as OpenChannel);
          }
        },
        onUserUnmuted(channel, user) {
          if (channel?.url === currentChannel?.url && user?.userId === currentUserId) {
            setChannel(channel as OpenChannel);
          }
        },
        onUserBanned(channel, user) {
          if (channel?.url === currentChannel?.url && user?.userId === currentUserId) {
            setChannel(null);
          }
        },
        onUserUnbanned(channel, user) {
          if (user?.userId === currentUserId) {
            setChannel(channel as OpenChannel);
          }
        },
        onChannelChanged(channel) {
          if (channel?.url === currentChannel?.url) {
            setChannel(channel as OpenChannel);
          }
        },
        onChannelDeleted(channelUrl) {
          if (channelUrl === currentChannel?.url) {
            setChannel(null);
          }
        },
      });
      sdk.openChannel.addOpenChannelHandler(channelHandlerId, channelHandlerParams);
    }
    return () => {
      if (sdk?.openChannel?.removeOpenChannelHandler && channelHandlerId) {
        logger.info('OpenChannelSettings | Removing channel handlers', channelHandlerId);
        sdk.openChannel.removeOpenChannelHandler?.(channelHandlerId);
      }
    };
  }, [channelUrl]);

  return (
    <OpenChannelSettingsContext.Provider value={{
      channelUrl,
      channel: currentChannel,
      isChannelInitialized: isChannelInitialized,
      setChannel,
      onCloseClick,
      onChannelModified,
      onBeforeUpdateChannel,
      onDeleteChannel,
    }}>
      <UserProfileProvider
        isOpenChannel
        renderUserProfile={props?.renderUserProfile}
        disableUserProfile={props?.disableUserProfile ?? globalStore?.config?.disableUserProfile}
      >
        {children}
      </UserProfileProvider>
    </OpenChannelSettingsContext.Provider>
  );
};

type useOpenChannelSettingsType = () => OpenChannelSettingsContextType;
const useOpenChannelSettingsContext: useOpenChannelSettingsType = () => React.useContext(OpenChannelSettingsContext);

export {
  OpenChannelSettingsProvider,
  useOpenChannelSettingsContext,
};

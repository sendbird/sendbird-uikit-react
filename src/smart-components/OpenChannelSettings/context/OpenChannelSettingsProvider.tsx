import React, {
  useEffect,
  useState,
} from 'react';
import type { OpenChannel, OpenChannelUpdateParams, SendbirdOpenChat } from '@sendbird/chat/openChannel';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import { RenderUserProfileProps } from '../../../types';

export interface OpenChannelSettingsContextProps {
  channelUrl: string;
  children?: React.ReactNode;
  onCloseClick?(): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): OpenChannelUpdateParams;
  onChannelModified?(channel: OpenChannel): void;
  onDeleteChannel?(channel: OpenChannel): void;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
}

interface OpenChannelSettingsContextType {
  channelUrl: string;
  channel?: OpenChannel;
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
  const sdk = globalStore?.stores?.sdkStore?.sdk as SendbirdOpenChat;

  const logger = globalStore?.config?.logger;

  const [channel, setChannel] = useState<OpenChannel | null>(null);
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
            logger.info('OpenChannelSettings | Succeeded to enter channel');
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
      if (channel && channel.exit) {
        channel.exit()
          .then(() => {
            logger.info('OpenChannelSettings | Succeeded to exit channel');
          })
          .catch((error) => {
            logger.warning('OpenChannelSettings | Failed to exit channel', error);
          });
      }
    }
  }, [channelUrl, sdk]);

  return (
    <OpenChannelSettingsContext.Provider value={{
      channelUrl,
      channel,
      setChannel,
      onCloseClick,
      onChannelModified,
      onBeforeUpdateChannel,
      onDeleteChannel,
    }}>
      <UserProfileProvider
        isOpenChannel
        renderUserProfile={props?.renderUserProfile}
        disableUserProfile={props?.disableUserProfile}
      >
        {children}
      </UserProfileProvider>
    </OpenChannelSettingsContext.Provider>
  );
}

type useOpenChannelSettingsType = () => OpenChannelSettingsContextType;
const useOpenChannelSettingsContext: useOpenChannelSettingsType = () => React.useContext(OpenChannelSettingsContext);

export {
  OpenChannelSettingsProvider,
  useOpenChannelSettingsContext,
};

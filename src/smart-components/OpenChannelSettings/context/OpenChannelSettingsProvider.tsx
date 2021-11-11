
import React, {
  useEffect,
  useState,
} from 'react';
import Sendbird from 'sendbird';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import { RenderUserProfileProps } from '../../../types';

export interface OpenChannelSettingsContextProps {
  channelUrl: string;
  children?: React.ReactNode;
  onCloseClick?(): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.OpenChannelParams;
  onChannelModified?(channel: Sendbird.OpenChannel): void;
  onDeleteChannel?(channel: Sendbird.OpenChannel): void;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
}

interface OpenChannelSettingsContextType {
  channelUrl: string;
  channel?: Sendbird.OpenChannel;
  setChannel?: React.Dispatch<React.SetStateAction<Sendbird.OpenChannel>>;
  onCloseClick?(): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.OpenChannelParams;
  onChannelModified?(channel: Sendbird.OpenChannel): void;
  onDeleteChannel?(channel: Sendbird.OpenChannel): void;
}

const OpenChannelSettingsContext = React.createContext<OpenChannelSettingsContextType|null>(undefined);

const OpenChannelSettingsProvider: React.FC<OpenChannelSettingsContextProps> = (props: OpenChannelSettingsContextProps) => {
  const {
    children,
    channelUrl,
    onCloseClick,
    onChannelModified,
    onBeforeUpdateChannel,
  } = props;

  // fetch store from <SendbirdProvider />
  const globalStore = useSendbirdStateContext();
  const sdk = globalStore?.stores?.sdkStore?.sdk;

  const logger = globalStore?.config?.logger;

  const [channel, setChannel] = useState<SendBird.OpenChannel | null>(null);
  useEffect(() => {
    if (!channelUrl || !sdk || !sdk.getConnectionState) {
      setChannel(null);
      return;
    }

    sdk.OpenChannel.getChannel(channelUrl, (openChannel, error) => {
      if (!error) {
        logger.error('open channel setting: fetched', openChannel);
        setChannel(openChannel);
      } else {
        logger.error('open channel setting: error fetching', error);
        setChannel(null);
      }
    });
  }, [channelUrl, sdk]);

  return (
    <OpenChannelSettingsContext.Provider value={{
      channelUrl,
      channel,
      setChannel,
      onCloseClick,
      onChannelModified,
      onBeforeUpdateChannel,
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
const useOpenChannelSettings: useOpenChannelSettingsType = () => React.useContext(OpenChannelSettingsContext);

export { OpenChannelSettingsProvider, useOpenChannelSettings };

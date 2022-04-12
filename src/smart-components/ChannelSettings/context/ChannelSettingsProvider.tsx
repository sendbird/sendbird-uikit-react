
import React, {
  useEffect,
  useState,
} from 'react';
import Sendbird from 'sendbird';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { RenderUserProfileProps } from '../../../types';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import uuidv4 from '../../../utils/uuid';

interface ApplicationUserListQuery {
  limit?: number;
  userIdsFilter?: Array<string>;
  metaDataKeyFilter?: string;
  metaDataValuesFilter?: Array<string>;
}

interface ChannelSettingsQueries {
  applicationUserListQuery?: ApplicationUserListQuery;
}

export type ChannelSettingsContextProps = {
  children: React.ReactNode;
  channelUrl: string;
  className?: string;
  onCloseClick?(): void;
  onChannelModified?(channel: Sendbird.GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.GroupChannelParams;
  queries?: ChannelSettingsQueries;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  disableUserProfile?: boolean;
}

interface ChannelSettingsProviderInterface {
  channelUrl: string;
  onCloseClick?(): void;
  onChannelModified?(channel: Sendbird.GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): Sendbird.GroupChannelParams;
  queries?: ChannelSettingsQueries;
  setChannelUpdateId(uniqId: string): void;
  forceUpdateUI(): void;
  channel: Sendbird.GroupChannel;
  invalidChannel: boolean;
}

const ChannelSettingsContext = React.createContext<ChannelSettingsProviderInterface|null>(undefined);

const ChannelSettingsProvider: React.FC<ChannelSettingsContextProps> = (props: ChannelSettingsContextProps) => {
  const {
    children,
    className,
    channelUrl,
    onCloseClick,
    onChannelModified,
    onBeforeUpdateChannel,
    queries,
  } = props;

  // fetch store from <SendbirdProvider />
  const globalStore = useSendbirdStateContext();
  const { config, stores } = globalStore;
  const { sdkStore } = stores;
  const { logger } = config;

  const { sdk, initialized } = sdkStore;

  // hack to keep track of channel updates by triggering useEffect
  const [channelUpdateId, setChannelUpdateId] = useState(uuidv4());
  const [channel, setChannel] = useState(null);
  const [invalidChannel, setInvalidChannel] = useState(false);

  const forceUpdateUI = () => {
    setChannelUpdateId(uuidv4());
  }

  useEffect(() => {
    logger.info('ChannelSettings: Setting up');
    if (!channelUrl || !initialized || !sdk) {
      logger.warning('ChannelSettings: Setting up failed', 'No channelUrl or sdk uninitialized');
      setInvalidChannel(false);
    } else {
      if (!sdk || !sdk.GroupChannel) {
        logger.warning('ChannelSettings: No GroupChannel');
        return;
      }
      sdk.GroupChannel.getChannel(channelUrl, (groupChannel) => {
        if (!groupChannel) {
          logger.warning('ChannelSettings: Channel not found');
          setInvalidChannel(true);
        } else {
          logger.info('ChannelSettings: Fetched group channel', groupChannel);
          setInvalidChannel(false);
          setChannel(groupChannel);
        }
      });
    }
  }, [channelUrl, initialized, channelUpdateId]);

  return (
    <ChannelSettingsContext.Provider value={{
      channelUrl,
      onCloseClick,
      onChannelModified,
      onBeforeUpdateChannel,
      queries,
      setChannelUpdateId,
      forceUpdateUI,
      channel,
      invalidChannel,
    }}>
      <UserProfileProvider
        renderUserProfile={props?.renderUserProfile}
        disableUserProfile={props?.disableUserProfile}
      >
        <div className={`sendbird-channel-settings ${className}`}>
          {children}
        </div>
      </UserProfileProvider>
    </ChannelSettingsContext.Provider>
  );
}

export type UseChannelSettingsType = () => ChannelSettingsProviderInterface;
const useChannelSettings: UseChannelSettingsType = () => React.useContext(ChannelSettingsContext);

export { ChannelSettingsProvider, useChannelSettings };

import SendbirdChat from '@sendbird/chat';
import React, { useCallback, useState, createContext, useContext } from 'react';

import { snakeToCamel } from './utils/snakeToCamel';
import { DeepPartial } from './utils/types';

import { UIKitConfigInfo } from './types';

// @link: https://docs.google.com/spreadsheets/d/1-AozBMHRYOXS74vZ-7x2ptQcBL6nnM-orJWRvUgmkd4/edit#gid=0
const initialConfig = {
  common: {
    enableUsingDefaultUserProfile: false,
  },
  groupChannel: {
    channel: {
      enableMention: false,
      enableOgtag: true,
      enableReactions: true,
      enableTypingIndicator: true,
      enableVoiceMessage: false,
      input: {
        camera: {
          enablePhoto: true,
          enableVideo: true,
        },
        enableDocument: true,
        gallery: {
          enablePhoto: true,
          enableVideo: true,
        },
      },
      replyType: 'quote_reply',
      threadReplySelectType: 'thread',
    },
    channelList: {
      enableMessageReceiptStatus: false,
      enableTypingIndicator: false,
    },
    setting: {
      enableMessageSearch: false,
    },
  },
  openChannel: {
    channel: {
      enableOgtag: true,
      input: {
        camera: {
          enablePhoto: true,
          enableVideo: true,
        },
        enableDocument: true,
        gallery: {
          enablePhoto: true,
          enableVideo: true,
        },
      },
    },
  },
};

interface UIKitConfigContextInterface {
  initDashboardConfigs: (sdk: SendbirdChat) => void;
  configs: UIKitConfigInfo;
}
const UIKitConfigContext = createContext<UIKitConfigContextInterface>({
  /* eslint-disable @typescript-eslint/no-empty-function */
  initDashboardConfigs: () => {},
  configs: {} as UIKitConfigInfo,
});

interface UIKitConfigProviderProps {
  appConfigurations: DeepPartial<UIKitConfigInfo>;
  children: React.ReactElement;
  // If the storage value is not provided,
  // it'll fetch the new configs set by dashboard everytime
  storage?: any;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const UIKitConfigProvider = ({ storage, children, onError, onSuccess /* appConfigurations */ }: UIKitConfigProviderProps) => {
  // const localConfigs = mergeConfigs(initialConfig, mapToUIKItConfig(configurations));
  const [remoteConfigs, setRemoteConfigs] = useState(initialConfig);

  const initDashboardConfigs = useCallback(async (sdk: SendbirdChat) => {
    try {
    // const manager = new UIKitConfigStorageManager(storage)
    // const storedConfigs = await manager.init(sdk.appId);

      if (storage == null) {
        const payload = await sdk.getUIKitConfiguration().json;
        setRemoteConfigs(snakeToCamel(payload.last_updated_at));
      }

      // Compare the sdk uikitConfig's lastUpdatedAt <-> stored one
      // if(sdk.appInfo.uikitConfigInfo.lastUpdatedAt === storedConfigs.lastUpdatedAt) {
      //   setRemoteConfigs(storedConfigs);
      // } else {
      //   const newConfigs = await sdk.getUIKitConfig();
      //   const updatedConfigs = await manager.update(newConfigs);
      //   setRemoteConfigs(updatedConfigs);
      // }
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    }
  }, []);

  // TODO: Implement
  // const configs = getByPriority(localConfigs, remoteConfigs);
  const configs = remoteConfigs;

  return <UIKitConfigContext.Provider value={{ initDashboardConfigs, configs }}>{children}</UIKitConfigContext.Provider>;
};

const useUIKitConfig = () => useContext(UIKitConfigContext);

export { UIKitConfigProvider, useUIKitConfig };

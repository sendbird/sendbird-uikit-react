import SendbirdChat from '@sendbird/chat';
import React, { useMemo, useCallback, useState, createContext, useContext } from 'react';

import { snakeToCamel } from './utils/snakeToCamel';
import { DeepPartial } from './utils/types';

import getConfigsByPriority from './utils/getConfigsByPriority';

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
  initDashboardConfigs: (sdk: SendbirdChat) => Promise<void>;
  configs: UIKitConfigInfo;
}
const UIKitConfigContext = createContext<UIKitConfigContextInterface>({
  initDashboardConfigs: () => Promise.resolve(),
  configs: initialConfig,
});

interface UIKitConfigProviderProps {
  // Configurations set by code level
  localConfigs: DeepPartial<UIKitConfigInfo>;
  children: React.ReactElement;
  // If the storage value is not provided,
  // it'll fetch the new configs set by dashboard everytime
  storage?: any;
}

const UIKitConfigProvider = ({ storage, children, localConfigs }: UIKitConfigProviderProps) => {
  // Set by Feature Config setting in Dashboard
  const [remoteConfigs, setRemoteConfigs] = useState(initialConfig);

  const initDashboardConfigs = useCallback(async (sdk: SendbirdChat) => {
    try {
    // TODO: Implement
    // const manager = new UIKitConfigStorageManager(storage)
    // const storedConfigs = await manager.init(sdk.appId);

      if (storage == null) {
        const payload = await sdk.getUIKitConfiguration();
        setRemoteConfigs(snakeToCamel(payload.json.uikit_configurations));
      }

      // TODO: Implement
      // Compare the sdk uikitConfig's lastUpdatedAt <-> stored one
      // if(sdk.appInfo.uikitConfigInfo.lastUpdatedAt === storedConfigs.lastUpdatedAt) {
      //   setRemoteConfigs(storedConfigs);
      // } else {
      //   const newConfigs = await sdk.getUIKitConfig();
      //   const updatedConfigs = await manager.update(newConfigs);
      //   setRemoteConfigs(updatedConfigs);
      // }
    } catch (error) {
      //
    }
  }, []);

  const configs = getConfigsByPriority(localConfigs, remoteConfigs);
  const contextValue = useMemo(() => ({
    initDashboardConfigs,
    configs,
  }), [initDashboardConfigs, configs]);

  return <UIKitConfigContext.Provider value={contextValue}>{children}</UIKitConfigContext.Provider>;
};

const useUIKitConfig = () => useContext(UIKitConfigContext);

export { UIKitConfigProvider, useUIKitConfig };

import SendbirdChat from '@sendbird/chat';
import React, { useCallback, useState, createContext, useContext } from 'react';

import { snakeToCamel } from './utils/snakeToCamel';
import { DeepPartial } from './utils/types';

import getConfigsByPriority from './utils/getConfigsByPriority';

import { UIKitConfigInfo } from './types';
import initialConfig from './const/initialConfig';
import { UIKitConfigStorageManager, type StorageInterface } from './UIKitConfigStorageManager';

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
  storage?: StorageInterface;
}

const UIKitConfigProvider = ({ storage, children, localConfigs }: UIKitConfigProviderProps) => {
  // Set by Feature Config setting in Dashboard
  const [remoteConfigs, setRemoteConfigs] = useState<UIKitConfigInfo>(initialConfig);

  const initDashboardConfigs = useCallback(async (sdk: SendbirdChat) => {
    try {
      if (storage == null) {
        const payload = await sdk.getUIKitConfiguration();
        setRemoteConfigs(snakeToCamel(payload.json.uikit_configurations));
        return;
      }

      // Compare the sdk uikitConfig's lastUpdatedAt <-> stored one
      const manager = new UIKitConfigStorageManager(storage);
      const storedConfigs = await manager.init(sdk.appId);

      if (sdk.appInfo.uikitConfigInfo.lastUpdatedAt === storedConfigs.lastUpdatedAt) {
        setRemoteConfigs(storedConfigs.uikitConfigurations);
      } else {
        const payload = await sdk.getUIKitConfiguration();
        const updatedPayloed = await manager.update(snakeToCamel(payload.json));
        setRemoteConfigs(updatedPayloed.uikitConfigurations);
      }
    } catch (error) {
      //
    }
  }, []);

  const configs = getConfigsByPriority(localConfigs, remoteConfigs);

  return <UIKitConfigContext.Provider value={{
    initDashboardConfigs,
    configs,
  }}>{children}</UIKitConfigContext.Provider>;
};

const useUIKitConfig = () => useContext(UIKitConfigContext);

export { UIKitConfigProvider, useUIKitConfig };

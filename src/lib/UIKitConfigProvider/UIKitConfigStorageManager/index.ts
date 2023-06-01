import { UIKitConfigPayload } from '../types';
import mergeConfigs from '../utils/getConfigsByPriority';
import initialConfig from '../const/initialConfig';

export interface StorageInterface {
  getItem(key: string): Promise<null|string>;
  setItem(key: string, value: string): Promise<void>;
}

export class UIKitConfigStorageManager {
  key: string;

  storage: StorageInterface;

  constructor(storage: StorageInterface) {
    this.storage = storage;
  }

  init(appId: string) {
    this.key = `sbu@${appId}.uikitConfiguration`;
    return this.get();
  }

  async update(payload: UIKitConfigPayload) {
    const storedConfig = await this.get();
    const mergedConfig = {
      lastUpdatedAt: payload.lastUpdatedAt,
      uikitConfigurations: mergeConfigs(payload?.uikitConfigurations, storedConfig?.uikitConfigurations),
    };
    await this.storage.setItem(this.key, JSON.stringify(mergedConfig));
    return mergedConfig;
  }

  async get(): Promise<UIKitConfigPayload> {
    const initialPayload = {
      lastUpdatedAt: 0,
      uikitConfigurations: initialConfig,
    };
    try {
      const storedConfig = await this.storage.getItem(this.key);
      if (storedConfig) {
        // TODO: Validation
        return JSON.parse(storedConfig);
      } else {
        return initialPayload;
      }
    } catch {
      return initialPayload;
    }
  }
}

import { UIKitConfigStorageManager } from '../.';
import mergeConfigs from '../../utils/getConfigsByPriority';

import initialConfig from '../../const/initialConfig';

// Mock StorageInterface
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

// Mock mergeConfigs function
jest.mock('../../utils/getConfigsByPriority', () => jest.fn());

const mockAppId = 'abc123';

describe('UIKitConfigStorageManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('init', () => {
    it('should set the key and return the result of get', async () => {
      const storageManager = new UIKitConfigStorageManager(mockStorage);

      storageManager.get = jest.fn().mockResolvedValueOnce('config');

      const result = await storageManager.init(mockAppId);

      expect(storageManager.key).toBe(`sbu@${mockAppId}.uikitConfiguration`);
      expect(storageManager.get).toHaveBeenCalledTimes(1);
      expect(result).toBe('config');
    });
  });

  describe('update', () => {
    it('should update the stored config and return the merged config', async () => {
      const storageManager = new UIKitConfigStorageManager(mockStorage);
      const payload = {
        lastUpdatedAt: 123456789,
        uikitConfigurations: {
          common: {
            enableUsingDefaultUserProfile: false,
          },
          groupChannel: {
            channel: {
              enableMention: false,
            },
          },
        },
      };
      const storedConfig = {
        lastUpdatedAt: 987654321,
        uikitConfigurations: {
          common: {
            enableUsingDefaultUserProfile: true,
          },
          groupChannel: {
            channel: {
              enableMention: true,
            },
          },
        },
      };
      const mergedConfig = {
        lastUpdatedAt: payload.lastUpdatedAt,
        uikitConfigurations: payload.uikitConfigurations,
      };

      storageManager.get = jest.fn().mockResolvedValueOnce(storedConfig);
      storageManager.key = `sbu@${mockAppId}.uikitConfiguration`;

      mockStorage.setItem.mockResolvedValueOnce(storedConfig);

      mergeConfigs.mockReturnValueOnce(mergedConfig.uikitConfigurations);

      const result = await storageManager.update(payload);

      expect(storageManager.get).toHaveBeenCalledTimes(1);
      expect(mergeConfigs).toHaveBeenCalledWith(payload.uikitConfigurations, storedConfig.uikitConfigurations);
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        storageManager.key,
        JSON.stringify(mergedConfig),
      );
      expect(result).toEqual(mergedConfig);
    });
  });

  describe('get', () => {
    it('should return the stored config if it exists', async () => {
      const storageManager = new UIKitConfigStorageManager(mockStorage);
      const storedConfig = {
        lastUpdatedAt: 987654321,
        uikitConfigurations: [{ name: 'config1' }, { name: 'config2' }],
      };

      mockStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedConfig));
      storageManager.key = `sbu@${mockAppId}.uikitConfiguration`;

      const result = await storageManager.get();

      expect(mockStorage.getItem).toHaveBeenCalledWith(storageManager.key);
      expect(result).toEqual(storedConfig);
    });

    it('should return the initial payload if the stored config does not exist', async () => {
      const storageManager = new UIKitConfigStorageManager(mockStorage);
      const initialPayload = {
        lastUpdatedAt: 0,
        uikitConfigurations: initialConfig,
      };

      storageManager.key = `sbu@${mockAppId}.uikitConfiguration`;
      mockStorage.getItem.mockResolvedValueOnce(null);

      const result = await storageManager.get();

      expect(mockStorage.getItem).toHaveBeenCalledWith(storageManager.key);
      expect(result).toEqual(initialPayload);
    });

    it('should return the initial payload if an error occurs while retrieving the stored config', async () => {
      const storageManager = new UIKitConfigStorageManager(mockStorage);
      const initialPayload = {
        lastUpdatedAt: 0,
        uikitConfigurations: initialConfig,
      };

      storageManager.key = `sbu@${mockAppId}.uikitConfiguration`;
      mockStorage.getItem.mockRejectedValueOnce(new Error('Failed to retrieve config'));

      const result = await storageManager.get();

      expect(mockStorage.getItem).toHaveBeenCalledWith(storageManager.key);
      expect(result).toEqual(initialPayload);
    });
  });
});

import { User } from '@sendbird/chat';
import { LoggerFactory } from '../../../Logger';
import { ConnectTypes, DisconnectSdkTypes, SetupConnectionTypes, StaticTypes, TriggerTypes } from '../types';

export const mockUser = {
  userId: 'test-user-id',
  nickname: 'test-nickname',
  profileUrl: 'test-profile-url',
} as unknown as User;

export const mockUser2 = {
  userId: 'test-user-id2',
  nickname: 'test-nickname2',
  profileUrl: 'test-profile-url2',
} as unknown as User;

export const mockSdk = {
  connect: jest.fn().mockImplementation((userId) => {
    if (userId === mockUser2.userId) {
      return Promise.resolve(mockUser2);
    }
    if (userId === mockUser.userId) {
      return Promise.resolve(mockUser);
    }
    if (userId?.length > 0) {
      return Promise.resolve({ userId: userId });
    }
    return Promise.reject();
  }),
  disconnect: jest.fn().mockImplementation(() => Promise.resolve(true)),
  updateCurrentUserInfo: jest.fn().mockImplementation((user) => Promise.resolve(user)),
  setSessionHandler: jest.fn(),
  addExtension: jest.fn(),
  getUIKitConfiguration: jest.fn().mockImplementation(() => Promise.resolve({})),
} as unknown as ConnectTypes['sdk'];

export const mockSdkDispatcher = jest.fn() as unknown as ConnectTypes['sdkDispatcher'];
export const mockUserDispatcher = jest.fn() as unknown as ConnectTypes['userDispatcher'];
export const mockInitDashboardConfigs = jest.fn().mockImplementation(() => Promise.resolve({})) as unknown as ConnectTypes['initDashboardConfigs'];

export const defaultStaticParams: StaticTypes = {
  nickname: 'test-nickname',
  profileUrl: 'test-profile-url',
  sdk: mockSdk,
  logger: LoggerFactory('all'),
  sdkDispatcher: mockSdkDispatcher,
  userDispatcher: mockUserDispatcher,
  initDashboardConfigs: mockInitDashboardConfigs,
};

export const defaultTriggerParams: TriggerTypes = {
  userId: 'test-user-id',
  appId: 'test-app-id',
  accessToken: 'test-access-token',
};

export const defaultConnectParams: ConnectTypes = {
  ...defaultStaticParams,
  ...defaultTriggerParams,
};

export const defaultSetupConnectionParams: SetupConnectionTypes = {
  ...defaultConnectParams,
};

export const defaultDisconnectSdkParams: DisconnectSdkTypes = {
  sdkDispatcher: mockSdkDispatcher,
  userDispatcher: mockUserDispatcher,
  sdk: mockSdk,
  logger: LoggerFactory('all'),
};

export function generateDisconnectSdkParams(overrides?: Partial<DisconnectSdkTypes>): DisconnectSdkTypes {
  return {
    ...defaultDisconnectSdkParams,
    ...overrides,
  };
}

export function generateSetUpConnectionParams(overrides?: Partial<SetupConnectionTypes>): SetupConnectionTypes {
  return {
    ...defaultSetupConnectionParams,
    ...overrides,
  };
}

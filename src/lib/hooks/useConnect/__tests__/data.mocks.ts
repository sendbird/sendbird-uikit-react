import { LoggerFactory } from '../../../Logger';
import { ConnectTypes, DisconnectSdkTypes, SetupConnectionTypes, StaticTypes, TriggerTypes } from '../types';

export const mockSdk = {
  connect: jest.fn(),
  disconnect: jest.fn(),
} as unknown as ConnectTypes['sdk'];

export const mockSdkDispatcher = jest.fn() as unknown as ConnectTypes['sdkDispatcher'];
export const mockUserDispatcher = jest.fn() as unknown as ConnectTypes['userDispatcher'];

export const defaultStaticParams: StaticTypes = {
  nickname: 'test-nickname',
  profileUrl: 'test-profile-url',
  sdk: mockSdk,
  logger: LoggerFactory('all'),
  sdkDispatcher: mockSdkDispatcher,
  userDispatcher: mockUserDispatcher,
}

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

type GenerateGenericType<T> = (overrides: T) => T;

const generateConnectParams: GenerateGenericType<ConnectTypes> = (overrides) => ({
  ...defaultConnectParams,
  ...overrides,
});



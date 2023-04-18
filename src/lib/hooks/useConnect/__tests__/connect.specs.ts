import { connect } from '../connect';

describe('useConnect/connect', () => {
  it('should call disconnectSdk and then connect', () => {
    const disconnectSdk = jest.fn();
    const setUpConnection = jest.fn();
    const logger = {
      info: jest.fn(),
    };
    const sdkDispatcher = jest.fn();
    const userDispatcher = jest.fn();
    const userId = 'userId';
    const appId = 'appId';

    connect({
      logger,
      sdkDispatcher,
      userDispatcher,
      userId,
      appId,
      customApiHost,
      customWebSocketHost,
      configureSession,
      nickname,
      profileUrl,
      accessToken,
      sdk,
    });
  });
});

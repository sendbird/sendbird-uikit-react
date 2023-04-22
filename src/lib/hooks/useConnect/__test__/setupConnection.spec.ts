import { SDK_ACTIONS } from '../../../dux/sdk/actionTypes';
import { USER_ACTIONS } from '../../../dux/user/actionTypes';
import { setUpConnection, setUpParams } from '../setupConnection';
import { SetupConnectionTypes } from '../types';
import { generateSetUpConnectionParams, mockSdk, mockUser, mockUser2 } from './data.mocks';

// todo: combine after mock-sdk is implemented
jest.mock('@sendbird/chat', () => ({
  init: jest.fn().mockImplementation(() => mockSdk),
}));
jest.mock('@sendbird/chat/openChannel', () => ({
  OpenChannelModule: jest.fn(),
}));
jest.mock('@sendbird/chat/groupChannel', () => ({
  GroupChannelModule: jest.fn(),
}));

describe('useConnect/setupConnection', () => {
  it('should call SDK_ERROR when there is no appId', async () => {
    const setUpConnectionProps = generateSetUpConnectionParams();
    const { appId, ...params } = setUpConnectionProps;

    await setUpConnection((params as SetupConnectionTypes));

    expect(mockSdk.connect).not.toBeCalledWith({ type: SDK_ACTIONS.SET_SDK_LOADING, payload: true });
    expect(setUpConnectionProps.sdkDispatcher).toBeCalledWith({ type: SDK_ACTIONS.SDK_ERROR });
  });

  it('should call SDK_ERROR when there is no userId', async () => {
    const setUpConnectionProps = generateSetUpConnectionParams();
    const { userId, ...params } = setUpConnectionProps;

    await setUpConnection((params as SetupConnectionTypes));
    expect(setUpConnectionProps.sdkDispatcher).toHaveBeenCalledWith({ type: SDK_ACTIONS.SET_SDK_LOADING, payload: true });
    expect(mockSdk.connect).not.toBeCalledWith({ type: SDK_ACTIONS.SET_SDK_LOADING, payload: true });
    expect(setUpConnectionProps.sdkDispatcher).toBeCalledWith({ type: SDK_ACTIONS.SDK_ERROR });
  });

  it('should call setUpConnection when there is proper SDK', async () => {
    const setUpConnectionProps = generateSetUpConnectionParams();
    await setUpConnection(setUpConnectionProps);
    expect(setUpConnectionProps.sdkDispatcher).toHaveBeenNthCalledWith(1, {
      type: SDK_ACTIONS.SET_SDK_LOADING,
      payload: true,
    });
    expect(mockSdk.connect).toHaveBeenCalledWith(setUpConnectionProps.userId, setUpConnectionProps.accessToken);
    expect(setUpConnectionProps.sdkDispatcher).toHaveBeenNthCalledWith(2, {
      type: SDK_ACTIONS.INIT_SDK,
      payload: mockSdk,
    });
    expect(setUpConnectionProps.userDispatcher).toHaveBeenCalledOnceWith({
      type: USER_ACTIONS.INIT_USER,
      payload: mockUser,
    });
  });

  it('should call connect with only userId when there is no access token', async () => {
    const setUpConnectionProps = generateSetUpConnectionParams();
    const params = { ...setUpConnectionProps, accessToken: undefined };
    await setUpConnection(params);
    expect(mockSdk.connect).toHaveBeenCalledWith(mockUser.userId);
  });

  it('should call configureSession if provided', async () => {
    const configureSession = jest.fn().mockImplementation(() => 'mock_session');
    const setUpConnectionProps = generateSetUpConnectionParams();
    await setUpConnection({ ...setUpConnectionProps, configureSession });
    expect(configureSession).toHaveBeenCalledWith(mockSdk);
  });

  it('should call updateCurrentUserInfo when', async () => {
    const setUpConnectionProps = generateSetUpConnectionParams();
    const newNickname = 'newNickname';
    const newprofileUrl = 'newprofileUrl';
    await setUpConnection({
      ...setUpConnectionProps,
      userId: mockUser2.userId,
      nickname: newNickname,
      profileUrl: newprofileUrl,
    });
    expect(mockSdk.updateCurrentUserInfo)
      .toHaveBeenCalledWith({ nickname: 'newNickname',  profileUrl: 'newprofileUrl' });
    expect(setUpConnectionProps.userDispatcher).toHaveBeenCalledWith({
      type: USER_ACTIONS.INIT_USER,
      payload: {
        nickname: 'test-nickname2',
        profileUrl: 'test-profile-url2',
        userId: 'test-user-id2',
      },
    });
  });

  // it('should call connectCbError if connection fails', async () => {
  //   const setUpConnectionProps = generateSetUpConnectionParams();
  //   setUpConnectionProps.userId = 'unknown';
  //   await setUpConnection(setUpConnectionProps);
  //   expect(setUpConnectionProps.sdkDispatcher).toHaveBeenCalledWith({
  //     type: SDK_ACTIONS.SDK_ERROR,
  //   });
  // });
});

describe('useConnect/setupConnection/setUpParams', () => {
  it('should call init with correct appId', async () => {
    const setUpConnectionProps = generateSetUpConnectionParams();
    const { appId, customApiHost, customWebSocketHost } = setUpConnectionProps;
    const newSdk = setUpParams({ appId, customApiHost, customWebSocketHost });
    expect(require('@sendbird/chat').init).toBeCalledWith({
      appId,
      modules: [
        new (require('@sendbird/chat/groupChannel').GroupChannelModule)(),
        new (require('@sendbird/chat/openChannel').OpenChannelModule)(),
      ],
    });
    expect(newSdk).toEqual(mockSdk);
  });

  it('should call init with correct customApiHost & customWebSocketHost', async () => {
    const setUpConnectionProps = generateSetUpConnectionParams();
    const { appId, customApiHost, customWebSocketHost } = setUpConnectionProps;
    const newSdk = setUpParams({ appId, customApiHost, customWebSocketHost });
    expect(require('@sendbird/chat').init).toBeCalledWith({
      appId,
      modules: [
        new (require('@sendbird/chat/groupChannel').GroupChannelModule)(),
        new (require('@sendbird/chat/openChannel').OpenChannelModule)(),
      ],
      customApiHost,
      customWebSocketHost,
    });
    expect(newSdk).toEqual(mockSdk);
  });
});

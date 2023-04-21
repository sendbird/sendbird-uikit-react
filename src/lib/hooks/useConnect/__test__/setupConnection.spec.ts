// todo: combine after mock-sdk is implemented
jest.mock('@sendbird/chat', () => ({
  init: jest.fn(),
}));
jest.mock('@sendbird/chat/openChannel', () => ({
  OpenChannelModule: jest.fn(),
}));
jest.mock('@sendbird/chat/groupChannel', () => ({
  GroupChannelModule: jest.fn(),
}));

describe('useConnect/setupConnection', () => {
  it('should call setUpConnection when there is proper SDK', async () => {
    const setUpConnectionProps = generateSetUpConnectionParams({});
    await setUpConnection(setUpConnectionProps);
    expect(setUpConnectionProps.sdkDispatcher).toBeCalledWith({ type: SDK_ACTIONS.SET_SDK_LOADING, payload: true });
    expect(setUpConnectionProps.sdkDispatcher).toBeCalledWith({ type: SDK_ACTIONS.INIT_SDK, payload: setUpConnectionProps.sdk });
    expect(setUpConnectionProps.userDispatcher).toBeCalledWith({ type: USER_ACTIONS.INIT_USER, payload: setUpConnectionProps.user });
  });
});

import { SDK_ACTIONS } from "../../../dux/sdk/actionTypes";
import { USER_ACTIONS } from "../../../dux/user/actionTypes";
import { disconnectSdk } from "../disconnectSdk";
import { generateDisconnectSdkParams } from "./data.mocks";

describe('useConnect/disconnectSdk', () => {
  it('should call disconnectSdk when there is proper SDK', async () => {
    // setup
    const disconnectProps = generateDisconnectSdkParams();
    const mockDisconnect = disconnectProps.sdk.disconnect as jest.Mock;

    // execute
    await disconnectSdk(disconnectProps);

    // verify
    expect(disconnectProps.sdkDispatcher).toHaveBeenCalledBefore(mockDisconnect);
    expect(disconnectProps.sdkDispatcher).toBeCalledWith({ type: SDK_ACTIONS.SET_SDK_LOADING, payload: true });
    expect(disconnectProps.sdk.disconnect).toHaveBeenCalled();
    expect(disconnectProps.sdkDispatcher).toBeCalledWith({ type: SDK_ACTIONS.RESET_SDK });
    expect(disconnectProps.userDispatcher).toBeCalledWith({ type: USER_ACTIONS.RESET_USER });
  });

  it('should not call disconnectSdk when there is no SDK', async () => {
    const disconnectProps = generateDisconnectSdkParams({ sdk: undefined });
    await disconnectSdk(disconnectProps);
    expect(disconnectProps.sdkDispatcher).toBeCalledWith({ type: SDK_ACTIONS.SET_SDK_LOADING, payload: true });
    expect(disconnectProps.sdkDispatcher).not.toBeCalledWith({ type: SDK_ACTIONS.RESET_SDK });
  });
});

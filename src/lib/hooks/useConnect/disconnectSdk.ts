import { SDK_ACTIONS } from "../../dux/sdk/actionTypes";
import { USER_ACTIONS } from "../../dux/user/actionTypes";
import { DisconnectSdkTypes } from "./types";

export async function disconnectSdk({
  sdkDispatcher,
  userDispatcher,
  sdk,
}: DisconnectSdkTypes): Promise<boolean> {
  return new Promise((resolve) => {
    sdkDispatcher({ type: SDK_ACTIONS.SET_SDK_LOADING, payload: true });
    if (sdk?.disconnect) {
      sdk.disconnect()
        .then(() => {
          sdkDispatcher({ type: SDK_ACTIONS.RESET_SDK });
          userDispatcher({ type: USER_ACTIONS.RESET_USER });
        })
        .finally(() => {
          resolve(true);
        });
    } else {
      resolve(true);
    }
  });
}

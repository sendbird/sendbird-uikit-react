import SendbirdChat, { SessionHandler } from '@sendbird/chat';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import { SendbirdOpenChat } from '@sendbird/chat/openChannel';

import { SdkActionTypes } from '../../dux/sdk/actionTypes';
import { UserActionTypes } from '../../dux/user/actionTypes';
import { Logger } from '../../SendbirdState';

type SdkDispatcher = React.Dispatch<SdkActionTypes>;
type UserDispatcher = React.Dispatch<UserActionTypes>;

export type TriggerTypes = {
  userId: string;
  appId: string;
  // todo: doulbe check this type before merge
  accessToken?: string;
};

export type ConfigureSessionTypes = (sdk: SendbirdChat | SendbirdGroupChat | SendbirdOpenChat) => SessionHandler;

export type StaticTypes = {
  nickname: string;
  profileUrl: string;
  configureSession?: ConfigureSessionTypes;
  customApiHost?: string;
  customWebSocketHost?: string;
  sdk: SendbirdChat;
  logger: Logger;
  sdkDispatcher: SdkDispatcher;
  userDispatcher: UserDispatcher;
};

export type ConnectTypes = TriggerTypes & StaticTypes;

export type SetupConnectionTypes = Omit<ConnectTypes, 'sdk'>;

export type DisconnectSdkTypes = {
  sdkDispatcher: SdkDispatcher;
  userDispatcher: UserDispatcher;
  sdk: SendbirdChat;
  logger: Logger;
};

export type ReconnectType = () => void;

import type { User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';

type ConfigureSession = NonNullable<React.ComponentProps<typeof SendbirdProvider>['configureSession']>;

export function configureFixtureSession(
  sdk: Parameters<ConfigureSession>[0],
  user: Pick<User, 'userId' | 'nickname' | 'profileUrl'>,
  getChannel: (url: string) => Promise<GroupChannel>,
) {
  const fixtureUser = user as User;
  Object.defineProperty(sdk, 'currentUser', { configurable: true, get: () => fixtureUser });
  sdk.connect = async () => fixtureUser;
  sdk.reconnect = () => false;
  sdk.disconnectWebSocket = async () => undefined;
  if (!('groupChannel' in sdk)) throw new Error('Group channel module is required');
  sdk.groupChannel.getChannel = getChannel;
  return sdk.groupChannel;
}

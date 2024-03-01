import type SendbirdChat from '@sendbird/chat';
import { LoggerInterface } from '../Logger';
declare function useOnlineStatus(sdk: SendbirdChat, logger: LoggerInterface): boolean;
export default useOnlineStatus;

import { SendbirdError } from '@sendbird/chat';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import { SetupConnectionTypes } from './types';
import { CustomExtensionParams, SendbirdChatInitParams } from '../../types';
export declare function getMissingParamError({ userId, appId }: {
    userId?: string;
    appId?: string;
}): string;
export declare function getConnectSbError(error?: SendbirdError): string;
export declare function setUpParams({ appId, customApiHost, customWebSocketHost, sdkInitParams, }: {
    appId: string;
    customApiHost?: string;
    customWebSocketHost?: string;
    sdkInitParams?: SendbirdChatInitParams;
    customExtensionParams?: CustomExtensionParams;
}): import("@sendbird/chat").SendbirdChatWith<import("@sendbird/chat/lib/__definition").Module[] & (GroupChannelModule | OpenChannelModule)[]>;
export declare function setUpConnection({ logger, sdkDispatcher, userDispatcher, initDashboardConfigs, userId, appId, customApiHost, customWebSocketHost, configureSession, nickname, profileUrl, accessToken, isUserIdUsedForNickname, sdkInitParams, customExtensionParams, isMobile, eventHandlers, }: SetupConnectionTypes): Promise<void>;

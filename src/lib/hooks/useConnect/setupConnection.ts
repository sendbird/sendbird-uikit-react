import SendbirdChat, { DeviceOsPlatform, SendbirdError, SendbirdPlatform, SendbirdProduct, User } from '@sendbird/chat';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';

import { SDK_ACTIONS } from '../../dux/sdk/actionTypes';
import { USER_ACTIONS } from '../../dux/user/actionTypes';
import { APP_INFO_ACTIONS } from '../../dux/appInfo/actionTypes';

import { isTextuallyNull } from '../../../utils';

import { SetupConnectionTypes } from './types';
import { CustomExtensionParams, SendbirdChatInitParams } from '../../types';
import { SendbirdMessageTemplate } from '../../../ui/TemplateMessageItemBody/types';
import { MessageTemplateListResult } from '@sendbird/chat/lib/__definition';
import { ProcessedMessageTemplate, MessageTemplatesInfo } from '../../dux/appInfo/initialState';
import { CACHED_MESSAGE_TEMPLATES_KEY, CACHED_MESSAGE_TEMPLATES_TOKEN_KEY } from '../../../modules/App/types';

const APP_VERSION_STRING = '__react_dev_mode__';
const MESSAGE_TEMPLATES_FETCH_LIMIT = 20;

const { INIT_SDK, SET_SDK_LOADING, RESET_SDK, SDK_ERROR } = SDK_ACTIONS;
const { INIT_USER, UPDATE_USER_INFO, RESET_USER } = USER_ACTIONS;
const { UPSERT_MESSAGE_TEMPLATES_INFO } = APP_INFO_ACTIONS;

export function getMissingParamError({ userId, appId }: { userId?: string, appId?: string }): string {
  return `SendbirdProvider | useConnect/setupConnection/Connection failed UserId: ${userId} or appId: ${appId} missing`;
}
export function getConnectSbError(error?: SendbirdError): string {
  return `SendbirdProvider | useConnect/setupConnection/Connection failed. ${error?.code || ''} ${error?.message || ''}`;
}

export function setUpParams({
  appId,
  customApiHost,
  customWebSocketHost,
  sdkInitParams = {},
}: {
  appId: string;
  customApiHost?: string;
  customWebSocketHost?: string;
  sdkInitParams?: SendbirdChatInitParams;
  customExtensionParams?: CustomExtensionParams;
}) {
  const params = Object.assign(sdkInitParams, {
    appId,
    modules: [new GroupChannelModule(), new OpenChannelModule()],
    newInstance: true,
    localCacheEnabled: true,
  });
  if (customApiHost) params.customApiHost = customApiHost;
  if (customWebSocketHost) params.customWebSocketHost = customWebSocketHost;
  return SendbirdChat.init(params);
}

// Steps
// 1. Check if minimum userID/appID is provided
//  1.a. If not, throw error > !reject
//  1.b. If yes, continue
// 2. Set up params with custom host if provided
// 3. Set up session handler if provided
// 4. Set up version
// 5. Connect to Sendbird -> either using user ID or (user ID + access token)
// 6. If connected, connectCbSucess
//  6.a check if nickname is to be updated -> no > !resolve immediately
//  6.b check if nickname is to be updated -> yes > update nickname > !resolve
// 7. If not connected, connectCbError > !reject
export async function setUpConnection({
  logger,
  sdkDispatcher,
  userDispatcher,
  appInfoDispatcher,
  initDashboardConfigs,
  userId,
  appId,
  customApiHost,
  customWebSocketHost,
  configureSession,
  nickname,
  profileUrl,
  accessToken,
  isUserIdUsedForNickname,
  sdkInitParams,
  customExtensionParams,
  isMobile = false,
  eventHandlers,
}: SetupConnectionTypes): Promise<void> {
  return new Promise((resolve, reject) => {
    logger?.info?.('SendbirdProvider | useConnect/setupConnection/init', { userId, appId });
    const onConnectionFailed = eventHandlers?.connection?.onFailed;
    sdkDispatcher({ type: SET_SDK_LOADING, payload: true });

    if (userId && appId) {
      const newSdk = setUpParams({
        appId,
        customApiHost,
        customWebSocketHost,
        sdkInitParams,
      });

      if (configureSession && typeof configureSession === 'function') {
        const sessionHandler = configureSession(newSdk);
        logger?.info?.('SendbirdProvider | useConnect/setupConnection/configureSession', sessionHandler);
        newSdk.setSessionHandler(sessionHandler);
      }

      logger?.info?.('SendbirdProvider | useConnect/setupConnection/setVersion', { version: APP_VERSION_STRING });
      /**
       * Keep optional chaining to the addSendbirdExtensions
       * for supporting the ChatSDK v4.9.5 or less
       */
      newSdk?.addSendbirdExtensions?.(
        [
          {
            product: SendbirdProduct?.UIKIT_CHAT ?? 'uikit-chat' as SendbirdProduct,
            version: APP_VERSION_STRING,
            platform: SendbirdPlatform?.JS ?? 'js' as SendbirdPlatform,
          },
        ],
        {
          platform: (isMobile
            ? DeviceOsPlatform?.MOBILE_WEB ?? 'mobile_web'
            : DeviceOsPlatform?.WEB ?? 'web') as DeviceOsPlatform,
        },
        customExtensionParams,
      );
      newSdk.addExtension('sb_uikit', APP_VERSION_STRING);

      const upsertMessageTemplateListInLocalStorage = async () => {
        const sdkMessageTemplateToken = newSdk!.appInfo?.messageTemplateInfo?.token;
        /**
         * no sdkMessageTemplateToken => no templates => clear cached
         */
        if (!sdkMessageTemplateToken) {
          localStorage.removeItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY);
          localStorage.removeItem(CACHED_MESSAGE_TEMPLATES_KEY);
          return;
        }
        const getProcessedTemplates = (parsedTemplates: SendbirdMessageTemplate[]): Record<string, ProcessedMessageTemplate> => {
          const processedTemplates = {};
          parsedTemplates.forEach((template) => {
            processedTemplates[template.key] = {
              uiTemplate: JSON.stringify(template.ui_template.body.items),
              colorVariables: template.color_variables,
              dataSchema: template.data_schema,
            };
          });
          return processedTemplates;
        };
        /**
         * Given the following cases:
         * 1. non-null sdkMessageTemplateToken => templates exist
         * 2. no cached token or cached token is outdated => first fetch or outdated cache
         *
         * If both 1 and 2, fetch all templates and upsert to cache.
         * If cached token is not outdated, use cached templates.
         */
        const cachedMessageTemplatesToken: string | null = localStorage.getItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY);
        const cachedMessageTemplates: string | null = localStorage.getItem(CACHED_MESSAGE_TEMPLATES_KEY);
        if (
          !cachedMessageTemplatesToken
          || cachedMessageTemplatesToken !== sdkMessageTemplateToken!
        ) {
          const fetchAllMessageTemplates = async (): Promise<SendbirdMessageTemplate[]> => {
            let hasMore = true;
            let paginationToken = null;
            const fetchedTemplates: SendbirdMessageTemplate[] = [];

            while (hasMore) {
              /**
               * RFC doc:
               * https://sendbird.atlassian.net/wiki/spaces/PLAT/pages/2254405651/RFC+Message+Template#%5BAPI%5D-List-message-templates
               */
              const res: MessageTemplateListResult = await newSdk!.message.getMessageTemplatesByToken(
                paginationToken,
                { limit: MESSAGE_TEMPLATES_FETCH_LIMIT },
              );
              hasMore = res.hasMore;
              paginationToken = res.token;
              res.templates.forEach((messageTemplate) => {
                fetchedTemplates.push(JSON.parse(messageTemplate.template));
              });
            }
            return fetchedTemplates;
          };
          const parsedTemplates: SendbirdMessageTemplate[] = await fetchAllMessageTemplates();
          const newMessageTemplatesInfo: MessageTemplatesInfo = {
            token: sdkMessageTemplateToken,
            templatesMap: getProcessedTemplates(parsedTemplates),
          };
          appInfoDispatcher({ type: UPSERT_MESSAGE_TEMPLATES_INFO, payload: newMessageTemplatesInfo });
          localStorage.setItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY, JSON.stringify(sdkMessageTemplateToken));
          localStorage.setItem(CACHED_MESSAGE_TEMPLATES_KEY, JSON.stringify(parsedTemplates));
        } else if (
          cachedMessageTemplatesToken
          && cachedMessageTemplatesToken === sdkMessageTemplateToken
          && cachedMessageTemplates
        ) {
          const parsedTemplates: SendbirdMessageTemplate[] = JSON.parse(cachedMessageTemplates);
          const newMessageTemplatesInfo: MessageTemplatesInfo = {
            token: sdkMessageTemplateToken,
            templatesMap: getProcessedTemplates(parsedTemplates),
          };
          appInfoDispatcher({ type: UPSERT_MESSAGE_TEMPLATES_INFO, payload: newMessageTemplatesInfo });
        }
      };

      const connectCbSuccess = async (user: User) => {
        logger?.info?.('SendbirdProvider | useConnect/setupConnection/connectCbSuccess', user);
        sdkDispatcher({ type: INIT_SDK, payload: newSdk });
        userDispatcher({ type: INIT_USER, payload: user });

        try {
          await upsertMessageTemplateListInLocalStorage();
        } catch (error) {
          logger?.error?.('SendbirdProvider | useConnect/setupConnection/upsertMessageTemplateListInLocalStorage failed', {
            error,
          });
        }

        initDashboardConfigs(newSdk)
          .then(config => {
            logger?.info?.('SendbirdProvider | useConnect/setupConnection/getUIKitConfiguration success', {
              config,
            });
          })
          .catch(error => {
            logger?.error?.('SendbirdProvider | useConnect/setupConnection/getUIKitConfiguration failed', {
              error,
            });
          });

        // use nickname/profileUrl if provided
        // or set userID as nickname
        if ((nickname !== user.nickname || profileUrl !== user.profileUrl)
          && !(isTextuallyNull(nickname) && isTextuallyNull(profileUrl))
        ) {
          logger?.info?.('SendbirdProvider | useConnect/setupConnection/updateCurrentUserInfo', {
            nickname,
            profileUrl,
          });
          newSdk.updateCurrentUserInfo({
            nickname: nickname || user.nickname || (isUserIdUsedForNickname ? user.userId : ''),
            profileUrl: profileUrl || user.profileUrl,
          }).then((namedUser) => {
            logger?.info?.('SendbirdProvider | useConnect/setupConnection/updateCurrentUserInfo success', {
              nickname,
              profileUrl,
            });
            userDispatcher({ type: UPDATE_USER_INFO, payload: namedUser });
          }).finally(() => {
            resolve();
          });
        } else {
          resolve();
        }
      };

      const connectCbError = (e: SendbirdError) => {
        const errorMessage = getConnectSbError(e);
        logger?.error?.(errorMessage, {
          e,
          appId,
          userId,
        });
        sdkDispatcher({ type: RESET_SDK });
        userDispatcher({ type: RESET_USER });

        sdkDispatcher({ type: SDK_ERROR });
        onConnectionFailed?.(e);
        // exit promise with error
        reject(errorMessage);
      };

      logger?.info?.(`SendbirdProvider | useConnect/setupConnection/connect connecting using ${accessToken ?? userId}`);
      newSdk.connect(userId, accessToken)
        .then((res) => connectCbSuccess(res))
        .catch((err) => connectCbError(err));
    } else {
      const errorMessage = getMissingParamError({ userId, appId });
      sdkDispatcher({ type: SDK_ERROR });
      onConnectionFailed?.({ message: errorMessage } as SendbirdError);
      logger?.error?.(errorMessage);
      // exit promise with error
      reject(errorMessage);
    }
  });
}

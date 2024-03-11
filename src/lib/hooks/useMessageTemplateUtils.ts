import React from 'react';
import { AppInfoStateType, MessageTemplatesInfo, ProcessedMessageTemplate } from '../dux/appInfo/initialState';
import { SendbirdMessageTemplate } from '../../ui/TemplateMessageItemBody/types';
import {getProcessedTemplate, getProcessedTemplatesMap} from '../dux/appInfo/utils';
import SendbirdChat from '@sendbird/chat';
import { APP_INFO_ACTIONS, AppInfoActionTypes } from '../dux/appInfo/actionTypes';
import { CACHED_MESSAGE_TEMPLATES_KEY, CACHED_MESSAGE_TEMPLATES_TOKEN_KEY } from '../../utils/consts';
import { LoggerInterface } from '../Logger';

const MESSAGE_TEMPLATES_FETCH_LIMIT = 20;

interface UseMessageTemplateUtilsProps {
  sdk: SendbirdChat,
  logger: LoggerInterface,
  appInfoStore: AppInfoStateType,
  appInfoDispatcher: React.Dispatch<AppInfoActionTypes>,
}

export interface UseMessageTemplateUtilsWrapper {
  getCachedTemplate: (key: string) => ProcessedMessageTemplate | null;
  updateMessageTemplatesInfo: (templateKeys: string[], requestedAt: number) => Promise<void>;
  initializeMessageTemplatesInfo: (readySdk: SendbirdChat) => Promise<void>;
}

const {
  INITIALIZE_MESSAGE_TEMPLATES_INFO,
  UPSERT_MESSAGE_TEMPLATES,
  UPSERT_WAITING_TEMPLATE_KEYS,
  MARK_ERROR_WAITING_TEMPLATE_KEYS,
} = APP_INFO_ACTIONS;

export default function useMessageTemplateUtils({
  sdk,
  logger,
  appInfoStore,
  appInfoDispatcher,
}: UseMessageTemplateUtilsProps): UseMessageTemplateUtilsWrapper {
  const messageTemplatesInfo: MessageTemplatesInfo | undefined = appInfoStore?.messageTemplatesInfo;

  const getCachedTemplate = (key: string): ProcessedMessageTemplate | null => {
    if (!messageTemplatesInfo) return null;

    let cachedTemplate: ProcessedMessageTemplate | null = null;
    const cachedMessageTemplates: Record<string, ProcessedMessageTemplate> | null = messageTemplatesInfo?.templatesMap ?? null;
    if (cachedMessageTemplates) {
      cachedTemplate = cachedMessageTemplates[key] ?? null;
    }
    return cachedTemplate;
  };

  /**
   * Fetches a single message template by given key and then
   * returns processed template for updating templates info in global state.
   * If no such templates exists (error) or any error occurs in response, return null.
   */

  const fetchAllMessageTemplates = async (readySdk: SendbirdChat): Promise<SendbirdMessageTemplate[]> => {
    let hasMore = true;
    let paginationToken = null;
    const fetchedTemplates: SendbirdMessageTemplate[] = [];

    while (hasMore) {
      /**
       * RFC doc:
       * https://sendbird.atlassian.net/wiki/spaces/PLAT/pages/2254405651/RFC+Message+Template#%5BAPI%5D-List-message-templates
       */
      const res = await readySdk.message.getMessageTemplatesByToken(
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

  const initializeMessageTemplatesInfo = async (readySdk: SendbirdChat): Promise<void> => {
    const sdkMessageTemplateToken = readySdk.appInfo?.messageTemplateInfo.token;

    /**
     * no sdkMessageTemplateToken => no templates => clear cached
     */
    if (!sdkMessageTemplateToken) {
      localStorage.removeItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY);
      localStorage.removeItem(CACHED_MESSAGE_TEMPLATES_KEY);
      return;
    }
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
      || cachedMessageTemplatesToken !== sdkMessageTemplateToken
    ) {
      const parsedTemplates = await fetchAllMessageTemplates(readySdk);
      const newMessageTemplatesInfo: MessageTemplatesInfo = {
        token: sdkMessageTemplateToken,
        templatesMap: getProcessedTemplatesMap(parsedTemplates),
      };
      appInfoDispatcher({ type: INITIALIZE_MESSAGE_TEMPLATES_INFO, payload: newMessageTemplatesInfo });
      localStorage.setItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY, sdkMessageTemplateToken);
      localStorage.setItem(CACHED_MESSAGE_TEMPLATES_KEY, JSON.stringify(parsedTemplates));
    } else if (
      cachedMessageTemplatesToken
      && cachedMessageTemplatesToken === sdkMessageTemplateToken
      && cachedMessageTemplates
    ) {
      const parsedTemplates: SendbirdMessageTemplate[] = JSON.parse(cachedMessageTemplates);
      const newMessageTemplatesInfo: MessageTemplatesInfo = {
        token: sdkMessageTemplateToken,
        templatesMap: getProcessedTemplatesMap(parsedTemplates),
      };
      appInfoDispatcher({ type: INITIALIZE_MESSAGE_TEMPLATES_INFO, payload: newMessageTemplatesInfo });
    }
  };

  /**
   * If given message is a template message with template key and if the key does not exist in the cache,
   * update the cache by fetching the template.
   */
  const updateMessageTemplatesInfo = async (templateKeys: string[], requestedAt: number): Promise<void> => {
    if (appInfoDispatcher) {
      appInfoDispatcher({
        type: UPSERT_WAITING_TEMPLATE_KEYS,
        payload: {
          keys: templateKeys,
          requestedAt,
        },
      });

      let newParsedTemplates: SendbirdMessageTemplate[] | null = [];
      try {
        let hasMore = true;
        let token = null;
        while (hasMore) {
          const result = await sdk.message.getMessageTemplatesByToken(token, {
            keys: templateKeys,
          });
          result.templates.forEach((newTemplate) => {
            newParsedTemplates.push(JSON.parse(newTemplate.template));
          });
          hasMore = result.hasMore;
          token = result.token;
        }
      } catch (e) {
        logger?.error?.('Sendbird | fetchProcessedMessageTemplates failed', e);
      }

      if (newParsedTemplates.length > 0) {
        // Update cache
        const cachedMessageTemplates: string | null = localStorage.getItem(CACHED_MESSAGE_TEMPLATES_KEY);
        if (cachedMessageTemplates) {
          const parsedTemplates: SendbirdMessageTemplate[] = JSON.parse(cachedMessageTemplates);
          const existingKeys = parsedTemplates.map((parsedTemplate) => parsedTemplate.key);
          newParsedTemplates.forEach((newParsedTemplate) => {
            if (existingKeys.indexOf(newParsedTemplate.key) === -1) {
              parsedTemplates.push(newParsedTemplate);
            }
          })
          localStorage.setItem(CACHED_MESSAGE_TEMPLATES_KEY, JSON.stringify(parsedTemplates));
        } else {
          localStorage.setItem(CACHED_MESSAGE_TEMPLATES_KEY, JSON.stringify([newParsedTemplates]));
        }
        // Update memory
        appInfoDispatcher({
          type: UPSERT_MESSAGE_TEMPLATES,
          payload: newParsedTemplates.map((newParsedTemplate) => {
            return {
              key: newParsedTemplate.key,
              template: getProcessedTemplate(newParsedTemplate),
            };
          }),
        });
      } else {
        appInfoDispatcher({
          type: MARK_ERROR_WAITING_TEMPLATE_KEYS,
          payload: {
            keys: templateKeys,
          },
        });
      }
    }
  };

  return {
    getCachedTemplate,
    updateMessageTemplatesInfo,
    initializeMessageTemplatesInfo,
  };
}

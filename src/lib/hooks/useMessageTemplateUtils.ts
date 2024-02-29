import { MessageTemplatesInfo, ProcessedMessageTemplate } from '../dux/appInfo/initialState';
import { MessageTemplate, MessageTemplateListResult } from '@sendbird/chat/lib/__definition';
import { SendbirdMessageTemplate } from '../../ui/TemplateMessageItemBody/types';
import { getProcessedTemplate, getProcessedTemplates } from '../dux/appInfo/utils';
import SendbirdChat from '@sendbird/chat';
import { CACHED_MESSAGE_TEMPLATES_KEY, CACHED_MESSAGE_TEMPLATES_TOKEN_KEY } from '../../modules/App/types';
import { APP_INFO_ACTIONS } from '../dux/appInfo/actionTypes';

const MESSAGE_TEMPLATES_FETCH_LIMIT = 20;

export interface UseMessageTemplateUtilsWrapper {
  getCachedTemplate: (key: string) => ProcessedMessageTemplate | null;
  updateMessageTemplatesInfo: (templateKey: string, requestedAt: number) => Promise<void>;
  initializeMessageTemplatesInfo: (readySdk: SendbirdChat) => Promise<void>;
}

const {
  INITIALIZE_MESSAGE_TEMPLATES_INFO,
  UPSERT_MESSAGE_TEMPLATE,
  UPSERT_WAITING_TEMPLATE_KEY,
  MARK_ERROR_WAITING_TEMPLATE_KEY,
} = APP_INFO_ACTIONS;

export default function useMessageTemplateUtils({
  sdk,
  logger,
  appInfoStore,
  appInfoDispatcher,
}): UseMessageTemplateUtilsWrapper {
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
    const sdkMessageTemplateToken = readySdk!.appInfo?.messageTemplateInfo.token;

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
      || cachedMessageTemplatesToken !== sdkMessageTemplateToken!
    ) {
      const parsedTemplates: SendbirdMessageTemplate[] = await fetchAllMessageTemplates(readySdk);
      const newMessageTemplatesInfo: MessageTemplatesInfo = {
        token: sdkMessageTemplateToken,
        templatesMap: getProcessedTemplates(parsedTemplates),
      };
      appInfoDispatcher({ type: INITIALIZE_MESSAGE_TEMPLATES_INFO, payload: newMessageTemplatesInfo });
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
      appInfoDispatcher({ type: INITIALIZE_MESSAGE_TEMPLATES_INFO, payload: newMessageTemplatesInfo });
    }
  };

  /**
   * If given message is a template message with template key and if the key does not exist in the cache,
   * update the cache by fetching the template.
   */
  const updateMessageTemplatesInfo = async (templateKey: string, requestedAt: number): Promise<void> => {
    if (appInfoDispatcher) {
      appInfoDispatcher({
        type: UPSERT_WAITING_TEMPLATE_KEY,
        payload: {
          key: templateKey,
          requestedAt,
        },
      });

      let parsedTemplate: SendbirdMessageTemplate | null = null;
      try {
        const newTemplate: MessageTemplate = await sdk.message.getMessageTemplate(templateKey);
        parsedTemplate = JSON.parse(newTemplate.template);
      } catch (e) {
        logger?.error?.('Sendbird | fetchProcessedMessageTemplate failed', e);
      }

      if (parsedTemplate) {
        // Update cache
        const cachedMessageTemplates: string | null = localStorage.getItem(CACHED_MESSAGE_TEMPLATES_KEY);
        if (cachedMessageTemplates) {
          const parsedTemplates: SendbirdMessageTemplate[] = JSON.parse(cachedMessageTemplates);
          parsedTemplates.push(parsedTemplate);
          localStorage.setItem(CACHED_MESSAGE_TEMPLATES_KEY, JSON.stringify(parsedTemplates));
        } else {
          localStorage.setItem(CACHED_MESSAGE_TEMPLATES_KEY, JSON.stringify([parsedTemplate]));
        }
        // Update memory
        const processedTemplate: ProcessedMessageTemplate = getProcessedTemplate(parsedTemplate);
        appInfoDispatcher({
          type: UPSERT_MESSAGE_TEMPLATE,
          payload: {
            key: templateKey,
            template: processedTemplate,
          },
        });
      } else {
        appInfoDispatcher({
          type: MARK_ERROR_WAITING_TEMPLATE_KEY,
          payload: {
            key: templateKey,
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

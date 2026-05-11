import { act, renderHook } from '@testing-library/react';

import useMessageTemplateUtils, {
  getProcessedTemplate,
  getProcessedTemplatesMap,
} from '../useMessageTemplateUtils';
import {
  CACHED_MESSAGE_TEMPLATES_KEY,
  CACHED_MESSAGE_TEMPLATES_TOKEN_KEY,
} from '../../../utils/consts';

const createTemplate = (key: string, version = '1') => ({
  key,
  ui_template: {
    version,
    body: {
      items: [{ type: 'text', text: key }],
    },
  },
  color_variables: {
    primary: '#000000',
  },
});

const createSdk = (responses: Array<{ hasMore: boolean; token: string | null; templates: any[] }>, token = 'sdk-token') => ({
  appInfo: {
    messageTemplateInfo: { token },
  },
  message: {
    getMessageTemplatesByToken: jest.fn().mockImplementation(() => {
      const response = responses.shift();
      if (!response) throw new Error('unexpected fetch');
      return Promise.resolve(response);
    }),
  },
});

const createActions = () => ({
  initMessageTemplateInfo: jest.fn(),
  upsertWaitingTemplateKeys: jest.fn(),
  upsertMessageTemplates: jest.fn(),
  markErrorWaitingTemplateKeys: jest.fn(),
});

const createLogger = () => ({
  error: jest.fn(),
});

const renderUtils = ({
  sdk = createSdk([]),
  logger = createLogger(),
  appInfoStore = {},
  actions = createActions(),
}: any = {}) => {
  return {
    sdk,
    logger,
    actions,
    ...renderHook(() => useMessageTemplateUtils({
      sdk,
      logger,
      appInfoStore,
      actions,
    } as any)),
  };
};

describe('useMessageTemplateUtils', () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('processes templates into the cached shape', () => {
    const template = createTemplate('welcome', '7') as any;

    expect(getProcessedTemplate(template)).toEqual({
      version: 7,
      uiTemplate: JSON.stringify(template.ui_template.body.items),
      colorVariables: template.color_variables,
    });
    expect(getProcessedTemplatesMap([template])).toEqual({
      welcome: getProcessedTemplate(template),
    });
  });

  it('returns cached templates from app info store', () => {
    const cached = getProcessedTemplate(createTemplate('cached') as any);
    const { result, rerender } = renderUtils({
      appInfoStore: {
        messageTemplatesInfo: {
          token: 'cached-token',
          templatesMap: { cached },
        },
      },
    });

    expect(result.current.getCachedTemplate('cached')).toEqual(cached);
    expect(result.current.getCachedTemplate('missing')).toBeNull();

    rerender();
    expect(result.current.getCachedTemplate('cached')).toEqual(cached);
  });

  it('clears cached templates when SDK has no template token', async () => {
    localStorage.setItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY, 'old-token');
    localStorage.setItem(CACHED_MESSAGE_TEMPLATES_KEY, '[]');
    const sdk = createSdk([], null);
    const { result, actions } = renderUtils({ sdk });

    await act(async () => {
      await result.current.initializeMessageTemplatesInfo(sdk as any);
    });

    expect(localStorage.getItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(CACHED_MESSAGE_TEMPLATES_KEY)).toBeNull();
    expect(actions.initMessageTemplateInfo).not.toHaveBeenCalled();
  });

  it('fetches and caches all templates when the cached token is missing or outdated', async () => {
    const first = createTemplate('first');
    const second = createTemplate('second');
    const sdk = createSdk([
      { hasMore: true, token: 'next-page', templates: [{ template: JSON.stringify(first) }] },
      { hasMore: false, token: null, templates: [{ template: JSON.stringify(second) }] },
    ], 'fresh-token');
    const { result, actions } = renderUtils({ sdk });

    await act(async () => {
      await result.current.initializeMessageTemplatesInfo(sdk as any);
    });

    expect(sdk.message.getMessageTemplatesByToken).toHaveBeenNthCalledWith(1, null, { limit: 20 });
    expect(sdk.message.getMessageTemplatesByToken).toHaveBeenNthCalledWith(2, 'next-page', { limit: 20 });
    expect(actions.initMessageTemplateInfo).toHaveBeenCalledWith({
      payload: {
        token: 'fresh-token',
        templatesMap: getProcessedTemplatesMap([first, second] as any),
      },
    });
    expect(localStorage.getItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY)).toBe('fresh-token');
    expect(JSON.parse(localStorage.getItem(CACHED_MESSAGE_TEMPLATES_KEY) as string)).toEqual([first, second]);
  });

  it('loads message templates from localStorage when the token matches', async () => {
    const cached = createTemplate('cached');
    localStorage.setItem(CACHED_MESSAGE_TEMPLATES_TOKEN_KEY, 'same-token');
    localStorage.setItem(CACHED_MESSAGE_TEMPLATES_KEY, JSON.stringify([cached]));
    const sdk = createSdk([], 'same-token');
    const { result, actions } = renderUtils({ sdk });

    await act(async () => {
      await result.current.initializeMessageTemplatesInfo(sdk as any);
    });

    expect(sdk.message.getMessageTemplatesByToken).not.toHaveBeenCalled();
    expect(actions.initMessageTemplateInfo).toHaveBeenCalledWith({
      payload: {
        token: 'same-token',
        templatesMap: getProcessedTemplatesMap([cached] as any),
      },
    });
  });

  it('updates waiting keys, cache, and memory when requested templates are fetched', async () => {
    const existing = createTemplate('existing');
    const incoming = createTemplate('incoming');
    localStorage.setItem(CACHED_MESSAGE_TEMPLATES_KEY, JSON.stringify([existing]));
    const sdk = createSdk([
      { hasMore: true, token: 'next', templates: [{ template: JSON.stringify(existing) }] },
      { hasMore: false, token: null, templates: [{ template: JSON.stringify(incoming) }] },
    ]);
    const { result, actions } = renderUtils({ sdk });

    await act(async () => {
      await result.current.updateMessageTemplatesInfo(['existing', 'incoming'], 99, 1000);
    });

    expect(actions.upsertWaitingTemplateKeys).toHaveBeenCalledWith({
      keys: ['existing', 'incoming'],
      requestedAt: 1000,
    });
    expect(JSON.parse(localStorage.getItem(CACHED_MESSAGE_TEMPLATES_KEY) as string)).toEqual([existing, incoming]);
    expect(actions.upsertMessageTemplates).toHaveBeenCalledWith({
      payload: [existing, incoming].map((newParsedTemplate) => ({
        key: newParsedTemplate.key,
        template: getProcessedTemplate(newParsedTemplate as any),
      })),
    });
    expect(actions.markErrorWaitingTemplateKeys).not.toHaveBeenCalled();
  });

  it('stores fetched templates as a flat cache when no previous cache exists', async () => {
    const incoming = createTemplate('incoming');
    const sdk = createSdk([
      { hasMore: false, token: null, templates: [{ template: JSON.stringify(incoming) }] },
    ]);
    const { result } = renderUtils({ sdk });

    await act(async () => {
      await result.current.updateMessageTemplatesInfo(['incoming'], 99, 1000);
    });

    expect(JSON.parse(localStorage.getItem(CACHED_MESSAGE_TEMPLATES_KEY) as string)).toEqual([incoming]);
  });

  it('marks waiting keys as errored when fetching templates fails or returns none', async () => {
    const error = new Error('failed');
    const sdk = {
      message: {
        getMessageTemplatesByToken: jest.fn().mockRejectedValue(error),
      },
    };
    const logger = createLogger();
    const { result, actions } = renderUtils({ sdk, logger });

    await act(async () => {
      await result.current.updateMessageTemplatesInfo(['missing'], 101, 2000);
    });

    expect(logger.error).toHaveBeenCalledWith('Sendbird | fetchProcessedMessageTemplates failed', error, ['missing']);
    expect(actions.markErrorWaitingTemplateKeys).toHaveBeenCalledWith({
      keys: ['missing'],
      messageId: 101,
    });
  });
});

import './index.scss';
import React, { ReactElement, useEffect, useState } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import {
  getClassName, MessageTemplateTypes,
} from '../../utils';
import MessageTemplateWrapper from '../../modules/GroupChannel/components/MessageTemplateWrapper';
import {
  MessageTemplateData,
  MessageTemplateItem,
  SimpleTemplateData,
  TemplateType,
} from './types';
import selectColorVariablesByTheme from './utils/selectColorVariablesByTheme';
import { SendbirdTheme } from '../../types';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { ProcessedMessageTemplate, WaitingTemplateKeyData } from '../../lib/dux/appInfo/initialState';
import FallbackTemplateMessageItemBody from './FallbackTemplateMessageItemBody';
import LoadingTemplateMessageItemBody from './LoadingTemplateMessageItemBody';
import MessageTemplateErrorBoundary from '../MessageTemplate/messageTemplateErrorBoundary';
import { MESSAGE_TEMPLATE_KEY } from '../../utils/consts';
import flattenObject from './utils/flattenObject';

const TEMPLATE_FETCH_RETRY_BUFFER_TIME_IN_MILLIES = 500; // It takes about 450ms for isError update

export interface RenderData {
  filledMessageTemplateItemsList: {
    version: number;
    items: MessageTemplateItem[];
  }[];
  isErrored: boolean;
}

interface TemplateMessageItemBodyProps {
  className?: string;
  message: BaseMessage;
  isByMe?: boolean;
  theme?: SendbirdTheme;
  onTemplateMessageRenderedCallback?: (renderedTemplateBodyType: TemplateType | null) => void;
}

export const replaceVariablesInTemplateString = ({
  template,
  templateData = {},
  colorVariables,
  theme,
}: {
  template: string,
  templateData?: Record<string, any>,
  colorVariables?: Record<string, string>,
  theme?: SendbirdTheme,
}): string => {
  let selectedThemeColorVariables = {};
  if (colorVariables && theme) {
    selectedThemeColorVariables = selectColorVariablesByTheme({
      colorVariables,
      theme,
    });
  }
  const source = { ...templateData, ...selectedThemeColorVariables };
  const flattenedSource = flattenObject(source);

  let replaced = template;
  Object.entries(flattenedSource).forEach(([key, val]) => {
    const pattern = `\\{${key}\\}`;
    const regex = new RegExp(pattern, 'g');
    replaced = replaced.replace(regex, val);
  });
  return replaced;
};

export function TemplateMessageItemBody({
  className = '',
  message,
  isByMe = false,
  theme = 'light',
  onTemplateMessageRenderedCallback = () => { /* noop */ },
}: TemplateMessageItemBodyProps): ReactElement {
  const templateData: MessageTemplateData | undefined = message.extendedMessagePayload?.[MESSAGE_TEMPLATE_KEY] as MessageTemplateData;

  const getFailedBody = () => {
    onTemplateMessageRenderedCallback(null);
    return <FallbackTemplateMessageItemBody
      className={className}
      message={message}
      isByMe={isByMe}
    />;
  };

  if (!templateData?.key) {
    return getFailedBody();
  }
  const templateKey = templateData.key;

  const globalState = useSendbirdStateContext();
  if (!globalState) {
    return getFailedBody();
  }
  const logger = globalState.config.logger;

  /**
   * If no type given, draw default.
   * If wrong type given, render fallback message and log error.
   */
  if (templateData?.type && templateData?.type !== MessageTemplateTypes.default) {
    logger?.error?.(
      'TemplateMessageItemBody: invalid type value in message.extendedMessagePayload.message_template.',
      templateData,
    );
    return getFailedBody();
  }

  const {
    getCachedTemplate,
    updateMessageTemplatesInfo,
  } = globalState.utils;

  const waitingTemplateKeysMap = globalState.stores.appInfoStore.waitingTemplateKeysMap;

  const waitingTemplateKeysMapString = Object.entries(waitingTemplateKeysMap)
    .map(([key, value]) => {
      return [key, value.requestedAt, value.erroredMessageIds.join(',')].join('-');
    }).join('_');

  const [
    renderData,
    setRenderData,
  ] = useState<RenderData>(getFilledMessageTemplateItems());

  interface IndexPair {
    start: number;
    end: number;
  }

  function findSubstrings(input: string, matchString: string): IndexPair[] {
    const indices: IndexPair[] = [];
    let startIndex = 0;
    while ((startIndex = input.indexOf(matchString, startIndex)) !== -1) {
      indices.push({ start: startIndex, end: startIndex + matchString.length });
      startIndex += matchString.length;
    }
    return indices;
  }

  function replaceAtIndices(input: string, indices: IndexPair[], replacement: string): string {
    let result = '';
    let lastIndex = 0;
    indices.forEach(({ start, end }) => {
      result += input.slice(lastIndex, start) + replacement;
      lastIndex = end;
    });
    // Add any remaining part of the string after the last match
    result += input.slice(lastIndex);
    return result;
  }
  function replaceReservationKeys(templateString: string, reservationKey: string, replacement: string): string {
    const indices = findSubstrings(templateString, reservationKey);
    return replaceAtIndices(templateString, indices, replacement);
  }

  /**
   * Returns filled rootTemplate. Given rootTemplate,
   * 1. replace any reservation key with matching cached template,
   * 2. fill variables and view_variables.
   *
   * Assume below facts:
   * - carousel type template cannot have a carousel typed template in any
   * depth of items.
   * - However, box type template can have a carousel typed template in any
   * depth of items.
   *
   * @param rootTemplate
   */
  function getFilledRootTemplate(rootTemplate: ProcessedMessageTemplate): MessageTemplateItem[] {
    let rootTemplateString = replaceVariablesInTemplateString({
      template: rootTemplate.uiTemplate,
      templateData: templateData.variables,
      colorVariables: rootTemplate.colorVariables,
      theme: theme,
    });
    // 카루셀 템플릿이 (한개 이상) 암시된 경우
    if (templateData.view_variables) {
      const reservationKeyToItems: Record<string, string> = {};
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(templateData.view_variables).forEach(([reservationKey, simpleTemplateDataList]) => {
        const filledSimpleTemplates = [];
        simpleTemplateDataList.forEach((simpleTemplateData: SimpleTemplateData) => {
          const simpleTemplateKey = simpleTemplateData?.key;
          if (simpleTemplateKey) {
            const cachedTemplate = getCachedTemplate(simpleTemplateKey);
            if (!cachedTemplate) {
              logger.error('TemplateMessageItemBody | simple template is expected to be cached: ', simpleTemplateKey);
            }
            const items = replaceVariablesInTemplateString({
              template: cachedTemplate.uiTemplate,
              templateData: simpleTemplateData.variables,
              colorVariables: cachedTemplate.colorVariables,
              theme: theme,
            });
            filledSimpleTemplates.push({
              version: cachedTemplate.version,
              body: {
                items: JSON.parse(items),
              },
            });
            reservationKeyToItems[reservationKey] = JSON.stringify(filledSimpleTemplates);
          }
        });
      });
      Object.entries(reservationKeyToItems).forEach(([reservationKey, filledSimpleTemplates]) => {
        rootTemplateString = replaceReservationKeys(rootTemplateString, `"{@${reservationKey}}"`, filledSimpleTemplates);
      });
    }
    return JSON.parse(rootTemplateString);
  }

  function getFilledMessageTemplateItems(): RenderData {
    const result: RenderData = {
      filledMessageTemplateItemsList: [],
      isErrored: false,
    };

    const nonCachedTemplateKeys: string[] = [];
    const cachedTemplate = getCachedTemplate(templateKey);
    if (!cachedTemplate) {
      nonCachedTemplateKeys.push(templateKey);
    }
    if (templateData?.view_variables) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(templateData.view_variables).forEach(([_, simpleTemplateDataList]) => {
          simpleTemplateDataList.forEach((simpleTemplateData: SimpleTemplateData) => {
            const simpleTemplateKey = simpleTemplateData?.key;
            if (
              simpleTemplateKey
              && !getCachedTemplate(simpleTemplateKey)
              && !nonCachedTemplateKeys.includes(simpleTemplateKey)
            ) {
              nonCachedTemplateKeys.push(simpleTemplateKey);
            }
          });
        });
      } catch (e) {
        logger.error('TemplateMessageItemBody | received view_variables is malformed: ', templateData);
        result.isErrored = true;
        return result;
      }
    }
    try {
      if (nonCachedTemplateKeys.length > 0) {
        tryFetchTemplateByKey(nonCachedTemplateKeys);
      } else if (cachedTemplate) {
        const items = getFilledRootTemplate(cachedTemplate);
        result.filledMessageTemplateItemsList.push({
          version: cachedTemplate.version,
          items,
        });
      }
    } catch (e) {
      result.isErrored = true;
    }
    return result;
  }

  useEffect(() => {
    if (!renderData.isErrored && renderData.filledMessageTemplateItemsList.length === 0) {
      const newRenderData: RenderData = getFilledMessageTemplateItems();
      setRenderData(newRenderData);
    }
  }, [templateData.key, waitingTemplateKeysMapString]);

  /**
   * Attempt GET template by key IFF one of below cases is met:
   * 1. This is the first GET call for the template key.
   * 2. Minimum buffer time has passed since the previous GET error.
   */
  function tryFetchTemplateByKey(templateKeys: string[]) {
    if (templateKeys.length > 0) {
      const waitingTemplateKeyDataList: [string, WaitingTemplateKeyData | undefined][] = [];
      templateKeys.forEach((templateKey) => {
        const waitingTemplateKeyData: WaitingTemplateKeyData | undefined = waitingTemplateKeysMap[templateKey];
        waitingTemplateKeyDataList.push([templateKey, waitingTemplateKeyData]);
      });

      const requestedAt = Date.now();
      const keysToUpdate: string[] = [];
      waitingTemplateKeyDataList.forEach(([templateKey, waitingTemplateKeyData]) => {
        if (
          !waitingTemplateKeyData
          || (
            waitingTemplateKeyData.erroredMessageIds.indexOf(message.messageId) === -1
            && requestedAt > waitingTemplateKeyData.requestedAt + TEMPLATE_FETCH_RETRY_BUFFER_TIME_IN_MILLIES
          )
        ) {
          keysToUpdate.push(templateKey);
        } else if (waitingTemplateKeyData.erroredMessageIds.indexOf(message.messageId) > -1) {
          throw new Error(`TemplateMessageItemBody | fetching template key ${templateKey} for messageId: ${message.messageId} has failed.`);
        }
      });
      if (keysToUpdate.length > 0) {
        updateMessageTemplatesInfo(keysToUpdate, message.messageId, requestedAt);
      }
    }
  }

  if (renderData.isErrored) {
    return getFailedBody();
  }

  if (renderData.filledMessageTemplateItemsList.length === 0) {
    return <LoadingTemplateMessageItemBody className={className} isByMe={isByMe} />;
  }
  return (
    <div className={getClassName([
      className,
      isByMe ? 'outgoing' : 'incoming',
      'sendbird-template-message-item-body',
    ])}>
      <MessageTemplateErrorBoundary
        fallbackMessage={
          <FallbackTemplateMessageItemBody
            className={className}
            message={message}
            isByMe={isByMe}
          />
        }
        onTemplateMessageRenderedCallback={onTemplateMessageRenderedCallback}
        logger={logger}
      >
        {
          renderData.filledMessageTemplateItemsList.map((filledMessageTemplateItem, i) => (
            <MessageTemplateWrapper
              key={i}
              message={message}
              templateVersion={filledMessageTemplateItem.version ?? 0}
              templateItems={filledMessageTemplateItem.items}
            />
          ))
        }
      </MessageTemplateErrorBoundary>
    </div>
  );
}

export default TemplateMessageItemBody;

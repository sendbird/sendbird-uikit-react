import './index.scss';
import React, { ReactElement, useEffect, useState } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import { getClassName, removeAtAndBraces, startsWithAtAndEndsWithBraces } from '../../utils';
import MessageTemplateWrapper from '../../modules/GroupChannel/components/MessageTemplateWrapper';
import {CarouselItem, CarouselType, MessageTemplateData, MessageTemplateItem, SimpleTemplateData} from './types';
import restoreNumbersFromMessageTemplateObject from './utils/restoreNumbersFromMessageTemplateObject';
import mapData from './utils/mapData';
import selectColorVariablesByTheme from './utils/selectColorVariablesByTheme';
import { SendbirdTheme } from '../../types';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { ProcessedMessageTemplate, WaitingTemplateKeyData } from '../../lib/dux/appInfo/initialState';
import FallbackTemplateMessageItemBody from './FallbackTemplateMessageItemBody';
import LoadingTemplateMessageItemBody from './LoadingTemplateMessageItemBody';
import MessageTemplateErrorBoundary from '../MessageTemplate/messageTemplateErrorBoundary';

const TEMPLATE_FETCH_RETRY_BUFFER_TIME_IN_MILLIES = 500; // It takes about 450ms for isError update

interface RenderData {
  filledMessageTemplateItemsList: MessageTemplateItem[];
  isErrored: boolean;
}

interface TemplateMessageItemBodyProps {
  className?: string | Array<string>;
  message: BaseMessage;
  isByMe?: boolean;
  theme?: SendbirdTheme;
  onLoad?: () => void;
}

/**
 * Returns copied message template object filled with given template data and color variables.
 */
const getFilledMessageTemplateWithData = (
  template: MessageTemplateItem[],
  templateData: Record<string, any>,
  colorVariables: Record<string, string>,
  theme: SendbirdTheme,
): MessageTemplateItem[] => {
  const selectedThemeColorVariables = selectColorVariablesByTheme({
    colorVariables,
    theme,
  });
  const parsedTemplate: MessageTemplateItem[] = mapData({
    template: restoreNumbersFromMessageTemplateObject(template) as any,
    source: { ...templateData, ...selectedThemeColorVariables },
  }) as any;
  return parsedTemplate;
};

export function TemplateMessageItemBody({
  className = '',
  message,
  isByMe = false,
  theme = 'light',
}: TemplateMessageItemBodyProps): ReactElement {
  const templateData: MessageTemplateData | undefined = message.extendedMessagePayload?.['template'] as MessageTemplateData;
  if (!templateData?.key) {
    return <FallbackTemplateMessageItemBody className={className} message={message} isByMe={isByMe} />;
  }
  const templateKey = templateData.key;

  const globalState = useSendbirdStateContext();
  if (!globalState) {
    return <FallbackTemplateMessageItemBody className={className} message={message} isByMe={isByMe} />;
  }

  const {
    getCachedTemplate,
    updateMessageTemplatesInfo,
  } = globalState.utils;

  const logger = globalState.config.logger;

  const waitingTemplateKeysMap = globalState.stores.appInfoStore.waitingTemplateKeysMap;

  const waitingTemplateKeysMapString = Object.entries(waitingTemplateKeysMap)
    .map(([key, value]) => {
      return [key, value.requestedAt, value.erroredMessageIds.join(',')].join('-');
    }).join('_');

  const [
    renderData,
    setRenderData,
  ] = useState<RenderData>(getFilledMessageTemplateItems());

  function getFilledMessageTemplateItemsForCarouselTemplate(simpleTemplateDataList: SimpleTemplateData[]) {
    const cachedSimpleTemplates: ProcessedMessageTemplate[] = [];
    const simpleTemplatesVariables: Array<Record<string, any> | undefined> = [];
    simpleTemplateDataList.forEach((simpleTemplateData: SimpleTemplateData) => {
      const simpleTemplateKey = simpleTemplateData.key;
      if (!simpleTemplateKey) {
        logger.error('TemplateMessageItemBody | simple template keys are not found in view_variables: ', simpleTemplateDataList);
        throw new Error();
      }
      const simpleCachedTemplate = getCachedTemplate(simpleTemplateKey);
      cachedSimpleTemplates.push(simpleCachedTemplate);
      simpleTemplatesVariables.push(simpleTemplateData.variables);
    });
    const filledMessageTemplateItemsList = cachedSimpleTemplates
      .map((cachedSimpleTemplate, index) => {
        const templateItems: MessageTemplateItem[] = JSON.parse(cachedSimpleTemplate.uiTemplate);
        const filledMessageTemplateItems: MessageTemplateItem[] = getFilledMessageTemplateWithData(
          templateItems,
          simpleTemplatesVariables[index] ?? {},
          cachedSimpleTemplate.colorVariables,
          theme,
        );
        return filledMessageTemplateItems;
      });
    return filledMessageTemplateItemsList;
  }

  function getFilledMessageTemplateItemsForSimpleTemplate(
    templateItems: MessageTemplateItem[],
    colorVariables: Record<string, string>,
  ) {
    const filledMessageTemplateItems: MessageTemplateItem[] = getFilledMessageTemplateWithData(
      templateItems,
      templateData.variables ?? {},
      colorVariables,
      theme,
    );
    return filledMessageTemplateItems;
  }

  function getFilledMessageTemplateItems(): RenderData {
    const result = {
      filledMessageTemplateItemsList: [],
      isErrored: false,
    };

    const nonCachedTemplateKeys: string[] = [];
    const cachedTemplate = getCachedTemplate(templateKey);
    if (!cachedTemplate) {
      nonCachedTemplateKeys.push(templateKey);
    }
    if (templateData.view_variables) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(templateData.view_variables).forEach(([_, simpleTemplateDataList]) => {
        simpleTemplateDataList.forEach((simpleTemplateData: SimpleTemplateData) => {
          const simpleTemplateKey = simpleTemplateData?.key;
          if (simpleTemplateKey) {
            if (!getCachedTemplate(simpleTemplateKey)) {
              if (simpleTemplateKey && nonCachedTemplateKeys.indexOf(simpleTemplateKey) === -1) {
                nonCachedTemplateKeys.push(simpleTemplateKey);
              }
            }
          }
        });
      });
    }
    try {
      if (nonCachedTemplateKeys.length > 0) {
        tryFetchTemplateByKey(nonCachedTemplateKeys);
      } else {
        const parsedUiTemplate: MessageTemplateItem[] = JSON.parse(cachedTemplate.uiTemplate);
        if (!Array.isArray(parsedUiTemplate) || parsedUiTemplate.length === 0) {
          logger.error('TemplateMessageItemBody | parsed template is missing ui_template: ', parsedUiTemplate);
          throw new Error();
        }
        if (
          templateData.view_variables
          || parsedUiTemplate[0].type === CarouselType
          || typeof parsedUiTemplate[0]['items'] === 'string'
          || parsedUiTemplate[0]['spacing']
        ) {
          if (!templateData.view_variables) {
            logger.error('TemplateMessageItemBody | template key suggests composite template but template data is missing view_variables: ', templateKey, templateData);
            throw new Error();
          }
          const carouselItem = parsedUiTemplate[0] as unknown as CarouselItem;
          if (carouselItem.type !== CarouselType
            || typeof carouselItem.items !== 'string'
            || !startsWithAtAndEndsWithBraces(carouselItem.items)
            || !carouselItem.spacing
          ) {
            logger.error('TemplateMessageItemBody | composite template is malformed: ', templateKey, carouselItem);
            throw new Error();
          }
          if (parsedUiTemplate.length > 1) { // TODO: in future, support multiple templates
            logger.error('TemplateMessageItemBody | composite template currently does not support multiple items: ', parsedUiTemplate);
            throw new Error();
          }
          const reservationKey = removeAtAndBraces(carouselItem.items);
          const simpleTemplateDataList: SimpleTemplateData[] | undefined = templateData.view_variables[reservationKey];
          if (!simpleTemplateDataList) {
            logger.error('TemplateMessageItemBody | no reservation key found in view_variables: ', reservationKey, templateData.view_variables);
            throw new Error();
          }
          result.filledMessageTemplateItemsList = [{
            ...carouselItem,
            items: getFilledMessageTemplateItemsForCarouselTemplate(
              simpleTemplateDataList,
            ),
          }];
        } else {
          result.filledMessageTemplateItemsList = getFilledMessageTemplateItemsForSimpleTemplate(
            parsedUiTemplate,
            cachedTemplate.colorVariables,
          );
        }
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
          throw new Error();
        }
      });
      if (keysToUpdate.length > 0) {
        updateMessageTemplatesInfo(keysToUpdate, message.messageId, requestedAt);
      }
    }
  }

  if (renderData.isErrored) {
    return <FallbackTemplateMessageItemBody className={className} message={message} isByMe={isByMe} />;
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
        fallbackMessage={<FallbackTemplateMessageItemBody className={className} message={message} isByMe={isByMe}/>}
        logger={logger}
      >
        <MessageTemplateWrapper
          message={message}
          templateItems={
            renderData.filledMessageTemplateItemsList as MessageTemplateItem[]
          }
        />
      </MessageTemplateErrorBoundary>
    </div>
  );
}

export default TemplateMessageItemBody;

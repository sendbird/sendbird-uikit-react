import './index.scss';
import React, {ReactElement, useEffect, useState} from 'react';
import type {BaseMessage} from '@sendbird/chat/message';
import {getClassName, UI_CONTAINER_TYPES} from '../../utils';
import MessageTemplateWrapper from '../../modules/GroupChannel/components/MessageTemplateWrapper';
import {CarouselItem, MessageTemplateData, MessageTemplateItem, SimpleTemplateData} from './types';
import restoreNumbersFromMessageTemplateObject from './utils/restoreNumbersFromMessageTemplateObject';
import mapData from './utils/mapData';
import selectColorVariablesByTheme from './utils/selectColorVariablesByTheme';
import {SendbirdTheme} from '../../types';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import {ProcessedMessageTemplate, WaitingTemplateKeyData} from '../../lib/dux/appInfo/initialState';
import FallbackTemplateMessageItemBody from './FallbackTemplateMessageItemBody';
import LoadingTemplateMessageItemBody from './LoadingTemplateMessageItemBody';
import Carousel from '../Carousel';
import MessageTemplateErrorBoundary from '../MessageTemplate/messageTemplateErrorBoundary';

const TEMPLATE_FETCH_RETRY_BUFFER_TIME_IN_MILLIES = 500; // It takes about 450ms for isError update

interface TemplateMessageItemBodyProps {
  className?: string | Array<string>;
  message: BaseMessage;
  isByMe?: boolean;
  theme?: SendbirdTheme;
  conditionalSetUiContainerType?: (newUiContainerType: UI_CONTAINER_TYPES) => void;
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
  conditionalSetUiContainerType,
}: TemplateMessageItemBodyProps): ReactElement {
  const store = useSendbirdStateContext();
  const logger = store?.config?.logger;

  const templateData: MessageTemplateData | undefined = message.extendedMessagePayload?.['template'] as MessageTemplateData;
  if (!templateData?.key) {
    return <FallbackTemplateMessageItemBody className={className} message={message} isByMe={isByMe} />;
  }
  const templateKey = templateData.key;

  const globalState = useSendbirdStateContext();
  if (!globalState) {
    return <FallbackTemplateMessageItemBody className={className} message={message} isByMe={isByMe} />;
  }

  const [
    filledMessageTemplateItemsList,
    setFilledMessageTemplateItemsList,
  ] = useState<MessageTemplateItem[][]>([]);
  const [
    compositeTemplate,
    setCompositeTemplate,
  ] = useState<CarouselItem | null>(null);

  const {
    getCachedTemplate,
    updateMessageTemplatesInfo,
  } = globalState.utils;

  // const cachedTemplate = getCachedTemplate(templateData.key);
  // if (cachedTemplate) {
  //   const parsedUiTemplate: MessageTemplateItem[] = JSON.parse(cachedTemplate.uiTemplate);
  //   if (parsedUiTemplate.length === 0) {
  //     return <FallbackTemplateMessageItemBody className={className} message={message} isByMe={isByMe} />;
  //   }
  //     const templateItems: MessageTemplateItem[] = getFilledMessageTemplateWithData(
  //       parsedUiTemplate,
  //       templateData.variables ?? {},
  //       cachedTemplate.colorVariables,
  //       theme,
  //     );
  //     setFilledMessageTemplateItems(templateItems);
  // }

  const waitingTemplateKeysMap = globalState.stores.appInfoStore.waitingTemplateKeysMap;

  const [
    isErrored,
    setIsErrored,
  ] = useState(false);

  const waitingTemplateKeysMapString = Object.entries(waitingTemplateKeysMap)
    .map(([key, value]) => {
      return [key, value.requestedAt, value.isError].join('-');
    }).join(',');

  useEffect(() => {
    // Do not put && !isErrored here in case where errored key is fetched in the future by future message
    if (filledMessageTemplateItemsList.length === 0) {
      const cachedTemplate = getCachedTemplate(templateKey);
      const cachedSimpleTemplates: ProcessedMessageTemplate[] = [];
      const nonCachedTemplateKeys: string[] = [];
      const simpleTemplatesVariables: Array<Record<string, any> | undefined> = [];
      if (!cachedTemplate) {
        nonCachedTemplateKeys.push(templateKey);
      } else {
        try {
          const parsedUiTemplate: MessageTemplateItem[] = JSON.parse(cachedTemplate.uiTemplate);
          if (parsedUiTemplate.length === 0) {
            throw new Error();
          }
          // template is carousel
          if (parsedUiTemplate[0].type === 'carouselView') {
            // first validation
            if (
              parsedUiTemplate.length > 1 // TODO: in future, support multiple templates
              || typeof parsedUiTemplate[0].items !== 'string'
              || !templateData.view_variables
            ) {
              throw new Error();
            }
            const carouselItem: CarouselItem = parsedUiTemplate[0];
            const entries = Object.entries(templateData.view_variables);
            // second validation // TODO: in future, support multiple entries
            if (entries.length !== 1) {
              throw new Error();
            }
            const [reservationKey, simpleTemplateDataList] = entries[0];
            // third validation
            if (`{@${reservationKey}}` !== carouselItem.items) {
              throw new Error();
            }
            simpleTemplateDataList.forEach((simpleTemplateData: SimpleTemplateData, i) => {
              const simpleTemplateKey = simpleTemplateData.key;
              if (!simpleTemplateKey) {
                throw new Error();
              }
              const simpleCachedTemplate = getCachedTemplate(simpleTemplateKey);
              if (simpleCachedTemplate) {
                cachedSimpleTemplates.push(simpleCachedTemplate);
                simpleTemplatesVariables.push(simpleTemplateData.variables)
              } else {
                nonCachedTemplateKeys.push(simpleTemplateKey);
              }
            });
            setCompositeTemplate(carouselItem);
          } else {
            cachedSimpleTemplates.push(cachedTemplate);
            simpleTemplatesVariables.push(templateData.variables);
          }
        } catch (e) {
          setIsErrored(true);
          return;
        }
      }

      /**
       * Try fetch non-cached templates
       * !isErrored check prevents duplicate GET calls by already errored message when
       * a new message with same key is calling GET
       */
      if (nonCachedTemplateKeys.length > 0 && !isErrored) {
        tryFetchTemplateByKey(nonCachedTemplateKeys);
        return;
      }
      /**
       * If there is no non-cached templates, process all cached templates for render.
       */
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
      setFilledMessageTemplateItemsList(filledMessageTemplateItemsList);
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
          || requestedAt > waitingTemplateKeyData.requestedAt + TEMPLATE_FETCH_RETRY_BUFFER_TIME_IN_MILLIES
        ) {
          keysToUpdate.push(templateKey);
        } else if (waitingTemplateKeyData && waitingTemplateKeyData.isError) {
          setIsErrored(true);
          return;
        }
      });
      updateMessageTemplatesInfo(keysToUpdate, requestedAt);
    }
  }

  if (filledMessageTemplateItemsList.length === 0) {
    if (isErrored) {
      return <FallbackTemplateMessageItemBody className={className} message={message} isByMe={isByMe} />;
    }
    return <LoadingTemplateMessageItemBody className={className} isByMe={isByMe} />;
  }

  if (compositeTemplate) {
    conditionalSetUiContainerType?.(UI_CONTAINER_TYPES.DEFAULT_CAROUSEL);
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
        {
          !compositeTemplate
            ? <MessageTemplateWrapper message={message} templateItems={filledMessageTemplateItemsList[0]}/>
            : <Carousel
              id={message.messageId + ''}
              items={filledMessageTemplateItemsList.map((filledMessageTemplateItems) => (
                <MessageTemplateWrapper message={message} templateItems={filledMessageTemplateItems}/>
              ))}
              gap={compositeTemplate.spacing}
            />
        }</MessageTemplateErrorBoundary>
    </div>
  );
}

export default TemplateMessageItemBody;

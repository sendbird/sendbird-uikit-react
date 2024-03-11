import './index.scss';
import React, { ReactElement, useEffect, useState } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import { getClassName, removeAtAndBraces, startsWithAtAndEndsWithBraces } from '../../utils';
import MessageTemplateWrapper from '../../modules/GroupChannel/components/MessageTemplateWrapper';
import { CarouselItem, MessageTemplateData, MessageTemplateItem, SimpleTemplateData } from './types';
import restoreNumbersFromMessageTemplateObject from './utils/restoreNumbersFromMessageTemplateObject';
import mapData from './utils/mapData';
import selectColorVariablesByTheme from './utils/selectColorVariablesByTheme';
import { SendbirdTheme } from '../../types';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { ProcessedMessageTemplate, WaitingTemplateKeyData } from '../../lib/dux/appInfo/initialState';
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
  onMessageHeightChange?: () => void;
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
  onMessageHeightChange = () => { /* noop */ },
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

  const [
    filledMessageTemplateItemsList,
    setFilledMessageTemplateItemsList,
  ] = useState<MessageTemplateItem[][]>([]);
  const [
    compositeTemplate,
    setCompositeTemplate,
  ] = useState<CarouselItem | null>(null);
  const [
    showLoading,
    setShowLoading,
  ] = useState(false);

  const {
    getCachedTemplate,
    updateMessageTemplatesInfo,
  } = globalState.utils;

  const waitingTemplateKeysMap = globalState.stores.appInfoStore.waitingTemplateKeysMap;

  const [
    isErrored,
    setIsErrored,
  ] = useState(false);

  const waitingTemplateKeysMapString = Object.entries(waitingTemplateKeysMap)
    .map(([key, value]) => {
      return [key, value.requestedAt, value.isError].join('-');
    }).join(',');

  const logger = globalState.config.logger;

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
            logger.error('TemplateMessageItemBody | cached template does not have any items: ', templateKey);
            throw new Error();
          }
          if (parsedUiTemplate[0].type === 'carouselView') {
            const carouselItem: CarouselItem = parsedUiTemplate[0];
            if (parsedUiTemplate.length > 1) { // TODO: in future, support multiple templates
              logger.error('TemplateMessageItemBody | composite template currently does not support multiple items: ', parsedUiTemplate);
              throw new Error();
            }
            if (
              typeof carouselItem.items !== 'string'
              || !startsWithAtAndEndsWithBraces(carouselItem.items)
            ) {
              logger.error('TemplateMessageItemBody | composite template is malformed: ', carouselItem);
              throw new Error();
            }
            if (!templateData.view_variables) {
              logger.error('TemplateMessageItemBody | view_variables is missing in template data: ', templateData);
              throw new Error();
            }
            const reservationKey = removeAtAndBraces(carouselItem.items);
            const simpleTemplateDataList: SimpleTemplateData[] | undefined = templateData.view_variables[reservationKey];
            if (!simpleTemplateDataList) {
              logger.error('TemplateMessageItemBody | no reservation key found in view_variables: ', reservationKey, templateData.view_variables);
              throw new Error();
            }
            simpleTemplateDataList.forEach((simpleTemplateData: SimpleTemplateData) => {
              const simpleTemplateKey = simpleTemplateData.key;
              const simpleCachedTemplate = getCachedTemplate(simpleTemplateKey);
              if (simpleCachedTemplate) {
                cachedSimpleTemplates.push(simpleCachedTemplate);
                simpleTemplatesVariables.push(simpleTemplateData.variables);
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
          setShowLoading(false);
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
        setShowLoading(true);
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
      setShowLoading(false);
      setFilledMessageTemplateItemsList(filledMessageTemplateItemsList);
    }
  }, [templateData.key, waitingTemplateKeysMapString]);

  useEffect(() => {
    onMessageHeightChange();
  }, []);

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
          setShowLoading(false);
          setIsErrored(true);

        }
      });
      updateMessageTemplatesInfo(keysToUpdate, requestedAt);
    }
  }

  if (filledMessageTemplateItemsList.length === 0) {
    if (isErrored) {
      return <FallbackTemplateMessageItemBody className={className} message={message} isByMe={isByMe} />;
    }
    return showLoading && <LoadingTemplateMessageItemBody className={className} isByMe={isByMe} />;
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
              items={filledMessageTemplateItemsList.map((filledMessageTemplateItems, i) => (
                <MessageTemplateWrapper
                  key={`${message.messageId}-${i}`}
                  message={message}
                  templateItems={filledMessageTemplateItems}
                />
              ))}
              gap={compositeTemplate.spacing}
            />
        }
      </MessageTemplateErrorBoundary>
    </div>
  );
}

export default TemplateMessageItemBody;

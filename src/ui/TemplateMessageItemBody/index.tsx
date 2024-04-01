import './index.scss';
import React, { ReactElement, useEffect, useState } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import { getClassName, removeAtAndBraces, startsWithAtAndEndsWithBraces } from '../../utils';
import MessageTemplateWrapper from '../../modules/GroupChannel/components/MessageTemplateWrapper';
import {
  CarouselItem,
  MessageTemplateData,
  MessageTemplateItem,
  SendbirdUiTemplate,
  SimpleTemplateData,
} from './types';
import restoreNumbersFromMessageTemplateObject from './utils/restoreNumbersFromMessageTemplateObject';
import mapData from './utils/mapData';
import selectColorVariablesByTheme from './utils/selectColorVariablesByTheme';
import { SendbirdTheme } from '../../types';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { ProcessedMessageTemplate, WaitingTemplateKeyData } from '../../lib/dux/appInfo/initialState';
import FallbackTemplateMessageItemBody from './FallbackTemplateMessageItemBody';
import LoadingTemplateMessageItemBody from './LoadingTemplateMessageItemBody';
import MessageTemplateErrorBoundary from '../MessageTemplate/messageTemplateErrorBoundary';
import { RenderedTemplateBodyType } from '../MessageContent/MessageBody';
import { CompositeComponentType } from '@sendbird/uikit-message-template';

const TEMPLATE_FETCH_RETRY_BUFFER_TIME_IN_MILLIES = 500; // It takes about 450ms for isError update

interface RenderData {
  filledMessageTemplateItemsList: MessageTemplateItem[];
  isErrored: boolean;
  isComposite?: boolean;
  templateVersion?: number;
}

interface TemplateMessageItemBodyProps {
  className?: string | Array<string>;
  message: BaseMessage;
  isByMe?: boolean;
  theme?: SendbirdTheme;
  onTemplateMessageRenderedCallback?: (renderedTemplateBodyType: RenderedTemplateBodyType) => void;
}

/**
 * Returns copied message template object filled with given template data and color variables.
 */
const getFilledMessageTemplateWithData = ({
  template,
  templateData = {},
  colorVariables,
  theme,
}: {
  template: MessageTemplateItem[],
  templateData?: Record<string, any>,
  colorVariables?: Record<string, string>,
  theme?: SendbirdTheme,
}): MessageTemplateItem[] => {
  let selectedThemeColorVariables = {};
  if (colorVariables && theme) {
    selectedThemeColorVariables = selectColorVariablesByTheme({
      colorVariables,
      theme,
    });
  }
  const source = { ...templateData, ...selectedThemeColorVariables };
  const parsedTemplate: MessageTemplateItem[] = mapData({
    template: restoreNumbersFromMessageTemplateObject(template) as any,
    source,
  }) as any;
  return parsedTemplate;
};

export function TemplateMessageItemBody({
  className = '',
  message,
  isByMe = false,
  theme = 'light',
  onTemplateMessageRenderedCallback = () => { /* noop */ },
}: TemplateMessageItemBodyProps): ReactElement {
  const templateData: MessageTemplateData | undefined = message.extendedMessagePayload?.['template'] as MessageTemplateData;

  const getFailedBody = () => {
    onTemplateMessageRenderedCallback('failed');
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

  function getFilledMessageTemplateItemsForCarouselTemplateByMessagePayload(simpleTemplateDataList: SimpleTemplateData[]): {
    maxVersion: number,
    filledTemplates: MessageTemplateItem[][],
  } {
    const cachedSimpleTemplates: ProcessedMessageTemplate[] = [];
    const simpleTemplatesVariables: Array<Record<string, any> | undefined> = [];
    let maxVersion = 0;
    simpleTemplateDataList.forEach((simpleTemplateData: SimpleTemplateData) => {
      const simpleTemplateKey = simpleTemplateData.key;
      if (!simpleTemplateKey) {
        logger.error('TemplateMessageItemBody | simple template keys are not found in view_variables: ', simpleTemplateDataList);
        throw new Error('TemplateMessageItemBody | simple template keys are not found in view_variables.');
      }
      const simpleCachedTemplate = getCachedTemplate(simpleTemplateKey);
      cachedSimpleTemplates.push(simpleCachedTemplate);
      simpleTemplatesVariables.push(simpleTemplateData.variables);
      maxVersion = Math.max(maxVersion, simpleCachedTemplate.version);
    });
    const filledMessageTemplateItemsList: MessageTemplateItem[][] = cachedSimpleTemplates
      .map((cachedSimpleTemplate, index) => {
        const templateItems: MessageTemplateItem[] = JSON.parse(cachedSimpleTemplate.uiTemplate);
        const filledMessageTemplateItems: MessageTemplateItem[] = getFilledMessageTemplateWithData({
          template: templateItems,
          templateData: simpleTemplatesVariables[index],
          colorVariables: cachedSimpleTemplate.colorVariables,
          theme,
        });
        return filledMessageTemplateItems;
      });
    return {
      maxVersion,
      filledTemplates: filledMessageTemplateItemsList,
    };
  }

  function getFilledMessageTemplateItemsForCarouselTemplate(uiTemplates: SendbirdUiTemplate[]): {
    maxVersion: number,
    filledTemplates: MessageTemplateItem[][],
  } {
    let maxVersion = 0;
    const filledTemplates: MessageTemplateItem[][] = [];
    uiTemplates.forEach((uiTemplate: SendbirdUiTemplate) => {
      maxVersion = Math.max(maxVersion, uiTemplate.version);
      filledTemplates.push(uiTemplate.body.items);
    });
    return {
      maxVersion,
      filledTemplates,
    };
  }

  function getFilledMessageTemplateItemsForSimpleTemplate(
    templateItems: MessageTemplateItem[],
    colorVariables?: Record<string, string>,
  ): MessageTemplateItem[] {
    const filledMessageTemplateItems: MessageTemplateItem[] = getFilledMessageTemplateWithData({
      template: templateItems,
      templateData: templateData?.variables ?? {},
      colorVariables,
      theme,
    });
    return filledMessageTemplateItems;
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
    if (templateData.view_variables) {
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
      } else {
        const parsedUiTemplate: MessageTemplateItem[] = JSON.parse(cachedTemplate.uiTemplate);
        if (!Array.isArray(parsedUiTemplate) || parsedUiTemplate.length === 0) {
          logger.error('TemplateMessageItemBody | parsed template is missing ui_template: ', parsedUiTemplate);
          throw new Error('TemplateMessageItemBody | parsed template is missing ui_template. See error log in console for details');
        }
        /**
         * Composite template validation
         */
        if (parsedUiTemplate[0].type === CompositeComponentType.Carousel) {
          const carouselItem = parsedUiTemplate[0] as unknown as CarouselItem;
          if (parsedUiTemplate.length > 1) { // TODO: in future, support multiple templates
            logger.error('TemplateMessageItemBody | composite template currently does not support multiple items: ', parsedUiTemplate);
            throw new Error('TemplateMessageItemBody | composite template currently does not support multiple items. See error log in console for details');
          }
          if (typeof carouselItem.items === 'string') {
            if (!startsWithAtAndEndsWithBraces(carouselItem.items)) {
              logger.error('TemplateMessageItemBody | composite template with reservation key must follow the following string format "{@your-reservation-key}": ', templateKey, carouselItem);
              throw new Error('TemplateMessageItemBody | composite template with reservation key must follow the following string format "{@your-reservation-key}". See error log in console for details');
            }
            if (!templateData.view_variables) {
              logger.error('TemplateMessageItemBody | template key suggests composite template but template data is missing view_variables: ', templateKey, templateData);
              throw new Error('TemplateMessageItemBody | template key suggests composite template but template data is missing view_variables. See error log in console for details');
            }
            const reservationKey = removeAtAndBraces(carouselItem.items);
            const simpleTemplateDataList: SimpleTemplateData[] | undefined = templateData.view_variables[reservationKey];
            if (!simpleTemplateDataList) {
              logger.error('TemplateMessageItemBody | no reservation key found in view_variables: ', reservationKey, templateData.view_variables);
              throw new Error('TemplateMessageItemBody | no reservation key found in view_variables. See error log in console for details');
            }
            const { maxVersion, filledTemplates } = getFilledMessageTemplateItemsForCarouselTemplateByMessagePayload(
              simpleTemplateDataList,
            );
            result.isComposite = true;
            result.templateVersion = Math.max(cachedTemplate.version, maxVersion);
            result.filledMessageTemplateItemsList = [{
              type: carouselItem.type as CompositeComponentType,
              spacing: carouselItem.spacing,
              items: filledTemplates,
            }];
          } else if (Array.isArray(carouselItem.items)) {
            const { maxVersion, filledTemplates } = getFilledMessageTemplateItemsForCarouselTemplate(
              carouselItem.items,
            );
            result.isComposite = true;
            result.templateVersion = Math.max(cachedTemplate.version, maxVersion);
            result.filledMessageTemplateItemsList = [{
              type: carouselItem.type as CompositeComponentType,
              spacing: carouselItem.spacing,
              items: filledTemplates,
            }];
          } else {
            logger.error('TemplateMessageItemBody | composite template is malformed: ', templateKey, carouselItem);
            throw new Error('TemplateMessageItemBody | composite template is malformed. See error log in console for details');
          }
        } else {
          result.templateVersion = cachedTemplate.version;
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
        isComposite={renderData.isComposite}
        logger={logger}
      >
        <MessageTemplateWrapper
          message={message}
          templateVersion={renderData.templateVersion}
          templateItems={
            renderData.filledMessageTemplateItemsList as MessageTemplateItem[]
          }
        />
      </MessageTemplateErrorBoundary>
    </div>
  );
}

export default TemplateMessageItemBody;

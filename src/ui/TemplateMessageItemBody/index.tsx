import './index.scss';
import React, { ReactElement, useEffect, useState } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import { getClassName } from '../../utils';
import MessageTemplateWrapper from '../../modules/GroupChannel/components/MessageTemplateWrapper';
import { MessageTemplateData, MessageTemplateItem } from './types';
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

interface TemplateMessageItemBodyProps {
  className?: string | Array<string>;
  message: BaseMessage;
  isByMe?: boolean;
  theme?: SendbirdTheme;
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

  const {
    getCachedTemplate,
    updateMessageTemplatesInfo,
  } = globalState.utils;

  const waitingTemplateKeysMap = globalState.stores.appInfoStore.waitingTemplateKeysMap;

  const [
    filledMessageTemplateItems,
    setFilledMessageTemplateItems,
  ] = useState<MessageTemplateItem[]>(() => {
    const cachedTemplate = getCachedTemplate(templateData.key);
    if (cachedTemplate) {
      return getFilledMessageTemplateWithData(
        JSON.parse(cachedTemplate.uiTemplate),
        templateData.variables ?? {},
        cachedTemplate.colorVariables,
        theme,
      );
    } else {
      return [];
    }
  });
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
    if (filledMessageTemplateItems.length === 0) {
      const cachedTemplate: ProcessedMessageTemplate | null = getCachedTemplate(templateKey);
      if (cachedTemplate) {
        const filledMessageTemplateItems: MessageTemplateItem[] = getFilledMessageTemplateWithData(
          JSON.parse(cachedTemplate.uiTemplate),
          templateData.variables ?? {},
          cachedTemplate.colorVariables,
          theme,
        );
        setFilledMessageTemplateItems(filledMessageTemplateItems);
      } else if (!isErrored) { // This prevents duplicate GET calls by already errored message when a new message with same key is calling GET
        /**
         * Attempt GET template by key IFF one of below cases is met:
         * 1. This is the first GET call for the template key.
         * 2. Minimum buffer time has passed since the previous GET error.
         */
        const waitingTemplateKeyData: WaitingTemplateKeyData | undefined = waitingTemplateKeysMap[templateKey];
        const requestedAt = Date.now();
        if (
          !waitingTemplateKeyData
          || (
            requestedAt > waitingTemplateKeyData.requestedAt + TEMPLATE_FETCH_RETRY_BUFFER_TIME_IN_MILLIES
          )
        ) {
          updateMessageTemplatesInfo(templateData.key, Date.now());
        } else if (waitingTemplateKeyData && waitingTemplateKeyData.isError) {
          setIsErrored(true);
        }
      }
    }
  }, [templateData.key, waitingTemplateKeysMapString]);

  if (filledMessageTemplateItems.length === 0) {
    if (isErrored) {
      return <FallbackTemplateMessageItemBody className={className} message={message} isByMe={isByMe} />;
    }
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
        <MessageTemplateWrapper message={message} templateItems={filledMessageTemplateItems}/>
      </MessageTemplateErrorBoundary>
    </div>
  );
}

export default TemplateMessageItemBody;

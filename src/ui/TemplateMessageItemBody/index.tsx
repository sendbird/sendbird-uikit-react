import './index.scss';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import { getClassName } from '../../utils';
import MessageTemplateProvider from '../../modules/GroupChannel/components/MessageTemplateProvider';
import { MessageTemplateData, MessageTemplateItem } from './types';
import restoreNumbersFromMessageTemplateObject from './utils/restoreNumbersFromMessageTemplateObject';
import mapData from './utils/mapData';
import selectColorVariablesByTheme from './utils/selectColorVariablesByTheme';
import { SendbirdTheme } from '../../types';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { ProcessedMessageTemplate, WaitingTemplateKeyData } from '../../lib/dux/appInfo/initialState';
import Label, { LabelColors, LabelTypography } from '../Label';
import { LocalizationContext } from '../../lib/LocalizationContext';
import Icon, { IconColors, IconTypes } from '../Icon';
import Loader from '../Loader';

const TEMPLATE_FETCH_RETRY_BUFFER_TIME_IN_MILLIES = 500; // It takes about 450ms for isError update
const TEMPLATE_LOADING_SPINNER_SIZE = '40px';

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

interface FallbackMessageItemBodyProps {
  className?: string | Array<string>;
  message: BaseMessage;
  isByMe?: boolean;
}
function FallbackMessageItemBody({
  className,
  message,
  isByMe,
}: FallbackMessageItemBodyProps): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const text = message['message'];

  return (
    <div
      className={getClassName([
        className,
        isByMe ? 'outgoing' : 'incoming',
        'sendbird-template-message-item-body__fallback_message',
      ])}
    >
      {
        text
          ? <>
            <Label
              type={LabelTypography.BODY_1}
              color={LabelColors.ONCONTENT_INVERSE_1}
            >
              {text}
            </Label>
          </>
          : <>
            <Label
              className='sendbird-template-message-item-body__fallback_message__header'
              type={LabelTypography.BODY_1}
              color={LabelColors.ONCONTENT_INVERSE_1}
            >
              {stringSet.UNKNOWN__TEMPLATE_ERROR}
            </Label>
            <Label
              className='sendbird-template-message-item-body__fallback_message__description'
              type={LabelTypography.BODY_1}
              color={LabelColors.ONCONTENT_INVERSE_5}
            >
              {stringSet.UNKNOWN__CANNOT_READ_TEMPLATE}
            </Label>
          </>
      }
    </div>
  );
}

interface TemplateLoadingMessageItemBodyProps {
  className?: string | Array<string>;
  isByMe?: boolean;
}
function TemplateLoadingMessageItemBody({
  className,
  isByMe,
}: TemplateLoadingMessageItemBodyProps): ReactElement {
  return (
    <div
      className={getClassName([
        className,
        isByMe ? 'outgoing' : 'incoming',
        'sendbird-template-loading-message-item-body',
      ])}
    >
      <Loader
        className="sendbird-message-status__icon"
        width={TEMPLATE_LOADING_SPINNER_SIZE}
        height={TEMPLATE_LOADING_SPINNER_SIZE}
      >
        <Icon
          type={IconTypes.SPINNER}
          fillColor={IconColors.CONTENT_INVERSE_5}
          width={TEMPLATE_LOADING_SPINNER_SIZE}
          height={TEMPLATE_LOADING_SPINNER_SIZE}
        />
      </Loader>
    </div>
  );
}

export default function TemplateMessageItemBody({
  className = '',
  message,
  isByMe = false,
  theme = 'light',
}: TemplateMessageItemBodyProps): ReactElement {
  // FIXME: Can we use useSendbirdStateContext in this ui component?
  const templateData: MessageTemplateData | undefined = message.extendedMessagePayload?.['template'] as MessageTemplateData;
  if (!templateData?.key) {
    return <FallbackMessageItemBody className={className} message={message} isByMe={isByMe} />;
  }

  const globalState = useSendbirdStateContext();
  if (!globalState) {
    return <FallbackMessageItemBody className={className} message={message} isByMe={isByMe} />;
  }

  const {
    getCachedTemplate,
    updateMessageTemplatesInfo,
  } = globalState.utils;

  const waitingTemplateKeysMap = globalState.stores.appInfoStore.waitingTemplateKeysMap;

  const [
    filledMessageTemplateItems,
    setFilledMessageTemplateItems,
  ] = useState<MessageTemplateItem[]>([]);
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
      const templateKey = templateData.key;
      const cachedTemplate: ProcessedMessageTemplate | null = getCachedTemplate(templateKey);
      if (cachedTemplate) {
        // TODO: Replace logic is not working properly. Fix and use this than below
        // const filledMessageTemplateItems: MessageTemplateItem[] = parseTemplateWithReplaceReplacer(
        //   processedTemplate.uiTemplate,
        //   templateData.variables ?? {},
        //   processedTemplate.colorVariables,
        //   theme,
        // );

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
      return <FallbackMessageItemBody className={className} message={message} isByMe={isByMe} />;
    }
    return <TemplateLoadingMessageItemBody className={className} isByMe={isByMe} />;
  }

  return (
    <div className={getClassName([
      className,
      isByMe ? 'outgoing' : 'incoming',
      'sendbird-template-message-item-body',
    ])}>
      <MessageTemplateProvider message={message} templateItems={filledMessageTemplateItems} />
    </div>
  );
}

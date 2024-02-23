import './index.scss';
import React, { ReactElement, useEffect, useState } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import { CoreMessageType, getClassName } from '../../utils';
import MessageTemplateProvider from '../../modules/GroupChannel/components/MessageTemplateProvider';
import { MessageTemplateData, MessageTemplateItem } from './types';
import restoreNumbersFromMessageTemplateObject from './utils/restoreNumbersFromMessageTemplateObject';
import mapData from './utils/mapData';
import selectColorVariablesByTheme from './utils/selectColorVariablesByTheme';
import { SendbirdTheme } from '../../types';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { ProcessedMessageTemplate } from '../../lib/dux/appInfo/initialState';

interface Props {
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

const parseTemplateWithReplaceReplacer = (
  templateString: string,
  templateVariables: Record<string, string>,
  colorVariables: Record<string, unknown>,
  theme: SendbirdTheme,
): MessageTemplateItem[] => {
  const selectedThemeColorVariables = selectColorVariablesByTheme({
    colorVariables,
    theme,
  });
  let string = templateString.replace(/{([^"{}]+)}/g, (_, placeholder) => {
    const value = selectedThemeColorVariables[placeholder];
    return value || `{${placeholder}}`;
  });
  string = string.replace(/{([^"{}]+)}/g, (_, placeholder) => {
    const value = templateVariables[placeholder];
    return value || `{${placeholder}}`;
  });
  return JSON.parse(string);
};

export default function TemplateMessageItemBody({
  className = '',
  message,
  isByMe = false,
  theme = 'light',
}: Props): ReactElement {
  // FIXME: Can we use useSendbirdStateContext in this ui component?
  const templateData: MessageTemplateData | undefined = message.extendedMessagePayload?.['template'] as MessageTemplateData;
  if (!templateData?.key) {
    return null;
  }

  const globalState = useSendbirdStateContext();
  if (!globalState) {
    return null;
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

  useEffect(() => {
    if (filledMessageTemplateItems.length === 0) {
      const cachedTemplate: ProcessedMessageTemplate | null = getCachedTemplate(templateData.key);
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
      } else {
        updateMessageTemplatesInfo(templateData.key, Date.now());
      }
    }
  }, [templateData.key, Object.keys(waitingTemplateKeysMap)]); // FIXME: Need to add waitingTemplateKeysMap.join(',') as dependency but it is causing infinite loop!!!

  // loadPrev => keys => getMessagesTemplates({ keys })
  // if (loading) return null; getSingleTempalte()
  return (
    filledMessageTemplateItems.length > 0 && <div className={getClassName([
      className,
      isByMe ? 'outgoing' : 'incoming',
      'sendbird-template-message-item-body',
    ])}>
      <MessageTemplateProvider templateItems={filledMessageTemplateItems} />
    </div>
  );
}

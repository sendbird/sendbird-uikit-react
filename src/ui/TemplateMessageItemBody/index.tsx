import './index.scss';
import React, { ReactElement } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import { getClassName } from '../../utils';
import MessageTemplateProvider from '../../modules/GroupChannel/components/MessageTemplateProvider';
import { MessageTemplateData, MessageTemplateItem } from './types';
import restoreNumbersFromMessageTemplateObject from './utils/restoreNumbersFromMessageTemplateObject';
import mapData from './utils/mapData';
import selectColorVariablesByTheme from './utils/selectColorVariablesByTheme';
import { SendbirdTheme } from '../../types';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { ProcessedMessageTemplate, MessageTemplatesInfo } from '../../lib/dux/appInfo/initialState';

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
  const store = useSendbirdStateContext();
  const messageTemplatesInfo: MessageTemplatesInfo | undefined = store?.stores?.appInfoStore?.messageTemplatesInfo;
  const processedMessageTemplates: Record<string, ProcessedMessageTemplate> | undefined = messageTemplatesInfo?.templatesMap;
  if (!processedMessageTemplates) return;

  const templateData: MessageTemplateData = message.extendedMessagePayload?.['template'] as MessageTemplateData;
  const processedTemplate: ProcessedMessageTemplate = processedMessageTemplates[templateData.key];

  // FIXME: Replace logic is not working properly. Fix and use this than below
  // const filledMessageTemplateItems: MessageTemplateItem[] = parseTemplateWithReplaceReplacer(
  //   processedTemplate.uiTemplate,
  //   templateData.variables ?? {},
  //   processedTemplate.colorVariables,
  //   theme,
  // );
  const filledMessageTemplateItems: MessageTemplateItem[] = getFilledMessageTemplateWithData(
    JSON.parse(processedTemplate.uiTemplate),
    templateData.variables ?? {},
    processedTemplate.colorVariables,
    theme,
  );

  return (
    filledMessageTemplateItems && <div className={getClassName([
      className,
      'sendbird-template-message-item-body',
      isByMe ? 'outgoing' : 'incoming',
    ])}>
      <MessageTemplateProvider templateItems={filledMessageTemplateItems} />
    </div>
  );
}

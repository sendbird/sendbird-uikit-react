import './index.scss';
import React, { ReactElement } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import { getClassName } from '../../utils';
import MessageTemplateProvider from '../../modules/GroupChannel/components/MessageTemplateProvider';
import { MessageTemplateData, MessageTemplateItem, SendbirdMessageTemplate } from './types';
import restoreNumbersFromMessageTemplateObject from './utils/restoreNumbersFromMessageTemplateObject';
import mapData from './utils/mapData';
import selectColorVariablesByTheme from './utils/selectColorVariablesByTheme';
import { SendbirdTheme } from '../../types';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { MessageTemplatesInfo } from '../../lib/dux/appInfo/initialState';

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

export default function TemplateMessageItemBody({
  className = '',
  message,
  isByMe = false,
  theme = 'light',
}: Props): ReactElement {
  // FIXME: Can we use useSendbirdStateContext in this ui component?
  const store = useSendbirdStateContext();
  const messageTemplatesInfo: MessageTemplatesInfo | undefined = store?.stores?.appInfoStore?.messageTemplatesInfo;
  const allMessageTemplates: Record<string, SendbirdMessageTemplate> | undefined = messageTemplatesInfo?.templates;
  if (!allMessageTemplates) return;

  const templateData: MessageTemplateData = message.extendedMessagePayload?.['template'] as MessageTemplateData;
  const template: SendbirdMessageTemplate = allMessageTemplates[templateData.key];

  // TODO: What is data schema? do we have to use this?
  const filledMessageTemplateItems: MessageTemplateItem[] = getFilledMessageTemplateWithData(
    template.ui_template.body.items,
    templateData.variables ?? {},
    template.color_variables,
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

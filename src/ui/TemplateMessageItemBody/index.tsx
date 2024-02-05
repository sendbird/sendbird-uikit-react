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

interface Props {
  className?: string | Array<string>;
  message: BaseMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isReactionEnabled?: boolean;
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
  mouseHover = false,
  isReactionEnabled = false,
  theme = 'light',
}: Props): ReactElement {
  // FIXME: Is there more efficient way than below? Below parses the whole large messsage templates.
  const allMessageTemplates: SendbirdMessageTemplate[] = JSON.parse(localStorage.getItem('message_templates')); // sb.getAllMessageTemplates();
  if (!allMessageTemplates) return;

  const templateData: MessageTemplateData = message.extendedMessagePayload?.['template'] as MessageTemplateData;
  const template: SendbirdMessageTemplate = allMessageTemplates[templateData.key];
  const filledMessageTemplateItems: MessageTemplateItem[] = getFilledMessageTemplateWithData(
    template.ui_template.body.items,
    templateData.variables,
    template.color_variables,
    theme,
  );

  return (
    filledMessageTemplateItems && <div className={getClassName([
      className,
      'sendbird-template-message-item-body',
      isByMe ? 'outgoing' : 'incoming',
      mouseHover ? 'mouse-hover' : '',
      (isReactionEnabled && message?.reactions?.length > 0) ? 'reactions' : '',
    ])}>
      <MessageTemplateProvider templateItems={filledMessageTemplateItems} />
    </div>
  );
}

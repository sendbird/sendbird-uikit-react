import { MessageTemplateDataSchemaProperty } from '../../../ui/TemplateMessageItemBody/types';

export type ProcessedMessageTemplate = {
  uiTemplate?: string; // This is stringified ui_template.
  colorVariables?: Record<string, string>;
  dataSchema?: { properties: MessageTemplateDataSchemaProperty[] };
};

export interface MessageTemplatesInfo {
  token?: string; // This server-side token gets updated on every POST/PUT on message template table.
  templatesMap?: Record<string, ProcessedMessageTemplate>;
}

export interface AppInfoStateType {
  messageTemplatesInfo: MessageTemplatesInfo;
}

const initialState: AppInfoStateType = {
  messageTemplatesInfo: {} as MessageTemplatesInfo,
};

export default initialState;

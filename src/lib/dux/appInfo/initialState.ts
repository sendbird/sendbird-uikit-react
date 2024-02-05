import { SendbirdMessageTemplate } from '../../../ui/TemplateMessageItemBody/types';

export interface MessageTemplatesInfo {
  token?: string; // This server-side token gets updated on every POST/PUT on message template table.
  templates?: Record<string, SendbirdMessageTemplate>;
}

export interface AppInfoStateType {
  messageTemplatesInfo: MessageTemplatesInfo;
}

const initialState: AppInfoStateType = {
  messageTemplatesInfo: {} as MessageTemplatesInfo,
};

export default initialState;

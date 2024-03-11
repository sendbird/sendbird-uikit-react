export type ProcessedMessageTemplate = {
  uiTemplate: string; // This is stringified ui_template.body.items
  colorVariables?: Record<string, string>;
};

export interface MessageTemplatesInfo {
  token: string; // This server-side token gets updated on every CRUD operation on message template table.
  templatesMap: Record<string, ProcessedMessageTemplate>;
}

export interface WaitingTemplateKeyData {
  requestedAt: number;
  isError: boolean;
}

export interface AppInfoStateType {
  messageTemplatesInfo?: MessageTemplatesInfo;
  /**
   * This represents template keys that are currently waiting for its fetch response.
   * Whenever initialized, request succeeds or fails, it needs to be updated.
   */
  waitingTemplateKeysMap: Record<string, WaitingTemplateKeyData>;
}

const initialState: AppInfoStateType = {
  waitingTemplateKeysMap: {},
};

export default initialState;

export type ProcessedMessageTemplate = {
  uiTemplate: string; // This is stringified ui_template.
  colorVariables?: Record<string, string>;
};

export interface MessageTemplatesInfo {
  token: string; // This server-side token gets updated on every POST/PUT on message template table.
  templatesMap: Record<string, ProcessedMessageTemplate>;
}

export interface AppInfoStateType {
  messageTemplatesInfo?: MessageTemplatesInfo;
  /**
   * This represents template keys that are currently waiting for its fetch response.
   * Whenever initialized, request succeeds or fails, it needs to be updated.
   */
  waitingTemplateKeysMap: Record<string, number>;
}

const initialState: AppInfoStateType = {
  waitingTemplateKeysMap: {},
};

export default initialState;

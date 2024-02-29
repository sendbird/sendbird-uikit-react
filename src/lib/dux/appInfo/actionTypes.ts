import { CreateAction } from '../../../utils/typeHelpers/reducers/createAction';
import { MessageTemplatesInfo, ProcessedMessageTemplate } from './initialState';

export const APP_INFO_ACTIONS = {
  INITIALIZE_MESSAGE_TEMPLATES_INFO: 'INITIALIZE_MESSAGE_TEMPLATES_INFO',
  UPSERT_MESSAGE_TEMPLATE: 'UPSERT_MESSAGE_TEMPLATE',
  UPSERT_WAITING_TEMPLATE_KEY: 'UPSERT_WAITING_TEMPLATE_KEY',
  MARK_ERROR_WAITING_TEMPLATE_KEY: 'MARK_ERROR_WAITING_TEMPLATE_KEY',
} as const;

export type TemplatesMapData = {
  key: string;
  template: ProcessedMessageTemplate;
};

type APP_INFO_PAYLOAD_TYPES = {
  [APP_INFO_ACTIONS.INITIALIZE_MESSAGE_TEMPLATES_INFO]: MessageTemplatesInfo,
  [APP_INFO_ACTIONS.UPSERT_MESSAGE_TEMPLATE]: TemplatesMapData,
  [APP_INFO_ACTIONS.UPSERT_WAITING_TEMPLATE_KEY]: { key: string, requestedAt: number },
  [APP_INFO_ACTIONS.MARK_ERROR_WAITING_TEMPLATE_KEY]: { key: string },
};

export type AppInfoActionTypes = CreateAction<APP_INFO_PAYLOAD_TYPES>;

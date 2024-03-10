import { CreateAction } from '../../../utils/typeHelpers/reducers/createAction';
import { MessageTemplatesInfo, ProcessedMessageTemplate } from './initialState';

export const APP_INFO_ACTIONS = {
  INITIALIZE_MESSAGE_TEMPLATES_INFO: 'INITIALIZE_MESSAGE_TEMPLATES_INFO',
  UPSERT_MESSAGE_TEMPLATES: 'UPSERT_MESSAGE_TEMPLATES',
  UPSERT_WAITING_TEMPLATE_KEYS: 'UPSERT_WAITING_TEMPLATE_KEY',
  MARK_ERROR_WAITING_TEMPLATE_KEYS: 'MARK_ERROR_WAITING_TEMPLATE_KEYS',
} as const;

export type TemplatesMapData = {
  key: string;
  template: ProcessedMessageTemplate;
};

type APP_INFO_PAYLOAD_TYPES = {
  [APP_INFO_ACTIONS.INITIALIZE_MESSAGE_TEMPLATES_INFO]: MessageTemplatesInfo,
  [APP_INFO_ACTIONS.UPSERT_MESSAGE_TEMPLATES]: TemplatesMapData[],
  [APP_INFO_ACTIONS.UPSERT_WAITING_TEMPLATE_KEYS]: { keys: string[], requestedAt: number },
  [APP_INFO_ACTIONS.MARK_ERROR_WAITING_TEMPLATE_KEYS]: { keys: string[] },
};

export type AppInfoActionTypes = CreateAction<APP_INFO_PAYLOAD_TYPES>;

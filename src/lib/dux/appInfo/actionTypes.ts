import { CreateAction } from '../../../utils/typeHelpers/reducers/createAction';
import { MessageTemplatesInfo } from './initialState';

export const APP_INFO_ACTIONS = {
  UPSERT_MESSAGE_TEMPLATES_INFO: 'UPSERT_MESSAGE_TEMPLATES_INFO',
} as const;

type APP_INFO_PAYLOAD_TYPES = {
  [APP_INFO_ACTIONS.UPSERT_MESSAGE_TEMPLATES_INFO]: MessageTemplatesInfo,
};

export type AppInfoActionTypes = CreateAction<APP_INFO_PAYLOAD_TYPES>;

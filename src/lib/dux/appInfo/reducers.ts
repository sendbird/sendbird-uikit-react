import { match } from 'ts-pattern';
import { AppInfoStateType, WaitingTemplateKeyData } from './initialState';
import { APP_INFO_ACTIONS, AppInfoActionTypes } from './actionTypes';

export default function reducer(state: AppInfoStateType, action: AppInfoActionTypes): AppInfoStateType {
  return match(action)
    .with(
      { type: APP_INFO_ACTIONS.INITIALIZE_MESSAGE_TEMPLATES_INFO },
      ({ payload }) => {
        return {
          messageTemplatesInfo: payload,
          waitingTemplateKeysMap: {},
        };
      })
    .with(
      { type: APP_INFO_ACTIONS.UPSERT_MESSAGE_TEMPLATE },
      ({ payload }) => {
        const templatesInfo = state.messageTemplatesInfo;
        if (!templatesInfo) return state; // Not initialized. Ignore.

        const { key, template } = payload;
        templatesInfo.templatesMap[key] = template;

        delete state.waitingTemplateKeysMap[key];

        return {
          ...state,
          messageTemplatesInfo: templatesInfo,
        };
      })
    .with(
      { type: APP_INFO_ACTIONS.UPSERT_WAITING_TEMPLATE_KEY },
      ({ payload }) => {
        const { key, requestedAt } = payload;
        state.waitingTemplateKeysMap[key] = {
          requestedAt,
          isError: false,
        };
        return state;
      })
    .with(
      { type: APP_INFO_ACTIONS.MARK_ERROR_WAITING_TEMPLATE_KEY },
      ({ payload }) => {
        const { key } = payload;
        const waitingTemplateKeyData: WaitingTemplateKeyData | undefined = state.waitingTemplateKeysMap[key];
        if (waitingTemplateKeyData) {
          waitingTemplateKeyData.isError = true;
        }
        return { ...state };
      })
    .otherwise(() => {
      return state;
    });
}

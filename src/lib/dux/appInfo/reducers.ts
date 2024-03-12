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
      { type: APP_INFO_ACTIONS.UPSERT_MESSAGE_TEMPLATES },
      ({ payload }) => {
        const templatesInfo = state.messageTemplatesInfo;
        if (!templatesInfo) return state; // Not initialized. Ignore.

        const waitingTemplateKeysMap = state.waitingTemplateKeysMap;
        payload.forEach((templatesMapData) => {
          const { key, template } = templatesMapData;
          templatesInfo.templatesMap[key] = template;
          delete waitingTemplateKeysMap[key];
        });
        return {
          ...state,
          messageTemplatesInfo: templatesInfo,
        };
      })
    .with(
      { type: APP_INFO_ACTIONS.UPSERT_WAITING_TEMPLATE_KEYS },
      ({ payload }) => {
        const { keys, requestedAt } = payload;
        keys.forEach((key) => {
          state.waitingTemplateKeysMap[key] = {
            erroredMessageIds: state.waitingTemplateKeysMap[key]?.erroredMessageIds ?? [],
            requestedAt,
          };
        });
        return { ...state };
      })
    .with(
      { type: APP_INFO_ACTIONS.MARK_ERROR_WAITING_TEMPLATE_KEYS },
      ({ payload }) => {
        const { keys, messageId } = payload;
        keys.forEach((key) => {
          const waitingTemplateKeyData: WaitingTemplateKeyData | undefined = state.waitingTemplateKeysMap[key];
          if (waitingTemplateKeyData && waitingTemplateKeyData.erroredMessageIds.indexOf(messageId) === -1) {
            waitingTemplateKeyData.erroredMessageIds.push(messageId);
          }
        });
        return { ...state };
      })
    .otherwise(() => {
      return state;
    });
}

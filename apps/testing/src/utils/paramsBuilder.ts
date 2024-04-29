import { UIKitOptions } from '../../../../src/lib/types.ts';
import { useSearchParams } from 'react-router-dom';

export interface InitialParams {
  appId?: string;
  userId?: string;
  nickname?: string;
  accessToken?: string;
}

interface ParamsAsProps {
  appId: string;
  userId: string;
  nickname: string;
  accessToken?: string;
  allowProfileEdit: boolean;
  isMultipleFilesMessageEnabled: boolean;
  uikitOptions: UIKitOptions;
}

export const useConfigParams = (initParams: InitialParams): ParamsAsProps => {
  const [searchParams] = useSearchParams();

  const response = {
    appId: searchParams.get('appId') || initParams.appId,
    userId: searchParams.get('userId') || initParams.userId,
    nickname: searchParams.get('nickname') || initParams.nickname || initParams.userId,
    accessToken: searchParams.get('accessToken') || initParams.accessToken,
    allowProfileEdit: parseValue(searchParams.get('enableProfileEdit')) ?? true,
    isMultipleFilesMessageEnabled: parseValue(searchParams.get('enableMultipleFilesMessage')) ?? true,
    uikitOptions: {},
  } as ParamsAsProps;

  if (!response.appId) throw new Error(`Invalid app id: ${response.appId}`);
  if (!response.userId) throw new Error(`Invalid user id: ${response.userId}`);
  if (!response.accessToken) delete response.accessToken;

  paramKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      const keys = key.split('_');
      // eslint-disable-next-line
      let target = response.uikitOptions as any;

      for (let i = 0; i < keys.length; i++) {
        const isTargetKey = i === keys.length - 1;
        if (isTargetKey) {
          // Handle the multiple select props
          if (key === 'groupChannel_typingIndicatorTypes') {
            target[keys[i]] = new Set(value.split(','));
          } else {
            target[keys[i]] = parseValue(value);
          }
        } else {
          // Make object which is separated by `_`
          if (!target[keys[i]]) target[keys[i]] = {};
          target = target[keys[i]];
        }
      }
    }
  });

  return response;
};

function parseValue(value?: string | null) {
  if (!value) return value;
  if (value.toLowerCase().match(/true/)) {
    return true;
  }
  if (value.toLowerCase().match(/false/)) {
    return false;
  }
  return value;
}

export const paramKeys = [
  'common_enableUsingDefaultUserProfile',
  'groupChannel_enableOgtag',
  'groupChannel_enableTypingIndicator',
  'groupChannel_enableReactions',
  'groupChannel_enableReactionsSupergroup',
  'groupChannel_enableMention',
  'groupChannel_replyType',
  'groupChannel_threadReplySelectType',
  'groupChannel_enableVoiceMessage',
  'groupChannel_input_camera_enablePhoto',
  'groupChannel_input_camera_enableVideo',
  'groupChannel_input_gallery_enablePhoto',
  'groupChannel_input_gallery_enableVideo',
  'groupChannel_input_enableDocument',
  'groupChannel_typingIndicatorTypes',
  'groupChannel_enableFeedback',
  'groupChannel_enableSuggestedReplies',
  'groupChannel_showSuggestedRepliesFor',
  'groupChannelList_enableTypingIndicator',
  'groupChannelList_enableMessageReceiptStatus',
  'groupChannelSetting_enableMessageSearch',
  'openChannel_enableOgtag',
  'openChannel_input_camera_enablePhoto',
  'openChannel_input_camera_enableVideo',
  'openChannel_input_gallery_enablePhoto',
  'openChannel_input_gallery_enableVideo',
  'openChannel_input_enableDocument',
];

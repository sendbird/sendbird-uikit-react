import React, { useEffect } from 'react';
import './index.scss';
import './__experimental__typography.scss';

import { UIKitConfigProvider } from '@sendbird/uikit-tools';

import type { SendbirdProviderProps, SendbirdState, UIKitOptions } from './types';
import { uikitConfigMapper } from '../utils/uikitConfigMapper';
import { uikitConfigStorage } from '../utils/uikitConfigStorage';
import { SendbirdContextProvider } from './context/SendbirdProvider';
import useSendbird from './context/hooks/useSendbird';

// For Exportation
export const SendbirdProvider = (props: SendbirdProviderProps) => {
  const localConfigs: UIKitOptions = uikitConfigMapper({
    legacyConfig: {
      replyType: props.replyType,
      isMentionEnabled: props.isMentionEnabled,
      isReactionEnabled: props.isReactionEnabled,
      disableUserProfile: props.disableUserProfile,
      isVoiceMessageEnabled: props.isVoiceMessageEnabled,
      isTypingIndicatorEnabledOnChannelList: props.isTypingIndicatorEnabledOnChannelList,
      isMessageReceiptStatusEnabledOnChannelList: props.isMessageReceiptStatusEnabledOnChannelList,
      showSearchIcon: props.showSearchIcon,
    },
    uikitOptions: props.uikitOptions,
  });

  return (
    <UIKitConfigProvider
      storage={uikitConfigStorage}
      localConfigs={{
        common: localConfigs?.common,
        groupChannel: {
          channel: localConfigs?.groupChannel,
          channelList: localConfigs?.groupChannelList,
          setting: localConfigs?.groupChannelSettings,
        },
        openChannel: {
          channel: localConfigs?.openChannel,
        },
      }}
    >
      <SendbirdContextProvider {...props} />
    </UIKitConfigProvider>
  );
};

export function useSendbirdStateContext(): SendbirdState {
  const { state, actions } = useSendbird();
  return { ...state, ...actions };
}

export default SendbirdProvider;

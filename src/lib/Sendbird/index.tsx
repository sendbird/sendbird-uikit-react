import React from 'react';
import './index.scss';
import './__experimental__typography.scss';

import type { SendbirdProviderProps, UIKitOptions } from './types';
import { UIKitConfigProvider } from '@sendbird/uikit-tools';
import { uikitConfigMapper } from '../utils/uikitConfigMapper';
import { uikitConfigStorage } from '../utils/uikitConfigStorage';
import { SendbirdContextProvider } from './context/SendbirdProvider';

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

// const NO_CONTEXT_ERROR = 'No sendbird state value available. Make sure you are rendering `<SendbirdProvider>` at the top of your app.';
// export function useSendbirdStateContext(): SendbirdState {
//   const context = useContext(SendbirdContext);
//   if (!context) throw new Error(NO_CONTEXT_ERROR);
//   return context;
// }

export default SendbirdProvider;

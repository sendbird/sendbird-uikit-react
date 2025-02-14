import React from 'react';
import './index.scss';
import './__experimental__typography.scss';

import { UIKitConfigProvider } from '@sendbird/uikit-tools';

import type { SendbirdProviderProps, UIKitOptions } from './types';
import { uikitConfigMapper } from '../utils/uikitConfigMapper';
import { uikitConfigStorage } from '../utils/uikitConfigStorage';
import { SendbirdContextProvider } from './context/SendbirdProvider';
import useSendbird from './context/hooks/useSendbird';

export type { SendbirdProviderProps } from './types';

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

type ContextAwareComponentType = {
  (props: any): JSX.Element;
  displayName: string;
};
type PropsType = Record<string, any>;
const withSendbirdContext = (OriginalComponent: any, mapStoreToProps: (props: any) => PropsType): ContextAwareComponentType => {
  const ContextAwareComponent = (props) => {
    const { state, actions } = useSendbird();
    const context = { ...state, ...actions };
    if (!mapStoreToProps || typeof mapStoreToProps !== 'function') {
      // eslint-disable-next-line no-console
      console.warn('Second parameter to withSendbirdContext must be a pure function');
    }
    const mergedProps = (mapStoreToProps && typeof mapStoreToProps === 'function')
      ? { ...mapStoreToProps(context), ...props }
      : { ...context, ...props };
    return <>
      <OriginalComponent {...mergedProps} />
    </>;
  };

  const componentName = OriginalComponent.displayName || OriginalComponent.name || 'Component';
  ContextAwareComponent.displayName = `SendbirdAware${componentName}`;

  return ContextAwareComponent;
};
/**
 * @deprecated This function is deprecated. Use `useSendbird` instead.
 * */
export const withSendBird = withSendbirdContext;

export default SendbirdProvider;

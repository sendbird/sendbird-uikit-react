import React from 'react';
import OpenChannelUI, {
  OpenChannelUIProps,
} from './components/OpenChannelUI';
import { OpenChannelProvider, OpenChannelProviderProps } from './context/OpenChannelProvider';

export interface OpenChannelProps extends OpenChannelProviderProps, OpenChannelUIProps {}
const OpenChannel: React.FC<OpenChannelProps> = (props: OpenChannelProps) => {
  return (
    <OpenChannelProvider
      channelUrl={props?.channelUrl}
      useMessageGrouping={props?.useMessageGrouping}
      queries={props?.queries}
      messageLimit={props?.messageLimit}
      onBeforeSendUserMessage={props?.onBeforeSendUserMessage}
      onBeforeSendFileMessage={props?.onBeforeSendFileMessage}
      onChatHeaderActionClick={props?.onChatHeaderActionClick}
      disableUserProfile={props?.disableUserProfile}
      renderUserProfile={props?.renderUserProfile}
    >
      <OpenChannelUI
        renderMessage={props?.renderMessage}
        renderHeader={props?.renderHeader}
        renderInput={props?.renderInput}
        renderPlaceHolderEmptyList={props?.renderPlaceHolderEmptyList}
        renderPlaceHolderError={props?.renderPlaceHolderError}
        renderPlaceHolderLoading={props?.renderPlaceHolderLoading}
      />
    </OpenChannelProvider>
  );
}

export default OpenChannel;

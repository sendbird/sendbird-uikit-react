import { GroupChannelProvider, useGroupChannel } from '@sendbird/uikit-react/GroupChannel/context';
import GroupChannelHeader from '@sendbird/uikit-react/GroupChannel/components/GroupChannelHeader';
import MessageList from '@sendbird/uikit-react/GroupChannel/components/MessageList';
import MessageInputWrapper from '@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper';
import TypingIndicator from '@sendbird/uikit-react/GroupChannel/components/TypingIndicator';
import ConnectionStatus from '@sendbird/uikit-react/ui/ConnectionStatus';
import PlaceHolder, { PlaceHolderTypes } from '@sendbird/uikit-react/ui/PlaceHolder';
import { TypingIndicatorType, useSendbird } from '@sendbird/uikit-react';
import './layout.css';

export function ReorderedChannelContent() {
  const { state: { channelUrl, fetchChannelError } } = useGroupChannel();
  const { state: { config, stores } } = useSendbird();

  if (!channelUrl || fetchChannelError || stores.sdkStore.error) {
    return (
      <div className="sendbird-conversation">
        <PlaceHolder type={channelUrl ? PlaceHolderTypes.WRONG : PlaceHolderTypes.NO_CHANNELS} />
      </div>
    );
  }

  const showTyping = config.groupChannel.enableTypingIndicator && config.groupChannel.typingIndicatorTypes?.has(TypingIndicatorType.Text);
  return (
    <div className="sendbird-conversation recipe-channel-layout">
      <GroupChannelHeader className="sendbird-conversation__channel-header" />
      <div className="sendbird-conversation__footer recipe-channel-composer">
        <MessageInputWrapper />
        <div className="sendbird-conversation__footer__typing-indicator">
          {showTyping ? <TypingIndicator channelUrl={channelUrl} /> : null}
          {!config.isOnline ? <ConnectionStatus /> : null}
        </div>
      </div>
      <div className="recipe-channel-messages">
        <MessageList className="sendbird-conversation__message-list" />
      </div>
    </div>
  );
}

export function ReorderedChannel({ channelUrl }: { channelUrl: string }) {
  return (
    <GroupChannelProvider channelUrl={channelUrl}>
      <ReorderedChannelContent />
    </GroupChannelProvider>
  );
}

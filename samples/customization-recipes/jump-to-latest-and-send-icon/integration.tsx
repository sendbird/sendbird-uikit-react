import { GroupChannelProvider, useGroupChannel } from '@sendbird/uikit-react/GroupChannel/context';
import GroupChannelUI from '@sendbird/uikit-react/GroupChannel/components/GroupChannelUI';
import MessageInputWrapper from '@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper';

// Must render inside the GroupChannelProvider that owns the message list.
export function JumpToLatest() {
  const { state, actions } = useGroupChannel();
  return <button type="button" disabled={state.isScrollBottomReached}
    onClick={() => void actions.scrollToBottom(false)}>Jump to latest</button>;
}

// The stock composer keeps its submit logic; only the icon inside its Send button changes.
export function BrandedComposer() {
  return <MessageInputWrapper renderSendMessageIcon={() => <>
    <span aria-hidden="true" className="send-icon">↑</span>
    <span className="visually-hidden">Send</span>
  </>} />;
}

// Mount inside your authenticated SendbirdProvider.
export function StockConversation({ channelUrl }: { channelUrl: string }) {
  return <GroupChannelProvider channelUrl={channelUrl} replyType="QUOTE_REPLY">
    <div className="conversation"><GroupChannelUI renderMessageInput={() => <BrandedComposer />} /></div>
    <div className="jump-row"><JumpToLatest /></div>
  </GroupChannelProvider>;
}

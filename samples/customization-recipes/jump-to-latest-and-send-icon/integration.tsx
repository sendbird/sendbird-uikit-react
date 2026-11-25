import { GroupChannelProvider, useGroupChannel } from '@sendbird/uikit-react/GroupChannel/context';
import GroupChannelUI from '@sendbird/uikit-react/GroupChannel/components/GroupChannelUI';
import MessageInputWrapper from '@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper';
import './jump.css';

// Must render inside the GroupChannelProvider that owns the message list.
export function JumpToLatest() {
  const { state, actions } = useGroupChannel();
  // Like the stock scroll button: the bottom of a page opened at an older message is not the latest message.
  // hasNext joins the context state after the provider's first render, so call it optionally.
  const atLatest = state.isScrollBottomReached && !state.hasNext?.();
  return <button type="button" aria-disabled={atLatest}
    onClick={() => { if (!atLatest) void actions.scrollToBottom(false); }}>Jump to latest</button>;
}

// The stock composer keeps its submit logic; only the icon inside its Send button changes.
export function BrandedComposer() {
  return <MessageInputWrapper renderSendMessageIcon={() => <>
    <span aria-hidden="true" className="uikit-jump-send-icon">↑</span>
    <span className="uikit-jump-visually-hidden">Send</span>
  </>} />;
}

// Mount inside your authenticated SendbirdProvider.
export function StockConversation({ channelUrl, startingPoint }: { channelUrl: string; startingPoint?: number }) {
  return <GroupChannelProvider channelUrl={channelUrl} startingPoint={startingPoint}>
    <div className="uikit-jump-conversation"><GroupChannelUI renderMessageInput={() => <BrandedComposer />} /></div>
    <div className="uikit-jump-jump-row"><JumpToLatest /></div>
  </GroupChannelProvider>;
}

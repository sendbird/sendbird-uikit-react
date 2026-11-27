import type { ComponentProps } from 'react';
import type { GroupChannelProps } from '@sendbird/uikit-react/GroupChannel';
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
export function BrandedComposer(props: Omit<ComponentProps<typeof MessageInputWrapper>, 'renderSendMessageIcon'>) {
  return <MessageInputWrapper {...props} renderSendMessageIcon={() => <>
    <span aria-hidden="true" className="uikit-jump-send-icon">↑</span>
    <span className="uikit-jump-visually-hidden">Send</span>
  </>} />;
}

// Mount inside your authenticated SendbirdProvider.
export function StockConversation(props: Omit<GroupChannelProps, 'children' | 'renderMessageInput' | 'renderSendMessageIcon'>) {
  return <GroupChannelProvider {...props}>
    <div className="uikit-jump-conversation">
      <GroupChannelUI {...props} renderMessageInput={() => <BrandedComposer {...props} />} />
    </div>
    <div className="uikit-jump-jump-row"><JumpToLatest /></div>
  </GroupChannelProvider>;
}

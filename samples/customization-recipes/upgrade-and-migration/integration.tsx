import { useState } from 'react';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
import { GroupChannelList } from '@sendbird/uikit-react/GroupChannelList';
import MessageContent, { type MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';
import EmojiReactions, { type EmojiReactionsProps } from '@sendbird/uikit-react/ui/EmojiReactions';

// Customizes a message whose only reaction is `like`; every other case keeps the stock row.
function LikeButton(props: EmojiReactionsProps) {
  const { message, toggleReaction, userId } = props;
  const [like] = message.reactions;
  if (!toggleReaction || like?.key !== 'like' || message.reactions.length !== 1) return <EmojiReactions {...props} />;

  const pressed = like.userIds.includes(userId);
  return (
    <button
      className="recipe-like"
      type="button"
      aria-label={`Like ${like.userIds.length}`}
      aria-pressed={pressed}
      onClick={() => toggleReaction(message, like.key, pressed)}
    >
      <span aria-hidden="true">♥ </span> {like.userIds.length}
    </button>
  );
}

export function ChatMessage(props: MessageContentProps) {
  return <MessageContent {...props} renderEmojiReactions={reactionProps => <LikeButton {...reactionProps} />} />;
}

type ChatSession = {
  appId: string;
  userId: string;
  accessToken: string;
};

export function ExistingAppChat({ appId, userId, accessToken }: ChatSession) {
  const [channelUrl, setChannelUrl] = useState('');
  return (
    <SendbirdProvider appId={appId} userId={userId} accessToken={accessToken}>
      <GroupChannelList
        onChannelSelect={channel => setChannelUrl(channel?.url ?? '')}
        onChannelCreated={channel => setChannelUrl(channel.url)}
        selectedChannelUrl={channelUrl}
      />
      {channelUrl && <GroupChannel
        channelUrl={channelUrl}
        renderMessageContent={props => <ChatMessage {...props} />}
      />}
    </SendbirdProvider>
  );
}

import { useState, type ComponentProps } from 'react';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
import { GroupChannelList } from '@sendbird/uikit-react/GroupChannelList';
import MessageContent, { type MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';
import EmojiReactions, { type EmojiReactionsProps } from '@sendbird/uikit-react/ui/EmojiReactions';
import { useLocalization } from '@sendbird/uikit-react/hooks/useLocalization';
import './like.css';

// Customizes a message whose only reaction is `like`; every other case keeps the stock row.
function LikeButton(props: EmojiReactionsProps) {
  const { stringSet } = useLocalization();
  const { message, toggleReaction, userId } = props;
  const [like] = message.reactions;
  if (!toggleReaction || like?.key !== 'like' || message.reactions.length !== 1) return <EmojiReactions {...props} />;

  const pressed = like.userIds.includes(userId);
  return (
    <button
      className="recipe-like"
      type="button"
      aria-label={`${stringSet.FEEDBACK_LIKE} ${like.userIds.length}`}
      aria-pressed={pressed}
      onMouseDown={event => event.stopPropagation()}
      onTouchStart={event => event.stopPropagation()}
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

export function ExistingAppChat({ appId, userId, accessToken, configureSession }: ChatSession &
  Pick<ComponentProps<typeof SendbirdProvider>, 'configureSession'>) {
  const [channelUrl, setChannelUrl] = useState('');
  return (
    <SendbirdProvider appId={appId} userId={userId} accessToken={accessToken} configureSession={configureSession}>
      <div className="migration-example">
        <GroupChannelList
          onChannelSelect={channel => setChannelUrl(channel?.url ?? '')}
          onChannelCreated={channel => setChannelUrl(channel.url)}
          selectedChannelUrl={channelUrl}
        />
        {channelUrl && <GroupChannel
          channelUrl={channelUrl}
          renderMessageContent={props => <ChatMessage {...props} />}
        />}
      </div>
    </SendbirdProvider>
  );
}

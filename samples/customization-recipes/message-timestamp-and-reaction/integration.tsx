import GroupChannel from '@sendbird/uikit-react/GroupChannel';
import EmojiReactions, { type EmojiReactionsProps } from '@sendbird/uikit-react/ui/EmojiReactions';
import MessageContent, { type MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';
import './reaction.css';

export { secondsFormat } from './timestamp-format';

function LikeReaction(props: EmojiReactionsProps) {
  const { message, userId, toggleReaction } = props;
  const [reaction] = message.reactions;
  if (!toggleReaction || reaction?.key !== 'like' || message.reactions.length !== 1) {
    return <EmojiReactions {...props} />;
  }

  const selected = reaction.userIds.includes(userId);
  return (
    <div className="recipe-reaction-strip">
      <button type="button" className="recipe-reaction-chip" aria-pressed={selected}
        aria-label={`Like, ${reaction.userIds.length} reactions`}
        onClick={() => toggleReaction(message, reaction.key, selected)}>
        <span aria-hidden="true">♥</span> {reaction.userIds.length}
      </button>
    </div>
  );
}

export function MessageWithLikeButton(props: MessageContentProps) {
  return <MessageContent {...props} renderEmojiReactions={reactionProps => <LikeReaction {...reactionProps} />} />;
}

export function ChannelWithMessageDetails({ channelUrl }: { channelUrl: string }) {
  return <GroupChannel channelUrl={channelUrl}
    renderMessageContent={props => <MessageWithLikeButton {...props} />} />;
}

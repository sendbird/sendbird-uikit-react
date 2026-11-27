import GroupChannel, { type GroupChannelProps } from '@sendbird/uikit-react/GroupChannel';
import EmojiReactions, { type EmojiReactionsProps } from '@sendbird/uikit-react/ui/EmojiReactions';
import MessageContent, { type MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';
import { useLocalization } from '@sendbird/uikit-react/hooks/useLocalization';
import './reaction.css';

function LikeReaction(props: EmojiReactionsProps) {
  const { stringSet } = useLocalization();
  const { message, toggleReaction } = props;
  const [reaction] = message.reactions;
  if (!toggleReaction || reaction?.key !== 'like' || message.reactions.length !== 1) {
    return <EmojiReactions {...props} />;
  }

  const selected = reaction.hasCurrentUserReacted;
  return (
    <div className="recipe-reaction-strip">
      <button type="button" className="recipe-reaction-chip" aria-pressed={selected}
        aria-label={`${stringSet.FEEDBACK_LIKE} ${reaction.count}`}
        onMouseDown={event => event.stopPropagation()}
        onTouchStart={event => event.stopPropagation()}
        onClick={() => toggleReaction(message, reaction.key, selected)}>
        <span aria-hidden="true">♥</span> {reaction.count}
      </button>
    </div>
  );
}

export function MessageWithLikeButton(props: MessageContentProps) {
  return <MessageContent {...props} renderEmojiReactions={reactionProps => <LikeReaction {...reactionProps} />} />;
}

export function ChannelWithMessageDetails(props: Omit<GroupChannelProps, 'renderMessageContent'>) {
  return <GroupChannel {...props}
    renderMessageContent={props => <MessageWithLikeButton {...props} />} />;
}

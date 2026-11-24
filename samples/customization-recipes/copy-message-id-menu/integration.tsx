import GroupChannel from '@sendbird/uikit-react/GroupChannel';
import MessageContent from '@sendbird/uikit-react/ui/MessageContent';
import { useSendbird } from '@sendbird/uikit-react';
import {
  MenuItem, MessageMenu, useMessageMenuContext, type MessageMenuProps,
} from '@sendbird/uikit-react/ui/MessageMenu';

type CopyResult = { messageId: number; copied: boolean };
type CopyIdMenuProps = MessageMenuProps & { onCopyResult?: (result: CopyResult) => void };

function CopyMessageId({ onCopyResult }: Pick<CopyIdMenuProps, 'onCopyResult'>) {
  const { message, hideMenu } = useMessageMenuContext();

  async function copyId() {
    const messageId = message.messageId;
    try {
      await navigator.clipboard.writeText(String(messageId));
    } catch {
      onCopyResult?.({ messageId, copied: false });
      return;
    }

    hideMenu();
    onCopyResult?.({ messageId, copied: true });
  }

  return <MenuItem onClick={() => void copyId()}>Copy message ID</MenuItem>;
}

export function CopyMessageIdMenu({ onCopyResult, ...props }: CopyIdMenuProps) {
  const { state: { config } } = useSendbird();
  const { message, channel, replyType, inThreadList, onMoveToParentMessage } = props;
  const canExtend = message.isUserMessage() && message.sendingStatus === 'succeeded'
    && message.messageId > 0 && !message.parentMessageId && replyType === 'QUOTE_REPLY'
    && !inThreadList && !onMoveToParentMessage
    && channel?.isGroupChannel() && !channel.isEphemeral && !channel.isBroadcast;

  if (!canExtend) return <MessageMenu {...props} />;

  // renderMenuItems receives every stock item, so re-apply the ownership rule for Edit and Delete.
  const isByMe = props.isByMe === true && message.sender?.userId === config.userId;

  return (
    <MessageMenu {...props} isByMe={isByMe} renderMenuItems={({ items }) => (
      <>
        <items.CopyMenuItem />
        <items.ReplyMenuItem />
        {isByMe && <items.EditMenuItem />}
        {config.groupChannel.enableMarkAsUnread && <items.MarkAsUnreadMenuItem />}
        {isByMe && <items.DeleteMenuItem />}
        <CopyMessageId onCopyResult={onCopyResult} />
      </>
    )} />
  );
}

// Mount inside your authenticated SendbirdProvider.
export function ChannelWithCopyMessageId({ channelUrl }: { channelUrl: string }) {
  return <GroupChannel channelUrl={channelUrl} replyType="QUOTE_REPLY"
    renderMessageContent={props => <MessageContent {...props}
      renderMessageMenu={menuProps => <CopyMessageIdMenu {...menuProps} />} />} />;
}

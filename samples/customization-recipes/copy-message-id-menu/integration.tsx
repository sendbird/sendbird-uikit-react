import type { ComponentProps, ComponentType, ReactNode } from 'react';
import GroupChannel from '@sendbird/uikit-react/GroupChannel';
import MessageContent, { type MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';
import MobileMenu from '@sendbird/uikit-react/ui/MobileMenu';
import Label, { LabelColors, LabelTypography } from '@sendbird/uikit-react/ui/Label';
import { useSendbird } from '@sendbird/uikit-react';
import {
  MenuItem, MessageMenu, useMessageMenuContext, type MessageMenuProps,
} from '@sendbird/uikit-react/ui/MessageMenu';
import './copy-id.css';

export type CopyResult = { messageId: number; copied: boolean };
type CopyResultProps = { onCopyResult?: (result: CopyResult) => void };
type CopyIdMenuProps = MessageMenuProps & CopyResultProps;
type MobileMenuProps = ComponentProps<typeof MobileMenu>;
type CopyIdMobileMenuProps = MobileMenuProps & CopyResultProps;

function supportsCopyId({ message, channel, replyType, inThreadList }: Pick<MessageMenuProps, 'message' | 'channel' | 'replyType' | 'inThreadList'>) {
  return message.isUserMessage() && message.sendingStatus === 'succeeded'
    && message.messageId > 0 && !message.parentMessageId && replyType === 'QUOTE_REPLY'
    && !inThreadList && channel?.isGroupChannel() && !channel.isEphemeral && !channel.isBroadcast;
}

type CopyItemProps = { onClick: () => void; children: ReactNode };

function CopyIdBottomSheetItem({ onClick, children }: CopyItemProps) {
  return <button type="button" role="menuitem"
    className="sendbird-message__bottomsheet--action copy-id-bottom-sheet-item"
    onClick={onClick}>{children}</button>;
}

function CopyMessageId({ Item, onCopyResult, children }: CopyResultProps & {
  Item: ComponentType<CopyItemProps>; children: ReactNode;
}) {
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

  return <Item onClick={() => void copyId()}>{children}</Item>;
}

export function CopyMessageIdMenu({ onCopyResult, ...props }: CopyIdMenuProps) {
  const { state: { config } } = useSendbird();
  if (!supportsCopyId(props) || props.onMoveToParentMessage) return <MessageMenu {...props} />;

  // renderMenuItems receives every stock item, so re-apply the ownership rule for Edit and Delete.
  const isByMe = props.isByMe === true && props.message.sender?.userId === config.userId;

  return (
    <MessageMenu {...props} isByMe={isByMe} renderMenuItems={({ items }) => (
      <>
        <items.CopyMenuItem />
        <items.ReplyMenuItem />
        {isByMe && <items.EditMenuItem />}
        {config.groupChannel.enableMarkAsUnread && <items.MarkAsUnreadMenuItem />}
        {isByMe && <items.DeleteMenuItem />}
        <CopyMessageId Item={MenuItem} onCopyResult={onCopyResult}>Copy message ID</CopyMessageId>
      </>
    )} />
  );
}

const mobileLabel = <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>Copy message ID</Label>;

/** Long-press menu that MessageContent opens instead of MessageMenu on mobile. */
export function CopyMessageIdMobileMenu({ onCopyResult, ...props }: CopyIdMobileMenuProps) {
  const { state: { config } } = useSendbird();
  if (!supportsCopyId(props)) return <MobileMenu {...props} />;

  // UIKit's mobile menus decide ownership from the sender, not from the isByMe prop.
  const isByMe = props.message.sender?.userId === props.userId;
  const canDelete = isByMe && props.deleteMenuState !== 'HIDE';
  const markAsUnread = config.groupChannel.enableMarkAsUnread;
  // UIKit places Reply after Edit and Mark as unread only in its reaction bottom sheet.
  const bottomSheet = props.isReactionEnabled;
  return <MobileMenu {...props} renderMenuItems={({ items }) => (
    <>
      <items.CopyMenuItem />
      {!bottomSheet && <items.ReplyMenuItem />}
      {isByMe && <items.EditMenuItem />}
      {markAsUnread && <items.MarkAsUnreadMenuItem />}
      {bottomSheet && <items.ReplyMenuItem />}
      {canDelete && <items.DeleteMenuItem />}
      <CopyMessageId Item={bottomSheet ? CopyIdBottomSheetItem : MenuItem} onCopyResult={onCopyResult}>{mobileLabel}</CopyMessageId>
    </>
  )} />;
}

/** MessageContent with the ID action in both the desktop menu and the mobile long-press menu. */
export function CopyIdMessageContent({ onCopyResult, ...props }: MessageContentProps & CopyResultProps) {
  return <MessageContent {...props}
    renderMessageMenu={menuProps => <CopyMessageIdMenu {...menuProps} onCopyResult={onCopyResult} />}
    renderMobileMenuOnLongPress={menuProps => <CopyMessageIdMobileMenu {...menuProps} onCopyResult={onCopyResult} />} />;
}

// Mount inside your authenticated SendbirdProvider.
export function ChannelWithCopyMessageId({ channelUrl, replyType, onCopyResult }:
  Pick<ComponentProps<typeof GroupChannel>, 'channelUrl' | 'replyType'> & CopyResultProps) {
  return <GroupChannel channelUrl={channelUrl} replyType={replyType}
    renderMessageContent={props => <CopyIdMessageContent {...props} onCopyResult={onCopyResult} />} />;
}

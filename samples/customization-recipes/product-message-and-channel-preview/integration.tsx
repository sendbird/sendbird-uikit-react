import { useState, type ComponentProps } from 'react';
import { useSendbird } from '@sendbird/uikit-react';
import GroupChannel from '@sendbird/uikit-react/GroupChannel';
import GroupChannelList from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannelListItem } from '@sendbird/uikit-react/GroupChannelList/components/GroupChannelListItem';
import Badge from '@sendbird/uikit-react/ui/Badge';
import ChannelAvatar from '@sendbird/uikit-react/ui/ChannelAvatar';
import MentionUserLabel from '@sendbird/uikit-react/ui/MentionUserLabel';
import MessageContent, { MessageBody, type MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';
import { decodeProduct, type Product } from './product';

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card" aria-label="Product card">
      <strong>{product.title}</strong>
      <span>SKU {product.sku}</span>
    </article>
  );
}

/** Message body: a card for product messages; the stock body for everything else and for attachments. */
export function ProductMessageContent(props: MessageContentProps) {
  return (
    <MessageContent {...props} renderMessageBody={(bodyProps) => {
      const { message } = bodyProps;
      const product = decodeProduct(message.customType, message.data);
      if (!product) return <MessageBody {...bodyProps} />;
      if (message.isUserMessage()) return <ProductCard product={product} />;
      if (message.isFileMessage()) {
        return (
          <div className="product-with-file">
            <ProductCard product={product} />
            <MessageBody {...bodyProps} />
          </div>
        );
      }
      return <MessageBody {...bodyProps} />;
    }} />
  );
}

// UIKit treats these names as unset and titles the stock row from member nicknames.
const defaultChannelNames = ['', 'Group Channel', 'AI Chatbot Widget Channel'];

/** Channel preview: replaces only named channels whose last message decodes as a product. */
export function ProductChannelRow(props: ComponentProps<typeof GroupChannelListItem>) {
  const { state: { config } } = useSendbird();
  const { channel, isSelected, onClick } = props;
  const product = decodeProduct(channel.lastMessage?.customType, channel.lastMessage?.data);
  if (!product || defaultChannelNames.includes(channel.name ?? '')) {
    // The stock row already calls onClick. Stop its DOM click from reaching the list's wrapper.
    return <div onClick={event => event.stopPropagation()} onKeyDown={product ? event => {
      // The stock preview is a div with role="link", so the browser does not activate it on its own.
      const { key, target } = event;
      if (!(target instanceof HTMLElement) || target.getAttribute('role') !== 'link' || (key !== 'Enter' && key !== ' ')) return;
      event.preventDefault();
      event.stopPropagation();
      if (!event.repeat) onClick();
    } : undefined}><GroupChannelListItem {...props} /></div>;
  }
  const title = channel.name;
  // Match the stock row: a selected channel keeps its count when mark-as-unread is enabled.
  const showUnread = (!isSelected || config.groupChannel.enableMarkAsUnread) && !channel.isEphemeral;
  const unread = showUnread ? channel.unreadMessageCount : 0;
  const mentioned = showUnread && config.groupChannel.enableMention && channel.unreadMentionCount > 0;
  const accessibleName = [title, `Product: ${product.title}`, mentioned && 'unread mention', unread > 0 && `${unread} unread`]
    .filter(Boolean).join(', ');
  return <button type="button" className="product-channel-row"
    aria-current={isSelected ? 'true' : undefined} aria-label={accessibleName}
    onClick={event => { event.stopPropagation(); onClick(); }}>
    <span aria-hidden="true">
      <ChannelAvatar channel={channel} userId={config.userId} theme={config.theme} width={40} height={40} />
    </span>
    <span className="product-channel-copy"><strong>{title}</strong><span>Product: {product.title}</span></span>
    {(mentioned || unread > 0) && <span aria-hidden="true" className="product-channel-unread">
      {mentioned && <MentionUserLabel color="purple">@</MentionUserLabel>}
      {unread > 0 && <Badge count={unread} />}
    </span>}
  </button>;
}

export const renderProductPreview = (props: ComponentProps<typeof GroupChannelListItem>) => <ProductChannelRow {...props} />;

// Mount inside your authenticated SendbirdProvider. The local page uses the same renderers with fixtures.
export function ProductChat() {
  const [channelUrl, setChannelUrl] = useState('');
  return (
    <div className="product-chat">
      <GroupChannelList
        selectedChannelUrl={channelUrl}
        onChannelSelect={channel => setChannelUrl(channel?.url ?? '')}
        onChannelCreated={channel => setChannelUrl(channel.url)}
        renderChannelPreview={renderProductPreview}
      />
      {channelUrl && <GroupChannel channelUrl={channelUrl}
        renderMessageContent={props => <ProductMessageContent {...props} />} />}
    </div>
  );
}

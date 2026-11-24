import { useState, type ComponentProps } from 'react';
import { useSendbird } from '@sendbird/uikit-react';
import GroupChannel from '@sendbird/uikit-react/GroupChannel';
import GroupChannelList from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannelListItem } from '@sendbird/uikit-react/GroupChannelList/components/GroupChannelListItem';
import Badge from '@sendbird/uikit-react/ui/Badge';
import ChannelAvatar from '@sendbird/uikit-react/ui/ChannelAvatar';
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

/** Channel preview: replaces only rows whose last message decodes as a product. */
export function ProductChannelRow(props: ComponentProps<typeof GroupChannelListItem>) {
  const { state: { config } } = useSendbird();
  const { channel, isSelected, onClick } = props;
  const product = decodeProduct(channel.lastMessage?.customType, channel.lastMessage?.data);
  if (!product) {
    // The stock row already calls onClick. Stop its DOM click from reaching the list's wrapper.
    return <div onClick={event => event.stopPropagation()}><GroupChannelListItem {...props} /></div>;
  }
  const title = channel.name || 'Untitled channel';
  const unread = !isSelected && !channel.isEphemeral ? channel.unreadMessageCount : 0;
  const accessibleName = unread > 0
    ? `${title}, Product: ${product.title}, ${unread} unread`
    : `${title}, Product: ${product.title}`;
  return <button type="button" className="product-channel-row"
    aria-current={isSelected ? 'true' : undefined} aria-label={accessibleName}
    onClick={event => { event.stopPropagation(); onClick(); }}>
    <span aria-hidden="true">
      <ChannelAvatar channel={channel} userId={config.userId} theme={config.theme} width={40} height={40} />
    </span>
    <span className="product-channel-copy"><strong>{title}</strong><span>Product: {product.title}</span></span>
    {unread > 0 && <span aria-hidden="true"><Badge count={unread} /></span>}
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

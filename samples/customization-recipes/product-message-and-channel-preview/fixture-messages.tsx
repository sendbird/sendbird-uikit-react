// Local fixture only: synthetic messages and local files for the message-body examples.
import { useState } from 'react';
import MessageContent, { type MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';
import FileViewer from '@sendbird/uikit-react/ui/FileViewer';
import { encodeProduct, PRODUCT_TYPE } from './product';
import { ProductMessageContent } from './integration';
import lampUrl from './assets/lamp.svg?no-inline';
import detailsUrl from './assets/details.txt?no-inline';

type AttachedFile = { url: string; name: string; mime: string };
type MessageExample = { heading: string; text: string; type?: string; data?: string; file?: AttachedFile };
type SyntheticMessage = MessageContentProps['message'];

const lamp = { url: new URL(lampUrl, window.location.href).href, name: 'lamp.svg', mime: 'image/svg+xml' };
const details = { url: new URL(detailsUrl, window.location.href).href, name: 'details.txt', mime: 'text/plain' };
const product = encodeProduct({ sku: 'DEMO-1', title: 'Desk lamp' });
const members = [
  { userId: 'other', nickname: 'Alex', profileUrl: '' },
  { userId: 'self', nickname: 'Sam', profileUrl: '' },
];
const examples: MessageExample[] = [
  { heading: 'Product text message', text: 'Desk lamp preview', type: product.customType, data: product.data },
  { heading: 'Unknown type', text: 'Regular message for an unknown type.', type: 'unknown-type', data: product.data },
  { heading: 'Malformed JSON', text: 'Regular message for malformed JSON.', type: PRODUCT_TYPE, data: '{malformed' },
  { heading: 'Invalid field type', text: 'Regular message for an invalid SKU.', type: PRODUCT_TYPE, data: '{"sku":17,"title":"Desk lamp"}' },
  { heading: 'Card with an image', text: 'Desk lamp image', type: PRODUCT_TYPE, data: product.data, file: lamp },
  { heading: 'Card with a file', text: 'Desk lamp details', type: PRODUCT_TYPE, data: product.data, file: details },
  { heading: 'Malformed card with a file', text: 'Default attachment is preserved', type: PRODUCT_TYPE, data: '{malformed', file: details },
];

const channel = {
  url: 'fixture-channel',
  channelType: 'group',
  isEphemeral: false,
  isBroadcast: false,
  isSuper: false,
  members,
  isGroupChannel: () => true,
  isOpenChannel: () => false,
  getUnreadMemberCount: () => 0,
  getUndeliveredMemberCount: () => 0,
} as unknown as NonNullable<MessageContentProps['channel']>;

function exampleMessage(example: MessageExample, index: number): SyntheticMessage {
  const { file } = example;
  return {
    messageId: 101 + index,
    messageType: file ? 'file' : 'user',
    message: example.text,
    createdAt: Date.parse('2026-11-18T12:34:56Z'),
    updatedAt: 0,
    customType: example.type ?? '',
    data: example.data ?? '',
    extendedMessagePayload: {},
    sendingStatus: 'succeeded',
    parentMessageId: 0,
    sender: members[0],
    reactions: [],
    mentionedUsers: [],
    threadInfo: { replyCount: 0 },
    isAdminMessage: () => false,
    isUserMessage: () => !file,
    isFileMessage: () => Boolean(file),
    isMultipleFilesMessage: () => false,
    isResendable: () => false,
    url: file?.url,
    name: file?.name,
    plainUrl: file?.url,
    type: file?.mime,
    size: 48,
    thumbnails: [],
  } as unknown as SyntheticMessage;
}

export function MessageExamples({ useDefault }: { useDefault: boolean }) {
  const [viewing, setViewing] = useState<SyntheticMessage | null>(null);
  const Component = useDefault ? MessageContent : ProductMessageContent;
  return (
    <>
      <div className="sendbird-conversation__messages" dir="ltr">
        {examples.map((example, index) => {
          const message = exampleMessage(example, index);
          return (
            <section key={example.heading} aria-label={example.heading} className="message-example">
              <h3>{example.heading}</h3>
              <Component channel={channel} message={message} userId="self"
                showFileViewer={(open) => setViewing(open ? message : null)} />
            </section>
          );
        })}
      </div>
      {viewing?.isFileMessage() && <>
        <FileViewer message={viewing} onClose={() => setViewing(null)} />
        {/* Fixture-only exit that stays reachable whatever the viewer layout does. */}
        <button type="button" className="fixture-viewer-exit" onClick={() => setViewing(null)}>Exit demo viewer</button>
      </>}
    </>
  );
}

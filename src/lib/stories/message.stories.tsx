import React, { useEffect, useState } from 'react';

import SendBirdProvider from '../Sendbird';
import withSendBird from '../SendbirdSdkContext';
import sendbirdSelectors from '../selectors';
import Channel from '../../modules/Channel';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { SendableMessage } from '@sendbird/chat/lib/__definition';
import { isSendableMessage } from '../../utils';
import { SendBirdState } from '../types';
import { LoggerInterface } from '../Logger';

const appId = process.env.STORYBOOK_APP_ID;
const userId = '__test_user--selectors';
const channelUrl = 'sendbird_group_channel_13746515_61602a7418c96e95c726c28c90e5c1a88d035d06';

export default { title: 'selectors/messages' };

type Props = {
  sendMessage: ReturnType<typeof sendbirdSelectors.getSendUserMessage>;
  sendFileMessage: ReturnType<typeof sendbirdSelectors.getSendFileMessage>;
  deleteMessage: ReturnType<typeof sendbirdSelectors.getDeleteMessage>;
  updateLastMessage: ReturnType<typeof sendbirdSelectors.getUpdateUserMessage>;
  sdk: ReturnType<typeof sendbirdSelectors.getSdk>;
  logger: LoggerInterface;
};
const CustomComponent = ({
  sendMessage,
  sendFileMessage,
  deleteMessage,
  updateLastMessage,
  sdk,
  logger,
}: Props) => {
  const [lastMessage, setLastMessage] = useState<SendableMessage | null>(null);
  const [channel, setChannel] = useState<GroupChannel>();

  useEffect(() => {
    sdk.groupChannel.getChannel(channelUrl).then(setChannel);
  }, []);

  if (!channel) return null;

  const lastMessageId = lastMessage?.messageId;
  return (
    <div onSubmit={(e) => e.preventDefault()}>
      {`Last MessageId: ${lastMessageId}`}
      <button
        onClick={() => {
          const params = {
            message: 'storybook message',
          };
          sendMessage(channel, params)
            .onPending((pendingMessage) => {
              setLastMessage(pendingMessage);
              logger.info('Message sent: pending', pendingMessage);
            })
            .onSucceeded((message) => {
              setLastMessage(message);
              logger.info('Message sent: success', message);
            })
            .onFailed((error, message) => {
              logger.info('Couldn\'t send message', message, error);
            });
        }}
      >
        Send a Message
      </button>
      <button
        disabled={!lastMessageId}
        onClick={() => {
          const params = {
            message: 'updated storybook message',
          };
          updateLastMessage(channel, lastMessageId, params)
            .then((message) => {
              setLastMessage(message);
              logger.info('Message updated');
            })
            .catch((e) => {
              logger.warning('Couldn\'t delete message', e);
            });
        }}
      >
        Update last Message
      </button>
      <button
        disabled={!lastMessageId}
        onClick={() => {
          if (lastMessage && isSendableMessage(lastMessage)) {
            deleteMessage(channel, lastMessage)
              .then(() => {
                logger.info('Message deleted');
              })
              .catch((e) => {
                logger.warning('Couldn\'t delete message', e);
              });
          }
        }}
      >
        Delete last Message
      </button>
      <br />
      <input type="file" id="file-upload" />
      <button
        onClick={() => {
          const elem = document.getElementById('file-upload');
          if (elem instanceof HTMLInputElement && elem.files?.[0]) {
            sendFileMessage(channel, {
              file: elem.files[0],
            })
              .onPending((pendingMessage) => {
                setLastMessage(pendingMessage);
                logger.info('Message sent: pending', pendingMessage);
              })
              .onSucceeded((message) => {
                setLastMessage(message);
                logger.info('Message sent: success', message);
              })
              .onFailed((error, message) => {
                logger.info('Couldn\'t send message', message, error);
              });
          }
        }}
      >
        Send file Message
      </button>
      <button
        onClick={() => {
          // params.fileUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
          // params.mimeType = "video/mp4";
          // params.fileUrl = "http://africau.edu/images/default/sample.pdf";
          // params.mimeType = "application/pdf";
          sendFileMessage(channel, {
            fileName: 'my file',
            fileUrl:
              'https://6cro14eml0v2yuvyx3v5j11j-wpengine.netdna-ssl.com/wp-content/uploads/img-home-hero@2x.png',
            mimeType: 'image/png',
          })
            .onPending((pendingMessage) => {
              setLastMessage(pendingMessage);
              logger.info('Message sent: pending', pendingMessage);
            })
            .onSucceeded((message) => {
              setLastMessage(message);
              logger.info('Message sent: success', message);
            })
            .onFailed((error, message) => {
              logger.info('Couldn\'t send message', message, error);
            });
        }}
      >
        Send file url Message
      </button>
    </div>
  );
};

const CustomComponentWithSendBird = withSendBird(
  CustomComponent,
  (state: SendBirdState) => {
    const sendMessage = sendbirdSelectors.getSendUserMessage(state);
    const sendFileMessage = sendbirdSelectors.getSendFileMessage(state);
    const deleteMessage = sendbirdSelectors.getDeleteMessage(state);
    const updateLastMessage = sendbirdSelectors.getUpdateUserMessage(state);
    const sdk = sendbirdSelectors.getSdk(state);
    return {
      sendMessage,
      sendFileMessage,
      deleteMessage,
      updateLastMessage,
      sdk,
      logger: state.config.logger,
    };
  },
);

export const createAndLeaveChannel = () => (
  <SendBirdProvider appId={appId} userId={userId} nickname={userId}>
    <>
      <CustomComponentWithSendBird />
      <div style={{ width: '720px', height: '500px' }}>
        <Channel channelUrl={channelUrl} />
      </div>
    </>
  </SendBirdProvider>
);

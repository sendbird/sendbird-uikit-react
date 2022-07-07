import React, { useState } from 'react';

import SendBirdProvider from '../Sendbird';
import withSendBird from '../SendbirdSdkContext';
import sendbirdSelectors from '../selectors';
import Channel from '../../smart-components/Channel';

const appId = process.env.STORYBOOK_APP_ID;
const userId = '__test_user--selectors';
const channelUrl = "sendbird_group_channel_13746515_61602a7418c96e95c726c28c90e5c1a88d035d06";

export default { title: 'selectors/messages' };

const CustomComponent = (props) => {
  const {
    sendMessage,
    sendFileMessage,
    deleteMessage,
    updateLastMessage,
  } = props;
  const [lastMessage, setLastMessage] = useState({});
  const lastMessageId = lastMessage.messageId;
  return(
    <div onSubmit={e => e.preventDefault()}>
      {`Last MessageId: ${lastMessageId}`}
      <button onClick={
        () => {
          const params = {
            message: "storybook message",
          };
          sendMessage(channelUrl, params)
            .then((pendingMessage) => {
              setLastMessage(pendingMessage);
              alert('Message sent: pending', pendingMessage);
              return pendingMessage;
            })
            .then(message => {
              alert('Message sent: success', message);
              setLastMessage(message);
              console.warn(message);
            })
            .catch(e => {
              console.warn(e);
              alert('Couldnt send message');
            })
        }
      }>Send a Message</button>
      <button disable={!lastMessageId} onClick={
        () => {
          const params = {
            message: "updated storybook message",
          };
          updateLastMessage(channelUrl, lastMessageId, params)
            .then((message) => {
              setLastMessage(message);
              alert('Message updated');
            })
            .catch(e => alert('Couldnt update message'))
        }
      }>Update last Message</button>
      <button disable={!lastMessageId} onClick={
        () => {
          deleteMessage(channelUrl, lastMessage)
            .then(() => {
              alert('Message deleted');
            })
            .catch(e => {
              console.warn(e);
              alert('Couldnt delete message')
            })
        }
      }>Delete last Message</button>
      <br/>
      <input type="file" id="file-upload" />
      <button onClick={
        () => {
          const params = {};
          params.file = document.getElementById('file-upload').files[0];
          sendFileMessage(channelUrl, params)
            .then((pendingMessage) => {
              setLastMessage(pendingMessage);
              alert('Message sent: pending', pendingMessage);
              return pendingMessage;
            })
            .then(message => {
              alert('Message sent: success', message);
              setLastMessage(message);
              console.warn(message);
            })
            .catch(e => {
              console.warn(e);
              alert('Couldnt send message')
            })
        }
      }>Send file Message</button>
      <button onClick={
        () => {
          const params = {};
          params.name = "my file";
          params.fileUrl = "https://6cro14eml0v2yuvyx3v5j11j-wpengine.netdna-ssl.com/wp-content/uploads/img-home-hero@2x.png";
          params.mimeType = "image/png";
          // params.fileUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
          // params.mimeType = "video/mp4";
          // params.fileUrl = "http://africau.edu/images/default/sample.pdf";
          // params.mimeType = "application/pdf";
          sendFileMessage(channelUrl, params)
            .then((pendingMessage) => {
              setLastMessage(pendingMessage);
              alert('Message sent: pending', pendingMessage);
              return pendingMessage;
            })
            .then(message => {
              alert('Message sent: success', message);
              setLastMessage(message);
              console.warn(message);
            })
            .catch(e => {
              console.warn(e);
              alert('Couldnt send message')
            })
        }
      }>Send file url Message</button>
    </div>
  );
};

const CustomComponentWithSendBird = withSendBird(CustomComponent, (state) => {
  const sendMessage = sendbirdSelectors.getSendUserMessage(state);
  const sendFileMessage = sendbirdSelectors.getSendFileMessage(state);
  const deleteMessage = sendbirdSelectors.getDeleteMessage(state);
  const updateLastMessage = sendbirdSelectors.getUpdateUserMessage(state);
  const sdk = sendbirdSelectors.getSdk(state);
  return ({
    sendMessage,
    sendFileMessage,
    deleteMessage,
    updateLastMessage,
    sdk,
  });
});

export const createAndLeaveChannel = () => (
  <SendBirdProvider appId={appId} userId={userId} nickname={userId}>
    <CustomComponentWithSendBird />
    <div style={{ width: '720px', height: '500px' }}>
      <Channel channelUrl={channelUrl} />
    </div>
  </SendBirdProvider>
);

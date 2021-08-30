import React from 'react';
import ReplyingMessageItemBody from '../index.tsx';

export default { title: 'UI Components/ReplyingMessageItemBody' };

export const withText = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <ReplyingMessageItemBody
      message={{ sender: { nickname: 'Simon' } }}
      parentMessageType={null}
      parentMessageText="Hello nice to meet you. Katherine and I are baking cupcakes this Sunday if anyone else wants to join?atherine and I are baking cupcakes this Sunday if anyone else can join. Welcome."
      parentMessageUrl={''}
      parentMessageSender={{ nickname: 'Gabie' }}
      isByMe
    />
    <br />
    <ReplyingMessageItemBody
      message={{ sender: { nickname: 'Simon00000000000000000000' } }}
      parentMessageType={null}
      parentMessageText="Hello nice to meet you"
      parentMessageUrl={''}
      parentMessageSender={{ nickname: 'Gabie99999999999999999999' }}
      isByMe
    />
    <br />
    <ReplyingMessageItemBody
      message={{ sender: { nickname: 'Simon' } }}
      parentMessageType={null}
      parentMessageText="Hello nice to meet you"
      parentMessageUrl={''}
      parentMessageSender={{ nickname: 'Gabie' }}
      isByMe={false}
    />
    <br />
    <ReplyingMessageItemBody
      message={{ sender: { nickname: 'Simon00000000000000000000' } }}
      parentMessageType={null}
      parentMessageText="Hello nice to meet you"
      parentMessageUrl={''}
      parentMessageSender={{ nickname: 'Gabie99999999999999999999' }}
      isByMe={false}
    />
    <br />
    <ReplyingMessageItemBody
      message={{ sender: { nickname: 'Simon00000000000000000000' } }}
      parentMessageText=""
      parentMessageType="image/jpg"
      parentMessageUrl='https://sendbird-upload.s3.amazonaws.com/2D7B4CDB-932F-4082-9B09-A1153792DC8D/upload/n/b4095c0a8c2547d19cfe0ddb10b38a30.jpg'
      parentMessageSender={{ nickname: 'Gabie99999999999999999999' }}
      isByMe
    />
    <br />
    <ReplyingMessageItemBody
      message={{ sender: { nickname: 'Simon' } }}
      parentMessageText=""
      parentMessageType="image/png"
      parentMessageUrl='https://static.sendbird.com/sample/user_sdk/user_sdk_23.png'
      parentMessageSender={{ nickname: 'Gabie' }}
      isByMe={false}
    />
    <br />
    <ReplyingMessageItemBody
      message={{ sender: { nickname: 'Simon00000000000000000000' } }}
      parentMessageText=""
      parentMessageType="image/fdfd"
      parentMessageUrl='https://sendbird-upload.s3.amazonaws.com/2D7B4CDB-932F-4082-9B09-A1153792DC8D/upload/n/b4095c0a8c2547d19cfe0ddb10b38a30.jpg'
      parentMessageSender={{ nickname: 'Gabie99999999999999999999' }}
      isByMe
    />
    <br />
    <ReplyingMessageItemBody
      message={{ sender: { nickname: 'Simon' } }}
      parentMessageText=""
      parentMessageType="video/djfldfs"
      parentMessageUrl='https://static.sendbird.com/sample/user_sdk/user_sdk_23.png'
      parentMessageSender={{ nickname: 'Gabie' }}
      isByMe={false}
    />
  </div>
);

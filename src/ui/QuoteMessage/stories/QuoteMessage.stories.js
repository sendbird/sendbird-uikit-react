import React from 'react';
import QuoteMessage from '../index.tsx';

const description = `
  \`import QuoteMessage from "@sendbird/uikit-react/ui/QuoteMessage";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/QuoteMessage',
  component: QuoteMessage,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <QuoteMessage
    message={{
      sender: { nickname: 'Simon' },
      parentMessage: {
        messageType: 'user',
        message: 'Hello nice to meet you. Katherine and I are baking cupcakes this Sunday if anyone else wants to join?atherine and I are baking cupcakes this Sunday if anyone else can join. Welcome.',
        url: '',
        sender: {
          nickname: 'Gabie',
        }
      }
    }}
    {...arg}
  />
);

export const withText = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <QuoteMessage
      message={{
        sender: { nickname: 'Simon' },
        parentMessage: {
          messageType: 'user',
          message: 'Hello nice to meet you. Katherine and I are baking cupcakes this Sunday if anyone else wants to join?atherine and I are baking cupcakes this Sunday if anyone else can join. Welcome.',
          url: '',
          sender: {
            nickname: 'Gabie',
          }
        }
      }}
      isByMe
    />
    <br />
    <QuoteMessage
      message={{
        sender: { nickname: 'Simon00000000000000000000' },
        parentMessage: {
          messageType: 'user',
          message: 'Hello nice to meet you',
          url: '',
          sender: { nickname: 'Gabie99999999999999999999' },
        }
      }}
      isByMe
    />
    <br />
    <QuoteMessage
      message={{
        sender: { nickname: 'Simon' },
        parentMessage: {
          messageType: 'user',
          message: 'Hello nice to meet you',
          url: '',
          sender: { nickname: 'Gabie' },
        }
      }}
      isByMe={false}
    />
    <br />
    <QuoteMessage
      message={{
        sender: { nickname: 'Simon00000000000000000000' },
        parentMessage: {
          messageType: 'user',
          message: 'Hello nice to meet you',
          url: '',
          sender: { nickname: 'Gabie99999999999999999999' },
        }
      }}
      isByMe={false}
    />
    <br />
    <QuoteMessage
      message={{
        sender: { nickname: 'Simon00000000000000000000' },
        parentMessage: {
          message: '',
          messageType: 'file',
          type: 'image/jpg',
          url: 'https://sendbird-upload.s3.amazonaws.com/2D7B4CDB-932F-4082-9B09-A1153792DC8D/upload/n/b4095c0a8c2547d19cfe0ddb10b38a30.jpg',
          sender: { nickname: 'Gabie0000000000000000000' }
        }
      }}
      isByMe
    />
    <br />
    <QuoteMessage
      message={{
        sender: { nickname: 'Simon' },
        parentMessage: {
          message: '',
          messageType: 'file',
          type: 'image/png',
          url: 'https://static.sendbird.com/sample/user_sdk/user_sdk_23.png',
          sender: { nickname: 'Gabie' },
        }
      }}
      isByMe={false}
    />
    <br />
    <QuoteMessage
      message={{
        sender: { nickname: 'Simon00000000000000000000' },
        parentMessage: {
          message: '',
          messageType: 'file',
          type: 'image/fdfd',
          url: 'https://sendbird-upload.s3.amazonaws.com/2D7B4CDB-932F-4082-9B09-A1153792DC8D/upload/n/b4095c0a8c2547d19cfe0ddb10b38a30.jpg',
          sender: { nickname: 'Gabie99999999999999999999' },
        }
      }}
      isByMe
    />
    <br />
    <QuoteMessage
      message={{
        sender: { nickname: 'Simon' },
        parentMessage: {
          message: '',
          messageType: 'file',
          type: 'video/djfldfs',
          url: 'https://static.sendbird.com/sample/user_sdk/user_sdk_23.png',
          sender: { nickname: 'Gabie' },
        }
      }}
      isByMe={false}
    />
  </div>
);

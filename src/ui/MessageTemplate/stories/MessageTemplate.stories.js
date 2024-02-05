import React from 'react';
import '../index.scss';
import MessageTemplate from '../index';
import {MessageProvider} from '@sendbird/react-uikit-message-template-view';
import {dummyMessageTemplateMessageOne, mockBaseMessage} from '../messageTemplateDummyData.mock';

const subData = JSON.parse(dummyMessageTemplateMessageOne.extendedMessagePayload.sub_data);
const templateItems = subData['body']?.['items'];

const description = `
  \`import MessageTemplate from "@sendbird/uikit-react/ui/MessageTemplate";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/MessageTemplate',
  component: MessageTemplate,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
  }}>
    <div style={{ maxWidth: '800px' }}>
      <MessageProvider message={mockBaseMessage}>
        <MessageTemplate templateItems={templateItems} {...arg} />
      </MessageProvider>
    </div>
  </div>
);

export const messageTemplate = () => (
  <MessageProvider message={mockBaseMessage}>
    <MessageTemplate templateItems={templateItems} />
  </MessageProvider>
)

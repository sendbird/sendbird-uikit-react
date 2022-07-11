import React from 'react';
import TextMessageItemBody from '../index.tsx';

const description = `
  \`import TextMessageItemBody from "@sendbird/uikit-react/ui/TextMessageItemBody";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/TextMessageItemBody',
  component: TextMessageItemBody,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <TextMessageItemBody
    message={{
      message: 'dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk',
      sender: {
        userId: 'hoon-army-001',
      },
      messageType: 'user',
      updatedAt: 0,
    }}
    {...arg}
  />
);

export const withText = () => (
  <div>
    <TextMessageItemBody
      message={{
        message: 'dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk',
        sender: {
          userId: 'hoon-army-001',
        },
        messageType: 'user',
        updatedAt: 0,
      }}
      isByMe
    />
    <br />
    <br />
    <TextMessageItemBody
      message={{
        message: 'dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk',
        sender: {
          userId: 'hoon-army-002',
        },
        messageType: 'user',
        updatedAt: 0,
      }}
      isByMe={false}
    />
    <br />
    <br />
    <TextMessageItemBody
      message={{
        message: 'dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk',
        sender: {
          userId: 'hoon-army-001',
        },
        messageType: 'user',
        updatedAt: 10,
      }}
      isByMe
    />
    <br />
    <br />
    <TextMessageItemBody
      message={{
        message: 'dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk dhjfkldjfklasklfjdlskfjldksfjkldsjfkljdslk',
        sender: {
          userId: 'hoon-army-002',
        },
        messageType: 'user',
        updatedAt: 10,
      }}
      isByMe={false}
    />
  </div>
);

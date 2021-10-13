import React from 'react';
import TextMessageItemBody from '../index.tsx';

export default { title: 'UI Components/TextMessageItemBody' };
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

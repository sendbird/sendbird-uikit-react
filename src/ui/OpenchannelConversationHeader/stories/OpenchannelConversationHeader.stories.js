import React from 'react';
import OpenchannelConversationHeader from '../index.tsx';

export default { title: 'UI Components/OpenchannelConversationHeader' };

export const defaultHeader = () => (
  <OpenchannelConversationHeader />
);

export const filledProps = () => (
  <OpenchannelConversationHeader
    title="Open Channel Title"
    subTitle="Open Channel Subtitle"
    onActionClick={() => {
      console.log('Open Channel Trigger is clicked');
    }}
    coverImage="https://static.sendbird.com/sample/user_sdk/user_sdk_20.png"
  />
);

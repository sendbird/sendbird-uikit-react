import React from 'react';
import OpenChannelAdminMessage from '../index.tsx';

export default { title: 'UI Components/OpenChannelAdminMessage' };

export const withText = () => [
  <OpenChannelAdminMessage message={{
    message: 'Hello my name is Admin message'
  }} />,
  <OpenChannelAdminMessage message={{
    message: 'Hello my name is Admin message. Let me introduce my self. My name is Admin A D M I N. Let me say faster and fasater ADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMINADMIN'
  }} />
];

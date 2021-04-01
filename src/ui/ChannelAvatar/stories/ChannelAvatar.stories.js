import React from 'react';
import ChannelAvatar from '../index';

export default { title: 'UI Components/ChannelAvatar' };

export const simpleDefault = () => <ChannelAvatar channel={{ name: "12e" }} />;

export const defaultBroadcast = () => <ChannelAvatar channel={{ isBroadcast: true }} />;
export const defaultBroadcastDark = () => (
  <ChannelAvatar channel={{ isBroadcast: true }} theme="dark" />
);

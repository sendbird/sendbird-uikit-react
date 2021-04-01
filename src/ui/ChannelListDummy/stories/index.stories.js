import React from 'react';
import ChannelList from '../index.jsx';

export default { title: 'UI Components/ChannelList' };

import dummyData from "../dummyData.mock";

export const exampleChannels = () => (
  <ChannelList channels={dummyData.channels} />
);

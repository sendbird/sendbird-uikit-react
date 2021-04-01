import React from 'react';
import MessageSearchItem from '../index.tsx';

import { generateNormalMessage, generateLongMessage } from '../messageDummyDate.mock';

export default { title: 'UI Components/MessageSearchItem' };

export const normal = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
  }}>
    <MessageSearchItem message={generateNormalMessage()} />
    <MessageSearchItem message={generateLongMessage()} />
    <MessageSearchItem message={generateNormalMessage()} selected/>
  </div>
);

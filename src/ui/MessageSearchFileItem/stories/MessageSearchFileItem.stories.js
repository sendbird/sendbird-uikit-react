import React from 'react';
import MessageSearchFileItem from '../index.tsx';
import {
  docMock,
  imageMock,
  audioMock,
  videoMock,
  gifMock,
} from '../mockFileMessage';

export default { title: 'UI Components/MessageSearchFileItem' };

export const normal = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      <MessageSearchFileItem
        message={docMock}
        onClick={() => console.log('doc click')}
      />
      <MessageSearchFileItem
        message={imageMock}
        onClick={() => console.log('image click')}
      />
      <MessageSearchFileItem
        message={audioMock}
        onClick={() => console.log('audio click')}
      />
      <MessageSearchFileItem
        message={videoMock}
        onClick={() => console.log('video click')}
      />
      <MessageSearchFileItem
        message={gifMock}
        onClick={() => console.log('gif click')}
      />
      <MessageSearchFileItem
        message={docMock}
        selected
        onClick={() => console.log('selected click')}
      />
    </div>
  );
};

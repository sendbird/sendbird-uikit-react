import React from 'react';
import FileMessageItemBody from '../index.tsx';

import {
  dummyFileMessageImage,
  dummyFileMessageAudio,
  dummyFileMessageVideo,
  dummyFileMessageDocument,
} from './dummyFileMessage.mock';

export default { title: 'UI Components/FileMessageItemBody' };

export const withText = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <FileMessageItemBody message={dummyFileMessageImage} />
    <br />
    <FileMessageItemBody message={dummyFileMessageImage} isByMe />
    <br />
    <FileMessageItemBody message={dummyFileMessageAudio} />
    <br />
    <FileMessageItemBody message={dummyFileMessageAudio} isByMe />
    <br />
    <FileMessageItemBody message={dummyFileMessageVideo} />
    <br />
    <FileMessageItemBody message={dummyFileMessageVideo} isByMe />
    <br />
    <FileMessageItemBody message={dummyFileMessageDocument} />
    <br />
    <FileMessageItemBody message={dummyFileMessageDocument} isByMe />
  </div>
);

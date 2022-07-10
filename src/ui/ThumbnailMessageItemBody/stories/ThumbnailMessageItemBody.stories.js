import React from 'react';
import ThumbnailMessageItemBody from '../index.tsx';

import mockMessage from './dummyData.mock';

const description = `
  \`import ThumbnailMessageItemBody from "@sendbird/uikit-react/ui/ThumbnailMessageItemBody";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/ThumbnailMessageItemBody',
  component: ThumbnailMessageItemBody,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const imageSampleMessage = {...mockMessage};
imageSampleMessage.url = 'https://static.sendbird.com/sample/user_sdk/user_sdk_10.png';

const videoSampleMessage = {...mockMessage};
videoSampleMessage.url = 'https://sendbird-upload.s3.amazonaws.com/2D7B4CDB-932F-4082-9B09-A1153792DC8D/upload/n/b1ac6831a9b940bca831ea509f97fc35.mp4';
videoSampleMessage.type = 'video/mp4';

const gifSampleMessage = {...mockMessage};
gifSampleMessage.url = 'https://sendbird-upload.s3.amazonaws.com/2D7B4CDB-932F-4082-9B09-A1153792DC8D/upload/n/4715d139d7cf4a4ea99e6b9293664e53.gif';
gifSampleMessage.type = 'image/gif';

export const WithControl = (arg) => (
  <ThumbnailMessageItemBody message={imageSampleMessage} {...arg} />
);

export const withText = () => (
  <div>
    <ThumbnailMessageItemBody message={imageSampleMessage} />
    <br />
    <br />
    <ThumbnailMessageItemBody message={videoSampleMessage} />
    <br />
    <br />
    <ThumbnailMessageItemBody message={gifSampleMessage} />
  </div>
);

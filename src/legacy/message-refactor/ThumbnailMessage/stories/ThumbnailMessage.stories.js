import React from 'react';
import ThumbnailMessage from '../index.jsx';
import message from '../dummyData.mock';

const emptyUrlMessage = {
  ...message,
  url: '',
};

export default { title: 'Legacy/ThumbnailMessage' };

export const withImgByMe = () => (
  <>
    <ThumbnailMessage
      isByMe
      message={message}
      status="READ"
    />
    <ThumbnailMessage
      isByMe
      message={message}
      status="READ"
      chainBottom
    />
    <ThumbnailMessage
      isByMe
      message={message}
      status="READ"
      chainTop
      chainBottom
    />
    <ThumbnailMessage
      isByMe
      message={message}
      status="READ"
      chainTop
    />
    <ThumbnailMessage
      isByMe
      message={emptyUrlMessage}
      status="READ"
    />
  </>
);

export const withImgByOther = () => (
  <>
    <ThumbnailMessage
      isByMe={false}
      message={message}
    />
    <ThumbnailMessage
      isByMe={false}
      message={message}
      chainBottom
    />
    <ThumbnailMessage
      isByMe={false}
      message={message}
      chainTop
      chainBottom
    />
    <ThumbnailMessage
      isByMe={false}
      message={message}
      chainTop
    />
    <ThumbnailMessage
      isByMe={false}
      message={emptyUrlMessage}
    />
  </>
);

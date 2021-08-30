import React from 'react';
import OGMessageItemBody from '../index.tsx';

const mockMessage = (process) => {
  const obj = {
    message: 'go to this link sendbird.com it will be usefull to you!!',
    ogMetaData: {
      title: 'I am Title',
      description: 'I\'m description I\'m description I\'m description I\'m description ',
      url: 'https://sendbird.com/',
      defaultImage: {
        url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
        alt: 'test',
      },
    },
    sender: {
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
      nickname: 'Hoonying',
    },
    createdAt: 2000000,
  };
  if (process && typeof process === 'function') {
    return process(obj)
  }
  return obj;
};

export default { title: 'UI Components/OGMessageItemBody' };

export const withText = () => (
  <>
    <OGMessageItemBody message={mockMessage()} isByMe />
    <br />
    <br />
    <OGMessageItemBody message={mockMessage()} isByMe={false} />
  </>
);

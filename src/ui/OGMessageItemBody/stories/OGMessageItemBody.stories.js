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

const description = `
  \`import OGMessageItemBody from "@sendbird/uikit-react/ui/OGMessageItemBody";\`
  \n OGMessage is the message that captures summary of a hyperlink/webpage
`;

export default {
  title: '@sendbird/uikit-react/ui/OGMessageItemBody',
  component: OGMessageItemBody,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <OGMessageItemBody message={mockMessage()} {...arg} />
);

export const withText = () => (
  <>
    <OGMessageItemBody message={mockMessage()} isByMe />
    <br />
    <br />
    <OGMessageItemBody message={mockMessage()} isByMe={false} />
  </>
);

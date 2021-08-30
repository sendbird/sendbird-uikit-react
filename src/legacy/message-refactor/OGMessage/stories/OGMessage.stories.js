import React from 'react';
import OGMessage from '../index.jsx';

export default { title: 'Legacy/OGMessage' };

const title = 'This is the TITLE';

const mockMessage = (process) => {
  const obj = {
    message: 'go to this link sendbird.com it will be usefull to you!!',
    ogMetaData: {
      title: title,
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

export const outgoing = () => [
  <OGMessage message={mockMessage()} isByMe status="SENT" />,
  <br />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.defaultImage.url;
        return message;
      })
    }
    isByMe
    status="SENT"
  />,
  <br />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.defaultImage;
        return message;
      })
    }
    isByMe
    status="SENT"
  />,
  <br />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.title;
        return message;
      })
    }
    isByMe
    status="SENT"
  />,
  <br />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.description;
        return message;
      })
    }
    isByMe
    status="SENT"
  />,
  <br />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.title;
        delete message.ogMetaData.description;
        return message;
      })
    }
    isByMe
    status="SENT"
  />,
];

export const outgoingGrouping = () => [
  <OGMessage message={mockMessage()} isByMe status="SENT" chainBottom />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.defaultImage.url;
        return message;
      })
    }
    isByMe
    status="SENT"
    chainTop
    chainBottom
    />,
    <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.defaultImage;
        return message;
      })
    }
    isByMe
    status="SENT"
    chainTop
    chainBottom
    />,
    <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.title;
        return message;
      })
    }
    isByMe
    status="SENT"
    chainTop
    chainBottom
    />,
    <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.description;
        return message;
      })
    }
    isByMe
    status="SENT"
    chainTop
    chainBottom
    />,
    <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.title;
        delete message.ogMetaData.description;
        return message;
      })
    }
    isByMe
    status="SENT"
    chainTop
  />,
];

export const incoming = () => [
  <OGMessage message={mockMessage()} />,
  <br />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.defaultImage.url;
        return message;
      })
    }
  />,
  <br />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.defaultImage;
        return message;
      })
    }
  />,
  <br />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.title;
        return message;
      })
    }
  />,
  <br />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.description;
        return message;
      })
    }
  />,
  <br />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.title;
        delete message.ogMetaData.description;
        return message;
      })
    }
  />,
];

export const incomingGrouping = () => [
  <OGMessage message={mockMessage()} chainBottom />,
  <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.defaultImage.url;
        return message;
      })
    }
    chainTop
    chainBottom
    />,
    <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.defaultImage;
        return message;
      })
    }
    chainTop
    chainBottom
    />,
    <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.title;
        return message;
      })
    }
    chainTop
    chainBottom
    />,
    <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.description;
        return message;
      })
    }
    chainTop
    chainBottom
    />,
    <OGMessage
    message={
      mockMessage((message) => {
        delete message.ogMetaData.title;
        delete message.ogMetaData.description;
        return message;
      })
    }
    chainTop
  />,
];

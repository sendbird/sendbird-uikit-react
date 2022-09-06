import React from 'react';
import { render, screen } from '@testing-library/react';

import OpenchannelOGMessage from "../index";

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
jest.mock('date-fns/format', () => () => ('mock-date'));

const userId = 'hh-1234';
const getMockMessage = (callback) => {
  const message = {
    messageType: 'user',
    message: 'I am the Message',
    createdAt: 1111,
    updatedAt: 0,
    ogMetaData: {
      url: 'https://sendbird.com/',
      title: 'This is the TITLE',
      description: 'I am description I am who has much string in this og meta data',
      defaultImage: {
        url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
        alt: 'test',
      },
    },
    sender: {
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
      friendName: 'Hoon Baek',
      nickname: 'Honn',
      userId,
    },
    isResendable: () => false,
  };
  if (callback) {
    return callback(message);
  }
  return message;
};

describe('ui/OpenchannelOGMessage', () => {
  it('should have default elements', function() {
    const { container } = render(
      <OpenchannelOGMessage
        message={getMockMessage()}
        userId={userId}
        status="succeeded"
      />
    );
    expect(
      screen.getByTestId('sendbird-openchannel-og-message').className
    ).toContain('sendbird-openchannel-og-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__description__message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__url').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__title').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__description').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__thumbnail').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__failed').length
    ).toBe(0);
  });

  it('should not have elements by chainTop', function() {
    const { container } = render(
      <OpenchannelOGMessage
        message={getMockMessage()}
        userId={userId}
        status="succeeded"
        chainTop
      />
    );
    expect(
      screen.getByTestId('sendbird-openchannel-og-message').className
    ).toContain('sendbird-openchannel-og-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left__avatar').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sender-name').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sent-at').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__description__message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__url').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__title').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__description').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__thumbnail').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(0);
  });

  it('should not have og elements when ogMetaData does not exist', function() {
    const { container } = render(
      <OpenchannelOGMessage
        message={getMockMessage((message) => ({ ...message, ogMetaData: {} }))}
        status="succeeded"
        userId="hh-1234"
      />
    );
    expect(
      screen.getByTestId('sendbird-openchannel-og-message').className
    ).toContain('sendbird-openchannel-og-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__description__message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__url').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__title').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__description').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__thumbnail').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__failed').length
    ).toBe(0);
  });

  it('should render pending icon if status is pending', function() {
    const { container } = render(
      <OpenchannelOGMessage
        message={getMockMessage((message) => ({ ...message, sendingStatus: 'pending' }))}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__failed').length
    ).toBe(0);
  });

  it('should render failed icon if status is failed', function() {
    const { container } = render(
      <OpenchannelOGMessage
        message={getMockMessage((message) => ({ ...message, sendingStatus: 'failed' }))}
        status="failed"
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__failed').length
    ).toBe(1);
  });

  it('should do a snapshot test of the OpenchannelOGMessage DOM', function() {
    const { asFragment } = render(
      <OpenchannelOGMessage
        message={{
          messageType: 'user',
          message: 'I am the Message',
          createdAt: 1111,
          updatedAt: 0,
          ogMetaData: {
            url: 'https://sendbird.com/',
            title: 'This is the TITLE',
            description: 'I am description I am who has much string in this og meta data',
            defaultImage: {
              url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
              alt: 'test',
            },
          },
          sender: {
            profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
            friendName: 'Hoon Baek',
            nickname: 'Honn',
            userId: 'hh-1234',
          },
          isResendable: () => false,
        }}
        status="succeeded"
        userId="hh-1234"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';

import OpenchannelUserMessage from "../index";

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
jest.mock('date-fns/format', () => () => ('mock-date'));

const userId = 'hh-1234';
const getMockMessage = (callback) => {
  const mockMessage = {
    message: 'I am message',
    messageType: 'user',
    updatedAt: 0,
    sender: {
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
      friendName: 'Hoon Baek',
      nickname: 'Hoon',
      userId,
    },
    createdAt: 1000,
    isResendable: () => { },
  };
  if (callback && typeof callback === 'function') {
    callback(mockMessage);
  }
  return mockMessage;
};

describe('ui/OpenchannelUserMessage', () => {
  it('should have default elements', function () {
    const { container } = render(
      <OpenchannelUserMessage
        message={getMockMessage()}
        userId={userId}
        status="succeeded"
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message')[0].className
    ).toContain('sendbird-openchannel-user-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__top__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__top__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__bottom__message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should not have chainTop elements', function () {
    const { container } = render(
      <OpenchannelUserMessage
        message={getMockMessage()}
        userId={userId}
        status="succeeded"
        chainTop
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message')[0].className
    ).toContain('sendbird-openchannel-user-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__left').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__left__avatar').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__top__sender-name').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__top__sent-at').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__bottom__message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should render pending icon if status is pending', function () {
    const { container } = render(
      <OpenchannelUserMessage
        message={getMockMessage((message) => {
          message.isResendable = () => true;
          message.sendingStatus = 'pending';
        })}
        userId={userId}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__tail__pending').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should render failed icon if status is failed', function () {
    const { container } = render(
      <OpenchannelUserMessage
        message={getMockMessage((message) => {
          message.isResendable = () => true;
          message.sendingStatus = 'failed';
        })}
        userId={userId}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-user-message__right__tail__failed').length
    ).toBe(1);
  });

  it('should do a snapshot test of the OpenchannelUserMessage DOM', function () {
    const { asFragment } = render(
      <OpenchannelUserMessage
        message={{
          message: 'I am message',
          messageType: 'user',
          updatedAt: 0,
          sender: {
            profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
            friendName: 'Hoon Baek',
            nickname: 'Hoon',
            userId: 'hh-1234',
          },
          createdAt: 1000,
          isResendable: () => { },
        }}
        status="succeeded"
        userId="hh-1234"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

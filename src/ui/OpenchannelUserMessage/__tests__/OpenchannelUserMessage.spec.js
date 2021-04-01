import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

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

describe('OpenchannelUserMessage', () => {
  it('should have default elements', function () {
    const component = mount(
      <OpenchannelUserMessage
        message={getMockMessage()}
        userId={userId}
        status="succeeded"
      />
    );

    expect(
      component.find('.sendbird-openchannel-user-message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-user-message__left__avatar').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-user-message__right__top__sender-name').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-user-message__right__top__sent-at').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-user-message__right__bottom__message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-user-message__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-user-message__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should not have chainTop elements', function () {
    const component = mount(
      <OpenchannelUserMessage
        message={getMockMessage()}
        userId={userId}
        status="succeeded"
        chainTop
      />,
    );

    expect(
      component.find('.sendbird-openchannel-user-message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-user-message__left').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-user-message__left__avatar').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-user-message__right').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-user-message__right__top__sender-name').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-user-message__right__top__sent-at').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-user-message__right__bottom__message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-user-message__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-user-message__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should render pending icon if status is pending', function () {
    const component = mount(
      <OpenchannelUserMessage
        message={getMockMessage((message) => {
          message.isResendable = () => true;
        })}
        userId={userId}
        status="pending"
      />
    );
    expect(
      component.find('.sendbird-openchannel-user-message__right__tail__pending').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-user-message__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should render failed icon if status is failed', function () {
    const component = mount(
      <OpenchannelUserMessage
        message={getMockMessage((message) => {
          message.isResendable = () => true;
        })}
        userId={userId}
        status="failed"
      />
    );
    expect(
      component.find('.sendbird-openchannel-user-message__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-user-message__right__tail__failed').exists()
    ).toBe(true);
  });

  it('should do a snapshot test of the OpenchannelUserMessage DOM', function () {
    const component = renderer.create(
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
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

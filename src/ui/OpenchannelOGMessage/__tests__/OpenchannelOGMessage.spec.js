import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

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

describe('OpenchannelOGMessage', () => {
  it('should have default elements', function() {
    const component = mount(
      <OpenchannelOGMessage
        message={getMockMessage()}
        userId={userId}
        status="succeeded"
      />
    );

    expect(
      component.find('.sendbird-openchannel-og-message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__left').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__left__avatar').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__title__sender-name').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__title__sent-at').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__description__message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__url').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__title').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__description').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__thumbnail').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should not have elements by chainTop', function() {
    const component = mount(
      <OpenchannelOGMessage
        message={getMockMessage()}
        userId={userId}
        status="succeeded"
        chainTop
      />
    );

    expect(
      component.find('.sendbird-openchannel-og-message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__left').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__left__avatar').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__title__sender-name').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__title__sent-at').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__description__message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__url').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__title').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__description').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__thumbnail').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should not have og elements when ogMetaData does not exist', function() {
    const component = mount(
      <OpenchannelOGMessage
        message={getMockMessage((message) => ({ ...message, ogMetaData: {} }))}
        status="succeeded"
        userId="hh-1234"
      />
    );

    expect(
      component.find('.sendbird-openchannel-og-message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__left').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__left__avatar').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__title__sender-name').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__title__sent-at').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__description__message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__url').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__title').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__description').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__bottom__og-tag__thumbnail').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should render pending icon if status is pending', function() {
    const component = mount(
      <OpenchannelOGMessage
        message={getMockMessage((message) => ({ ...message, sendingStatus: 'pending' }))}
      />
    );
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__tail__pending').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should render failed icon if status is failed', function() {
    const component = mount(
      <OpenchannelOGMessage
        message={getMockMessage((message) => ({ ...message, sendingStatus: 'failed' }))}
        status="failed"
      />
    );
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-og-message__top__right__tail__failed').exists()
    ).toBe(true);
  });

  it('should do a snapshot test of the OpenchannelOGMessage DOM', function() {
    const component = renderer.create(
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
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

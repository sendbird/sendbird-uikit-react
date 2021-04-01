import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import mockMessage, { mockMessageVideo, getMockMessage, getMockMessageWithVideo } from '../dummyData.mock';

import OpenchannelThumbnailMessage from "../index";

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
jest.mock('date-fns/format', () => () => ('mock-date'));

describe('OpenchannelThumbnailMessage', () => {
  it('should render for image thumbnail message', function() {
    const component = mount(
      <OpenchannelThumbnailMessage
        message={mockMessage}
        status="succeeded"
        userId="hoon102"
      />
    );

    expect(
      component.find('.sendbird-openchannel-thumbnail-message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__left__avatar').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__title__sender-name').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__title__sent-at').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__overlay').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__image').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__context-menu--icon').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should render for empty url image thumbnail message', function() {
    const mockMessage = getMockMessage();
    mockMessage.url = '';
    const component = mount(
      <OpenchannelThumbnailMessage
        message={mockMessage}
        status="succeeded"
        userId="hoon102"
      />
    );

    expect(
      component.find('.sendbird-openchannel-thumbnail-message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__left__avatar').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__title__sender-name').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__title__sent-at').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__overlay').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__image').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__image--icon').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__context-menu--icon').exists()
    ).toBe(true);expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__failed').exists()
    ).toBe(false);
  });


  it('should render for video thumbnail message', function() {
    const component = mount(
      <OpenchannelThumbnailMessage
        message={mockMessageVideo}
        status="succeeded"
        userId="hoon102"
      />
    );

    expect(
      component.find('.sendbird-openchannel-thumbnail-message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__left__avatar').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__title__sender-name').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__title__sent-at').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__overlay').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__video').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__video__video').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__video__icon').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__context-menu--icon').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should render for empty url video thumbnail message', function() {
    const mockMessage = getMockMessageWithVideo();
    mockMessage.url = '';
    const component = mount(
      <OpenchannelThumbnailMessage
        message={mockMessage}
        status="succeeded"
        userId="hoon102"
      />
    );

    expect(
      component.find('.sendbird-openchannel-thumbnail-message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__left__avatar').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__title__sender-name').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__title__sent-at').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__overlay').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__video').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__video__video').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__video__icon').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__video--icon').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__context-menu--icon').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should not render avatar and title when chainTop is true', function() {
    const component = mount(
      <OpenchannelThumbnailMessage
        message={mockMessage}
        status="succeeded"
        userId="hoon102"
        chainTop
      />
    );

    expect(
      component.find('.sendbird-openchannel-thumbnail-message').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__left__avatar').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__title__sender-name').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__title__sent-at').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__overlay').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__image').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__body__wrap__image--icon').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__context-menu--icon').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should render pending icon if status is pending', function() {
    const message = getMockMessageWithVideo((message) => {
      message.isResendable = () => true;
    });
    const component = mount(
      <OpenchannelThumbnailMessage
        message={message}
        userId={message.sender.userId}
        status="pending"
      />
    );
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__pending').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__failed').exists()
    ).toBe(false);
  });

  it('should render failed icon if status is failed', function() {
    const message = getMockMessageWithVideo((message) => {
      message.isResendable = () => true;
    });
    const component = mount(
      <OpenchannelThumbnailMessage
        message={message}
        userId={message.sender.userId}
        status="failed"
      />
    );
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__pending').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-thumbnail-message__right__tail__failed').exists()
    ).toBe(true);
  });

  it('should do a snapshot test of the OpenchannelThumbnailMessage DOM', function() {
    const component = renderer.create(
      <OpenchannelThumbnailMessage
        message={mockMessage}
        status="succeeded"
        userId="hoon102"
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

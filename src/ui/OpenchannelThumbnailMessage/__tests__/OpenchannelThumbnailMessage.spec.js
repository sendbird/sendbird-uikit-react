import React from 'react';
import { render, screen } from '@testing-library/react';
import mockMessage, { mockMessageVideo, getMockMessage, getMockMessageWithVideo } from '../dummyData.mock';

import OpenchannelThumbnailMessage from "../index";

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
jest.mock('date-fns/format', () => () => ('mock-date'));

describe('ui/OpenchannelThumbnailMessage', () => {
  it('should render for image thumbnail message', function() {
    const { container } = render(
      <OpenchannelThumbnailMessage
        message={mockMessage}
        status="succeeded"
        userId="hoon102"
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message')[0].className
    ).toContain('sendbird-openchannel-thumbnail-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__overlay').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__image').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__context-menu--icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should render for empty url image thumbnail message', function() {
    const mockMessage = getMockMessage();
    mockMessage.url = '';
    const { container } = render(
      <OpenchannelThumbnailMessage
        message={mockMessage}
        status="succeeded"
        userId="hoon102"
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message')[0].className
    ).toContain('sendbird-openchannel-thumbnail-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__overlay').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__image').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__image--icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__context-menu--icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__failed').length
    ).toBe(0);
  });


  it('should render for video thumbnail message', function() {
    const { container } = render(
      <OpenchannelThumbnailMessage
        message={mockMessageVideo}
        status="succeeded"
        userId="hoon102"
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message')[0].className
    ).toContain('sendbird-openchannel-thumbnail-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__overlay').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__video').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__video__video').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__video__icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__context-menu--icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should render for empty url video thumbnail message', function() {
    const mockMessage = getMockMessageWithVideo();
    mockMessage.url = '';
    const { container } = render(
      <OpenchannelThumbnailMessage
        message={mockMessage}
        status="succeeded"
        userId="hoon102"
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message')[0].className
    ).toContain('sendbird-openchannel-thumbnail-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__overlay').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__video').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__video__video').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__video__icon').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__video--icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__context-menu--icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should not render avatar and title when chainTop is true', function() {
    const { container } = render(
      <OpenchannelThumbnailMessage
        message={mockMessage}
        status="succeeded"
        userId="hoon102"
        chainTop
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message')[0].className
    ).toContain('sendbird-openchannel-thumbnail-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__left__avatar').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__title__sender-name').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__title__sent-at').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__overlay').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__image').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__body__wrap__image--icon').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__context-menu--icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should render pending icon if status is pending', function() {
    const message = getMockMessageWithVideo((message) => {
      message.isResendable = () => true;
      message.sendingStatus = 'pending';
    });
    const { container } = render(
      <OpenchannelThumbnailMessage
        message={message}
        userId={message.sender.userId}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__pending').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should render failed icon if status is failed', function() {
    const message = getMockMessageWithVideo((message) => {
      message.isResendable = () => true;
      message.sendingStatus = 'failed';
    });
    const { container } = render(
      <OpenchannelThumbnailMessage
        message={message}
        userId={message.sender.userId}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-thumbnail-message__right__tail__failed').length
    ).toBe(1);
  });

  it('should do a snapshot test of the OpenchannelThumbnailMessage DOM', function() {
    const { asFragment } = render(
      <OpenchannelThumbnailMessage
        message={mockMessage}
        status="succeeded"
        userId="hoon102"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

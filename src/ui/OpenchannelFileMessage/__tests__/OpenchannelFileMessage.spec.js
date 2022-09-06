import React from 'react';
import { render, screen } from '@testing-library/react';
import { dummyFileMessageImage, getFileMessage } from '../mockMessages';

import OpenchannelFileMessage from "../index";

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
jest.mock('date-fns/format', () => () => ('mock-date'));

describe('ui/OpenchannelFileMessage', () => {
  it('should render default elements', function() {
    const { container } = render(
      <OpenchannelFileMessage
        message={dummyFileMessageImage}
      />
    );

    expect(
      screen.getByTestId('sendbird-openchannel-file-message').className
    ).toContain('sendbird-openchannel-file-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__body__icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__body__file-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__context-menu').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should not render elements when chainTop is true', function() {
    const { container } = render(
      <OpenchannelFileMessage
        message={dummyFileMessageImage}
        chainTop
      />
    );
    expect(
      screen.getByTestId('sendbird-openchannel-file-message').className
    ).toContain('sendbird-openchannel-file-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__left__avatar').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__title__sender-name').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__title__sent-at').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__body__icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__body__file-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__context-menu').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should render pending icon if status is pending', function() {
    const { container } = render(
      <OpenchannelFileMessage
        message={getFileMessage((m) => ({ ...m, sendingStatus: 'pending' }))}
      />
    );
    expect(
      screen.getByTestId('sendbird-openchannel-file-message').className
    ).toContain('sendbird-openchannel-file-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__body__icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__body__file-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__context-menu').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__tail__pending').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__tail__failed').length
    ).toBe(0);
  });

  it('should render pending icon if status is failed', function() {
    const { container } = render(
      <OpenchannelFileMessage
        message={getFileMessage((m) => ({ ...m, sendingStatus: 'failed' }))}
        status="failed"
      />
    );
    expect(
      screen.getByTestId('sendbird-openchannel-file-message').className
    ).toContain('sendbird-openchannel-file-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__body__icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__body__file-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__context-menu').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-file-message__right__tail__failed').length
    ).toBe(1);
  });

  it('should do a snapshot test of the OpenchannelFileMessage DOM', function() {
    const { asFragment } = render(
      <OpenchannelFileMessage
        message={dummyFileMessageImage}
        status="succeeded"
        userId="hoon1234"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

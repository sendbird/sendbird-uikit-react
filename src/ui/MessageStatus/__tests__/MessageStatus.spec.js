import React from 'react';
import { render, screen } from '@testing-library/react';

import MessageStatus, { MessageStatusTypes } from "../index";
import dummyMessage from '../messageDummyData.mock';

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
jest.mock('date-fns/format', () => () => ('mock-date'));

describe('ui/MessageStatus', () => {
  it('should contain className', function () {
    const text = "example-text";
    const { container } = render(<MessageStatus className={text} message={dummyMessage} />);
    expect(
      screen.getByTestId('sendbird-message-status').className
    ).toContain('sendbird-message-status');
    expect(
      container.getElementsByClassName('sendbird-message-status').length
    ).toBe(1);
  });

  it('should do a snapshot test of the MessageStatus DOM', function () {
    const text = "example-text";
    const { asFragment } = render(
      <MessageStatus className={text} status={MessageStatusTypes.SENT} message={dummyMessage} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should do a snapshot test of the failed MessageStatus DOM when isResendable: true', function () {
    const text = "example-text";
    const failedMsg = {
      ...dummyMessage,
      sendingStatus: 'failed',
      isResendable: () => { return true; },
    };
    const { asFragment } = render(<MessageStatus className={text} message={failedMsg} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should do a snapshot test of the failed MessageStatus DOM when isResendable: false', function () {
    const text = "example-text";
    const failedMsg = {
      ...dummyMessage,
      sendingStatus: 'failed',
    };
    const { asFragment } = render(<MessageStatus className={text} message={failedMsg} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '@testing-library/react';

import MessageStatus, { MessageStatusTypes } from "../index";
import dummyMessage from '../messageDummyData.mock';

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
vi.mock('date-fns/format', () => ({ default: () => ('mock-date') }));

describe('ui/MessageStatus', () => {
  it('should contain className', function () {
    const text = "example-text";
    const { container } = render(<MessageStatus className={text} message={dummyMessage} />);
    expect(
      container.getElementsByClassName('sendbird-message-status')[0].className
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

// CLNP-8803 / C3
//
// `NONE` means "no status to show", but the component fell back to the ERROR icon for it
// and attached the `sendbird-message-status--sent` hook class, because that class was
// gated on `status !== FAILED` rather than on the status actually being sent. An app that
// hides `--sent` to drop the read receipts therefore also hid the bogus error icon,
// leaving an undelivered message completely blank.
describe('ui/MessageStatus - unmapped status must not borrow another status signal', () => {
  // `canceled` resolves to NONE; the SDK has no 'none' sending status of its own.
  const unmappedMsg = { ...dummyMessage, sendingStatus: 'canceled' };

  it('renders no status icon at all', () => {
    const { queryByTestId } = render(<MessageStatus message={unmappedMsg} />);
    expect(queryByTestId('sendbird-message-status-icon')).toBeNull();
  });

  it('does not leak the literal string "icon" as the icon type', () => {
    // Icon's switch falls through to the string 'icon' for an undefined type, so simply
    // dropping the ERROR fallback without gating the render would print that text.
    const { container } = render(<MessageStatus message={unmappedMsg} />);
    expect(container.textContent).not.toContain('icon');
  });

  it('does not attach the sent hook class', () => {
    const { container } = render(<MessageStatus message={unmappedMsg} />);
    expect(container.querySelector('.sendbird-message-status--sent')).toBeNull();
  });

  it('does not render a sent timestamp', () => {
    const { queryByTestId } = render(<MessageStatus message={unmappedMsg} />);
    expect(queryByTestId('sendbird-message-status-text')).toBeNull();
  });

  it('keeps the status container so layout hooks survive', () => {
    const { container } = render(<MessageStatus message={unmappedMsg} />);
    expect(container.getElementsByClassName('sendbird-message-status').length).toBe(1);
  });
});

describe('ui/MessageStatus - settled statuses are unchanged', () => {
  const groupChannel = (counts) => ({ isGroupChannel: () => true, ...counts });

  it('keeps the icon and the sent hook class for SENT', () => {
    const { queryByTestId } = render(<MessageStatus message={dummyMessage} />);
    const icon = queryByTestId('sendbird-message-status-icon');
    expect(icon.className).toContain('sendbird-icon-done');
    expect(icon.className).toContain('sendbird-message-status--sent');
  });

  it('keeps the icon and the sent hook class for DELIVERED', () => {
    const channel = groupChannel({
      getUnreadMemberCount: () => 1,
      getUndeliveredMemberCount: () => 0,
    });
    const { queryByTestId } = render(<MessageStatus message={dummyMessage} channel={channel} />);
    const icon = queryByTestId('sendbird-message-status-icon');
    expect(icon.className).toContain('sendbird-icon-done-all');
    expect(icon.className).toContain('sendbird-message-status--sent');
  });

  it('keeps the icon and the sent hook class for READ', () => {
    const channel = groupChannel({ getUnreadMemberCount: () => 0 });
    const { queryByTestId } = render(<MessageStatus message={dummyMessage} channel={channel} />);
    const icon = queryByTestId('sendbird-message-status-icon');
    expect(icon.className).toContain('sendbird-icon-done-all');
    expect(icon.className).toContain('sendbird-message-status--sent');
  });

  it('keeps the error icon and withholds the sent hook class for FAILED', () => {
    const { queryByTestId } = render(
      <MessageStatus message={{ ...dummyMessage, sendingStatus: 'failed' }} />,
    );
    const icon = queryByTestId('sendbird-message-status-icon');
    expect(icon.className).toContain('sendbird-icon-error');
    expect(icon.className).not.toContain('sendbird-message-status--sent');
  });

  it('keeps the spinner for PENDING', () => {
    const { queryByTestId } = render(
      <MessageStatus message={{ ...dummyMessage, sendingStatus: 'pending' }} />,
    );
    const icon = queryByTestId('sendbird-message-status-icon');
    expect(icon.className).toContain('sendbird-loader');
  });
});

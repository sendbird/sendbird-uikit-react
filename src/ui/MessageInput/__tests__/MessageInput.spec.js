import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';

import MessageInput from "../index";

const noop = () => {};

describe('ui/MessageInput', () => {
  it('should render upload icon if no text is present', () => {
    const { container } = render(<MessageInput onSendMessage={noop} value="" />);
    expect(
      container.getElementsByClassName('sendbird-message-input--send').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-message-input--attach').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-message-input--edit-action').length
    ).toBe(0);
  });

  it("should render upload icon even though only white spaces are present", () => {
    const { container } = render(
      <MessageInput onSendMessage={noop} value="   " />
    );
    expect(
      container.getElementsByClassName("sendbird-message-input--send").length
    ).toBe(0);
    expect(
      container.getElementsByClassName("sendbird-message-input--attach").length
    ).toBe(1);
    expect(
      container.getElementsByClassName("sendbird-message-input--edit-action")
        .length
    ).toBe(0);
  });

  it("should not render the placeholder text if only white spaces are present", () => {
    const { container } = render(
      <MessageInput onSendMessage={noop} value="   " />
    );
    expect(
      container.getElementsByClassName("sendbird-message-input--placeholder")
        .length
    ).toBe(0);
  });

  it.skip('should render send icon if text is present', () => {
    const component = shallow(
      <MessageInput
        onSendMessage={noop}
        message={{
          message: 'hello',
          mentionedMessageTempalte: 'hello'
        }}
      />
    );
    expect(
      component.find('#sendbird-message-input-text-field').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-input--send').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-input--attach').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-input--edit-action').exists()
    ).toBe(false);
  });

  it('should display save/cancel button on edit mode', () => {
    const messageId = 'aaa';
    const { container } = render(<MessageInput onSendMessage={noop} isEdit message={{ messageId }} />);
    expect(
      container.getElementsByClassName('sendbird-message-input-text-field')[0].id
    ).toBe('sendbird-message-input-text-field' + messageId);
    expect(
      container.getElementsByClassName('sendbird-message-input--send').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-message-input--attach').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-message-input--edit-action').length
    ).toBe(1);
  });
});

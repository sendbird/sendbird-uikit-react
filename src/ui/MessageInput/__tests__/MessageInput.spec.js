import React, { useRef } from 'react';
import { render, screen,fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

  it('should call sendMessage with valid string', async () => {
    const onSendMessage = jest.fn();
    const textRef = { current: { innerText: null } };
    const mockText = 'Test Value';

    render(<MessageInput onSendMessage={onSendMessage} ref={textRef} />);

    const input = screen.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, mockText);
    expect(input.textContent).toBe(mockText);

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSendMessage).toHaveBeenCalled();
  });

  it('should call sendMessage with valid string; new lines included', async () => {
    const onSendMessage = jest.fn();
    const textRef = { current: { innerText: null } };
    const mockText = '        \nTest Value     \n';

    render(<MessageInput onSendMessage={onSendMessage} ref={textRef} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, mockText);
    expect(input.textContent).toBe(mockText);

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSendMessage).toHaveBeenCalled();
  });

  it('should not call sendMessage with invalid string; only white spaces', async() => {
    const onSendMessage = jest.fn();
    const textRef = { current: { innerText: null } };
    const mockText = '    ';

    render(<MessageInput onSendMessage={onSendMessage} ref={textRef} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, mockText);
    expect(input.textContent).toBe(mockText);

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSendMessage).not.toHaveBeenCalled();
  });
  
  it('should render send icon if text is present', async() => {
    const onSendMessage = jest.fn();
    const textRef = { current: { innerText: null } };
    const mockText = 'hello';

    const { container } = render(<MessageInput onSendMessage={onSendMessage} ref={textRef} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, mockText);
    expect(input.textContent).toBe(mockText);

    expect(
      container.getElementsByClassName('sendbird-message-input-text-field').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-message-input--send').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-message-input--attach').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-message-input--edit-action').length
    ).toBe(0);
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

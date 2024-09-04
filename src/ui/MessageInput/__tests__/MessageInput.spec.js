import React, { useContext } from 'react';
import { render, renderHook, screen,fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../lib/LocalizationContext';
import MessageInput from "../index";

const noop = () => {};

// to mock useSendbirdStateContext
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));
jest.mock('../../../lib/LocalizationContext', () => ({
  ...jest.requireActual('../../../lib/LocalizationContext'),
  useLocalization: jest.fn(),
}));

describe('ui/MessageInput', () => {
  /** Mocking necessary hooks */
  beforeEach(() => {
    const stateContextValue = {
      config: {
        groupChannel: {
          enableDocument: true,
        }
      }
    };
    const localeContextValue = {
      stringSet: {},
    };

    useContext.mockReturnValue(stateContextValue);
    useLocalization.mockReturnValue(localeContextValue);

    renderHook(() => useSendbirdStateContext());
    renderHook(() => useLocalization());
  })

  describe('Dashboard enableDocument config', () => {
    it('should not render file upload icon if groupChannel.enableDocument: false', () => {
      const stateContextValue = {
        config: {
          groupChannel: {
            enableDocument: false,
          }
        }
      };

      useContext.mockReturnValue(stateContextValue);
      renderHook(() => useSendbirdStateContext());

      const { container } = render(<MessageInput onSendMessage={noop} value=""  channel={{channelType: 'group'}} />);
      expect(
        container.getElementsByClassName('sendbird-message-input--attach').length
      ).toBe(0);
    });

    it('should not render file upload icon if openChannel.enableDocument: false', () => {
      const stateContextValue = {
        config: {
          openChannel: {
            enableDocument: false,
          }
        }
      };

      useContext.mockReturnValue(stateContextValue);
      renderHook(() => useSendbirdStateContext());

      const { container } = render(<MessageInput onSendMessage={noop} value="" channel={{channelType: 'open'}} />);
      expect(
        container.getElementsByClassName('sendbird-message-input--attach').length
      ).toBe(0);
    });

    it('should not render file upload icon if openChannel.enableDocument: true', () => {
      const stateContextValue = {
        config: {
          openChannel: {
            enableDocument: true,
          }
        }
      };

      useContext.mockReturnValue(stateContextValue);
      renderHook(() => useSendbirdStateContext());

      const { container } = render(<MessageInput onSendMessage={noop} value="" channel={{channelType: 'open'}} />);
      expect(
        container.getElementsByClassName('sendbird-message-input--attach').length
      ).toBe(1);
    });
  })

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

  it("should not render the placeholder text if only white spaces are present", async () => {
    const textRef = { current: { textContent: null } };
    const mockText = '   ';
    const { container, rerender } = render(<MessageInput ref={textRef} />);
    const input = screen.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, mockText);
    expect(input.textContent).toBe(mockText);

    await rerender(<MessageInput ref={textRef} />);
    expect(
      container.getElementsByClassName("sendbird-message-input--placeholder")
        .length
    ).toBe(0);
  });

  it("should render the placeholder text if there's no text in the input", async() => {
    const textRef = { current: { textContent: null } };
    const { container } = render(<MessageInput ref={textRef} />);

    expect(
      container.getElementsByClassName("sendbird-message-input--placeholder")
        .length
    ).toBe(1);
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
    expect(onSendMessage).toHaveBeenCalledWith({ mentionTemplate: mockText, message: mockText });
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
    expect(onSendMessage).toHaveBeenCalledWith({ mentionTemplate: mockText, message: mockText });
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
    expect(onSendMessage).not.toHaveBeenCalledWith({ mentionTemplate: mockText, message: mockText });
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

describe('MessageInput error handling', () => {
  beforeEach(() => {
    const stateContextValue = {
      config: {
        groupChannel: {
          enableDocument: true,
        },
      },
      eventHandlers: {
        message: {
          onSendMessageFailed: jest.fn(),
          onUpdateMessageFailed: jest.fn(),
          onFileUploadFailed: jest.fn(),
        },
      },
    };
    const localeContextValue = {
      stringSet: {},
    };

    useContext.mockReturnValue(stateContextValue);
    useLocalization.mockReturnValue(localeContextValue);

    renderHook(() => useSendbirdStateContext());
    renderHook(() => useLocalization());
  });

  it('should call onSendMessageFailed when sendMessage throws an error by onKeyDown event', async () => {
    const mockErrorMessage = 'Send message failed';
    const onSendMessage = jest.fn(() => {
      throw new Error(mockErrorMessage);
    });
    const { eventHandlers } = useSendbirdStateContext();
    const textRef = { current: { innerText: null } };
    const mockText = 'Test Value';

    render(<MessageInput onSendMessage={onSendMessage} ref={textRef} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, mockText);

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSendMessage).toThrow(mockErrorMessage);
    expect(eventHandlers.message.onSendMessageFailed).toHaveBeenCalled();
  });

  it('should call onSendMessageFailed when sendMessage throws an error by onClick event', async () => {
    const mockErrorMessage = 'Send message failed';
    const onSendMessage = jest.fn(() => {
      throw new Error(mockErrorMessage);
    });
    const { eventHandlers } = useSendbirdStateContext();
    const textRef = { current: { innerText: null } };
    const mockText = 'Test Value';

    render(<MessageInput onSendMessage={onSendMessage} ref={textRef} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, mockText);

    const sendIcon = document.getElementsByClassName('sendbird-message-input--send')[0];
    fireEvent.click(sendIcon);

    expect(onSendMessage).toThrow(mockErrorMessage);
    expect(eventHandlers.message.onSendMessageFailed).toHaveBeenCalled();
  });

  it('should call onUpdateMessageFailed when editMessage throws an error', async () => {
    const mockErrorMessage = 'Update message failed';
    const onUpdateMessage = jest.fn(() => {
      throw new Error(mockErrorMessage);
    });
    const { eventHandlers } = useSendbirdStateContext();
    const messageId = 123;
    const textRef = { current: { innerText: null } };
    const mockText = 'Updated Text';

    render(
      <MessageInput
        isEdit
        message={{ messageId }}
        onUpdateMessage={onUpdateMessage}
        ref={textRef}
      />
    );

    const input = screen.getByRole('textbox');
    await userEvent.type(input, mockText);

    const editButton = document.getElementsByClassName('sendbird-message-input--edit-action__save')[0];

    fireEvent.click(editButton);

    expect(onUpdateMessage).toThrow(mockErrorMessage);
    expect(eventHandlers.message.onUpdateMessageFailed).toHaveBeenCalled();
  });

  it('should call onFileUploadFailed when file upload throws an error', async () => {
    const mockErrorMessage = 'File upload failed';
    const onFileUpload = jest.fn(() => {
      throw new Error(mockErrorMessage);
    });
    const { eventHandlers } = useSendbirdStateContext();
    const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });

    render(<MessageInput onFileUpload={onFileUpload} />);

    const fileInput = document.getElementsByClassName('sendbird-message-input--attach-input')[0];
  
    fireEvent.change(fileInput, { currentTarget: { files: [file] } });

    expect(onFileUpload).toThrow(mockErrorMessage);
    expect(eventHandlers.message.onFileUploadFailed).toHaveBeenCalled();
  });
});



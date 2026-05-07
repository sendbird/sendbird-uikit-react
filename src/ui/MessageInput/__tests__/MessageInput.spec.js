import React from 'react';
import { render, renderHook, screen,fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MessageInput from "../index";
import { useLocalization } from '../../../lib/LocalizationContext';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { isMobileIOS } from '../../../utils/browser';

const noop = () => {};

// to mock useSendbirdStateContext
jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
  useSendbird: jest.fn(),
}));
jest.mock('../../../lib/LocalizationContext', () => ({
  ...jest.requireActual('../../../lib/LocalizationContext'),
  useLocalization: jest.fn(),
}));
jest.mock('../../../utils/browser', () => ({
  ...jest.requireActual('../../../utils/browser'),
  isMobileIOS: jest.fn(() => false),
}));

const placeCaretInTextNode = (element, offset) => {
  const textNode = element.firstChild;
  const range = document.createRange();
  range.setStart(textNode, offset ?? textNode.textContent.length);
  range.collapse(true);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  return range;
};

describe('ui/MessageInput', () => {
  /** Mocking necessary hooks */
  beforeEach(() => {
    const stateContextValue = {
      state: {
        config: {
          groupChannel: {
            enableDocument: true,
          }
        }
      }
    };
    const localeContextValue = {
      stringSet: {},
    };

    useSendbird.mockReturnValue(stateContextValue);
    useLocalization.mockReturnValue(localeContextValue);
    isMobileIOS.mockReturnValue(false);

    renderHook(() => useSendbird());
    renderHook(() => useLocalization());
  })

  describe('Dashboard enableDocument config', () => {
    it('should not render file upload icon if groupChannel.enableDocument: false', () => {
      const stateContextValue = {
        state: {
          config: {
            groupChannel: {
              enableDocument: false,
            }
          }
        }
      };

      useSendbird.mockReturnValue(stateContextValue);
      renderHook(() => useSendbird());

      const { container } = render(<MessageInput onSendMessage={noop} value=""  channel={{channelType: 'group'}} />);
      expect(
        container.getElementsByClassName('sendbird-message-input--attach').length
      ).toBe(0);
    });

    it('should not render file upload icon if openChannel.enableDocument: false', () => {
      const stateContextValue = {
        state: {
          config: {
            openChannel: {
              enableDocument: false,
            }
          }
        }
      };

      useSendbird.mockReturnValue(stateContextValue);
      renderHook(() => useSendbird());

      const { container } = render(<MessageInput onSendMessage={noop} value="" channel={{channelType: 'open'}} />);
      expect(
        container.getElementsByClassName('sendbird-message-input--attach').length
      ).toBe(0);
    });

    it('should not render file upload icon if openChannel.enableDocument: true', () => {
      const stateContextValue = {
        state: {
          config: {
            openChannel: {
              enableDocument: true,
            }
          }
        }
      };

      useSendbird.mockReturnValue(stateContextValue);
      renderHook(() => useSendbird());

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
    expect(onSendMessage).toHaveBeenCalledWith({ mentionTemplate: '', message: mockText });
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
    expect(onSendMessage).toHaveBeenCalledWith({ mentionTemplate: '', message: mockText });
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
    expect(onSendMessage).not.toHaveBeenCalledWith({ mentionTemplate: '', message: mockText });
  });

  it('should not call sendMessage with only zero-width spaces', () => {
    const onSendMessage = jest.fn();
    render(<MessageInput onSendMessage={onSendMessage} />);

    const input = screen.getByRole('textbox');
    input.textContent = '\u200B';

    fireEvent.input(input);
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

  it('should call update and cancel callbacks in edit mode', async () => {
    const messageId = 123;
    const onUpdateMessage = jest.fn();
    const onCancelEdit = jest.fn();

    render(
      <MessageInput
        isEdit
        message={{ messageId }}
        onUpdateMessage={onUpdateMessage}
        onCancelEdit={onCancelEdit}
      />
    );

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'edited message');
    fireEvent.click(document.getElementsByClassName('sendbird-message-input--edit-action__save')[0]);
    fireEvent.click(document.getElementsByClassName('sendbird-message-input--edit-action__cancel')[0]);

    expect(onUpdateMessage).toHaveBeenCalledWith({
      messageId,
      message: 'edited message',
      mentionTemplate: 'edited message',
    });
    expect(onCancelEdit).toHaveBeenCalled();
    expect(input.innerHTML).toBe('');
  });

  it('should call file upload callback and reset the native file input', () => {
    const onFileUpload = jest.fn();
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    render(<MessageInput onFileUpload={onFileUpload} />);

    const fileInput = document.getElementsByClassName('sendbird-message-input--attach-input')[0];
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(onFileUpload).toHaveBeenCalledWith([file]);
    expect(fileInput.value).toBe('');
  });

  it('should render custom action icons when render props are provided', async () => {
    const onVoiceMessageIconClick = jest.fn();
    const { rerender } = render(
      <MessageInput
        renderFileUploadIcon={() => <button type="button" data-testid="custom-upload">upload</button>}
        renderVoiceMessageIcon={() => <span data-testid="custom-voice">voice</span>}
        onVoiceMessageIconClick={onVoiceMessageIconClick}
      />
    );

    expect(screen.getByTestId('custom-upload')).toBeInTheDocument();
    expect(screen.getByTestId('custom-voice')).toBeInTheDocument();
    fireEvent.click(document.getElementsByClassName('sendbird-message-input--voice-message')[0]);
    expect(onVoiceMessageIconClick).toHaveBeenCalled();

    rerender(
      <MessageInput
        renderSendMessageIcon={() => <span data-testid="custom-send">send</span>}
      />
    );
    await userEvent.type(screen.getByRole('textbox'), 'message');
    expect(screen.getByTestId('custom-send')).toBeInTheDocument();
  });

  it('should let consumer keydown handler prevent enter send', () => {
    const onSendMessage = jest.fn();
    const onKeyDown = jest.fn(() => true);

    render(<MessageInput onSendMessage={onSendMessage} onKeyDown={onKeyDown} />);

    const input = screen.getByRole('textbox');
    input.textContent = 'blocked';
    fireEvent.input(input);
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onKeyDown).toHaveBeenCalled();
    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it('hydrates edit mode with mention labels from mentioned message templates', () => {
    render(
      <MessageInput
        isEdit
        isMentionEnabled
        channel={{ isGroupChannel: () => true }}
        message={{
          messageId: 200,
          message: 'hello Alice',
          mentionedUsers: [{ userId: 'u1', nickname: 'Alice' }],
          mentionedMessageTemplate: 'hello @{u1}',
        }}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input.querySelector('.sendbird-mention-user-label')).toBeTruthy();
    expect(input.innerHTML).toContain('Alice');
  });

  it('detects mention strings and replaces them with selected users', () => {
    const onMentionStringChange = jest.fn();
    const onUserMentioned = jest.fn();
    const onMentionedUserIdsUpdated = jest.fn();
    const baseProps = {
      isMentionEnabled: true,
      channel: { isGroupChannel: () => true },
      onMentionStringChange,
      onUserMentioned,
      onMentionedUserIdsUpdated,
    };
    const { rerender } = render(<MessageInput {...baseProps} />);
    const input = screen.getByRole('textbox');

    input.textContent = 'hello @ali';
    placeCaretInTextNode(input);
    fireEvent.keyUp(input, { key: 'i' });
    expect(onMentionStringChange).toHaveBeenCalledWith('@ali');

    rerender(
      <MessageInput
        {...baseProps}
        mentionSelectedUser={{ userId: 'u1', nickname: 'Alice' }}
      />,
    );

    expect(onUserMentioned).toHaveBeenCalledWith({ userId: 'u1', nickname: 'Alice' });
    expect(input.querySelector('.sendbird-mention-user-label')).toBeTruthy();
    expect(onMentionedUserIdsUpdated).toHaveBeenCalledWith(['u1']);
  });

  it('removes an orphan mention label on backspace', () => {
    render(<MessageInput isMentionEnabled channel={{ isGroupChannel: () => true }} />);
    const input = screen.getByRole('textbox');
    const mention = document.createElement('span');
    mention.className = 'sendbird-mention-user-label';
    mention.dataset.userid = 'u1';
    input.appendChild(document.createTextNode(''));
    input.appendChild(mention);

    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(input.querySelector('.sendbird-mention-user-label')).toBeNull();
  });

  it('keeps the iOS keyboard focus after sending', async () => {
    const originalRaf = window.requestAnimationFrame;
    const originalGlobalRaf = global.requestAnimationFrame;
    isMobileIOS.mockReturnValue(true);
    const rafMock = jest.fn((callback) => {
      callback();
      return 1;
    });
    window.requestAnimationFrame = rafMock;
    global.requestAnimationFrame = rafMock;

    try {
      const onSendMessage = jest.fn();
      const { container } = render(<MessageInput onSendMessage={onSendMessage} />);
      const input = container.querySelector('.sendbird-message-input--textarea');

      await userEvent.type(input, 'ios message');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(document.getElementById('ghost-input-reset-ime-cjk')).toBeTruthy();
      expect(onSendMessage).toHaveBeenCalledWith({ message: 'ios message', mentionTemplate: '' });
      expect(rafMock).toHaveBeenCalled();
    } finally {
      isMobileIOS.mockReturnValue(false);
      window.requestAnimationFrame = originalRaf;
      global.requestAnimationFrame = originalGlobalRaf;
    }
  });

  it('adjusts scroll position after paste based on caret bounds', () => {
    jest.useFakeTimers();
    try {
      render(<MessageInput />);
      const input = screen.getByRole('textbox');
      Object.defineProperty(input, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ top: 0, bottom: 100 }),
      });
      Object.defineProperty(input, 'scrollHeight', { configurable: true, value: 300 });
      Object.defineProperty(input, 'clientHeight', { configurable: true, value: 50 });
      input.textContent = 'paste target';
      const range = placeCaretInTextNode(input);
      range.getBoundingClientRect = jest.fn(() => ({ top: 190, bottom: 200 }));

      fireEvent.paste(input, {
        clipboardData: {
          getData: jest.fn((type) => (type === 'text' ? 'down' : '')),
        },
      });
      jest.runOnlyPendingTimers();
      expect(input.scrollTop).toBe(100);

      range.getBoundingClientRect = jest.fn(() => ({ top: -20, bottom: -10 }));
      fireEvent.paste(input, {
        clipboardData: {
          getData: jest.fn((type) => (type === 'text' ? 'up' : '')),
        },
      });
      jest.runOnlyPendingTimers();
      expect(input.scrollTop).toBe(80);
    } finally {
      jest.useRealTimers();
    }
  });
});

describe('MessageInput error handling', () => {
  beforeEach(() => {
    const stateContextValue = {
      state: {
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
      }
    };
    const localeContextValue = {
      stringSet: {},
    };

    useSendbird.mockReturnValue(stateContextValue);
    useLocalization.mockReturnValue(localeContextValue);

    renderHook(() => useSendbird());
    renderHook(() => useLocalization());
  });

  it('should call onSendMessageFailed when sendMessage throws an error by onKeyDown event', async () => {
    const mockErrorMessage = 'Send message failed';
    const onSendMessage = jest.fn(() => {
      throw new Error(mockErrorMessage);
    });
    const { state: { eventHandlers } } = useSendbird();
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
    const { state: { eventHandlers } } = useSendbird();
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
    const { state: { eventHandlers } } = useSendbird();
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
    const { state: { eventHandlers } } = useSendbird();
    const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });

    render(<MessageInput onFileUpload={onFileUpload} />);

    const fileInput = document.getElementsByClassName('sendbird-message-input--attach-input')[0];
  
    fireEvent.change(fileInput, { currentTarget: { files: [file] } });

    expect(onFileUpload).toThrow(mockErrorMessage);
    expect(eventHandlers.message.onFileUploadFailed).toHaveBeenCalled();
  });
});

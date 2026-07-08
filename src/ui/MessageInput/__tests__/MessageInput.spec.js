import React from 'react';
import { render, renderHook, screen,fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MessageInput from "../index";
import { useLocalization } from '../../../lib/LocalizationContext';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

const noop = () => {};

// to mock useSendbirdStateContext
vi.mock('../../../lib/Sendbird/context/hooks/useSendbird', async () => ({
  __esModule: true,
  default: vi.fn(),
  useSendbird: vi.fn(),
}));
vi.mock('../../../lib/LocalizationContext', async () => ({
  ...await vi.importActual('../../../lib/LocalizationContext'),
  useLocalization: vi.fn(),
}));

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
    const onSendMessage = vi.fn();
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
    const onSendMessage = vi.fn();
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
    const onSendMessage = vi.fn();
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
    const onSendMessage = vi.fn();
    render(<MessageInput onSendMessage={onSendMessage} />);

    const input = screen.getByRole('textbox');
    input.textContent = '\u200B';

    fireEvent.input(input);
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSendMessage).not.toHaveBeenCalled();
  });
  
  it('should render send icon if text is present', async() => {
    const onSendMessage = vi.fn();
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

  describe('typing indicator callbacks', () => {
    it('should call onStartTyping when input has text', () => {
      const onStartTyping = vi.fn();
      const onStopTyping = vi.fn();
      render(<MessageInput onSendMessage={noop} onStartTyping={onStartTyping} onStopTyping={onStopTyping} />);

      const input = screen.getByRole('textbox');
      input.textContent = 'hello';
      fireEvent.input(input);

      expect(onStartTyping).toHaveBeenCalled();
      expect(onStopTyping).not.toHaveBeenCalled();
    });

    it('should call onStopTyping when input becomes empty after typing', () => {
      const onStartTyping = vi.fn();
      const onStopTyping = vi.fn();
      render(<MessageInput onSendMessage={noop} onStartTyping={onStartTyping} onStopTyping={onStopTyping} />);

      const input = screen.getByRole('textbox');
      input.textContent = 'hello';
      fireEvent.input(input);
      input.textContent = '';
      fireEvent.input(input);

      expect(onStartTyping).toHaveBeenCalled();
      expect(onStopTyping).toHaveBeenCalledTimes(1);
    });

    it('should not call onStopTyping when input is empty without prior typing', () => {
      const onStartTyping = vi.fn();
      const onStopTyping = vi.fn();
      render(<MessageInput onSendMessage={noop} onStartTyping={onStartTyping} onStopTyping={onStopTyping} />);

      const input = screen.getByRole('textbox');
      input.textContent = '';
      fireEvent.input(input);
      fireEvent.input(input);

      expect(onStartTyping).not.toHaveBeenCalled();
      expect(onStopTyping).not.toHaveBeenCalled();
    });

    it('should call onStopTyping only once when backspacing repeatedly on empty input', () => {
      const onStartTyping = vi.fn();
      const onStopTyping = vi.fn();
      render(<MessageInput onSendMessage={noop} onStartTyping={onStartTyping} onStopTyping={onStopTyping} />);

      const input = screen.getByRole('textbox');
      input.textContent = 'hi';
      fireEvent.input(input);
      input.textContent = '';
      fireEvent.input(input);
      fireEvent.input(input);
      fireEvent.input(input);

      expect(onStopTyping).toHaveBeenCalledTimes(1);
    });

    it('should call onStopTyping when input becomes whitespace-only after typing', () => {
      const onStartTyping = vi.fn();
      const onStopTyping = vi.fn();
      render(<MessageInput onSendMessage={noop} onStartTyping={onStartTyping} onStopTyping={onStopTyping} />);

      const input = screen.getByRole('textbox');
      input.textContent = 'hello';
      fireEvent.input(input);
      input.textContent = '   ';
      fireEvent.input(input);

      expect(onStopTyping).toHaveBeenCalledTimes(1);
    });

    it('should not call onStartTyping when input contains only whitespace', () => {
      const onStartTyping = vi.fn();
      const onStopTyping = vi.fn();
      render(<MessageInput onSendMessage={noop} onStartTyping={onStartTyping} onStopTyping={onStopTyping} />);

      const input = screen.getByRole('textbox');
      input.textContent = '   ';
      fireEvent.input(input);

      expect(onStartTyping).not.toHaveBeenCalled();
      expect(onStopTyping).not.toHaveBeenCalled();
    });
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
            onSendMessageFailed: vi.fn(),
            onUpdateMessageFailed: vi.fn(),
            onFileUploadFailed: vi.fn(),
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
    const onSendMessage = vi.fn(() => {
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
    const onSendMessage = vi.fn(() => {
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
    const onUpdateMessage = vi.fn(() => {
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
    const onFileUpload = vi.fn(() => {
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

describe('MessageInput sendMessage (CLNP-6501)', () => {
  beforeEach(() => {
    const stateContextValue = {
      state: {
        config: {
          groupChannel: {
            enableDocument: true,
          },
        },
      },
    };
    const localeContextValue = {
      stringSet: {},
    };

    useSendbird.mockReturnValue(stateContextValue);
    useLocalization.mockReturnValue(localeContextValue);

    renderHook(() => useSendbird());
    renderHook(() => useLocalization());
  });

  // Cross-platform consumers (iOS/Android/SDK) receive the raw `message` field, so we
  // intentionally do NOT sanitize at send time. Display-side rendering escapes angle
  // brackets via React JSX. These tests pin the raw passthrough behavior.
  it('should keep message field raw on send (display layer escapes)', () => {
    const onSendMessage = vi.fn();

    render(<MessageInput onSendMessage={onSendMessage} />);

    const input = screen.getByRole('textbox');
    input.textContent = 'Hi <b>bold</b>';
    fireEvent.input(input);

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSendMessage).toHaveBeenCalledTimes(1);
    const params = onSendMessage.mock.calls[0][0];
    expect(params.message).toBe('Hi <b>bold</b>');
    // No mention -> mentionTemplate stays empty.
    expect(params.mentionTemplate).toBe('');
  });

  it('should keep XSS-like payload raw in message field on send (display layer escapes)', () => {
    const onSendMessage = vi.fn();

    render(<MessageInput onSendMessage={onSendMessage} />);

    const input = screen.getByRole('textbox');
    input.textContent = '<img src=x onerror=alert(1)>';
    fireEvent.input(input);

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSendMessage).toHaveBeenCalledTimes(1);
    const params = onSendMessage.mock.calls[0][0];
    expect(params.message).toBe('<img src=x onerror=alert(1)>');
  });
});

describe('MessageInput editMessage sanitization (CLNP-6501)', () => {
  beforeEach(() => {
    const stateContextValue = {
      state: {
        config: {
          groupChannel: {
            enableDocument: true,
          },
        },
      },
    };
    const localeContextValue = {
      stringSet: {},
    };

    useSendbird.mockReturnValue(stateContextValue);
    useLocalization.mockReturnValue(localeContextValue);

    renderHook(() => useSendbird());
    renderHook(() => useLocalization());
  });

  const clickSave = () => {
    const editButton = document.getElementsByClassName('sendbird-message-input--edit-action__save')[0];
    fireEvent.click(editButton);
  };

  it('should keep message raw and sanitize mentionTemplate when editing without mentions', () => {
    const onUpdateMessage = vi.fn();
    const messageId = 123;

    render(
      <MessageInput
        isEdit
        message={{ messageId }}
        onUpdateMessage={onUpdateMessage}
      />,
    );

    const input = screen.getByRole('textbox');
    input.textContent = 'Hi <b>bold</b>';
    fireEvent.input(input);

    clickSave();

    expect(onUpdateMessage).toHaveBeenCalledTimes(1);
    const params = onUpdateMessage.mock.calls[0][0];
    expect(params.messageId).toBe(messageId);
    // message stays raw — display layer handles escaping.
    expect(params.message).toBe('Hi <b>bold</b>');
    // mentionTemplate is sanitized so mention-aware consumers cannot inject HTML.
    expect(params.mentionTemplate).toBe('Hi &#60;b&#62;bold&#60;/b&#62;');
    expect(params.mentionedUserIds).toEqual([]);
  });

  it('should sanitize XSS payload in mentionTemplate even when isMentionedMessage is false', () => {
    // Reviewer-reported scenario: original message had a mention, user removes
    // the mention leaving only a raw HTML payload.
    const onUpdateMessage = vi.fn();
    const messageId = 456;

    render(
      <MessageInput
        isEdit
        message={{ messageId }}
        onUpdateMessage={onUpdateMessage}
        isMentionEnabled
      />,
    );

    const input = screen.getByRole('textbox');
    input.textContent = 'Hi <img src=x onerror=alert(1)>';
    fireEvent.input(input);

    clickSave();

    expect(onUpdateMessage).toHaveBeenCalledTimes(1);
    const params = onUpdateMessage.mock.calls[0][0];
    // message stays raw — display layer handles escaping.
    expect(params.message).toBe('Hi <img src=x onerror=alert(1)>');
    // mentionTemplate is sanitized so mention-aware consumers cannot inject HTML.
    expect(params.mentionTemplate).not.toContain('<');
    expect(params.mentionTemplate).not.toContain('>');
    expect(params.mentionTemplate).toBe('Hi &#60;img src=x onerror=alert(1)&#62;');
    expect(params.mentionedUserIds).toEqual([]);
  });

  it('should return an empty mentionedUserIds array when isMentionEnabled is false', () => {
    const onUpdateMessage = vi.fn();
    const messageId = 789;

    render(
      <MessageInput
        isEdit
        message={{ messageId }}
        onUpdateMessage={onUpdateMessage}
        // isMentionEnabled is intentionally omitted (defaults to false)
      />,
    );

    const input = screen.getByRole('textbox');
    input.textContent = 'plain text';
    fireEvent.input(input);

    clickSave();

    expect(onUpdateMessage).toHaveBeenCalledTimes(1);
    expect(onUpdateMessage.mock.calls[0][0].mentionedUserIds).toEqual([]);
  });
});


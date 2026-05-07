import { act, renderHook } from '@testing-library/react';

import { usePaste } from '..';

const member = {
  userId: 'u1',
  nickname: 'Alice',
};

const channel = {
  isGroupChannel: () => true,
  members: [member],
};

const createClipboardEvent = (data: Record<string, string>) => ({
  preventDefault: jest.fn(),
  clipboardData: {
    getData: jest.fn((type: string) => data[type] ?? ''),
  },
}) as any;

const setCaret = (node: HTMLElement) => {
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

describe('usePaste', () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'innerText', {
      configurable: true,
      get() {
        return this.textContent;
      },
      set(value) {
        this.textContent = value;
      },
    });
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    document.execCommand = jest.fn();
  });

  const setup = () => {
    const input = document.createElement('div');
    input.contentEditable = 'true';
    document.body.appendChild(input);
    setCaret(input);
    const setIsInput = jest.fn();
    const setMentionedUsers = jest.fn();
    const { result } = renderHook(() => usePaste({
      ref: { current: input },
      channel: channel as any,
      setIsInput,
      setMentionedUsers,
    }));
    return {
      input,
      setIsInput,
      setMentionedUsers,
      paste: result.current,
    };
  };

  it('pastes simple text and uri-list content at the caret', () => {
    const { input, setIsInput, paste } = setup();

    act(() => {
      paste(createClipboardEvent({ text: '<hello>' }));
    });

    expect(input.textContent).toContain('hello');
    expect(setIsInput).toHaveBeenCalledWith(true);

    act(() => {
      paste(createClipboardEvent({
        text: '',
        'text/uri-list': '# comment\nhttps://sendbird.com\n\nhttps://example.com',
      }));
    });

    expect(input.textContent).toContain('https://sendbird.com');
    expect(input.textContent).toContain('https://example.com');
    expect(input.textContent).not.toContain('comment');
  });

  it('pastes html without mentions as sanitized plain text', () => {
    const { input, setIsInput, paste } = setup();

    act(() => {
      paste(createClipboardEvent({
        'text/html': '<strong onclick="alert(1)">bold</strong>',
        text: 'bold',
      }));
    });

    expect(input.textContent).toContain('bold');
    expect(setIsInput).toHaveBeenCalledWith(true);
  });

  it('converts pasted mentions into mention templates', () => {
    const { setIsInput, setMentionedUsers, paste } = setup();

    act(() => {
      paste(createClipboardEvent({
        'text/html': '<span class="sendbird-word__mention" data-userid="u1">@Alice</span><span>hello</span>',
        text: '@Alice hello',
      }));
    });

    expect(setMentionedUsers).toHaveBeenCalledWith([member]);
    expect(document.execCommand).toHaveBeenCalledWith(
      'insertHTML',
      false,
      expect.stringContaining('data-userid="u1"'),
    );
    expect(setIsInput).toHaveBeenCalledWith(true);
  });
});

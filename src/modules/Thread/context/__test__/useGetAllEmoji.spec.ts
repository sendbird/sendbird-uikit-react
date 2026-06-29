import { renderHook } from '@testing-library/react';
import useGetAllEmoji from '../hooks/useGetAllEmoji';

vi.mock('../useThread', () => ({
  __esModule: true,
  default: () => ({
    actions: {
      setEmojiContainer: mockSetEmojiContainer,
    },
  }),
}));

const mockSetEmojiContainer = vi.fn();
const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
};

describe('useGetAllEmoji', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('doesnt call getAllEmoji when sdk is null', () => {
    renderHook(() => useGetAllEmoji(
      { sdk: null },
      { logger: mockLogger },
    ));

    expect(mockSetEmojiContainer).not.toHaveBeenCalled();
    expect(mockLogger.info).not.toHaveBeenCalled();
  });

  it('doesnt call getAllEmoji when sdk.getAllEmoji is undefined', () => {
    renderHook(() => useGetAllEmoji(
      { sdk: {} },
      { logger: mockLogger },
    ));

    expect(mockSetEmojiContainer).not.toHaveBeenCalled();
    expect(mockLogger.info).not.toHaveBeenCalled();
  });

  it('gets emoji container successfully', async () => {
    const mockEmojiContainer = {
      emojis: ['😀', '🤣', '🥰'],
    };
    const mockGetAllEmoji = vi.fn().mockResolvedValue(mockEmojiContainer);
    const mockSdk = {
      getAllEmoji: mockGetAllEmoji,
    };

    renderHook(() => useGetAllEmoji(
      { sdk: mockSdk },
      { logger: mockLogger },
    ));

    await new Promise(process.nextTick);

    expect(mockGetAllEmoji).toHaveBeenCalled();
    expect(mockSetEmojiContainer).toHaveBeenCalledWith(mockEmojiContainer);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Thread | useGetAllEmoji: Getting emojis succeeded.',
      mockEmojiContainer,
    );
  });
});

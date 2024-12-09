import { renderHook } from '@testing-library/react-hooks';
import useGetAllEmoji from '../hooks/useGetAllEmoji';

jest.mock('../useThread', () => ({
  __esModule: true,
  default: () => ({
    actions: {
      setEmojiContainer: mockSetEmojiContainer,
    },
  }),
}));

const mockSetEmojiContainer = jest.fn();
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
};

describe('useGetAllEmoji', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    const mockGetAllEmoji = jest.fn().mockResolvedValue(mockEmojiContainer);
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

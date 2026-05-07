import { EmojiManager } from '../emojiManager';

const emojiContainer = {
  emojiCategories: [
    {
      id: 1,
      emojis: [
        { key: 'smile', url: 'smile.png' },
        { key: 'heart', url: 'heart.png' },
      ],
    },
    {
      id: 2,
      emojis: [
        { key: 'thumbsup', url: 'thumbsup.png' },
      ],
    },
  ],
};

describe('EmojiManager', () => {
  it('loads emojis and returns arrays, maps, urls, and the raw container', async () => {
    const logger = { info: jest.fn(), warning: jest.fn() };
    const sdk = {
      getAllEmoji: jest.fn().mockResolvedValue(emojiContainer),
    };

    const manager = new EmojiManager({ sdk: sdk as any, logger: logger as any });
    await Promise.resolve();
    await Promise.resolve();

    expect(logger.info).toHaveBeenCalledWith('EmojiManager | Succeeded getting all emojis. ', emojiContainer);
    expect(manager.getAllEmojis('array')).toEqual([
      { key: 'smile', url: 'smile.png' },
      { key: 'heart', url: 'heart.png' },
      { key: 'thumbsup', url: 'thumbsup.png' },
    ]);
    expect(manager.getAllEmojis('arr')).toHaveLength(3);
    expect(manager.getAllEmojis('unknown')).toHaveLength(3);
    expect(manager.getAllEmojis('map')).toEqual(new Map([
      ['smile', 'smile.png'],
      ['heart', 'heart.png'],
      ['thumbsup', 'thumbsup.png'],
    ]));
    expect(manager.getEmojiUrl('heart')).toBe('heart.png');
    expect(manager.getEmojiUrl('missing')).toBe('');
    expect(manager.emojiContainer).toBe(emojiContainer);
  });

  it('logs a warning when emoji loading fails', async () => {
    const logger = { info: jest.fn(), warning: jest.fn() };
    const sdk = {
      getAllEmoji: jest.fn().mockRejectedValue(new Error('network')),
    };

    new EmojiManager({ sdk: sdk as any, logger: logger as any });
    await Promise.resolve();
    await Promise.resolve();

    expect(logger.warning).toHaveBeenCalledWith('EmojiManager | Failed getting all emojis.');
  });
});

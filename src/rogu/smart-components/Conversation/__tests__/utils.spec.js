import {
  pubSubHandler,
  pubSubHandleRemover,
  isDisabledBecauseFrozen,
  getEmojiCategoriesFromEmojiContainer,
  getAllEmojisFromEmojiContainer,
  getEmojisFromEmojiContainer,
  getAllEmojisMapFromEmojiContainer,
  getNicknamesMapFromMembers,
  isSameGroup,
  compareMessagesForGrouping,
} from '../utils';
import * as topics from '../../../../lib/pubSub/topics';
import pubsubFactory from '../../../../lib/pubSub';
import { frozenChannel } from '../dux/data.mock';

const subscribedTopics = [
  topics.SEND_USER_MESSAGE,
  topics.SEND_MESSAGE_START,
  topics.SEND_FILE_MESSAGE,
  topics.UPDATE_USER_MESSAGE,
  topics.DELETE_MESSAGE,
];

describe('PubSub', () => {
  it('should have all the required subscribers', () => {
    const pubsub = pubsubFactory();
    const mockChannelListDispatcher = () => {};
    const mockChannelUrl = 'xxx';
    const handler = pubSubHandler(mockChannelUrl, pubsub, mockChannelListDispatcher);
    subscribedTopics.forEach((t) => {
      expect(typeof handler.get(topics[t]).remove).toEqual('function');
    });
  });

  it('should have remove all subscribers', () => {
    const pubsub = pubsubFactory();
    const mockChannelListDispatcher = () => {};
    const mockChannelUrl = 'xxx';
    const handler = pubSubHandler(mockChannelUrl, pubsub, mockChannelListDispatcher);
    pubSubHandleRemover(handler);
    subscribedTopics.forEach((t) => {
      expect(pubsub.__getTopics()[t]).toEqual([undefined]);
    });
  });
});

describe('isDisabledBecauseFrozen', () => {
  it('should return true for non-frozen channel', () => {
    const normalChannel = {...frozenChannel, isFrozen: false };
    const isDisabled = isDisabledBecauseFrozen(normalChannel);
    expect(isDisabled).toEqual(false);
  });

  it('should return false for operator of frozen channel', () => {
    const isDisabled = isDisabledBecauseFrozen(frozenChannel);
    expect(isDisabled).toEqual(false);
  });

  it('should return true for non-operator of frozen channel', () => {
    const nonOperatorChannel = {...frozenChannel, myRole: 'user' };
    const isDisabled = isDisabledBecauseFrozen(nonOperatorChannel);
    expect(isDisabled).toEqual(true);
  });
});

const emojiContainer = {
  emojiCategories: [
    {
      id: 'category-id-1',
      emojis: [
        { key: 'emoji-key-00-00', url: '...', },
        { key: 'emoji-key-00-01', url: '...', },
        { key: 'emoji-key-00-02', url: '...', },
      ],
    },
    {
      id: 'category-id-2',
      emojis: [
        { key: 'emoji-key-01-00', url: '...', },
        { key: 'emoji-key-01-01', url: '...', },
        { key: 'emoji-key-01-02', url: '...', },
      ],
    },
    {
      id: 'category-id-3',
      emojis: [
        { key: 'emoji-key-02-00', url: '...', },
        { key: 'emoji-key-02-01', url: '...', },
        { key: 'emoji-key-02-02', url: '...', },
      ],
    },
  ],
};

describe('emojiContainer', () => {
  it('should return emojiCategories from emojiContainer', () => {
    expect(
      getEmojiCategoriesFromEmojiContainer(emojiContainer)
    ).toEqual(
      emojiContainer.emojiCategories
    );
  });

  it('should return allEmojis from emojiContainer', () => {
    const allEmojis = [
      { key: 'emoji-key-00-00', url: '...', },
      { key: 'emoji-key-00-01', url: '...', },
      { key: 'emoji-key-00-02', url: '...', },
      { key: 'emoji-key-01-00', url: '...', },
      { key: 'emoji-key-01-01', url: '...', },
      { key: 'emoji-key-01-02', url: '...', },
      { key: 'emoji-key-02-00', url: '...', },
      { key: 'emoji-key-02-01', url: '...', },
      { key: 'emoji-key-02-02', url: '...', },
    ];
    expect(
      getAllEmojisFromEmojiContainer(emojiContainer)
    ).toEqual(
      allEmojis
    );
  });

  it('should return emojis from emojiContainer', () => {
    const firstEmojis = [
      { key: 'emoji-key-00-00', url: '...', },
      { key: 'emoji-key-00-01', url: '...', },
      { key: 'emoji-key-00-02', url: '...', },
    ];
    const secondEmojis = [
      { key: 'emoji-key-01-00', url: '...', },
      { key: 'emoji-key-01-01', url: '...', },
      { key: 'emoji-key-01-02', url: '...', },
    ];
    const thirdEmojis  = [
      { key: 'emoji-key-02-00', url: '...', },
      { key: 'emoji-key-02-01', url: '...', },
      { key: 'emoji-key-02-02', url: '...', },
    ];

    expect(
      getEmojisFromEmojiContainer(emojiContainer, 'category-id-1')
    ).toEqual(
      firstEmojis
    );
    expect(
      getEmojisFromEmojiContainer(emojiContainer, 'category-id-2')
    ).toEqual(
      secondEmojis
    );
    expect(
      getEmojisFromEmojiContainer(emojiContainer, 'category-id-3')
    ).toEqual(
      thirdEmojis
    );
  });

  it('should return allEmojisMap from emojiContainer', () => {
    const allEmojisMap = new Map([
      ['emoji-key-00-00', '...'],
      ['emoji-key-00-01', '...'],
      ['emoji-key-00-02', '...'],
      ['emoji-key-01-00', '...'],
      ['emoji-key-01-01', '...'],
      ['emoji-key-01-02', '...'],
      ['emoji-key-02-00', '...'],
      ['emoji-key-02-01', '...'],
      ['emoji-key-02-02', '...'],
    ]);

    expect(
      getAllEmojisMapFromEmojiContainer(emojiContainer)
    ).toEqual(
      allEmojisMap
    );
  });

  it('should return nicknamesMap from members', () => {
    const members = [
      { userId: 'userid-00', nickname: 'User0' },
      { userId: 'userid-01', nickname: 'User1' },
      { userId: 'userid-02', nickname: 'User2' },
      { userId: 'userid-03', nickname: 'User3' },
    ];

    expect(
      getNicknamesMapFromMembers(members)
    ).toEqual(
      new Map([
        ['userid-00', 'User0'],
        ['userid-01', 'User1'],
        ['userid-02', 'User2'],
        ['userid-03', 'User3'],
      ])
    );
  });
});

describe('MessageGrouping', () => {
  const zero = 1598932800000;
  const one = 1598932860000;
  const two = 1598932920000;
  it('should compare for same sender and same minute', () => {
    expect(
      isSameGroup(
        {
          sender: {
            userId: 'hoon123',
          },
          createdAt: zero,
        },
        {
          sender: {
            userId: 'hoon123',
          },
          createdAt: zero,
        }
      )
    ).toEqual(true);
  });

  it('should compare for same sender and different minute', () => {
    expect(
      isSameGroup(
        {
          sender: {
            userId: 'hoon123',
          },
          createdAt: zero,
        },
        {
          sender: {
            userId: 'hoon123',
          },
          createdAt: one,
        }
      )
    ).toEqual(false);
  });

  it('should compare for different sender and same minute', () => {
    expect(
      isSameGroup(
        {
          sender: {
            userId: 'hoon123',
          },
          createdAt: zero,
        },
        {
          sender: {
            userId: 'sravan123',
          },
          createdAt: zero,
        }
      )
    ).toEqual(false);
  });

  it('should compare for different sender and different minute', () => {
    expect(
      isSameGroup(
        {
          sender: {
            userId: 'hoon123',
          },
          createdAt: zero,
        },
        {
          sender: {
            userId: 'sravan123',
          },
          createdAt: one,
        }
      )
    ).toEqual(false);
  });

  it('should compare messages A A A', () => {
    const [betweenPrevious1, betweenNext1] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
    );
    expect(betweenPrevious1).toEqual(true);
    expect(betweenNext1).toEqual(true);

    const [betweenPrevious2, betweenNext2] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
    );
    expect(betweenPrevious2).toEqual(true);
    expect(betweenNext2).toEqual(true);
  });

  it('should compare messages A A B', () => {
    // sendingStatus - B does not have sendingStatus
    const [betweenPrevious1, betweenNext1] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
    );
    expect(betweenPrevious1).toEqual(true);
    expect(betweenNext1).toEqual(false);

    // sendingStatus - A doesn't have sendingStatus
    const [betweenPrevious2, betweenNext2] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
    );
    expect(betweenPrevious2).toEqual(true);
    expect(betweenNext2).toEqual(false);

    // sendingStatus - B has different sendingStatus
    const [betweenPrevious3, betweenNext3] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'failed',
      },
    );
    expect(betweenPrevious3).toEqual(true);
    expect(betweenNext3).toEqual(false);

    // sender - different sender
    const [betweenPrevious4, betweenNext4] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'sravan123',
        },
        createdAt: zero,
      },
    );
    expect(betweenPrevious4).toEqual(true);
    expect(betweenNext4).toEqual(false);

    // sender - no sender B
    const [betweenPrevious5, betweenNext5] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        createdAt: zero,
      },
    );
    expect(betweenPrevious5).toEqual(true);
    expect(betweenNext5).toEqual(false);

    // sender - no sender A
    const [betweenPrevious6, betweenNext6] = compareMessagesForGrouping(
      {
        createdAt: zero,
      },
      {
        createdAt: zero,
      },
      {
        sender: {
          userId: 'sravan123',
        },
        createdAt: zero,
      },
    );
    expect(betweenPrevious6).toEqual(false); // when sender doesn't exist it is false
    expect(betweenNext6).toEqual(false);

    // createdAt - different ts
    const [betweenPrevious7, betweenNext7] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: one,
      },
    );
    expect(betweenPrevious7).toEqual(true);
    expect(betweenNext7).toEqual(false);
  });

  it('should compare messages A B C', () => {
    // sender - different sender
    const [bP1, bN1] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'sravan123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'chris123',
        },
        createdAt: zero,
      },
    );
    expect(bP1).toEqual(false);
    expect(bN1).toEqual(false);

    // sender - B has no sender
    const [bP2, bN2] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        createdAt: zero,
      },
      {
        sender: {
          userId: 'chris123',
        },
        createdAt: zero,
      },
    );
    expect(bP2).toEqual(false);
    expect(bN2).toEqual(false);

    // sendingStatus - different status
    const [bP3, bN3] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'failed',
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'pending',
      },
    );
    expect(bP3).toEqual(false);
    expect(bN3).toEqual(false);

    // sendingStatus - A doesn't have sendingStatus
    const [bP4, bN4] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
        sendingStatus: 'succeeded',
      },
    );
    expect(bP4).toEqual(false);
    expect(bN4).toEqual(false);

    // createdAt - different ts
    const [bP5, bN5] = compareMessagesForGrouping(
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: zero,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: one,
      },
      {
        sender: {
          userId: 'hoon123',
        },
        createdAt: two,
      },
    );
    expect(bP5).toEqual(false);
    expect(bN5).toEqual(false);
  });
});

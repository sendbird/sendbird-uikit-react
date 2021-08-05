import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Message from "../index";
import { generateNormalMessage } from '../messageDummyData.mock';
import useMemoizedMessageText from '../memoizedMessageText';

import { LabelColors } from '../../Label';
import { changeColorToClassName } from '../../Label/utils';
import { getOutgoingMessageStates } from '../../../utils';

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
jest.mock('date-fns/format', () => () => ('mock-date'));

const MessageStatusType = getOutgoingMessageStates();
let realUseContext;
let useContextMock;

describe('Message', () => {
  // Setup mock
  beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = () => ({
      disableUserProfile: false,
      renderUserProfile: null,
    });
  });

  // Cleanup mock
  afterEach(() => {
    React.useContext = realUseContext;
  });

  it.skip('should convert emojiContainer to emojiAllList and emojiAllMap', function () {
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    const userId = 'user-id';
    const className = 'class-name';
    const newDummyMessage = generateNormalMessage((message) => {
      message.reactions = [
        {
          key: '001-001',
          userIds: [
            'user-id-0',
            'user-id-1',
            'user-id-2',
          ],
        },
        {
          key: '001-002',
          userIds: [
            'user-id-3',
            'user-id-4',
            'user-id-5',
          ],
        },
      ];
      return message;
    });
    const emojiAllList = [
      {
        key: '001-001',
        url: 'virtual-url-001',
      },
      {
        key: '001-002',
        url: 'virtual-url-002',
      },
      {
        key: '001-003',
        url: 'virtual-url-003',
      },
    ];
    const emojiAllMap = new Map();
    emojiAllList.forEach((emoji) => {
      emojiAllMap.set(emoji.key, emoji.url);
    });
    const component = shallow(
      <Message
        userId={userId}
        className={className}
        message={newDummyMessage}
        status={MessageStatusType.SENT}
        useReaction
        emojiAllList={emojiAllList}
        emojiAllMap={emojiAllMap}
      />
    );
    expect(
      component.state('emojiAllList')
    ).toEqaul(
      newEmojiContainer.emojiCategories[0].emojis.length
    );
  });

  it('should have classname for handling CSS word-break', function () {
    const newDummyMessage = generateNormalMessage();
    const component = mount(
      <Message
        useReaction={false}
        message={newDummyMessage}
        status={MessageStatusType.SENT}
      />
    );

    expect(
      component.find('.sendbird-user-message__text-balloon__inner__text-place__text').exists()
    ).toEqual(true);
  });

  it('should push edited label at the end of the array for updated message', function () {
    const mockMessage = {
      message: 'one two three four five six seven',
      updatedAt: 10000000,
    };
    const text = 'sample-text';

    function App() {
      const MemoizedMessageText = useMemoizedMessageText({
        message: mockMessage.message,
        updatedAt: mockMessage.updatedAt,
        className: text,
      });
      return <MemoizedMessageText />
    }
    const component = mount(<App />);

    expect(
      component.find(`.${text}`).hostNodes().last().text()
    ).toEqual(' (edited) ');
    expect(
      component.find(`.${changeColorToClassName(LabelColors.ONCONTENT_2)}`).exists()
    ).toEqual(true);
  });

  it('should not push edited label at the end of the array for not updated message', function() {
    const mockMessage = {
      message: 'one two three four five six seven',
      updatedAt: 0,
    };
    const text = 'sample-text';

    function App() {
      const MemoizedMessageText = useMemoizedMessageText({
        message: mockMessage.message,
        updatedAt: mockMessage.updatedAt,
        className: text,
      });
      return <MemoizedMessageText />;
    }
    const component = mount(<App />);

    expect(
      component.find(`.${text}`).hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find(`.${changeColorToClassName(LabelColors.ONBACKGROUND_2)}`).exists()
    ).toEqual(false);
  });

  it('should display sender nickname, avatar and sent at - incoming', function () {
    const newDummyMessage = generateNormalMessage();
    const component = mount(
      <Message
        isByMe={false}
        useReaction
        message={newDummyMessage}
        status=""
      />
    );

    expect(
      component.find('.sendbird-user-message__sender-name').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-user-message__avatar').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-user-message__sent-at').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display sender nickname when chainTop - incoming', function () {
    const newDummyMessage = generateNormalMessage();
    const component = mount(
      <Message
        isByMe={false}
        useReaction
        message={newDummyMessage}
        status=""
        chainTop
      />
    );

    expect(
      component.find('.sendbird-user-message__sender-name').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-user-message__avatar').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-user-message__sent-at').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display sender avatar and sent at when chainBottom - incoming', function () {
    const newDummyMessage = generateNormalMessage();
    const component = mount(
      <Message
        isByMe={false}
        useReaction
        message={newDummyMessage}
        status=""
        chainBottom
      />
    );

    expect(
      component.find('.sendbird-user-message__sender-name').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-user-message__avatar').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-user-message__sent-at').hostNodes().exists()
    ).toEqual(false);
  });

  it('should not display sender nickname, avatar and sent at when chainTop and chainBottom - incoming', function () {
    const newDummyMessage = generateNormalMessage();
    const component = mount(
      <Message
        isByMe={false}
        useReaction
        message={newDummyMessage}
        status=""
        chainTop
        chainBottom
      />
    );

    expect(
      component.find('.sendbird-user-message__sender-name').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-user-message__avatar').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-user-message__sent-at').hostNodes().exists()
    ).toEqual(false);
  });

  it('should display message status - outgoing', function () {
    const newDummyMessage = generateNormalMessage();
    const component = mount(
      <Message
        isByMe
        useReaction
        message={newDummyMessage}
        status="READ"
      />
    );

    expect(
      component.find('.sendbird-user-message__status').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-message-status__text').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display message status when chainBottom - outgoing', function () {
    const newDummyMessage = generateNormalMessage();
    const component = mount(
      <Message
        isByMe
        useReaction
        message={newDummyMessage}
        status="READ"
        chainBottom
      />
    );

    expect(
      component.find('.sendbird-user-message__status').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-message-status__text').hostNodes().exists()
    ).toEqual(false);
  });

  it('should do a snapshot test of the Message DOM', function () {
    const userId = 'user-id';
    const newDummyMessage = generateNormalMessage((message) => {
      const messageReactions = [
        {
          key: '001-001',
          userIds: [
            'user-id',
            'user-id-1',
            'user-id-2',
          ],
        },
        {
          key: '001-002',
          userIds: [
            'user-id-1',
            'user-id-2',
          ],
        },
      ];
      message.reactions = messageReactions;
      return message;
    });

    const emojiAllList = [
      {
        key: '001-001',
        url: 'virtual-url-001',
      },
      {
        key: '001-002',
        url: 'virtual-url-002',
      },
      {
        key: '001-003',
        url: 'virtual-url-003',
      },
    ];
    const emojiAllMap = new Map();
    emojiAllList.forEach((emoji) => {
      emojiAllMap.set(emoji.key, emoji.url);
    });

    const component = renderer.create(
      <Message
        userId={userId}
        message={newDummyMessage}
        status={MessageStatusType.SENT}
        useReaction
        emojiAllList={emojiAllList}
        emojiAllMap={emojiAllMap}
      />,
    );
    expect(
      component.toJSON()
    ).toMatchSnapshot();
  });
});

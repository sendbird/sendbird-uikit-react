import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import EmojiReactions from "../index";
import EmojiContainerMock, { generateNormalMessage } from '../mockData.mock';

const { emojiCategories } = EmojiContainerMock;
const message = generateNormalMessage((message) => {
  message.reactions = [
    {
      key: '001-001',
      userIds: [
        'userid',
        'userid-1',
        'userid-2',
      ],
    },
  ];
  return message;
});
const emojiMap = new Map();
for (let i = 0; i < emojiCategories.length; i++) {
  const emojis = emojiCategories[i].emojis;
  for (let j = 0; j < emojis.length; j++) {
    emojiMap.set(emojis[j].key, emojis[j].url);
  }
}
const membersMap = new Map([
  ['userid', 'First user'],
  ['userid-1', 'Second user'],
]);

describe('EmojiReactions', () => {
  it('should render list of reacted users', function () {
    const component = mount(
      <EmojiReactions
        userId="unkown-userid"
        message={message}
        emojiAllMap={emojiMap}
        membersMap={membersMap}
      />
    );

    expect(
      component.find('.sendbird-reaction-badge').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-reaction-badge--selected').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-tooltip').exists()
    ).toBe(false);

    component.find('.sendbird-reaction-badge').simulate('mouseover');

    expect(
      component.find('.sendbird-tooltip').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-tooltip').text()
    ).toEqual('First user, Second user, (no name)'); // should changed to be nicknames not userIds
  });

  it('should render list of reacted users and self', function () {
    const component = mount(
      <EmojiReactions
        userId="userid-1"
        message={message}
        emojiAllMap={emojiMap}
        membersMap={membersMap}
      />
    );

    expect(
      component.find('.sendbird-reaction-badge').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-reaction-badge--selected').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-tooltip').exists()
    ).toBe(false);

    component.find('.sendbird-reaction-badge--selected').simulate('mouseover');

    expect(
      component.find('.sendbird-tooltip').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-tooltip').text()
    ).toEqual('First user, (no name), and you'); // should changed to be nicknames not userIds
  });

  it('should do a snapshot test of the EmojiReactions DOM', function () {
    const className = "example-text";
    const userId = 'userid';

    const component = renderer.create(
      <EmojiReactions
        className={className}
        userId={userId}
        message={message}
        emojiAllMap={emojiMap}
        membersMap={membersMap}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

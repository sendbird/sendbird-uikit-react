import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import SuggestedUserMentionItem from '../SuggestedUserMentionItem';
import { fetchMembersFromChannel, fetchMembersFromQuery } from '../utils';

const members = [
  { userId: 'me', nickname: 'Me', isActive: true },
  { userId: 'alice', nickname: 'Alice', profileUrl: 'alice.png', isActive: true },
  { userId: 'alex', nickname: 'Alex', isActive: true },
  { userId: 'inactive', nickname: 'Alina', isActive: false },
  { userId: 'bob', nickname: 'Bob', isActive: true },
];

describe('SuggestedMentionList', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders the default mention item and fires pointer callbacks', () => {
    const onClick = jest.fn();
    const onMouseOver = jest.fn();
    const onMouseMove = jest.fn();
    const parent = document.createElement('div');
    parent.scrollTop = 0;
    Object.defineProperty(parent, 'clientHeight', { configurable: true, value: 10 });

    render(
      <LocalizationContext.Provider value={{ stringSet: { MENTION_NAME__NO_NAME: 'No name' } } as any}>
        <SuggestedUserMentionItem
          member={members[1] as any}
          isFocused
          parentScrollRef={{ current: parent }}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onMouseMove={onMouseMove}
        />
      </LocalizationContext.Provider>,
    );

    expect(screen.getByTestId('sendbird-mention-suggest-list__user-item__nickname')).toHaveTextContent('Alice');
    expect(screen.getByTestId('sendbird-mention-suggest-list__user-item__user-id')).toHaveTextContent('alice');
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });

    const item = document.querySelector('.sendbird-mention-suggest-list__user-item') as HTMLElement;
    fireEvent.mouseOver(item);
    fireEvent.mouseMove(item);
    fireEvent.click(item);

    expect(onMouseOver).toHaveBeenCalledWith(expect.objectContaining({ member: members[1] }));
    expect(onMouseMove).toHaveBeenCalledWith(expect.objectContaining({ member: members[1] }));
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ member: members[1] }));
  });

  it('renders fallback names and custom mention items', () => {
    const onClick = jest.fn();
    const { rerender } = render(
      <LocalizationContext.Provider value={{ stringSet: { MENTION_NAME__NO_NAME: 'No name' } } as any}>
        <SuggestedUserMentionItem member={{ userId: 'unknown', nickname: '' } as any} />
      </LocalizationContext.Provider>,
    );

    expect(screen.getByTestId('sendbird-mention-suggest-list__user-item__nickname')).toHaveTextContent('No name');

    rerender(
      <LocalizationContext.Provider value={{ stringSet: { MENTION_NAME__NO_NAME: 'No name' } } as any}>
        <SuggestedUserMentionItem
          member={members[2] as any}
          onClick={onClick}
          renderUserMentionItem={({ user }) => <span>custom {user.userId}</span>}
        />
      </LocalizationContext.Provider>,
    );

    fireEvent.click(screen.getByText('custom alex'));
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ member: members[2] }));
  });

  it('fetches mention candidates from channel members and member queries', async () => {
    const channel = {
      members: [...members],
      createMemberListQuery: jest.fn(() => ({
        next: jest.fn().mockResolvedValue([members[0], members[1], members[2]]),
      })),
    };

    await expect(fetchMembersFromChannel('me', channel as any, 2, 'Al')).resolves.toEqual([members[2], members[1]]);
    await expect(fetchMembersFromQuery('me', channel as any, 2, 'Al')).resolves.toEqual([members[1], members[2]]);
    expect(channel.createMemberListQuery).toHaveBeenCalledWith({
      limit: 3,
      nicknameStartsWithFilter: 'Al',
    });
  });
});

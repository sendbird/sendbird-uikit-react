import React from 'react';
import { render, renderHook, screen } from '@testing-library/react';

import UserListItem from "../index";
import { SendbirdContext } from '../../../lib/Sendbird/context/SendbirdContext';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
  useSendbird: jest.fn(),
}));

const getUserList = () => [
  {
    userId: 'userid-1',
    nickname: 'Topy',
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    userId: 'userid-2',
    nickname: 'Middly',
    profileUrl: 'https://static.sendbird.com/sample/user_sdk/user_sdk_01.png',
  },
  {
    userId: 'userid-3',
    nickname: 'Bottomy',
    profileUrl: 'https://static.sendbird.com/sample/user_sdk/user_sdk_14.png',
  },
];

describe('ui/UserListItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const stateContextValue = {
      state: {
        config: {},
        stores: {},
      },
    };
    useSendbird.mockReturnValue(stateContextValue);
    renderHook(() => useSendbird());
  });

  it('should render text prop', function () {
    const [user1] = getUserList();
    render(
      <SendbirdContext.Provider value={{ config: { userId: '' } }}>
        <UserListItem user={user1} />
      </SendbirdContext.Provider>
    );

    expect(screen.getByText(user1.nickname)).toBeInTheDocument();
  });

  it('should do a snapshot test of the UserListItem DOM', function () {
    const [user1] = getUserList();
    const { asFragment } = render(
      <SendbirdContext.Provider value={{ config: { userId: '' } }}>
        <UserListItem
          user={user1}
          checkBox
          checked={true}
          onChange={() => { }}
        />
      </SendbirdContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

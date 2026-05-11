import React from 'react';
import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';

import { LocalizationContext } from '../../../../../../lib/LocalizationContext';
import useChannelSettings from '../../../../context/useChannelSettings';
import { useMenuItems } from '../useMenuItems';

jest.mock('../../../../context/useChannelSettings', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../ModerationPanel/OperatorList', () => (props: any) => <div data-testid="operators">{String(!!props.renderUserListItem)}</div>);
jest.mock('../../../ModerationPanel/MemberList', () => (props: any) => <div data-testid="members">{String(!!props.renderUserListItem)}</div>);
jest.mock('../../../ModerationPanel/BannedUserList', () => (props: any) => <div data-testid="banned">{String(!!props.renderUserListItem)}</div>);
jest.mock('../../../ModerationPanel/MutedMemberList', () => (props: any) => <div data-testid="muted">{String(!!props.renderUserListItem)}</div>);
jest.mock('../../MenuItem', () => ({
  MenuItemAction: (props: any) => <button type="button" data-testid="menu-action" onClick={props.onClick}>action</button>,
}));

const stringSet = {
  CHANNEL_SETTING__OPERATORS__TITLE: 'Operators',
  CHANNEL_SETTING__MEMBERS__TITLE: 'Members',
  CHANNEL_SETTING__MUTED_MEMBERS__TITLE: 'Muted',
  CHANNEL_SETTING__BANNED_MEMBERS__TITLE: 'Banned',
  CHANNEL_SETTING__FREEZE_CHANNEL: 'Freeze',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationContext.Provider value={{ stringSet } as any}>
    {children}
  </LocalizationContext.Provider>
);

describe('useMenuItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds operator and non-operator menu items and formats member counts', () => {
    const channel = {
      url: 'channel-url',
      isFrozen: false,
      isBroadcast: true,
      memberCount: 1530,
      freeze: jest.fn().mockResolvedValue(undefined),
      unfreeze: jest.fn().mockResolvedValue(undefined),
    };
    (useChannelSettings as jest.Mock).mockReturnValue({
      state: {
        channel,
        renderUserListItem: jest.fn(),
      },
    });

    const { result } = renderHook(() => useMenuItems(), { wrapper });

    expect(result.current.operator.operators.label.children).toBe('Operators');
    expect(result.current.operator.freezeChannel.hideMenu).toBe(true);
    expect(result.current.operator.mutedUsers.hideMenu).toBe(true);
    expect(result.current.nonOperator.allUsers.label.children).toBe('Members');

    render(<>{result.current.operator.allUsers.rightComponent?.({ onClick: jest.fn() } as any)}</>);
    expect(screen.getByText('1.5K')).toBeInTheDocument();
    expect(screen.getByTestId('menu-action')).toBeInTheDocument();

    render(<>{result.current.operator.operators.accordionComponent?.()}</>);
    expect(screen.getByTestId('operators')).toHaveTextContent('true');
  });

  it('freezes and unfreezes channels from the toggle', async () => {
    const channel = {
      url: 'channel-url',
      isFrozen: false,
      memberCount: 2,
      freeze: jest.fn().mockResolvedValue(undefined),
      unfreeze: jest.fn().mockResolvedValue(undefined),
    };
    (useChannelSettings as jest.Mock).mockReturnValue({
      state: {
        channel,
        renderUserListItem: undefined,
      },
    });

    const { result, rerender } = renderHook(() => useMenuItems(), { wrapper });
    const { rerender: rerenderToggle } = render(<>{result.current.operator.freezeChannel.rightComponent?.({} as any)}</>);

    fireEvent.click(document.querySelector('.sendbird-ui-toggle input') as Element);
    await waitFor(() => {
      expect(channel.freeze).toHaveBeenCalled();
    });

    rerender();
    rerenderToggle(<>{result.current.operator.freezeChannel.rightComponent?.({} as any)}</>);
    fireEvent.click(document.querySelector('.sendbird-ui-toggle input') as Element);
    await waitFor(() => {
      expect(channel.unfreeze).toHaveBeenCalled();
    });
  });
});

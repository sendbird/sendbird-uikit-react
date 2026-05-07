import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { MuteMenuItem } from '../items/MuteMenuItem';
import { OperatorMenuItem } from '../items/OperatorMenuItem';

jest.mock('..', () => ({
  MenuItem: (props: any) => (
    <button type="button" data-testid={props.testID} disabled={props.disable} onClick={props.onClick}>
      {props.children}
    </button>
  ),
}));

describe('ContextMenu item actions', () => {
  it('mutes and unmutes users, reporting success and errors', async () => {
    const user = { userId: 'user-a', isMuted: false };
    const channel = {
      muteUser: jest.fn().mockResolvedValue(undefined),
      unmuteUser: jest.fn().mockRejectedValue(new Error('unmute failed')),
    };
    const onChange = jest.fn();
    const onError = jest.fn();

    render(
      <MuteMenuItem
        channel={channel as any}
        user={user as any}
        testID="mute"
        onChange={onChange}
        onError={onError}
      >
        mute
      </MuteMenuItem>,
    );

    fireEvent.click(screen.getByTestId('mute'));
    await waitFor(() => {
      expect(channel.muteUser).toHaveBeenCalledWith(user);
      expect(onChange).toHaveBeenCalledWith(channel, user, true);
    });

    fireEvent.click(screen.getByTestId('mute'));
    await waitFor(() => {
      expect(channel.unmuteUser).toHaveBeenCalledWith(user);
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('adds and removes operators, including member role initial state', async () => {
    const user = { userId: 'user-b', role: 'operator', isMuted: false };
    const channel = {
      addOperators: jest.fn().mockResolvedValue(undefined),
      removeOperators: jest.fn().mockResolvedValue(undefined),
    };
    const onChange = jest.fn();

    render(
      <OperatorMenuItem
        channel={channel as any}
        user={user as any}
        dataSbId="operator"
        onChange={onChange}
      >
        operator
      </OperatorMenuItem>,
    );

    fireEvent.click(screen.getByTestId('operator'));
    await waitFor(() => {
      expect(channel.removeOperators).toHaveBeenCalledWith(['user-b']);
      expect(onChange).toHaveBeenCalledWith(channel, user, false);
    });

    fireEvent.click(screen.getByTestId('operator'));
    await waitFor(() => {
      expect(channel.addOperators).toHaveBeenCalledWith(['user-b']);
      expect(onChange).toHaveBeenCalledWith(channel, user, true);
    });
  });

  it('reports operator action errors and honors disabled state', async () => {
    const user = { userId: 'user-c', role: 'none', isMuted: false };
    const channel = {
      addOperators: jest.fn().mockRejectedValue(new Error('add failed')),
      removeOperators: jest.fn(),
    };
    const onError = jest.fn();

    const { rerender } = render(
      <OperatorMenuItem channel={channel as any} user={user as any} testID="operator" onError={onError}>
        operator
      </OperatorMenuItem>,
    );
    fireEvent.click(screen.getByTestId('operator'));
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    rerender(
      <OperatorMenuItem channel={channel as any} user={user as any} testID="operator" disable>
        operator
      </OperatorMenuItem>,
    );
    expect(screen.getByTestId('operator')).toBeDisabled();
  });
});

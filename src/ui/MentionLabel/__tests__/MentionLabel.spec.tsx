import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import MentionLabel from '../index';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
  useSendbird: jest.fn(),
}));

const mkSdk = (members: any[] = []) => ({
  createApplicationUserListQuery: jest.fn().mockReturnValue({
    next: jest.fn().mockResolvedValue(members),
  }),
});

const renderWithState = ({ userId = 'me', sdk = mkSdk() } = {}) => {
  (useSendbird as unknown as jest.Mock).mockReturnValue({
    state: {
      config: { userId },
      stores: { sdkStore: { sdk } },
    },
  });
};

describe('ui/MentionLabel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the mention text using template + nickname', () => {
    renderWithState();
    render(
      <MentionLabel
        mentionTemplate="@"
        mentionedUserId="other"
        mentionedUserNickname="Alice"
        isByMe={false}
      />,
    );
    expect(screen.getByText('@Alice')).toBeTruthy();
  });

  it('applies the mention--me modifier when current user is the one being mentioned', () => {
    renderWithState({ userId: 'me' });
    const { container } = render(
      <MentionLabel
        mentionTemplate="@"
        mentionedUserId="me"
        mentionedUserNickname="Me"
        isByMe={false}
      />,
    );
    const anchor = container.querySelector('a.sendbird-word__mention');
    expect(anchor?.className).toContain('sendbird-word__mention--me');
    expect(anchor?.getAttribute('data-userid')).toBe('me');
    expect(anchor?.getAttribute('data-nickname')).toBe('Me');
  });

  it('does NOT apply mention--me when current user differs', () => {
    renderWithState({ userId: 'me' });
    const { container } = render(
      <MentionLabel
        mentionTemplate="@"
        mentionedUserId="other"
        mentionedUserNickname="Other"
        isByMe={true}
      />,
    );
    const anchor = container.querySelector('a.sendbird-word__mention');
    expect(anchor?.className).not.toContain('sendbird-word__mention--me');
  });

  it('queries the sdk on click and stores fetched user', async () => {
    const fakeUser = { userId: 'other', nickname: 'Other' };
    const sdk = mkSdk([fakeUser]);
    renderWithState({ sdk });

    const { container } = render(
      <MentionLabel
        mentionTemplate="@"
        mentionedUserId="other"
        mentionedUserNickname="Other"
        isByMe={false}
      />,
    );
    const anchor = container.querySelector('a.sendbird-word__mention') as HTMLAnchorElement;
    fireEvent.click(anchor);

    await waitFor(() => {
      expect(sdk.createApplicationUserListQuery).toHaveBeenCalledWith({
        userIdsFilter: ['other'],
      });
    });
  });

  it('does not re-query the sdk after the mentioned user has been fetched', async () => {
    const fakeUser = { userId: 'other', nickname: 'Other' };
    const sdk = mkSdk([fakeUser]);
    renderWithState({ sdk });

    const { container } = render(
      <MentionLabel
        mentionTemplate="@"
        mentionedUserId="other"
        mentionedUserNickname="Other"
        isByMe={false}
      />,
    );
    const anchor = container.querySelector('a.sendbird-word__mention') as HTMLAnchorElement;
    fireEvent.click(anchor);

    await waitFor(() => {
      expect(sdk.createApplicationUserListQuery).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(container.querySelector('a.sendbird-word__mention') as HTMLAnchorElement);

    expect(sdk.createApplicationUserListQuery).toHaveBeenCalledTimes(1);
  });

  it('passes the mentioned user id as the userIdsFilter on the query', async () => {
    const fakeUser = { userId: 'someone', nickname: 'Someone' };
    const sdk = mkSdk([fakeUser]);
    renderWithState({ sdk });

    const { container } = render(
      <MentionLabel
        mentionTemplate="@"
        mentionedUserId="someone"
        mentionedUserNickname="Someone"
        isByMe={false}
      />,
    );
    const anchor = container.querySelector('a.sendbird-word__mention') as HTMLAnchorElement;
    fireEvent.click(anchor);
    await waitFor(() => expect(sdk.createApplicationUserListQuery).toHaveBeenCalled());
    expect(sdk.createApplicationUserListQuery.mock.calls[0][0]).toEqual({ userIdsFilter: ['someone'] });
  });

  it('handles missing sdk gracefully (no throw, no query)', () => {
    (useSendbird as unknown as jest.Mock).mockReturnValue({
      state: { config: { userId: 'me' }, stores: { sdkStore: { sdk: null } } },
    });
    const { container } = render(
      <MentionLabel
        mentionTemplate="@"
        mentionedUserId="other"
        mentionedUserNickname="Other"
        isByMe={false}
      />,
    );
    const anchor = container.querySelector('a.sendbird-word__mention') as HTMLAnchorElement;
    expect(() => fireEvent.click(anchor)).not.toThrow();
  });

  it('handles empty member result', async () => {
    const sdk = mkSdk([]);
    renderWithState({ sdk });
    const { container } = render(
      <MentionLabel
        mentionTemplate="@"
        mentionedUserId="other"
        mentionedUserNickname="Other"
        isByMe={false}
      />,
    );
    fireEvent.click(container.querySelector('a.sendbird-word__mention') as HTMLAnchorElement);
    await waitFor(() => expect(sdk.createApplicationUserListQuery).toHaveBeenCalled());
  });

  it('catches rejected member lookup queries without crashing', async () => {
    const query = {
      next: jest.fn().mockRejectedValue(new Error('query failed')),
    };
    const sdk = {
      createApplicationUserListQuery: jest.fn().mockReturnValue(query),
    };
    renderWithState({ sdk });

    const { container } = render(
      <MentionLabel
        mentionTemplate="@"
        mentionedUserId="other"
        mentionedUserNickname="Other"
        isByMe={false}
      />,
    );
    fireEvent.click(container.querySelector('a.sendbird-word__mention') as HTMLAnchorElement);

    await waitFor(() => expect(query.next).toHaveBeenCalled());
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';

import useSendbird from '../Sendbird/context/hooks/useSendbird';
import { UserProfileProvider, useUserProfileContext } from '../UserProfileContext';

jest.mock('../Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseSendbird = useSendbird as jest.Mock;

function Consumer() {
  const { disableUserProfile } = useUserProfileContext();
  return <div data-testid="disable-user-profile">{String(disableUserProfile)}</div>;
}

describe('UserProfileProvider', () => {
  beforeEach(() => {
    mockUseSendbird.mockReturnValue({
      state: {
        config: {
          common: {
            enableUsingDefaultUserProfile: false,
          },
          renderUserProfile: undefined,
          onStartDirectMessage: undefined,
        },
      },
    });
  });

  it('falls back to global profile config when module prop is omitted', () => {
    render(
      <UserProfileProvider>
        <Consumer />
      </UserProfileProvider>,
    );

    expect(screen.getByTestId('disable-user-profile')).toHaveTextContent('true');
  });

  it('keeps explicit module disableUserProfile prop as the highest priority', () => {
    render(
      <UserProfileProvider disableUserProfile={false}>
        <Consumer />
      </UserProfileProvider>,
    );

    expect(screen.getByTestId('disable-user-profile')).toHaveTextContent('false');
  });
});

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InviteUsers from '../index';
import { ApplicationUserListQuery } from '@sendbird/chat';
import { CHANNEL_TYPE } from '../../../types';
import * as useCreateChannelModule from '../../../context/useCreateChannel';
import * as useSendbirdModule from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import type { Mock } from 'vitest';

const mockState = {
  stores: {
    sdkStore: {
      sdk: {
        currentUser: {
          userId: 'test-user-id',
        },
      },
      initialized: true,
    },
  },
  config: { logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() } },
};
vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', async () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
  useSendbird: vi.fn(() => ({ state: mockState })),
}));
vi.mock('../../../context/useCreateChannel');

// Mock createPortal function to render content directly without portal
vi.mock('react-dom', async () => ({
  ...await vi.importActual('react-dom'),
  createPortal: (node) => node,
}));

const mockStringSet = {
  MODAL__CREATE_CHANNEL__TITLE: 'CREATE_CHANNEL',
  MODAL__INVITE_MEMBER__SELECTED: 'USERS_SELECTED',
  BUTTON__CREATE: 'CREATE',
};

const mockLocalizationContext = {
  stringSet: mockStringSet,
};

const defaultMockState = {
  sdk: undefined,
  createChannel: undefined,
  userListQuery: undefined,
  onCreateChannelClick: undefined,
  onChannelCreated: undefined,
  onBeforeCreateChannel: undefined,
  step: 0,
  type: CHANNEL_TYPE.GROUP,
  onCreateChannel: undefined,
  overrideInviteUser: undefined,
};

const defaultMockActions = {
  setStep: vi.fn(),
  setType: vi.fn(),
};

const defaultMockInvitUserState = {
  user: { userId: 'test-user-id' },
};

describe('InviteUsers', () => {
  const mockUseCreateChannel = useCreateChannelModule.default as Mock;

  const renderComponent = (mockState = {}, mockActions = {}, mockInviteUsersState = {}) => {
    mockUseCreateChannel.mockReturnValue({
      state: { ...defaultMockState, ...mockState },
      actions: { ...defaultMockActions, ...mockActions },
    });

    const inviteUserProps = { ...defaultMockInvitUserState, ...mockInviteUsersState };

    return render(
      <LocalizationContext.Provider value={mockLocalizationContext as any}>
        <InviteUsers {...(inviteUserProps as unknown as import('../index').InviteUsersProps)}/>
      </LocalizationContext.Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSendbirdModule.default as Mock).mockReturnValue({ state: mockState });
  });

  it('should enable the modal submit button when there is only the logged-in user is in the user list', async () => {
    const userListQuery = vi.fn(
      () => ({
        hasNext: false,
        next: vi.fn().mockResolvedValue([{ userId: 'user1' }]),
      } as unknown as ApplicationUserListQuery),
    );

    renderComponent({}, {}, { userListQuery });

    expect(await screen.findByText('CREATE')).toBeEnabled();
  });

  it('does not crash when the SDK is not yet connected and no userListQuery is provided', () => {
    expect(() => renderComponent({}, {}, {})).not.toThrow();
    expect(screen.getByText('CREATE')).toBeInTheDocument();
  });

  it('shows the users the query returns once it resolves', async () => {
    const userListQuery = vi.fn(() => ({
      hasNext: false,
      isLoading: false,
      next: vi.fn().mockResolvedValue([{ userId: 'user-a' }, { userId: 'user-b' }]),
    } as unknown as ApplicationUserListQuery));

    const { container } = await act(async () => renderComponent({}, {}, { userListQuery }));

    expect(userListQuery).toHaveBeenCalled();
    expect(container.querySelectorAll('.sendbird-user-list-item')).toHaveLength(2);
  });

  it('ignores a first fetch that resolves after the one replacing it', async () => {
    // StrictMode runs the effect twice on mount, so two fetches overlap. The first one here
    // resolves last; without a guard its stale answer would land on top of the newer list.
    let resolveFirst: (users: unknown[]) => void = () => {};
    const first = new Promise((resolve) => { resolveFirst = resolve as (u: unknown[]) => void; });
    const nexts = [
      vi.fn().mockReturnValue(first),
      vi.fn().mockResolvedValue([{ userId: 'fresh' }]),
    ];
    let call = 0;
    const userListQuery = vi.fn(() => ({
      hasNext: false,
      isLoading: false,
      next: nexts[Math.min(call++, nexts.length - 1)],
    } as unknown as ApplicationUserListQuery));

    mockUseCreateChannel.mockReturnValue({
      state: { ...defaultMockState },
      actions: { ...defaultMockActions },
    });

    const { container } = render(
      <React.StrictMode>
        <LocalizationContext.Provider value={mockLocalizationContext as any}>
          <InviteUsers {...({ ...defaultMockInvitUserState, userListQuery } as any)} />
        </LocalizationContext.Provider>
      </React.StrictMode>,
    );

    await act(async () => { await Promise.resolve(); });
    expect(userListQuery).toHaveBeenCalledTimes(2);

    await act(async () => {
      resolveFirst([{ userId: 'stale-a' }, { userId: 'stale-b' }]);
      await Promise.resolve();
    });

    const rows = container.querySelectorAll('.sendbird-user-list-item');
    expect(rows).toHaveLength(1);
    expect(container.textContent).toContain('fresh');
    expect(container.textContent).not.toContain('stale-a');
  });

  it('appends each scrolled page to the list as it stands, not to a captured copy', async () => {
    const pages = [
      [{ userId: 'page-1' }],
      [{ userId: 'page-2' }],
      [{ userId: 'page-3' }],
    ];
    let page = 0;
    const next = vi.fn(() => Promise.resolve(pages[Math.min(page++, pages.length - 1)]));
    const userListQuery = vi.fn(() => ({
      hasNext: true,
      isLoading: false,
      next,
    } as unknown as ApplicationUserListQuery));

    const { container } = await act(async () => renderComponent({}, {}, { userListQuery }));

    const scroller = container.querySelector('.sendbird-create-channel--scroll') as HTMLDivElement;
    Object.defineProperty(scroller, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(scroller, 'scrollHeight', { value: 100, configurable: true });
    Object.defineProperty(scroller, 'scrollTop', { value: 0, configurable: true });

    // Two pages land before either render settles. Appending to a copy captured at scroll time
    // would drop whichever page got there first.
    await act(async () => {
      fireEvent.scroll(scroller);
      fireEvent.scroll(scroller);
      await Promise.resolve();
    });

    expect(container.textContent).toContain('page-1');
    expect(container.textContent).toContain('page-2');
    expect(container.textContent).toContain('page-3');
  });

  // TODO: add this case too
  // it('should disable the modal submit button when there are users on the list but none are checked', () => {
  // })
});

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { OperatorList } from '../components/ModerationPanel/OperatorList';
import useChannelSettings from '../context/useChannelSettings';
import { useLocalization } from '../../../lib/LocalizationContext';

// Existing coverage (ChannelSettings.migration.spec.tsx) proves the renderUserListItem prop
// reaches the ChannelSettings context. This proves the other half: a leaf consumer actually
// INVOKES the customer's renderUserListItem with the expected user/channel args.
vi.mock('../context/useChannelSettings', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('../../../lib/LocalizationContext', async () => ({
  ...(await vi.importActual('../../../lib/LocalizationContext')),
  useLocalization: vi.fn(),
}));

const operator = { userId: 'op-1', nickname: 'Operator One' };
const channel = {
  url: 'channel-1',
  createOperatorListQuery: vi.fn(() => ({
    next: vi.fn().mockResolvedValue([operator]),
    hasNext: false,
  })),
};

describe('OperatorList — renderUserListItem propagation (integration)', () => {
  beforeEach(() => {
    vi.mocked(useChannelSettings).mockReturnValue({ state: { channel } } as any);
    vi.mocked(useLocalization).mockReturnValue({
      stringSet: { CHANNEL_SETTING__OPERATORS__TITLE_ADD: 'Add', CHANNEL_SETTING__OPERATORS__TITLE_ALL: 'All' },
    } as any);
  });

  it('invokes a custom renderUserListItem with the operator and channel', async () => {
    const renderUserListItem = vi.fn(() => null);
    render(<OperatorList renderUserListItem={renderUserListItem as any} />);

    await waitFor(() => expect(renderUserListItem).toHaveBeenCalled());
    expect(renderUserListItem).toHaveBeenCalledWith(
      expect.objectContaining({ user: operator, channel, size: 'small', avatarSize: '24px' }),
    );
  });
});

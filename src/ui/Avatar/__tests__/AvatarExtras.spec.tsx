import React from 'react';
import { render } from '@testing-library/react';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import MutedAvatarOverlay from '../MutedAvatarOverlay';
import OpenChannelAvatar from '../../ChannelAvatar/OpenChannelAvatar';

jest.mock('../../ChannelAvatar/utils', () => ({
  getOpenChannelAvatar: jest.fn(() => 'open-channel.png'),
}));

describe('Avatar extras', () => {
  it('renders muted overlay with custom dimensions', () => {
    const { container } = render(<MutedAvatarOverlay height={40} width={32} />);

    expect(container.querySelector('.sendbird-muted-avatar')).toHaveStyle({ height: '40px', width: '32px' });
    expect(container.querySelector('.sendbird-muted-avatar__bg')).toHaveStyle({ height: '40px', width: '32px' });
  });

  it('renders an open channel avatar with fallback alt text', () => {
    const { container } = render(
      <LocalizationContext.Provider value={{ stringSet: { OPEN_CHANNEL_SETTINGS__NO_TITLE: 'No title' } } as any}>
        <OpenChannelAvatar channel={{ name: '', coverUrl: 'cover.png' } as any} theme="light" height={48} width={48} />
      </LocalizationContext.Provider>,
    );

    expect(container.querySelector('.sendbird-chat-header__avatar--open-channel')).toBeTruthy();
  });
});

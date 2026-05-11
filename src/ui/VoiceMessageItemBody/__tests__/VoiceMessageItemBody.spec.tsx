import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import VoiceMessageItemBody from '..';
import { useVoicePlayer } from '../../../hooks/VoicePlayer/useVoicePlayer';
import { VOICE_PLAYER_STATUS } from '../../../hooks/VoicePlayer/dux/initialState';

jest.mock('../../../hooks/VoicePlayer/useVoicePlayer', () => ({
  useVoicePlayer: jest.fn(),
}));

const createMessage = (overrides = {}) => ({
  messageId: 100,
  url: 'https://example.com/audio.webm',
  type: 'audio/webm',
  metaArrays: [
    { key: 'KEY_VOICE_MESSAGE_DURATION', value: ['30'] },
  ],
  reactions: [],
  ...overrides,
});

describe('VoiceMessageItemBody', () => {
  const play = jest.fn();
  const pause = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useVoicePlayer as jest.Mock).mockReturnValue({
      play,
      pause,
      playbackTime: 5,
      duration: 30,
      playingStatus: VOICE_PLAYER_STATUS.IDLE,
    });
  });

  it('plays an idle voice message and uses reaction styling', () => {
    const { container } = render(
      <VoiceMessageItemBody
        className="custom-body"
        channelUrl="channel-url"
        isByMe
        isReactionEnabled
        message={createMessage({ reactions: [{ key: 'smile', userIds: ['me'] }] }) as any}
      />,
    );

    expect(useVoicePlayer).toHaveBeenCalledWith({
      channelUrl: 'channel-url',
      key: '100',
      audioFileUrl: 'https://example.com/audio.webm',
      audioFileMimeType: 'audio/webm',
    });
    expect(container.querySelector('.custom-body')).toBeTruthy();
    expect(container.querySelector('.is-reactions-contained')).toBeTruthy();

    fireEvent.click(container.querySelector('.sendbird-voice-message-item-body__status-button__button') as Element);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('renders loading and pause states', () => {
    (useVoicePlayer as jest.Mock).mockReturnValue({
      play,
      pause,
      playbackTime: 0,
      duration: 0,
      playingStatus: VOICE_PLAYER_STATUS.PREPARING,
    });
    const { container, rerender } = render(
      <VoiceMessageItemBody channelUrl="channel-url" message={createMessage({ metaArrays: undefined }) as any} />,
    );
    expect(container.querySelector('.sendbird-loader')).toBeTruthy();
    expect(container.querySelector('.is-reactions-contained')).toBeNull();

    (useVoicePlayer as jest.Mock).mockReturnValue({
      play,
      pause,
      playbackTime: 10,
      duration: 30,
      playingStatus: VOICE_PLAYER_STATUS.PLAYING,
    });
    rerender(<VoiceMessageItemBody channelUrl="channel-url" message={createMessage() as any} />);

    fireEvent.click(container.querySelector('.sendbird-voice-message-item-body__status-button__button') as Element);
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it('does not render NaN playback time when voice duration metadata is invalid', () => {
    (useVoicePlayer as jest.Mock).mockReturnValue({
      play,
      pause,
      playbackTime: 0,
      duration: 0,
      playingStatus: VOICE_PLAYER_STATUS.IDLE,
    });

    const { container } = render(
      <VoiceMessageItemBody
        channelUrl="channel-url"
        message={createMessage({
          metaArrays: [
            { key: 'KEY_VOICE_MESSAGE_DURATION', value: ['invalid'] },
          ],
        }) as any}
      />,
    );

    expect(container.textContent).toContain('00:00');
    expect(container.textContent).not.toContain('NaN');
  });
});

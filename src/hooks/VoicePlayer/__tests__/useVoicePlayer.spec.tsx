import React, { Suspense, startTransition, useState } from 'react';
import { act, render, renderHook } from '@testing-library/react';

import { VOICE_PLAYER_AUDIO_ID } from '../../../utils/consts';
import { VOICE_PLAYER_STATUS } from '../dux/initialState';
import { useVoicePlayer } from '../useVoicePlayer';

const mocks = vi.hoisted(() => ({
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  reset: vi.fn(),
  audioStorage: {} as Record<string, { playingStatus: string }>,
  currentGroupKey: '',
}));

vi.mock('../index', () => ({
  useVoicePlayerContext: () => ({
    play: mocks.play,
    pause: mocks.pause,
    stop: mocks.stop,
    reset: mocks.reset,
    voicePlayerStore: { audioStorage: mocks.audioStorage, currentGroupKey: mocks.currentGroupKey },
  }),
}));

vi.mock('../../VoiceRecorder', () => ({
  useVoiceRecorderContext: () => ({ isRecordable: false }),
}));

const CHANNEL_URL = 'sendbird_group_channel_1';
const OTHER_CHANNEL_URL = 'sendbird_group_channel_2';
const PLAYER_KEY = 'voice-player-key';
const GROUP_KEY = `${CHANNEL_URL}-${PLAYER_KEY}`;
const OTHER_GROUP_KEY = `${OTHER_CHANNEL_URL}-${PLAYER_KEY}`;
const AUDIO_FILE_URL = 'https://example.com/voice.mp3';

const markPlaying = (groupKey: string) => {
  mocks.audioStorage[groupKey] = { playingStatus: VOICE_PLAYER_STATUS.PLAYING };
};

const markPaused = (groupKey: string) => {
  mocks.audioStorage[groupKey] = { playingStatus: VOICE_PLAYER_STATUS.PAUSED };
};

let sharedAudio: HTMLAudioElement;
let sharedAudioPause: ReturnType<typeof vi.fn>;

const unmountAfterDiscardedTransition = () => {
  const pending = new Promise<void>(() => { /* never settles */ });

  const Probe = ({ channelUrl }: { channelUrl: string }) => {
    useVoicePlayer({ channelUrl, key: PLAYER_KEY, audioFileUrl: AUDIO_FILE_URL });
    if (channelUrl !== CHANNEL_URL) throw pending;
    return null;
  };

  let moveToOtherChannel = () => { /* assigned on render */ };
  const Host = () => {
    const [channelUrl, setChannelUrl] = useState(CHANNEL_URL);
    moveToOtherChannel = () => setChannelUrl(OTHER_CHANNEL_URL);
    return (
      <Suspense fallback={null}>
        <Probe channelUrl={channelUrl} />
      </Suspense>
    );
  };

  const { unmount } = render(<Host />);

  act(() => {
    startTransition(() => moveToOtherChannel());
  });

  unmount();
};

describe('useVoicePlayer unmount cleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mocks.audioStorage).forEach((key) => delete mocks.audioStorage[key]);
    mocks.currentGroupKey = '';
    sharedAudio = document.createElement('audio');
    sharedAudio.id = VOICE_PLAYER_AUDIO_ID;
    sharedAudioPause = vi.fn();
    sharedAudio.pause = sharedAudioPause;
    document.body.appendChild(sharedAudio);
  });

  afterEach(() => {
    sharedAudio.remove();
  });

  it('resets the played unit when the audio was already present on the first render', () => {
    markPlaying(GROUP_KEY);

    const { unmount } = renderHook(() => useVoicePlayer({
      channelUrl: CHANNEL_URL,
      key: PLAYER_KEY,
      audioFileUrl: AUDIO_FILE_URL,
    }));

    unmount();

    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
  });

  it('does not reset a unit that is idle', () => {
    const { unmount } = renderHook(() => useVoicePlayer({
      channelUrl: CHANNEL_URL,
      key: PLAYER_KEY,
      audioFileUrl: AUDIO_FILE_URL,
    }));

    unmount();

    expect(mocks.reset).not.toHaveBeenCalled();
  });

  it('resets the played unit when the audio only arrives after the first render', () => {
    markPlaying(GROUP_KEY);

    const { rerender, unmount } = renderHook(
      ({ audioFile }: { audioFile?: File }) => useVoicePlayer({
        channelUrl: CHANNEL_URL,
        key: PLAYER_KEY,
        audioFile,
      }),
      { initialProps: { audioFile: undefined } as { audioFile?: File } },
    );

    const recorded = new File(['voice'], 'voice.mp3', { type: 'audio/mp3' });
    rerender({ audioFile: recorded });

    unmount();

    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
  });

  it('resets the played unit even when the audio is cleared right before unmount', () => {
    markPlaying(GROUP_KEY);
    const recorded = new File(['voice'], 'voice.mp3', { type: 'audio/mp3' });
    const { rerender, unmount } = renderHook(
      ({ audioFile }: { audioFile?: File }) => useVoicePlayer({
        channelUrl: CHANNEL_URL,
        key: PLAYER_KEY,
        audioFile,
      }),
      { initialProps: { audioFile: recorded } as { audioFile?: File } },
    );

    rerender({ audioFile: undefined });

    unmount();

    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
  });

  it('pauses the shared audio element when this unit owns the playback', () => {
    mocks.currentGroupKey = GROUP_KEY;
    markPlaying(GROUP_KEY);

    const { unmount } = renderHook(() => useVoicePlayer({
      channelUrl: CHANNEL_URL,
      key: PLAYER_KEY,
      audioFileUrl: AUDIO_FILE_URL,
    }));

    unmount();

    expect(sharedAudioPause).toHaveBeenCalled();
  });

  it('leaves the shared audio element alone when another unit owns the playback', () => {
    mocks.currentGroupKey = OTHER_GROUP_KEY;
    markPaused(GROUP_KEY);

    const { unmount } = renderHook(() => useVoicePlayer({
      channelUrl: CHANNEL_URL,
      key: PLAYER_KEY,
      audioFileUrl: AUDIO_FILE_URL,
    }));

    unmount();

    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
    expect(sharedAudioPause).not.toHaveBeenCalled();
  });

  it('pauses the audio it started even after the group key changed', () => {
    mocks.currentGroupKey = GROUP_KEY;
    markPlaying(GROUP_KEY);

    const { rerender, unmount } = renderHook(
      ({ channelUrl }: { channelUrl: string }) => useVoicePlayer({
        channelUrl,
        key: PLAYER_KEY,
        audioFileUrl: AUDIO_FILE_URL,
      }),
      { initialProps: { channelUrl: CHANNEL_URL } },
    );

    rerender({ channelUrl: OTHER_CHANNEL_URL });

    unmount();

    expect(sharedAudioPause).toHaveBeenCalled();
  });

  it('resets the unit it started even after the group key changed', () => {
    mocks.currentGroupKey = GROUP_KEY;
    markPlaying(GROUP_KEY);

    const { rerender, unmount } = renderHook(
      ({ channelUrl }: { channelUrl: string }) => useVoicePlayer({
        channelUrl,
        key: PLAYER_KEY,
        audioFileUrl: AUDIO_FILE_URL,
      }),
      { initialProps: { channelUrl: CHANNEL_URL } },
    );

    rerender({ channelUrl: OTHER_CHANNEL_URL });

    unmount();

    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
  });

  it('ignores a render React discarded when deciding what to clean up', () => {
    markPaused(GROUP_KEY);
    markPlaying(OTHER_GROUP_KEY);
    mocks.currentGroupKey = OTHER_GROUP_KEY;

    unmountAfterDiscardedTransition();

    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
    expect(mocks.reset).not.toHaveBeenCalledWith(OTHER_GROUP_KEY);
  });

  it('resets a paused unit that a discarded render would have reported as idle', () => {
    markPaused(GROUP_KEY);
    mocks.currentGroupKey = OTHER_GROUP_KEY;

    unmountAfterDiscardedTransition();

    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
  });

  it('resets the unit that holds the element even when it reads idle', () => {
    mocks.currentGroupKey = GROUP_KEY;

    const { unmount } = renderHook(() => useVoicePlayer({
      channelUrl: CHANNEL_URL,
      key: PLAYER_KEY,
      audioFileUrl: AUDIO_FILE_URL,
    }));

    unmount();

    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
  });

  it('resets the unit of the latest group key when the channel changes before unmount', () => {
    const { rerender, unmount } = renderHook(
      ({ channelUrl }: { channelUrl: string }) => useVoicePlayer({
        channelUrl,
        key: PLAYER_KEY,
        audioFileUrl: AUDIO_FILE_URL,
      }),
      { initialProps: { channelUrl: CHANNEL_URL } },
    );

    markPlaying(OTHER_GROUP_KEY);
    rerender({ channelUrl: OTHER_CHANNEL_URL });

    unmount();

    expect(mocks.reset).toHaveBeenCalledWith(OTHER_GROUP_KEY);
    expect(mocks.reset).not.toHaveBeenCalledWith(GROUP_KEY);
  });
});

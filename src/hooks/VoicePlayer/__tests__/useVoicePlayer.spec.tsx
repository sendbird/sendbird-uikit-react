import React, { Suspense, startTransition, useState } from 'react';
import { act, render, renderHook } from '@testing-library/react';

import { VOICE_PLAYER_AUDIO_ID } from '../../../utils/consts';
import { VOICE_PLAYER_STATUS } from '../dux/initialState';
import { useVoicePlayer } from '../useVoicePlayer';
import { createMountRegistry, MountRegistry, MountRegistryProvider } from '../mountRegistry';

const mocks = vi.hoisted(() => ({
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  reset: vi.fn(),
  audioStorage: {} as Record<string, { playingStatus: string, playbackTime?: number, duration?: number }>,
}));

vi.mock('../index', () => ({
  useVoicePlayerContext: () => ({
    play: mocks.play,
    pause: mocks.pause,
    stop: mocks.stop,
    reset: mocks.reset,
    voicePlayerStore: { audioStorage: mocks.audioStorage },
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

// play() stamps the unit onto the element it creates, so this is how the element says who holds it
const markElementHeldBy = (groupKey: string) => {
  sharedAudio.dataset.sbGroupId = groupKey;
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

beforeEach(() => {
  vi.clearAllMocks();
  Object.keys(mocks.audioStorage).forEach((key) => delete mocks.audioStorage[key]);
  sharedAudio = document.createElement('audio');
  sharedAudio.id = VOICE_PLAYER_AUDIO_ID;
  sharedAudioPause = vi.fn();
  sharedAudio.pause = sharedAudioPause;
  document.body.appendChild(sharedAudio);
});

afterEach(() => {
  sharedAudio.remove();
});

describe('useVoicePlayer return values', () => {
  it('reports the playback position and duration in milliseconds', () => {
    mocks.audioStorage[GROUP_KEY] = {
      playingStatus: VOICE_PLAYER_STATUS.PAUSED,
      playbackTime: 0.5,
      duration: 1,
    };

    const { result } = renderHook(() => useVoicePlayer({
      channelUrl: CHANNEL_URL,
      key: PLAYER_KEY,
      audioFileUrl: AUDIO_FILE_URL,
    }));

    // the storage keeps seconds, copied straight off the audio element
    expect(result.current).toMatchObject({ playbackTime: 500, duration: 1000 });
  });
});

describe('useVoicePlayer unmount cleanup', () => {
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
    markElementHeldBy(GROUP_KEY);
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
    markElementHeldBy(OTHER_GROUP_KEY);
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
    markElementHeldBy(GROUP_KEY);
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
    markElementHeldBy(GROUP_KEY);
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
    markElementHeldBy(OTHER_GROUP_KEY);

    unmountAfterDiscardedTransition();

    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
    expect(mocks.reset).not.toHaveBeenCalledWith(OTHER_GROUP_KEY);
  });

  it('resets a paused unit that a discarded render would have reported as idle', () => {
    markPaused(GROUP_KEY);
    markElementHeldBy(OTHER_GROUP_KEY);

    unmountAfterDiscardedTransition();

    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
  });

  it('resets the unit that holds the element even when it reads idle', () => {
    markElementHeldBy(GROUP_KEY);

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

describe('useVoicePlayer cleanup when one message is on screen more than once', () => {
  let registry: MountRegistry;

  beforeEach(() => {
    registry = createMountRegistry();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MountRegistryProvider value={registry}>{children}</MountRegistryProvider>
  );

  const mountView = () => renderHook(() => useVoicePlayer({
    channelUrl: CHANNEL_URL,
    key: PLAYER_KEY,
    audioFileUrl: AUDIO_FILE_URL,
  }), { wrapper });

  it('leaves the playing audio alone while another view of the same message stays mounted', () => {
    markElementHeldBy(GROUP_KEY);
    markPlaying(GROUP_KEY);
    const channelView = mountView();
    const threadView = mountView();

    threadView.unmount();

    expect(sharedAudioPause).not.toHaveBeenCalled();
    expect(mocks.reset).not.toHaveBeenCalled();
    expect(channelView.result.current.playingStatus).toBe(VOICE_PLAYER_STATUS.PLAYING);
  });

  it('stops the audio once the last view of the message unmounts', () => {
    markElementHeldBy(GROUP_KEY);
    markPlaying(GROUP_KEY);
    const channelView = mountView();
    const threadView = mountView();

    threadView.unmount();
    channelView.unmount();

    expect(sharedAudioPause).toHaveBeenCalled();
    expect(mocks.reset).toHaveBeenCalledWith(GROUP_KEY);
  });

  it('leaves a paused unit alone while another view of the same message stays mounted', () => {
    markPaused(GROUP_KEY);
    const channelView = mountView();
    const threadView = mountView();

    threadView.unmount();

    expect(mocks.reset).not.toHaveBeenCalled();
    expect(channelView.result.current.playingStatus).toBe(VOICE_PLAYER_STATUS.PAUSED);
  });

  const VoiceMessageView = () => {
    useVoicePlayer({ channelUrl: CHANNEL_URL, key: PLAYER_KEY, audioFileUrl: AUDIO_FILE_URL });
    return null;
  };

  const Screen = ({ threadOpen }: { threadOpen: boolean }) => (
    <>
      <VoiceMessageView />
      {threadOpen && <VoiceMessageView />}
    </>
  );

  const openAndCloseThreadWhilePlaying = (strict: boolean) => {
    const treeWrapper = ({ children }: { children: React.ReactNode }) => {
      const tree = <MountRegistryProvider value={registry}>{children}</MountRegistryProvider>;
      return strict ? <React.StrictMode>{tree}</React.StrictMode> : tree;
    };

    const { rerender, unmount } = render(<Screen threadOpen={false} />, { wrapper: treeWrapper });

    markElementHeldBy(GROUP_KEY);
    markPlaying(GROUP_KEY);
    rerender(<Screen threadOpen={false} />);
    vi.clearAllMocks();

    rerender(<Screen threadOpen />);
    const onThreadOpened = { paused: sharedAudioPause.mock.calls.length, reset: mocks.reset.mock.calls.length };

    rerender(<Screen threadOpen={false} />);
    const onThreadClosed = { paused: sharedAudioPause.mock.calls.length, reset: mocks.reset.mock.calls.length };

    unmount();
    const onLeavingTheChannel = {
      paused: sharedAudioPause.mock.calls.length > 0,
      reset: mocks.reset.mock.calls.map(([groupKey]) => groupKey),
    };

    return { onThreadOpened, onThreadClosed, onLeavingTheChannel };
  };

  it('keeps playing through a thread opening and closing on the same message', () => {
    expect(openAndCloseThreadWhilePlaying(false)).toEqual({
      onThreadOpened: { paused: 0, reset: 0 },
      onThreadClosed: { paused: 0, reset: 0 },
      onLeavingTheChannel: { paused: true, reset: [GROUP_KEY] },
    });
  });

  it('keeps playing through the same sequence under StrictMode', () => {
    expect(openAndCloseThreadWhilePlaying(true)).toEqual({
      onThreadOpened: { paused: 0, reset: 0 },
      onThreadClosed: { paused: 0, reset: 0 },
      onLeavingTheChannel: { paused: true, reset: [GROUP_KEY] },
    });
  });
});

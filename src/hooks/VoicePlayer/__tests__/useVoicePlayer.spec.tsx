import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { VoicePlayerProvider } from '../index';
import { useVoicePlayer } from '../useVoicePlayer';
import { VOICE_PLAYER_STATUS } from '../dux/initialState';

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

let mockIsRecordable = false;

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: () => ({
    state: {
      config: { logger: mockLogger },
    },
  }),
}));

jest.mock('../../VoiceRecorder', () => ({
  __esModule: true,
  useVoiceRecorderContext: () => ({
    isRecordable: mockIsRecordable,
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <VoicePlayerProvider>
    <>{children}</>
  </VoicePlayerProvider>
);

describe('useVoicePlayer', () => {
  let audioElement: HTMLAudioElement;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsRecordable = false;
    URL.createObjectURL = jest.fn(() => 'blob:voice');
    global.Audio = jest.fn(() => {
      audioElement = document.createElement('audio') as HTMLAudioElement;
      audioElement.play = jest.fn(() => Promise.resolve()) as any;
      audioElement.pause = jest.fn();
      Object.defineProperty(audioElement, 'duration', { configurable: true, writable: true, value: 6 });
      Object.defineProperty(audioElement, 'currentTime', { configurable: true, writable: true, value: 2 });
      return audioElement;
    }) as any;
  });

  it('plays, pauses, stops, and exposes millisecond playback values', async () => {
    const audioFile = new File(['voice'], 'voice.webm', { type: 'audio/webm' });
    const { result, unmount } = renderHook(() => useVoicePlayer({
      key: 'message-id',
      channelUrl: 'channel-url',
      audioFile,
    }), { wrapper });

    expect(result.current.playingStatus).toBe(VOICE_PLAYER_STATUS.IDLE);
    expect(result.current.duration).toBe(1000000);

    act(() => {
      result.current.play();
    });

    await waitFor(() => expect(audioElement.play).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockLogger.info).toHaveBeenCalledWith(
      'VoicePlayer: Succeeded playing audio player.',
      expect.objectContaining({ groupKey: 'channel-url-message-id' }),
    ));

    act(() => {
      audioElement.onplaying?.({} as any);
    });
    await waitFor(() => expect(result.current.playingStatus).toBe(VOICE_PLAYER_STATUS.PLAYING));

    audioElement.currentTime = 2;
    act(() => {
      audioElement.ontimeupdate?.({} as any);
    });
    await waitFor(() => expect(result.current.playbackTime).toBe(2000));
    expect(result.current.duration).toBe(6000);

    act(() => {
      result.current.pause();
    });
    expect(audioElement.pause).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.stop('channel-url');
    });
    expect(audioElement.pause).toHaveBeenCalledTimes(2);

    unmount();
    expect(audioElement.pause).toHaveBeenCalledTimes(2);
  });

  it('does not start playback while voice recording is active', () => {
    mockIsRecordable = true;

    const { result } = renderHook(() => useVoicePlayer({
      key: 'message-id',
      channelUrl: 'channel-url',
      audioFile: new File(['voice'], 'voice.webm', { type: 'audio/webm' }),
    }), { wrapper });

    act(() => {
      result.current.play();
    });

    expect(global.Audio).not.toHaveBeenCalled();
  });
});

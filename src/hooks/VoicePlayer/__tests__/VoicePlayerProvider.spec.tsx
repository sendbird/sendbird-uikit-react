import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ALL, VoicePlayerProvider, useVoicePlayerContext } from '../index';
import { VOICE_PLAYER_AUDIO_ID, VOICE_PLAYER_ROOT_ID } from '../../../utils/consts';
import { VOICE_PLAYER_STATUS } from '../dux/initialState';

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: () => ({
    state: {
      config: { logger: mockLogger },
    },
  }),
}));

const TestComponent = () => {
  const { play, pause, stop, voicePlayerStore } = useVoicePlayerContext();
  const currentGroupKey = voicePlayerStore.currentGroupKey || 'none';
  const currentStatus = voicePlayerStore.audioStorage[currentGroupKey]?.playingStatus ?? 'none';

  return (
    <div>
      <button onClick={() => play({ groupKey: 'group-1', audioFile: new File(['voice'], 'voice.mp3') })}>play-file</button>
      <button onClick={() => play({ groupKey: 'group-2', audioFileUrl: 'https://example.com/voice.m4a', audioFileMimeType: 'audio/m4a' })}>play-url</button>
      <button onClick={() => play({ groupKey: 'group-error', audioFileUrl: 'https://example.com/error.m4a' })}>play-error</button>
      <button onClick={() => pause('group-1')}>pause-current</button>
      <button onClick={() => pause(ALL)}>pause-all</button>
      <button onClick={() => stop('group')}>stop-group</button>
      <div data-testid="current-group">{currentGroupKey}</div>
      <div data-testid="current-status">{currentStatus}</div>
    </div>
  );
};

describe('VoicePlayerProvider', () => {
  let audioElements: HTMLAudioElement[];

  beforeEach(() => {
    jest.clearAllMocks();
    audioElements = [];
    URL.createObjectURL = jest.fn(() => 'blob:voice');
    global.fetch = jest.fn(() => Promise.resolve({
      blob: () => Promise.resolve(new Blob(['voice'])),
    })) as any;
    global.Audio = jest.fn(() => {
      const audio = document.createElement('audio') as HTMLAudioElement;
      audio.play = jest.fn(() => Promise.resolve()) as any;
      audio.pause = jest.fn();
      Object.defineProperty(audio, 'duration', { configurable: true, writable: true, value: 10 });
      Object.defineProperty(audio, 'currentTime', { configurable: true, writable: true, value: 0 });
      audioElements.push(audio);
      return audio;
    }) as any;
  });

  it('warns when pausing without a current player', () => {
    render(
      <VoicePlayerProvider>
        <TestComponent />
      </VoicePlayerProvider>,
    );

    fireEvent.click(screen.getByText('pause-current'));

    expect(mockLogger.warning).toHaveBeenCalledWith('VoicePlayer: No currentPlayer to pause.');
  });

  it('plays an audio file and reacts to audio element events', async () => {
    render(
      <VoicePlayerProvider>
        <TestComponent />
      </VoicePlayerProvider>,
    );

    fireEvent.click(screen.getByText('play-file'));

    await waitFor(() => expect(screen.getByTestId('current-group')).toHaveTextContent('group-1'));
    expect(document.getElementById(VOICE_PLAYER_ROOT_ID)?.querySelector(`#${VOICE_PLAYER_AUDIO_ID}`)).toBeInTheDocument();
    expect(audioElements[0].play).toHaveBeenCalledTimes(1);

    await act(async () => {
      audioElements[0].onplaying?.({} as any);
    });
    expect(screen.getByTestId('current-status')).toHaveTextContent(VOICE_PLAYER_STATUS.PLAYING);

    audioElements[0].currentTime = 4;
    await act(async () => {
      audioElements[0].ontimeupdate?.({} as any);
    });

    fireEvent.click(screen.getByText('pause-current'));
    expect(audioElements[0].pause).toHaveBeenCalledTimes(1);

    await act(async () => {
      audioElements[0].onpause?.({} as any);
    });
    expect(screen.getByTestId('current-status')).toHaveTextContent(VOICE_PLAYER_STATUS.PAUSED);

    fireEvent.click(screen.getByText('pause-all'));
    fireEvent.click(screen.getByText('stop-group'));
    expect(audioElements[0].pause).toHaveBeenCalledTimes(3);

    await act(async () => {
      audioElements[0].onerror?.(new Event('error'));
    });
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('fetches an audio file from URL and creates a typed File', async () => {
    render(
      <VoicePlayerProvider>
        <TestComponent />
      </VoicePlayerProvider>,
    );

    fireEvent.click(screen.getByText('play-url'));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://example.com/voice.m4a'));
    await waitFor(() => expect(screen.getByTestId('current-group')).toHaveTextContent('group-2'));
    const createdFile = (URL.createObjectURL as jest.Mock).mock.calls[0][0] as File;
    expect(createdFile).toBeInstanceOf(File);
    expect(createdFile.name).toMatch(/voice/i);
    expect(createdFile.type).toEqual(expect.any(String));
    expect(mockLogger.info).toHaveBeenCalledWith('VoicePlayer: Get the audioFile from URL.');
  });

  it('resets an audio unit when URL loading fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('network failed'))) as any;

    render(
      <VoicePlayerProvider>
        <TestComponent />
      </VoicePlayerProvider>,
    );

    fireEvent.click(screen.getByText('play-error'));

    await waitFor(() => expect(mockLogger.warning).toHaveBeenCalledWith(
      'VoicePlayer: Failed loading audio file with URL.',
      expect.any(Error),
    ));
  });
});

import React from 'react';
import { act, render } from '@testing-library/react';

import { VoicePlayerProvider } from '../index';
import { useVoicePlayer } from '../useVoicePlayer';

vi.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: () => ({
    state: { config: { logger: { info: () => {}, warning: () => {}, error: () => {} } } },
  }),
}));

vi.mock('../../VoiceRecorder', () => ({
  useVoiceRecorderContext: () => ({ isRecordable: false }),
}));

const CHANNEL_URL = 'sendbird_group_channel_1';
const PLAYER_KEY = '12345';
const AUDIO_FILE_URL = 'https://example.com/voice.mp3';

const createdAudios: HTMLAudioElement[] = [];
let resolveDownload: (response: { blob: () => Promise<Blob> }) => void;
let play: () => void;

const VoiceMessageView = () => {
  const voicePlayer = useVoicePlayer({ channelUrl: CHANNEL_URL, key: PLAYER_KEY, audioFileUrl: AUDIO_FILE_URL });
  play = voicePlayer.play;
  return null;
};

const Screen = ({ views }: { views: number }) => (
  <VoicePlayerProvider>
    <>{Array.from({ length: views }, (_, index) => <VoiceMessageView key={index} />)}</>
  </VoicePlayerProvider>
);

const createObjectURL = URL.createObjectURL;

function FakeAudio() {
  const element = document.createElement('audio');
  element.play = vi.fn().mockResolvedValue(undefined);
  element.pause = vi.fn();
  createdAudios.push(element);
  return element;
}

beforeEach(() => {
  createdAudios.length = 0;
  vi.stubGlobal('Audio', FakeAudio);
  vi.stubGlobal('fetch', vi.fn(() => new Promise((resolve) => { resolveDownload = resolve; })));
  URL.createObjectURL = vi.fn(() => 'blob:voice');
});

afterEach(() => {
  vi.unstubAllGlobals();
  URL.createObjectURL = createObjectURL;
});

const finishDownload = async () => {
  resolveDownload({ blob: () => Promise.resolve(new Blob(['voice'])) });
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

const audioPlayer = () => createdAudios[0] as HTMLAudioElement & { pause: ReturnType<typeof vi.fn> };

describe('useVoicePlayer against the real provider', () => {
  it('pauses the audio when playback starts and the view leaves in the same batch', async () => {
    const { rerender } = render(<Screen views={1} />);
    act(() => { play(); });

    await act(async () => {
      await finishDownload();
      rerender(<Screen views={0} />);
    });

    expect(audioPlayer().pause).toHaveBeenCalled();
  });

  it('pauses the audio when the view leaves after playback has settled', async () => {
    const { rerender } = render(<Screen views={1} />);
    act(() => { play(); });
    await act(finishDownload);

    act(() => { rerender(<Screen views={0} />); });

    expect(audioPlayer().pause).toHaveBeenCalled();
  });

  it('leaves the audio alone until the last view of the message goes away', async () => {
    const { rerender } = render(<Screen views={2} />);
    act(() => { play(); });
    await act(finishDownload);

    act(() => { rerender(<Screen views={1} />); });
    expect(audioPlayer().pause).not.toHaveBeenCalled();

    act(() => { rerender(<Screen views={0} />); });
    expect(audioPlayer().pause).toHaveBeenCalled();
  });
});

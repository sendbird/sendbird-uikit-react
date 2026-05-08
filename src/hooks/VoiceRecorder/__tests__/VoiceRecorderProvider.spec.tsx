import React from 'react';
import { act, render, screen } from '@testing-library/react';

import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { VoiceRecorderProvider, useVoiceRecorderContext } from '..';
import { downsampleToWav, encodeMp3 } from '../WebAudioUtils';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../lib/LocalizationContext', () => ({
  useLocalization: () => ({
    stringSet: {
      VOICE_RECORDING_PERMISSION_DENIED: 'Microphone permission denied',
    },
  }),
}));

jest.mock('../../../ui/Modal', () => (props: any) => {
  const React = require('react');
  return React.createElement('div', {}, [
    React.createElement('div', { key: 'body' }, props.children),
    React.createElement('button', { key: 'close', type: 'button', onClick: props.onClose }, 'close'),
  ]);
});

jest.mock('../WebAudioUtils', () => ({
  downsampleToWav: jest.fn((_file, callback) => callback(new ArrayBuffer(8))),
  encodeMp3: jest.fn(() => [new Uint8Array([1, 2, 3])]),
}));

let latestRecorderContext: ReturnType<typeof useVoiceRecorderContext>;
let latestMediaRecorder: any;
const trackStop = jest.fn();

const Consumer = () => {
  latestRecorderContext = useVoiceRecorderContext();
  return <div>consumer</div>;
};

class MockMediaRecorder {
  static isTypeSupported = jest.fn(() => true);

  ondataavailable?: (event: { data: Blob }) => void;

  onstart?: () => void;

  stream: MediaStream;

  options: MediaRecorderOptions;

  constructor(stream: MediaStream, options: MediaRecorderOptions) {
    this.stream = stream;
    this.options = options;
    latestMediaRecorder = this;
  }

  start = jest.fn(() => {
    this.onstart?.();
  });

  stop = jest.fn(() => {
    this.ondataavailable?.({ data: new Blob(['audio']) });
  });
}

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

const installBrowserMocks = ({
  permissionState = 'granted',
  getUserMedia = jest.fn().mockResolvedValue({
    getAudioTracks: () => [{ stop: trackStop }],
  }),
} = {}) => {
  Object.defineProperty(global, 'MediaRecorder', {
    configurable: true,
    value: MockMediaRecorder,
  });
  Object.defineProperty(navigator, 'permissions', {
    configurable: true,
    value: {
      query: jest.fn().mockResolvedValue({ state: permissionState }),
    },
  });
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: {
      getUserMedia,
    },
  });
};

const flushWebAudioUtilsImport = () => act(async () => {
  await Promise.resolve();
  await Promise.resolve();
});

describe('VoiceRecorderProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    latestRecorderContext = undefined as any;
    latestMediaRecorder = null;
    MockMediaRecorder.isTypeSupported.mockReturnValue(true);
    installBrowserMocks();
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        config: {
          logger,
          groupChannel: {
            enableVoiceMessage: true,
          },
        },
      },
    });
  });

  afterEach(() => {
    delete (global as any).MediaRecorder;
    delete (navigator as any).permissions;
    delete (navigator as any).mediaDevices;
  });

  it('logs an error when the browser supports none of the recorder mime types', async () => {
    MockMediaRecorder.isTypeSupported.mockReturnValue(false);

    render(
      <VoiceRecorderProvider>
        <Consumer />
      </VoiceRecorderProvider>
    );

    expect(logger.error).toHaveBeenCalledWith(
      'VoiceRecorder: Browser does not support mimeType',
      expect.objectContaining({ mimmeTypes: expect.any(Array) }),
    );
    await flushWebAudioUtilsImport();
  });

  it('does not start while the audio processor module is still loading', async () => {
    render(
      <VoiceRecorderProvider>
        <Consumer />
      </VoiceRecorderProvider>
    );

    act(() => {
      latestRecorderContext.start();
    });

    expect(logger.error).toHaveBeenCalledWith('VoiceRecorder: Recording audio processor is being loaded.');
    await flushWebAudioUtilsImport();
  });

  it('starts, stops, converts audio, and emits a converted file', async () => {
    const onRecordingStarted = jest.fn();
    const onRecordingEnded = jest.fn();
    render(
      <VoiceRecorderProvider>
        <Consumer />
      </VoiceRecorderProvider>
    );
    await flushWebAudioUtilsImport();

    await act(async () => {
      latestRecorderContext.start({ onRecordingStarted, onRecordingEnded });
      await Promise.resolve();
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(latestMediaRecorder.options.audioBitsPerSecond).toBe(12000);
    expect(onRecordingStarted).toHaveBeenCalled();
    expect(latestRecorderContext.isRecordable).toBe(true);

    act(() => {
      latestRecorderContext.stop();
    });

    expect(latestMediaRecorder.stop).toHaveBeenCalled();
    expect(downsampleToWav).toHaveBeenCalledWith(expect.any(File), expect.any(Function));
    expect(encodeMp3).toHaveBeenCalledWith(expect.any(ArrayBuffer));
    expect(onRecordingEnded).toHaveBeenCalledWith(expect.any(File));
    expect(trackStop).toHaveBeenCalled();
  });

  it('shows and clears the permission warning modal when microphone permission is denied', async () => {
    installBrowserMocks({ permissionState: 'denied' });
    render(
      <VoiceRecorderProvider>
        <Consumer />
      </VoiceRecorderProvider>
    );
    await flushWebAudioUtilsImport();

    await act(async () => {
      latestRecorderContext.start();
      await Promise.resolve();
    });

    expect(await screen.findByText('Microphone permission denied')).toBeInTheDocument();

    act(() => {
      screen.getByText('close').click();
    });
    expect(screen.queryByText('Microphone permission denied')).not.toBeInTheDocument();
  });

  it('logs getUserMedia failures and clears the recorder', async () => {
    const error = new Error('blocked');
    installBrowserMocks({ getUserMedia: jest.fn().mockRejectedValue(error) });
    render(
      <VoiceRecorderProvider>
        <Consumer />
      </VoiceRecorderProvider>
    );
    await flushWebAudioUtilsImport();

    await act(async () => {
      latestRecorderContext.start();
      await Promise.resolve();
    });

    expect(logger.error).toHaveBeenCalledWith('VoiceRecorder: Failed getting media stream.', error);
    expect(latestRecorderContext.isRecordable).toBe(false);
  });
});

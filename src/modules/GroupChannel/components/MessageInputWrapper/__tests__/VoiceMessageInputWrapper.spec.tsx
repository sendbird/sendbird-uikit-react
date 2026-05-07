import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useVoicePlayer } from '../../../../../hooks/VoicePlayer/useVoicePlayer';
import { useVoiceRecorder, VoiceRecorderStatus } from '../../../../../hooks/VoiceRecorder/useVoiceRecorder';
import { VOICE_PLAYER_STATUS } from '../../../../../hooks/VoicePlayer/dux/initialState';
import { VoiceMessageInputStatus } from '../../../../../ui/VoiceMessageInput/types';
import { VoiceMessageInputWrapper } from '../VoiceMessageInputWrapper';

let latestVoiceInputProps: any;
let latestRecorderHandlers: any;

jest.mock('../../../../../ui/VoiceMessageInput', () => ({
  VoiceMessageInput: (props: any) => {
    latestVoiceInputProps = props;
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'voice-input', 'data-status': props.currentType }, [
      React.createElement('button', { key: 'cancel', type: 'button', onClick: props.onCancelClick }, 'cancel'),
      React.createElement('button', { key: 'control', type: 'button', onClick: () => props.onControlClick(props.currentType) }, 'control'),
      React.createElement('button', { key: 'submit', type: 'button', onClick: props.onSubmitClick }, 'submit'),
    ]);
  },
}));

jest.mock('../../../../../ui/Modal', () => (props: any) => {
  const React = require('react');
  return React.createElement('div', {}, [
    React.createElement('h1', { key: 'title' }, props.titleText),
    React.createElement('button', { key: 'close', type: 'button', onClick: props.onClose }, 'close'),
    props.children,
  ]);
});

jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../../lib/LocalizationContext', () => ({
  useLocalization: () => ({
    stringSet: {
      MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_MUTED: 'Muted',
      MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_FROZEN: 'Frozen',
      BUTTON__OK: 'OK',
    },
  }),
}));

jest.mock('../../../../../hooks/VoiceRecorder/useVoiceRecorder', () => ({
  VoiceRecorderStatus: {
    PREPARING: 'PREPARING',
    READY_TO_RECORD: 'READY_TO_RECORD',
    RECORDING: 'RECORDING',
    COMPLETED: 'COMPLETED',
  },
  useVoiceRecorder: jest.fn(),
}));

jest.mock('../../../../../hooks/VoicePlayer/useVoicePlayer', () => ({
  useVoicePlayer: jest.fn(),
}));

const recorderState = {
  start: jest.fn(),
  stop: jest.fn(),
  cancel: jest.fn(),
  recordingTime: 0,
  recordingStatus: VoiceRecorderStatus.READY_TO_RECORD,
  recordingLimit: 1000,
};

const playerState = {
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  playbackTime: 0,
  playingStatus: VOICE_PLAYER_STATUS.IDLE,
};

const channel = {
  url: 'channel-url',
  myRole: 'none',
  isFrozen: false,
  myMutedState: 'unmuted',
};

describe('VoiceMessageInputWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(recorderState, {
      recordingTime: 0,
      recordingStatus: VoiceRecorderStatus.READY_TO_RECORD,
      recordingLimit: 1000,
    });
    Object.assign(playerState, {
      playbackTime: 0,
      playingStatus: VOICE_PLAYER_STATUS.IDLE,
    });
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        config: {
          voiceRecord: {
            minRecordingTime: 100,
          },
        },
      },
    });
    (useVoiceRecorder as jest.Mock).mockImplementation((handlers) => {
      latestRecorderHandlers = handlers;
      return recorderState;
    });
    (useVoicePlayer as jest.Mock).mockReturnValue(playerState);
  });

  it('starts recording from ready state and cancels with cleanup', () => {
    const onCancelClick = jest.fn();
    render(<VoiceMessageInputWrapper channel={channel as any} onCancelClick={onCancelClick} />);

    fireEvent.click(screen.getByText('control'));
    expect(playerState.stop).toHaveBeenCalled();
    expect(recorderState.start).toHaveBeenCalled();

    fireEvent.click(screen.getByText('cancel'));
    expect(onCancelClick).toHaveBeenCalled();
    expect(recorderState.cancel).toHaveBeenCalled();
    expect(playerState.stop).toHaveBeenCalledTimes(2);
  });

  it('handles recording control for short, valid, and disabled recordings', () => {
    const { rerender } = render(<VoiceMessageInputWrapper channel={channel as any} />);

    act(() => {
      latestRecorderHandlers.onRecordingStarted();
    });
    fireEvent.click(screen.getByText('control'));
    expect(recorderState.cancel).toHaveBeenCalled();
    expect(latestVoiceInputProps.currentType).toBe(VoiceMessageInputStatus.READY_TO_RECORD);

    recorderState.recordingTime = 120;
    act(() => {
      latestRecorderHandlers.onRecordingStarted();
    });
    fireEvent.click(screen.getByText('control'));
    expect(recorderState.stop).toHaveBeenCalled();

    rerender(<VoiceMessageInputWrapper channel={{ ...channel, myMutedState: 'muted' } as any} />);
    act(() => {
      latestRecorderHandlers.onRecordingStarted();
    });
    fireEvent.click(screen.getByText('control'));

    expect(recorderState.cancel).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Muted')).toBeInTheDocument();
  });

  it('submits converted audio after recording completes', () => {
    const onSubmitClick = jest.fn();
    const { rerender } = render(<VoiceMessageInputWrapper channel={channel as any} onSubmitClick={onSubmitClick} />);
    const file = new File(['audio'], 'voice.mp3', { type: 'audio/mpeg' });

    recorderState.recordingTime = 300;
    recorderState.recordingStatus = VoiceRecorderStatus.COMPLETED;
    act(() => {
      latestRecorderHandlers.onRecordingEnded(file);
    });
    rerender(<VoiceMessageInputWrapper channel={channel as any} onSubmitClick={onSubmitClick} />);

    expect(latestVoiceInputProps.currentType).toBe(VoiceMessageInputStatus.READY_TO_PLAY);

    fireEvent.click(screen.getByText('submit'));
    expect(recorderState.stop).toHaveBeenCalled();
    expect(playerState.pause).toHaveBeenCalled();
    expect(onSubmitClick).toHaveBeenCalledWith(file, 300);
  });

  it('plays and pauses recorded audio based on input state', () => {
    const { rerender } = render(<VoiceMessageInputWrapper channel={channel as any} />);
    const file = new File(['audio'], 'voice.mp3', { type: 'audio/mpeg' });

    recorderState.recordingTime = 300;
    recorderState.recordingStatus = VoiceRecorderStatus.COMPLETED;
    act(() => {
      latestRecorderHandlers.onRecordingEnded(file);
    });
    rerender(<VoiceMessageInputWrapper channel={channel as any} />);

    fireEvent.click(screen.getByText('control'));
    expect(playerState.play).toHaveBeenCalled();

    playerState.playingStatus = VOICE_PLAYER_STATUS.PLAYING;
    rerender(<VoiceMessageInputWrapper channel={channel as any} />);
    expect(latestVoiceInputProps.currentType).toBe(VoiceMessageInputStatus.PLAYING);

    fireEvent.click(screen.getByText('control'));
    expect(playerState.pause).toHaveBeenCalled();
  });

  it('shows a frozen warning when submitting while disabled', () => {
    const onCancelClick = jest.fn();
    render(<VoiceMessageInputWrapper channel={{ ...channel, isFrozen: true } as any} onCancelClick={onCancelClick} />);

    fireEvent.click(screen.getByText('submit'));
    expect(screen.getByText('Frozen')).toBeInTheDocument();

    fireEvent.click(screen.getByText('close'));
    expect(onCancelClick).toHaveBeenCalled();
  });
});

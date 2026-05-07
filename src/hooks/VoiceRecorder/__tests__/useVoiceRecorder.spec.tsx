import { act, renderHook } from '@testing-library/react';

import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { useVoiceRecorder, VoiceRecorderStatus } from '../useVoiceRecorder';

const mockVoiceRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  isRecordable: false,
};

jest.mock('..', () => ({
  useVoiceRecorderContext: () => mockVoiceRecorder,
}));

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useVoiceRecorder', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockVoiceRecorder.start.mockReset();
    mockVoiceRecorder.stop.mockReset();
    mockVoiceRecorder.isRecordable = false;
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        config: {
          voiceRecord: {
            maxRecordingTime: 250,
          },
        },
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('moves from preparing to ready when recorder context becomes recordable', () => {
    const { result, rerender } = renderHook(() => useVoiceRecorder({}));

    expect(result.current.recordingStatus).toBe(VoiceRecorderStatus.PREPARING);

    mockVoiceRecorder.isRecordable = true;
    rerender();

    expect(result.current.recordingStatus).toBe(VoiceRecorderStatus.READY_TO_RECORD);
    expect(result.current.recordingLimit).toBe(250);
  });

  it('starts recording, tracks elapsed time, completes with a recorded file, and cancels', () => {
    const onRecordingStarted = jest.fn();
    const onRecordingEnded = jest.fn();
    const { result } = renderHook(() => useVoiceRecorder({
      onRecordingStarted,
      onRecordingEnded,
    }));

    act(() => {
      result.current.start();
    });

    const handlers = mockVoiceRecorder.start.mock.calls[0][0];
    act(() => {
      handlers.onRecordingStarted();
    });

    expect(result.current.recordingStatus).toBe(VoiceRecorderStatus.RECORDING);
    expect(onRecordingStarted).toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current.recordingTime).toBe(200);

    const file = new File(['audio'], 'voice.mp3', { type: 'audio/mpeg' });
    act(() => {
      handlers.onRecordingEnded(file);
    });

    expect(result.current.recordingStatus).toBe(VoiceRecorderStatus.COMPLETED);
    expect(result.current.recordedFile).toBe(file);
    expect(onRecordingEnded).toHaveBeenCalledWith(file);

    act(() => {
      result.current.cancel();
    });

    expect(mockVoiceRecorder.stop).toHaveBeenCalled();
    expect(result.current.recordedFile).toBeNull();
  });

  it('stops recording when elapsed time passes the configured limit', () => {
    const { result } = renderHook(() => useVoiceRecorder({}));

    act(() => {
      result.current.start();
      mockVoiceRecorder.start.mock.calls[0][0].onRecordingStarted();
      jest.advanceTimersByTime(300);
    });

    expect(result.current.recordingTime).toBe(300);
    expect(mockVoiceRecorder.stop).toHaveBeenCalled();
  });

  it('stops the active timer when stop is called explicitly', () => {
    const { result } = renderHook(() => useVoiceRecorder({}));

    act(() => {
      result.current.start();
      mockVoiceRecorder.start.mock.calls[0][0].onRecordingStarted();
      result.current.stop();
      jest.advanceTimersByTime(300);
    });

    expect(mockVoiceRecorder.stop).toHaveBeenCalled();
    expect(result.current.recordingTime).toBe(0);
  });
});

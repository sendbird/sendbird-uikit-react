import reducer from '../reducer';
import {
  INITIALIZE_AUDIO_UNIT,
  ON_CURRENT_TIME_UPDATE,
  ON_VOICE_PLAYER_PAUSE,
  ON_VOICE_PLAYER_PLAY,
  RESET_AUDIO_UNIT,
  SET_CURRENT_PLAYER,
} from '../actionTypes';
import { AudioUnitDefaultValue, VOICE_PLAYER_STATUS, voicePlayerInitialState } from '../initialState';

describe('voicePlayerReducer', () => {
  it('initializes and resets audio units', () => {
    const initialized = reducer(voicePlayerInitialState, {
      type: INITIALIZE_AUDIO_UNIT,
      payload: { groupKey: 'group-1' },
    } as any);

    expect(initialized.audioStorage['group-1']).toEqual({
      ...AudioUnitDefaultValue(),
      playingStatus: VOICE_PLAYER_STATUS.PREPARING,
    });

    const reset = reducer(initialized, {
      type: RESET_AUDIO_UNIT,
      payload: { groupKey: 'group-1' },
    } as any);

    expect(reset.audioStorage['group-1']).toEqual(AudioUnitDefaultValue());
  });

  it('sets current player and tracks playback transitions', () => {
    const audioPlayer = {
      currentTime: 3,
      duration: 10,
    } as HTMLAudioElement;
    const audioFile = new File(['voice'], 'voice.mp3');

    const withPlayer = reducer(voicePlayerInitialState, {
      type: SET_CURRENT_PLAYER,
      payload: { groupKey: 'group-1', audioPlayer },
    } as any);
    expect(withPlayer.currentPlayer).toBe(audioPlayer);
    expect(withPlayer.currentGroupKey).toBe('group-1');

    const playing = reducer(withPlayer, {
      type: ON_VOICE_PLAYER_PLAY,
      payload: { groupKey: 'group-1', audioFile },
    } as any);
    expect(playing.audioStorage['group-1'].audioFile).toBe(audioFile);
    expect(playing.audioStorage['group-1'].playingStatus).toBe(VOICE_PLAYER_STATUS.PLAYING);

    const progressed = reducer(playing, {
      type: ON_CURRENT_TIME_UPDATE,
      payload: { groupKey: 'group-1' },
    } as any);
    expect(progressed.audioStorage['group-1'].playbackTime).toBe(3);
    expect(progressed.audioStorage['group-1'].duration).toBe(10);

    const paused = reducer(progressed, {
      type: ON_VOICE_PLAYER_PAUSE,
      payload: { groupKey: 'group-1', duration: 10, currentTime: 5 },
    } as any);
    expect(paused.audioStorage['group-1'].playingStatus).toBe(VOICE_PLAYER_STATUS.PAUSED);
    expect(paused.audioStorage['group-1'].playbackTime).toBe(3);
  });

  it('resets playback time when pausing at completion or receiving a final time update after pause', () => {
    const audioPlayer = {
      currentTime: 10,
      duration: 10,
    } as HTMLAudioElement;
    const state = {
      ...voicePlayerInitialState,
      currentPlayer: audioPlayer,
      audioStorage: {
        'group-1': {
          ...AudioUnitDefaultValue(),
          playbackTime: 10,
          duration: 10,
          playingStatus: VOICE_PLAYER_STATUS.PAUSED,
        },
      },
    };

    const finalUpdate = reducer(state, {
      type: ON_CURRENT_TIME_UPDATE,
      payload: { groupKey: 'group-1' },
    } as any);
    expect(finalUpdate.audioStorage['group-1'].playbackTime).toBe(0);

    const pauseAtEnd = reducer({
      ...state,
      audioStorage: {
        'group-1': {
          ...AudioUnitDefaultValue(),
          playbackTime: 4,
        },
      },
    }, {
      type: ON_VOICE_PLAYER_PAUSE,
      payload: { groupKey: 'group-1', duration: 10, currentTime: 10 },
    } as any);
    expect(pauseAtEnd.audioStorage['group-1'].playbackTime).toBe(0);
  });

  it('returns current state for unknown actions', () => {
    expect(reducer(voicePlayerInitialState, { type: 'UNKNOWN', payload: {} } as any)).toBe(voicePlayerInitialState);
  });
});

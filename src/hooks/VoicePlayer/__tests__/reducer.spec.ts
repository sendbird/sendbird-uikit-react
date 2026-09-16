import voicePlayerReducer from '../dux/reducer';
import { AudioStorageUnit, VoicePlayerInitialState, VOICE_PLAYER_STATUS } from '../dux/initialState';
import {
  ON_CURRENT_TIME_UPDATE,
  ON_VOICE_PLAYER_PAUSE,
  RESET_AUDIO_UNIT,
} from '../dux/actionTypes';

const GROUP_KEY = 'sendbird_group_channel_1-12345';
const DURATION = 20;
const PLAYBACK_TIME = 5;

const playingState = (): VoicePlayerInitialState => ({
  currentPlayer: { currentTime: PLAYBACK_TIME, duration: DURATION } as HTMLAudioElement,
  currentGroupKey: GROUP_KEY,
  audioStorage: {
    [GROUP_KEY]: {
      audioFile: new File(['voice'], 'voice.mp3', { type: 'audio/mp3' }),
      playbackTime: PLAYBACK_TIME,
      duration: DURATION,
      playingStatus: VOICE_PLAYER_STATUS.PLAYING,
    } as AudioStorageUnit,
  },
});

const unitOf = (state: VoicePlayerInitialState) => state.audioStorage[GROUP_KEY];

// Pausing an audio element queues `timeupdate` and `pause`, so both land after the synchronous
// reset that the unmount cleanup dispatches (CLNP-7018)
describe('voicePlayerReducer: events queued by the paused player (CLNP-7018)', () => {
  it('does not move a reset unit back to where playback stopped', () => {
    let state = voicePlayerReducer(playingState(), { type: RESET_AUDIO_UNIT, payload: { groupKey: GROUP_KEY } });
    expect(unitOf(state).playbackTime).toBe(0);

    state = voicePlayerReducer(state, { type: ON_CURRENT_TIME_UPDATE, payload: { groupKey: GROUP_KEY } });

    expect(unitOf(state).playbackTime).toBe(0);
  });

  it('does not move a reset unit out of idle', () => {
    let state = voicePlayerReducer(playingState(), { type: RESET_AUDIO_UNIT, payload: { groupKey: GROUP_KEY } });

    state = voicePlayerReducer(state, {
      type: ON_VOICE_PLAYER_PAUSE,
      payload: { groupKey: GROUP_KEY, duration: DURATION, currentTime: PLAYBACK_TIME },
    });

    expect(unitOf(state).playingStatus).toBe(VOICE_PLAYER_STATUS.IDLE);
    expect(unitOf(state).playbackTime).toBe(0);
  });

  it('leaves a reset unit untouched through the whole queued sequence', () => {
    let state = voicePlayerReducer(playingState(), { type: RESET_AUDIO_UNIT, payload: { groupKey: GROUP_KEY } });

    state = voicePlayerReducer(state, { type: ON_CURRENT_TIME_UPDATE, payload: { groupKey: GROUP_KEY } });
    state = voicePlayerReducer(state, {
      type: ON_VOICE_PLAYER_PAUSE,
      payload: { groupKey: GROUP_KEY, duration: DURATION, currentTime: PLAYBACK_TIME },
    });

    expect(unitOf(state)).toMatchObject({
      playbackTime: 0,
      playingStatus: VOICE_PLAYER_STATUS.IDLE,
    });
  });
});

describe('voicePlayerReducer: a unit that is still playing', () => {
  it('records the pause the listener asked for', () => {
    const state = voicePlayerReducer(playingState(), {
      type: ON_VOICE_PLAYER_PAUSE,
      payload: { groupKey: GROUP_KEY, duration: DURATION, currentTime: PLAYBACK_TIME },
    });

    expect(unitOf(state).playingStatus).toBe(VOICE_PLAYER_STATUS.PAUSED);
    expect(unitOf(state).playbackTime).toBe(PLAYBACK_TIME);
  });

  it('rewinds to the start when the audio reached its end', () => {
    const state = voicePlayerReducer(playingState(), {
      type: ON_VOICE_PLAYER_PAUSE,
      payload: { groupKey: GROUP_KEY, duration: DURATION, currentTime: DURATION },
    });

    expect(unitOf(state).playingStatus).toBe(VOICE_PLAYER_STATUS.PAUSED);
    expect(unitOf(state).playbackTime).toBe(0);
  });

  it('follows the player while it advances', () => {
    const state = voicePlayerReducer(playingState(), { type: ON_CURRENT_TIME_UPDATE, payload: { groupKey: GROUP_KEY } });

    expect(unitOf(state).playbackTime).toBe(PLAYBACK_TIME);
    expect(unitOf(state).duration).toBe(DURATION);
  });

  it('ignores a time update for a unit the storage never held', () => {
    const state = playingState();

    const next = voicePlayerReducer(state, { type: ON_CURRENT_TIME_UPDATE, payload: { groupKey: 'unknown-group-key' } });

    expect(next).toBe(state);
  });
});

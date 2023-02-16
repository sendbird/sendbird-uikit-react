// VoicePlayerEvent interface
export interface VoicePlayerEventStorage {
  /**
   * {
   *  `${channel-url}/${message-id}`: [
   *    {
   *      groupKey: `${channel-url}/${message-id}`,
   *      eventHandlerId: `${uuid()}`
   *      onPlayingStarted: () => {},
   *      onPlayingStopped: () => {},
   *      onPlaybackTimeUpdated: () => {},
   *    }
   *  ]
   * }
   */
  [groupKey: string]: Array<VoicePlayerEvent>;
}
export const VoicePlayerEventTypes = {
  STARTED: 'onPlayingStarted',
  STOPPED: 'onPlayingStopped',
  TIME_UPDATED: 'onPlaybackTimeUpdated',
} as const;
export type VoicePlayerEventTypes = typeof VoicePlayerEventTypes[keyof typeof VoicePlayerEventTypes];

export interface VoicePlayerEvent {
  groupKey: string;
  id: string;
  onPlayingStarted?: (props: VoicePlayerEventParams) => void;
  onPlayingStopped?: (props: VoicePlayerEventParams) => void;
  onPlaybackTimeUpdated?: (props: VoicePlayerEventParams) => void;
}
export interface VoicePlayerEventParams {
  groupKey: string;
  duration?: number;
  playbackTime?: number;
}

export const generateGroupKey = (channelUrl: string, key: string): string => (`${channelUrl}/${key}`);
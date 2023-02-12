import React, { createContext, useContext, useState } from 'react';

const noop = () => {/* noop */ };

export interface VoicePlayerProps {
  children: React.ReactElement;
}

export type VoicePlayerUnit = {
  id: string;
  channelUrl: string;
  audioFile: File | null;
  playbackTime?: number;
  duration?: number;
}

export interface VoicePlayerChannelMap {
  [key: string]: VoicePlayerUnit | Array<string> | string;
  channelUrl: string;
  summonedCompList: Array<string>;
}
export interface VoicePlayerGlobalMap {
  [key: string]: VoicePlayerChannelMap;
}
export interface VoicePlayerEventHandler {
  onPlayingStarted?: (channelUrl: string, fileKey: string) => void;
  onPlayingStopped?: (channelUrl: string, fileKey: string) => void;
}

export interface VoicePlayerContext {
  registerPlayerUnit: (channelUrl: string, fileKey: string, audioFile: File) => Promise<VoicePlayerUnit>;
  removePlayerUnit: (channelUrl: string, fileKey: string) => Promise<void>;
  checkInChannel: (channelUrl: string, uuid: string) => void;
  checkOutChannel: (channelUrl: string, uuid: string) => void;
  play: (channelUrl: string, fileKey: string, eventHandler: VoicePlayerEventHandler) => void;
  pause: (channelUrl: string, fileKey: string) => void;
  currentPlayerUnit: VoicePlayerUnit;
  voicePlayerMap: VoicePlayerGlobalMap;
  isAudioPlaying: boolean;
}

const VoicePlayerContext = createContext<VoicePlayerContext>({
  play: noop,
  pause: noop,
  registerPlayerUnit: null,
  removePlayerUnit: null,
  checkInChannel: noop,
  checkOutChannel: noop,
  currentPlayerUnit: null,
  voicePlayerMap: null,
  isAudioPlaying: false,
});

export const VoicePlayerProvider = ({
  children,
}: VoicePlayerProps): React.ReactElement => {
  const [voicePlayerMap, setVoicePlayerMap] = useState<VoicePlayerGlobalMap>({});
  const [currentAudioPlayer, setAudioPlayer] = useState<HTMLAudioElement>(null);
  const [currentPlayerUnit, setPlayerUnit] = useState<VoicePlayerUnit>(null);
  const [isAudioPlaying, setIsPlaying] = useState<boolean>(false);

  const play = (channelUrl: string, fileKey: string, eventHandler: VoicePlayerEventHandler): void => {
    const targetPlayerUnit = voicePlayerMap?.[channelUrl]?.[fileKey] as VoicePlayerUnit;
    if (!targetPlayerUnit) {
      return;
    }
    if (currentAudioPlayer) {
      pause(channelUrl, fileKey);
    }
    const audioPlayer = new Audio(URL?.createObjectURL?.(targetPlayerUnit?.audioFile));
    audioPlayer.currentTime = targetPlayerUnit.playbackTime;
    audioPlayer.volume = 1;
    audioPlayer.loop = false;
    audioPlayer.onplay = () => {
      setIsPlaying(true);
      eventHandler?.onPlayingStarted(channelUrl, fileKey);
      setPlayerUnit(targetPlayerUnit);
    };
    audioPlayer.onpause = () => {
      setIsPlaying(false);
      eventHandler?.onPlayingStopped(channelUrl, fileKey);
      if (targetPlayerUnit?.channelUrl === channelUrl && targetPlayerUnit?.id === fileKey) {
        setPlayerUnit(null);
      }
      if (audioPlayer.duration - audioPlayer.currentTime <= 0.01) {
        targetPlayerUnit.playbackTime = 0;
        setVoicePlayerMap((map) => {
          return ({
            ...map,
            channelUrl: {
              ...map.channelUrl,
              fileKey: targetPlayerUnit,
            },
          });
        });
      }
    };
    audioPlayer.ontimeupdate = () => {
      targetPlayerUnit.playbackTime = audioPlayer.currentTime;
      targetPlayerUnit.duration = audioPlayer.duration;
      setVoicePlayerMap((map) => {
        return ({
          ...map,
          channelUrl: {
            ...map.channelUrl,
            fileKey: targetPlayerUnit,
          },
        });
      });
    };
    audioPlayer?.play();
    setAudioPlayer(audioPlayer);
  };
  const pause = (channelUrl: string, fileKey: string): void => {
    if (currentPlayerUnit?.channelUrl === channelUrl && currentPlayerUnit?.id === fileKey) {
      currentAudioPlayer?.pause();
      setAudioPlayer(null);
    }
  };

  /**
   * checkInChannel function checks how many places the voice player is being used
   * it caches the activated modules count in the `summonedCompList` property
   * if the list is empty when you call checkOutChannel, it will clear all VoicePlayerUnit of the channel
   * so you can keep the audio files until you leave the last component joining the channel
   */
  const checkInChannel = (channelUrl: string, uuid: string): void => {
    if (!voicePlayerMap?.[channelUrl]) {
      const voicePlayerChannelMap: VoicePlayerChannelMap = {
        channelUrl,
        summonedCompList: [],
      };
      voicePlayerMap[channelUrl] = voicePlayerChannelMap;
    }
    voicePlayerMap?.[channelUrl]?.summonedCompList.push(uuid);
    setVoicePlayerMap(voicePlayerMap);
  };
  const checkOutChannel = (channelUrl: string, uuid: string): void => {
    if (voicePlayerMap?.[channelUrl]) {
      const voicePlayerChannelMap = voicePlayerMap?.[channelUrl];
      const newSummonedComponentList = voicePlayerChannelMap.summonedCompList.filter((uuidKey) => uuidKey !== uuid);
      voicePlayerChannelMap.summonedCompList = newSummonedComponentList;
      if (voicePlayerChannelMap.summonedCompList.length === 0) {
        // delete every cashed data when there's no module using voice player in this channel
        delete voicePlayerMap[channelUrl];
      }
    }
    setVoicePlayerMap(voicePlayerMap);
  };
  /**
   * applyPlayerUnit function applys VoicePlayerUnit which contains `audioFile, playbackTime, duration`
   * you can remove the unit by removePlayerUnit function when the message is deleted or voice input is unmounted
   */
  const registerPlayerUnit = (channelUrl: string, fileKey: string, audioFile: File): Promise<VoicePlayerUnit> => {
    return new Promise((resolve, reject) => {
      if (voicePlayerMap?.[channelUrl]) {
        const audioPlayer = new Audio(URL?.createObjectURL?.(audioFile));
        audioPlayer.onloadedmetadata = () => {
          const voicePlayerChannelMap = voicePlayerMap?.[channelUrl];
          voicePlayerChannelMap[fileKey] = {
            channelUrl,
            id: fileKey,
            audioFile,
            playbackTime: 0,
            duration: 0,
          } as VoicePlayerUnit;
          setVoicePlayerMap(voicePlayerMap);
          resolve(voicePlayerMap?.[channelUrl]?.[fileKey] as VoicePlayerUnit);
        };
        audioPlayer.load();
      } else {
        reject();
      }
    });
  };
  const removePlayerUnit = (channelUrl: string, fileKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (voicePlayerMap?.[channelUrl]) {
        const voicePlayerChannelMap = voicePlayerMap?.[channelUrl];
        delete voicePlayerChannelMap[fileKey];
        setVoicePlayerMap(voicePlayerMap);
        resolve();
      } else {
        reject();
      }
    });
  };

  return (
    <VoicePlayerContext.Provider value={{
      play,
      pause,
      registerPlayerUnit,
      removePlayerUnit,
      checkInChannel,
      checkOutChannel,
      currentPlayerUnit,
      voicePlayerMap,
      isAudioPlaying,
    }}>
      {children}
    </VoicePlayerContext.Provider>
  );
};

export const useVoicePlayerContext = (): VoicePlayerContext => useContext(VoicePlayerContext);

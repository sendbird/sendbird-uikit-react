import React, { useEffect, useMemo, useState } from 'react';
import { FileMessage } from '@sendbird/chat/message';

import './index.scss';

import ProgressBar, { ProgressBarColorTypes } from '../ProgressBar';
import { useVoicePlayer } from '../../hooks/VoicePlayer/useVoicePlayer';
import PlaybackTime from '../PlaybackTime';
import Loader from '../Loader';
import Icon, { IconTypes, IconColors } from '../Icon';
import { LabelTypography, LabelColors } from '../Label';
import { VOICE_PLAYER_STATUS } from '../../hooks/VoicePlayer/dux/initialState';
import { string } from 'ts-pattern/dist/patterns';

export interface VoiceMessageItemBodyProps {
  className?: string;
  message: FileMessage;
  channelUrl: string;
  isByMe?: boolean;
  isReactionEnabled?: boolean;
}

export const VoiceMessageItemBody = ({
  className,
  message,
  channelUrl,
  isByMe = false,
  isReactionEnabled = false,
}: VoiceMessageItemBodyProps): React.ReactElement => {
  const [usingReaction, setUsingReaction] = useState(false);
  const {
    play,
    // do not pause on unmount, because on desktop layout
    // the component can be paused when it is played from
    // channel and same message is unmounted from the thread
    pause,
    playbackTime = 0,
    duration,
    playingStatus = VOICE_PLAYER_STATUS.IDLE,
  } = useVoicePlayer({
    channelUrl,
    key: `${message?.messageId}`,
    audioFileUrl: message?.url,
  });

  useEffect(() => {
    if (isReactionEnabled && message?.reactions?.length > 0) {
      setUsingReaction(true);
    } else {
      setUsingReaction(false);
    }
  }, [isReactionEnabled, message?.reactions?.length]);
  const progressBarMaxSize = useMemo(() => {
    const DEFAULT_MAX_SIZE = 1;
    if (message?.metaArrays) {
      const duration = message?.metaArrays.find((metaArray) => metaArray.key === 'KEY_VOICE_MESSAGE_DURATION')?.value[0];
      return duration ? parseInt(duration) : DEFAULT_MAX_SIZE;
    }
    return DEFAULT_MAX_SIZE;
  }, [message?.metaArrays]);
  
  return (
    <div className={`sendbird-voice-message-item-body ${className} ${usingReaction ? 'is-reactions-contained' : ''}`}>
      <ProgressBar
        className="sendbird-voice-message-item-body__progress-bar"
        maxSize={duration || progressBarMaxSize}
        currentSize={playbackTime}
        colorType={isByMe ? ProgressBarColorTypes.PRIMARY : ProgressBarColorTypes.GRAY}
      />
      <div className="sendbird-voice-message-item-body__status-button">
        {(playingStatus === VOICE_PLAYER_STATUS.IDLE || playingStatus === VOICE_PLAYER_STATUS.PAUSED) && (
          <div
            className="sendbird-voice-message-item-body__status-button__button"
            onClick={play}
          >
            <Icon
              width="18px"
              height="18px"
              type={IconTypes.PLAY}
              fillColor={IconColors.PRIMARY}
            />
          </div>
        )}
        {playingStatus === VOICE_PLAYER_STATUS.PREPARING && (
          <Loader width="22.2px" height="22.2px">
            <Icon
              width="22.2px"
              height="22.2px"
              type={IconTypes.SPINNER}
              fillColor={IconColors.PRIMARY_2}
            />
          </Loader>
        )}
        {playingStatus === VOICE_PLAYER_STATUS.PLAYING && (
          <div
            className="sendbird-voice-message-item-body__status-button__button"
            onClick={() => { pause(); }}
          >
            <div className="sendbird-voice-message-item-body__status-button__button__pause">
              <div className="sendbird-voice-message-item-body__status-button__button__pause__inner" />
              <div className="sendbird-voice-message-item-body__status-button__button__pause__inner" />
            </div>
          </div>
        )}
      </div>
      <PlaybackTime
        className="sendbird-voice-message-item-body__playback-time"
        time={progressBarMaxSize - playbackTime}
        labelType={LabelTypography.BODY_1}
        labelColor={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
      />
    </div>
  );
};

export default VoiceMessageItemBody;

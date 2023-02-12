import React from 'react';

import Icon, { IconTypes, IconColors } from '../Icon';
import { VoiceMessageInputStatus } from '.';

export interface ControlerIconProps {
  inputState?: VoiceMessageInputStatus;
}

export const ControlerIcon = ({
  inputState
}: ControlerIconProps): React.ReactElement => {
  switch (inputState) {
    case VoiceMessageInputStatus.READY_TO_RECORD: {
      return (
        <div className="sendbird-controler-icon record-icon" />
      );
    }
    case VoiceMessageInputStatus.RECORDING: {
      return (
        <div className="sendbird-controler-icon stop-icon" />
      );
    }
    case VoiceMessageInputStatus.READY_TO_PLAY: {
      return (
        <Icon
          className="sendbird-controler-icon play-icon"
          width="20px"
          height="20px"
          type={IconTypes.PLAY}
          fillColor={IconColors.DEFAULT}
        />
      );
    }
    case VoiceMessageInputStatus.PLAYING: {
      return (
        <div className="sendbird-controler-icon pause-icon">
          <div className="sendbird-controler-icon pause-icon-inner"/>
          <div className="sendbird-controler-icon pause-icon-inner"/>
        </div>
      );
    }
    default:
      return null;
  }
};

export default ControlerIcon;

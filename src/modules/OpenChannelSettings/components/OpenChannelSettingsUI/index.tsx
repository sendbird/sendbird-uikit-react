import './open-channel-ui.scss';

import React, { useContext } from 'react';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

import InvalidChannel from '../InvalidChannel';
import OperatorUI from '../OperatorUI';
import ParticipantUI from '../ParticipantUI';

import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes } from '../../../../ui/Icon';
import { useSendbird } from '../../../../lib/Sendbird/context/hooks/useSendbird';

export interface OpenChannelUIProps {
  renderOperatorUI?: () => React.ReactElement;
  renderParticipantList?: () => React.ReactElement;
}

const OpenChannelUI: React.FC<OpenChannelUIProps> = ({
  renderOperatorUI,
  renderParticipantList,
}: OpenChannelUIProps) => {
  const {
    channel,
    onCloseClick,
    isChannelInitialized,
  } = useOpenChannelSettingsContext();
  const { state } = useSendbird();
  const logger = state?.config?.logger;
  const user = state?.stores?.userStore?.user;

  const { stringSet } = useContext(LocalizationContext);
  if (isChannelInitialized && !channel) {
    return (
      <InvalidChannel
        onCloseClick={() => {
          logger.info('OpenChannelSettings: Click close');
          if (onCloseClick) {
            onCloseClick();
          }
        }}
      />
    );
  }
  return (
    <div className='sendbird-openchannel-settings'>
      {
        channel?.isOperator(user) && (
          renderOperatorUI?.() || (
            <OperatorUI />
          )
        )
      }
      {
        !(channel?.isOperator(user)) && (
          <div className="sendbird-openchannel-settings__participant">
            <div className="sendbird-openchannel-settings__header">
              <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>
                {stringSet.OPEN_CHANNEL_SETTINGS__PARTICIPANTS_TITLE}
              </Label>
              <Icon
                type={IconTypes.CLOSE}
                className="sendbird-openchannel-settings__close-icon"
                height="24px"
                width="24px"
                onClick={() => {
                  onCloseClick?.();
                }}
              />
            </div>
            {
              renderParticipantList?.() || (
                <ParticipantUI />
              )
            }
          </div>
        )
      }
    </div>
  );
};

export default OpenChannelUI;

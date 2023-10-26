import './open-channel-ui.scss';

import React, { useContext } from 'react';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

import InvalidChannel from '../InvalidChannel';
import OperatorUI from '../OperatorUI';
import ParticipantUI from '../ParticipantUI';

import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes } from '../../../../ui/Icon';

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
  const globalStore = useSendbirdStateContext();
  const logger = globalStore?.config?.logger;
  const user = globalStore?.stores?.userStore?.user;

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
                  onCloseClick();
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

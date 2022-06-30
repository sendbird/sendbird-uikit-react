import './open-channel-ui.scss';

import React from 'react';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useOpenChannelSettings } from '../../context/OpenChannelSettingsProvider';
import { UserProfileProvider } from '../../../../lib/UserProfileContext';

import InvalidChannel from '../InvalidChannel';
import OperatorUI from '../OperatorUI';
import ParticipantUI from '../ParticipantUI';

export interface OpenChannelUIProps {
  renderOperatorUI?: () => React.ReactNode;
  renderParticipantList?: () => React.ReactNode;
}

const OpenChannelUI: React.FC<OpenChannelUIProps> = ({
  renderOperatorUI,
  renderParticipantList,
}: OpenChannelUIProps) => {
  const {
    channel,
    onCloseClick,
  } = useOpenChannelSettings();
  const globalStore = useSendbirdStateContext();
  const logger = globalStore?.config?.logger;
  const user = globalStore?.stores?.userStore?.user;

  if (!channel) {
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
    <UserProfileProvider>
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
            renderParticipantList?.() || (
              <ParticipantUI />
            )
          )
        }
      </div>
    </UserProfileProvider>
  )
};

export default OpenChannelUI;

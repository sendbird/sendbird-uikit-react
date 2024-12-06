import React, { MouseEvent } from 'react';

import { useLocalization } from '../../../../lib/LocalizationContext';

import { IconTypes } from '../../../../ui/Icon';
import Header, { type HeaderCustomProps } from '../../../../ui/Header';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

export interface ChannelSettingsHeaderProps extends HeaderCustomProps {
  onCloseClick?: (e: MouseEvent) => void;
}
export const ChannelSettingsHeader = ({
  onCloseClick,
  // Header custom props
  renderLeft,
  renderMiddle,
  renderRight,
}: ChannelSettingsHeaderProps) => {
  const { stringSet } = useLocalization();
  const { state } = useSendbird();
  const { config } = state;
  const { logger } = config;

  return (
    <Header
      className="sendbird-channel-settings__header"
      renderLeft={renderLeft}
      renderMiddle={renderMiddle ?? (() => (
        <Header.Title title={stringSet.CHANNEL_SETTING__HEADER__TITLE} />
      ))}
      renderRight={renderRight ?? (() => (
        <div className="sendbird-channel-settings__header-icon">
          <Header.IconButton
            type={IconTypes.CLOSE}
            onClick={(e) => {
              logger.info('ChannelSettings: Click close');
              onCloseClick(e);
            }}
          />
        </div>
      ))}
    />
  );
};

export default ChannelSettingsHeader;

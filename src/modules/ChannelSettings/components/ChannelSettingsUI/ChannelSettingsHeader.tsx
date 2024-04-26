import React, { MouseEvent } from 'react';

import { useLocalization } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes } from '../../../../ui/Icon';
import Header, { type HeaderCustomProps } from '../../../../ui/Header';

export interface ChannelSettingsHeaderProps extends HeaderCustomProps {
  onCloseClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
export const ChannelSettingsHeader = ({
  onCloseClick,
  // Header custom props
  renderLeft,
  renderMiddle,
  renderRight,
}: ChannelSettingsHeaderProps) => {
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();
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
          <IconButton
            width="32px"
            height="32px"
            onClick={(e) => {
              logger.info('ChannelSettings: Click close');
              onCloseClick(e);
            }}
          >
            <Icon
              className="sendbird-channel-settings__close-icon"
              type={IconTypes.CLOSE}
              height="22px"
              width="22px"
            />
          </IconButton>
        </div>
      ))}
    />
  );
};

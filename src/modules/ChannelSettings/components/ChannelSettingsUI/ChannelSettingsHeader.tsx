import React, { MouseEvent } from 'react';

import { useLocalization } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes } from '../../../../ui/Icon';

export interface ChannelSettingsHeaderProps {
  onCloseClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
export const ChannelSettingsHeader = ({
  onCloseClick,
}: ChannelSettingsHeaderProps) => {
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();
  const { logger } = config;

  return (
    <div className="sendbird-channel-settings__header">
      <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>
        {stringSet.CHANNEL_SETTING__HEADER__TITLE}
      </Label>
      <div className="sendbird-channel-settings__header-icon">
        <IconButton
          width="32px"
          height="32px"
          onClick={(e) => {
            logger.info('ChannelSettings: Click close');
            onCloseClick(e);
          }}
        >
          <Icon className="sendbird-channel-settings__close-icon" type={IconTypes.CLOSE} height="22px" width="22px" />
        </IconButton>
      </div>
    </div>
  );
};

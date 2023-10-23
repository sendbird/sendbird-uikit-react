import React, { ReactElement, useContext } from 'react';

import { LocalizationContext } from '../../../lib/LocalizationContext';

import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import Icon, { IconTypes } from '../../../ui/Icon';

import PlaceHolder, { PlaceHolderTypes } from '../../../ui/PlaceHolder';

interface Props {
  onCloseClick?(): void;
}

export default function InvalidChannel({
  onCloseClick,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className="sendbird-openchannel-settings">
      <div className="sendbird-openchannel-settings__header">
        <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>
          {stringSet.CHANNEL_SETTING__HEADER__TITLE}
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
      <div className="sendbird-openchannel-settings__placeholder">
        <PlaceHolder type={PlaceHolderTypes.WRONG} />
      </div>
    </div>
  );
}

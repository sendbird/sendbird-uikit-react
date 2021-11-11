import React, {
  ReactElement,
  useContext,
  useState,
} from 'react';

import './channel-profile.scss';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import TextButton from '../../../../ui/TextButton';
import OpenChannelAvatar from '../../../../ui/ChannelAvatar/OpenChannelAvatar';
import EditDetailsModal from '../EditDetailsModal';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useOpenChannelSettings } from '../../context/OpenChannelSettingsProvider';

export default function ChannelProfile(): ReactElement {
  const globalState = useSendbirdStateContext();
  const disabled = !(globalState?.config?.isOnline);
  const theme = globalState?.config?.theme;
  const {
    channel,
  } = useOpenChannelSettings();

  const title = channel?.name;
  const [showModal, setShowModal] = useState(false);
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div className="sendbird-openchannel-profile">
      <div className="sendbird-openchannel-profile--inner">
        <div className="sendbird-openchannel-profile__avatar">
          <OpenChannelAvatar
            channel={channel}
            theme={theme}
            height={80}
            width={80}
          />
        </div>
        <Label
          type={LabelTypography.SUBTITLE_2}
          color={LabelColors.ONBACKGROUND_1}
          className="sendbird-openchannel-profile__title"
        >
          {title || stringSet.OPEN_CHANNEL_SETTINGS__NO_TITLE}
        </Label>
        <TextButton
          disabled={disabled}
          className="sendbird-openchannel-profile__edit"
          onClick={() => {
            if (disabled) { return; }
            setShowModal(true);
          }}
          notUnderline
        >
          <Label
            type={LabelTypography.BUTTON_1}
            color={disabled ? LabelColors.ONBACKGROUND_2 : LabelColors.PRIMARY}
          >
            {stringSet.CHANNEL_SETTING__PROFILE__EDIT}
          </Label>
        </TextButton>
        {
          showModal && (
            <EditDetailsModal
              onCancel={() => setShowModal(false)}
            />
          )
        }
      </div>
    </div>
  );
}

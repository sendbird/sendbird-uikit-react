import './channel-profile.scss';
import React, { useState, useContext } from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';

import ChannelAvatar from '../../../../ui/ChannelAvatar';
import TextButton from '../../../../ui/TextButton';
import Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';

import EditDetailsModal from '../EditDetailsModal';

const ChannelProfile: React.FC = () => {
  const state = useSendbirdStateContext();
  const channelSettingStore = useChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);
  const [showModal, setShowModal] = useState(false);

  const userId = state?.config?.userId;
  const theme = state?.config?.theme || 'light';
  const isOnline = state?.config?.isOnline;
  const disabled = !isOnline;

  const { channel } = channelSettingStore;

  const getChannelName = () => {
    if (channel?.name && channel?.name !== 'Group Channel') {
      return channel.name;
    }
    if (channel?.name === 'Group Channel' || !channel?.name) {
      return (channel?.members || []).map((member) => member.nickname || stringSet.NO_NAME).join(', ');
    }

    return stringSet.NO_TITLE;
  };

  return (
    <div className="sendbird-channel-profile">
      <div className="sendbird-channel-profile--inner">
        <div className="sendbird-channel-profile__avatar">
          <ChannelAvatar
            channel={channel}
            userId={userId}
            theme={theme}
            width={80}
            height={80}
          />
        </div>
        <Label
          className="sendbird-channel-profile__title"
          type={LabelTypography.SUBTITLE_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {getChannelName()}
        </Label>
        <TextButton
          disabled={disabled}
          className="sendbird-channel-profile__edit"
          onClick={() => {
            if (disabled) { return; }
            setShowModal(true);
          }}
          disableUnderline
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
              onSubmit={() => setShowModal(false)}
            />
          )
        }
      </div>
    </div>
  );
}

export default ChannelProfile;

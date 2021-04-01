import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import './channel-profile.scss';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import Label, { LabelColors, LabelTypography } from '../../../ui/Label';
import EditDetailsModal from './EditDetails';
import TextButton from '../../../ui/TextButton';
import ChannelAvatar from '../../../ui/ChannelAvatar/index';

const ChannelProfile = (props) => {
  const {
    disabled,
    channel,
    userId,
    theme,
    onChannelInfoChange,
  } = props;
  const [showModal, setShowModal] = useState(false);
  const { stringSet } = useContext(LocalizationContext);

  const getChannelName = () => {
    if (channel && channel.name && channel.name !== 'Group Channel') {
      return channel.name;
    }
    if (channel && (channel.name === 'Group Channel' || !channel.name)) {
      return channel.members.map((member) => member.nickname || stringSet.NO_NAME).join(', ');
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
              onSubmit={onChannelInfoChange}
              channel={channel}
              userId={userId}
              theme={theme}
            />
          )
        }
      </div>
    </div>
  );
};

ChannelProfile.propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        nickname: PropTypes.string,
      }),
    ),
  }).isRequired,
  userId: PropTypes.string.isRequired,
  theme: PropTypes.string,
  disabled: PropTypes.bool,
  onChannelInfoChange: PropTypes.func,
};

ChannelProfile.defaultProps = {
  theme: 'light',
  disabled: false,
  onChannelInfoChange: () => { },
};

export default ChannelProfile;

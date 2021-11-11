import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { LocalizationContext } from '../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../Label';
import IconButton from '../IconButton';

import './index.scss';
import Avatar from '../Avatar/index';

export default function ChannelHeader({
  user,
  renderHeader,
  iconButton,
  onEdit,
  allowProfileEdit,
}) {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div
      className={[
        'sendbird-channel-header',
        allowProfileEdit ? 'sendbird-channel-header--allow-edit' : '',
      ].join(' ')}
    >
      {
        renderHeader
          ? renderHeader()
          : (
            <div
              className="sendbird-channel-header__title"
              role="button"
              onClick={onEdit}
              onKeyDown={onEdit}
              tabIndex="0"
            >
              <div className="sendbird-channel-header__title__left">
                <Avatar
                  width="32px"
                  height="32px"
                  src={user.profileUrl}
                  alt={user.nickname}
                />
              </div>
              <div className="sendbird-channel-header__title__right">
                <Label
                  className="sendbird-channel-header__title__right__name"
                  type={LabelTypography.SUBTITLE_2}
                  color={LabelColors.ONBACKGROUND_1}
                >
                  {user.nickname || stringSet.NO_NAME}
                </Label>
                <Label
                  className="sendbird-channel-header__title__right__user-id"
                  type={LabelTypography.BODY_2}
                  color={LabelColors.ONBACKGROUND_2}
                >
                  {user.userId}
                </Label>
              </div>
            </div>
          )
      }
      <div className="sendbird-channel-header__right-icon">
        {iconButton}
      </div>
    </div>
  );
}

ChannelHeader.propTypes = {
  user: PropTypes.shape({
    profileUrl: PropTypes.string,
    nickname: PropTypes.string,
    userId: PropTypes.string,
  }),
  renderHeader: PropTypes.func,
  iconButton: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.instanceOf(IconButton),
  ]),
  onEdit: PropTypes.func.isRequired,
  allowProfileEdit: PropTypes.bool,
};

ChannelHeader.defaultProps = {
  user: {},
  renderHeader: null,
  iconButton: null,
  allowProfileEdit: false,
};

import React, { useContext } from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import IconButton from '../../../../ui/IconButton';

import './index.scss';
import Avatar from '../../../../ui/Avatar';

interface ChannelListHeaderInterface {
  renderHeader?: (props: void) => React.ReactNode;
  renderIconButton?: (props: void) => React.ReactNode;
  onEdit?: (props: void) => void;
  allowProfileEdit?: boolean;
}

const ChannelListHeader : React.FC<ChannelListHeaderInterface> = ({
  renderHeader,
  renderIconButton,
  onEdit,
  allowProfileEdit,
}: ChannelListHeaderInterface) => {
  const sbState = useSendbirdStateContext();
  const { user } = sbState?.stores?.userStore;

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
              onClick={() => { onEdit() }}
              onKeyDown={() => { onEdit() }}
              tabIndex={0}
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
        {renderIconButton() || <IconButton />}
      </div>
    </div>
  );
}

export default ChannelListHeader;

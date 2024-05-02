import React from 'react';

import './index.scss';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import Avatar from '../../../../ui/Avatar';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import Header, { HeaderCustomProps } from '../../../../ui/Header';

export interface GroupChannelListHeaderProps extends HeaderCustomProps {
  /** @deprecated Use the props `renderMiddle` instead */
  renderTitle?: () => React.ReactElement;
  renderIconButton?: (props: void) => React.ReactElement;
  onEdit?: (props: void) => void;
  allowProfileEdit?: boolean;
}

export const GroupChannelListHeader = ({
  renderTitle,
  renderIconButton,
  onEdit,
  allowProfileEdit,
  // Header custom props
  renderLeft,
  renderMiddle,
  renderRight,
}: GroupChannelListHeaderProps) => {
  const { stores } = useSendbirdStateContext();
  const { user } = stores.userStore;

  const { stringSet } = useLocalization();
  const renderProfile = renderMiddle ?? renderTitle;

  return (
    <Header
      className={`sendbird-channel-header ${allowProfileEdit ? 'sendbird-channel-header--allow-edit' : ''}`}
      renderLeft={renderLeft}
      renderMiddle={() => (
        renderProfile?.() ?? (
          <div
            className="sendbird-channel-header__title"
            role="button"
            onClick={() => {
              onEdit?.();
            }}
            onKeyDown={() => {
              onEdit?.();
            }}
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
      )}
      renderRight={renderRight ?? renderIconButton}
    />
  );
};

export default GroupChannelListHeader;

import React, { useMemo, useEffect, useContext, useState } from 'react';

import OperatorList from '../../ModerationPanel/OperatorList';
import MemberList from '../../ModerationPanel/MemberList';
import BannedUserList from '../../ModerationPanel/BannedUserList';
import MutedMemberList from '../../ModerationPanel/MutedMemberList';

import { LocalizationContext } from '../../../../../lib/LocalizationContext';

import { IconColors, IconTypes, IconProps } from '../../../../../ui/Icon';
import Badge from '../../../../../ui/Badge';
import { Toggle } from '../../../../../ui/Toggle';
import { LabelColors, LabelTypography, type LabelProps } from '../../../../../ui/Label';

import { MenuItemAction, type MenuItemActionProps } from '../MenuItem';
import useChannelSettings from '../../../context/useChannelSettings';

const kFormatter = (num: number): string | number => {
  return Math.abs(num) > 999
    ? `${(Math.abs(num) / 1000).toFixed(1)}K`
    : num;
};

type MenuItem = {
  icon: IconProps;
  label: LabelProps;
  rightComponent?: (props: MenuItemActionProps) => React.ReactNode;
  accordionComponent?: () => React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  hideMenu?: boolean;
};

type MenuItemsByRole = {
  [key: string]: MenuItem;
};

type MenuItems = {
  operator: MenuItemsByRole;
  nonOperator: MenuItemsByRole;
};

const commonIconProps = {
  fillColor: IconColors.PRIMARY,
  width: 24,
  height: 24,
  className: 'sendbird-channel-settings__accordion-icon',
};

const commonLabelProps = {
  type: LabelTypography.SUBTITLE_1,
  color: LabelColors.ONBACKGROUND_1,
};

export const useMenuItems = (): MenuItems => {
  const [frozen, setFrozen] = useState(false);
  const { stringSet } = useContext(LocalizationContext);
  const { state: { channel, renderUserListItem } } = useChannelSettings();

  // work around for
  // https://sendbird.slack.com/archives/G01290GCDCN/p1595922832000900
  // SDK bug - after frozen/unfrozen myRole becomes "none"
  useEffect(() => {
    setFrozen(channel?.isFrozen ?? false);
  }, [channel?.isFrozen]);

  return useMemo(() => ({
    operator: {
      operators: {
        icon: { ...commonIconProps, type: IconTypes.OPERATOR },
        label: { ...commonLabelProps, children: stringSet.CHANNEL_SETTING__OPERATORS__TITLE },
        accordionComponent: () => <OperatorList renderUserListItem={renderUserListItem} />,
      },
      allUsers: {
        icon: { ...commonIconProps, type: IconTypes.MEMBERS },
        label: { ...commonLabelProps, children: stringSet.CHANNEL_SETTING__MEMBERS__TITLE },
        rightComponent: (props) => (
          <div className="sendbird-channel-settings__members">
            <Badge count={channel?.memberCount ? kFormatter(channel.memberCount) : ''}/>
            <MenuItemAction
              {...props}
            />
          </div>
        ),
        accordionComponent: () => <MemberList renderUserListItem={renderUserListItem} />,
      },
      mutedUsers: {
        icon: { ...commonIconProps, type: IconTypes.MUTE },
        label: { ...commonLabelProps, children: stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE },
        accordionComponent: () => <MutedMemberList renderUserListItem={renderUserListItem} />,
      },
      bannedUsers: {
        icon: { ...commonIconProps, type: IconTypes.BAN },
        label: { ...commonLabelProps, children: stringSet.CHANNEL_SETTING__BANNED_MEMBERS__TITLE },
        accordionComponent: () => <BannedUserList renderUserListItem={renderUserListItem} />,
      },
      freezeChannel: {
        hideMenu: channel?.isBroadcast,
        icon: { ...commonIconProps, type: IconTypes.FREEZE },
        label: { ...commonLabelProps, children: stringSet.CHANNEL_SETTING__FREEZE_CHANNEL },
        rightComponent: () => <Toggle
          className="sendbird-channel-settings__frozen-icon"
          checked={frozen}
          onChange={() => {
            if (frozen) {
              channel?.unfreeze().then(() => {
                setFrozen((prev) => !prev);
              });
            } else {
              channel?.freeze().then(() => {
                setFrozen((prev) => !prev);
              });
            }
          }}
        />,
      },
    },
    nonOperator: {
      allUsers: {
        icon: { ...commonIconProps, type: IconTypes.MEMBERS },
        label: { ...commonLabelProps, children: stringSet.CHANNEL_SETTING__MEMBERS__TITLE },
        rightComponent: (props) => (
          <div className="sendbird-channel-settings__members">
            <Badge count={channel?.memberCount ? kFormatter(channel.memberCount) : ''}/>
            <MenuItemAction
              {...props}
            />
          </div>
        ),
        accordionComponent: () => <MemberList renderUserListItem={renderUserListItem} />,
      },
    } }), [channel?.url, frozen]);
};

export default useMenuItems;

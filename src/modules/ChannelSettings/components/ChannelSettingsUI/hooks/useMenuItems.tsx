import React, { useMemo, useEffect, useContext, useState } from 'react';

import OperatorList from '../../ModerationPanel/OperatorList';
import MemberList from '../../ModerationPanel/MemberList';
import BannedUserList from '../../ModerationPanel/BannedUserList';
import MutedMemberList from '../../ModerationPanel/MutedMemberList';

import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import { IconTypes } from '../../../../../ui/Icon';
import Badge from '../../../../../ui/Badge';
import { Toggle } from '../../../../../ui/Toggle';
import { useChannelSettingsContext } from '../../../context/ChannelSettingsProvider';

import { MenuItemAction, type MenuItemActionProps } from '../MenuItem';

const kFormatter = (num: number): string | number => {
  return Math.abs(num) > 999
    ? `${(Math.abs(num) / 1000).toFixed(1)}K`
    : num;
};

type MenuItem = {
  icon: typeof IconTypes[keyof typeof IconTypes];
  label: string;
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

export const useMenuItems = (): MenuItems => {
  const [frozen, setFrozen] = useState(false);
  const { stringSet } = useContext(LocalizationContext);
  const { channel } = useChannelSettingsContext();

  // work around for
  // https://sendbird.slack.com/archives/G01290GCDCN/p1595922832000900
  // SDK bug - after frozen/unfrozen myRole becomes "none"
  useEffect(() => {
    setFrozen(channel?.isFrozen ?? false);
  }, [channel?.isFrozen]);

  return useMemo(() => ({
    operator: {
      operators: {
        icon: IconTypes.OPERATOR,
        label: stringSet.CHANNEL_SETTING__OPERATORS__TITLE,
        accordionComponent: () => <OperatorList />,
      },
      allUsers: {
        icon: IconTypes.MEMBERS,
        label: stringSet.CHANNEL_SETTING__MEMBERS__TITLE,
        rightComponent: (props) => (
          <div className="sendbird-channel-settings__members">
            <Badge count={channel?.memberCount ? kFormatter(channel.memberCount) : ''}/>
            <MenuItemAction
              {...props}
            />
          </div>
        ),
        accordionComponent: () => <MemberList />,
      },
      mutedUsers: {
        icon: IconTypes.MUTE,
        label: stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE,
        accordionComponent: () => <MutedMemberList />,
      },
      bannedUsers: {
        icon: IconTypes.BAN,
        label: stringSet.CHANNEL_SETTING__BANNED_MEMBERS__TITLE,
        accordionComponent: () => <BannedUserList />,
      },
      freezeChannel: {
        hideMenu: channel?.isBroadcast,
        icon: IconTypes.FREEZE,
        label: stringSet.CHANNEL_SETTING__FREEZE_CHANNEL,
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
        icon: IconTypes.MEMBERS,
        label: stringSet.CHANNEL_SETTING__MEMBERS__TITLE,
        rightComponent: (props) => (
          <div className="sendbird-channel-settings__members">
            <Badge count={channel?.memberCount ? kFormatter(channel.memberCount) : ''}/>
            <MenuItemAction
              {...props}
            />
          </div>
        ),
        accordionComponent: () => <MemberList />,
      },
    } }), [channel?.url, frozen]);
};

export default useMenuItems;

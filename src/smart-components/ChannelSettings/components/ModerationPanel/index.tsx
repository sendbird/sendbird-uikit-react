import './admin-panel.scss';
import React, {
  ReactElement,
  useEffect,
  useState,
  useContext,
} from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Accordion, { AccordionGroup } from '../../../../ui/Accordion';
import
Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Badge from '../../../../ui/Badge';
import Toggle from '../../../../ui/Toggle';

import OperatorList from './OperatorList';
import MemberList from './MemberList';
import BannedUserList from './BannedUserList';
import MutedMemberList from './MutedMemberList';

import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';

const kFormatter = (num: number): string|number => {
  return Math.abs(num) > 999
    ? `${(Math.abs(num) / 1000).toFixed(1)}K`
    : num;
}

export default function AdminPannel(): ReactElement {
  const [frozen, setFrozen] = useState(false);

  const { stringSet } = useContext(LocalizationContext);
  const { channel } = useChannelSettingsContext();

  // work around for
  // https://sendbird.slack.com/archives/G01290GCDCN/p1595922832000900
  // SDK bug - after frozen/unfrozen myRole becomes "none"
  useEffect(() => {
    setFrozen(channel?.isFrozen);
  }, [channel]);

  return (
    <AccordionGroup className="sendbird-channel-settings__operator">
      <Accordion
        className="sendbird-channel-settings__operators-list"
        id="operators"
        renderTitle={() => (
          <>
            <Icon
              type={IconTypes.OPERATOR}
              fillColor={IconColors.PRIMARY}
              width={24}
              height={24}
              className="sendbird-channel-settings__accordion-icon"
            />
            <Label
              type={LabelTypography.SUBTITLE_1}
              color={LabelColors.ONBACKGROUND_1}
            >
              {stringSet.CHANNEL_SETTING__OPERATORS__TITLE}
            </Label>
          </>
        )}
        renderContent={() => (
          <>
            <OperatorList />
          </>
        )}
      />
      <Accordion
        className="sendbird-channel-settings__members-list"
        id="members"
        renderTitle={() => (
          <>
            <Icon
              type={IconTypes.MEMBERS}
              fillColor={IconColors.PRIMARY}
              width={24}
              height={24}
              className="sendbird-channel-settings__accordion-icon"
            />
            <Label
              type={LabelTypography.SUBTITLE_1}
              color={LabelColors.ONBACKGROUND_1}
            >
              {stringSet.CHANNEL_SETTING__MEMBERS__TITLE}
            </Label>
            <Badge count={kFormatter(channel?.memberCount)} />
          </>
        )}
        renderContent={() => (
          <>
            <MemberList />
          </>
        )}
      />
      {
        // No muted members in broadcast channel
        !channel?.isBroadcast && (
          <Accordion
            id="mutedMembers"
            className="sendbird-channel-settings__muted-members-list"
            renderTitle={() => (
              <>
                <Icon
                  type={IconTypes.MUTE}
                  fillColor={IconColors.PRIMARY}
                  width={24}
                  height={24}
                  className="sendbird-channel-settings__accordion-icon"
                />
                <Label
                  type={LabelTypography.SUBTITLE_1}
                  color={LabelColors.ONBACKGROUND_1}
                >
                  {stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE}
                </Label>
              </>
            )}
            renderContent={() => (
              <>
                <MutedMemberList />
              </>
            )}
          />
        )
      }
      <Accordion
        className="sendbird-channel-settings__banned-members-list"
        id="bannedUsers"
        renderTitle={() => (
          <>
            <Icon
              type={IconTypes.BAN}
              fillColor={IconColors.PRIMARY}
              width={24}
              height={24}
              className="sendbird-channel-settings__accordion-icon"
            />
            <Label
              type={LabelTypography.SUBTITLE_1}
              color={LabelColors.ONBACKGROUND_1}
            >
              {stringSet.CHANNEL_SETTING__BANNED_MEMBERS__TITLE}
            </Label>
          </>
        )}
        renderContent={() => (
          <>
            <BannedUserList />
          </>
        )}
      />
      {
        // cannot freeze broadcast channel
        !channel?.isBroadcast && (
          <div className="sendbird-channel-settings__freeze">
            <Icon
              type={IconTypes.FREEZE}
              fillColor={IconColors.PRIMARY}
              width={24}
              height={24}
              className="sendbird-channel-settings__accordion-icon"
            />
            <Label
              type={LabelTypography.SUBTITLE_1}
              color={LabelColors.ONBACKGROUND_1}
            >
              {stringSet.CHANNEL_SETTING__FREEZE_CHANNEL}
            </Label>
            <Toggle
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
            />
          </div>
        )
      }
    </AccordionGroup>
  );
}

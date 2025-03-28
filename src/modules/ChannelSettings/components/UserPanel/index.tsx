import './user-panel.scss';

import React, { useState } from 'react';

import useChannelSettings from '../../context/useChannelSettings';
import { useLocalization } from '../../../../lib/LocalizationContext';

import Badge from '../../../../ui/Badge';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';

import MemberList from '../ModerationPanel/MemberList';

const kFormatter = (num: number): string|number => {
  return Math.abs(num) > 999
    ? `${(Math.abs(num) / 1000).toFixed(1)}K`
    : num;
};

const UserPanel: React.FC = () => {
  const { stringSet } = useLocalization();
  const [showAccordion, setShowAccordion] = useState(false);
  const { state: { channel } } = useChannelSettings();
  return (
    <div className='sendbird-channel-settings__user-panel'>
      <div
        className={[
          'sendbird-channel-settings__panel-item',
          'sendbird-channel-settings__members',
        ].join(' ')}
        role="switch"
        aria-checked={showAccordion}
        onKeyDown={() => setShowAccordion(!showAccordion)}
        onClick={() => setShowAccordion(!showAccordion)}
        tabIndex={0}
      >
        <Icon
          className="sendbird-channel-settings__panel-icon-left"
          type={IconTypes.MEMBERS}
          fillColor={IconColors.PRIMARY}
          height="24px"
          width="24px"
        />
        <Label
          type={LabelTypography.SUBTITLE_1}
          color={LabelColors.ONBACKGROUND_1}
        >
          {stringSet.CHANNEL_SETTING__MEMBERS__TITLE}
          <Badge
            className={'sendbird-channel-settings__badge'}
            count={channel ? kFormatter(channel?.memberCount) : ''}
          />
        </Label>
        <Icon
          className={[
            'sendbird-channel-settings__panel-icon-right',
            'sendbird-channel-settings__panel-icon--chevron',
            (showAccordion ? 'sendbird-channel-settings__panel-icon--open' : ''),
          ].join(' ')}
          type={IconTypes.CHEVRON_RIGHT}
          height="24px"
          width="24px"
        />
      </div>
      {
        showAccordion && (
          <MemberList />
        )
      }
    </div>
  );
};

/**
 * @deprecated
 * `UserPanel` is deprecated.
 * Use `@sendbird/ChannelSettings/components/ChannelSettingMenuList` instead.
 */
export default UserPanel;

import './user-panel.scss';

import React, { useContext, useState } from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import
Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Badge from '../../../../ui/Badge';

import MemberList from '../ModerationPanel/MemberList';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';

const kFormatter = (num: number): string|number => {
  return Math.abs(num) > 999
    ? `${(Math.abs(num) / 1000).toFixed(1)}K`
    : num;
};

const UserPanel: React.FC = () => {
  const { stringSet } = useContext(LocalizationContext);
  const [showAccordion, setShowAccordion] = useState(false);
  const channel = useChannelSettingsContext()?.channel;
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

export default UserPanel;

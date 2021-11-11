import React, { useContext } from 'react';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

import Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';
import Icon, {
  IconTypes,
} from '../../../../ui/Icon';
import { useOpenChannelSettings } from '../../context/OpenChannelSettingsProvider';
import OpenChannelProfile from '../OpenChannelProfile';
import DeleteChannel from '../DeleteOpenChannel';
import ParticipantsAccordion from '../ParticipantUI';
import { AccordionGroup } from '../../../../ui/Accordion';

export const copyToClipboard = (text: string): boolean => {
  // @ts-ignore: Unreachable code error
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    // @ts-ignore: Unreachable code error
    return window.clipboardData.setData('Text', text);
  }
  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
  return false;
};

export interface OperatorUIProps {
  renderChannelProfile?: () => React.ReactNode;
}

export const OperatorUI: React.FC<OperatorUIProps> = ({
  renderChannelProfile,
}: OperatorUIProps) => {
  const { stringSet } = useContext(LocalizationContext);
  const {
    onCloseClick,
    channel,
  } = useOpenChannelSettings();
  return (
    <>
      <div className="sendbird-openchannel-settings__header">
        <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>
          {stringSet.CHANNEL_SETTING__HEADER__TITLE}
        </Label>
        <Icon
          className="sendbird-openchannel-settings__close-icon"
          type={IconTypes.CLOSE}
          height="24px"
          width="24px"
          onClick={() => {
            onCloseClick();
          }}
        />
      </div>
      <div className="sendbird-openchannel-settings__profile">
        {
          renderChannelProfile?.() || (
            <OpenChannelProfile />
          )
        }
      </div>
      <div className="sendbird-openchannel-settings__url">
        <Icon
          className="sendbird-openchannel-settings__copy-icon"
          type={IconTypes.COPY}
          height="22px"
          width="22px"
          onClick={() => {
            copyToClipboard(channel?.url);
          }}
        />
        <Label
          className="sendbird-openchannel-settings__url-label"
          type={LabelTypography.CAPTION_2}
          color={LabelColors.ONBACKGROUND_2}
        >
          {stringSet.OPEN_CHANNEL_SETTINGS__OPERATOR_URL}
        </Label>
        <Label
          className="sendbird-openchannel-settings__url-value"
          type={LabelTypography.SUBTITLE_2}
        >
          {channel?.url}
        </Label>
      </div>
      <AccordionGroup>
        <ParticipantsAccordion />
      </AccordionGroup>
      <DeleteChannel />
    </>
  );
};

export default OperatorUI;

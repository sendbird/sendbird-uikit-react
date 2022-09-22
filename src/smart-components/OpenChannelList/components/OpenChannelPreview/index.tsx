import './index.scss';
import React from 'react';
import { OpenChannel } from '@sendbird/chat/openChannel';

import Avatar from '../../../../ui/Avatar';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';

interface OpenChannelPreviewProps {
  className?: string;
  isSelected?: boolean;
  channel: OpenChannel;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function OpenChannelPreview({
  className,
  isSelected,
  channel,
  onClick,
}: OpenChannelPreviewProps): React.ReactElement {
  return (
    <div
      className={`sendbird-open-channel-preview ${isSelected ? 'selected' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="sendbird-open-channel-preview__cover-image">
        <Avatar
          className="sendbird-open-channel-preview__cover-image__avatar"
          src={channel?.coverUrl}
          alt="cover-image"
          width="42px"
          height="42px"
          customDefaultComponent={() => (
            <div className="sendbird-open-channel-preview__cover-image__avatar--default">
              <Icon
                type={IconTypes.CHANNELS}
                fillColor={IconColors.CONTENT}
                width="24px"
                height="24px"
              />
            </div>
          )}
        />
      </div>
      <div className="sendbird-open-channel-preview__context">
        <div className="sendbird-open-channel-preview__context__title">
          <Label
            className={`sendbird-open-channel-preview__context__title__channel-name ${channel?.isFrozen ? 'frozen' : ''}`}
            type={LabelTypography.SUBTITLE_2}
            color={isSelected ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_1}
          >
            {channel?.name}
          </Label>
          {
            channel?.isFrozen
              ? (
                <Icon
                  className="sendbird-open-channel-preview__context__title__frozen"
                  type={IconTypes.FREEZE}
                  fillColor={IconColors.PRIMARY}
                  width="16px"
                  height="16px"
                />
              ) : ''
          }
        </div>
        <div className="sendbird-open-channel-preview__context__participants">
          <Icon
            className="sendbird-open-channel-preview__context__participants__icon"
            type={IconTypes.MEMBERS}
            fillColor={IconColors.ON_BACKGROUND_2}
            width="14px"
            height="14px"
          />
          <Label
            className="sendbird-open-channel-preview__context__participants__count"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {channel?.participantCount || '0'}
          </Label>
        </div>
      </div>
    </div>
  );
}

export default OpenChannelPreview;

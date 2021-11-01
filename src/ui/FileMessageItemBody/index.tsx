import React, { ReactElement } from 'react';
import { FileMessage } from 'sendbird';
import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';
import Icon, { IconTypes, IconColors } from '../Icon';
import TextButton from '../TextButton';
import { getClassName, getUIKitFileType, truncateString } from '../../utils';

interface Props {
  className?: string | Array<string>;
  message: FileMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
}

export default function FileMessageItemBody({
  className,
  message,
  isByMe = false,
  mouseHover = false,
}: Props): ReactElement {

  return (
    <div className={getClassName([
      className,
      'sendbird-file-message-item-body',
      isByMe ? 'outgoing' : 'incoming',
      mouseHover ? 'mouse-hover' : '',
      message?.reactions?.length > 0 ? 'reactions' : '',
    ])}>
      <div className="sendbird-file-message-item-body__file-icon">
        <Icon
          className={'sendbird-file-message-item-body__file-icon__icon'}
          type={{
            IMAGE: IconTypes.PHOTO,
            VIDEO: IconTypes.PLAY,
            AUDIO: IconTypes.FILE_AUDIO,
            GIF: IconTypes.GIF,
            OTHERS: IconTypes.FILE_DOCUMENT,
          }[getUIKitFileType(message?.type)]}
          fillColor={IconColors.PRIMARY}
          width="24px"
          height="24px"
        />
      </div>
      <TextButton
        className="sendbird-file-message-item-body__file-name"
        onClick={() => { window.open(message?.url) }}
        color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
      >
        <Label
          className="sendbird-file-message-item-body__file-name__text"
          type={LabelTypography.BODY_1}
          color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
        >
          {truncateString(message?.name || message?.url)}
        </Label>
      </TextButton>
    </div>
  );
}

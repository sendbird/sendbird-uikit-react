import './index.scss';
import React, { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import Label, { LabelTypography, LabelColors } from '../Label';
import Icon, { IconTypes, IconColors } from '../Icon';
import TextButton from '../TextButton';
import { getClassName, getUIKitFileType, truncateString } from '../../utils';
import { Colors } from '../../utils/color';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';

interface Props {
  className?: string | Array<string>;
  message: FileMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isReactionEnabled?: boolean;
  truncateLimit?: number;
}

export default function FileMessageItemBody({
  className = '',
  message,
  isByMe = false,
  mouseHover = false,
  isReactionEnabled = false,
  truncateLimit = undefined,
}: Props): ReactElement {
  const { isMobile } = useMediaQueryContext();
  const truncateMaxNum = truncateLimit || (isMobile ? 20 : undefined);
  return (
    <div className={getClassName([
      className,
      'sendbird-file-message-item-body',
      isByMe ? 'outgoing' : 'incoming',
      mouseHover ? 'mouse-hover' : '',
      (isReactionEnabled && message?.reactions?.length > 0) ? 'reactions' : '',
    ])}>
      <div className="sendbird-file-message-item-body__file-icon">
        <Icon
          className="sendbird-file-message-item-body__file-icon__icon"
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
        onClick={() => { window.open(message?.url); }}
        color={isByMe ? Colors.ONCONTENT_1 : Colors.ONBACKGROUND_1}
      >
        <Label
          className="sendbird-file-message-item-body__file-name__text"
          type={LabelTypography.BODY_1}
          color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
        >
          {truncateString(message?.name || message?.url, truncateMaxNum)}
        </Label>
      </TextButton>
    </div>
  );
}

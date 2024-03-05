import React, { RefObject } from 'react';
import { ThreadInfo } from '@sendbird/chat/message';

import './index.scss';
import Avatar from '../Avatar';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../../ui/Label';
import { useLocalization } from '../../lib/LocalizationContext';

export interface ThreadRepliesProps {
  className?: string;
  threadInfo: ThreadInfo;
  onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
}

export function ThreadReplies(
  {
    className,
    threadInfo,
    onClick,
  }: ThreadRepliesProps,
  ref?: RefObject<HTMLDivElement>,
): React.ReactElement {
  const {
    mostRepliedUsers = [],
    replyCount,
  } = threadInfo;
  const { stringSet } = useLocalization();
  return (
    <div
      className={`sendbird-ui-thread-replies ${className}`}
      role="button"
      onClick={(e) => {
        onClick(e);
        e?.stopPropagation();
      }}
      onKeyDown={(e) => {
        onClick(e);
        e?.stopPropagation();
      }}
      ref={ref}
    >
      <div className="sendbird-ui-thread-replies__user-profiles">
        {mostRepliedUsers.slice(0, 4).map((user) => {
          return (
            <Avatar
              key={user.userId}
              className="sendbird-ui-thread-replies__user-profiles__avatar"
              src={user?.profileUrl}
              alt="user profile"
              width="20px"
              height="20px"
            />
          );
        })}
        {mostRepliedUsers?.length >= 5 && (
          <div className="sendbird-ui-thread-replies__user-profiles__avatar">
            <Avatar
              className="sendbird-ui-thread-replies__user-profiles__avatar__image"
              src={mostRepliedUsers?.[4]?.profileUrl}
              alt="user profile"
              width="20px"
              height="20px"
            />
            <div className="sendbird-ui-thread-replies__user-profiles__avatar__cover" />
            <div className="sendbird-ui-thread-replies__user-profiles__avatar__plus">
              <Icon
                type={IconTypes.PLUS}
                fillColor={IconColors.WHITE}
                width="16px"
                height="16px"
              />
            </div>
          </div>
        )}
      </div>
      <Label
        className="sendbird-ui-thread-replies__reply-counts"
        type={LabelTypography.CAPTION_2}
        color={LabelColors.PRIMARY}
      >
        {
          replyCount === 1
            ? `${replyCount} ${stringSet.CHANNEL__THREAD_REPLY}`
            : `${replyCount > 99 ? stringSet.CHANNEL__THREAD_OVER_MAX : replyCount} ${stringSet.CHANNEL__THREAD_REPLIES}`
        }
      </Label>
      <Icon
        className="sendbird-ui-thread-replies__icon"
        type={IconTypes.CHEVRON_RIGHT}
        fillColor={IconColors.PRIMARY}
        width="16px"
        height="16px"
      />
    </div>
  );
}

export default React.forwardRef(ThreadReplies);

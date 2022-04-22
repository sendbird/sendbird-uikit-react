import React, { useState, useEffect, useContext } from 'react';
import SendBird from 'sendbird';
import './index.scss';

import Avatar from '../../../../ui/Avatar';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import { useChannel } from '../../context/ChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

export interface SuggestedMentionListProps {
  targetNickname: string;
  memberListQuery?: Record<string, string>;
  onUserItemClick?: (member: SendBird.User) => void;
  renderUserItem?: (member: SendBird.Member) => JSX.Element;
  disableAddMention: boolean;
}

function SuggestedMentionList(props: SuggestedMentionListProps): JSX.Element {
  const {
    targetNickname,
    // memberListQuery,
    onUserItemClick,
    renderUserItem,
    disableAddMention = false,
  } = props;
  const { config } = useSendbirdStateContext();
  const { logger } = config;
  const { currentGroupChannel } = useChannel();
  const { stringSet } = useContext(LocalizationContext);

  const [currentMemberList, setCurrentMemberList] = useState<Array<SendBird.Member>>([]);

  /* Fetch member list */
  useEffect(() => {
    if (!currentGroupChannel || !currentGroupChannel.createMemberListQuery) {
      logger.warning('SuggestedMentionList: Creating member list query failed');
      return;
    }

    const query = currentGroupChannel.createMemberListQuery();
    query.limit = 15;
    query.nicknameStartsWithFilter = targetNickname;
    // Add member list query for customization
    query.next((memberList, error) => {
      if (error) {
        logger.error('SuggestedMentionList: Fetching member list failed', error);
      }
      if (memberList.length < 1) {
        logger.info('SuggestedMentionList: Fetched member list is empty');
      }
      logger.info('SuggestedMentionList: Fetching member list succeeded', { memberListQuery: query, memberList });
      setCurrentMemberList(memberList);
    });
  }, [currentGroupChannel?.url, targetNickname]);

  return (
    <div
      className="sendbird-mention-suggest-list"
    >
      {
        disableAddMention && (
          <div className="sendbird-mention-suggest-list__notice-item">
            <Icon
              className="sendbird-mention-suggest-list__notice-item__icon"
              type={IconTypes.INFO}
              fillColor={IconColors.ON_BACKGROUND_2}
            />
            <Label
              className="sendbird-mention-suggest-list__notice-item__text"
              type={LabelTypography.SUBTITLE_2}
              color={LabelColors.ONBACKGROUND_2}
            >
              {stringSet.SUGGESTION_LIST__OVER_LIMIT}
            </Label>
          </div>
        )
      }
      {!disableAddMention && currentMemberList.map((member) => {
        if (renderUserItem) {
          return (
            <div
              className="sendbird-mention-suggest-list__user-item"
              onClick={() => onUserItemClick(member)}
            >
              {renderUserItem(member)}
            </div>
          )
        }
        return (
          <div
            className="sendbird-mention-suggest-list__user-item"
            onClick={() => onUserItemClick(member)}
          >
            <Avatar
              className="sendbird-mention-suggest-list__user-item__avatar"
              src={member?.profileUrl}
              alt="user-profile"
              width="24px"
              height="24px"
            />
            <Label
              className="sendbird-mention-suggest-list__user-item__nickname"
              type={LabelTypography.SUBTITLE_2}
              color={LabelColors.ONBACKGROUND_1}
            >
              {member?.nickname || stringSet.SUGGESTION_LIST__NO_NAME}
            </Label>
            <Label
              className="sendbird-mention-suggest-list__user-item__user-id"
              type={LabelTypography.SUBTITLE_2}
              color={LabelColors.ONBACKGROUND_2}
            >
              {member?.userId}
            </Label>
          </div>
        )
      })}
    </div>
  );
}

export default SuggestedMentionList;

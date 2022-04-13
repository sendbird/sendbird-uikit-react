import React, { useState, useEffect } from 'react';
import SendBird from 'sendbird';
import './index.scss';

import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { useChannel } from '../Channel/context/ChannelProvider';

export interface MentionableUserListProps {
  targetNickname: string;
  memberListQuery?: Record<string, string>;
  renderUserItem?: (user: SendBird.Member) => JSX.Element;
}

function MentionableUserList(props: MentionableUserListProps): JSX.Element {
  const {
    targetNickname,
    // memberListQuery,
    renderUserItem,
  } = props;
  const { config } = useSendbirdStateContext();
  const { logger } = config;
  const { currentGroupChannel } = useChannel();

  const [currentMemberList, setCurrentMemberList] = useState<Array<SendBird.Member>>([]);

  /* Fetch member list */
  useEffect(() => {
    if (!currentGroupChannel || !currentGroupChannel.createMemberListQuery) {
      logger.info('MentionableUserList: Creating member list query failed');
      return;
    }

    const query = currentGroupChannel.createMemberListQuery();
    query.limit = 15;
    query.nicknameStartsWithFilter = targetNickname;
    // Add member list query for customization
    query.next((memberList, error) => {
      if (error) {
        logger.error('MentionableUserList: Fetching member list failed', error);
      }
      if (memberList.length < 1) {
        logger.info('MentionableUserList: Fetched member list is empty');
      }
      logger.info('MentionableUserList: Fetching member list succeeded', { memberListQuery: query, memberList });
      setCurrentMemberList(memberList);
    });
  }, [currentGroupChannel?.url, targetNickname]);

  return (
    <div
      className="sendbird-mentionable-user-list"
    >
      {currentMemberList.map((member) => {
        return (
          <div style={{ display: 'block' }}>
            {
              renderUserItem ? renderUserItem(member) : member?.nickname
            }
          </div>
        )
      })}
    </div>
  );
}

export default MentionableUserList;

import React, { useState, useEffect, useContext } from 'react';
import SendBird from 'sendbird';
import './index.scss';

import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import SuggestedUserMentionItem from './SuggestedUserMentionItem';
import { useChannel } from '../../context/ChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { MAX_USER_MENTION_COUNT, MAX_USER_SUGGESTION_COUNT, USER_MENTION_TEMP_CHAR } from '../../context/const';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';

export interface SuggestedMentionListProps {
  targetNickname: string;
  memberListQuery?: Record<string, string>;
  onUserItemClick?: (member: SendBird.User) => void;
  onFocusItemChange?: (member: SendBird.User) => void;
  onFetchUsers?: (users: Array<SendBird.User>) => void;
  renderUserMentionItem?: (props: { user: SendBird.User }) => JSX.Element;
  ableAddMention: boolean;
  maxMentionCount?: number;
  maxSuggestionCount?: number;
  inputEvent?: React.KeyboardEvent<HTMLDivElement>;
}

const DEBOUNCING_TIME = 300;

function SuggestedMentionList(props: SuggestedMentionListProps): JSX.Element {
  const {
    targetNickname = '',
    // memberListQuery,
    onUserItemClick,
    onFocusItemChange,
    onFetchUsers,
    renderUserMentionItem,
    inputEvent,
    ableAddMention = true,
    maxMentionCount = MAX_USER_MENTION_COUNT,
    maxSuggestionCount = MAX_USER_SUGGESTION_COUNT,
  } = props;
  const { config, stores } = useSendbirdStateContext();
  const { logger } = config;
  const currentUserId = stores?.sdkStore?.sdk?.currentUser?.userId || '';
  const { currentGroupChannel } = useChannel();
  const { stringSet } = useContext(LocalizationContext);
  const [timer, setTimer] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [lastSearchString, setLastSearchString] = useState('');
  const [currentUser, setCurrentUser] = useState<SendBird.User>(null);
  const [mouseOverUser, setMouseOverUser] = useState<SendBird.User>(null);
  const [currentMemberList, setCurrentMemberList] = useState<Array<SendBird.Member>>([]);

  useEffect(() => {
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setSearchString(targetNickname);
      }, DEBOUNCING_TIME)
    );
  }, [targetNickname]);

  useEffect(() => {
    if (inputEvent?.key === MessageInputKeys.Enter) {
      if (currentMemberList.length > 0) {
        onUserItemClick(currentUser);
      }
    }
    if (inputEvent?.key === MessageInputKeys.ArrowUp) {
      const currentUserIndex = currentMemberList.findIndex((member) => (
        member?.userId === currentUser?.userId
      ));
      if (0 < currentUserIndex) {
        setCurrentUser(currentMemberList[currentUserIndex - 1]);
        onFocusItemChange(currentMemberList[currentUserIndex - 1]);
      }
    }
    if (inputEvent?.key === MessageInputKeys.ArrowDown) {
      const currentUserIndex = currentMemberList.findIndex((member) => (
        member?.userId === currentUser?.userId
      ));
      if (currentUserIndex < currentMemberList.length - 1) {
        setCurrentUser(currentMemberList[currentUserIndex + 1]);
        onFocusItemChange(currentMemberList[currentUserIndex + 1]);
      }
    }
  }, [inputEvent]);

  /* Fetch member list */
  useEffect(() => {
    if (!currentGroupChannel || !currentGroupChannel.createMemberListQuery || !ableAddMention) {
      logger.warning('SuggestedMentionList: Creating member list query failed');
      return;
    }
    if (lastSearchString && searchString.indexOf(lastSearchString) === 0 && currentMemberList.length === 0) {
      // Don't need to request query again
      return;
    }

    const query = currentGroupChannel.createMemberListQuery();
    query.limit = maxSuggestionCount;
    query.nicknameStartsWithFilter = searchString.slice(USER_MENTION_TEMP_CHAR.length);
    // Add member list query for customization
    query.next((memberList, error) => {
      if (error) {
        logger.error('SuggestedMentionList: Fetching member list failed', error);
      }
      if (memberList.length < 1) {
        logger.info('SuggestedMentionList: Fetched member list is empty');
      } else {
        logger.info('SuggestedMentionList: Fetching member list succeeded', { memberListQuery: query, memberList });
        setCurrentUser(memberList[0]);
      }
      setLastSearchString(searchString);
      onFetchUsers(memberList);
      setCurrentMemberList(memberList.filter((member) => currentUserId !== member?.userId));
    });
  }, [currentGroupChannel?.url, searchString]);

  return (
    <div
      className="sendbird-mention-suggest-list"
      onMouseLeave={() => {
        if (mouseOverUser) {
          setCurrentUser(mouseOverUser);
        }
      }}
    >
      {
        ableAddMention && currentMemberList?.map((member) => (
          <SuggestedUserMentionItem
            key={member?.nickname}
            member={member}
            isFocused={member?.userId === currentUser?.userId}
            onClick={() => {
              onUserItemClick(member);
            }}
            onMouseOver={() => {
              setMouseOverUser(member);
            }}
            renderUserMentionItem={renderUserMentionItem}
          />
        ))
      }
      {
        !ableAddMention && (
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
              {stringSet.MENTION_SUGGESTION_LIST__OVER_LIMIT.replace('%d', maxMentionCount)}
            </Label>
          </div>
        )
      }
    </div>
  );
}

export default SuggestedMentionList;

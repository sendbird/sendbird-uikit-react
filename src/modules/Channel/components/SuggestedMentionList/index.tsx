/* We operate the CSS files for Channel&GroupChannel modules in the GroupChannel */
import '../../../GroupChannel/components/SuggestedMentionList/index.scss';

import React, { useState, useEffect, useContext, useRef } from 'react';
import type { User } from '@sendbird/chat';
import type { Member } from '@sendbird/chat/groupChannel';

import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import SuggestedUserMentionItem from './SuggestedUserMentionItem';
import { useChannelContext } from '../../context/ChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { MAX_USER_MENTION_COUNT, MAX_USER_SUGGESTION_COUNT, USER_MENTION_TEMP_CHAR } from '../../context/const';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import uuidv4 from '../../../../utils/uuid';
import { useThreadContext } from '../../../Thread/context/ThreadProvider';
import { fetchMembersFromChannel, fetchMembersFromQuery } from './utils';

export interface SuggestedMentionListProps {
  className?: string;
  targetNickname: string;
  memberListQuery?: Record<string, string>;
  onUserItemClick?: (member: User) => void;
  onFocusItemChange?: (member: User) => void;
  onFetchUsers?: (users: Array<User>) => void;
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
  ableAddMention: boolean;
  maxMentionCount?: number;
  maxSuggestionCount?: number;
  inputEvent?: React.KeyboardEvent<HTMLDivElement>;
}

const DEBOUNCING_TIME = 300;

function SuggestedMentionList(props: SuggestedMentionListProps): JSX.Element {
  const {
    className,
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
  const currentGroupChannel = useChannelContext?.()?.currentGroupChannel;
  const currentChannel = useThreadContext?.()?.currentChannel;
  const channelInstance = currentGroupChannel || currentChannel;
  const { config, stores } = useSendbirdStateContext();
  const { logger } = config;
  const currentUserId = stores?.sdkStore?.sdk?.currentUser?.userId || '';
  const scrollRef = useRef(null);
  const { stringSet } = useContext(LocalizationContext);
  const [timer, setTimer] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [lastSearchString, setLastSearchString] = useState('');
  const [currentFocusedMember, setCurrentFocusedMember] = useState<User>(null);
  const [currentMemberList, setCurrentMemberList] = useState<Member[]>([]);

  useEffect(() => {
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setSearchString(targetNickname);
      }, DEBOUNCING_TIME),
    );
  }, [targetNickname]);

  useEffect(() => {
    if (inputEvent?.key === MessageInputKeys.Enter) {
      if (currentMemberList.length > 0) {
        onUserItemClick(currentFocusedMember);
      }
    }
    if (inputEvent?.key === MessageInputKeys.ArrowUp) {
      const currentUserIndex = currentMemberList.findIndex((member) => (
        member?.userId === currentFocusedMember?.userId
      ));
      if (0 < currentUserIndex) {
        setCurrentFocusedMember(currentMemberList[currentUserIndex - 1]);
        onFocusItemChange(currentMemberList[currentUserIndex - 1]);
      }
    }
    if (inputEvent?.key === MessageInputKeys.ArrowDown) {
      const currentUserIndex = currentMemberList.findIndex((member) => (
        member?.userId === currentFocusedMember?.userId
      ));
      if (currentUserIndex < currentMemberList.length - 1) {
        setCurrentFocusedMember(currentMemberList[currentUserIndex + 1]);
        onFocusItemChange(currentMemberList[currentUserIndex + 1]);
      }
    }
  }, [inputEvent]);

  useEffect(() => {
    if (lastSearchString && searchString.indexOf(lastSearchString) === 0 && currentMemberList.length === 0) {
      // Don't need to request query again
      return;
    }
    if (channelInstance.isSuper) {
      if (!channelInstance?.createMemberListQuery) {
        logger.warning('SuggestedMentionList: Creating member list query failed');
        return;
      }
    }
    const fetcher = channelInstance.isSuper ? fetchMembersFromQuery : fetchMembersFromChannel;
    fetcher(currentUserId, channelInstance, maxSuggestionCount, searchString.slice(USER_MENTION_TEMP_CHAR.length))
      .then(suggestingMembers => {
        if (suggestingMembers.length < 1) {
          logger.info('SuggestedMentionList: Fetched member list is empty');
        } else {
          logger.info('SuggestedMentionList: Fetching member list succeeded', { memberList: suggestingMembers });
          setCurrentFocusedMember(suggestingMembers[0]);
        }
        setLastSearchString(searchString);
        onFetchUsers(suggestingMembers);
        setCurrentMemberList(suggestingMembers);
      })
      .catch((error) => {
        if (error) {
          logger.error('SuggestedMentionList: Fetching member list failed', error);
        }
      });
  }, [
    channelInstance?.url,
    // We have to be specific like this or React would not recognize the changes in instances.
    channelInstance.members.map((member: Member) => member.nickname).join(),
    channelInstance.members.map((member: Member) => member.isActive).join(),
    searchString,
    maxSuggestionCount,
    currentUserId,
    currentMemberList.length,
    lastSearchString,
  ]);

  if (!ableAddMention && currentMemberList.length === 0) {
    return null;
  }

  return (
    <div
      className={`sendbird-mention-suggest-list ${className}`}
      key="sendbird-mention-suggest-list"
      ref={scrollRef}
    >
      {
        ableAddMention && currentMemberList?.map((member) => (
          <SuggestedUserMentionItem
            key={member?.userId || uuidv4()}
            member={member}
            isFocused={member?.userId === currentFocusedMember?.userId}
            parentScrollRef={scrollRef}
            onClick={({ member }) => {
              onUserItemClick(member);
            }}
            onMouseOver={({ member }) => {
              setCurrentFocusedMember(member);
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
              width="20px"
              height="20px"
            />
            <Label
              className="sendbird-mention-suggest-list__notice-item__text"
              type={LabelTypography.SUBTITLE_2}
              color={LabelColors.ONBACKGROUND_2}
            >
              {stringSet.MENTION_COUNT__OVER_LIMIT.replace('%d', String(maxMentionCount))}
            </Label>
          </div>
        )
      }
    </div>
  );
}

export default SuggestedMentionList;

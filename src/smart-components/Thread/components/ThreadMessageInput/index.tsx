import React, { useState, useEffect, useRef } from 'react';
import { Role } from '@sendbird/chat';
import { MutedState } from '@sendbird/chat/groupChannel';

import './index.scss';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import MessageInput from '../../../../ui/MessageInput';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import SuggestedMentionList from '../../../Channel/components/SuggestedMentionList';
import { useThreadContext } from '../../context/ThreadProvider';
import { useLocalization } from '../../../../lib/LocalizationContext';

export interface ThreadMessageInputProps {
  className?: string;
}

const ThreadMessageInput = (
  props: ThreadMessageInputProps,
  ref: React.MutableRefObject<any>,
): React.ReactElement => {
  const { className } = props;
  const { config } = useSendbirdStateContext();
  const { stringSet } = useLocalization();
  const {
    isMentionEnabled,
    isOnline,
    userMention,
  } = config;
  const {
    currentChannel,
    parentMessage,
    sendMessage,
    sendFileMessage,
    isMuted,
    isChannelFrozen,
    allThreadMessages,
  } = useThreadContext();
  const messageInputRef = useRef();

  const disabled = isMuted || (!(currentChannel?.myRole === Role.OPERATOR) && isChannelFrozen) || parentMessage === null;

  // mention
  const [mentionNickname, setMentionNickname] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentionSuggestedUsers, setMentionSuggestedUsers] = useState([]);
  const [ableMention, setAbleMention] = useState(true);
  const [messageInputEvent, setMessageInputEvent] = useState(null);
  const displaySuggestedMentionList = isOnline
    && isMentionEnabled
    && mentionNickname.length > 0
  // && !utils.isDisabledBecauseFrozen(channel)
  // && !utils.isDisabledBecauseMuted(channel);
  useEffect(() => {
    if (mentionedUsers?.length >= userMention?.maxMentionCount) {
      setAbleMention(false);
    } else {
      setAbleMention(true);
    }
  }, [mentionedUsers]);
  useEffect(() => {
    setMentionedUsers(mentionedUsers.filter(({ userId }) => {
      const i = mentionedUserIds.indexOf(userId);
      if (i < 0) {
        return false;
      } else {
        mentionedUserIds.splice(i, 1);
        return true;
      }
    }));
  }, [mentionedUserIds]);

  return (
    <div className={`sendbird-thread-message-input ${className}`}>
      {
        displaySuggestedMentionList && (
          <SuggestedMentionList
            targetNickname={mentionNickname}
            inputEvent={messageInputEvent}
            // renderUserMentionItem={renderUserMentionItem}
            onUserItemClick={(user) => {
              if (user) {
                setMentionedUsers([...mentionedUsers, user]);
              }
              setMentionNickname('');
              setSelectedUser(user);
              setMessageInputEvent(null);
            }}
            onFocusItemChange={() => {
              setMessageInputEvent(null);
            }}
            onFetchUsers={(users) => {
              setMentionSuggestedUsers(users);
            }}
            ableAddMention={ableMention}
            maxMentionCount={userMention?.maxMentionCount}
            maxSuggestionCount={userMention?.maxSuggestionCount}
          />
        )
      }
      <MessageInput
        className="sendbird-thread-message-input__message-input"
        messageFieldId="sendbird-message-input-text-field--thread"
        disabled={disabled}
        channelUrl={currentChannel?.url}
        mentionSelectedUser={selectedUser}
        isMentionEnabled={isMentionEnabled}
        ref={ref || messageInputRef}
        placeholder={
          (currentChannel?.isFrozen && !(currentChannel?.myRole === Role.OPERATOR) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED)
          || (currentChannel?.myMutedState === MutedState.MUTED && stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED_SHORT)
          || (allThreadMessages.length > 0
            ? stringSet.THREAD__INPUT__REPLY_TO_THREAD
            : stringSet.THREAD__INPUT__REPLY_IN_THREAD
          )
        }
        onStartTyping={() => {
          currentChannel?.startTyping?.();
        }}
        onSendMessage={({ message, mentionTemplate }) => {
          sendMessage({
            message: message,
            mentionedUsers,
            mentionTemplate: mentionTemplate,
            quoteMessage: parentMessage,
          });
          setMentionNickname('');
          setMentionedUsers([]);
          currentChannel?.endTyping?.();
        }}
        onFileUpload={(file) => {
          sendFileMessage(file, parentMessage);
        }}
        onUserMentioned={(user) => {
          if (selectedUser?.userId === user?.userId) {
            setSelectedUser(null);
            setMentionNickname('');
          }
        }}
        onMentionStringChange={(mentionText) => {
          setMentionNickname(mentionText);
        }}
        onMentionedUserIdsUpdated={(userIds) => {
          setMentionedUserIds(userIds);
        }}
        onKeyDown={(e) => {
          if (displaySuggestedMentionList && mentionSuggestedUsers?.length > 0
            && ((e.key === MessageInputKeys.Enter && ableMention) || e.key === MessageInputKeys.ArrowUp || e.key === MessageInputKeys.ArrowDown)
          ) {
            setMessageInputEvent(e);
            return true;
          }
          return false;
        }}
      />
    </div>
  );
}

export default React.forwardRef(ThreadMessageInput);

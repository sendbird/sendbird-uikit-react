import { UserMessage } from '@sendbird/chat/message';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import MessageInput from '../../../../ui/MessageInput';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import SuggestedMentionList from '../../../Channel/components/SuggestedMentionList';
import { useThreadContext } from '../../context/ThreadProvider';

export interface ThreadMessageInputProps {
  className?: string;
}

const ThreadMessageInput = (
  props: ThreadMessageInputProps,
  ref: React.MutableRefObject<any>,
): React.ReactElement => {
  const { className } = props;
  const { config } = useSendbirdStateContext();
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
    isOperator,
    isChannelFrozen,
  } = useThreadContext();
  const messageInputRef = useRef();

  // memo
  const disabled = useMemo(() => (
    isMuted || (!isOperator && isChannelFrozen) 
  ), [isMuted, isOperator, isChannelFrozen]);

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
        onSendMessage={(props: { message: UserMessage, mentionTemplate: string }) => {
          sendMessage({
            message: props?.message,
            mentionedUsers,
            mentionTemplate: props?.mentionTemplate,
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

import React, { useState, useContext, useEffect } from 'react';

import './message-input.scss';
import * as utils from '../../context/utils';

import MessageInput from '../../../../ui/MessageInput';
import QuoteMessageInput from '../../../../ui/QuoteMessageInput';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useChannelContext } from '../../context/ChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import SuggestedMentionList from '../SuggestedMentionList';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import VoiceMessageInputWrapper from './VoiceMessageInputWrapper';

export type MessageInputWrapperProps = {
  value?: string;
  disabled?: boolean;
  renderFileUploadIcon?: () =>  React.ReactElement;
  renderVoiceMessageIcon?: () =>  React.ReactElement;
  renderSendMessageIcon?: () =>  React.ReactElement;
  processAudio?: (audioFile: File) => Promise<File>;
};

const MessageInputWrapper = (
  props: MessageInputWrapperProps,
  ref: React.MutableRefObject<any>,
): JSX.Element => {
  const {
    value,
    renderFileUploadIcon,
    renderVoiceMessageIcon,
    renderSendMessageIcon,
  } = props;
  const propDisabled = props.disabled;
  const {
    currentGroupChannel,
    initialized,
    quoteMessage,
    sendMessage,
    sendFileMessage,
    sendVoiceMessage,
    setQuoteMessage,
    messageInputRef,
    renderUserMentionItem,
  } = useChannelContext();
  const globalStore = useSendbirdStateContext();
  const channel = currentGroupChannel;

  const {
    isOnline,
    isMentionEnabled,
    userMention,
    isVoiceMessageEnabled,
  } = globalStore?.config;
  const maxUserMentionCount = userMention?.maxMentionCount || 10;
  const maxUserSuggestionCount = userMention?.maxSuggestionCount || 15;

  const { stringSet } = useContext(LocalizationContext);
  const [mentionNickname, setMentionNickname] = useState('');
  // todo: set type
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentionSuggestedUsers, setMentionSuggestedUsers] = useState([]);
  const [ableMention, setAbleMention] = useState(true);
  const [messageInputEvent, setMessageInputEvent] = useState(null);
  const [showVoiceMessageInput, setShowVoiceMessageInput] = useState(false);
  const disabled = propDisabled
    || !initialized
    || utils.isDisabledBecauseFrozen(channel)
    || utils.isDisabledBecauseMuted(channel)
    || !isOnline;
  const isOperator = utils.isOperator(channel);
  const isBroadcast = channel?.isBroadcast;

  const displaySuggestedMentionList = isOnline
    && isMentionEnabled
    && mentionNickname.length > 0
    && !utils.isDisabledBecauseFrozen(channel)
    && !utils.isDisabledBecauseMuted(channel);

  // Reset when channel changes
  useEffect(() => {
    setMentionNickname('');
    setMentionedUsers([]);
    setMentionedUserIds([]);
    setSelectedUser(null);
    setMentionSuggestedUsers([]);
    setAbleMention(true);
    setMessageInputEvent(null);
    setShowVoiceMessageInput(false);
  }, [channel?.url]);

  useEffect(() => {
    if (mentionedUsers?.length >= maxUserMentionCount) {
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

  // broadcast channel + not operator
  if (isBroadcast && !isOperator) {
    return null;
  }
  // other conditions
  return (
    <div className={`sendbird-message-input-wrapper${showVoiceMessageInput ? '--voice-message' : ''}`}>
      {
        displaySuggestedMentionList && (
          <SuggestedMentionList
            targetNickname={mentionNickname}
            inputEvent={messageInputEvent}
            renderUserMentionItem={renderUserMentionItem}
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
            maxMentionCount={maxUserMentionCount}
            maxSuggestionCount={maxUserSuggestionCount}
          />
        )
      }
      {quoteMessage && (
        <div className="sendbird-message-input-wrapper__quote-message-input">
          <QuoteMessageInput
            replyingMessage={quoteMessage}
            onClose={() => setQuoteMessage(null)}
          />
        </div>
      )}
      {
        showVoiceMessageInput
          ? (
            // laztload
            <VoiceMessageInputWrapper
              channel={channel}
              onSubmitClick={(recordedFile, duration) => {
                sendVoiceMessage(recordedFile, duration, quoteMessage);
                setQuoteMessage(null);
                setShowVoiceMessageInput(false);
              }}
              processAudio={props.processAudio}
              onCancelClick={() => {
                setShowVoiceMessageInput(false);
              }}
            />
          )
          : (
            <MessageInput
              className="sendbird-message-input-wrapper__message-input"
              value={value}
              channelUrl={channel?.url}
              mentionSelectedUser={selectedUser}
              isMentionEnabled={isMentionEnabled}
              isVoiceMessageEnabled={isVoiceMessageEnabled}
              onVoiceMessageIconClick={() => {
                setShowVoiceMessageInput(true);
              }}
              setMentionedUsers={setMentionedUsers}
              channel={channel}
              placeholder={
                (quoteMessage && stringSet.MESSAGE_INPUT__QUOTE_REPLY__PLACE_HOLDER)
                || (utils.isDisabledBecauseFrozen(channel) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED)
                || (utils.isDisabledBecauseMuted(channel) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED)
              }
              ref={ref || messageInputRef}
              disabled={disabled}
              renderFileUploadIcon={renderFileUploadIcon}
              renderSendMessageIcon={renderSendMessageIcon}
              renderVoiceMessageIcon={renderVoiceMessageIcon}
              onStartTyping={() => {
                channel?.startTyping();
              }}
              onSendMessage={({ message, mentionTemplate }) => {
                sendMessage({
                  message,
                  quoteMessage,
                  mentionedUsers,
                  mentionTemplate,
                });
                setMentionNickname('');
                setMentionedUsers([]);
                setQuoteMessage(null);
                channel?.endTyping?.();
              }}
              onFileUpload={(file) => {
                sendFileMessage(file, quoteMessage);
                setQuoteMessage(null);
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
          )
      }
    </div>
  );
};

export default React.forwardRef(MessageInputWrapper);

import React, { useState, useContext, useEffect } from 'react';

import './message-input.scss';
import * as utils from '../../context/utils';

import MessageInput from '../../../../ui/MessageInput';
import QuoteMessageInput from '../../../../ui/QuoteMessageInput';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useChannel } from '../../context/ChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import SuggestedMentionList from '../SuggestedMentionList';

const MessageInputWrapper = (): JSX.Element => {
  const {
    currentGroupChannel,
    initialized,
    quoteMessage,
    sendMessage,
    sendFileMessage,
    setQuoteMessage,
    messageInputRef,
    renderUserMentionItem,
  } = useChannel();
  const globalStore = useSendbirdStateContext();
  const channel = currentGroupChannel;

  const { isOnline, isMentionEnabled } = globalStore?.config;

  const { stringSet } = useContext(LocalizationContext);
  const [mentionNickname, setMentionNickname] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [disableMention, setDisableMention] = useState(false);
  const disabled = !initialized
    || utils.isDisabledBecauseFrozen(channel)
    || utils.isDisabledBecauseMuted(channel)
    || !isOnline;

  const isOperator = utils.isOperator(channel);
  const { isBroadcast } = channel;

  useEffect(() => {
    if (mentionedUsers?.length >= 10) {
      setDisableMention(true);
    } else {
      setDisableMention(false);
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
    <div className="sendbird-message-input-wrapper">
      {
        (mentionNickname.length > 0) && (
          <SuggestedMentionList
            targetNickname={mentionNickname}
            renderUserMentionItem={renderUserMentionItem}
            onUserItemClick={(user) => {
              if (user) {
                setMentionedUsers([...mentionedUsers, user]);
              }
              setMentionNickname('');
              setSelectedUser(user);
            }}
            disableAddMention={disableMention}
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
      <MessageInput
        className="sendbird-message-input-wrapper__message-input"
        channelUrl={channel?.url}
        mentionSelectedUser={selectedUser}
        isMentionEnabled={isMentionEnabled}
        placeholder={
          (quoteMessage && stringSet.MESSAGE_INPUT__QUOTE_REPLY__PLACE_HOLDER)
          || (utils.isDisabledBecauseFrozen(channel) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED)
          || (utils.isDisabledBecauseMuted(channel) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED)
        }
        ref={messageInputRef}
        disabled={disabled}
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
          setMentionedUsers([]);
          setQuoteMessage(null);
          channel?.endTyping();
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
      />
    </div>
  );
}

export default React.forwardRef(MessageInputWrapper);

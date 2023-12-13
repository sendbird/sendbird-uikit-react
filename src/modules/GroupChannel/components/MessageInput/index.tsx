import './index.scss';
import React, { useState, useContext, useEffect } from 'react';

import * as utils from '../../context/utils';

import type { Nullable } from '../../../../types';
import MessageInput from '../../../../ui/MessageInput';
import QuoteMessageInput from '../../../../ui/QuoteMessageInput';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import SuggestedMentionList from '../SuggestedMentionList';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import VoiceMessageInputWrapper from './VoiceMessageInputWrapper';
import { useDirtyGetMentions } from '../../../Message/hooks/useDirtyGetMentions';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import { useHandleUploadFiles } from './useHandleUploadFiles';

export type MessageInputWrapperProps = {
  value?: string;
  disabled?: boolean;
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
};

const MessageInputWrapper = (props: MessageInputWrapperProps, ref: React.MutableRefObject<any>): Nullable<JSX.Element> => {
  const { value, renderFileUploadIcon, renderVoiceMessageIcon, renderSendMessageIcon } = props;
  const propDisabled = props.disabled;
  const {
    currentChannel,
    loading,
    sendUserMessage,
    sendFileMessage,
    sendVoiceMessage,
    sendMultipleFilesMessage,
    quoteMessage,
    setQuoteMessage,
    messageInputRef,
    renderUserMentionItem,
    isMultipleFilesMessageEnabled: moduleMultipleFilesEnabled,
  } = useGroupChannelContext();
  const globalStore = useSendbirdStateContext();
  const { isMobile } = useMediaQueryContext();

  const { isOnline, isMentionEnabled, userMention, isVoiceMessageEnabled, logger } = globalStore.config;
  const isMultipleFilesMessageEnabled = moduleMultipleFilesEnabled ?? globalStore.config.isMultipleFilesMessageEnabled;
  const maxUserMentionCount = userMention?.maxMentionCount || 10;
  const maxUserSuggestionCount = userMention?.maxSuggestionCount || 15;

  const { stringSet } = useContext(LocalizationContext);
  const [mentionNickname, setMentionNickname] = useState('');
  // todo: set type
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentionSuggestedUsers, setMentionSuggestedUsers] = useState([]);
  const [messageInputEvent, setMessageInputEvent] = useState(null);
  const [showVoiceMessageInput, setShowVoiceMessageInput] = useState(false);

  const initialized = !loading && Boolean(currentChannel);
  const disabled =
    propDisabled ||
    !initialized ||
    utils.isDisabledBecauseFrozen(currentChannel) ||
    utils.isDisabledBecauseMuted(currentChannel) ||
    !isOnline;

  const isOperator = utils.isOperator(currentChannel);
  const isBroadcast = currentChannel?.isBroadcast;

  const displaySuggestedMentionList =
    isOnline &&
    isMentionEnabled &&
    mentionNickname.length > 0 &&
    !utils.isDisabledBecauseFrozen(currentChannel) &&
    !utils.isDisabledBecauseMuted(currentChannel) &&
    !isBroadcast;

  // Reset when currentChannel changes
  useEffect(() => {
    setMentionNickname('');
    setMentionedUsers([]);
    setMentionedUserIds([]);
    setSelectedUser(null);
    setMentionSuggestedUsers([]);
    setMessageInputEvent(null);
    setShowVoiceMessageInput(false);
  }, [currentChannel?.url]);

  const mentionNodes = useDirtyGetMentions({ ref: ref || messageInputRef }, { logger });
  const ableMention = mentionNodes?.length < maxUserMentionCount;

  useEffect(() => {
    setMentionedUsers(
      mentionedUsers.filter(({ userId }) => {
        const i = mentionedUserIds.indexOf(userId);
        if (i < 0) {
          return false;
        } else {
          mentionedUserIds.splice(i, 1);
          return true;
        }
      })
    );
  }, [mentionedUserIds]);

  // MFM
  const handleUploadFiles = useHandleUploadFiles({ sendFileMessage, sendMultipleFilesMessage }, { logger });

  // broadcast currentChannel + not operator
  if (isBroadcast && !isOperator) {
    return null;
  }
  // other conditions
  return (
    <div className={`sendbird-message-input-wrapper${showVoiceMessageInput ? '--voice-message' : ''}`}>
      {displaySuggestedMentionList && (
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
      )}
      {quoteMessage && (
        <div className="sendbird-message-input-wrapper__quote-message-input">
          <QuoteMessageInput replyingMessage={quoteMessage} onClose={() => setQuoteMessage(null)} />
        </div>
      )}
      {showVoiceMessageInput ? (
        <VoiceMessageInputWrapper
          channel={currentChannel}
          onSubmitClick={(recordedFile, duration) => {
            sendVoiceMessage({ file: recordedFile }, duration);
            setQuoteMessage(null);
            setShowVoiceMessageInput(false);
          }}
          onCancelClick={() => {
            setShowVoiceMessageInput(false);
          }}
        />
      ) : (
        <MessageInput
          className="sendbird-message-input-wrapper__message-input"
          value={value}
          channel={currentChannel}
          channelUrl={currentChannel?.url}
          mentionSelectedUser={selectedUser}
          isMentionEnabled={isMentionEnabled}
          isVoiceMessageEnabled={isVoiceMessageEnabled}
          isSelectingMultipleFilesEnabled={isMultipleFilesMessageEnabled}
          onVoiceMessageIconClick={() => {
            setShowVoiceMessageInput(true);
          }}
          setMentionedUsers={setMentionedUsers}
          placeholder={
            (quoteMessage && stringSet.MESSAGE_INPUT__QUOTE_REPLY__PLACE_HOLDER) ||
            (utils.isDisabledBecauseFrozen(currentChannel) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED) ||
            (utils.isDisabledBecauseMuted(currentChannel) &&
              (isMobile ? stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED_SHORT : stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED))
          }
          ref={ref || messageInputRef}
          disabled={disabled}
          renderFileUploadIcon={renderFileUploadIcon}
          renderSendMessageIcon={renderSendMessageIcon}
          renderVoiceMessageIcon={renderVoiceMessageIcon}
          onStartTyping={() => {
            currentChannel?.startTyping();
          }}
          onSendMessage={({ message, mentionTemplate }) => {
            sendUserMessage({
              message,
              mentionedUsers,
              mentionedMessageTemplate: mentionTemplate,
            });
            setMentionNickname('');
            setMentionedUsers([]);
            setQuoteMessage(null);
            currentChannel?.endTyping?.();
          }}
          onFileUpload={(fileList) => {
            handleUploadFiles(fileList);
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
            if (
              displaySuggestedMentionList &&
              mentionSuggestedUsers?.length > 0 &&
              ((e.key === MessageInputKeys.Enter && ableMention) ||
                e.key === MessageInputKeys.ArrowUp ||
                e.key === MessageInputKeys.ArrowDown)
            ) {
              setMessageInputEvent(e);
              return true;
            }
            return false;
          }}
        />
      )}
    </div>
  );
};

export { VoiceMessageInputWrapper, VoiceMessageInputWrapperProps } from './VoiceMessageInputWrapper';

export default React.forwardRef(MessageInputWrapper);

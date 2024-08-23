import './index.scss';
import React, { useState, useEffect } from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type {
  BaseMessage,
  FileMessage,
  FileMessageCreateParams,
  MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
} from '@sendbird/chat/message';

import {
  isDisabledBecauseFrozen,
  isDisabledBecauseMessageForm,
  isDisabledBecauseMuted,
  isDisabledBecauseSuggestedReplies,
} from '../../context/utils';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import SuggestedMentionList from '../SuggestedMentionList';
import { useDirtyGetMentions } from '../../../Message/hooks/useDirtyGetMentions';
import { SendableMessageType } from '../../../../utils';
// import QuoteMessageInput from '../../../../ui/QuoteMessageInput';
// import VoiceMessageInputWrapper from './VoiceMessageInputWrapper';
import MessageInput from '../../../../ui/MessageInput';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import { useHandleUploadFiles } from './useHandleUploadFiles';

export interface MessageInputWrapperViewProps {
  // Basic
  value?: string;
  disabled?: boolean;
  // ChannelContext
  currentChannel: GroupChannel | null;
  messages: BaseMessage[];
  // isMultipleFilesMessageEnabled?: boolean;
  loading: boolean;
  // quoteMessage: SendableMessageType | null;
  // setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
  messageInputRef: React.RefObject<HTMLDivElement>;
  sendUserMessage: (params: UserMessageCreateParams) => Promise<UserMessage> | void;
  sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
  // sendVoiceMessage: (params: FileMessageCreateParams, duration: number) => Promise<FileMessage>;
  // sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
  // render
  renderUserMentionItem?: (props: { user: User }) => React.ReactElement;
  renderFileUploadIcon?: () => React.ReactElement;
  // renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
  acceptableMimeTypes?: string[];
}

export const MessageInputWrapperView = React.forwardRef((
  props: MessageInputWrapperViewProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  // Props
  const {
    currentChannel,
    messages,
    loading,
    // quoteMessage,
    // setQuoteMessage,
    messageInputRef,
    sendUserMessage,
    sendFileMessage,
    // sendVoiceMessage,
    // sendMultipleFilesMessage,
    // render
    renderUserMentionItem,
    renderFileUploadIcon,
    // renderVoiceMessageIcon,
    renderSendMessageIcon,
    acceptableMimeTypes,
    disabled,
  } = props;
  const { stringSet } = useLocalization();
  const { isMobile } = useMediaQueryContext();
  const { stores, config } = useSendbirdStateContext();
  const { isOnline, userMention, logger, groupChannel } = config;
  const sdk = stores.sdkStore.sdk;
  const { maxMentionCount, maxSuggestionCount } = userMention;

  const isBroadcast = currentChannel?.isBroadcast;
  // const isOperator = currentChannel?.myRole === 'operator';
  // const isMultipleFilesMessageEnabled = props.isMultipleFilesMessageEnabled ?? config.isMultipleFilesMessageEnabled;
  const isMentionEnabled = groupChannel.enableMention;
  const isVoiceMessageEnabled = groupChannel.enableVoiceMessage;

  // States
  const [mentionNickname, setMentionNickname] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<User[]>([]);
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [mentionSuggestedUsers, setMentionSuggestedUsers] = useState<User[]>([]);
  const [messageInputEvent, setMessageInputEvent] = useState<React.KeyboardEvent<HTMLDivElement> | null>(null);
  // const [showVoiceMessageInput, setShowVoiceMessageInput] = useState(false);

  // Conditions
  const isMessageInputDisabled = loading
    || (!currentChannel || !sdk)
    || (!sdk.isCacheEnabled && !isOnline)
    || isDisabledBecauseFrozen(currentChannel)
    || isDisabledBecauseMuted(currentChannel)
    || isDisabledBecauseSuggestedReplies(currentChannel, config.groupChannel.enableSuggestedReplies)
    || isDisabledBecauseMessageForm(messages)
    || disabled;

  const showSuggestedMentionList = !isMessageInputDisabled
    && isMentionEnabled
    && mentionNickname.length > 0
    && !isBroadcast;
  const mentionNodes = useDirtyGetMentions({ ref: (ref || messageInputRef) as any }, { logger });
  const ableMention = mentionNodes?.length < maxMentionCount;

  // Operate states
  useEffect(() => {
    setMentionNickname('');
    setMentionedUsers([]);
    setMentionedUserIds([]);
    setSelectedUser(null);
    setMentionSuggestedUsers([]);
    setMessageInputEvent(null);
    // setShowVoiceMessageInput(false);
  }, [currentChannel?.url]);
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
      }),
    );
  }, [mentionedUserIds]);

  // Callbacks
  // const handleUploadFiles = useHandleUploadFiles({
  //   sendFileMessage,
  //   sendMultipleFilesMessage,
  //   quoteMessage: quoteMessage ?? undefined,
  // }, { logger });

  // if (isBroadcast && !isOperator) {
  //   /* Only `Operator` can send messages in the Broadcast channel */
  //   return null;
  // }
  // other conditions
  return (
    <div className={'sendbird-message-input-wrapper'}>
      {showSuggestedMentionList && (
        <SuggestedMentionList
          currentChannel={currentChannel}
          targetNickname={mentionNickname}
          inputEvent={messageInputEvent ?? undefined}
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
          maxMentionCount={maxMentionCount}
          maxSuggestionCount={maxSuggestionCount}
        />
      )}
      {/* {quoteMessage && (
        <div className="sendbird-message-input-wrapper__quote-message-input">
          <QuoteMessageInput replyingMessage={quoteMessage} onClose={() => setQuoteMessage(null)} />
        </div>
      )}
      {showVoiceMessageInput ? (
        <VoiceMessageInputWrapper
          channel={currentChannel ?? undefined}
          onSubmitClick={(recordedFile, duration) => {
            sendVoiceMessage({ file: recordedFile, parentMessageId: quoteMessage?.messageId }, duration);
            setQuoteMessage(null);
            setShowVoiceMessageInput(false);
          }}
          onCancelClick={() => {
            setShowVoiceMessageInput(false);
          }}
        />
      ) : ( */}
        <MessageInput
          className="sendbird-message-input-wrapper__message-input"
          channel={currentChannel}
          channelUrl={currentChannel?.url}
          isMobile={isMobile}
          acceptableMimeTypes={acceptableMimeTypes}
          mentionSelectedUser={selectedUser}
          isMentionEnabled={isMentionEnabled}
          isVoiceMessageEnabled={isVoiceMessageEnabled}
          // isSelectingMultipleFilesEnabled={isMultipleFilesMessageEnabled}
          // onVoiceMessageIconClick={() => {
          //   setShowVoiceMessageInput(true);
          // }}
          setMentionedUsers={setMentionedUsers}
          placeholder={
            // (quoteMessage && stringSet.MESSAGE_INPUT__QUOTE_REPLY__PLACE_HOLDER)
            (isDisabledBecauseFrozen(currentChannel) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__FROZEN)
            || (isDisabledBecauseMuted(currentChannel) && (isMobile ? stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED_SHORT : stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED))
            || (isDisabledBecauseSuggestedReplies(currentChannel, config.groupChannel.enableSuggestedReplies) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__SUGGESTED_REPLIES)
            || (isDisabledBecauseMessageForm(messages) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__MESSAGE_FORM)
            || (disabled && (config.isOnline
              ? stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED
              : stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED_FOR_OFFLINE))
            || undefined
          }
          ref={(ref || messageInputRef) as any}
          disabled={isMessageInputDisabled}
          renderFileUploadIcon={renderFileUploadIcon}
          renderSendMessageIcon={renderSendMessageIcon}
          // renderVoiceMessageIcon={renderVoiceMessageIcon}
          onStartTyping={() => {
            currentChannel?.startTyping();
          }}
          onSendMessage={({ message, mentionTemplate }) => {
            sendUserMessage({
              message,
              mentionedUsers,
              mentionedMessageTemplate: mentionTemplate,
              // parentMessageId: quoteMessage?.messageId,
            });
            setMentionNickname('');
            setMentionedUsers([]);
            // setQuoteMessage(null);
            currentChannel?.endTyping?.();
          }}
          // onFileUpload={(fileList) => {
          //   handleUploadFiles(fileList);
          //   setQuoteMessage(null);
          // }}
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
              showSuggestedMentionList
              && mentionSuggestedUsers?.length > 0
              && ((e.key === MessageInputKeys.Enter && ableMention)
                || e.key === MessageInputKeys.ArrowUp
                || e.key === MessageInputKeys.ArrowDown)
            ) {
              setMessageInputEvent(e);
              return true;
            }
            return false;
          }}
        />
      {/* )} */}
    </div>
  );
});

// export { VoiceMessageInputWrapper, type VoiceMessageInputWrapperProps } from './VoiceMessageInputWrapper';

export default MessageInputWrapperView;

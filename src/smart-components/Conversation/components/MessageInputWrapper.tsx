// Logic required to handle message input rendering

import React, { useContext } from 'react';
import Sendbird, { FileMessage, UserMessage } from 'sendbird';

import './message-input-wrapper.scss';
import { RenderGroupChannelMessageInputProps } from '../../../index';
import * as utils from '../utils.js';

import MessageInput from '../../../ui/MessageInput';
import QuoteMessageInput from '../../../ui/QuoteMessageInput';
import { LocalizationContext } from '../../../lib/LocalizationContext';

interface Props {
  channel: Sendbird.GroupChannel;
  user: Sendbird.User;
  isOnline: boolean;
  initialized: boolean;
  quoteMessage?: UserMessage | FileMessage;
  onSendMessage: (quoteMessage?: UserMessage | FileMessage) => void;
  onFileUpload: (file: File, quoteMessage?: UserMessage | FileMessage) => void;
  setQuoteMessage: (message: UserMessage | FileMessage) => void;
  renderMessageInput: (renderProps: RenderGroupChannelMessageInputProps) => JSX.Element;
}

const MessageInputWrapper = ({
  channel,
  user,
  isOnline,
  initialized,
  quoteMessage,
  onSendMessage,
  onFileUpload,
  setQuoteMessage,
  renderMessageInput,
}: Props, ref: React.RefObject<HTMLInputElement>): JSX.Element => {
  const { stringSet } = useContext(LocalizationContext);
  const disabled = !initialized
    || utils.isDisabledBecauseFrozen(channel)
    || utils.isDisabledBecauseMuted(channel)
    || !isOnline;

  const isOperator = utils.isOperator(channel);
  const { isBroadcast } = channel;

  // custom message
  if (renderMessageInput) {
    return renderMessageInput({ channel, user, disabled, quoteMessage });
  }

  // broadcast channel + not operator
  if (isBroadcast && !isOperator) {
    return null;
  }

  // other conditions
  return (
    <div className="sendbird-message-input-wrapper">
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
        placeholder={
          (quoteMessage && stringSet.MESSAGE_INPUT__QUOTE_REPLY__PLACE_HOLDER)
          || (utils.isDisabledBecauseFrozen(channel) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED)
          || (utils.isDisabledBecauseMuted(channel) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED)
        }
        ref={ref}
        disabled={disabled}
        onStartTyping={() => {
          channel.startTyping();
        }}
        onSendMessage={() => {
          onSendMessage(quoteMessage);
          setQuoteMessage(null);
        }}
        onFileUpload={(file) => {
          onFileUpload(file, quoteMessage);
          setQuoteMessage(null);
        }}
      />
    </div>
  );
}

export default React.forwardRef(MessageInputWrapper);

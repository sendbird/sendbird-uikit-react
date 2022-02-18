import React, { useContext } from 'react';

import './message-input.scss';
import * as utils from '../../context/utils';

import MessageInput from '../../../../ui/MessageInput';
import QuoteMessageInput from '../../../../ui/QuoteMessageInput';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useChannel } from '../../context/ChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

const MessageInputWrapper = (): JSX.Element => {
  const {
    currentGroupChannel,
    initialized,
    quoteMessage,
    sendMessage,
    sendFileMessage,
    setQuoteMessage,
    messageInputRef,
  } = useChannel();
  const globalStore = useSendbirdStateContext();
  const channel = currentGroupChannel;

  const isOnline = globalStore?.config?.isOnline;

  const { stringSet } = useContext(LocalizationContext);
  const disabled = !initialized
    || utils.isDisabledBecauseFrozen(channel)
    || utils.isDisabledBecauseMuted(channel)
    || !isOnline;

  const isOperator = utils.isOperator(channel);
  const { isBroadcast } = channel;

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
        channelUrl={channel?.url}
        placeholder={
          (quoteMessage && stringSet.MESSAGE_INPUT__QUOTE_REPLY__PLACE_HOLDER)
          || (utils.isDisabledBecauseFrozen(channel) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED)
          || (utils.isDisabledBecauseMuted(channel) && stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED)
        }
        ref={messageInputRef}
        disabled={disabled}
        onStartTyping={() => {
          channel.startTyping();
        }}
        onSendMessage={() => {
          sendMessage(quoteMessage);
          setQuoteMessage(null);
        }}
        onFileUpload={(file) => {
          sendFileMessage(file, quoteMessage);
          setQuoteMessage(null);
        }}
      />
    </div>
  );
}

export default React.forwardRef(MessageInputWrapper);

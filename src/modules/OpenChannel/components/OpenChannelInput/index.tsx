import React, { useContext } from 'react';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import MessageInput from '../../../../ui/MessageInput';
import { useOpenChannelContext } from '../../context/OpenChannelProvider';

export type MessageInputWrapperProps = {
  value?: string;
};

const MessageInputWrapper = (props: MessageInputWrapperProps, ref: React.RefObject<HTMLInputElement>): React.ReactNode => {
  const {
    currentOpenChannel,
    disabled,
    handleSendMessage,
    handleFileUpload,
    amIMuted,
  } = useOpenChannelContext();

  const channel = currentOpenChannel;
  if (!channel) {
    return null;
  }

  const { stringSet } = useContext(LocalizationContext);
  const { value } = props;

  function getPlaceHolderString() {
    if (amIMuted) {
      return stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED;
    }
    if (disabled) {
      return stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED;
    }
    return '';
  }

  return (
    <div className="sendbird-openchannel-footer">
      <MessageInput
        ref={ref}
        value={value}
        disabled={disabled}
        isVoiceMessageEnabled={false}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        placeholder={getPlaceHolderString()}
      />
    </div>
  );
};

export default React.forwardRef(MessageInputWrapper);

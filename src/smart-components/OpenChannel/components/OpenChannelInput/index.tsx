import React, { useContext } from 'react';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import MessageInput from '../../../../ui/MessageInput';
import { useOpenChannelContext } from '../../context/OpenChannelProvider';

export type MessageInputWrapperProps = {
  value?: string;
};

const MessageInputWrapper = (props: MessageInputWrapperProps, ref: React.RefObject<HTMLInputElement>): JSX.Element => {
  const {
    currentOpenChannel,
    disabled,
    handleSendMessage,
    handleFileUpload,
  } = useOpenChannelContext();

  const channel = currentOpenChannel;
  if (!channel) {
    return;
  }

  const { stringSet } = useContext(LocalizationContext);
  const { value } = props;

  return (
    <div className="sendbird-openchannel-footer">
      <MessageInput
        ref={ref}
        value={value}
        disabled={disabled}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        placeholder={(
          disabled
          && stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED
          // add disabled because of muted state
        )}
      />
    </div>
  );
};

export default React.forwardRef(MessageInputWrapper);

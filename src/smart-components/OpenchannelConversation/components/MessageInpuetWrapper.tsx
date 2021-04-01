import React, { useContext } from 'react';
import Sendbird from 'sendbird';
import { RenderOpenChannelMessageInputProps } from '../../../index';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import MessageInput from '../../../ui/MessageInput';

interface Props {
  channel: Sendbird.OpenChannel;
  user: Sendbird.User;
  disabled: boolean;
  onSendMessage(): void;
  onFileUpload(file_: File): void;
  renderMessageInput?(renderProps: RenderOpenChannelMessageInputProps): JSX.Element;
}

const MessageInputWrapper = ({
  channel,
  user,
  disabled,
  onSendMessage,
  onFileUpload,
  renderMessageInput,
}: Props, ref: React.RefObject<HTMLInputElement>): JSX.Element => {
  if (!channel) {
    return;
  }

  const { stringSet } = useContext(LocalizationContext);

  if (renderMessageInput) {
    return renderMessageInput({ channel, user, disabled });
  }

  return (
    <div className="sendbird-openchannel-footer">
      <MessageInput
        ref={ref}
        disabled={disabled}
        onSendMessage={onSendMessage}
        onFileUpload={onFileUpload}
        placeholder={(
          disabled
          && stringSet.CHANNEL__MESSAGE_INPUT__PLACE_HOLDER__DISABLED
          // add disabled because of muted state
        )}
      />
    </div>
  );
};

export default React.forwardRef(MessageInputWrapper);

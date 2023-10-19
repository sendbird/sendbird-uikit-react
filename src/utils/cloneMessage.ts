import { SendableMessageType } from '.';

export const cloneMessage = (msg: SendableMessageType): SendableMessageType => {
  const message = { ...msg } as SendableMessageType;
  message.isAdminMessage = msg.isAdminMessage;
  message.isUserMessage = msg.isUserMessage;
  message.isFileMessage = msg.isFileMessage;
  message.isMultipleFilesMessage = msg.isMultipleFilesMessage;
  message.applyParentMessage = msg.applyParentMessage;
  message.applyReactionEvent = msg.applyReactionEvent;
  message.applyThreadInfoUpdateEvent = msg.applyThreadInfoUpdateEvent;
  return message;
};

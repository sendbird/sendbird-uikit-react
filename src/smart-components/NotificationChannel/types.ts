import { BaseMessage } from "@sendbird/chat/message";

export type RenderMessageProps = {
  message: BaseMessage;
}

export type renderMessage = (props: RenderMessageProps) => React.ReactElement;
export type renderMessageHeader = (props: RenderMessageProps) => React.ReactElement;

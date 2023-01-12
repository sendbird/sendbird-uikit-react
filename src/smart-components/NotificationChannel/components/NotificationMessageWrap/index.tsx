import React from "react";
import { BaseMessage } from "@sendbird/chat/message";

import { renderMessage } from "../../types";
import { MessageTemplate } from "../../_externals/react-message-template-view/src/ui";
import UnknownMessageItemBody from "../../../../ui/UnknownMessageItemBody";

type Props = {
  renderMessage?: renderMessage;
  message: BaseMessage;
}

export default function NotificationMessageWrap({
  renderMessage,
  message,
}: Props) {
  if (typeof renderMessage === 'function') {
    return renderMessage({ message });
  }
  let messageTemplate;
  try {
    messageTemplate = JSON.parse(message?.extendedMessage?.sub_data);
  } catch (error) {
    //
  }
  if (messageTemplate?.body?.items === undefined) {
    return <UnknownMessageItemBody message={message} />;
  }
  return (
    <div>
      <MessageTemplate templateItems={messageTemplate?.body?.items} />
    </div>
  )
}

import React from "react";
import { NotficationChannelContextProps, NotficationChannelProvider } from "./context/NotificationChannelProvider";
import NotificationChannelUI, { NotificationChannelUIProps } from "./components/NotificationChannelUI";

export interface NotificationChannelProps extends NotificationChannelUIProps, NotficationChannelContextProps {}
export default function NotificationChannel(props: NotificationChannelProps) {
  const {
    channelUrl,
    messageListParams,
    ...uiProps
  } = props;
  return (
    <NotficationChannelProvider
      channelUrl={channelUrl}
      messageListParams={messageListParams}
    >
      <NotificationChannelUI
        {...uiProps}
      />
    </NotficationChannelProvider>
  )
}

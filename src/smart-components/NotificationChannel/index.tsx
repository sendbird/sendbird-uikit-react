import React from "react";
import { NotficationChannelContextProps, NotficationChannelProvider } from "./context/NotificationChannelProvider";
import NotificationChannelUI, { NotificationChannelUIProps } from "./components/NotificationChannelUI";

export interface NotificationChannelProps extends NotificationChannelUIProps, NotficationChannelContextProps {}
export default function NotificationChannel(props: NotificationChannelProps) {
  return (
    <NotficationChannelProvider
      channelUrl={props?.channelUrl}
    >
      <NotificationChannelUI
        {...props}
      />
    </NotficationChannelProvider>
  )
}

import React from "react";
import { NotficationChannelContextProps, NotficationChannelProvider } from "./context/NotificationChannelProvider";
import NotificationChannelUI, { NotificationChannelUIProps } from "./components/NotificationChannelUI";

export interface NotificationChannelProps extends NotificationChannelUIProps, NotficationChannelContextProps {}
export default function NotificationChannel(props: NotificationChannelProps): JSX.Element {
  const {
    channelUrl,
    messageListParams,
    lastSeen,
    handleWebAction,
    handleCustomAction,
    handlePredefinedAction,
    ...uiProps
  } = props;
  return (
    <NotficationChannelProvider
      channelUrl={channelUrl}
      lastSeen={lastSeen}
      messageListParams={messageListParams}
      handleWebAction={handleWebAction}
      handleCustomAction={handleCustomAction}
      handlePredefinedAction={handlePredefinedAction}
    >
      <NotificationChannelUI
        {...uiProps}
      />
    </NotficationChannelProvider>
  )
}

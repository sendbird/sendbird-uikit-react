import React, { useRef, useState } from "react";

import Sendbird from "../../../../lib/Sendbird";

import Channel from "../index";
import { getSdk, getSendUserMessage } from "../../../../lib/selectors";
import withSendBird from "../../../../lib/SendbirdSdkContext";

export default { title: "ruangkelas/Smart Components/Channel" };

// const appId = process.env.STORYBOOK_APP_ID;
// const userId = process.env.STORYBOOK_USER_ID;
// const channelUrl = process.env.STORYBOOK_GROUP_ID;

const appId = "4DE1DD00-7D88-4F55-9C38-F368054928B3";
const userId = "HENDRI2552"; //"JILLYU9G79PUXOHK";
const channelUrl = "LMS-CR-ARHSS4XK3RP1R0HQ";

const frozenAppId = process.env.STORYBOOK_FROZEN_APP_ID;
const frozenUserId = process.env.STORYBOOK_FROZEN_USER_ID;
const frozenChannelUrl = process.env.STORYBOOK_FROZEN_GROUP_ID;

export const IndependantChannel = () => (
  <Sendbird appId={appId} userId={userId}>
    <div style={{ height: "100vh" }}>
      <Channel channelUrl={channelUrl} />
    </div>
  </Sendbird>
);

export const RenderMessageByType = () => (
  <Sendbird
    appId={appId}
    userId={userId}
  >
    <div style={{ height: "100vh" }}>
      <Channel
        channelUrl={channelUrl}
        renderCustomMessage={(message, channel) => {
          if (message.messageType === "user") {
            return () => <div style={{ color: "red" }}>{message.message}</div>;
          }
        }}
      />
    </div>
  </Sendbird>
);

export const FrozenChannel = () => (
  <Sendbird
    appId={frozenAppId}
    userId={frozenUserId}
  >
    <div style={{ height: "100vh" }}>
      <Channel channelUrl={frozenChannelUrl} />
    </div>
  </Sendbird>
);

const MyCustomChatMessage = ({
  message,
  onDeleteMessage,
  onUpdateMessage,
  channel,
}) => (
  <div>
    {channel.url}
    {message.message}
    <button
      onClick={() => {
        const onDeleteCb = () => {
          console.warn("message deleted");
        };
        onDeleteMessage(message, onDeleteCb);
      }}
    >
      delete
    </button>
    <button
      onClick={() => {
        const onUpdateCb = () => {
          console.warn("message updated");
        };
        onUpdateMessage(
          message.messageId,
          Math.random().toString(),
          onUpdateCb
        );
      }}
    >
      update
    </button>
  </div>
);
export const CustomChatItem = () => (
  <Sendbird appId={appId} userId={userId}>
    <div style={{ height: "500px" }}>
      <Channel channelUrl={channelUrl} renderChatItem={MyCustomChatMessage} />
    </div>
  </Sendbird>
);

const CustomChatHeader = ({ channel, user }) => (
  <div style={{ border: "1px solid red" }}>
    {channel.name} / {user.nickname}
  </div>
);

const CustomInput = ({ channel, user, sendMessage, sdk, disabled }) => {
  const ref = useRef();
  return (
    <>
      <input
        disabled={disabled}
        onChange={() => {
          channel.startTyping();
        }}
        ref={ref}
      />
      <button
        onClick={() => {
          const value = ref.current.value;
          const params = new sdk.UserMessageParams();
          params.message = value;
          sendMessage(channel.url, params);
          ref.current.value = "";
        }}
      >
        send
      </button>
    </>
  );
};

const CustomInputWithSendbird = withSendBird(CustomInput, (state) => {
  const sendMessage = getSendUserMessage(state);
  const sdk = getSdk(state);
  return {
    sendMessage,
    sdk,
  };
});

export const CustomHeaderAndInput = () => (
  <Sendbird appId={appId} userId={userId}>
    <div style={{ height: "500px" }}>
      <Channel
        channelUrl={channelUrl}
        renderChatHeader={CustomChatHeader}
        renderMessageInput={CustomInputWithSendbird}
      />
    </div>
  </Sendbird>
);

const ChannelWithOnBeforeActions = ({ sdk }) => (
  <div style={{ height: "520px" }}>
    <Channel
      channelUrl={channelUrl}
      onBeforeSendUserMessage={(text) => {
        const params = new sdk.UserMessageParams();
        params.message = text + "extra message";
        params.data = "DATA";
        return params;
      }}
      onBeforeSendFileMessage={(file) => {
        const params = new sdk.FileMessageParams();
        params.file = file;
        params.data = "DATA";
        return params;
      }}
      onBeforeUpdateUserMessage={(text) => {
        const params = new sdk.UserMessageParams();
        params.message = text + "upadte";
        params.data = "DATA";
        return params;
      }}
    />
  </div>
);

const ConnectedChannel = withSendBird(ChannelWithOnBeforeActions, (store) => ({
  sdk: getSdk(store),
}));

export const OnBeforeActionsChannel = () => (
  <Sendbird appId={appId} userId={userId}>
    <ConnectedChannel />
  </Sendbird>
);

export const DeprecatedQueryParamsForChannel = () => (
  <Sendbird appId={appId} userId={userId}>
    <div style={{ height: "520px" }}>
      <Channel
        channelUrl={channelUrl}
        queries={{
          messageListQuery: {
            prevResultSize: 10,
            includeParentMessageText: true,
            includeReaction: false,
          },
        }}
      />
    </div>
  </Sendbird>
);

export const QueryParamsForChannel = () => {
  const [customQuery, setCustomQuery] = useState(false);
  const query = {
    messageListParams: {
      prevResultSize: 10,
      includeParentMessageText: true,
      includeReaction: false,
      senderUserIds: ["hoon302"],
    },
  };
  return (
    <Sendbird appId={appId} userId={userId}>
      <button
        onClick={() => {
          setCustomQuery(true);
        }}
      >
        Click to change query
      </button>
      <div style={{ height: "520px" }}>
        <Channel channelUrl={channelUrl} queries={customQuery ? query : {}} />
      </div>
    </Sendbird>
  );
};

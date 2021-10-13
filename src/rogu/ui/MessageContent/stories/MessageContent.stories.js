import React from "react";

import MessageContent from "../index.tsx";

import SendbirdProvider from "../../../../lib/Sendbird";
import { MenuRoot } from "../../../../ui/ContextMenu";

import COLOR_SET from "../../../../../__mocks__/themeMock";
import {
  BASIC_MESSAGE_A_1,
  BASIC_MESSAGE_A_2,
  BASIC_MESSAGE_A_3,
  USER_ID_A,
} from "../../../../../__mocks__/messagesMock";

export default { title: "ruangkelas/UI Components/MessageContent" };

export const Basic = () => (
  <SendbirdProvider colorSet={COLOR_SET}>
    <div style={{ backgroundColor: "#F1F7FF", padding: "1rem" }}>
      <MessageContent
        userId={"random-user-id"}
        channel={{
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 10,
          getUndeliveredMemberCount: (_) => 0,
        }}
        message={BASIC_MESSAGE_A_1}
      />

      <MessageContent
        userId={USER_ID_A}
        channel={{
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 10,
          getUndeliveredMemberCount: (_) => 0,
        }}
        message={BASIC_MESSAGE_A_1}
      />

      <MenuRoot />
    </div>
  </SendbirdProvider>
);

export const Chaining = () => (
  <SendbirdProvider colorSet={COLOR_SET}>
    <div style={{ backgroundColor: "#F1F7FF", padding: "1rem" }}>
      <MessageContent
        userId={"user-random-xxx"}
        message={BASIC_MESSAGE_A_1}
        chainTop={false}
        chainBottom={true}
        channel={{
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 10,
          getUndeliveredMemberCount: (_) => 0,
        }}
      />
      <MessageContent
        userId={"user-random-xxx"}
        message={BASIC_MESSAGE_A_2}
        chainTop={true}
        chainBottom={true}
        channel={{
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 10,
          getUndeliveredMemberCount: (_) => 0,
        }}
      />
      <MessageContent
        userId={"user-random-xxx"}
        message={BASIC_MESSAGE_A_3}
        chainTop={true}
        chainBottom={false}
        channel={{
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 10,
          getUndeliveredMemberCount: (_) => 0,
        }}
      />
      <MessageContent
        userId={USER_ID_A}
        message={BASIC_MESSAGE_A_1}
        chainTop={false}
        chainBottom={true}
        channel={{
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 10,
          getUndeliveredMemberCount: (_) => 0,
        }}
      />
      <MessageContent
        userId={USER_ID_A}
        message={BASIC_MESSAGE_A_2}
        chainTop={true}
        chainBottom={true}
        channel={{
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 10,
          getUndeliveredMemberCount: (_) => 0,
        }}
      />
      <MessageContent
        userId={USER_ID_A}
        message={BASIC_MESSAGE_A_3}
        chainTop={true}
        chainBottom={false}
        channel={{
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 10,
          getUndeliveredMemberCount: (_) => 0,
        }}
      />
      <MenuRoot />
    </div>
  </SendbirdProvider>
);

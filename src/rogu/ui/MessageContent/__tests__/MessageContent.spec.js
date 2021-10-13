import React from "react";
import renderer from "react-test-renderer";

import MessageContent from "../index";

import { BASIC_MESSAGE_A_1 } from "../../../../../__mocks__/messagesMock";

// TODO: add more test cases
describe("MessageContent", () => {
  it("should do a snapshot test of the MessageContent DOM", function () {
    const component = renderer.create(
      <MessageContent
        userId={"random-user-id"}
        channel={{
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 10,
          getUndeliveredMemberCount: (_) => 0,
        }}
        message={BASIC_MESSAGE_A_1}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import React from "react";
import { render } from "@testing-library/react";

import Word from "../index";
import { SendbirdSdkContext } from "../../../lib/SendbirdSdkContext";

describe("ui/Word", () => {
  it("should do a snapshot test of the Word DOM", function () {
    const { asFragment } = render(
      <SendbirdSdkContext.Provider value={{}}>
        <Word
          word="hello@{hoon}"
          message={{
            mentionedUsers: [{ userId: "hoon", nickname: "Hoon Baek" }],
          }}
        />
      </SendbirdSdkContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

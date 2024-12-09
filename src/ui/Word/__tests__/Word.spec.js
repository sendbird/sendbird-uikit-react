import React from "react";
import { render, renderHook } from "@testing-library/react";

import Word from "../index";
import useSendbird from "../../../lib/Sendbird/context/hooks/useSendbird";
import { SendbirdContext } from "../../../lib/Sendbird/context/SendbirdContext";

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
  useSendbird: jest.fn(),
}));

describe("ui/Word", () => {
  beforeEach(() => {
    const stateContextValue = {
      state: {
        config: {
          userId: 'hoon',
        },
        stores: {
          sdkStore: {
            sdk: {}
          }
        }
      }
    }
    useSendbird.mockReturnValue(stateContextValue);
    renderHook(() => useSendbird());
  })

  it("should do a snapshot test of the Word DOM", function () {
    const { asFragment } = render(
      <SendbirdContext.Provider value={{}}>
        <Word
          word="hello@{hoon}"
          message={{
            mentionedUsers: [{ userId: "hoon", nickname: "Hoon Baek" }],
          }}
        />
      </SendbirdContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

import renderToString from "../renderToString";

describe("ui/MentionUserLabel/renderToString", () => {
  it("should render userId and nickname as expected", () => {
    const userId = "me";
    const nickname = "nickname";
    const expected = `<span contenteditable="false" class="sendbird-mention-user-label" data-sb-mention="true" data-userid="me">nickname</span>`;
    const result = renderToString({ userId, nickname });
    expect(result).toEqual(expected);
  });
});

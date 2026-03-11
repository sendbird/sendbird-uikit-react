import renderToString from "../renderToString";

describe("ui/MentionUserLabel/renderToString", () => {
  it("should render userId and nickname as expected", () => {
    const userId = "me";
    const nickname = "nickname";
    const expected = `<span contenteditable=\"false\" data-userid=\"me\" data-sb-mention=\"true\" class=\"sendbird-mention-user-label\">${nickname}</span>`;
    const result = renderToString({ userId, nickname });
    expect(result).toEqual(expected);
  });
});

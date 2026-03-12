import renderToString from "../renderToString";

describe("ui/MentionUserLabel/renderToString", () => {
  it("should render userId and nickname as expected", () => {
    const userId = "me";
    const nickname = "nickname";
    const result = renderToString({ userId, nickname });

    const container = document.createElement("div");
    container.innerHTML = result;
    const span = container.firstElementChild;

    expect(span).not.toBeNull();
    expect(span.tagName).toBe("SPAN");
    expect(span.textContent).toBe(nickname);
    expect(span.getAttribute("contenteditable")).toBe("false");
    expect(span.getAttribute("data-userid")).toBe(userId);
    expect(span.getAttribute("data-sb-mention")).toBe("true");
    expect(span.getAttribute("class")).toBe("sendbird-mention-user-label");
  });
});

import React from 'react';
import { render } from '@testing-library/react';

import OpenchannelConversationHeader from "../index";

describe('ui/OpenchannelConversationHeader', () => {
  it('should render default elements', function() {
    const { container } = render(<OpenchannelConversationHeader />);
    expect(
      container.getElementsByClassName('sendbird-openchannel-conversation-header__left__cover-image--icon').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-conversation-header__left__cover-image').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-conversation-header__left__title').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-conversation-header__left__sub-title').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-conversation-header__right').length
    ).toBe(1);
  });

  it('should render default elements', function() {
    const title = "Open Channel Title";
    const subTitle = "Open Channel Subtitle";
    const { container } = render(
      <OpenchannelConversationHeader
        title={title}
        subTitle={subTitle}
        coverImage="https://static.sendbird.com/sample/user_sdk/user_sdk_20.png"
      />
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-conversation-header__left__cover-image--icon').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-conversation-header__left__cover-image').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-conversation-header__left__title').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-conversation-header__left__sub-title').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-conversation-header__right').length
    ).toBe(1);
  });

  it('should do a snapshot test of the OpenchannelConversationHeader DOM', function() {
    const { asFragment } = render(
      <OpenchannelConversationHeader
        title="Open Channel Title"
        subTitle="Open Channel Subtitle"
        coverImage="https://static.sendbird.com/sample/user_sdk/user_sdk_20.png"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

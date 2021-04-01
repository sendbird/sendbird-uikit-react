import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import OpenchannelConversationHeader from "../index";

describe('OpenchannelConversationHeader', () => {
  it('should render default elements', function() {
    const component = mount(<OpenchannelConversationHeader />);
    expect(
      component.find('.sendbird-openchannel-conversation-header__left__cover-image--icon').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-conversation-header__left__cover-image').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-conversation-header__left__title').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-conversation-header__left__sub-title').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-conversation-header__right').exists()
    ).toBe(true);
  });

  it('should render default elements', function() {
    const title = "Open Channel Title";
    const subTitle = "Open Channel Subtitle";
    const triggerClassName = "information-trigger";
    const component = mount(
      <OpenchannelConversationHeader
        title={title}
        subTitle={subTitle}
        coverImage="https://static.sendbird.com/sample/user_sdk/user_sdk_20.png"
      />
    );
    expect(
      component.find('.sendbird-openchannel-conversation-header__left__cover-image--icon').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-openchannel-conversation-header__left__cover-image').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-conversation-header__left__title').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-conversation-header__left__sub-title').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-openchannel-conversation-header__right').exists()
    ).toBe(true);
  });

  it('should do a snapshot test of the OpenchannelConversationHeader DOM', function() {
    const component = renderer.create(
      <OpenchannelConversationHeader
        title="Open Channel Title"
        subTitle="Open Channel Subtitle"
        coverImage="https://static.sendbird.com/sample/user_sdk/user_sdk_20.png"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

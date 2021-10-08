import React from 'react';
import { shallow } from 'enzyme';

import MessageInput from "../index";

const noop = () => {};

describe('MessageInput', () => {
  it('should render upload icon if no text is present', () => {
    const component = shallow(
      <MessageInput onSendMessage={noop} value="" />
    );
    // TODO: complete the test case
    // expect(
    //   component.find('.sendbird-message-input--send').exists()
    // ).toBe(false);
    expect(
      component.find('.sendbird-message-input--attach').exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-input--edit-action').exists()
    ).toBe(false);
  });

  it('should render send icon if text is present', () => {
    const component = shallow(
      <MessageInput onSendMessage={noop} value="example" />
    );
    expect(
      component.find('.sendbird-message-input--send').exists()
    ).toBe(true);
    // TODO: complete the test case
    // expect(
    //   component.find('.sendbird-message-input--attach').exists()
    // ).toBe(false);
    expect(
      component.find('.sendbird-message-input--edit-action').exists()
    ).toBe(false);
  });

  it('should display save/cancel button on edit mode', () => {
    const component = shallow(
      <MessageInput onSendMessage={noop} value="" isEdit />
    );
    expect(
      component.find('.sendbird-message-input--send').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-input--attach').exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-input--edit-action').exists()
    ).toBe(true);
  });
});

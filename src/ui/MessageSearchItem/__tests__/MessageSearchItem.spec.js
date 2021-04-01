import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import MessageSearchItem from "../index";
import { generateNormalMessage } from '../messageDummyDate.mock';

jest.mock('date-fns/format', () => () => ('mock-date'));


describe('MessageSearchItem', () => {
  it('should render necessary elements', function () {
    const className = 'class-name';
    const component = mount(
      <MessageSearchItem
        className={className}
        message={generateNormalMessage()}
      />,
    );

    expect(
      component.find(`.${className}`).hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-search-item__left__sender-avatar').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-search-item__right__sender-name').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-search-item__right__message-text').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-search-item__right__message-created-at').hostNodes().exists()
    ).toBe(true);
  });

  it('should do a snapshot test of the MessageSearchItem DOM', function () {
    const text = "example-text";
    const component = renderer.create(
      <MessageSearchItem
        className={text}
        message={generateNormalMessage()}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

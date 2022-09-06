import React from 'react';
import { render, screen } from '@testing-library/react';

import MessageSearchItem from "../index";
import { generateNormalMessage } from '../messageDummyDate.mock';

jest.mock('date-fns/format', () => () => ('mock-date'));


describe('ui/MessageSearchItem', () => {
  it('should render necessary elements', function () {
    const className = 'class-name';
    const { container } = render(
      <MessageSearchItem
        className={className}
        message={generateNormalMessage()}
      />
    );
    expect(
      container.getElementsByClassName(className).length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-message-search-item__left__sender-avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-message-search-item__right__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-message-search-item__right__message-text').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-message-search-item__right__message-created-at').length
    ).toBe(1);
  });

  it('should do a snapshot test of the MessageSearchItem DOM', function () {
    const text = "example-text";
    const { asFragment } = render(
      <MessageSearchItem
        className={text}
        message={generateNormalMessage()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '@testing-library/react';

import MessageSearchFileItem from "../index";
import {
  docMock,
  // gifMock,
  // videoMock,
  // audioMock,
  // imageMock,
} from '../mockFileMessage';

jest.mock('date-fns/format', () => () => ('mock-date'));


describe('ui/MessageSearchFileItem', () => {
  // should add test cases for each file types
  // define id for each icon svg files first
  // https://sendbird.atlassian.net/browse/UK-634

  it('should do a snapshot test of the MessageSearchFileItem DOM', function() {
    const text = "example-text";
    const { asFragment } = render(
      <MessageSearchFileItem
        className={text}
        message={docMock}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

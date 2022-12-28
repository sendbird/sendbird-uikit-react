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
import { getCreatedAt } from '../utils';

jest.useFakeTimers();
jest.setSystemTime(new Date('January 23, 2022 17:17:52'));

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

  test('utils/getCreatedAt returns time if ts is created today', () => {
    const nowTime = new Date(Date.now());
    const isPM = nowTime?.getHours() > 12;
    expect(
      getCreatedAt({ createdAt: nowTime })
    ).toBe(`${nowTime?.getHours() - (isPM ? 12 : 0)}:${nowTime?.getMinutes()} ${isPM ? 'PM' : 'AM'}`);
  });

  test('utils/getCreatedAt returns "Yesterday" if ts is created yesterday', () => {
    const nowTime = new Date(Date.now());
    nowTime.setDate(nowTime.getDate() - 1);
    expect(
      getCreatedAt({ createdAt: nowTime })
    ).toBe("Yesterday");
  })

  test('utils/getCreatedAt returns month and date if ts is created in this year', () => {
    const nowTime = new Date(Date.now());
    nowTime.setDate(nowTime.getDate() - 2);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    expect(
      getCreatedAt({ createdAt: nowTime })
    ).toBe(`${months[nowTime?.getMonth()]} ${nowTime?.getDate()}`);
    expect(
      getCreatedAt({ createdAt: nowTime })
    ).toBe('Jan 21');
  });

  test('utils/getCreatedAt returns year, month, and date if ts is created last year', () => {
    const nowTime = new Date(Date.now());
    nowTime.setFullYear(nowTime.getFullYear() - 1);
    expect(
      getCreatedAt({ createdAt: nowTime })
    ).toBe(`${nowTime?.getFullYear()}/${nowTime?.getMonth() + 1}/${nowTime?.getDate()}`);
    expect(
      getCreatedAt({ createdAt: nowTime })
    ).toBe('2021/1/23');
  });
});

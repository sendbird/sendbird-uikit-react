import React from 'react';
import { render } from '@testing-library/react';

import getCreatedAt from '../getCreatedAt';
import MessageSearchItem from "../index";
import { generateNormalMessage } from '../messageDummyDate.mock';

jest.useFakeTimers();
jest.setSystemTime(new Date('January 23, 2022 17:17:52'));

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

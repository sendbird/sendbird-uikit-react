import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import ChatHeader from "../index";
import { LabelStringSet } from '../../Label';
const title = "Headline 2";
const subTitle = "Body text 2";
jest.useFakeTimers();

describe('ChatHeader', () => {
  it('should do a snapshot test of the ChatHeader DOM', function () {
    const component = renderer.create(
      <ChatHeader title={title} subTitle={subTitle} isActive="true" isMuted="true" />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should have each components in the ChatHeader', function () {
    const component = mount(
      <ChatHeader
        title={title}
        subTitle={subTitle}
        isActive="true"
        isMuted="true"
      />
    );

    expect(
      // https://github.com/airbnb/enzyme/issues/836
      component.find('.sendbird-chat-header__left__title').hostNodes().text()
    ).toEqual(title);

    expect(
      component.find('.sendbird-chat-header__left__subtitle').hostNodes().text()
    ).toEqual(subTitle);


    expect(
      component.find('.sendbird-chat-header__right__mute').exists()
    ).toBeTruthy();

    expect(
      component.find('.sendbird-chat-header__right__info').exists()
    ).toBeTruthy();
  });

  it('should not have components in the ChatHeader', function () {
    const component = mount(
      <ChatHeader />
    );

    expect(
      component.find('.sendbird-chat-header__left__title').hostNodes().text()
    ).toEqual(LabelStringSet.NO_TITLE);

    expect(
      component.find('.sendbird-chat-header__left__subtitle').hostNodes().text()
    ).toEqual('');

    expect(
      component.find('.sendbird-chat-header__right__mute').exists()
    ).toBeFalsy();

    expect(
      component.find('.sendbird-chat-header__right__info').exists()
    ).toBeTruthy();
  });
});

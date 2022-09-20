import React from 'react';
import { render, screen } from '@testing-library/react';

import ChatHeader from "../index";
import { LabelStringSet } from '../../Label';
const title = "Headline 2";
const subTitle = "Body text 2";
jest.useFakeTimers();

describe('ui/ChatHeader', () => {
  it('should do a snapshot test of the ChatHeader DOM', function () {
    const { asFragment } = render(
      <ChatHeader
        title={title}
        subTitle={subTitle}
        isActive="true"
        isMuted="true"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should have each components in the ChatHeader', function () {
    const { container } = render(
      <ChatHeader
        title={title}
        subTitle={subTitle}
        isActive="true"
        isMuted="true"
      />
    );

    expect(screen.getByText(title).className).toContain('sendbird-chat-header__left__title');
    expect(screen.getByText(subTitle).className).toContain('sendbird-chat-header__left__subtitle');
    expect(container.querySelector('.sendbird-chat-header__right__mute').className).toContain('sendbird-icon');
    expect(container.querySelector('.sendbird-chat-header__right__info').className).toContain('sendbird-iconbutton');
  });

  it('should not have components in the ChatHeader', function () {
    const { container } = render(<ChatHeader />);

    expect(container.querySelector('.sendbird-chat-header__left__title').textContent).toBe(LabelStringSet.NO_TITLE);
    expect(container.querySelector('.sendbird-chat-header__left__subtitle').textContent).toBe('');
    expect(container.querySelector('.sendbird-chat-header__right__mute')).toBeNull();
    expect(container.querySelector('.sendbird-chat-header__right__info').className).toContain('sendbird-iconbutton');
  });
});

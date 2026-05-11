import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import MessageSearchPannel from '..';
import { LocalizationContext } from '../../../lib/LocalizationContext';

jest.mock('../components/MessageSearchUI', () => () => <div data-testid="message-search-ui">search ui</div>);
jest.mock('../context/MessageSearchProvider', () => ({
  MessageSearchProvider: (props: any) => (
    <div data-testid="message-search-provider" data-search-string={props.searchString} data-channel-url={props.channelUrl}>
      <button type="button" data-testid="loaded" onClick={props.onResultLoaded}>loaded</button>
      {props.children}
    </div>
  ),
}));

const stringSet = {
  SEARCH_IN_CHANNEL: 'Search in channel',
  SEARCH: 'Search',
};

describe('MessageSearchPannel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderPanel = (props = {}) => render(
    <LocalizationContext.Provider value={{ stringSet } as any}>
      <MessageSearchPannel
        channelUrl="channel-url"
        onResultClick={jest.fn()}
        {...props}
      />
    </LocalizationContext.Provider>,
  );

  it('updates search string after debounce, hides loading when results load, and resets input', () => {
    const { container } = renderPanel();
    const input = screen.getByPlaceholderText('Search');

    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input).toHaveValue('hello');
    expect(container.querySelector('.sendbird-message-search-pannel__input__container__spinner')).toBeNull();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByTestId('message-search-provider')).toHaveAttribute('data-search-string', 'hello');
    expect(container.querySelector('.sendbird-message-search-pannel__input__container__spinner')).toBeTruthy();

    fireEvent.click(screen.getByTestId('loaded'));
    expect(container.querySelector('.sendbird-message-search-pannel__input__container__reset-input-button')).toBeTruthy();

    fireEvent.click(container.querySelector('.sendbird-message-search-pannel__input__container__reset-input-button') as Element);
    expect(input).toHaveValue('');
    expect(screen.getByTestId('message-search-provider')).toHaveAttribute('data-search-string', '');
  });

  it('debounces only the latest input value', () => {
    renderPanel();
    const input = screen.getByPlaceholderText('Search');

    fireEvent.change(input, { target: { value: 'hello' } });
    act(() => {
      jest.advanceTimersByTime(250);
    });
    fireEvent.change(input, { target: { value: 'hello world' } });
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(screen.getByTestId('message-search-provider')).toHaveAttribute('data-search-string', '');

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(screen.getByTestId('message-search-provider')).toHaveAttribute('data-search-string', 'hello world');
  });

  it('renders header title and invokes close handler', () => {
    const onCloseClick = jest.fn();
    const { container } = renderPanel({ onCloseClick });

    expect(screen.getByText('Search in channel')).toBeInTheDocument();
    fireEvent.click(container.querySelector('.sendbird-message-search-pannel__header__close-button') as Element);
    expect(onCloseClick).toHaveBeenCalledTimes(1);
  });
});

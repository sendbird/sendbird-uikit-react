import { render } from '@testing-library/react';
import { FileViewerComponentProps, ViewerTypes } from '../types';
import { FILE_INFO_LIST } from '../data.mock';
import React from 'react';
import { DeleteButton } from '../DeleteButton';

describe('DeleteButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty component when viewerType is ViewerTypes.MULTI', () => {
    const onClickLeft = jest.fn(() => null);
    const onClickRight = jest.fn(() => null);
    const onClose = jest.fn(() => null);

    const props: FileViewerComponentProps = {
      nickname: 'hoon100',
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_34_512px.png',
      viewerType: ViewerTypes.MULTI,
      fileInfoList: FILE_INFO_LIST,
      currentIndex: 0,
      onClickLeft,
      onClickRight,
      onClose,
    };

    const className = 'sendbird-fileviewer__header__right__actions__delete';
    const { container } = render(<DeleteButton {...props} />);
    const elements = container.getElementsByClassName(`${className}`);
    expect(elements).toHaveLength(0);
  });
  it('should render component tree when viewerType is SINGLE, and message is by me', () => {
    const noop = () => { /* noop */};
    const props: FileViewerComponentProps = {
      nickname: 'hoon100',
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_34_512px.png',
      viewerType: ViewerTypes.SINGLE,
      name: 'sent-mail (1).png',
      type: 'image/png',
      url: 'https://static.sendbird.com/sample/profiles/profile_15_512px.png',
      isByMe: true,
      disableDelete: true,
      onClose: noop,
      onDelete: noop,
    };

    const className = 'sendbird-fileviewer__header__right__actions__delete';
    const { container } = render(<DeleteButton {...props} />);
    const elements = container.getElementsByClassName(`${className}`);
    expect(elements).toHaveLength(1);
  });
  it('should return empty component when viewerType is SINGLE and message is not by me', () => {
    const noop = () => { /* noop */};
    const props: FileViewerComponentProps = {
      nickname: 'hoon100',
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_34_512px.png',
      viewerType: ViewerTypes.SINGLE,
      name: 'sent-mail (1).png',
      type: 'image/png',
      url: 'https://static.sendbird.com/sample/profiles/profile_15_512px.png',
      isByMe: false,
      disableDelete: true,
      onClose: noop,
      onDelete: noop,
    };

    const className = 'sendbird-fileviewer__header__right__actions__delete';
    const { container } = render(<DeleteButton {...props} />);
    const elements = container.getElementsByClassName(`${className}`);
    expect(elements).toHaveLength(0);
  });
});

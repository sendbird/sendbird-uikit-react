import { act, render, screen, fireEvent } from '@testing-library/react';
import { FILE_INFO_LIST } from '../data.mock';
import React, { useRef } from 'react';
import { useKeyDown } from '../useKeyDown';
import { FileViewerComponentProps, MultiFilesViewer, ViewerTypes } from '../../../ui/FileViewer/types';

const testId = 'dummy';

function DummyComponent(props: FileViewerComponentProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const { onClose, onClickLeft, onClickRight } = props as MultiFilesViewer;
  const onKeyDown = useKeyDown({
    ref,
    keyDownCallbackMap: {
      Escape: (e) => onClose?.(e),
      ArrowLeft: () => onClickLeft?.(),
      ArrowRight: () => onClickRight?.(),
    },
  });
  return <div
    ref={ref}
    onKeyDown={onKeyDown}
    data-testid={testId}
  ></div>;
}

describe('useKeyDown', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call onClickLeft on keydown ArrowLeft', async () => {
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
    render(<DummyComponent {...props} />);
    const dummy = screen.getAllByTestId(testId)[0];
    expect(dummy).toBeTruthy();

    act(() => {
      fireEvent.keyDown(dummy, { key: 'ArrowLeft' });
    });

    expect(onClickLeft).toHaveBeenCalledTimes(1);
    expect(onClickRight).toHaveBeenCalledTimes(0);
    expect(onClose).toHaveBeenCalledTimes(0);
  });
  it('should call onClickRight on keydown ArrowRight', async () => {
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
    render(<DummyComponent {...props} />);
    const dummy = screen.getAllByTestId(testId)[0];
    expect(dummy).toBeTruthy();

    act(() => {
      fireEvent.keyDown(dummy, { key: 'ArrowRight' });
    });

    expect(onClickLeft).toHaveBeenCalledTimes(0);
    expect(onClickRight).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(0);
  });
  it('should call onClose on keydown Escape', async () => {
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
    render(<DummyComponent {...props} />);
    const dummy = screen.getAllByTestId(testId)[0];
    expect(dummy).toBeTruthy();

    act(() => {
      fireEvent.keyDown(dummy, { key: 'Escape' });
    });

    expect(onClickLeft).toHaveBeenCalledTimes(0);
    expect(onClickRight).toHaveBeenCalledTimes(0);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

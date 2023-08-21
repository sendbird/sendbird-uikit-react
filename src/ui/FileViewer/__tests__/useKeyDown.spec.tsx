import {renderHook, act, render, screen, fireEvent} from '@testing-library/react';
import {useKeyDown} from "../hooks/useKeyDown";
import {FileViewerComponentProps, ViewerTypes} from "../types";
import {FILE_INFO_LIST} from "../data.mock";
import React, {useRef} from "react";

export function DUMMY_COMPONENT(props: FileViewerComponentProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  renderHook(() => useKeyDown({ props, ref }));
  return <div id='dummy' ref={ref}>DUMMY</div>;
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
    const { container, baseElement, rerender } = render(<DUMMY_COMPONENT {...props}/>);
    const dummy = container.querySelector('#dummy');
    console.log('## dummy: ', dummy);
    // const keyboardState = userEvent.keyboard('[ArrowLeft>]');
    // await userEvent.keyboard('keydown', {keyboardState}) // press [KeyA] with active ctrlKey modifier
    fireEvent.keyDown(dummy, { key: "ArrowLeft" });


    // await user.click(container.querySelector('#dummy'));

    // act(() => {
    //   const event = new KeyboardEvent('keydown', {'key': 'ArrowLeft'});
    //   // document.body.dispatchEvent(event);
    //   container.querySelector('#dummy').dispatchEvent(event);
    // });

    expect(onClickLeft).toHaveBeenCalledTimes(1);
    expect(onClickRight).toHaveBeenCalledTimes(0);
    expect(onClose).toHaveBeenCalledTimes(0);
  });
});

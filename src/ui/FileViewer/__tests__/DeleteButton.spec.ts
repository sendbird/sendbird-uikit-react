import { GroupChannel } from '@sendbird/chat/groupChannel';
import { renderHook, act } from '@testing-library/react';
import {useKeyDown} from "../hooks/useKeyDown";
import useReconnectOnIdle from "../../../modules/Channel/context/hooks/useReconnectOnIdle";
import {useChannelContext} from "../../../modules/Channel/context/ChannelProvider";
import {useScrollBehavior} from "../../../modules/Channel/components/MessageList/hooks/useScrollBehavior";
import {FileViewerComponentProps, ViewerTypes} from "../types";
import {FILE_INFO_LIST} from "../data.mock";
import {useRef} from "react";

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

    const ref = useRef<HTMLDivElement>(null);

    renderHook(() => useKeyDown({ props, ref }));

    act(() => {
      const event = new KeyboardEvent('keydown', {'key': 'ArrowLeft'});
      document.dispatchEvent(event);
    });

    expect(onClickLeft).toHaveBeenCalledTimes(1);
    expect(onClickRight).toHaveBeenCalledTimes(0);
    expect(onClose).toHaveBeenCalledTimes(0);
  });
});

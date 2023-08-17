import { useState } from "react";
import { FileViewerComponentProps, ViewerTypes } from "../types";
import { noop } from "../../../utils/utils";
import { mapProps } from "./mapProps";

export function useViewerState({ props }: { props: FileViewerComponentProps }): {
  idx: number,
  incrementIdx: () => void,
  decrementIdx: () => void,
  hasNext: boolean,
  hasPrev: boolean,
  name: string,
  // maybe rename to mimeType
  type: string,
  url: string,
} {
  // you can keep the file info list in state
  // todo - reset message idx on close
  const [idx, setIdx] = useState(0);
  const { name, type, url } = mapProps({ props, idx });
  if (props.viewerType === ViewerTypes.MULTI) {
    return {
      idx,
      incrementIdx: () => {
        if (idx === props.fileInfoList.length - 1) {
          return;
        }
        setIdx((prev) => prev + 1);
      },
      decrementIdx: () => {
        if (idx === 0) {
          return;
        }
        setIdx((prev) => prev - 1);
      },
      // todo - add more state
      hasNext: false, // boolean -> implement
      hasPrev: false, // boolean -> implements
      name, // string
      type, // string
      url, // string
    };
  }
  return {
    idx,
    incrementIdx: noop,
    decrementIdx: noop,
    hasNext: false,
    hasPrev: false,
    name, // string
    type, // string
    url, // string
  };
}

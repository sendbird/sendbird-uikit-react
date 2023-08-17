import { FileInfo, FileViewerComponentProps, SingleFileViewer, ViewerType, ViewerTypes } from "../types";

/**
 * Converts file/fileinfo[] into nice props for FileViewer
 * // shouldnt even need to be a hook. maybe simplify this to a function
 */
export function mapProps({ props, idx }: {
  props: FileViewerComponentProps;
  idx: number;
}): FileInfo {
  if (props.viewerType !== ViewerTypes.SINGLE && props.viewerType !== ViewerTypes.MULTI) {
    throw new Error('FileViewer: props is required');
  }
  if (props.viewerType === ViewerTypes.MULTI) {
    const file = props.fileInfoList[idx];
    return {
      // do default props
      name: file.fileName || '',
      type: file.mimeType || '',
      url: file.url,
    };
  }
  // single
  const file = props as SingleFileViewer;
  return {
    name: file.name,
    type: file.type,
    url: file.url,
  };
}
